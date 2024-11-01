import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import base64
import httpx
from fastapi.responses import JSONResponse
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEM = asyncio.Semaphore(10)


def is_valid_url(url):
    url_regex = re.compile(r"https?://(?:www\.)?[a-zA-Z0-9./]+")
    return bool(url_regex.match(url))


def getException(statusCode):
    if statusCode == 400:
        code = 400
        message = "Please enter valid url"
    elif statusCode == 404:
        code = 404
        message = "Page you are looking for is not there"
    elif statusCode == 403:
        code = 403
        message = "You are not authorised to access this page"
    else:
        code = 500
        message = "Something went wrong. Please try again or enter some other url"
    return code, message


async def fetchUrlResources(client, url):
    try:
        response = await client.get(url)
        if response.status_code != 200:
            code, message = getException(response.status_code)
            response = {
                "message": message,
                "payload": [],
                "status": code,
            }
            return JSONResponse(status_code=code, content=response)

        htmlContent = response.text
        soup = BeautifulSoup(htmlContent, "html.parser")

        cssTasks = [
            replaceCss(client, link, urljoin(url, link["href"]), soup)
            for link in soup.find_all("link", rel="stylesheet")
        ]
        await asyncio.gather(*cssTasks)

        imgTasks = [
            replaceImages(client, img, urljoin(url, img["src"]))
            for img in soup.find_all("img", src=True)
        ]
        await asyncio.gather(*imgTasks)

        response = {
            "message": f"Page fetched successfully",
            "payload": str(soup),
            "status": 200,
        }
        return JSONResponse(status_code=200, content=response)
    except Exception as e:
        print(e)
        response = {
            "message": f"Resources of the page you are looking for is not fully available",
            "payload": [],
            "status": 500,
        }
        return JSONResponse(status_code=500, content=response)


@app.get("/fetchUrl")
async def fetchUrl(url: str):
    if not url.startswith("http"):
        url = f"https://{url}"
    if not is_valid_url(url):
        response = {
            "message": "Please enter valid url",
            "payload": [],
            "status": 400,
        }
        return JSONResponse(status_code=400, content=response)

    async with httpx.AsyncClient(timeout=5) as client:
        return await fetchUrlResources(client, url)

    async with httpx.AsyncClient(timeout=5) as client:
        return await fetchUrlResources(client, url)

    async with httpx.AsyncClient(timeout=5) as client:
        return await fetchUrlResources(client, url)


async def replaceCss(client, link, url, soup):
    async with SEM:
        try:
            response = await client.get(url)
            if response.status_code != 200:
                return
            tag = soup.new_tag("style")
            tag.string = response.text
            link.replace_with(tag)
        except httpx.RequestError:
            raise Exception("Request Error")


async def replaceImages(client, img, url):
    async with SEM:
        try:
            response = await client.get(url, timeout=5)
            if response.status_code != 200:
                return
            imgBase64 = base64.b64encode(response.content).decode("utf-8")
            img["src"] = f"data:image/{url.split('.')[-1]};base64,{imgBase64}"
        except httpx.RequestError:
            img["src"] = url

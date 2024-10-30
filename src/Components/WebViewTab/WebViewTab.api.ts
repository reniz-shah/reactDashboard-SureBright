import { BASE_URL } from "../../Constants/constants";

export const fetchUrlContent = async (url: string) => {
    const requestOptions = {
        method: "GET",
    };

    const response = await fetch(`${BASE_URL}/fetchUrl?url=${url}`, requestOptions)
    if (!response.ok) {
        throw new Error((await response.json()).message);
    }
    const resData = await response.json()
    return resData
}
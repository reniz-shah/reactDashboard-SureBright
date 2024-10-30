import { Button, Divider, Form, Input, message } from "antd";
import { IFormValues, IWebViewTabProps } from "./WebViewTab.interface";
import Loader from "../Loader/Loader";
import { useState } from "react";
import { fetchUrlContent } from "./WebViewTab.api";
import { convertObjToFieldValues } from "../../Utils/utils";

const WebViewTab = ({ setElementDetails }: IWebViewTabProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState<boolean>(false);
    const [iframeContent, setiframeContent] = useState<string>();

    const errorAlert = (message: string) => {
        messageApi.error(message);
    };

    const successAlert = (message: string) => {
        messageApi.success(message);
    };

    const loadUrl = async (values: IFormValues) => {
        setLoading(true)
        try {
            const response = await fetchUrlContent(values.url);
            successAlert(response.message)
            setiframeContent(response.payload)
        } catch (error: any) {
            setiframeContent(error.message)
            errorAlert(error.message)
        }
        finally {
            setLoading(false)
        }
    }
    const handleClickInIframe = (event: any) => {
        event.preventDefault();
        const { id, className, tagName } = event.target;
        const styles = window.getComputedStyle(event.target);
        const rect = event.target.getBoundingClientRect();
        const properties = {
            tagName: tagName,
            id: id ? id : 'null',
            className: className ? className : 'null',
            position: `X: ${Math.round(rect.left + window.scrollX)}, Y: ${Math.round(rect.top + window.scrollY)}`,
            size: `Width: ${Math.round(rect.width)}, Height: ${Math.round(rect.height)}`,
            backgroundColor: styles.backgroundColor,
            borderWidth: styles.borderWidth,
            borderColor: styles.borderColor,
            borderStyle: styles.borderStyle,
            margin: styles.margin,
            padding: styles.padding,
            opacity: styles.opacity,
            display: styles.display,
            visibility: styles.visibility,
            overflow: styles.overflow,
        }
        setElementDetails(convertObjToFieldValues(properties))
    };

    const handleIframeLoad = () => {
        const iframe = document.getElementById('iframe') as HTMLIFrameElement;
        if (iframe?.contentWindow) {
            iframe.contentWindow.document.addEventListener('click', handleClickInIframe);
        }
    };


    return (
        <>
            {contextHolder}
            {loading && <Loader />}
            <Form onFinish={loadUrl} className='Form'>
                <Form.Item
                    className='full-width no-margin'
                    name="url"
                    rules={[{ required: true, message: 'Enter Valid Url', type: 'url' }]}
                >
                    <Input placeholder="Enter URL" />
                </Form.Item>
                <Form.Item className='no-margin'>
                    <Button className='Button' type="primary" htmlType="submit">
                        Load
                    </Button>
                </Form.Item>
            </Form>
            <Divider />
            <iframe
                id="iframe"
                srcDoc={iframeContent}
                onLoad={handleIframeLoad}
                style={{ width: '100%', height: '100%', overflow: 'hidden', border: 'none' }}
                title="Web View"
            ></iframe>
        </>
    )
}

export default WebViewTab;
import { useState, useEffect } from "react"
import {
    Chat,
    Channel,
    Window,
    ChannelHeader,
    ChannelList,
    MessageList,
    MessageInput,
    Thread,
    LoadingIndicator
} from "stream-chat-react"
import { StreamChat } from "stream-chat"
import "stream-chat-react/dist/css/v2/index.css"


export default function MessagesPage() {

    var apiKey = import.meta.env.VITE_STREAM_API_KEY;
    var apiSecret = import.meta.env.VITE_STREAM_API_SECRET;

    const user = {
        id: sessionStorage.getItem("loggedInUserEmail"),
        name: sessionStorage.getItem("userName"),
        image: sessionStorage.getItem("userPfpUrl")
    }

    useEffect(() => {
        async function init() {
            const client = StreamChat.getInstance(apiKey, apiSecret);

            await client.connectUser(user, client.createToken(user.id));
        }

        init();
    }, [])





    //sessionStorage.getItem("loggedInUserEmail");
    //sessionStorage.getItem("userName");
    //sessionStorage.getItem("userPfpUrl");



    return (
        <></>
    )
}
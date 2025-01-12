import {
    Chat,
    Channel,
    Window,
    ChannelHeader,
    ChannelList,
    MessageList,
    MessageInput,
    Thread,
    LoadingIndicator,
    ChannelActionContext
} from "stream-chat-react"
import { StreamChat } from "stream-chat"
import { useEffect } from "react";
var apiKey = import.meta.env.VITE_STREAM_API_KEY;
const user = {
    id: "jane"
}
function ChatMaintenance() {

    useEffect(() => {
        async function init(){
            const client = StreamChat.getInstance(apiKey);

            await client.connectUser(user, client.devToken(user.id));
            client.deleteUser(user.id, {hard_delete: true})

        }

        console.log("sdada")
        init();
    }, [])

    return (
        <h1>
            AccountsPage
        </h1>
    );
}

export default ChatMaintenance;
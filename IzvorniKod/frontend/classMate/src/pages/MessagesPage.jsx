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
//import "../styles/MessagesPage.css"

const serverUrl = "http://localhost:8080"

var sort;
var filters;
var options;


export default function MessagesPage() {
    const [userDetails, setUserDetails] = useState(null);
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [user, setUser] = useState({
        id: "-1",
        name: "",
        image: "",

    })

    async function makeNewChat(){
        console.log('here')
        const chatclient = StreamChat.getInstance(apiKey);
        const chatchannel = chatclient.channel("messaging", 'test_id')
        await chatchannel.watch()

        chatchannel.addMembers(['55']);

        if (chatclient) return () => chatclient.disconnectUser()
    }

    async function getUser() {
        try {
            const res = await fetch(`${serverUrl}/api/users/getByEmail?email=${sessionStorage.getItem("loggedInUserEmail")}`)

            if (res) {
                const userjson = await res.json();
                setUserDetails(userjson);
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function init() {
        const chatclient = StreamChat.getInstance(apiKey)
        if (user.id != -1) {
            await chatclient.connectUser(user, chatclient.devToken(user.id));

            /* const chatchannel = chatclient.channel("messaging", 'test_id', {
                image: "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
                name: "test",
                members: [user.id]
            }) */

            //await chatchannel.watch()

            setClient(chatclient);
            //setChannel(chatchannel);

            sort = { last_message_at: -1 };
            filters = {
                type: 'messaging',
                members: { $in: [user.id] },
            };
            options = {
                limit: 10,
            };

        }

        if (chatclient) return () => chatclient.disconnectUser()

    }

    var apiKey = import.meta.env.VITE_STREAM_API_KEY;
    var apiSecret = import.meta.env.VITE_STREAM_API_SECRET;

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {

        if (userDetails) {
            setUser({
                id: userDetails[0].userId.toString(),
                name: sessionStorage.getItem("userName"),
                image: sessionStorage.getItem("userPfpUrl")
            });
            console.log(user)
            init();
        }

    }, [userDetails])


    /* sessionStorage.getItem("loggedInUserEmail");
    sessionStorage.getItem("userName");
    sessionStorage.getItem("userPfpUrl"); */


    if (!client || user.id == '-1') return <div>Setting up client & connection...</div>;

    return (
        <Chat client={client}>
            <button onClick={() => {makeNewChat()}}>create new chat</button>
            <ChannelList filters={filters} sort={sort} options={options} />
            <Channel /* channel={channel} */>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
            </Channel>
        </Chat>
    );
}
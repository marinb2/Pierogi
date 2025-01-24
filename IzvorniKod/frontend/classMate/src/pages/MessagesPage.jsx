import { useState, useEffect, useSyncExternalStore } from "react"
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
    ChannelActionContext,
    useMessageTextStreaming
} from "stream-chat-react"
import { StreamChat } from "stream-chat"
import "stream-chat-react/dist/css/v2/index.css"
import "../styles/MessagesPage.css"

//const serverUrl = "http://localhost:8080"
const serverUrl = "https://pierogi2-1m4p.onrender.com"

var sort;
var filters;
var options;



export default function MessagesPage() {
    const [forceRerender, setForceRerender] = useState(0);
    const [userDetails, setUserDetails] = useState(null);
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [razredId, setRazredId] = useState("");
    const [razredName, setRazredName] = useState("");
    const [user, setUser] = useState({
        id: "-1",
        name: "",
        image: "",
        role: ""
    })
    const [nonEstConvos, setNonEstConvos] = useState(null);
    const [token, setToken] = useState(null);

    function goToMainPage() {
        window.location.href = "/main";
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

    async function getToken(id) {
        try {
            const res = await fetch(`${serverUrl}/api/users/chattoken?id=${id}`);
            if (res) {
                const tokenjson = await res.text();
                setToken(tokenjson);
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function registerNewConvo(establishingUser, otherUser) {
        try {
            const res = await fetch(`${serverUrl}/api/convos`, {
                method: "post", credentials: "include",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({
                    user1: establishingUser,
                    user2: otherUser
                })

            });

            if (res) {
                const convojson = await res.json();

            }
        } catch (e) {
            console.log(e);
        }
    }

    async function createNewChannel(user1, user2) {
        /* console.log(user1);
        console.log(user2);
        console.log(client);
        console.log(user1.userId.toString())
        console.log(typeof (user2.userId.toString()))
        console.log(user1.username + "-" + user2.username) */


        // const chatclient = StreamChat.getInstance(apiKey);

        const channel = client.channel("messaging", user1.userId.toString() + "_" + user2.userId.toString(), {
            members: [user1.userId.toString(), user2.userId.toString()],
            name: user1.username + "-" + user2.username
        })

        await channel.watch();
    }

    async function handleDodaj(user) {
        /* console.log(user.userId);
        console.log(client)
        console.log("user establishing chat: ")
        console.log(userDetails[0]);
        console.log("oteher user")
        console.log(user) */
        await registerNewConvo(userDetails[0], user);
        await createNewChannel(userDetails[0], user);
        console.log("here")
        window.location.reload();

    }

    async function getNonEstConvos(id) {
        try {
            const res = await fetch(`${serverUrl}/api/convos/byuser-not-est?id=${id}`);

            if (res) {
                const convosjson = await res.json();
                setNonEstConvos(convosjson);
            }
        } catch (e) {
            console.log(e)
        }
    }



    async function init() {
        const chatclient = StreamChat.getInstance(apiKey)
        if (user.id != -1) {
            //console.log(userDetails)

            await chatclient.connectUser(user, token);

            if (userDetails[0].role.roleId == 1) {
                const chatchannel = chatclient.channel("messaging", razredId, {
                    image: "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
                    name: razredName,
                })
                await chatchannel.watch()

                chatchannel.addMembers([user.id]);

            }
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
        setForceRerender(prev => prev + 1);
    }


    var apiKey = import.meta.env.VITE_STREAM_API_KEY;

    useEffect(() => {
        getUser();
        //console.log(sessionStorage.getItem("userPfpUrl"));
    }, [])

    useEffect(() => {

        if (userDetails) {
            getToken(userDetails[0].userId.toString());
            getNonEstConvos(userDetails[0].userId);
            setRazredId(userDetails[0].gradeNumber + "_" + userDetails[0].gradeLetter + "_" + userDetails[0].school ? "a" : userDetails[0].school.name);
            setRazredName(userDetails[0].gradeNumber + "." + userDetails[0].gradeLetter);
            setUser({
                id: userDetails[0].userId.toString(),
                name: sessionStorage.getItem("userName"),
                image: sessionStorage.getItem("userPfpUrl")
            });

        }

    }, [userDetails]);

    useEffect(() => {
        if (user.id != -1 && token)
            init();
    }, [user, token])

    useEffect(() => {
        if (nonEstConvos) {
        }
    }, [nonEstConvos])

    /* sessionStorage.getItem("loggedInUserEmail");
    sessionStorage.getItem("userName");
    sessionStorage.getItem("userPfpUrl"); */

    if (!client || user.id == '-1' || !nonEstConvos) return <div>Setting up client & connection...</div>;


    return (
        <div id="chatroot">
            <div className="add_new_contacts">
                <div className="new_contacts_header">
                    <button onClick={() => { goToMainPage(); }}>Povratak na glavnu stranicu</button>
                    <span>Započnite novi razgovor</span>
                </div>

                {nonEstConvos.map((e) => (
                    <div className="new_contacts_person" key={e.userId}>
                        <img src={e.pfpUrl === null ? "https://placehold.co/50x50" : e.pfpUrl} alt="https://placehold.co/50x50" className="new_contact_image"></img>
                        <span className="new_contact_username">{e.username ? e.username : "noname"}</span>
                        <button onClick={() => { handleDodaj(e) }}><span>Dodaj</span></button>
                    </div>
                ))}

            </div>
            <Chat client={client}>
                <ChannelList filters={filters} sort={sort} options={options} />
                <Channel>
                    <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput />
                    </Window>
                </Channel>
            </Chat>
        </div>

    );

}
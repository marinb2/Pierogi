import { useEffect, useState } from "react";

import "../styles/NotificationsPage.css"

const serverUrl = "http://localhost:8080"
//const serverUrl = "https://pierogi2-1m4p.onrender.com"

const date_formatter = new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "GMT",

});

function NotificationsPage() {

    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [pickedSubject, setPickedSubject] = useState(null);
    const [notifications, setNotifications] = useState(null);

    //console.log(Intl.DateTimeFormat.supportedLocalesOf())


    async function getUser() {
        try {
            const res = await fetch(`${serverUrl}/api/users/getByEmail?email=${sessionStorage.getItem("loggedInUserEmail")}`)

            if (res) {
                const userjson = await res.json();
                setUser(userjson[0]);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getSubjects = async (email) => {
        try {
            const response = await fetch(`${serverUrl}/api/subjects/getByUserEmail?email=${email}`, { method: "GET", credentials: "include" });
            if (response.ok) {
                const subjectsjson = await response.json();
                setSubjects(subjectsjson);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getNotifications = async (id) => {
        try {
            const res = await fetch(`${serverUrl}/api/notifications/bySubjectId?id=${id}`);

            if (res) {
                const notifsjson = await res.json();
                setNotifications(notifsjson);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const registerNewNotification = async (data, subject) => {
        try {
            await fetch(`${serverUrl}/api/notifications`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({
                    content: data,
                    sentAt: new Date(),
                    subject: subject
                })
            });
            window.location.reload();
        } catch (e) {
            console.log(e);
        }
    }

    function goToMain() {
        window.location.href = "/main"
    }

    function handleChooseSubject(subjectId) {
        for (var i = 0; i < subjects.length; i++) {
            if (subjects[i].subjectId === subjectId) {
                setPickedSubject(subjects[i]);
                getNotifications(subjectId);
                return;
            }
        }
    }

    function handleForm() {
        const data = document.getElementById("form-content").value;
        console.log(data);
        console.log(user.subject);
        registerNewNotification(data, user.subject);
        
        //getNotifications(user.subject.subjectId);
    }

    useEffect(() => {
        getUser();
    }, [])
    useEffect(() => {
        if (user) {
            //console.log(user)
            getSubjects(user.email);
        }
    }, [user])
    useEffect(() => {
        getUser();
    }, [])
    useEffect(() => {
        if (subjects) {
            //console.log(subjects);
            setPickedSubject(subjects[0]);
        }
    }, [subjects])
    useEffect(() => {
        if (pickedSubject) {
            getNotifications(pickedSubject.subjectId);
        }
        //console.log(pickedSubject)
    }, [pickedSubject])
    useEffect(() => {
        if (notifications)
            console.log(notifications);
    }, [notifications])

    if (user) {
        if (notifications) {
            if (user.role.roleId == 1 && subjects && pickedSubject && notifications.length == 0) {

                return (
                    <div className="notif-root-ucenik">
                        <div className="back-to-main-ucenik">
                            <button className="back-to-main-button-ucenik" onClick={() => { goToMain(); }}>natrag na glavnu stranicu</button>
                        </div>
                        <div className="notif-display-ucenik">
                            <div className="notif-display-ucenik-naslov">
                                <h1>{pickedSubject.subjectName}</h1>
                            </div>

                            <div className="notif-display-no-notifs">

                                <h1>Nema obavijesti</h1>

                            </div>
                        </div>




                        <div className="notif-izbornik-ucenik">
                            {subjects.map((e) => (
                                <div key={e.subjectId} className="notif-izbornik-instance-ucenik">
                                    <div className="notif-izbornik-instance-subject-name-ucenik">
                                        <p>{e.subjectName}</p>
                                    </div>
                                    <div className="notif-izbornik-instance-button-ucenik">
                                        <button onClick={() => { handleChooseSubject(e.subjectId); }}>Odaberi</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            else if (user.role.roleId == 1 && subjects && pickedSubject) {

                return (
                    <div className="notif-root-ucenik">
                        <div className="back-to-main-ucenik">
                            <button className="back-to-main-button-ucenik" onClick={() => { goToMain(); }}>natrag na glavnu stranicu</button>
                        </div>
                        <div className="notif-display-ucenik">
                            <div className="notif-display-ucenik-naslov">
                                <h1>{pickedSubject.subjectName}</h1>
                            </div>


                            {notifications.map((e) => (
                                <div key={e.id} className="notif-instance">
                                    <div className="date-notif-instance">
                                        {e.sentAt ? <p>{date_formatter.format(Date.parse(e.sentAt))}</p> : <p>Vrijeme nepoznato</p>}
                                    </div>
                                    <div className="content-notif-instance">
                                        {e.content ? <p>{e.content}</p> : <p>Sadržaj se ne može dohvatiti</p>}
                                    </div>
                                </div>
                            ))}

                        </div>




                        <div className="notif-izbornik-ucenik">
                            {subjects.map((e) => (
                                <div key={e.subjectId} className="notif-izbornik-instance-ucenik">
                                    <div className="notif-izbornik-instance-subject-name-ucenik">
                                        <p>{e.subjectName}</p>
                                    </div>
                                    <div className="notif-izbornik-instance-button-ucenik">
                                        <button onClick={() => { handleChooseSubject(e.subjectId); }}>Odaberi</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            else if (user.role.roleId == 2 && notifications) {
                return (
                    <div className="notif-root-nastavnik">
                        <div className="header-nastavnik">
                            <button className="back-to-main-button-nastavnik" onClick={() => { goToMain(); }}>natrag na glavnu stranicu</button>
                            <span className="which-subject-nastavnik">Obavijesti za predmet: {user.subject.subjectName}</span>
                        </div>
                        <div className="notif-display-nastavnik">
                            {notifications.map((e) => (
                                <div key={e.id} className="notif-instance">
                                    <div className="date-notif-instance">
                                        {e.sentAt ? <p>{date_formatter.format(Date.parse(e.sentAt))}</p> : <p>Vrijeme nepoznato</p>}
                                    </div>
                                    <div className="content-notif-instance">
                                        {e.content ? <p>{e.content}</p> : <p>Sadržaj se ne može dohvatiti</p>}
                                    </div>
                                </div>
                            ))}

                            <form id="new-notif-form">
                                <p><label>Nova Obavijest: <input type="text" id="form-content" name="notification" defaultValue="" placeholder="upišite obavijest" /></label></p>
                            </form>
                            <button onClick={() => { handleForm() }} className="new-notif-form-submit">Objavi Obavijest</button>
                        </div>
                    </div>
                );
            }
        } if(user.role.roleId != 1 || user.role.roleId != 2) return(<h1>Nemate Pravo Pristupa</h1>)
    } 
    return (
        <h1>ucitavanje</h1>
    )
}

export default NotificationsPage;
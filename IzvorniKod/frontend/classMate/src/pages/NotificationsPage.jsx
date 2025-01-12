import { useEffect, useState } from "react";

import "../styles/NotificationsPage.css"

const serverUrl = "http://localhost:8080"

function NotificationsPage() {

    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [pickedSubject, setPicekdSubject] = useState(null);

    function goToMain() {
        window.location.href = "/main"
    }

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

    function handleChooseSubject(subjectId) {
        console.log(subjectId);
    }

    useEffect(() => {
        getUser();
    }, [])
    useEffect(() => {
        if (user) {
            console.log(user)
            getSubjects(user.email);
        }
    }, [user])
    useEffect(() => {
        getUser();
    }, [])
    useEffect(() => {
        if (subjects) {
            console.log(subjects);
            setPicekdSubject(subjects[0]);
        }
    }, [subjects])
    useEffect(() => {
        if (pickedSubject)
            console.log(pickedSubject)
    }, [pickedSubject])

    if (user) {
        if (user.role.roleId == 1 && subjects && pickedSubject) {

            return (
                <div className="notif-root-ucenik">
                    <div className="back-to-main-ucenik">
                        <button className="back-to-main-button-ucenik" onClick={() => { goToMain(); }}>natrag na glavnu stranicu</button>
                    </div>
                    <div className="notif-display-ucenik">
                        <div className="notif-display-ucenik-naslov">
                            <h1>{pickedSubject.subjectName}</h1>
                        </div>
                        <div className="notif-instance">
                            <div className="date-notif-instance">
                                <p>1.1.2000.</p>
                            </div>
                            <div className="content-notif-instance">
                                <p>ovo je primjer obavijesti</p>
                            </div>
                        </div>

                    </div>




                    <div className="notif-izbornik-ucenik">
                        {/* <div className="notif-izbornik-instance-ucenik">
                            <div className="notif-izbornik-instance-subject-name-ucenik">
                                <p>silikoniziranje</p>
                            </div>
                            <div className="notif-izbornik-instance-button-ucenik">
                                <button onClick={() => { handleChooseSubject(); }}>Odaberi</button>
                            </div>
                        </div> */}
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
        else if (user.role.roleId == 2) {
            return (
                <div className="notif-root-nastavnik">
                    <div className="header-nastavnik">
                        <button className="back-to-main-button-nastavnik" onClick={() => { goToMain(); }}>natrag na glavnu stranicu</button>
                        <span className="which-subject-nastavnik">Obavijesti za predmet: {user.subject.subjectName}</span>
                    </div>
                    <div className="notif-display-nastavnik">
                        <div className="notif-instance">
                            <div className="date-notif-instance">
                                <p>1.1.2000.</p>
                            </div>
                            <div className="content-notif-instance">
                                <p>ovo je primjer obavijesti</p>
                            </div>
                        </div>
                        <form className="new-notif-form">
                            <p><label>Nova Obavijest: <input type="text" name="notification" defaultValue="" placeholder="upišite obavijest" /></label></p>
                        </form>
                    </div>
                </div>
            );
        }
    }
    return (
        <h1>ucitavanje</h1>
    )
}

export default NotificationsPage;
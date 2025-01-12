import { useEffect, useState } from "react";

import "../styles/NotificationsPage.css"

const serverUrl = "http://localhost:8080"

function NotificationsPage() {

    const [user, setUser] = useState(null);

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

    useEffect(() => {
        getUser();
    }, [])
    useEffect(() => {
        console.log(user)
    }, [user])

    if (user) {
        if (user.role.roleId == 1) {

            return (
                <div className="notif-root-ucenik">
                    <div className="back-to-main-ucenik">
                        <button className="back-to-main-button-ucenik" onClick={() => { goToMain(); }}>natrag na glavnu stranicu</button>
                    </div>
                    <div className="notif-display-ucenik">
                        <p>display</p>
                    </div>
                    <div className="notif-izbornik-ucenik">
                        <p>izbornik</p>
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
                        <form className="new-notif-form-nastavnik">
                            <p><label>Nova Obavijest: <input type="text" name="notification" defaultValue="" placeholder="upišite obavijest"/></label></p>
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
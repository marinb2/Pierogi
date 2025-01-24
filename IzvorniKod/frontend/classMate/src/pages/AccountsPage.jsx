import { useEffect, useState } from "react";
import "../styles/AccountsPage.css"

const date_formatter = new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "GMT",
});

function AccountsPage() {

    const serverUrl = "http://localhost:8080"
    //const serverUrl = "https://pierogi2-1m4p.onrender.com"

    const missingtext = "nema"

    const [users, setUsers] = useState(null);
    const [user, setUser] = useState(null);

    function goToMain() {
        window.location.href = "/main"
    }

    async function getUsers() {
        try {
            const res = await fetch(`${serverUrl}/api/users`)

            if (res) {
                const usersjson = await res.json();
                setUsers(usersjson);
            }
        } catch (e) {
            console.log(e)
        }
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


    function paint() {
        const elements = document.getElementsByTagName("td");

        for (var i = 0; i < elements.length; i++) {
            if (elements[i].textContent == missingtext) {
                elements[i].style = "color:red"
            }

        }
    }

    useEffect(() => {
        getUsers();
        getUser();
    }, [])
    useEffect(() => {
        console.log(user)
    }, [user])
    useEffect(() => {
        console.log(users);
        paint();
    }, [users])


    if (users && user) {
        if (user.role.roleId == 6) {
            return (
                <div className="accounts-root">
                    <div className="accounts-header">
                        <button onClick={() => { goToMain() }} className="go-to-main-button">Natrag na glavnu stranicu</button>
                        <h1 className="accounts-header-title">Pregled svih Korisnika</h1>
                    </div>
                    <div className="accounts-body">
                        <table className="accounts-table">
                            <tbody>
                                <tr className="accounts-table-header">
                                    <th>Id</th>
                                    <th>Datum Registracije</th>
                                    <th>Email</th>
                                    <th>Korisničko Ime</th>
                                    <th>Uloga</th>
                                    <th>Smijer</th>
                                    <th>Škola</th>
                                    <th>Predmet(koji predaje)</th>
                                    <th>Id Nastavnika</th>
                                    <th>Razred</th>
                                    <th>Slika Profila</th>
                                </tr>
                                {users.map((e) => (
                                    <tr key={e.userId} className="accounts-table-row">
                                        <td>{e.userId}</td>
                                        <td>{date_formatter.format(Date.parse(e.createdAt))}</td>
                                        <td>{e.email}</td>
                                        <td>{e.username}</td>
                                        <td>{e.role.roleName}</td>
                                        <td>{e.programme ? e.programme.programName : missingtext}</td>
                                        <td>{e.school ? e.school.name : missingtext}</td>
                                        <td>{e.subject ? e.subject.subjectName : missingtext}</td>
                                        <td>{e.classTeacherId ? e.classTeacherId : missingtext}</td>
                                        <td>{e.gradeLetter ? e.gradeNumber + "." + e.gradeLetter : missingtext}</td>
                                        <td>{e.pfpUrl ? <img src={e.pfpUrl} alt="SLIKA" className="table-image"></img> : missingtext}</td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </div>
                </div>
            );
        } else return <h1>Nemate dozvolu pristupa</h1>
    }

    else return (<h1>Učitavanje</h1>)
}

export default AccountsPage;
import { useEffect, useState } from "react";

//const serverUrl = "http://localhost:8080"
const serverUrl = "https://pierogi2-1m4p.onrender.com"
import "../styles/DocumentsDisplayPage.css"

function DocumentsDisplayPage() {
    const [user, setUser] = useState(null);
    const [certificates, setCertificates] = useState(null);

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

    async function getCerfificates(id) {
        try {
            const res = await fetch(`${serverUrl}/api/certificates/getAllBySchoolId?id=${id}`);

            if (res) {
                const json = await res.json();
                setCertificates(json);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => { getUser(); }, []);
    useEffect(() => {
        if (user) {
            if (user.role.roleId == 4) {

            }
            getCerfificates(user.school.schoolId);
        }

    }, [user]);

    if (user) {
        if (user.role.roleId == 4) {
            if (certificates) {
                return (
                    <div className="certificates-root">
                        <div className="certificates-header">
                            <button onClick={() => { goToMain() }} className="go-to-main-button">Natrag na glavnu stranicu</button>
                            <h1 className="certificates-header-title">Pregled svih Potvrda</h1>
                        </div>
                        <div className="certificates-body">
                            <table className="certificates-table">
                                <tbody>
                                    <tr className="certificates-table-header">
                                        <th>Id</th>
                                        <th>Vrsta Potvrde</th>
                                        <th>Ime Učenika</th>
                                        <th>email</th>
                                        <th>status</th>
                                    </tr>
                                    {certificates.map((e) => (
                                        <tr key={e.id} className="certificates-table-row">
                                            <td>{e.id}</td>
                                            <td>{e.certificateType.name}</td>
                                            <td>{e.personName}</td>
                                            <td>{e.email}</td>
                                            <td>{e.status}</td>
                                        </tr>
                                    ))}
                                </tbody>


                            </table>
                        </div>
                    </div>
                )
            }else return (<h1>učitavanje</h1>)
        } else {
            return (<h1>Nemate pravo pristupa</h1>)
        }
    } else {
        return (<h1>ucitavanje</h1>)
    }
}

export default DocumentsDisplayPage;
import { useState, useEffect } from 'react';
import Sidebar from './MainPage';
import { Button } from '@mui/material'
import '../styles/DocumentsPage.css';

function DocumentsPage() {

    const [confirmations, setConfirmations] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [user, setUser] = useState(null);
    const backdomain = 'http://localhost:8080';
    //const backdomain = 'https://pierogi2-1m4p.onrender.com';
    const userMail = sessionStorage.getItem("loggedInUserEmail");
    const userName = sessionStorage.getItem("userName");


    async function getUser() {
        try {
            const res = await fetch(`${backdomain}/api/users/getByEmail?email=${sessionStorage.getItem("loggedInUserEmail")}`)

            if (res) {
                const userjson = await res.json();
                setUser(userjson[0]);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getConfirmations = async () => {
        try {
            const response = await fetch(`${backdomain}/api/certificates`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response) {
                const confirmationsjson = await response.json();
                setConfirmations(confirmationsjson);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getPendingRequests = async () => {
        try {
            const response = await fetch(`${backdomain}/api/certificates/pending-requests`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response) {
                const requestsjson = await response.json();
                setPendingRequests(requestsjson);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser();
    }, [])
    useEffect(() => {
        console.log(user)
    }, [user])

    useEffect(() => {
        if (userMail) {
            getConfirmations();
            getPendingRequests();  // Pozivamo ovu funkciju za dohvat statusa
        }
    }, [userMail]);

    const handleRequest = async (confirmation) => {

        try {
            const response = await fetch(`${backdomain}/api/certificates/${confirmation.id}/generate?studentName=${userName}&studentEmail=${userMail}`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                alert('Zahtjev za potvrdu poslan!');
                getPendingRequests();  // Nakon slanja zahtjeva ponovo dohvatimo pending zahtjeve
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleApproveRequest = async (requestId, request) => {

        try {
            const response = await fetch(`${backdomain}/api/certificates/pending-requests/${requestId}/approve?email=${request.email}`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (response.ok) {
                alert('Potvrda odobrena i poslana!');
                getPendingRequests();  // Nakon odobravanja ponovo dohvatimo pending zahtjeve
            }
        } catch (error) {
            console.log(error);
        }
    }
    if (user) {
        if (user.role.roleId == 1 || user.role.roleId == 5) {
            return (
                <div className="documents-container">
                    <Sidebar showSchedule={false} />

                    {/* Display confirmations */}
                    {user.role.roleId == 1 && (

                        <div className="confirmations-list">
                            {confirmations.map((confirmation, index) => (
                                <div key={index} className="confirmation-item">
                                    {/* Render individual confirmation data */}
                                    <h4>{confirmation.name}</h4>
                                    <div className="request-button">
                                        <Button onClick={() => handleRequest(confirmation)} variant="contained" sx={{ backgroundColor: 'rgba(103, 58, 183, 1)' }}>Zatraži</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Display pending requests for staff */}
                    {user.role.roleId == 5 && (

                        <div className="pending-requests-list">
                            {pendingRequests.length > 0 ? (
                                pendingRequests.map((request, index) => (
                                    <div key={index} className="pending-request-item">
                                        <h4>Molba: {request.certificateType.name}</h4>
                                        <p>Zahtjev poslao: {request.personName}</p>
                                        {request.status === 'PENDING' && (
                                            <Button onClick={() => handleApproveRequest(request.id, request)} variant="contained" sx={{ backgroundColor: 'green' }}>
                                                Odobri
                                            </Button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>Trenutno nema čekajućih zahtjeva.</p>
                            )}
                        </div>
                    )}
                </div>
            );
        } else return (<h1>Nemate pravo pristupa</h1>)
    } else return (<h1>Učitavanje</h1>)
}

export default DocumentsPage;
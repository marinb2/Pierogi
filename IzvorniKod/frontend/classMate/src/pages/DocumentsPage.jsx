import { useState, useEffect } from 'react';
import Sidebar from './MainPage';
import { Button } from '@mui/material'
import '../styles/DocumentsPage.css';

function DocumentsPage() {

    const [confirmations, setConfirmations] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const backdomain = 'http://localhost:8080';
    const userMail = sessionStorage.getItem("loggedInUserEmail");
    const userName = sessionStorage.getItem("userName");

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

    return (
        <div className="documents-container">
            <Sidebar showSchedule={false}/>

            {/* Display confirmations */}
            <div className="confirmations-list">
                {confirmations.map((confirmation, index) => (
                    <div key={index} className="confirmation-item">
                        {/* Render individual confirmation data */}
                        <h4>{confirmation.name}</h4>
                        <div className="request-button">
                            <Button onClick={() => handleRequest(confirmation)} variant="contained" sx={{ backgroundColor: 'rgba(103, 58, 183, 1)'}}>Zatraži</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Display pending requests for staff */}
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
        </div>
    );
}

export default DocumentsPage;
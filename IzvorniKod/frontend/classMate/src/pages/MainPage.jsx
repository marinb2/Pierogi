import React, { useState, useEffect } from 'react';
import '../styles/MainPage.css';
import logo from '../assets/logo.svg';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';

function TopBar({ currentTitle, toggleSidebar }) {
  return (
    <div className="topbar">
      <div className="logo">
        <img src={logo} className="logo-image" alt="Logo" />
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </div>
      <div className="title">
        <p>{currentTitle}</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const basebackendurl = "http://localhost:8080";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTitle, setCurrentTitle] = useState('Moj raspored');
  const [subjects, setSubjects] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const getSubjects = async (email) => {
    try {
      const response = await fetch(`${basebackendurl}/api/subjects/getByUserEmail?email=${email}`, { method: "GET", credentials: "include" });
      if (response.ok) {
        const subjectsjson = await response.json();
        const subjectsList = subjectsjson.map(subject => subject.subjectName);
        setSubjects(subjectsList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleMenuClick = (title) => {
    setCurrentTitle(title); 
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const email = sessionStorage.getItem("loggedInUserEmail");
    getSubjects(email);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEnrollmentClick = async () => {
    try {
      const response = await fetch(`${basebackendurl}/api/users/enroll?email=${sessionStorage.getItem("loggedInUserEmail")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const message = await response.text();
      alert(message);
  
    } catch (error) {
      console.error("Greška prilikom upisa:", error);
      alert("Greška prilikom upisa: " + error.message);
    }

    // Pozivanje funkcije za provjeru upisa nakon uspješnog upisa
    const email = sessionStorage.getItem("loggedInUserEmail");
    await checkEnrollmentStatus(email);
  };

  const checkEnrollmentStatus = async (email) => {
    try {
      const response = await fetch(`${basebackendurl}/api/users/getByEmail?email=${email}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const userData = await response.json();  // Dodano: Deklaracija userData
  
        console.log("Podaci korisnika:", userData);  // Debugging
  
        // Ispravljen uvjet za provjeru upisa
        if (userData.classTeacherId !== null && userData.gradeLetter !== null && userData.gradeNumber !== null) {
          setIsEnrolled(true);  // Ako je upisan, prikazuje raspored
        } else {
          console.log("Korisnik nije upisan u razred.");  // Debugging
          setIsEnrolled(false); // Ako nije upisan, prikazuje gumb Upis
        }
      } else {
        console.error("Neuspješno dohvaćanje korisnika.");
      }
    } catch (error) {
      console.error("Greška prilikom provjere upisa:", error);
    }
  };
  
  
  
  return (
    subjects && (
      <div className="app-container">
        <TopBar currentTitle={currentTitle} toggleSidebar={toggleSidebar} />
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="section">
            <h3>Osnovno</h3>
            <div className="menu-item active" onClick={() => handleMenuClick('Moj raspored')}>
              <span>🗓️</span>
              <a href="#schedule">Moj raspored</a>
            </div>
            <div className="menu-item" onClick={() => handleMenuClick('Obavijesti')}>
              <span>🔔</span>
              <a href="#notifications">Obavijesti</a>
              <span className="badge">24</span>
            </div>
            <div className="menu-item" onClick={() => handleMenuClick('Razgovori')}>
              <span>💬</span>
              <a href="/conversations">Razgovori</a>
              <span className="badge">2</span>
            </div>
            <div className="menu-item" onClick={() => handleMenuClick('Potvrde')}>
              <span>📄</span>
              <a href="#confirmations">Potvrde</a>
            </div>
          </div>

          <div className="section subjects">
            <h3>Predmeti</h3>
            {subjects.map((subject) => (
              <div className="menu-item" key={subject} onClick={() => handleMenuClick(subject)}>
                <span>📂</span>
                <a href={`#${subject.toLowerCase()}`}>{subject}</a>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>Općenito</h3>
            <div className="menu-item" onClick={() => handleMenuClick('Odjava')}>
              <span>🚪</span>
              <button onClick={handleLogout} className="logout-btn">Odjava</button>
            </div>
          </div>
        </div>

        {isEnrolled ? (
          <div className="main-content">
            <div className="schedule-container">
              <ScheduleComponent
                height="600px"
                width="100%"
                selectedDate={new Date()}
              >
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
              </ScheduleComponent>
            </div>
          </div>
        ) : (
          <div className="center-content">
            <button className="enroll-button" onClick={handleEnrollmentClick}>
              Upis
            </button>
          </div>
        )}

      </div>
    )
  );
}

export default Sidebar;
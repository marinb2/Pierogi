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
  const [weatherEvents, setWeatherEvents] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);

  const apiKey = "19f1c82956a1d39ebf044e906eb0b900"
  const city = "Zagreb"

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

  // Upis korisnika -> dodjela razreda i razrednika
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

  // Provjera upisa korisnika
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
        if (userData[0].classTeacherId !== null && userData[0].gradeLetter !== null && userData[0].gradeNumber !== null) {
          setIsEnrolled(true);  // Ako je upisan, prikazuje raspored
          generateScheduleIfNotExists(userData[0].gradeNumber, userData[0].gradeLetter);  // Generiranje rasporeda
          getClassSchedule(userData[0].gradeNumber, userData[0].gradeLetter);  // Dohvat rasporeda
        } else {
          setIsEnrolled(false); // Ako nije upisan, prikazuje gumb Upis
        }
      } else {
        console.error("Neuspješno dohvaćanje korisnika.");
      }
    } catch (error) {
      console.error("Greška prilikom provjere upisa:", error);
    }
  };

  // Pokrece checkEnrollmentStatus funkciju pri učitavanju stranice
  useEffect(() => {
    const email = sessionStorage.getItem("loggedInUserEmail");
    getSubjects(email);
    checkEnrollmentStatus(email); // Pozivanje funkcije za provjeru upisa pri učitavanju

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // ✅ Funkcija za dohvat vremenske prognoze
  const getWeatherForecast = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
      if (response.ok) {
        const data = await response.json();

        console.log("Vremenska prognoza:", data);  // Debugging

        // Mapiranje prognoze u evente za Scheduler
        const events = data.list.slice(0, 7).map((forecast) => ({
          Id: forecast.dt,
          Subject: `🌡️ ${forecast.main.temp}°C, ${forecast.weather[0].description}`,
          StartTime: new Date(forecast.dt * 1000),
          EndTime: new Date((forecast.dt + 3600) * 1000),
          IsAllDay: false,
          isReadonly: true
        }));
        setWeatherEvents(events);
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju vremenske prognoze:", error);
    }
  };

  useEffect(() => {
    getWeatherForecast();  // Poziva vremensku prognozu pri učitavanju
  }, []);

  const getClassSchedule = async (gradeNumber, gradeLetter) => {
    try {
      const response = await fetch(`${basebackendurl}/api/schedule/${gradeNumber}/${gradeLetter}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
  
        console.log("Raspored:", data);
  
        // Hrvatski državni blagdani
        const hrvatskiBlagdani = [
          "2024-10-08", "2024-11-01", "2024-12-25", "2024-12-26",
          "2025-01-01", "2025-01-06", "2025-04-20", "2025-04-21",
          "2025-05-01", "2025-06-22", "2025-06-25"
        ];
  
        const bozicniPrazniciStart = new Date("2024-12-24");
        const bozicniPrazniciEnd = new Date("2025-01-06");
        const uskrsStart = new Date("2025-04-17");
        const uskrsEnd = new Date("2025-04-23");
  
        const jePraznik = (datum) => {
          const dateStr = datum.toISOString().split('T')[0];
          return hrvatskiBlagdani.includes(dateStr) ||
            (datum >= bozicniPrazniciStart && datum <= bozicniPrazniciEnd) ||
            (datum >= uskrsStart && datum <= uskrsEnd);
        };
  
        const startDate = new Date("2024-10-01");
        const endDate = new Date("2025-06-15");
        const generatedEvents = [];
  
        const radniDani = [1, 2, 3, 4, 5]; // Ponedjeljak - Petak
        const dnevniTermini = [9, 10, 11, 12, 13, 14, 15]; // Satnice od 9 do 15 sati
  
        let predmetIndex = 0;
  
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          const dan = date.getDay();
  
          if (radniDani.includes(dan) && !jePraznik(date)) {
            for (let i = 0; i < dnevniTermini.length; i++) {
              if (predmetIndex >= data.length) {
                predmetIndex = 0; // Restart kad se prođe kroz sve predmete
              }
  
              const predmet = data[predmetIndex];
  
              const eventStart = new Date(date);
              eventStart.setHours(dnevniTermini[i], 0);
  
              const eventEnd = new Date(date);
              eventEnd.setHours(dnevniTermini[i], 45); // Traje 45 minuta
  
              generatedEvents.push({
                Id: `${predmet.id}-${date.toISOString().split('T')[0]}-${i}`,
                Subject: `📚 ${predmet.subject.subjectName}`,
                StartTime: eventStart,
                EndTime: eventEnd,
                IsAllDay: false,
                isReadonly: true,
                Location: predmet.classroom
              });
  
              predmetIndex++; // Sljedeći predmet
            }
          }
        }
  
        setScheduleEvents(generatedEvents);
  
      } else {
        console.error("Neuspješno dohvaćanje rasporeda.");
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju rasporeda:", error);
    }
  };    

  const generateScheduleIfNotExists = async (gradeNumber, gradeLetter) => {
    try {
      const response = await fetch(`${basebackendurl}/api/schedule/${gradeNumber}/${gradeLetter}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          // Ako raspored ne postoji, generiraj ga
          await fetch(`${basebackendurl}/api/schedule/generate`, {
            method: "POST",
            credentials: "include",
          });
  
          // Nakon generacije, ponovo dohvatiti raspored
          await getClassSchedule(gradeNumber, gradeLetter);
        }
      }
    } catch (error) {
      console.error("Greška pri provjeri/generaciji rasporeda:", error);
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
                eventSettings={{ dataSource: scheduleEvents }}
                readonly={true}
                workDays={[0, 1, 2, 3, 4]}
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
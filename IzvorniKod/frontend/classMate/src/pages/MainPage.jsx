import React, { useState, useEffect } from 'react';
import '../styles/MainPage.css';
import logo from '../assets/logo.svg'


function TopBar({ toggleSidebar }) {
  return (
    <div className="topbar">
      <div className="logo">
        <img src={logo} className="logo-image"></img> 
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </div>
      <div className="title">
        <p>Moj raspored</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Ensure the sidebar is always open when the screen width is above 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check immediately in case the screen is already large

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <TopBar toggleSidebar={toggleSidebar} />
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="section">
          <h3>Osnovno</h3>
          <div className="menu-item active">
            <span>🗓️</span>
            <a href="#schedule">Moj raspored</a>
          </div>
          <div className="menu-item">
            <span>🔔</span>
            <a href="#notifications">Obavijesti</a>
            <span className="badge">24</span>
          </div>
          <div className="menu-item">
            <span>💬</span>
            <a href="#conversations">Razgovori</a>
            <span className="badge">2</span>
          </div>
          <div className="menu-item">
            <span>📄</span>
            <a href="#confirmations">Potvrde</a>
          </div>
        </div>

        <div className="section subjects">
          <h3>Predmeti</h3>
          {['Matematika', 'Hrvatski', 'Biologija', 'Povijest', 'Informatika', 'Vjeronauk', 'Latinski', 'Filozofija'].map((subject, index) => (
            <div className="menu-item" key={subject}>
              <span>📂</span>
              <a href={`#${subject.toLowerCase()}`}>{subject}</a>
              {index === 0 && <span className="badge">12</span>} {/* Badge for Matematika */}
              {index === 1 && <span className="badge">2</span>}  {/* Badge for Hrvatski */}
            </div>
          ))}
        </div>

        <div className="section">
          <h3>Općenito</h3>
          <div className="menu-item">
            <span>🚪</span>
            <a href="#logout">Odjava</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

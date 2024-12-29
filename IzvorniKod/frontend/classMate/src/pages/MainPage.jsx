import React, { useState, useEffect } from 'react';
import '../styles/MainPage.css';
import logo from '../assets/logo.svg';

function TopBar({ currentTitle, toggleSidebar }) {
  return (
    <div className="topbar">
      <div className="logo">
        <img src={logo} className="logo-image" alt="Logo"></img> 
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTitle, setCurrentTitle] = useState('Moj raspored');

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleMenuClick = (title) => {
    setCurrentTitle(title); // Postavlja naslov u TopBar
  };

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

  const subjects = ['Matematika', 'Hrvatski', 'Biologija', 'Povijest', 'Informatika', 'Vjeronauk', 'Latinski', 'Filozofija'];

  return (
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
            <a href="#conversations">Razgovori</a>
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
            <a href="#logout">Odjava</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

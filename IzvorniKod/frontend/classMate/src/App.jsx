import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage"
import MessagesPage from './pages/MessagesPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path="/conversations" element={<MessagesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
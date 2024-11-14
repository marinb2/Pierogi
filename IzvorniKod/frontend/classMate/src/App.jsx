import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/main' element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
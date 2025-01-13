import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage"
import MessagesPage from './pages/MessagesPage';
import MaterialsPage from './pages/MaterialsPage';
import DocumentsPage from "./pages/DocumentsPage";
import AccountsPage from "./pages/AccountsPage";
//import ChatMaintenance from './pages/ChatMaintenance';

import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf0x3Qnxbf1x1ZFREalhXTnZcUj0eQnxTdEBjWH5ecXZRQGBfU0V0XQ==');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path="/conversations" element={<MessagesPage />} />
        <Route path="/predmeti" element={<MaterialsPage showSchedule={false} />}/>
        <Route path="/documents" element={<DocumentsPage />}/>
        <Route path="/accounts" element={<AccountsPage />}/>
        {/* <Route path="/cm" element={<ChatMaintenance />}/> */}
      </Routes>
    </Router>
  );
}

export default App;
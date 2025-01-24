import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage"
import MessagesPage from './pages/MessagesPage';
import MaterialsPage from './pages/MaterialsPage';
import DocumentsPage from "./pages/DocumentsPage";
import AccountsPage from "./pages/AccountsPage";
import NotificationsPage from './pages/NotificationsPage';

import { registerLicense } from '@syncfusion/ej2-base';
import DocumentsDisplayPage from './pages/DocumentsDisplayPage';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWX5cc3VXQ2dfU0N2WUE=');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path="/conversations" element={<MessagesPage />} />
        <Route path="/predmeti" element={<MaterialsPage showSchedule={false} />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/certificates" element={<DocumentsDisplayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
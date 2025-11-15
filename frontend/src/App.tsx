import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import MachinesPage from './features/machines/MachinesPage';
import MonitoringPointsPage from './features/monitoring/MonitoringPointsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const App: React.FC = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><MachinesPage /></ProtectedRoute>} />
        <Route path="/monitoring" element={<ProtectedRoute><MonitoringPointsPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;

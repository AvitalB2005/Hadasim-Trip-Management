import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EndPage from './pages/EndPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/end" element={<EndPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

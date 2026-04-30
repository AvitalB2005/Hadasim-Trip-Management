import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/entry/RegisterPage.jsx';
import LoginPage from './pages/entry/LoginPage.jsx';
import EndPage from './pages/entry/EndPage.jsx';
import DashboardPage from './pages/home/DashboardPage.jsx';
import MapPage from './pages/map/MapPage.jsx';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/end" element={<EndPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

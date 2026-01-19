import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import WatchmanScanner from './pages/WatchmanScanner';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default Route: Login */}

          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* User Specific Dashboards */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/admin" element={<WardenDashboard />} />
          <Route path="/scanner" element={<WatchmanScanner />} />
          
          {/* Fallback to Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
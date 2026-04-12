import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Directory from './pages/Directory';
import Mentorship from './pages/Mentorship';
import Referrals from './pages/Referrals';
import CopilotAI from './pages/CopilotAI';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#334155',
              color: '#fff',
              border: '1px solid #475569',
              borderRadius: '8px',
              fontSize: '14px'
            }
          }}
        />
        <Routes>
          {/* Public Authentication Views */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected SaaS Application Wrapper */}
          <Route element={<ProtectedRoute />}>
             <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/mentorship" element={<Mentorship />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/ai" element={<CopilotAI />} />
             </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

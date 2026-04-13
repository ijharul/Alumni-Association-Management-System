import { BrowserRouter as Router, Routes, Route, Navigate, useContext } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public
import Login from './pages/Login';
import Signup from './pages/Signup';

// Role dashboards
import StudentDashboard    from './pages/StudentDashboard';
import AlumniDashboard     from './pages/AlumniDashboard';
import CollegeAdminDashboard from './pages/CollegeAdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

// Non-admin shared pages (student / alumni / collegeAdmin only)
import Profile   from './pages/Profile';
import Directory from './pages/Directory';
import Mentorship from './pages/Mentorship';
import Referrals  from './pages/Referrals';
import CopilotAI  from './pages/CopilotAI';
import Pricing    from './pages/Pricing';

// Role-based root redirect
const RoleRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'student':       return <Navigate to="/student/dashboard" replace />;
    case 'alumni':        return <Navigate to="/alumni/dashboard" replace />;
    case 'collegeAdmin':  return <Navigate to="/admin/college" replace />;
    case 'superAdmin':    return <Navigate to="/admin/super" replace />;
    default:              return <Navigate to="/login" replace />;
  }
};

// All authenticated, including superAdmin
const ALL_ROLES = ['student', 'alumni', 'collegeAdmin', 'superAdmin'];
// Feature roles — superAdmin EXCLUDED
const USER_ROLES = ['student', 'alumni', 'collegeAdmin'];

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#f1f5f9',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            {/* ── Public ── */}
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/"       element={<RoleRedirect />} />

            {/* ── All authenticated users ── */}
            <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
              <Route element={<DashboardLayout />}>

                {/* Role-specific dashboards */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/alumni/dashboard"  element={<AlumniDashboard />} />
                <Route path="/admin/college"     element={<CollegeAdminDashboard />} />
                <Route path="/admin/super"       element={<SuperAdminDashboard />} />

                {/* ── Non-superAdmin pages only ─────────────────────────────
                    superAdmin is a platform owner; they do NOT use mentorship,
                    referrals, AI, pricing, or personal profiles.
                    Attempting to navigate to these as superAdmin redirects to /admin/super.
                ─────────────────────────────────────────────────────────── */}
                <Route element={<ProtectedRoute allowedRoles={USER_ROLES} />}>
                  <Route path="/profile"    element={<Profile />} />
                  <Route path="/directory"  element={<Directory />} />
                  <Route path="/mentorship" element={<Mentorship />} />
                  <Route path="/referrals"  element={<Referrals />} />
                  <Route path="/ai"         element={<CopilotAI />} />
                  <Route path="/pricing"    element={<Pricing />} />
                </Route>

              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

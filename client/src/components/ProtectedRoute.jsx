import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const getRoleHome = (role) => {
  switch (role) {
    case 'student':      return '/student/dashboard';
    case 'alumni':       return '/alumni/dashboard';
    case 'collegeAdmin': return '/admin/college';
    case 'superAdmin':   return '/admin/super';
    default:             return '/student/dashboard';
  }
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading Campus Nexus...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // If route restricts to specific roles, enforce it
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

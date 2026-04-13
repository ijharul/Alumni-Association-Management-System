import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

// Campus Nexus logo SVG
const NexusLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#0ea5e9" />
    <circle cx="16" cy="8" r="2.5" fill="white" />
    <circle cx="7" cy="24" r="2.5" fill="white" />
    <circle cx="25" cy="24" r="2.5" fill="white" />
    <circle cx="16" cy="18" r="2" fill="white" fillOpacity="0.75" />
    <line x1="16" y1="10.5" x2="16" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14.5" y1="19.5" x2="8.5" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="17.5" y1="19.5" x2="23.5" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Role-based redirect helper (matches App.jsx)
const getRoleHome = (role) => {
  switch (role) {
    case 'student':     return '/student/dashboard';
    case 'alumni':      return '/alumni/dashboard';
    case 'collegeAdmin': return '/admin/college';
    case 'superAdmin':  return '/admin/super';
    default:            return '/student/dashboard';
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) {
      navigate(getRoleHome(result.user?.role));
    } else {
      setError(result.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-300 bg-gradient-to-br from-sky-50 via-white to-blue-100 dark:bg-slate-900 dark:bg-none py-12 px-4">
      {/* Overlay for dark */}
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-sky-950 pointer-events-none" />
      {/* Blobs */}
      <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full bg-sky-300 dark:bg-sky-800 blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full bg-blue-300 dark:bg-blue-900 blur-[120px] opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <NexusLogo />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome to Campus Nexus
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your journey
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Inline error */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-[18px] w-[18px] text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-sky-50/50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-sky-50/50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shadow-md shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]">
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-sky-50/50 dark:bg-slate-800/50 border-t border-sky-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-5">
          Campus Nexus · Powered by NexStep AI
        </p>
      </div>
    </div>
  );
};

export default Login;

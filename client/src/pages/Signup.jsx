import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react';
import api from '../services/api';

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

const getRoleHome = (role) => {
  switch (role) {
    case 'student':      return '/student/dashboard';
    case 'alumni':       return '/alumni/dashboard';
    case 'collegeAdmin': return '/admin/college';
    case 'superAdmin':   return '/admin/super';
    default:             return '/student/dashboard';
  }
};

const fieldClass = "w-full pl-10 pr-4 py-2.5 rounded-lg bg-sky-50/50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 transition-all";

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', collegeId: '', pendingCollege: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch colleges for the picker
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await api.get('/colleges');
        setColleges(data);
      } catch {
        // silently fail — colleges list is optional
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Build args: pass pendingCollege if user selected 'other'
    const collegeId = form.collegeId === 'other' ? null : (form.collegeId || null);
    const result = await register(form.name, form.email, form.password, form.role, collegeId, form.pendingCollege || '');
    setIsSubmitting(false);
    if (result.success) {
      navigate(getRoleHome(result.user?.role));
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100 dark:bg-slate-900 py-12 px-4 transition-colors duration-300">
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-sky-950 pointer-events-none" />
      <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full bg-sky-300 dark:bg-sky-800 blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full bg-blue-300 dark:bg-blue-900 blur-[120px] opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center mb-4"><NexusLogo /></div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Join Campus Nexus</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Start your journey — free forever</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role toggle */}
              <div className="flex gap-2 p-1 bg-sky-50 dark:bg-slate-700/50 rounded-xl">
                {[{ v: 'student', label: '🎓 Student' }, { v: 'alumni', label: '💼 Alumni' }].map(({ v, label }) => (
                  <button key={v} type="button" onClick={() => setForm({ ...form, role: v })}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${form.role === v ? 'bg-sky-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><User className="h-[18px] w-[18px] text-slate-400 dark:text-slate-500" /></div>
                  <input name="name" type="text" required onChange={handleChange} placeholder="Jane Doe" className={fieldClass} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className="h-[18px] w-[18px] text-slate-400 dark:text-slate-500" /></div>
                  <input name="email" type="email" required onChange={handleChange} placeholder="you@college.edu" className={fieldClass} />
                </div>
              </div>

              {/* College picker */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your College
                  {colleges.length === 0 && !loadingColleges && (
                    <span className="ml-2 text-xs text-slate-400 font-normal">(No colleges yet)</span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Building2 className="h-[18px] w-[18px] text-slate-400 dark:text-slate-500" /></div>
                  <select name="collegeId" value={form.collegeId} onChange={handleChange}
                    className={`${fieldClass} appearance-none cursor-pointer`}
                    disabled={loadingColleges}>
                    <option value="">{loadingColleges ? 'Loading colleges...' : 'Select your college'}</option>
                    {colleges.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}{c.location ? ` — ${c.location}` : ''}</option>
                    ))}
                    <option value="other">👉 My college is not listed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                {/* Other college: show text input */}
                {form.collegeId === 'other' && (
                  <div className="mt-2">
                    <input
                      name="pendingCollege" value={form.pendingCollege || ''}
                      onChange={handleChange} placeholder="Enter your college name"
                      className={fieldClass}
                    />
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Your college will be added as pending and reviewed by the admin.</p>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="h-[18px] w-[18px] text-slate-400 dark:text-slate-500" /></div>
                  <input name="password" type={showPassword ? 'text' : 'password'} required onChange={handleChange} placeholder="Min. 6 characters"
                    className={`${fieldClass} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shadow-md shadow-sky-500/20 disabled:opacity-60 transition-all transform hover:scale-[1.01] active:scale-[0.99]">
                {isSubmitting
                  ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  : <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>
                }
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-sky-50/50 dark:bg-slate-800/50 border-t border-sky-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-5">Campus Nexus · Free forever · No credit card needed</p>
      </div>
    </div>
  );
};

export default Signup;

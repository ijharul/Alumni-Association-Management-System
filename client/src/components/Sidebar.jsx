import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  LayoutDashboard, Users, UserCheck, Inbox, Building, Sparkles,
  LogOut, Moon, Sun, Zap, ChevronRight, CreditCard,
  ShieldCheck, Globe,
} from 'lucide-react';

// ── Logo ──────────────────────────────────────────────────────────────────────
const NexusLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 shrink-0" xmlns="http://www.w3.org/2000/svg">
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

// ── Nav helpers ───────────────────────────────────────────────────────────────
const SectionLabel = ({ label }) => (
  <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
);

const NavDivider = () => <div className="h-px bg-slate-800 my-3" />;

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItem = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
      isActive
        ? 'bg-sky-500 text-white shadow-lg shadow-sky-900/30'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const role = user?.role;

  return (
    <div className="flex flex-col h-full w-64 shrink-0 bg-slate-900 border-r border-slate-800">

      {/* Brand */}
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-slate-800 shrink-0">
        <NexusLogo />
        <div className="leading-tight overflow-hidden">
          <span className="text-sm font-bold text-white tracking-tight block truncate">Campus Nexus</span>
          <span className="text-[10px] text-sky-400 font-medium">Powered by NexStep AI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">

        {/* ── STUDENT ── */}
        {role === 'student' && (
          <>
            <SectionLabel label="Student" />
            <NavLink to="/student/dashboard" className={navItem} end>
              <LayoutDashboard className="w-4 h-4 shrink-0" /> Dashboard
            </NavLink>
            <NavLink to="/directory" className={navItem}>
              <Users className="w-4 h-4 shrink-0" /> Network Directory
            </NavLink>
            <NavLink to="/mentorship" className={navItem}>
              <UserCheck className="w-4 h-4 shrink-0" /> My Mentors
            </NavLink>
            <NavLink to="/referrals" className={navItem}>
              <Building className="w-4 h-4 shrink-0" /> Referrals
            </NavLink>

            <NavDivider />
            <SectionLabel label="AI Features" />
            <NavLink to="/ai" className={navItem}>
              <Sparkles className="w-4 h-4 shrink-0" />
              NexStep AI
              <span className="ml-auto text-[10px] font-bold bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded-full">AI</span>
            </NavLink>
            <NavLink to="/pricing" className={navItem}>
              <CreditCard className="w-4 h-4 shrink-0" /> Upgrade Plan
            </NavLink>
          </>
        )}

        {/* ── ALUMNI ── */}
        {role === 'alumni' && (
          <>
            <SectionLabel label="Alumni" />
            <NavLink to="/alumni/dashboard" className={navItem} end>
              <LayoutDashboard className="w-4 h-4 shrink-0" /> Dashboard
            </NavLink>
            <NavLink to="/mentorship" className={navItem}>
              <UserCheck className="w-4 h-4 shrink-0" /> Mentorship Queue
            </NavLink>
            <NavLink to="/referrals" className={navItem}>
              <Inbox className="w-4 h-4 shrink-0" /> Referral Pipeline
            </NavLink>
          </>
        )}

        {/* ── COLLEGE ADMIN ── */}
        {role === 'collegeAdmin' && (
          <>
            <SectionLabel label="College Admin" />
            <NavLink to="/admin/college" className={navItem} end>
              <ShieldCheck className="w-4 h-4 shrink-0" /> College Dashboard
            </NavLink>
            <NavLink to="/directory" className={navItem}>
              <Users className="w-4 h-4 shrink-0" /> My College Users
            </NavLink>
          </>
        )}

        {/* ── SUPER ADMIN ── */}
        {role === 'superAdmin' && (
          <>
            <SectionLabel label="Super Admin" />
            <NavLink to="/admin/super" className={navItem} end>
              <Globe className="w-4 h-4 shrink-0" /> Global Dashboard
            </NavLink>
            <NavLink to="/directory" className={navItem}>
              <Users className="w-4 h-4 shrink-0" /> All Users
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3 space-y-2 shrink-0">
        {/* Token badge */}
        {role === 'student' && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60">
            <span className="text-xs text-slate-400">AI Tokens</span>
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> {user?.tokens ?? 0}
            </span>
          </div>
        )}

        {/* Profile link — hide for superAdmin */}
        {role !== 'superAdmin' && (
          <NavLink to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors group cursor-pointer">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-slate-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
          </NavLink>
        )}
        {/* SuperAdmin: just show name */}
        {role === 'superAdmin' && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-[11px] text-amber-400 truncate">Platform Owner</p>
            </div>
          </div>
        )}

        {/* Theme + Logout */}
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} title="Toggle theme"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-colors text-xs font-medium">
            {theme === 'light' ? <><Moon className="w-4 h-4" /> Dark</> : <><Sun className="w-4 h-4" /> Light</>}
          </button>
          <button onClick={handleLogout} title="Logout"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

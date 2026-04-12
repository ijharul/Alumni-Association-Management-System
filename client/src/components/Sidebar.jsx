import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Inbox, 
  Building, 
  Sparkles, 
  LogOut, 
  User,
  Moon,
  Sun
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) => `
    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 
    ${isActive 
      ? 'bg-indigo-500/10 text-indigo-400' 
      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
    }
  `;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-64 shrink-0 transition-all">
      {/* Brand Label */}
      <div className="flex items-center h-16 px-6 shrink-0 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <span className="text-white text-lg leading-none">A</span>
          </div>
          AlumniOS
        </h1>
      </div>

      {/* Primary Navigation Array */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
          {user?.role} Panel
        </div>
        
        <NavLink to="/" className={navItemClass} end>
          <LayoutDashboard className="mr-3 h-5 w-5 shrink-0" />
          Dashboard
        </NavLink>
        
        {user?.role === 'Student' && (
          <>
            <NavLink to="/directory" className={navItemClass}>
              <Users className="mr-3 h-5 w-5 shrink-0" />
              Network Directory
            </NavLink>
            <NavLink to="/mentorship" className={navItemClass}>
              <UserCheck className="mr-3 h-5 w-5 shrink-0" />
              My Mentors
            </NavLink>
            <NavLink to="/referrals" className={navItemClass}>
              <Building className="mr-3 h-5 w-5 shrink-0" />
              Corporate Referrals
            </NavLink>
            
            <div className="pt-4 pb-2">
               <div className="h-px bg-slate-800 w-full mb-4"></div>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Intelligence</div>
            </div>
            
            <NavLink to="/ai" className={navItemClass}>
              <Sparkles className="mr-3 h-5 w-5 shrink-0 text-indigo-400 group-hover:text-indigo-300" />
              Careers Copilot
            </NavLink>
          </>
        )}

        {user?.role === 'Alumni' && (
          <>
            <NavLink to="/mentorship" className={navItemClass}>
              <UserCheck className="mr-3 h-5 w-5 shrink-0" />
              Mentorship Queue
            </NavLink>
            <NavLink to="/referrals" className={navItemClass}>
              <Inbox className="mr-3 h-5 w-5 shrink-0" />
              Referral Pipeline
            </NavLink>
          </>
        )}
      </div>

      {/* Profiler Footer Block */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between mb-2">
          <NavLink to="/profile" className="flex items-center gap-3 overflow-hidden rounded-lg p-2 hover:bg-slate-800 transition-colors w-full group">
             <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all shrink-0">
               <User className="w-5 h-5" />
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-medium text-slate-200 truncate">{user?.name}</span>
               <span className="text-xs text-slate-500 truncate">{user?.email}</span>
             </div>
          </NavLink>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
          <button 
             onClick={toggleTheme}
             className="flex-1 flex justify-center p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 rounded-lg transition-colors"
             title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          <button 
             onClick={handleLogout}
             className="flex-1 flex justify-center p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
             title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

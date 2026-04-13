import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserCheck, Inbox, ArrowRight, Users, TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

const ActionCard = ({ to, icon: Icon, iconBg, iconColor, title, description }) => (
  <Link to={to}
    className="group flex items-start gap-4 bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${iconBg} shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:gap-2 transition-all">
        View <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </Link>
);

const getTimeOfDay = () => {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
};

const AlumniDashboard = () => {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  const firstName = user.name?.split(' ')[0] ?? 'Alumni';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Good {getTimeOfDay()}, <span className="text-sky-600 dark:text-sky-400">{firstName}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your mentorships and referral pipeline.
          </p>
        </div>
        <div className="shrink-0">
          <Link to="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors">
            Edit Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white shadow-lg shadow-sky-500/20">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-1">💡 Impact</p>
          <h2 className="text-lg font-bold">You're shaping the next generation</h2>
          <p className="text-sm text-sky-100 mt-1">Your mentorship and referrals directly impact students' career trajectories.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Your College" value={user.college || '—'} icon={Users} color="text-sky-500" />
        <StatCard label="Company" value={user.company || '—'} icon={TrendingUp} color="text-emerald-500" />
        <StatCard label="Current Role" value={user.currentRole || '—'} icon={UserCheck} color="text-blue-500" />
      </div>

      {/* Action cards */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Your Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ActionCard to="/mentorship"
            icon={UserCheck} iconBg="bg-sky-50 dark:bg-sky-500/10" iconColor="text-sky-600 dark:text-sky-400"
            title="Mentorship Queue"
            description="Review and approve incoming requests from students seeking guidance in your domain." />
          <ActionCard to="/referrals"
            icon={Inbox} iconBg="bg-blue-50 dark:bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400"
            title="Referral Pipeline"
            description="Evaluate incoming candidate resumes. Accept or reject referral requests for your company." />
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;

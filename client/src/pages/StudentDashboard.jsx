import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Users, Building, Sparkles, ArrowRight, Zap, TrendingUp, Star, FileText, BookOpen } from 'lucide-react';

const FeatureCard = ({ to, icon: Icon, iconBg, iconColor, title, description, badge }) => (
  <Link to={to}
    className="group relative flex flex-col bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-500/0 group-hover:from-sky-500/[0.03] group-hover:to-blue-500/[0.05] transition-all duration-300 rounded-xl" />
    <div className="relative">
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${iconBg} mb-4`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {badge && (
        <span className="absolute top-0 right-0 text-[10px] font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">{badge}</span>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:gap-2 transition-all">
        Get started <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  </Link>
);

const QuickTile = ({ to, icon: Icon, label, color, bg }) => (
  <Link to={to}
    className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center group">
    <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{label}</span>
  </Link>
);

const getTimeOfDay = () => {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
};

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  const firstName = user.name?.split(' ')[0] ?? 'Student';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Good {getTimeOfDay()}, <span className="text-sky-600 dark:text-sky-400">{firstName}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your career acceleration hub is ready.</p>
        </div>
        {/* Stat chips */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Plan</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{user.plan ?? 'Free'}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AI Tokens</p>
            <p className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-0.5 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{user.tokens ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white shadow-lg shadow-sky-500/20">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-4 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-1">🚀 Quick Tip</p>
            <h2 className="text-lg font-bold">Complete your profile to unlock referrals</h2>
            <p className="text-sm text-sky-100 mt-1">Alumni are 3× more likely to refer students with a full profile.</p>
          </div>
          <Link to="/profile"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-sky-600 font-semibold text-sm rounded-xl shadow hover:bg-sky-50 transition-colors">
            Edit Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">What would you like to do?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard to="/directory" icon={Users}
            iconBg="bg-sky-50 dark:bg-sky-500/10" iconColor="text-sky-600 dark:text-sky-400"
            title="Find a Mentor" description="Browse our network of active alumni. Send mentorship requests directly to industry leaders." />
          <FeatureCard to="/referrals" icon={Building}
            iconBg="bg-blue-50 dark:bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400"
            title="Request Referrals" description="Found your dream job? Drop your resume to alumni at that company and ask for an internal referral." />
          <FeatureCard to="/ai" icon={Sparkles}
            iconBg="bg-emerald-50 dark:bg-emerald-500/10" iconColor="text-emerald-600 dark:text-emerald-400"
            title="NexStep AI" description="Analyze your resume, generate career roadmaps, and close skill gaps — powered by GenAI." badge="AI" />
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickTile to="/ai" icon={FileText} label="Analyze Resume" color="text-sky-500 dark:text-sky-400" bg="bg-sky-50 dark:bg-sky-500/10" />
          <QuickTile to="/ai" icon={TrendingUp} label="Career Roadmap" color="text-emerald-500 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" />
          <QuickTile to="/directory" icon={Star} label="Top Alumni" color="text-amber-500 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-500/10" />
          <QuickTile to="/pricing" icon={Zap} label="Upgrade Plan" color="text-blue-500 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-500/10" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

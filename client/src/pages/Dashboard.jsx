import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Users, Building, Sparkles, UserCheck, Inbox } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold leading-7 text-gray-900 border-b-4 border-brand-500 inline-block pb-2 cursor-default">
          Welcome back, {user.name.split(' ')[0]}!
        </h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          {user.role === 'Student' 
             ? "Your career acceleration hub is ready." 
             : "Your network management dashboard is active."}
        </p>
      </div>

      {user.role === 'Student' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/directory" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <Users className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Find a Mentor
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Browse our curated directory of active alumni. Send mentorship requests directly to industry leaders.
              </p>
            </div>
          </Link>

          <Link to="/referrals" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-sky-50 text-sky-700 ring-4 ring-white">
                <Building className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Request Referrals
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Found a dream job? Drop your Resume directly to Alumni working at that target company and ask for an internal referral!
              </p>
            </div>
          </Link>

          <Link to="/ai" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-emerald-50 text-emerald-700 ring-4 ring-white">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Career Copilot
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Utilize raw GenAI. Analyze your Resume syntax, plot active career roadmaps, or perform heavy skills gap matrices directly.
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link to="/mentorship" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-start gap-4">
            <div className="shrink-0">
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <UserCheck className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Manage Mentorships
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Review and approve incoming requests from students actively searching for guidance in your specific domain cluster.
              </p>
            </div>
          </Link>

          <Link to="/referrals" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-start gap-4">
            <div className="shrink-0">
              <span className="rounded-lg inline-flex p-3 bg-amber-50 text-amber-700 ring-4 ring-white">
                <Inbox className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                Evaluate Referrals
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Audit incoming candidate Resumes rapidly. Formally Accept/Reject corporate bounds matching active listings at your firm.
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

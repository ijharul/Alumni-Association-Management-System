import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import { Search, Briefcase, GraduationCap, Globe, Building2, Users, MapPin } from 'lucide-react';

const UserCard = ({ person, onMentorshipRequest }) => {
  const initials = person.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const collegeName = person.collegeId?.name || person.college || null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          {person.profilePicture ? (
            <img src={person.profilePicture} alt={person.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-100 dark:ring-slate-600" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-base">
              {initials}
            </div>
          )}
          {/* Batch badge */}
          {person.batch && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400">
              <GraduationCap className="w-3 h-3" /> {person.batch}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{person.name}</h3>
        {person.currentRole && (
          <p className="text-sm text-sky-600 dark:text-sky-400 font-medium mt-0.5">{person.currentRole}</p>
        )}
        {person.company && (
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            <Briefcase className="w-3.5 h-3.5 shrink-0" /> {person.company}
          </p>
        )}
        {collegeName && (
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
            <Building2 className="w-3 h-3 shrink-0" /> {collegeName}
          </p>
        )}

        {/* Skills */}
        {person.skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {person.skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20">
                {skill}
              </span>
            ))}
            {person.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] text-slate-400">+{person.skills.length - 4}</span>
            )}
          </div>
        )}

        {person.bio && (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{person.bio}</p>
        )}
      </div>

      <div className="px-6 py-4 bg-sky-50/50 dark:bg-slate-800/50 border-t border-sky-50 dark:border-slate-700 shrink-0">
        <button
          onClick={() => onMentorshipRequest(person._id)}
          className="w-full py-2 px-4 text-sm font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 text-white transition-colors">
          Request Mentorship
        </button>
      </div>
    </div>
  );
};

const Directory = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGlobal, setIsGlobal] = useState(false);   // college-scoped by default
  const [filters, setFilters] = useState({ company: '', skills: '', role: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (isGlobal)       params.append('global', 'true');
      if (filters.company) params.append('company', filters.company);
      if (filters.skills)  params.append('skills', filters.skills);

      const { data } = await api.get(`/users?${params.toString()}`);
      setUsers(data);
    } catch {
      toast.error('Failed to load directory.');
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever global toggle changes
  useEffect(() => { fetchUsers(); }, [isGlobal]);

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(); };

  const handleMentorshipRequest = async (mentorId) => {
    try {
      await api.post('/mentorship/request', {
        mentorId,
        message: 'Hello, I would love to connect and seek your mentorship!',
      });
      toast.success('Mentorship request sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request.');
    }
  };

  const collegeName = user?.collegeId?.name ?? 'your college';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Network Directory</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isGlobal ? 'Showing alumni from all colleges globally.' : `Showing alumni from your college.`}
          </p>
        </div>

        {/* Global toggle */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
          <Globe className={`w-4 h-4 transition-colors ${isGlobal ? 'text-sky-500' : 'text-slate-400'}`} />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {isGlobal ? 'Global Network' : 'My College Only'}
          </span>
          <button
            onClick={() => setIsGlobal(!isGlobal)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isGlobal ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            role="switch" aria-checked={isGlobal}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isGlobal ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-5 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Role</label>
            <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full py-2.5 px-3 text-sm rounded-lg bg-sky-50/50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer">
              <option value="">All Users</option>
              <option value="alumni">Alumni</option>
              <option value="student">Students</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Company</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                placeholder="e.g. Google, Meta, Amazon" className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-sky-50/50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Skills</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={filters.skills} onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                placeholder="e.g. React, Python, ML" className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-sky-50/50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" />
            </div>
          </div>
          <button type="submit"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            <Search className="w-4 h-4" /> Search
          </button>
        </form>
      </div>


      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-slate-700" />
                <div className="flex-1">
                  <div className="h-3 bg-sky-100 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-2.5 bg-sky-50 dark:bg-slate-600 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-sky-50 dark:bg-slate-700 rounded" />
                <div className="h-2.5 bg-sky-50 dark:bg-slate-700 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-600 dark:text-slate-400">No alumni found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {isGlobal ? 'No alumni match your filters.' : 'Try enabling Global Network to explore beyond your college.'}
          </p>
          {!isGlobal && (
            <button onClick={() => setIsGlobal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors">
              <Globe className="w-4 h-4" /> Explore Global Network
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Found <span className="font-semibold text-slate-700 dark:text-slate-300">{users.length}</span> alumni
            {isGlobal ? ' globally' : ' in your college'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((person) => (
              <UserCard key={person._id} person={person} onMentorshipRequest={handleMentorshipRequest} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Directory;

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import UserDetailModal from '../components/UserDetailModal';
import {
  Users, GraduationCap, UserCheck, Zap, Search, ShieldCheck,
  CheckCircle2, XCircle, Clock, Loader2, Eye,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => {
  const c = { sky:'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400', blue:'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', emerald:'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', amber:'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' };
  return (
    <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span><div className={`p-2 rounded-lg ${c[color]}`}><Icon className="w-4 h-4" /></div></div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

const CollegeAdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [approvingId, setApprovingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try { const { data } = await api.get('/users/all'); setUsers(data); }
    catch { toast.error('Failed to load college members.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApprove = async (userId, approve) => {
    setApprovingId(userId);
    try {
      const { data } = await api.put(`/users/${userId}/approve`, { approved: approve });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isApproved: data.user.isApproved } : u));
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
    finally { setApprovingId(null); }
  };

  const students       = users.filter(u => u.role === 'student').length;
  const alumni         = users.filter(u => u.role === 'alumni').length;
  const paid           = users.filter(u => u.plan !== 'Free').length;
  const pendingAlumni  = users.filter(u => u.role === 'alumni' && u.isApproved === false);

  const filtered = users.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const mr = roleFilter === 'All' || u.role === roleFilter;
    return ms && mr;
  });

  return (
    <div className="space-y-8">
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1"><ShieldCheck className="w-4 h-4 text-sky-500" /><span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">College Admin</span></div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">College Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your college's students and alumni.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Total Members" value={users.length} color="sky" />
        <StatCard icon={GraduationCap} label="Students"  value={students}      color="blue" />
        <StatCard icon={UserCheck}  label="Alumni"        value={alumni}        color="emerald" />
        <StatCard icon={Zap}        label="Paid Plans"    value={paid}          color="amber" />
      </div>

      {/* Pending Approvals */}
      {pendingAlumni.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-4"><Clock className="w-4 h-4" /> Pending Alumni Approvals ({pendingAlumni.length})</h3>
          <div className="space-y-2">
            {pendingAlumni.map(u => {
              const init = u.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
              return (
                <div key={u._id} className="flex items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-amber-100 dark:border-slate-700 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.profilePicture?<img src={u.profilePicture} className="w-8 h-8 rounded-full object-cover" alt={u.name}/>:<div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{init}</div>}
                    <div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{u.name}</p><p className="text-xs text-slate-400">{u.email}{u.company&&` · ${u.company}`}</p></div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={()=>setSelectedUser(u)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-sky-50 rounded-lg transition-colors"><Eye className="w-3.5 h-3.5"/>View</button>
                    <button onClick={()=>handleApprove(u._id,true)} disabled={approvingId===u._id} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 rounded-lg disabled:opacity-60">{approvingId===u._id?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<CheckCircle2 className="w-3.5 h-3.5"/>}Approve</button>
                    <button onClick={()=>handleApprove(u._id,false)} disabled={approvingId===u._id} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 rounded-lg disabled:opacity-60"><XCircle className="w-3.5 h-3.5"/>Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-sky-50 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Members <span className="text-sm font-normal text-slate-400">({filtered.length})</span></h2>
          <div className="flex items-center gap-2">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="pl-9 pr-4 py-2 text-sm rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 w-44"/></div>
            <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="text-sm py-2 px-3 rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
              <option value="All">All</option><option value="student">Students</option><option value="alumni">Alumni</option>
            </select>
          </div>
        </div>
        {loading?<div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        :filtered.length===0?<div className="py-16 text-center text-slate-400 text-sm">No members found.</div>
        :(
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-sky-50 dark:border-slate-700">{['Member','Role','Plan','Tokens','Status','Actions'].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-sky-50/50 dark:divide-slate-700/30">
                {filtered.map(u=>{
                  const init=u.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
                  const isAlumni=u.role==='alumni';
                  return(
                    <tr key={u._id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-3.5"><div className="flex items-center gap-3">{u.profilePicture?<img src={u.profilePicture} className="w-8 h-8 rounded-full object-cover" alt={u.name}/>:<div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{init}</div>}<div><p className="font-medium text-slate-900 dark:text-slate-100">{u.name}</p><p className="text-xs text-slate-400 truncate max-w-[130px]">{u.email}</p></div></div></td>
                      <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role==='student'?'bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400':'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>{u.role}</span></td>
                      <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.plan==='Free'?'bg-slate-100 dark:bg-slate-700 text-slate-500':'bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400'}`}>{u.plan}</span></td>
                      <td className="px-5 py-3.5 text-sky-600 dark:text-sky-400 font-semibold text-xs">⚡ {u.tokens??0}</td>
                      <td className="px-5 py-3.5">{isAlumni?(u.isApproved===false?<span className="flex items-center gap-1 text-xs font-medium text-amber-500"><Clock className="w-3.5 h-3.5"/>Pending</span>:<span className="flex items-center gap-1 text-xs font-medium text-emerald-500"><CheckCircle2 className="w-3.5 h-3.5"/>Approved</span>):<span className="text-xs text-slate-400">—</span>}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={()=>setSelectedUser(u)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-lg transition-colors"><Eye className="w-3.5 h-3.5"/>View</button>
                          {isAlumni&&(u.isApproved===false
                            ?<button onClick={()=>handleApprove(u._id,true)} disabled={approvingId===u._id} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 rounded-lg disabled:opacity-60">{approvingId===u._id?<Loader2 className="w-3 h-3 animate-spin"/>:<CheckCircle2 className="w-3 h-3"/>}Approve</button>
                            :<button onClick={()=>handleApprove(u._id,false)} disabled={approvingId===u._id} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 rounded-lg disabled:opacity-60"><XCircle className="w-3 h-3"/>Revoke</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;

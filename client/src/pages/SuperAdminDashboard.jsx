import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import UserDetailModal from '../components/UserDetailModal';
import {
  Globe, Plus, Users, GraduationCap, Building2, Search,
  X, Loader2, Trash2, UserCog, CheckCircle2, AlertCircle,
  TrendingUp, Zap, BarChart3, IndianRupee, UserPlus, Eye,
} from 'lucide-react';

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const c = {
    sky:     'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400',
    blue:    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber:   'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    purple:  'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };
  return (
    <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
        <div className={`p-2 rounded-lg ${c[color] || c.sky}`}><Icon className="w-4 h-4" /></div>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
};

// ── Revenue Card ─────────────────────────────────────────────────────────────
const RevenueCard = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
      <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-500/10">
        <IndianRupee className="w-4 h-4 text-sky-500" />
      </div>
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{value.toLocaleString('en-IN')}</p>
    <p className="text-xs text-sky-500 font-medium mt-1">Estimated from plan subscriptions</p>
  </div>
);

// ── Assign Admin Modal ────────────────────────────────────────────────────────
const AssignAdminModal = ({ college, allUsers, onAssign, onClose }) => {
  const [tab, setTab] = useState('new');               // 'new' | 'existing'
  const [newForm, setNewForm] = useState({ name: '', email: '', password: '' });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [busy, setBusy] = useState(false);

  const eligibleUsers = allUsers.filter(u =>
    ['student', 'alumni', 'collegeAdmin'].includes(u.role) &&
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const handleCreateNew = async (e) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email || !newForm.password) { toast.error('All fields required.'); return; }
    setBusy(true);
    try {
      const { data } = await api.post(`/colleges/${college._id}/create-admin`, newForm);
      toast.success(data.message);
      onAssign(data);
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setBusy(false); }
  };

  const handleAssignExisting = async () => {
    if (!selectedUserId) { toast.error('Select a user.'); return; }
    setBusy(true);
    try {
      const { data } = await api.put(`/colleges/${college._id}/assign-admin`, { userId: selectedUserId });
      toast.success(data.message);
      onAssign(data);
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-sky-50 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><UserCog className="w-4 h-4 text-sky-500" /> Assign Admin</h3>
            <p className="text-xs text-slate-400 mt-0.5">For: <span className="font-semibold text-sky-600 dark:text-sky-400">{college.name}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sky-50 dark:border-slate-700 px-5 pt-3">
          {[['new', 'Create New Admin'], ['existing', 'Assign Existing User']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`text-sm font-semibold pb-2.5 mr-4 border-b-2 transition-colors ${tab === key ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'new' ? (
            <form onSubmit={handleCreateNew} className="space-y-3">
              {[['name','Full Name','text'], ['email','Email Address','email'], ['password','Password','password']].map(([k, ph, t]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{ph}</label>
                  <input type={t} value={newForm[k]} onChange={e => setNewForm({...newForm,[k]:e.target.value})} placeholder={ph}
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" />
                </div>
              ))}
              <button type="submit" disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 mt-1">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {busy ? 'Creating…' : 'Create & Assign Admin'}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-sky-100 dark:border-slate-700 divide-y divide-sky-50 dark:divide-slate-700">
                {eligibleUsers.length === 0 ? <div className="py-8 text-center text-sm text-slate-400">No users found.</div>
                  : eligibleUsers.map(u => {
                    const init = u.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
                    return (
                      <label key={u._id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-sky-50/50 dark:hover:bg-slate-700/30 ${selectedUserId===u._id?'bg-sky-50 dark:bg-sky-500/10':''}`}>
                        <input type="radio" name="eu" value={u._id} checked={selectedUserId===u._id} onChange={()=>setSelectedUserId(u._id)} className="accent-sky-500" />
                        {u.profilePicture?<img src={u.profilePicture} className="w-7 h-7 rounded-full object-cover shrink-0" alt={u.name}/>
                          :<div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{init}</div>}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </label>
                    );
                  })
                }
              </div>
              <button onClick={handleAssignExisting} disabled={busy||!selectedUserId}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCog className="w-4 h-4" />}
                {busy ? 'Assigning…' : 'Assign as Admin'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const SuperAdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [colleges, setColleges] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: '', location: '', domain: '' });
  const [search, setSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [assignModal, setAssignModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      const [c, u, a] = await Promise.all([api.get('/colleges'), api.get('/users/all'), api.get('/analytics')]);
      setColleges(c.data);
      setAllUsers(u.data);
      setAnalytics(a.data);
    } catch { toast.error('Failed to load dashboard data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!newCollege.name.trim()) { toast.error('College name is required'); return; }
    setCreating(true);
    try {
      const { data } = await api.post('/colleges', newCollege);
      setColleges(prev => [...prev, data]);
      setNewCollege({ name: '', location: '', domain: '' });
      setShowCreateForm(false);
      toast.success(`"${data.name}" created!`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (college) => {
    if (!window.confirm(`Delete "${college.name}"? All users will be unlinked.`)) return;
    setDeletingId(college._id);
    try {
      await api.delete(`/colleges/${college._id}`);
      setColleges(prev => prev.filter(c => c._id !== college._id));
      toast.success(`"${college.name}" deleted.`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setDeletingId(null); }
  };

  const handleAdminAssigned = (data) => {
    if (data.college) setColleges(prev => prev.map(c => c._id === data.college._id ? data.college : c));
    if (data.user) setAllUsers(prev => prev.map(u => u._id === data.user._id ? { ...u, role: data.user.role } : u));
    fetchData();
  };

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || (c.location||'').toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole   = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-8">
      {/* Modals */}
      {assignModal  && <AssignAdminModal college={assignModal} allUsers={allUsers} onAssign={handleAdminAssigned} onClose={() => setAssignModal(null)} />}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Super Admin</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all colleges, users, and platform analytics.</p>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-sky-500/20">
          {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreateForm ? 'Cancel' : 'Add College'}
        </button>
      </div>

      {/* Create College Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-600 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-5"><Building2 className="w-4 h-4 text-sky-500" /> New College Details</h3>
          <form onSubmit={handleCreateCollege} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{k:'name',p:'IIT Bombay',l:'College Name *',r:true},{k:'location',p:'Mumbai, India',l:'Location'},{k:'domain',p:'iitb.ac.in',l:'Email Domain'}].map(({k,p,l,r})=>(
              <div key={k}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{l}</label>
                <input value={newCollege[k]} required={r} onChange={e=>setNewCollege({...newCollege,[k]:e.target.value})} placeholder={p}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" />
              </div>
            ))}
            <div className="sm:col-span-3 flex justify-end">
              <button type="submit" disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-md shadow-sky-500/20">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {creating ? 'Creating…' : 'Create College'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Analytics ── */}
      {analytics && (
        <>
          {/* Revenue */}
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4"><IndianRupee className="w-4 h-4 text-sky-500" /> Revenue Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <RevenueCard label="Weekly" value={analytics.revenue.weekly} />
              <RevenueCard label="Monthly" value={analytics.revenue.monthly} />
              <RevenueCard label="Yearly" value={analytics.revenue.yearly} />
              <RevenueCard label="All Time" value={analytics.revenue.allTime} />
            </div>
          </div>

          {/* Platform stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={analytics.users.total} sub={`+${analytics.users.weekly} this week`} color="sky" />
            <StatCard icon={Building2} label="Colleges" value={analytics.colleges.total} color="blue" />
            <StatCard icon={Zap} label="AI Tokens Used" value={analytics.ai.totalTokensConsumed.toLocaleString()} color="amber" />
            <StatCard icon={BarChart3} label="Paid Plans" value={analytics.users.planBreakdown.monthly + analytics.users.planBreakdown.yearly} sub={`${analytics.users.planBreakdown.free} on Free`} color="emerald" />
          </div>

          {/* Role breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={GraduationCap} label="Students" value={analytics.users.roleBreakdown.students} color="sky" />
            <StatCard icon={Users} label="Alumni" value={analytics.users.roleBreakdown.alumni} color="emerald" />
            <StatCard icon={UserCog} label="College Admins" value={analytics.users.roleBreakdown.admins} color="blue" />
          </div>
        </>
      )}

      {/* ── Colleges Table ── */}
      <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-sky-50 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">All Colleges <span className="text-sm font-normal text-slate-400">({filteredColleges.length})</span></h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search colleges…"
              className="pl-9 pr-4 py-2 text-sm rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 w-52" />
          </div>
        </div>
        {loading ? <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        : filteredColleges.length === 0 ? <div className="py-16 text-center"><Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" /><p className="text-sm text-slate-400">No colleges yet.</p></div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-50 dark:border-slate-700">
                  {['College','Location','Domain','Admin','Actions'].map(h=>(
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50/50 dark:divide-slate-700/30">
                {filteredColleges.map(c=>(
                  <tr key={c._id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{c.name[0].toUpperCase()}</div><span className="font-medium text-slate-900 dark:text-slate-100">{c.name}</span></div></td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-sm">{c.location||'—'}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{c.domain||'—'}</td>
                    <td className="px-5 py-3.5">
                      {c.adminId?<div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0"/><span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{c.adminId.name}</span></div>
                      :<div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium"><AlertCircle className="w-3.5 h-3.5 shrink-0"/>Unassigned</div>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>setAssignModal(c)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 rounded-lg transition-colors"><UserCog className="w-3.5 h-3.5"/>Admin</button>
                        <button onClick={()=>handleDelete(c)} disabled={deletingId===c._id} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-60">
                          {deletingId===c._id?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Trash2 className="w-3.5 h-3.5"/>}Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── All Users Table ── */}
      <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-sky-50 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">All Users <span className="text-sm font-normal text-slate-400">({filteredUsers.length})</span></h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search users…"
                className="pl-9 pr-4 py-2 text-sm rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 w-44" />
            </div>
            <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}
              className="text-sm py-2 px-3 rounded-lg bg-sky-50 dark:bg-slate-700 border border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
              <option value="All">All Roles</option>
              <option value="student">Students</option>
              <option value="alumni">Alumni</option>
              <option value="collegeAdmin">Admins</option>
            </select>
          </div>
        </div>
        {loading ? <div className="py-12 text-center text-slate-400 text-sm">Loading…</div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-50 dark:border-slate-700">
                  {['User','Role','College','Plan','Tokens',''].map((h,i)=>(
                    <th key={i} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50/50 dark:divide-slate-700/30">
                {filteredUsers.map(u=>{
                  const init=u.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
                  return(
                    <tr key={u._id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {u.profilePicture?<img src={u.profilePicture} className="w-7 h-7 rounded-full object-cover shrink-0" alt={u.name}/>:<div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">{init}</div>}
                          <div><p className="font-medium text-slate-900 dark:text-slate-100">{u.name}</p><p className="text-xs text-slate-400 truncate max-w-[140px]">{u.email}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role==='student'?'bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400':u.role==='alumni'?'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400':u.role==='collegeAdmin'?'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400':'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400'}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-sm">{u.collegeId?.name||u.pendingCollege||'—'}</td>
                      <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.plan==='Free'?'bg-slate-100 dark:bg-slate-700 text-slate-500':'bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400'}`}>{u.plan}</span></td>
                      <td className="px-5 py-3.5 text-sky-600 dark:text-sky-400 font-semibold text-xs">⚡ {u.tokens??0}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={()=>setSelectedUser(u)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-slate-600 rounded-lg transition-colors">
                          <Eye className="w-3.5 h-3.5"/>View
                        </button>
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

export default SuperAdminDashboard;

import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import { BuildingIcon, Link as LinkIcon, Check, X } from 'lucide-react';

const Referrals = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exposes specific modal structure for new Referrals since we need explicit user inputs mapped 
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ alumniId: '', company: '', role: '', jobType: 'full-time', resume: '', message: '' });
  const [alumniList, setAlumniList] = useState([]);

  const fetchRequests = async () => {
    try {
      const endpoint = user?.role === 'Student' ? '/referrals/my-requests' : '/referrals/incoming';
      const { data } = await api.get(endpoint);
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load active referral boundaries');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumniList = async () => {
    try {
      const { data } = await api.get('/users?role=Alumni');
      setAlumniList(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
      if (user.role === 'Student') fetchAlumniList();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/referrals/${id}`, { status });
      toast.success(`Referral tracking shifted strictly to ${status}.`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to parse specific update layout.');
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/referrals/request', formData);
      toast.success('Referral actively deployed to the Alumni!');
      setShowModal(false);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize referral constraint');
    }
  };

  const StatusBadge = ({ status }) => {
    const maps = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md border shadow-sm ${maps[status] || 'bg-gray-100 text-gray-800'}`}>{status.toUpperCase()}</span>;
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Mapping global referral scopes...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 dark:border-slate-700 pb-5 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 border-b-4 border-indigo-500 dark:border-purple-500 inline-block pb-1">
          {user?.role === 'Student' ? 'My Referrals Pipeline' : 'Referral Pipeline Approvals'}
        </h2>
        {user?.role === 'Student' && (
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-4 py-2 rounded-md font-medium text-sm shadow transition-colors">
            + Draft New Referral
          </button>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 border-dashed">
           <BuildingIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-600 mb-3" />
           <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">No active tracking matrices</h3>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the directory architecture to establish bonds seamlessly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => {
            const targetUser = user?.role === 'Student' ? req.alumni : req.student;
            if (!targetUser) return null;

            return (
              <div key={req._id} className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 flex flex-col p-6 hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 outline outline-slate-200 dark:outline-slate-700 outline-1">
                          {targetUser.name.charAt(0)}
                       </div>
                       <div>
                         <h4 className="font-semibold text-gray-900 dark:text-gray-200 leading-tight">{targetUser.name}</h4>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{targetUser.company || 'Missing Corporate Binding'} • {targetUser.role}</p>
                       </div>
                    </div>
                    <StatusBadge status={req.status} />
                 </div>

                 <div className="mb-4 bg-gray-50 dark:bg-slate-900/50 rounded-md p-3 border border-gray-100 dark:border-slate-700 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase font-semibold">Target Company</span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{req.company}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase font-semibold">Target Role</span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{req.role}</span>
                      </div>
                      <div>
                        <span className="text-indigo-500 dark:text-purple-400 block text-xs uppercase font-semibold">Job Class</span>
                        <span className="font-bold text-indigo-700 dark:text-purple-300">{req.jobType?.toUpperCase() || 'FULL-TIME'}</span>
                      </div>
                    </div>
                 </div>

                 <div className="mb-4 flex-grow">
                    <a href={req.resume} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-purple-400 dark:hover:text-purple-300">
                       <LinkIcon className="h-4 w-4 mr-1" /> View Attached Resume
                    </a>
                    {req.message && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 italic border-l-2 border-gray-200 dark:border-slate-600 pl-3">"{req.message}"</p>}
                 </div>

                 {/* Action Bar */}
                 {user?.role === 'Alumni' && req.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
                       <button onClick={() => updateStatus(req._id, 'accepted')} className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4 mr-1" /> Endorse Candidate
                       </button>
                       <button onClick={() => updateStatus(req._id, 'rejected')} className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700">
                          <X className="h-4 w-4 mr-1" /> Decline
                       </button>
                    </div>
                 )}
              </div>
            );
          })}
        </div>
      )}

      {/* Draft Referral Modal Form */}
      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500/75 dark:bg-slate-900/80 transition-opacity" onClick={() => setShowModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 pb-8">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-gray-100 mb-6" id="modal-title">Request Corporate Referral</h3>
                  <form onSubmit={handleSendRequest} className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Alumni</label>
                       <select required onChange={(e) => setFormData({...formData, alumniId: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 sm:text-sm rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
                         <option value="">Select an active Alumni</option>
                         {alumniList.map(a => <option key={a._id} value={a._id}>{a.name} ({a.company})</option>)}
                       </select>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                         <input required type="text" onChange={(e) => setFormData({...formData, company: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100" />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exact Role Title</label>
                         <input required type="text" onChange={(e) => setFormData({...formData, role: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100" />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position Type</label>
                         <select required onChange={(e) => setFormData({...formData, jobType: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 sm:text-sm rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
                           <option value="full-time">Full-Time</option>
                           <option value="internship">Internship</option>
                           <option value="part-time">Part-Time</option>
                           <option value="contract">Contractor</option>
                         </select>
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume Link Array</label>
                       <input required type="url" placeholder="https://..." onChange={(e) => setFormData({...formData, resume: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100" />
                       <p className="text-xs text-indigo-600 dark:text-purple-400 mt-1 italic">We recommend pasting the direct link parsed from your Profile schema overrides.</p>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Personal Context</label>
                       <textarea rows={3} onChange={(e) => setFormData({...formData, message: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100" />
                     </div>
                     <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-slate-700 pt-4">
                       <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 dark:bg-purple-500 text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                         Dispatch Request
                       </button>
                       <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none transition-colors sm:mt-0 sm:w-auto sm:text-sm">
                         Cancel Layout
                       </button>
                     </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;

import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import { MessageSquare, Check, X } from 'lucide-react';

const Mentorship = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const endpoint = user?.role === 'Student' ? '/mentorship/my-requests' : '/mentorship/mentor-requests';
      const { data } = await api.get(endpoint);
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load mentorship boundaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/mentorship/${id}`, { status });
      toast.success(`Request ${status} effectively.`);
      fetchRequests(); // Refresh layout
    } catch (error) {
      toast.error('Failed to update status resolution');
    }
  };

  const StatusBadge = ({ status }) => {
    const maps = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${maps[status] || 'bg-gray-100 text-gray-800'}`}>{status.toUpperCase()}</span>;
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Mapping connection states...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold leading-7 text-gray-900 border-b-4 border-brand-500 inline-block pb-2">
          {user?.role === 'Student' ? 'My Outbound Requests' : 'Incoming Mentee Requests'}
        </h2>
      </div>

      {requests.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow border border-gray-200 border-dashed">
           <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
           <h3 className="text-lg font-medium text-gray-900">No active tracking sessions</h3>
           <p className="mt-1 text-sm text-gray-500">Mentorships will map here dynamically.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {requests.map((req) => {
              const targetUser = user?.role === 'Student' ? req.mentor : req.student;
              if (!targetUser) return null;

              return (
                 <li key={req._id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700">
                          {targetUser.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-600 truncate">{targetUser.name}</p>
                          <p className="text-sm text-gray-500 truncate">{targetUser.company || 'No Company Layout'} • {targetUser.skills?.slice(0,3).join(', ')}</p>
                          {req.message && <p className="mt-1 text-sm text-gray-600 italic">"{req.message}"</p>}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                         <StatusBadge status={req.status} />
                         
                         {user?.role === 'Alumni' && req.status === 'pending' && (
                           <div className="flex gap-2">
                             <button onClick={() => updateStatus(req._id, 'accepted')} className="p-1 rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                               <Check className="h-5 w-5" />
                             </button>
                             <button onClick={() => updateStatus(req._id, 'rejected')} className="p-1 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                               <X className="h-5 w-5" />
                             </button>
                           </div>
                         )}
                      </div>
                    </div>
                 </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Mentorship;

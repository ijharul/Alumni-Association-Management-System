import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Search, Briefcase, GraduationCap } from 'lucide-react';

const Directory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ company: '', skills: '' });

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('role', 'Alumni');
      if (search.company) queryParams.append('company', search.company);
      if (search.skills) queryParams.append('skills', search.skills);

      const { data } = await api.get(`/users?${queryParams.toString()}`);
      setAlumni(data);
    } catch (error) {
      toast.error('Failed to load networking directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleMentorshipRequest = async (alumniId) => {
    try {
      await api.post('/mentorship/request', {
        mentorId: alumniId,
        message: 'Hello, I would love to connect and seek your mentorship!'
      });
      toast.success('Mentorship request sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h2 className="text-3xl font-bold leading-7 text-gray-900 border-b-4 border-brand-500 pb-2">Alumni Network Directory</h2>
      </div>

      {/* Dynamic Filter Layout */}
      <div className="bg-white p-4 mb-8 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
             <input type="text" placeholder="Filter by Company (e.g. Meta)" value={search.company} onChange={(e) => setSearch({...search, company: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 p-2 border" />
          </div>
          <div className="flex-1 w-full">
             <input type="text" placeholder="Filter by Skills (e.g. React, Node)" value={search.skills} onChange={(e) => setSearch({...search, skills: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 p-2 border" />
          </div>
          <button type="submit" className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700">
            <Search className="h-4 w-4 mr-2" /> Search
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Querying internal networks...</p>
      ) : alumni.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
           <h3 className="text-lg font-medium text-gray-900">No Alumni Matches</h3>
           <p className="mt-1 text-sm text-gray-500">We couldn't find anyone matching those exact parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((person) => (
            <div key={person._id} className="bg-white rounded-lg shadow border border-gray-100 flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-brand-300">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-xl font-bold text-brand-600">
                    {person.name.charAt(0)}
                  </div>
                  {person.batch && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><GraduationCap className="w-3 h-3 mr-1"/> Class of {person.batch}</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                {person.company && <p className="text-sm text-brand-600 font-medium flex items-center mt-1"><Briefcase className="w-4 h-4 mr-1"/> {person.company}</p>}
                
                {person.skills && person.skills.length > 0 && (
                   <div className="mt-4 flex flex-wrap gap-2">
                     {person.skills.slice(0,4).map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800 border border-sky-300">
                           {skill}
                        </span>
                     ))}
                   </div>
                )}
                
                {person.bio && <p className="mt-4 text-sm text-gray-500 line-clamp-3">{person.bio}</p>}
              </div>
              <div className="bg-gray-50 p-4 shrink-0 flex gap-2">
                 <button onClick={() => handleMentorshipRequest(person._id)} className="flex-1 w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
                   Request Mentorship
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;

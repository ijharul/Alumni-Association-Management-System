import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Upload, User, Save, Plus, Trash2, Briefcase, GitBranch } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    company: '',
    college: '',
    currentRole: '',
    skills: '',
    batch: '',
    experience: [],
    projects: []
  });

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setProfile(data);
      
      setFormData({
        name: data.name || '',
        bio: data.bio || '',
        company: data.company || '',
        college: data.college || '',
        currentRole: data.currentRole || '',
        skills: data.skills ? data.skills.join(', ') : '',
        batch: data.batch || '',
        experience: data.experience || [],
        projects: data.projects || []
      });
    } catch (error) {
      toast.error('Failed to load profile parameters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Generic Array manipulators
  const handleAddArrayItem = (key, defaultObj) => {
    setFormData({ ...formData, [key]: [...formData[key], defaultObj] });
  };

  const handleRemoveArrayItem = (key, index) => {
    const arr = [...formData[key]];
    arr.splice(index, 1);
    setFormData({ ...formData, [key]: arr });
  };

  const handleArrayChange = (key, index, field, value) => {
    const arr = [...formData[key]];
    arr[index][field] = value;
    setFormData({ ...formData, [key]: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('bio', formData.bio);
    updateData.append('company', formData.company);
    updateData.append('college', formData.college);
    updateData.append('currentRole', formData.currentRole);
    updateData.append('skills', formData.skills);
    if (formData.batch) updateData.append('batch', formData.batch);
    if (file) updateData.append('resume', file);
    
    // Explicitly stringify the massive object arrays preventing multipart/form-data corruption natively.
    updateData.append('experience', JSON.stringify(formData.experience));
    updateData.append('projects', JSON.stringify(formData.projects));

    try {
      const { data } = await api.put('/users/profile', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(data);
      toast.success('Profile arrays synchronized actively!');
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile structure');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your metadata array...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full pb-10 space-y-6">
      
      {/* 1. Generic Profile Block */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <User className="h-5 w-5 text-indigo-500" /> Executive Identity Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Graduating Cohort / Year</label>
                <Input type="number" name="batch" value={formData.batch} onChange={handleChange} />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Role</label>
                <select name="currentRole" value={formData.currentRole} onChange={handleChange} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all appearance-none cursor-pointer bg-white">
                  <option value="">Select current scope</option>
                  <option value="student">Student</option>
                  <option value="intern">Intern</option>
                  <option value="employee">Full-Time Employee</option>
                  <option value="founder">Founder / Entrepreneur</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Institution / College</label>
                <Input type="text" name="college" placeholder="e.g. Stanford University" value={formData.college} onChange={handleChange} />
              </div>

               <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Associated Company</label>
                <Input type="text" name="company" placeholder="e.g. Google, Target, Meta" value={formData.company} onChange={handleChange} />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio Overview Array</label>
                <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all" placeholder="Quantify your life parameters..." />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Capabilities / Skills (Comma separated)</label>
                <Input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python, AWS" />
              </div>
            </div>
            
            {/* Extended Nested Array Sections */}
            
            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Briefcase className="h-4 w-4 text-brand-500" /> Career Experience Arrays</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem('experience', { role: '', company: '', duration: '', description: '' })}>
                     <Plus className="h-4 w-4 mr-1" /> Add Path
                  </Button>
               </div>
               
               <div className="space-y-4">
                  {formData.experience.map((exp, index) => (
                     <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                        <button type="button" className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => handleRemoveArrayItem('experience', index)}><Trash2 className="h-4 w-4"/></button>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pr-8">
                           <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase">Role</label>
                              <input type="text" value={exp.role} onChange={e => handleArrayChange('experience', index, 'role', e.target.value)} className="mt-1 w-full rounded border-slate-300 shadow-sm sm:text-sm py-1.5 px-2" placeholder="Frontend Engineer" />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase">Company</label>
                              <input type="text" value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} className="mt-1 w-full rounded border-slate-300 shadow-sm sm:text-sm py-1.5 px-2" />
                           </div>
                           <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 uppercase">Duration & Description</label>
                              <input type="text" value={exp.duration} onChange={e => handleArrayChange('experience', index, 'duration', e.target.value)} className="mt-1 w-full rounded border-slate-300 shadow-sm sm:text-sm py-1.5 px-2 mb-2" placeholder="e.g. May 2021 - Present" />
                              <textarea rows={2} value={exp.description} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} className="w-full rounded border-slate-300 shadow-sm sm:text-sm py-1.5 px-2" placeholder="..." />
                           </div>
                        </div>
                     </div>
                  ))}
                  {formData.experience.length === 0 && <p className="text-sm text-slate-500 italic">No historical nodes detected.</p>}
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2"><GitBranch className="h-4 w-4 text-brand-500" /> Open Source / Project Nodes</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem('projects', { title: '', techStack: [], description: '' })}>
                     <Plus className="h-4 w-4 mr-1" /> Add Project
                  </Button>
               </div>
               
               <div className="space-y-4">
                  {formData.projects.map((proj, index) => (
                     <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                        <button type="button" className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => handleRemoveArrayItem('projects', index)}><Trash2 className="h-4 w-4"/></button>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pr-8">
                           <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase">Project Title</label>
                              <input type="text" value={proj.title} onChange={e => handleArrayChange('projects', index, 'title', e.target.value)} className="mt-1 w-full rounded border-slate-300 shadow-sm sm:text-sm py-1.5 px-2" />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase">Tech Stack (Comma Separated Arrays)</label>
                              <input type="text" value={Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack} onChange={e => handleArrayChange('projects', index, 'techStack', e.target.value.split(',').map(s=>s.trim()))} className="mt-1 w-full rounded border-slate-300 shadow-sm sm:text-sm py-1.5 px-2" placeholder="React, Express, Redis" />
                           </div>
                           <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 uppercase">Impact Abstract</label>
                              <textarea rows={2} value={proj.description} onChange={e => handleArrayChange('projects', index, 'description', e.target.value)} className="mt-1 w-full rounded border-slate-300 shadow-sm sm:text-sm py-1.5 px-2" />
                           </div>
                        </div>
                     </div>
                  ))}
                  {formData.projects.length === 0 && <p className="text-sm text-slate-500 italic">No structural project vectors identified.</p>}
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume Core Override (PDF Only)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload an active file vector</span>
                        <input name="resume" type="file" accept="application/pdf" className="sr-only" onChange={handleFileChange} />
                      </label>
                    </div>
                    {file && <p className="text-xs text-green-600 font-semibold">{file.name} queued internally</p>}
                  </div>
                </div>
                {profile?.resume && (
                   <p className="mt-3 text-sm flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Currently Parsed PDF:</span> <a href={profile.resume} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Inspect Node</a>
                   </p>
                )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
              <Button type="submit" isLoading={saving} size="lg">
                <Save className="h-4 w-4 mr-2" />
                Overwrite Global Memory Hash
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

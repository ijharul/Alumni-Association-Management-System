import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, FileText, Map, Target, Network } from 'lucide-react';

const CopilotAI = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);
  
  // States mapped across individual UI tools
  const [resumeText, setResumeText] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [skillsData, setSkillsData] = useState({ current: '', target: '' });
  
  // Results bound independently
  const [resumeResult, setResumeResult] = useState(null);
  const [roadmapResult, setRoadmapResult] = useState(null);
  const [skillsResult, setSkillsResult] = useState(null);

  const handleCopyAi = async (endpoint, payload, setter) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/ai/${endpoint}`, payload);
      setter(data);
      toast.success('AI execution complete');
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI request crashed. Are keys mapped natively?');
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex space-x-1 rounded-xl bg-indigo-900/10 dark:bg-slate-800/50 p-1 mb-8">
      {['resume', 'roadmap', 'skills'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
            ${activeTab === tab 
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-purple-400 shadow shadow-indigo-200 dark:shadow-none' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-600 dark:hover:text-purple-300'
            }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'resume' ? 'Analyzer' : tab === 'roadmap' ? 'Generator' : 'Matrix'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center mb-10">
        <Sparkles className="mx-auto h-12 w-12 text-indigo-500 dark:text-purple-400 mb-4" />
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">NexStep AI</h2>
        <p className="mt-3 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">Your AI-powered career co-pilot — analyze resumes, generate roadmaps, and close your skills gap.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 sm:p-10">
          {renderTabs()}

          {/* 1. Resume Tool */}
          {activeTab === 'resume' && (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 flex items-center mb-4"><FileText className="w-5 h-5 mr-2 text-indigo-600 dark:text-purple-400"/> Resume Strategy Analyzer</h3>
              <textarea rows={6} className="w-full border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 p-3 mb-4 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="Paste your raw resume text right here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
              <button disabled={loading} onClick={() => handleCopyAi('analyze-resume', { resumeText }, setResumeResult)} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg shadow font-medium disabled:opacity-50 flex justify-center items-center transition-colors">
                 {loading ? 'Analyzing syntax layers...' : 'Analyze Resume Data'}
              </button>

              {resumeResult && (
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                       <h4 className="font-bold text-green-800 mb-2">Capabilities</h4>
                       <ul className="list-disc pl-4 text-sm text-green-900 space-y-1">
                          {resumeResult.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                       </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                       <h4 className="font-bold text-red-800 mb-2">Weaknesses</h4>
                       <ul className="list-disc pl-4 text-sm text-red-900 space-y-1">
                          {resumeResult.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                       </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                       <h4 className="font-bold text-blue-800 mb-2">Suggestions</h4>
                       <ul className="list-disc pl-4 text-sm text-blue-900 space-y-1">
                          {resumeResult.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                       </ul>
                    </div>
                 </div>
              )}
            </div>
          )}

          {/* 2. Roadmap Tool */}
          {activeTab === 'roadmap' && (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 flex items-center mb-4"><Map className="w-5 h-5 mr-2 text-indigo-600 dark:text-purple-400"/> Goal Pathway Generator</h3>
              <input type="text" className="w-full border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 p-3 mb-4 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 text-lg placeholder-gray-400 dark:placeholder-gray-500" placeholder="e.g. Senior Machine Learning Engineer" value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)} />
              <button disabled={loading} onClick={() => handleCopyAi('career-roadmap', { goal: careerGoal }, setRoadmapResult)} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg shadow font-medium disabled:opacity-50 transition-colors">
                 {loading ? 'Plotting structural targets...' : 'Generate Roadmap Constraints'}
              </button>

              {roadmapResult && (
                 <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                           <h4 className="font-bold text-indigo-900 dark:text-indigo-400 text-sm mb-2 uppercase">Required Constraints</h4>
                           <div className="flex flex-wrap gap-2">{roadmapResult.requiredSkills?.map((skill, i) => <span key={i} className="bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 px-2 py-1 rounded text-xs font-semibold shadow-sm">{skill}</span>)}</div>
                       </div>
                       <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                           <h4 className="font-bold text-purple-900 dark:text-purple-400 text-sm mb-2 uppercase">Recommended Tools</h4>
                           <div className="flex flex-wrap gap-2">{roadmapResult.recommendedTechnologies?.map((tech, i) => <span key={i} className="bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50 px-2 py-1 rounded text-xs font-semibold shadow-sm">{tech}</span>)}</div>
                       </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                       <h4 className="font-bold text-gray-900 dark:text-gray-200 mb-4 text-xl">Execution Pathway</h4>
                       <div className="space-y-4">
                          {roadmapResult.roadmap?.map((step, i) => (
                             <div key={i} className="flex gap-4">
                               <div className="flex flex-col items-center">
                                  <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-purple-500 text-white flex items-center justify-center font-bold">{i+1}</div>
                                  {i !== roadmapResult.roadmap.length - 1 && <div className="h-full w-0.5 bg-indigo-200 dark:bg-slate-700 my-1"></div>}
                               </div>
                               <div className="pb-4">
                                  <h5 className="font-bold text-gray-900 dark:text-gray-200 text-lg">{step.step}</h5>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{step.description}</p>
                               </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}
            </div>
          )}

          {/* 3. Skills Gap Tool */}
          {activeTab === 'skills' && (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 flex items-center mb-4"><Target className="w-5 h-5 mr-2 text-indigo-600 dark:text-purple-400"/> Competency Delta Matrix</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Current Skills (comma separated)</label>
                   <input type="text" className="w-full mt-1 border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 p-3 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="e.g. HTML, CSS, JavaScript" value={skillsData.current} onChange={(e) => setSkillsData({...skillsData, current: e.target.value})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Target Abstract Role</label>
                   <input type="text" className="w-full mt-1 border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 p-3 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="e.g. Principal Cloud Architect" value={skillsData.target} onChange={(e) => setSkillsData({...skillsData, target: e.target.value})} />
                </div>
              </div>

              <button disabled={loading} onClick={() => handleCopyAi('skills-gap', { currentSkills: skillsData.current.split(','), targetRole: skillsData.target }, setSkillsResult)} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg shadow font-medium disabled:opacity-50 transition-colors">
                 {loading ? 'Synthesizing delta variants...' : 'Execute Gap Analysis'}
              </button>

              {skillsResult && (
                 <div className="mt-8 space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-100 dark:border-red-900/50">
                       <h4 className="font-bold text-red-900 dark:text-red-400 text-lg mb-3 flex items-center gap-2"><Network className="w-5 h-5"/> Absent Capabilities</h4>
                       <div className="flex flex-wrap gap-2">
                          {skillsResult.missingSkills?.map((skill, i) => <span key={i} className="bg-white dark:bg-slate-900 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm border border-red-200 dark:border-red-800/50">{skill}</span>)}
                       </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                       <h4 className="font-bold text-blue-900 dark:text-blue-400 text-lg mb-4">Priority Learning Funnel</h4>
                       <ul className="space-y-4">
                          {skillsResult.priorityLearningList?.map((item, i) => (
                             <li key={i} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-blue-200 dark:border-slate-700">
                                <span className="font-bold text-indigo-700 dark:text-purple-400 text-lg block">{item.skill}</span>
                                <span className="text-gray-600 dark:text-gray-300 text-sm block mt-1">{item.reason}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopilotAI;

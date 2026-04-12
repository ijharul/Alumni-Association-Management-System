import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-200">
      {/* Fixed Sidebar bounds */}
      <Sidebar />
      
      {/* Master Workspace Context */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

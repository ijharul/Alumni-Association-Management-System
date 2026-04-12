import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, Sparkles } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-brand-600">AlumniOS<span className="text-gray-900">AI</span></Link>
            </div>
            
            {/* Show Nav Links Only when Authenticated */}
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="text-gray-500 hover:text-brand-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-brand-500 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/directory" className="text-gray-500 hover:text-brand-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-brand-500 text-sm font-medium transition-colors">
                  Directory
                </Link>
                <Link to="/mentorship" className="text-gray-500 hover:text-brand-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-brand-500 text-sm font-medium transition-colors">
                  Mentorship
                </Link>
                <Link to="/referrals" className="text-gray-500 hover:text-brand-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-brand-500 text-sm font-medium transition-colors">
                  Referrals
                </Link>
                <Link to="/ai" className="text-brand-500 hover:text-brand-600 inline-flex items-center space-x-1 px-1 pt-1 border-b-2 border-transparent hover:border-brand-500 text-sm font-medium transition-colors">
                  <Sparkles className="h-4 w-4" />
                  <span>Copilot</span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end mr-2">
                   <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{user.role} Panel</span>
                </div>
                
                <Link to="/profile" className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shadow-sm border border-brand-200">
                    <User className="h-5 w-5" />
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white p-2 rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
                <div className="space-x-4">
                  <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium text-sm">Log in</Link>
                  <Link to="/signup" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">Sign up</Link>
                </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Basic Mobile Menu toggle logic constraint */}
      {isMenuOpen && user && (
         <div className="sm:hidden bg-white border-t border-gray-200 p-4 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-brand-500">Dashboard</Link>
            <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-500">Sign Out</button>
         </div>
      )}
    </nav>
  );
};

export default Navbar;

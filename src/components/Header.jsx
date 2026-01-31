import { useState, useRef, useEffect } from 'react';
import { Search, Menu, LogOut, ChevronDown } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Header = ({ onMenuClick, onSearch }) => {
  const { logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user) return 'U';
    return ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase();
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';

  return (
    <header className="bg-white h-16 border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="bg-gray-100 rounded-lg flex items-center px-4 py-2 w-full max-w-2xl focus-within:bg-white focus-within:shadow-md transition-all">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search current folder..." 
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-xl transition-colors focus:outline-none border border-transparent hover:border-gray-200"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-700 leading-tight">{fullName}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-md">
              {getInitials()}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="px-5 py-3 border-b border-gray-50 md:hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                 <button 
                   onClick={logout}
                   className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                 >
                   <LogOut className="w-4 h-4" /> Sign out
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
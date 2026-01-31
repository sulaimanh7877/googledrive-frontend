import { Search, Bell, HelpCircle, Settings, Menu, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Header = ({ onMenuClick, userTitle }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white h-16 border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
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
            placeholder="Search Drive..." 
            className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        {/* Settings and Notifications hidden as they are not implemented yet */}
        
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 hidden md:block">
            {userTitle}
          </span>
          <div className="w-9 h-9 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold shadow-sm">
            {userTitle?.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 ml-2">
             <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
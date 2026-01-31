import { Home, HardDrive, Users, Clock, Star, Trash2, Cloud, Plus } from 'lucide-react';
import UploadZone from './UploadZone';
import { formatBytes } from '../utils/format.util';

const Sidebar = ({ isOpen, onClose, onCreateFolder, usedStorage = 0, totalStorage = 10737418240 }) => {
  const navItems = [
    { icon: Home, label: 'My Drive', active: true },
    // { icon: HardDrive, label: 'Computers' },
    // { icon: Users, label: 'Shared with me' },
    // { icon: Clock, label: 'Recent' },
    // { icon: Star, label: 'Starred' },
    // { icon: Trash2, label: 'Trash' },
  ];

  const percentage = Math.min((usedStorage / totalStorage) * 100, 100);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 left-0 z-30 h-full w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <Cloud className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-bold text-gray-800">CloudDrive</span>
          </div>

          {/* Main Action */}
          <button 
            onClick={onCreateFolder}
            className="w-full bg-blue-600 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-all mb-8"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create New</span>
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full text-sm font-medium transition-colors
                  ${item.active 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Storage Details */}
          <div className="mt-auto pt-6 border-t">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Cloud className="w-5 h-5" />
              <span className="font-medium">Storage</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {formatBytes(usedStorage)} of {formatBytes(totalStorage)} used
            </p>
            <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">
              Upgrade Storage ↗
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
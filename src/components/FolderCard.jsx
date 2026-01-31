import { Folder, Trash2 } from 'lucide-react';

const FolderCard = ({ folder, onClick, onDelete }) => {
  return (
    <div 
      onClick={() => onClick(folder)}
      className="bg-white rounded-lg shadow p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow group"
    >
      <div className="flex flex-col">
        <div className="flex items-center space-x-3">
          <Folder className="w-6 h-6 text-yellow-500 fill-current" />
          <span className="font-medium text-gray-700 truncate max-w-[150px]">{folder.name}</span>
        </div>
        <span className="text-xs text-gray-400 mt-1">
          Created {new Date(folder.createdAt).toLocaleDateString()}
        </span>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(folder); }}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-full text-red-500 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FolderCard;
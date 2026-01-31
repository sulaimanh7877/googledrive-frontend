import { FileText, MoreHorizontal, Download, Trash2, File, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '../utils/format.util';

const getFileIcon = (type) => {
  if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-500" />;
  if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-blue-500" />;
};

const FileList = ({ files, onDownload, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-6 md:col-span-5">Name</div>
        <div className="col-span-3 hidden md:block">Owner</div>
        <div className="col-span-3 hidden md:block">Last Modified</div>
        <div className="col-span-3 md:col-span-1 text-right">Size</div>
      </div>
      
      <div className="divide-y">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 items-center transition-colors group"
          >
            <div className="col-span-6 md:col-span-5 flex items-center gap-3 overflow-hidden">
              {getFileIcon(file.type)}
              <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
            </div>
            <div className="col-span-3 hidden md:block">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <img 
                    src={`https://ui-avatars.com/api/?name=User&background=random`} 
                    alt="Owner" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-500">Me</span>
              </div>
            </div>
            <div className="col-span-3 hidden md:block text-sm text-gray-500">
              {new Date(file.createdAt || Date.now()).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="col-span-6 md:col-span-1 text-right text-sm text-gray-500 flex items-center justify-end gap-4">
              <span>{formatBytes(file.size)}</span>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                <button onClick={() => onDownload(file)} className="p-1 hover:bg-gray-200 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => onDelete(file)} className="p-1 hover:bg-gray-200 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {files.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          No files found in this folder.
        </div>
      )}
    </div>
  );
};

export default FileList;
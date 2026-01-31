import { FileText, Download, Trash2 } from 'lucide-react';
import { formatBytes } from '../utils/format.util';

const FileCard = ({ file, onDownload, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-medium truncate text-gray-800" title={file.name}>{file.name}</h3>
          <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
        </div>
      </div>
      <div className="flex justify-end space-x-2 border-t pt-3">
        <button onClick={() => onDownload(file)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Download">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(file)} className="p-2 hover:bg-red-50 rounded-full text-red-500" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
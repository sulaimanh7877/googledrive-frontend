import FileCard from './FileCard';

const FileGrid = ({ files, onDownload, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map(file => (
        <FileCard 
          key={file.id} 
          file={file} 
          onDownload={onDownload} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default FileGrid;
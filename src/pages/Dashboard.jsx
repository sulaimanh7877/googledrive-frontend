import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { getFiles, deleteFile, getDownloadUrl } from '../api/file.api';
import { createFolder as createFolderApi, getFolder, deleteFolder } from '../api/folder.api';
import { toast } from 'react-toastify';
import { ChevronRight, Home, LayoutGrid, List } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FolderCard from '../components/FolderCard';
import FileList from '../components/FileList';
import FileGrid from '../components/FileGrid';
import UploadZone from '../components/UploadZone';
import { getStorageUsage } from '../api/file.api';

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState([{ id: null, name: 'My Drive' }]);
  const [contents, setContents] = useState({ files: [], folders: [] });
  const [folderTree, setFolderTree] = useState([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [storageLimit, setStorageLimit] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  const MAX_STORAGE = ((Number(import.meta.env.VITE_STORAGE_LIMIT_MB) || 250) * 1024 * 1024);
  const remainingSpace = Math.max(0, MAX_STORAGE - totalUsage);

  const loadStorage = async () => {
    try {
      const { data } = await getStorageUsage();
      setTotalUsage(data.totalUsage);
      setStorageLimit(typeof data.limit === 'number' && data.limit > 0 ? data.limit : 250 * 1024 * 1024);
    } catch (error) {
      console.error('Failed to load storage usage');
    }
  };

  const loadRootFolders = async () => {
    try {
      const { data } = await getFolder('root');
      const mapped = (data.subfolders || []).map(f => ({
        id: f._id,
        name: f.name,
        children: [],
        loaded: false
      }));
      setFolderTree(mapped);
    } catch (e) {
      console.error('Failed to load root folders');
    }
  };

  const loadContent = async (folderId = null) => {
    try {
      // Use getFolder('root') for the top level to get both folders and files
      const idToFetch = folderId || 'root';
      const { data } = await getFolder(idToFetch);
      
      // Map backend fields to frontend component expectations
      const mappedFiles = (data.files || []).map(f => ({
        ...f,
        id: f._id,
        type: f.mimeType
      }));

      const mappedFolders = (data.subfolders || []).map(f => ({
        ...f,
        id: f._id
      }));

      // Ensure currentFolder has a standardized 'id' for the UploadZone to use
      if (data.folder) {
        setCurrentFolder({ ...data.folder, id: data.folder._id });
      } else {
        setCurrentFolder(null);
        setBreadcrumbPath([{ id: null, name: 'My Drive' }]);
      }
      
      setContents({ files: mappedFiles, folders: mappedFolders });
      loadStorage();
    } catch (error) {
      console.error(error);
      toast.error('Failed to load content');
    }
  };

  useEffect(() => {
    loadContent();
    loadRootFolders();
  }, []);

  const handleNavigate = (folder) => {
    setBreadcrumbPath(prev => {
      const index = prev.findIndex(c => c.id === folder.id);
      if (index !== -1) {
        return prev.slice(0, index + 1);
      }
      return [...prev, { id: folder.id, name: folder.name }];
    });
    loadContent(folder.id);
  };

  const handleBreadcrumb = (index) => {
    const target = breadcrumbPath[index];
    setBreadcrumbPath(breadcrumbPath.slice(0, index + 1));
    loadContent(target.id);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    try {
      setIsModalOpen(false);
      // Optimistic visual feedback could be added here, 
      // but for creation we usually wait for ID. 
      // We'll just show a pending toast and reload quickly.
      await toast.promise(
        createFolderApi(newFolderName, currentFolder?.id),
        {
          pending: 'Creating folder...',
          success: `Folder "${newFolderName}" created`,
          error: 'Failed to create folder. Name might be taken.'
        }
      );
      setNewFolderName('');
      loadContent(currentFolder?.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFile = async (file) => {
    if (!window.confirm('Delete this file?')) return;
    
    // Optimistic Update
    const previousFiles = contents.files;
    setContents(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== file.id)
    }));

    try {
      await deleteFile(file.id);
      toast.success(`File "${file.name}" deleted permanently`);
      loadStorage();
    } catch (err) {
      // Revert on failure
      setContents(prev => ({ ...prev, files: previousFiles }));
      toast.error(`Failed to delete "${file.name}"`);
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm('Delete this folder?')) return;

    // Optimistic Update
    const previousFolders = contents.folders;
    setContents(prev => ({
      ...prev,
      folders: prev.folders.filter(f => f.id !== folder.id)
    }));

    try {
      await deleteFolder(folder.id);
      toast.success(`Folder "${folder.name}" and its contents deleted`);
      loadStorage();
    } catch (err) {
      // Revert on failure
      setContents(prev => ({ ...prev, folders: previousFolders }));
      toast.error(`Failed to delete "${folder.name}"`);
    }
  };

  const handleDownload = async (file) => {
    try {
      const { data } = await getDownloadUrl(file.id);
      if (!data.downloadUrl) throw new Error('No download URL returned');
      
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      toast.error('Download failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onCreateFolder={() => setIsModalOpen(true)}
        folders={folderTree}
        onFolderClick={handleNavigate}
        usedStorage={totalUsage}
        totalStorage={storageLimit}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={(value) => setSearchQuery(value.toLowerCase())}
        />

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          
          {/* Breadcrumb & Actions */}
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50 z-10 py-2">
             <div className="flex items-center gap-2 text-xl text-gray-800 font-bold">
               <button 
                 onClick={() => handleBreadcrumb(0)} 
                 className="hover:text-blue-600 transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-gray-200"
               >
                  My Drive
               </button>
               {breadcrumbPath.slice(1).map((crumb, index) => (
                 <div key={crumb.id || 'root'} className="flex items-center gap-2">
                   <ChevronRight className="w-5 h-5 text-gray-400" />
                   <button
                     onClick={() => handleBreadcrumb(index + 1)}
                     className="hover:text-blue-600 transition-colors"
                   >
                     {crumb.name}
                   </button>
                 </div>
               ))}
             </div>
             <div className="flex items-center gap-2 bg-gray-200 p-1 rounded-lg">
               <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
               >
                 <List className="w-4 h-4" />
               </button>
               <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
               >
                 <LayoutGrid className="w-4 h-4" />
               </button>
             </div>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
             <UploadZone 
               folderId={currentFolder?.id} 
               remainingSpace={remainingSpace}
               onUploadSuccess={() => {
                 loadContent(currentFolder?.id);
                 loadStorage();
               }} 
             />
          </div>

          {/* Quick Access (Folders) */}
          {contents.folders.filter(f => f.name.toLowerCase().includes(searchQuery)).length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Access</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {contents.folders.filter(folder => folder.name.toLowerCase().includes(searchQuery)).map(folder => (
                  <FolderCard 
                    key={folder.id} 
                    folder={folder} 
                    onClick={handleNavigate} 
                    onDelete={handleDeleteFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Files */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">All Files</h3>
            {viewMode === 'list' ? (
              <FileList 
                files={contents.files.filter(file => file.name.toLowerCase().includes(searchQuery))} 
                onDownload={handleDownload}
                onDelete={handleDeleteFile}
              />
            ) : (
              <FileGrid 
                files={contents.files.filter(file => file.name.toLowerCase().includes(searchQuery))} 
                onDownload={handleDownload}
                onDelete={handleDeleteFile}
              />
            )}
          </div>
        </main>
      </div>

      {/* Create Folder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Create New Folder</h3>
            <input 
              autoFocus
              className="w-full bg-gray-100 border-none p-3 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Untitled Folder"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFolder} 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
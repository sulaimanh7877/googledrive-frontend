import api from './axios';

export const createFolder = (name, parentId) => api.post('/folders', { name, parentId });
export const getFolder = (folderId) => api.get(`/folders/${folderId}`);
export const deleteFolder = (folderId) => api.delete(`/folders/${folderId}`);
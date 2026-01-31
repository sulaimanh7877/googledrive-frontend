import api from './axios';

export const createFolder = (name, parentFolderId) => api.post('/folders', { name, parentFolderId });
export const getFolder = (folderId) => api.get(`/folders/${folderId}`);
export const deleteFolder = (folderId) => api.delete(`/folders/${folderId}`);
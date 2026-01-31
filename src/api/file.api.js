import api from './axios';
import axios from 'axios';

export const getFiles = (folderId) => api.get('/files', { params: { folderId } });
export const getUploadUrl = (fileName, fileType, size) => api.post('/files/upload-url', { fileName, fileType, size });
export const saveFileMetadata = (data) => api.post('/files', data);
export const deleteFile = (fileId) => api.delete(`/files/${fileId}`);
export const getDownloadUrl = (fileId) => api.get(`/files/${fileId}/download`);
export const getStorageUsage = () => api.get('/files/storage');

// Direct S3 upload
export const uploadToS3 = (signedUrl, file, onProgress, contentType) => {
  // Using the raw axios instance avoids our custom API interceptors (so no Authorization header is added)
  return axios.put(signedUrl, file, {
    headers: {
      'Content-Type': contentType || file.type || 'application/octet-stream',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });
};
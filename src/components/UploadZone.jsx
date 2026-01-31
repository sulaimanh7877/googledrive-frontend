import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getUploadUrl, uploadToS3, saveFileMetadata } from '../api/file.api';
import { resolveFolderPath } from '../api/folder.api';

import { toast } from 'react-toastify';
import { UploadCloud } from 'lucide-react';
import { formatBytes } from '../utils/format.util';

const UploadZone = ({ folderId, onUploadSuccess, remainingSpace }) => {
  const onDrop = useCallback(async (acceptedFiles) => {

    // Client-side Validation
    const validFiles = [];
    let batchSize = 0;

    for (const file of acceptedFiles) {
      if (remainingSpace !== undefined && (file.size + batchSize) > remainingSpace) {
        toast.error(
          <div>
            <strong>Skipped "{file.name}"</strong>
            <div className="text-xs mt-1">
              Exceeds remaining storage ({formatBytes(remainingSpace)}).
            </div>
          </div>
        );
        continue;
      }
      batchSize += file.size;
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const uploadFile = async (file) => {
      const rawPath = file.path || file.webkitRelativePath || '';

      // Only treat as folder upload if browser provides a real relative path
      const isFolderUpload = rawPath && rawPath.includes('/') && rawPath !== '.' && rawPath !== './';

      let parts = [];
      if (isFolderUpload) {
        parts = rawPath
          .split('/')
          .filter(p => p && p !== '.' && p !== '..');
      }

      const fileName = parts.length > 0 ? parts.pop() : file.name;

      const relativeFolderPath = parts.length > 0 ? parts.join('/') : null;

      const targetFolderId = relativeFolderPath
        ? (await resolveFolderPath(relativeFolderPath, folderId)).data.folderId
        : folderId || null;
      try {
        // 1. Get Signed URL
        const response = await getUploadUrl(fileName, file.type, file.size, targetFolderId);
        const { uploadUrl, signedUrl, url, s3Key, key } = response.data || {};
        const targetUrl = uploadUrl || signedUrl || url;
        const targetKey = s3Key || key;

        if (!targetUrl) throw new Error('Invalid server response');

        // 2. Upload to S3
        const fileType = file.type || 'application/octet-stream';
        await uploadToS3(targetUrl, file, null, fileType);

        // 3. Save Metadata
        const metaData = {
          name: fileName,
          size: file.size,
          mimeType: fileType,
          s3Key: targetKey,
          folderId: targetFolderId || null
        };
        
        await saveFileMetadata(metaData);
        
        return { success: true, name: file.name };
      } catch (error) {
        console.error('Upload failed:', error);
        throw error;
      }
    };

    toast.info(`Uploading ${validFiles.length} file(s)...`);

    const results = await Promise.allSettled(
      validFiles.map(uploadFile)
    );

    const successes = [];
    const failures = [];

    results.forEach((result, index) => {
      const file = validFiles[index];
      if (result.status === 'fulfilled') {
        successes.push(file.name);
      } else {
        const reason = result.reason?.response?.data?.message || result.reason?.message || 'Upload failed';
        failures.push({ name: file.name, reason });
      }
    });

    if (successes.length > 0) {
      toast.success(`${successes.length} file(s) uploaded successfully`);
    }

    failures.forEach(failure => {
      toast.error(`${failure.name}: ${failure.reason}`);
    });

    if (onUploadSuccess) onUploadSuccess();
  }, [folderId, onUploadSuccess, remainingSpace]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, webkitdirectory: true });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ease-in-out
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-[1.01] shadow-lg' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-500">
        <div className={`p-4 rounded-full mb-4 ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">
          {isDragActive ? 'Drop files to upload' : 'Upload Files'}
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Drag & drop your files here, or click to browse your computer.
        </p>
      </div>
    </div>
  );
};

export default UploadZone;
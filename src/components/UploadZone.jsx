import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getUploadUrl, uploadToS3, saveFileMetadata } from '../api/file.api';
import { toast } from 'react-toastify';
import { UploadCloud } from 'lucide-react';

const UploadZone = ({ folderId, onUploadSuccess }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadFile = async (file) => {
      try {
        // 1. Get Signed URL (Pass size for quota check)
        const response = await getUploadUrl(file.name, file.type, file.size);
        const { uploadUrl, signedUrl, url, s3Key, key } = response.data || {};
        const targetUrl = uploadUrl || signedUrl || url;
        const targetKey = s3Key || key;

        if (!targetUrl) throw new Error('Invalid server response');

        // 2. Upload to S3
        const fileType = file.type || 'application/octet-stream';
        await uploadToS3(targetUrl, file, null, fileType);

        // 3. Save Metadata
        // Ensure folderId is explicitly null if undefined (root)
        const metaData = {
          name: file.name,
          size: file.size,
          mimeType: fileType,
          s3Key: targetKey,
          folderId: folderId || null
        };
        
        await saveFileMetadata(metaData);
        
        return { success: true, name: file.name };
      } catch (error) {
        console.error('Upload failed:', error);
        return { success: false, name: file.name, error };
      }
    };

    // Parallel uploads with toast promise
    await toast.promise(
      Promise.all(acceptedFiles.map(uploadFile)),
      {
        pending: `Uploading ${acceptedFiles.length} file(s)...`,
        success: 'Uploads completed!',
        error: 'Some uploads failed'
      }
    );

    if (onUploadSuccess) onUploadSuccess();
  }, [folderId, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
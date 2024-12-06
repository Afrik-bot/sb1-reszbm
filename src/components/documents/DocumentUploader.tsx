import { useState, useRef } from 'react';
import { Card, Title } from '@tremor/react';
import { Upload, File, X } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '@/hooks/useToast';

interface DocumentUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export default function DocumentUploader({ 
  onUpload, 
  maxSize = 25 * 1024 * 1024, // 25MB
  allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
}: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      addToast(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`, 'error');
      return false;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      addToast(`File type ${fileExtension} not allowed`, 'error');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(validateFile);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(validateFile);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      addToast('Files uploaded successfully', 'success');
    } catch (error) {
      addToast('Failed to upload files', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <Title>Upload Documents</Title>
      <div 
        className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center
          ${dragActive ? 'border-primary bg-primary-50' : 'border-gray-300'}
          transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop files here, or{' '}
          <button
            onClick={() => inputRef.current?.click()}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Maximum file size: 25MB. Supported formats: PDF, DOC, DOCX, XLS, XLSX
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={allowedTypes.join(',')}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <File className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-700">{file.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              onClick={handleUpload}
              isLoading={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
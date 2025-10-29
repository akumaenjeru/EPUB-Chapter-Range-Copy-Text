import React from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col items-center p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-indigo-400 transition-colors duration-300">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".epub"
        className="hidden"
        disabled={isLoading}
      />
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
      >
        <UploadIcon />
        {isLoading ? 'Processing...' : 'Upload EPUB File'}
      </button>
      <p className="mt-4 text-sm text-gray-400">Select an .epub file to begin</p>
    </div>
  );
};

export default FileUpload;

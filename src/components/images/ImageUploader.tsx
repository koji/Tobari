import React, { useRef, useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { useData } from '../../contexts/useData';

interface ImageUploaderProps {
  promptId: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ promptId }) => {
  const { attachImage, addToast } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const filePromises = Array.from(files).map(file => processFile(file));
      await Promise.all(filePromises);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      addToast('error', 'Failed to process image');
      console.error('Image upload error:', error);
    }
    
    setIsLoading(false);
  };
  
  const processFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        addToast('error', `${file.name} is not an image file`);
        reject(new Error('Not an image file'));
        return;
      }
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        addToast('error', `${file.name} exceeds maximum size of 5MB`);
        reject(new Error('File too large'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          attachImage(promptId, dataUrl, file.name);
          resolve();
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => {
        reject(reader.error);
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`btn-pearl-capsule flex items-center ${
          isLoading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 mr-1.5 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-1.5" />
        )}
        Upload
      </button>
    </div>
  );
};

export default ImageUploader;

import React, { useEffect } from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import { ImageData } from '../../types';

interface ImageModalProps {
  image: ImageData | null;
  onClose: () => void;
  onDelete: () => void;
  onDownload: (image: ImageData) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  image, 
  onClose, 
  onDelete,
  onDownload
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (image) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [image, onClose]);
  
  if (!image) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => onDownload(image)}
          className="btn-icon-circular bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
          title="Download"
        >
          <Download size={18} />
        </button>
        <button
          onClick={onDelete}
          className="btn-icon-circular bg-white/10 text-white hover:bg-red-500 backdrop-blur-md"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={onClose}
          className="btn-icon-circular bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden animate-fade-in">
        <img 
          src={image.url} 
          alt="Full size" 
          className="max-w-full max-h-full object-contain rounded-lg shadow-product"
        />
      </div>
    </div>
  );
};

export default ImageModal;

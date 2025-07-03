import React, { useEffect, useState } from 'react';
import { X, Download, Trash2, Loader } from 'lucide-react';
import { ImageData } from '../../types';
import { useData } from '../../contexts/DataContext';

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
  const { loadImageUrl } = useData();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Load image when modal opens
  useEffect(() => {
    if (image) {
      const loadImage = async () => {
        try {
          setIsLoading(true);
          setError(false);
          const url = await loadImageUrl(image.id);
          if (url) {
            setImageUrl(url);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error('Failed to load image:', err);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      };

      loadImage();
    } else {
      setImageUrl(null);
      setIsLoading(false);
      setError(false);
    }
  }, [image, loadImageUrl]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (image) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling when modal is open
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => onDownload(image)}
          className="p-2 bg-background-paper rounded-full text-white hover:bg-secondary-700 transition-colors"
          title="Download"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-background-paper rounded-full text-white hover:bg-error-700 transition-colors"
          title="Delete"
        >
          <Trash2 size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-background-paper rounded-full text-white hover:bg-gray-700 transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="h-12 w-12 animate-spin text-white" />
          </div>
        ) : error || !imageUrl ? (
          <div className="text-center text-white">
            <X className="h-12 w-12 mx-auto mb-4" />
            <p>Failed to load image</p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-md shadow-xl"
          />
        )}
      </div>
    </div>
  );
};

export default ImageModal;

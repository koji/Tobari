import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Download, Trash2, Loader } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { ImageData } from '../../types';
import ImageModal from './ImageModal';
import ConfirmDialog from '../ui/ConfirmDialog';

interface ImageGalleryProps {
  promptId: string;
  images: ImageData[];
}

// Component for lazy loading individual images
const LazyImage: React.FC<{ image: ImageData }> = ({ image }) => {
  const { loadImageUrl } = useData();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
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
  }, [image.id, loadImageUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-dark">
        <Loader className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-dark">
        <div className="text-center text-gray-500">
          <X className="h-6 w-6 mx-auto mb-2" />
          <p className="text-xs">Failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Generated"
      className="w-full h-full object-cover"
    />
  );
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ promptId, images }) => {
  const { deleteImage, loadImageUrl } = useData();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [imageToDelete, setImageToDelete] = useState<ImageData | null>(null);

  const handleOpenImage = (image: ImageData) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleDeleteConfirm = () => {
    if (imageToDelete) {
      deleteImage(promptId, imageToDelete.name);

      // If the deleted image is currently being viewed, close the modal
      if (selectedImage && selectedImage.id === imageToDelete.id) {
        setSelectedImage(null);
      }

      setImageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setImageToDelete(null);
  };

  const handleDownload = async (image: ImageData) => {
    try {
      const imageUrl = await loadImageUrl(image.id);
      if (imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = image.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-700 rounded-md p-8 text-center">
        <p className="text-gray-500">No images attached to this prompt</p>
        <p className="text-sm text-gray-600 mt-1">
          Upload images to associate them with this prompt
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map(image => (
          <div
            key={image.id}
            className="relative group aspect-square bg-background-dark rounded-md overflow-hidden border border-gray-800"
          >
            <LazyImage image={image} />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenImage(image)}
                  className="p-2 bg-background-paper rounded-full text-white hover:bg-primary-700 transition-colors"
                  title="View"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={() => handleDownload(image)}
                  className="p-2 bg-background-paper rounded-full text-white hover:bg-secondary-700 transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => setImageToDelete(image)}
                  className="p-2 bg-background-paper rounded-full text-white hover:bg-error-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image modal */}
      <ImageModal
        image={selectedImage}
        onClose={handleCloseImage}
        onDelete={() => {
          if (selectedImage) {
            setImageToDelete(selectedImage);
          }
        }}
        onDownload={(image) => handleDownload(image)}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!imageToDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default ImageGallery;

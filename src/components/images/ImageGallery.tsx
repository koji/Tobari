import React, { useState } from 'react';
import { ZoomIn, Download, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/useData';
import { ImageData } from '../../types';
import ImageModal from './ImageModal';
import ConfirmDialog from '../ui/ConfirmDialog';

interface ImageGalleryProps {
  promptId: string;
  images: ImageData[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ promptId, images }) => {
  const { deleteImage } = useData();
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
  
  const handleDownload = (image: ImageData) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <img 
              src={image.url} 
              alt="Generated" 
              className="w-full h-full object-cover"
            />
            
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

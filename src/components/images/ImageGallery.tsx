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
      <div className="border border-dashed border-hairline rounded-lg p-8 text-center bg-canvas-parchment">
        <p className="text-caption text-ink-muted-80">No images attached to this prompt</p>
        <p className="text-fine-print text-ink-muted-48 mt-1">
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
            className="relative group aspect-square bg-canvas rounded-lg overflow-hidden border border-hairline"
          >
            <img 
              src={image.url} 
              alt="Generated" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenImage(image)}
                  className="btn-icon-circular"
                  title="View"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => handleDownload(image)}
                  className="btn-icon-circular"
                  title="Download"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setImageToDelete(image)}
                  className="btn-icon-circular hover:bg-red-500 hover:text-white"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
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

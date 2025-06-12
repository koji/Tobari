import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          ref={dialogRef}
          className="w-full max-w-md transform overflow-hidden rounded-lg bg-background-paper text-left align-middle shadow-xl transition-all animate-slide-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center">
              {isDestructive && (
                <AlertTriangle className="h-5 w-5 text-error-500 mr-2" />
              )}
              <h3 className="text-lg font-medium text-white">
                {title}
              </h3>
            </div>
            <button
              className="text-gray-400 hover:text-white"
              onClick={onCancel}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-gray-300">
              {message}
            </p>
          </div>
          
          {/* Actions */}
          <div className="px-4 py-3 flex justify-end space-x-3 border-t border-gray-800">
            <button
              className="btn-ghost text-sm"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className={`btn text-sm ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
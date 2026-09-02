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
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          ref={dialogRef}
          className="w-full max-w-md transform overflow-hidden rounded-lg bg-canvas text-left align-middle shadow-product transition-all animate-slide-in border border-hairline"
        >
          <div className="flex items-center justify-between p-6 border-b border-hairline">
            <div className="flex items-center">
              {isDestructive && (
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <h3 className="text-body-strong text-ink">
                {title}
              </h3>
            </div>
            <button
              className="btn-icon-circular !w-8 !h-8"
              onClick={onCancel}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-body text-ink-muted-80">
              {message}
            </p>
          </div>
          
          <div className="px-6 py-4 flex justify-end space-x-3 bg-canvas-parchment rounded-b-lg">
            <button
              className="btn-pearl-capsule"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className={`${isDestructive ? 'btn-danger' : 'btn-primary'}`}
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

import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useData } from '../../contexts/useData';

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useData();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end space-y-2">
      {toasts.map(toast => {
        let icon = <Info className="h-5 w-5 text-primary" />;
        let borderColor = 'border-l-primary';
        
        if (toast.type === 'success') {
          icon = <CheckCircle className="h-5 w-5 text-green-600" />;
          borderColor = 'border-l-green-600';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="h-5 w-5 text-red-600" />;
          borderColor = 'border-l-red-600';
        } else if (toast.type === 'info') {
          icon = <Info className="h-5 w-5 text-primary" />;
          borderColor = 'border-l-primary';
        }
        
        return (
          <div
            key={toast.id}
            className={`bg-canvas ${borderColor} border-l-4 rounded-lg shadow-product px-4 py-3 pr-8 min-w-64 max-w-sm animate-slide-in relative border border-hairline`}
          >
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-1 right-1 text-ink-muted-48 hover:text-ink p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex">
              <div className="mr-3">
                {icon}
              </div>
              <div>
                <p className="text-caption text-ink">{toast.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

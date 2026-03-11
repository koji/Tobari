import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useData } from '../../contexts/useData';

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useData();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end space-y-2">
      {toasts.map(toast => {
        const bgColor = 'bg-background-paper';
        let icon = <Info className="h-5 w-5 text-white" />;
        let borderColor = 'border-l-primary-500';
        
        if (toast.type === 'success') {
          icon = <CheckCircle className="h-5 w-5 text-success-500" />;
          borderColor = 'border-l-success-500';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="h-5 w-5 text-error-500" />;
          borderColor = 'border-l-error-500';
        } else if (toast.type === 'info') {
          icon = <Info className="h-5 w-5 text-primary-500" />;
          borderColor = 'border-l-primary-500';
        }
        
        return (
          <div
            key={toast.id}
            className={`${bgColor} ${borderColor} border-l-4 rounded-md shadow-lg px-4 py-3 pr-8 min-w-64 max-w-sm animate-slide-in relative`}
          >
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-1 right-1 text-gray-400 hover:text-white p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex">
              <div className="mr-3">
                {icon}
              </div>
              <div>
                <p className="text-sm text-white">{toast.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

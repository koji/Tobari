import React from 'react';
import { X } from 'lucide-react';
import { AIModel } from '../../types';

interface ModelBadgeProps {
  model: AIModel;
  onClick: () => void;
  isSelected?: boolean;
  hideRemove?: boolean;
}

const ModelBadge: React.FC<ModelBadgeProps> = ({ 
  model, 
  onClick, 
  isSelected = false,
  hideRemove = false
}) => {
  return (
    <div 
      className={`model-badge cursor-pointer ${isSelected ? 'bg-secondary-500/50' : ''}`}
      onClick={onClick}
    >
      {model.label}
      {!hideRemove && (
        <X 
          className="ml-1 h-3 w-3 hover:text-white" 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      )}
    </div>
  );
};

export default ModelBadge;
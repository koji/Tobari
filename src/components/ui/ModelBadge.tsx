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
      className={`model-badge cursor-pointer ${isSelected ? '!bg-ink !text-white !border-ink' : ''}`}
      onClick={onClick}
    >
      {model.label}
      {!hideRemove && (
        <X 
          className="ml-1 h-3 w-3 opacity-60 hover:opacity-100" 
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

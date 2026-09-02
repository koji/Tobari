import React from 'react';
import { X } from 'lucide-react';
import { Tag } from '../../types';

interface TagBadgeProps {
  tag: Tag;
  onClick: () => void;
  isSelected?: boolean;
  hideRemove?: boolean;
}

const TagBadge: React.FC<TagBadgeProps> = ({ 
  tag, 
  onClick, 
  isSelected = false,
  hideRemove = false
}) => {
  return (
    <div 
      className={`tag-badge cursor-pointer ${isSelected ? '!bg-primary !text-white !border-primary' : ''}`}
      onClick={onClick}
    >
      {tag.label}
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

export default TagBadge;

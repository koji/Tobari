import React from 'react';
import { useData } from '../../contexts/DataContext';
import TagBadge from '../ui/TagBadge';

const TagFilter: React.FC = () => {
  const { tags, filters, updateFilters } = useData();
  
  const toggleTag = (tagId: string) => {
    const currentTags = filters.selectedTags;
    
    if (currentTags.includes(tagId)) {
      // Remove tag
      updateFilters({ 
        selectedTags: currentTags.filter(id => id !== tagId) 
      });
    } else {
      // Add tag
      updateFilters({ 
        selectedTags: [...currentTags, tagId] 
      });
    }
  };
  
  if (tags.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">No tags available</div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <TagBadge
          key={tag.id}
          tag={tag}
          onClick={() => toggleTag(tag.id)}
          isSelected={filters.selectedTags.includes(tag.id)}
          hideRemove
        />
      ))}
    </div>
  );
};

export default TagFilter;
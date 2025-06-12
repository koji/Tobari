import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import TagBadge from '../ui/TagBadge';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange }) => {
  const { tags, addTag } = useData();
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  // Filter tags based on search
  const filteredTags = tags.filter(tag => 
    tag.label.toLowerCase().includes(searchText.toLowerCase()) &&
    !selectedTags.includes(tag.id)
  );
  
  // Add a tag to selection
  const handleAddTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId]);
    }
    setSearchText('');
  };
  
  // Remove a tag from selection
  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };
  
  // Create a new tag
  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTagId = addTag(newTagName.trim());
      onChange([...selectedTags, newTagId]);
      setNewTagName('');
      setIsAdding(false);
    }
  };
  
  // Get selected tags objects
  const selectedTagObjects = selectedTags
    .map(id => tags.find(tag => tag.id === id))
    .filter(Boolean) as typeof tags;
  
  return (
    <div className="space-y-3">
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTagObjects.length === 0 ? (
          <div className="text-sm text-gray-500 italic">No tags selected</div>
        ) : (
          selectedTagObjects.map(tag => (
            <TagBadge 
              key={tag.id} 
              tag={tag} 
              onClick={() => handleRemoveTag(tag.id)} 
            />
          ))
        )}
      </div>
      
      {/* Add new tag toggle */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-primary-400 hover:text-primary-300 flex items-center"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Tag
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="input-field text-sm py-1"
            placeholder="Enter new tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateTag();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setNewTagName('');
              }
            }}
            autoFocus
          />
          <button
            onClick={handleCreateTag}
            className="btn-primary py-1 text-sm"
            disabled={!newTagName.trim()}
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewTagName('');
            }}
            className="btn-ghost py-1 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Tag search */}
      {!isAdding && tags.length > 0 && (
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3 w-3 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field text-sm pl-8 py-1.5"
              placeholder="Search existing tags..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          {searchText && (
            <div className="mt-2 max-h-32 overflow-y-auto scrollbar-thin bg-background-light rounded-md p-2">
              {filteredTags.length === 0 ? (
                <div className="text-sm text-gray-500 italic p-1">No matching tags</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <TagBadge 
                      key={tag.id} 
                      tag={tag} 
                      onClick={() => handleAddTag(tag.id)} 
                      hideRemove
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
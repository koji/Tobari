import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Image as ImageIcon } from 'lucide-react';
import { useData } from '../../contexts/useData';
import TagBadge from '../ui/TagBadge';
import ModelBadge from '../ui/ModelBadge';

const PromptList: React.FC = () => {
  const { filteredPrompts, selectPrompt, selectedPromptId, tags, models } = useData();
  
  const handleSelectPrompt = (id: string) => {
    selectPrompt(id);
  };
  
  if (filteredPrompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="bg-background-light p-8 rounded-lg animate-pulse-slow">
          <p className="text-gray-400 mb-2">No prompts found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or create a new prompt</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="space-y-3">
        {filteredPrompts.map(prompt => {
          const isSelected = selectedPromptId === prompt.id;
          
          return (
            <div
              key={prompt.id}
              className={`prompt-card cursor-pointer ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectPrompt(prompt.id)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-white">{prompt.title}</h3>
                {prompt.linked_images.length > 0 && (
                  <div className="flex items-center text-gray-400 text-xs">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {prompt.linked_images.length}
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{prompt.prompt}</p>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {prompt.tags.slice(0, 3).map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? <TagBadge key={tagId} tag={tag} onClick={() => {}} hideRemove /> : null;
                })}
                
                {prompt.tags.length > 3 && (
                  <span className="text-xs text-gray-500 py-0.5">
                    +{prompt.tags.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {prompt.ai_models.slice(0, 2).map(modelId => {
                  const model = models.find(m => m.id === modelId);
                  return model ? <ModelBadge key={modelId} model={model} onClick={() => {}} hideRemove /> : null;
                })}
                
                {prompt.ai_models.length > 2 && (
                  <span className="text-xs text-gray-500 py-0.5">
                    +{prompt.ai_models.length - 2} more
                  </span>
                )}
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                Updated {formatDistanceToNow(new Date(prompt.updated_at), { addSuffix: true })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromptList;

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
      <div className="flex flex-col items-center justify-center p-section text-center h-full bg-canvas">
        <div className="max-w-md">
          <p className="text-display-md text-ink">No prompts found</p>
          <p className="text-body text-ink-muted-80 mt-2">Try adjusting your filters or create a new prompt</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
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
                <h3 className="text-body-strong text-ink">{prompt.title}</h3>
                {prompt.linked_images.length > 0 && (
                  <div className="flex items-center text-ink-muted-48 text-caption">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {prompt.linked_images.length}
                  </div>
                )}
              </div>
              
              <p className="text-caption text-ink-muted-80 mt-1 line-clamp-2">{prompt.prompt}</p>
              
              <div className="mt-3 flex flex-wrap gap-1.5">
                {prompt.tags.slice(0, 3).map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? <TagBadge key={tagId} tag={tag} onClick={() => {}} hideRemove /> : null;
                })}
                
                {prompt.tags.length > 3 && (
                  <span className="text-fine-print text-ink-muted-48 py-0.5">
                    +{prompt.tags.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1.5">
                {prompt.ai_models.slice(0, 2).map(modelId => {
                  const model = models.find(m => m.id === modelId);
                  return model ? <ModelBadge key={modelId} model={model} onClick={() => {}} hideRemove /> : null;
                })}
                
                {prompt.ai_models.length > 2 && (
                  <span className="text-fine-print text-ink-muted-48 py-0.5">
                    +{prompt.ai_models.length - 2} more
                  </span>
                )}
              </div>
              
              <div className="mt-3 text-fine-print text-ink-muted-48">
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

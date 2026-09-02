import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useData } from '../../contexts/useData';
import ModelBadge from '../ui/ModelBadge';

interface ModelSelectorProps {
  selectedModels: string[];
  onChange: (models: string[]) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModels, onChange }) => {
  const { models, addModel } = useData();
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  
  const filteredModels = models.filter(model => 
    model.label.toLowerCase().includes(searchText.toLowerCase()) &&
    !selectedModels.includes(model.id)
  );
  
  const handleAddModel = (modelId: string) => {
    if (!selectedModels.includes(modelId)) {
      onChange([...selectedModels, modelId]);
    }
    setSearchText('');
  };
  
  const handleRemoveModel = (modelId: string) => {
    onChange(selectedModels.filter(id => id !== modelId));
  };
  
  const handleCreateModel = () => {
    if (newModelName.trim()) {
      const newModelId = addModel(newModelName.trim());
      onChange([...selectedModels, newModelId]);
      setNewModelName('');
      setIsAdding(false);
    }
  };
  
  const selectedModelObjects = selectedModels
    .map(id => models.find(model => model.id === id))
    .filter(Boolean) as typeof models;
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedModelObjects.length === 0 ? (
          <div className="text-caption text-ink-muted-48 italic">No models selected</div>
        ) : (
          selectedModelObjects.map(model => (
            <ModelBadge 
              key={model.id} 
              model={model} 
              onClick={() => handleRemoveModel(model.id)} 
            />
          ))
        )}
      </div>
      
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="text-caption text-primary hover:text-primary-focus flex items-center"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Model
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="input-field text-caption py-1.5"
            placeholder="Enter new model name..."
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateModel();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setNewModelName('');
              }
            }}
            autoFocus
          />
          <button
            onClick={handleCreateModel}
            className="btn-primary py-1.5 text-caption"
            disabled={!newModelName.trim()}
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewModelName('');
            }}
            className="btn-ghost py-1.5 text-caption"
          >
            Cancel
          </button>
        </div>
      )}
      
      {!isAdding && models.length > 0 && (
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3 w-3 text-ink-muted-48" />
            </div>
            <input
              type="text"
              className="input-field text-caption pl-8 py-2"
              placeholder="Search existing models..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          {searchText && (
            <div className="mt-2 max-h-32 overflow-y-auto scrollbar-thin bg-canvas rounded-lg p-2 border border-hairline">
              {filteredModels.length === 0 ? (
                <div className="text-caption text-ink-muted-48 italic p-1">No matching models</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredModels.map(model => (
                    <ModelBadge 
                      key={model.id} 
                      model={model} 
                      onClick={() => handleAddModel(model.id)} 
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

export default ModelSelector;

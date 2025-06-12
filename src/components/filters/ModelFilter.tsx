import React from 'react';
import { useData } from '../../contexts/DataContext';
import ModelBadge from '../ui/ModelBadge';

const ModelFilter: React.FC = () => {
  const { models, filters, updateFilters } = useData();
  
  const toggleModel = (modelId: string) => {
    const currentModels = filters.selectedModels;
    
    if (currentModels.includes(modelId)) {
      // Remove model
      updateFilters({ 
        selectedModels: currentModels.filter(id => id !== modelId) 
      });
    } else {
      // Add model
      updateFilters({ 
        selectedModels: [...currentModels, modelId] 
      });
    }
  };
  
  if (models.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">No models available</div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {models.map(model => (
        <ModelBadge
          key={model.id}
          model={model}
          onClick={() => toggleModel(model.id)}
          isSelected={filters.selectedModels.includes(model.id)}
          hideRemove
        />
      ))}
    </div>
  );
};

export default ModelFilter;
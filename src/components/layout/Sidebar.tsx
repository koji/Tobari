import React from 'react';
import { Search, Tag, Cpu, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useData } from '../../contexts/useData';
import PromptList from '../prompts/PromptList';
import TagFilter from '../filters/TagFilter';
import ModelFilter from '../filters/ModelFilter';
import SortControl from '../filters/SortControl';

const Sidebar: React.FC = () => {
  const { filters, updateFilters, resetFilters, tags, models } = useData();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchText: e.target.value });
  };
  
  return (
    <div className="h-full flex flex-col bg-canvas">
      <div className="p-6 border-b border-hairline">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-ink-muted-48" />
          </div>
          <input
            type="text"
            placeholder="Search prompts..."
            className="input-field pl-10"
            value={filters.searchText}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="p-6 border-b border-hairline">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-primary mr-2" />
            <h3 className="text-caption-strong text-ink">Tags</h3>
          </div>
          <span className="text-fine-print text-ink-muted-48">{tags.length} tags</span>
        </div>
        <TagFilter />
      </div>
      
      <div className="p-6 border-b border-hairline">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Cpu className="h-4 w-4 text-ink mr-2" />
            <h3 className="text-caption-strong text-ink">AI Models</h3>
          </div>
          <span className="text-fine-print text-ink-muted-48">{models.length} models</span>
        </div>
        <ModelFilter />
      </div>
      
      <div className="p-6 border-b border-hairline">
        <div className="flex items-center mb-3">
          <SlidersHorizontal className="h-4 w-4 text-ink-muted-80 mr-2" />
          <h3 className="text-caption-strong text-ink">Sort</h3>
        </div>
        <SortControl />
      </div>
      
      <div className="px-6 py-4 border-b border-hairline">
        <button 
          className="btn-ghost text-caption w-full flex items-center justify-center"
          onClick={resetFilters}
        >
          <RotateCcw className="h-3 w-3 mr-1.5" />
          Reset Filters
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <PromptList />
      </div>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import { Search, Tag, Cpu, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
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
    <div className="h-full flex flex-col bg-background-paper">
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
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
      
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-primary-400 mr-2" />
            <h3 className="font-medium text-sm text-gray-300">Tags</h3>
          </div>
          <span className="text-xs text-gray-500">{tags.length} tags</span>
        </div>
        <TagFilter />
      </div>
      
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Cpu className="h-4 w-4 text-secondary-400 mr-2" />
            <h3 className="font-medium text-sm text-gray-300">AI Models</h3>
          </div>
          <span className="text-xs text-gray-500">{models.length} models</span>
        </div>
        <ModelFilter />
      </div>
      
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center mb-3">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 mr-2" />
          <h3 className="font-medium text-sm text-gray-300">Sort</h3>
        </div>
        <SortControl />
      </div>
      
      <div className="px-4 py-2 border-b border-gray-800">
        <button 
          className="btn-ghost text-sm w-full flex items-center justify-center"
          onClick={resetFilters}
        >
          <RotateCcw className="h-3 w-3 mr-1" />
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
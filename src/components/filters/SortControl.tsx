import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useData } from '../../contexts/useData';

const SortControl: React.FC = () => {
  const { filters, updateFilters } = useData();
  
  const toggleSortField = (field: 'created_at' | 'updated_at') => {
    if (filters.sortBy === field) {
      // Toggle direction if same field
      updateFilters({ 
        sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' 
      });
    } else {
      // Change field, default to desc (newest first)
      updateFilters({ 
        sortBy: field,
        sortDir: 'desc'
      });
    }
  };
  
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        className={`btn-ghost text-sm flex justify-center items-center py-1.5 ${
          filters.sortBy === 'created_at' ? 'bg-background-light' : ''
        }`}
        onClick={() => toggleSortField('created_at')}
      >
        {filters.sortBy === 'created_at' ? (
          filters.sortDir === 'asc' ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 mr-1" />
        )}
        Created
      </button>
      
      <button
        className={`btn-ghost text-sm flex justify-center items-center py-1.5 ${
          filters.sortBy === 'updated_at' ? 'bg-background-light' : ''
        }`}
        onClick={() => toggleSortField('updated_at')}
      >
        {filters.sortBy === 'updated_at' ? (
          filters.sortDir === 'asc' ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 mr-1" />
        )}
        Updated
      </button>
    </div>
  );
};

export default SortControl;

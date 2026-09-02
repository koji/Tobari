import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useData } from '../../contexts/useData';

const SortControl: React.FC = () => {
  const { filters, updateFilters } = useData();
  
  const toggleSortField = (field: 'created_at' | 'updated_at') => {
    if (filters.sortBy === field) {
      updateFilters({ 
        sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' 
      });
    } else {
      updateFilters({ 
        sortBy: field,
        sortDir: 'desc'
      });
    }
  };
  
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        className={`btn-ghost text-caption flex justify-center items-center py-2 rounded-pill border ${
          filters.sortBy === 'created_at' ? 'bg-ink text-white border-ink' : 'bg-canvas border-hairline text-ink'
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
        className={`btn-ghost text-caption flex justify-center items-center py-2 rounded-pill border ${
          filters.sortBy === 'updated_at' ? 'bg-ink text-white border-ink' : 'bg-canvas border-hairline text-ink'
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

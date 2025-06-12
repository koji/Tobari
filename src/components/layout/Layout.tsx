import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import PromptView from '../prompts/PromptView';
import PromptList from '../prompts/PromptList';
import { useData } from '../../contexts/DataContext';

const Layout: React.FC = () => {
  const { selectedPromptId } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // On small screens, hide sidebar when a prompt is selected
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-full bg-background-default text-white">
      <Header>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md lg:hidden text-gray-400 hover:text-white hover:bg-background-light"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - collapses on mobile */}
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:relative
            z-20 lg:z-0
            w-72 lg:w-80
            h-[calc(100%-4rem)] lg:h-auto
            transition-transform duration-300 ease-in-out
            bg-background-default lg:bg-transparent
            border-r border-gray-800
          `}
        >
          <Sidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* On mobile, show the list when no prompt is selected */}
          <div className={`
            lg:hidden 
            ${selectedPromptId ? 'hidden' : 'block'}
            h-full overflow-y-auto
          `}>
            <PromptList />
          </div>
          
          {/* Show prompt view when one is selected, or on desktop view */}
          <div className={`
            ${selectedPromptId || window.innerWidth >= 1024 ? 'block' : 'hidden'}
            h-full overflow-y-auto bg-background-default
          `}>
            <PromptView />
          </div>
        </div>
        
        {/* Semi-transparent overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
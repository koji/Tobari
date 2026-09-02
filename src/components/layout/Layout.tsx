import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import PromptView from '../prompts/PromptView';
import PromptList from '../prompts/PromptList';
import { useData } from '../../contexts/useData';

const Layout: React.FC = () => {
  const { selectedPromptId } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-full bg-canvas-parchment text-ink">
      <Header>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full lg:hidden text-white/80 hover:text-white hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - collapses on mobile, utility card grid feel */}
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:relative
            z-20 lg:z-0
            w-72 lg:w-80
            h-[calc(100%-96px)] lg:h-auto
            transition-transform duration-300 ease-in-out
            bg-canvas lg:bg-canvas-parchment
            border-r border-hairline
          `}
        >
          <Sidebar />
        </div>
        
        {/* Main content - alternating tile rhythm */}
        <div className="flex-1 overflow-hidden flex flex-col bg-canvas-parchment">
          {/* On mobile, show the list when no prompt is selected */}
          <div className={`
            lg:hidden 
            ${selectedPromptId ? 'hidden' : 'block'}
            h-full overflow-y-auto bg-canvas
          `}>
            <PromptList />
          </div>
          
          {/* Show prompt view when one is selected, or on desktop view */}
          <div className={`
            ${selectedPromptId || window.innerWidth >= 1024 ? 'block' : 'hidden'}
            h-full overflow-y-auto
          `}>
            <PromptView />
          </div>
        </div>
        
        {/* Semi-transparent overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-10 bg-black/30 backdrop-blur-sm top-[96px]"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;

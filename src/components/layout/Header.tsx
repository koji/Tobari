import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useData } from '../../contexts/useData';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { addPrompt, selectPrompt } = useData();
  
  const handleNewPrompt = () => {
    const newId = addPrompt({
      title: 'New Prompt',
      prompt: '',
      negative_prompt: '',
      tags: [],
      ai_models: [],
      notes: '',
      linked_images: []
    });
    
    selectPrompt(newId);
  };
  
  return (
    <div className="flex flex-col">
      {/* Global nav - ultra-thin black bar */}
      <header className="h-11 bg-black flex items-center px-4 lg:px-6">
        <div className="flex items-center">
          {children}
          
          <div className="flex items-center ml-2 gap-2">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-nav-link text-white tracking-tight">帳 Tobari</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-5 ml-8 text-nav-link text-white/80">
          <span className="text-white">Store</span>
          <span className="hover:text-white cursor-pointer transition-colors">Prompts</span>
          <span className="hover:text-white cursor-pointer transition-colors">Gallery</span>
        </nav>
      </header>
      
      {/* Sub-nav frosted - product-specific nav with persistent CTA */}
      <div className="h-[52px] sub-nav-frosted flex items-center px-4 lg:px-6 sticky top-0 z-10">
        <h2 className="text-tagline text-ink">AI Prompt Manager</h2>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:inline text-caption text-ink-muted-80">Organize your prompts</span>
          <button
            onClick={handleNewPrompt}
            className="btn-primary text-caption-strong !py-2 !px-4"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            New Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

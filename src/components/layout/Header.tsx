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
    <header className="h-16 border-b border-gray-800 flex items-center px-4 bg-background-dark">
      <div className="flex items-center">
        {children}
        
        <div className="flex items-center ml-2">
          <Sparkles className="h-6 w-6 text-primary-500" />
          <h1 className="text-xl font-bold ml-2 text-white">AI Prompt Manager</h1>
        </div>
      </div>
      
      <div className="ml-auto">
        <button
          onClick={handleNewPrompt}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Prompt
        </button>
      </div>
    </header>
  );
};

export default Header;

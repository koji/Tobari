import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Save, Trash2, Image as ImageIcon, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useData } from '../../contexts/useData';
import TagSelector from '../selectors/TagSelector';
import ModelSelector from '../selectors/ModelSelector';
import ImageGallery from '../images/ImageGallery';
import ImageUploader from '../images/ImageUploader';
import EmptyState from '../ui/EmptyState';
import ConfirmDialog from '../ui/ConfirmDialog';

const PromptView: React.FC = () => {
  const { 
    prompts, 
    selectedPromptId, 
    selectPrompt, 
    updatePrompt, 
    deletePrompt,
    images
  } = useData();
  
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [aiModels, setAiModels] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const negativePromptRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  
  const selectedPrompt = selectedPromptId 
    ? prompts.find(p => p.id === selectedPromptId) 
    : null;
    
  const promptImages = images.filter(img => img.promptId === selectedPromptId);
  
  useEffect(() => {
    if (selectedPrompt) {
      setTitle(selectedPrompt.title);
      setPrompt(selectedPrompt.prompt);
      setNegativePrompt(selectedPrompt.negative_prompt);
      setTags(selectedPrompt.tags);
      setAiModels(selectedPrompt.ai_models);
      setNotes(selectedPrompt.notes);
      setHasChanges(false);
      
      setTimeout(() => {
        autoResizeTextarea(promptRef.current);
        autoResizeTextarea(negativePromptRef.current);
        autoResizeTextarea(notesRef.current);
      }, 0);
    } else {
      setTitle('');
      setPrompt('');
      setNegativePrompt('');
      setTags([]);
      setAiModels([]);
      setNotes('');
      setHasChanges(false);
    }
  }, [selectedPrompt]);
  
  useEffect(() => {
    if (!selectedPrompt) return;
    
    const hasChanged = 
      title !== selectedPrompt.title ||
      prompt !== selectedPrompt.prompt ||
      negativePrompt !== selectedPrompt.negative_prompt ||
      !arraysEqual(tags, selectedPrompt.tags) ||
      !arraysEqual(aiModels, selectedPrompt.ai_models) ||
      notes !== selectedPrompt.notes;
      
    setHasChanges(hasChanged);
  }, [title, prompt, negativePrompt, tags, aiModels, notes, selectedPrompt]);
  
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  };
  
  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    autoResizeTextarea(e.target);
  };
  
  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNegativePrompt(e.target.value);
    autoResizeTextarea(e.target);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    autoResizeTextarea(e.target);
  };
  
  const handleSave = () => {
    if (!selectedPromptId) return;
    
    updatePrompt(selectedPromptId, {
      title,
      prompt,
      negative_prompt: negativePrompt,
      tags,
      ai_models: aiModels,
      notes
    });
    
    setHasChanges(false);
  };
  
  const handleDelete = () => {
    if (!selectedPromptId) return;
    deletePrompt(selectedPromptId);
    setShowDeleteConfirm(false);
  };
  
  const handleBack = () => {
    selectPrompt(null);
  };
  
  if (!selectedPrompt) {
    return (
      <EmptyState 
        icon={<Info size={48} className="text-ink-muted-48" />}
        title="No Prompt Selected"
        description="Select a prompt from the list or create a new one to get started."
      />
    );
  }
  
  const createdDate = new Date(selectedPrompt.created_at);
  const updatedDate = new Date(selectedPrompt.updated_at);
  
  return (
    <div className="h-full flex flex-col bg-canvas-parchment">
      {/* Sticky action bar - floating-sticky-bar style */}
      <div className="sub-nav-frosted flex items-center justify-between px-6 py-3 sticky top-0 z-10">
        <button 
          onClick={handleBack}
          className="flex items-center text-primary hover:text-primary-focus lg:hidden text-caption"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="hidden lg:block text-caption text-ink-muted-80">
          Editing
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-ghost text-caption"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`btn-primary text-caption-strong ${!hasChanges ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save
          </button>
        </div>
      </div>
      
      {/* Prompt form - alternating tile rhythm */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Title tile - light */}
        <div className="bg-canvas px-6 lg:px-12 py-12 lg:py-section">
          <div className="max-w-content mx-auto">
            <label htmlFor="title" className="block text-caption-strong text-ink mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-hairline rounded-none px-0 py-3 text-display-md text-ink placeholder:text-ink-muted-48 focus:outline-none focus:border-primary focus:ring-0"
              placeholder="Give your prompt a descriptive title..."
            />
          </div>
        </div>
        
        {/* Main prompt tile - parchment */}
        <div className="bg-canvas-parchment px-6 lg:px-12 py-12">
          <div className="max-w-content mx-auto space-y-10">
            <div className="store-utility-card">
              <label htmlFor="prompt" className="block text-caption-strong text-ink mb-3">
                Prompt
              </label>
              <textarea
                id="prompt"
                ref={promptRef}
                value={prompt}
                onChange={handlePromptChange}
                className="w-full bg-canvas-parchment border border-hairline rounded-lg px-4 py-3 text-body text-ink placeholder:text-ink-muted-48 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-24 resize-none"
                placeholder="Enter your main prompt text here..."
              />
            </div>
            
            <div className="store-utility-card">
              <label htmlFor="negative-prompt" className="block text-caption-strong text-ink mb-3">
                Negative Prompt
              </label>
              <textarea
                id="negative-prompt"
                ref={negativePromptRef}
                value={negativePrompt}
                onChange={handleNegativePromptChange}
                className="w-full bg-canvas-parchment border border-hairline rounded-lg px-4 py-3 text-body text-ink placeholder:text-ink-muted-48 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-20 resize-none"
                placeholder="Enter things to avoid in the generation..."
              />
            </div>
          </div>
        </div>
        
        {/* Tags / Models - light tile */}
        <div className="bg-canvas px-6 lg:px-12 py-12">
          <div className="max-w-content mx-auto grid gap-8">
            <div className="store-utility-card">
              <label className="block text-caption-strong text-ink mb-4">
                Tags
              </label>
              <TagSelector 
                selectedTags={tags} 
                onChange={setTags} 
              />
            </div>
            
            <div className="store-utility-card">
              <label className="block text-caption-strong text-ink mb-4">
                AI Models
              </label>
              <ModelSelector 
                selectedModels={aiModels} 
                onChange={setAiModels} 
              />
            </div>
          </div>
        </div>
        
        {/* Notes + Images - parchment */}
        <div className="bg-canvas-parchment px-6 lg:px-12 py-12">
          <div className="max-w-content mx-auto space-y-8">
            <div className="store-utility-card">
              <label htmlFor="notes" className="block text-caption-strong text-ink mb-3">
                Notes
              </label>
              <textarea
                id="notes"
                ref={notesRef}
                value={notes}
                onChange={handleNotesChange}
                className="w-full bg-canvas-parchment border border-hairline rounded-lg px-4 py-3 text-body text-ink placeholder:text-ink-muted-48 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-20 resize-none"
                placeholder="Add notes about this prompt, settings, or other tips..."
              />
            </div>
            
            <div className="store-utility-card">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-caption-strong text-ink">
                  <span className="flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2 text-ink-muted-80" />
                    Images
                  </span>
                </label>
                <ImageUploader promptId={selectedPrompt.id} />
              </div>
              
              <ImageGallery 
                promptId={selectedPrompt.id} 
                images={promptImages} 
              />
            </div>
          </div>
        </div>
        
        {/* Metadata - light tile with fine print */}
        <div className="bg-canvas px-6 lg:px-12 py-6 border-t border-hairline">
          <div className="max-w-content mx-auto flex items-center text-fine-print text-ink-muted-48">
            <Clock className="h-3 w-3 mr-1.5" />
            <span>
              Created: {format(createdDate, 'PPP')}
              {createdDate.getTime() !== updatedDate.getTime() && 
                ` • Updated: ${format(updatedDate, 'PPP')}`
              }
            </span>
          </div>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default PromptView;

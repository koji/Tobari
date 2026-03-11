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
  
  // Load prompt data when selection changes
  useEffect(() => {
    if (selectedPrompt) {
      setTitle(selectedPrompt.title);
      setPrompt(selectedPrompt.prompt);
      setNegativePrompt(selectedPrompt.negative_prompt);
      setTags(selectedPrompt.tags);
      setAiModels(selectedPrompt.ai_models);
      setNotes(selectedPrompt.notes);
      setHasChanges(false);
      
      // Auto-resize textareas
      setTimeout(() => {
        autoResizeTextarea(promptRef.current);
        autoResizeTextarea(negativePromptRef.current);
        autoResizeTextarea(notesRef.current);
      }, 0);
    } else {
      // Reset form when no prompt is selected
      setTitle('');
      setPrompt('');
      setNegativePrompt('');
      setTags([]);
      setAiModels([]);
      setNotes('');
      setHasChanges(false);
    }
  }, [selectedPrompt]);
  
  // Check for changes to enable/disable save button
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
  
  // Helper to compare arrays
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  };
  
  // Auto-resize textarea
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
  
  // Render empty state if no prompt is selected
  if (!selectedPrompt) {
    return (
      <EmptyState 
        icon={<Info size={48} className="text-gray-600" />}
        title="No Prompt Selected"
        description="Select a prompt from the list or create a new one to get started."
      />
    );
  }
  
  const createdDate = new Date(selectedPrompt.created_at);
  const updatedDate = new Date(selectedPrompt.updated_at);
  
  return (
    <div className="h-full flex flex-col bg-background-default">
      {/* Header with actions */}
      <div className="border-b border-gray-800 flex items-center justify-between p-4 bg-background-paper">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white lg:hidden"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-ghost text-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`btn-primary text-sm ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
        </div>
      </div>
      
      {/* Prompt form */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Give your prompt a descriptive title..."
          />
        </div>
        
        {/* Main prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
            Prompt
          </label>
          <textarea
            id="prompt"
            ref={promptRef}
            value={prompt}
            onChange={handlePromptChange}
            className="input-field min-h-24 resize-none"
            placeholder="Enter your main prompt text here..."
          />
        </div>
        
        {/* Negative prompt */}
        <div>
          <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-300 mb-1">
            Negative Prompt
          </label>
          <textarea
            id="negative-prompt"
            ref={negativePromptRef}
            value={negativePrompt}
            onChange={handleNegativePromptChange}
            className="input-field min-h-20 resize-none"
            placeholder="Enter things to avoid in the generation..."
          />
        </div>
        
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <TagSelector 
            selectedTags={tags} 
            onChange={setTags} 
          />
        </div>
        
        {/* AI Models */}
        <div>
          <label htmlFor="ai-models" className="block text-sm font-medium text-gray-300 mb-2">
            AI Models
          </label>
          <ModelSelector 
            selectedModels={aiModels} 
            onChange={setAiModels} 
          />
        </div>
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            ref={notesRef}
            value={notes}
            onChange={handleNotesChange}
            className="input-field min-h-20 resize-none"
            placeholder="Add notes about this prompt, settings, or other tips..."
          />
        </div>
        
        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-2 text-gray-400" />
                Images
              </div>
            </label>
            <ImageUploader promptId={selectedPromptId} />
          </div>
          
          <ImageGallery 
            promptId={selectedPromptId} 
            images={promptImages} 
          />
        </div>
        
        {/* Metadata */}
        <div className="pt-4 border-t border-gray-800 text-xs text-gray-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            Created: {format(createdDate, 'PPP')}
            {createdDate.getTime() !== updatedDate.getTime() && 
              ` • Updated: ${format(updatedDate, 'PPP')}`
            }
          </span>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
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

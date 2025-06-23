import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ipcRenderer } from 'electron';
import { Prompt, Tag, AIModel, ImageData, Toast, FilterState } from '../types';
import { formatISO } from 'date-fns';

// Default sample data
const defaultTags: Tag[] = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'sci-fi', label: 'Sci-Fi' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'anime', label: 'Anime' },
  { id: 'realistic', label: 'Realistic' }
];

const defaultModels: AIModel[] = [
  { id: 'stable-diffusion', label: 'Stable Diffusion' },
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'dalle', label: 'DALL-E' }
];

const defaultPrompts: Prompt[] = [
  {
    id: uuidv4(),
    title: 'Sci-fi City at Sunset',
    prompt: 'A futuristic city skyline at sunset, cyberpunk, high detail, golden hour, flying cars',
    negative_prompt: 'blurry, low quality, distorted, oversaturated',
    tags: ['sci-fi', 'landscape'],
    ai_models: ['stable-diffusion', 'midjourney'],
    notes: 'Works well with SDXL when CFG scale is 7.5',
    created_at: formatISO(new Date()),
    updated_at: formatISO(new Date()),
    linked_images: []
  },
  {
    id: uuidv4(),
    title: 'Fantasy Forest Spirit',
    prompt: 'Ethereal forest spirit, glowing, magical, fantasy art, detailed, mystical, forest background',
    negative_prompt: 'dark, scary, horror, low resolution',
    tags: ['fantasy'],
    ai_models: ['stable-diffusion'],
    notes: 'Add "fantasy art" for better results',
    created_at: formatISO(new Date(Date.now() - 86400000)), // 1 day ago
    updated_at: formatISO(new Date(Date.now() - 86400000)),
    linked_images: []
  }
];

// Initial filters
const initialFilters: FilterState = {
  searchText: '',
  selectedTags: [],
  selectedModels: [],
  sortBy: 'updated_at',
  sortDir: 'desc'
};

// Context type
interface DataContextType {
  prompts: Prompt[];
  tags: Tag[];
  models: AIModel[];
  images: ImageData[];
  toasts: Toast[];
  filters: FilterState;
  selectedPromptId: string | null;
  
  addPrompt: (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>) => string;
  updatePrompt: (id: string, promptData: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  selectPrompt: (id: string | null) => void;
  
  addTag: (label: string) => string;
  deleteTag: (id: string) => void;
  
  addModel: (label: string) => string;
  deleteModel: (id: string) => void;
  
  attachImage: (promptId: string, imageData: string, name: string) => void;
  deleteImage: (promptId: string, imageName: string) => void;
  
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  filteredPrompts: Prompt[];
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Update storage operations to use electron-store
const saveToStore = async (key: string, value: any) => {
  console.log(`[Renderer] saveToStore: Saving key '${key}'. Value type: ${typeof value}, Array length (if applicable): ${Array.isArray(value) ? value.length : 'N/A'}`);
  try {
    await ipcRenderer.invoke('store-set', key, value);
    console.log(`[Renderer] saveToStore: Successfully invoked store-set for key '${key}'`);
  } catch (error) {
    console.error(`[Renderer] saveToStore: Error invoking store-set for key '${key}':`, error);
  }
};

const loadFromStore = async (key: string, defaultValue: any) => {
  console.log(`[Renderer] loadFromStore: Loading key '${key}'`);
  try {
    const value = await ipcRenderer.invoke('store-get', key);
    if (value === undefined) {
      console.log(`[Renderer] loadFromStore: Key '${key}' not found in store, using default value. Default value type: ${typeof defaultValue}, Array length: ${Array.isArray(defaultValue) ? defaultValue.length : 'N/A'}`);
      return defaultValue;
    }
    console.log(`[Renderer] loadFromStore: Key '${key}' loaded from store. Value type: ${typeof value}, Array length: ${Array.isArray(value) ? value.length : 'N/A'}`);
    return value;
  } catch (error) {
    console.error(`[Renderer] loadFromStore: Error invoking store-get for key '${key}':`, error);
    console.log(`[Renderer] loadFromStore: Using default value for key '${key}' due to error. Default value type: ${typeof defaultValue}, Array length: ${Array.isArray(defaultValue) ? defaultValue.length : 'N/A'}`);
    return defaultValue;
  }
};

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [prompts, setPrompts] = useState<Prompt[]>(defaultPrompts);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [models, setModels] = useState<AIModel[]>(defaultModels);
  const [images, setImages] = useState<ImageData[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  
  // Update useEffect hooks to use electron-store
  useEffect(() => {
    console.log(`[Renderer] useEffect for 'prompts': Prompts changed, attempting to save. Count: ${prompts.length}`);
    if (prompts !== defaultPrompts || prompts.length > 0) { // Avoid saving initial default state if it hasn't changed or is empty
      saveToStore('prompts', prompts);
    }
  }, [prompts]);
  
  useEffect(() => {
    console.log(`[Renderer] useEffect for 'tags': Tags changed, attempting to save. Count: ${tags.length}`);
    if (tags !== defaultTags || tags.length > 0) {
      saveToStore('tags', tags);
    }
  }, [tags]);
  
  useEffect(() => {
    console.log(`[Renderer] useEffect for 'models': Models changed, attempting to save. Count: ${models.length}`);
    if (models !== defaultModels || models.length > 0) {
      saveToStore('models', models);
    }
  }, [models]);
  
  useEffect(() => {
    console.log(`[Renderer] useEffect for 'images': Images changed, attempting to save. Count: ${images.length}`);
    if (images.length > 0) { // Images start empty, so only save if not empty
      saveToStore('images', images);
    }
  }, [images]);
  
  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('[Renderer] loadInitialData: Starting initial data load.');

      const [loadedPrompts, loadedTags, loadedModels, loadedImages] = await Promise.all([
        loadFromStore('prompts', defaultPrompts),
        loadFromStore('tags', defaultTags),
        loadFromStore('models', defaultModels),
        loadFromStore('images', [])
      ]);
      
      console.log(`[Renderer] loadInitialData: Prompts loaded. Count: ${loadedPrompts.length}. IsDefault: ${loadedPrompts === defaultPrompts}`);
      setPrompts(loadedPrompts);

      console.log(`[Renderer] loadInitialData: Tags loaded. Count: ${loadedTags.length}. IsDefault: ${loadedTags === defaultTags}`);
      setTags(loadedTags);

      console.log(`[Renderer] loadInitialData: Models loaded. Count: ${loadedModels.length}. IsDefault: ${loadedModels === defaultModels}`);
      setModels(loadedModels);

      console.log(`[Renderer] loadInitialData: Images loaded. Count: ${loadedImages.length}.`);
      setImages(loadedImages);

      console.log('[Renderer] loadInitialData: Finished initial data load and setting state.');
    };
    
    loadInitialData();
  }, []); // Empty dependency array, runs once on mount.
  
  // Prompt CRUD operations
  const addPrompt = (promptData: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>): string => {
    const now = formatISO(new Date());
    const newPrompt: Prompt = {
      ...promptData,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
    };
    
    setPrompts(prev => [...prev, newPrompt]);
    addToast('success', 'Prompt created successfully');
    return newPrompt.id;
  };
  
  const updatePrompt = (id: string, promptData: Partial<Prompt>) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === id 
        ? { ...prompt, ...promptData, updated_at: formatISO(new Date()) } 
        : prompt
    ));
    addToast('success', 'Prompt updated successfully');
  };
  
  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(prompt => prompt.id !== id));
    setImages(prev => prev.filter(image => image.promptId !== id));
    if (selectedPromptId === id) {
      setSelectedPromptId(null);
    }
    addToast('info', 'Prompt deleted');
  };
  
  const selectPrompt = (id: string | null) => {
    setSelectedPromptId(id);
  };
  
  // Tag operations
  const addTag = (label: string): string => {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    if (tags.some(tag => tag.id === id)) {
      return id; // Tag already exists
    }
    
    const newTag: Tag = { id, label };
    setTags(prev => [...prev, newTag]);
    return id;
  };
  
  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
    // Remove the tag from all prompts
    setPrompts(prev => prev.map(prompt => ({
      ...prompt,
      tags: prompt.tags.filter(tagId => tagId !== id),
      updated_at: formatISO(new Date())
    })));
  };
  
  // Model operations
  const addModel = (label: string): string => {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    if (models.some(model => model.id === id)) {
      return id; // Model already exists
    }
    
    const newModel: AIModel = { id, label };
    setModels(prev => [...prev, newModel]);
    return id;
  };
  
  const deleteModel = (id: string) => {
    setModels(prev => prev.filter(model => model.id !== id));
    // Remove the model from all prompts
    setPrompts(prev => prev.map(prompt => ({
      ...prompt,
      ai_models: prompt.ai_models.filter(modelId => modelId !== id),
      updated_at: formatISO(new Date())
    })));
  };
  
  // Image operations
  const attachImage = (promptId: string, dataUrl: string, name: string) => {
    const id = uuidv4();
    const imageName = `image_${id}_${name}`;
    
    // Add image to images collection
    const newImage: ImageData = {
      id,
      promptId,
      name: imageName,
      url: dataUrl,
      created_at: formatISO(new Date())
    };
    
    setImages(prev => [...prev, newImage]);
    
    // Update prompt's linked_images
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId
        ? { 
            ...prompt, 
            linked_images: [...prompt.linked_images, imageName],
            updated_at: formatISO(new Date())
          }
        : prompt
    ));
    
    addToast('success', 'Image attached successfully');
  };
  
  const deleteImage = (promptId: string, imageName: string) => {
    // Remove from images collection
    setImages(prev => prev.filter(img => !(img.promptId === promptId && img.name === imageName)));
    
    // Remove from prompt's linked_images
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId
        ? { 
            ...prompt, 
            linked_images: prompt.linked_images.filter(name => name !== imageName),
            updated_at: formatISO(new Date())
          }
        : prompt
    ));
    
    addToast('info', 'Image removed');
  };
  
  // Toast operations
  const addToast = (type: Toast['type'], message: string) => {
    const id = uuidv4();
    const newToast: Toast = { id, type, message };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Filter operations
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  // Computed filtered prompts
  const filteredPrompts = React.useMemo(() => {
    return prompts
      .filter(prompt => {
        // Text search
        if (filters.searchText && !prompt.title.toLowerCase().includes(filters.searchText.toLowerCase()) && 
            !prompt.prompt.toLowerCase().includes(filters.searchText.toLowerCase())) {
          return false;
        }
        
        // Tag filter
        if (filters.selectedTags.length > 0 && 
            !filters.selectedTags.every(tagId => prompt.tags.includes(tagId))) {
          return false;
        }
        
        // Model filter
        if (filters.selectedModels.length > 0 && 
            !filters.selectedModels.every(modelId => prompt.ai_models.includes(modelId))) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a[filters.sortBy]);
        const dateB = new Date(b[filters.sortBy]);
        
        return filters.sortDir === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
  }, [prompts, filters]);
  
  const value = {
    prompts,
    tags,
    models,
    images,
    toasts,
    filters,
    selectedPromptId,
    
    addPrompt,
    updatePrompt,
    deletePrompt,
    selectPrompt,
    
    addTag,
    deleteTag,
    
    addModel,
    deleteModel,
    
    attachImage,
    deleteImage,
    
    addToast,
    removeToast,
    
    updateFilters,
    resetFilters,
    
    filteredPrompts
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
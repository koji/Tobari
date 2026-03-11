import { createContext } from 'react';
import { Prompt, Tag, AIModel, ImageData, Toast, FilterState } from '../types';

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

export const DataContext = createContext<DataContextType | undefined>(undefined);

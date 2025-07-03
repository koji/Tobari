// Prompt interface
export interface Prompt {
  id: string
  title: string
  prompt: string
  negative_prompt: string
  tags: string[]
  ai_models: string[]
  notes: string
  created_at: string
  updated_at: string
  linked_images: string[]
}

// Tag interface
export interface Tag {
  id: string
  label: string
}

// AI Model interface
export interface AIModel {
  id: string
  label: string
}

// Image interface (for handling local images)
export interface ImageData {
  id: string
  promptId: string
  name: string
  filePath?: string // File path on disk (for storage)
  url?: string // Data URL (for display, loaded on demand)
  created_at: string
}

// Toast notification
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

// Filter state
export interface FilterState {
  searchText: string
  selectedTags: string[]
  selectedModels: string[]
  sortBy: 'created_at' | 'updated_at'
  sortDir: 'asc' | 'desc'
}

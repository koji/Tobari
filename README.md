# AI Prompt Manager Tobari ~帳~

A powerful desktop application for organizing, managing, and reusing AI image generation prompts. Built with React, TypeScript, and Electron.

## Features

- 📝 **Prompt Management**: Create, edit, and organize your AI prompts with titles, descriptions, and notes
- 🏷️ **Tagging System**: Categorize prompts with custom tags (Portrait, Landscape, Sci-Fi, Fantasy, Anime, Realistic, etc.)
- 🤖 **AI Model Support**: Associate prompts with specific AI models (Stable Diffusion, Midjourney, DALL-E)
- 🖼️ **Image Gallery**: Link and manage generated images with your prompts
- 🔍 **Advanced Search & Filtering**: Filter by tags, models, and search through prompt content
- 📂 **Drag & Drop Organization**: Reorder and organize prompts intuitively
- 💾 **Persistent Storage**: All data is stored locally using Electron Store
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🚀 **Cross-Platform**: Available for Windows, macOS, and Linux

## Screenshots

![Screenshot 2025-06-15 at 1 18 31 AM](https://github.com/user-attachments/assets/67854083-b24a-4112-af78-dd35aee7d992)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-prompt-manager.git
cd ai-prompt-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run electron:dev
```

This will start both the Vite development server and the Electron application.

### Building for Production

To build the application for your platform:

```bash
npm run electron:build
```

Built applications will be available in the `dist-electron` directory.

## Available Scripts

- `npm run dev` - Start Vite development server only
- `npm run build` - Build the web application
- `npm run electron:dev` - Start both Vite and Electron in development mode
- `npm run electron:build` - Build the Electron application for distribution
- `npm run electron:preview` - Run the built Electron application
- `npm run lint` - Run Oxlint
- `npm run lint:fix` - Run Oxlint with auto-fix
- `npm run preview` - Preview the built web application

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   ├── selectors/      # Model and Tag selectors
│   ├── images/         # Image management components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
│   └── DataContext.tsx # Main data management context
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── App.tsx             # Main application component
├── main.tsx            # React entry point
└── index.css           # Global styles

electron/
└── main.js             # Electron main process
```

## Data Types

The application uses the following main data structures:

### Prompt
```typescript
interface Prompt {
  id: string;
  title: string;
  prompt: string;
  negative_prompt: string;
  tags: string[];
  ai_models: string[];
  notes: string;
  created_at: string;
  updated_at: string;
  linked_images: string[];
}
```

### Tag
```typescript
interface Tag {
  id: string;
  label: string;
}
```

### AI Model
```typescript
interface AIModel {
  id: string;
  label: string;
}
```

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Desktop Framework**: Electron
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React (icons)
- **Drag & Drop**: React Beautiful DnD
- **Data Storage**: Electron Store
- **Date Handling**: date-fns
- **Development**: Oxlint, Concurrently

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Cloud synchronization
- [ ] Prompt templates
- [ ] Batch operations
- [ ] Export/import functionality
- [ ] Advanced prompt analysis
- [ ] Integration with popular AI platforms
- [ ] Prompt versioning
- [ ] Collaborative features

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/ai-prompt-manager/issues) on GitHub.

## Acknowledgments

- Built with [Electron](https://electronjs.org/)
- UI components from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)


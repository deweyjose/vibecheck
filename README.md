# Vibecheck

A modern, feature-rich text editor built with React, TypeScript, and Tiptap.

## Features

- 📝 Rich text editing with a modern UI
- 🎨 Advanced formatting options
- 📁 Document organization with folders
- 💻 Code blocks with syntax highlighting
- 📊 Table support with resizing
- 🎯 Callouts and alerts
- 🔗 Link management
-  Responsive design
- 💾 Offline-capable data persistence

## Tech Stack

- React + TypeScript
- Vite for build tooling
- Tiptap for rich text editing
- Tailwind CSS for styling
- Heroicons for icons
- Lowlight for syntax highlighting

## Project Plan

### 1. ✅ Basic Rich Text Setup
- ✅ Install TipTap
- ✅ Replace textarea with TipTap editor
- ✅ Add basic formatting (bold, italic, underline)
- ✅ Basic toolbar implementation

### 2. ✅ Text Styling Features
- ✅ Headings (H1, H2, H3)
- ✅ Font sizes
- ✅ Text alignment
- ✅ Text colors and highlights
- ✅ Lists (bullet and numbered)

### 3. 🏗️ Block-Level Features
- 🏗️ Code blocks
  - ✅ Basic implementation
  - ✅ Syntax highlighting
  - ✅ Language selector
  - ✅ Copy button
  - ✅ Basic tab-to-spaces indentation
  - 🐛 Line numbers not working
  - 🐛 Auto-refresh issues with syntax highlighting
  - 🎯 Smart indentation (requires more research)
  - TODO: Switch to `@tiptap/extension-code-block-lowlight`
- ✅ Blockquotes
- ✅ Callouts/alerts
  - ✅ Info
  - ✅ Warning
  - ✅ Success
  - ✅ Error
- ✅ Tables
  - ✅ Basic table support
  - ✅ Column resizing
  - ✅ Cell selection
- ✅ Dividers
  - ✅ Styled horizontal rules
  - ✅ Decorative elements

### 4. 🔄 Advanced Features
- 🔜 Image upload and handling
- ✅ Links
- 🔜 Mentions (@user)
- 🔜 Keyboard shortcuts
- 🔜 Drag and drop blocks

### 5. 🔜 Collaborative Features
- Real-time collaboration
- Comments
- Change tracking

### 6. 🏗️ Document Organization
- ✅ Basic folder structure
- ✅ Folder/document icons
- ✅ Nested document indentation
- 🔜 Drag-and-drop organization
- 🔜 Context menu enhancements
- 🔜 Folder-aware search
- 🐛 Context menu positioning in sidebar

### 7. 🆕 Data Persistence
- 🔜 AWS Amplify DataStore implementation
  - Local storage with IndexedDB
  - Cloud sync with AppSync and DynamoDB
  - Automatic conflict resolution
  - Real-time updates
  - Offline support
- 🔜 Data schema design
  - Document/folder structure
  - Document content
  - User preferences
- 🔜 Data migration strategy
  - Version control for stored data
  - Upgrade paths
  - Data validation

## Current Priority Tasks
1. Fix existing bugs:
   - Line numbers in code blocks
   - Auto-refresh issues with syntax highlighting
   - Context menu positioning in sidebar (menu extends beyond sidebar boundaries)

2. Research alternatives for code block features:
   - Better indentation handling
   - IDE-like features
   - Line number implementation

3. Implement document organization features:
   - Drag-and-drop
   - Enhanced context menus
   - Search improvements

4. Implement data persistence with AWS Amplify:
   - Set up Amplify and AppSync
   - Design GraphQL schema
   - Configure DataStore for offline support
   - Implement auto-save and sync

## Development

### Prerequisites

- Node.js 18 or newer
- pnpm 8 or newer
- Docker Desktop
- AWS CLI (for infrastructure management)
- Terraform v1.2.0 or newer (for infrastructure management)

### Infrastructure Setup

The project uses Terraform to manage AWS infrastructure. See [infrastructure/README.md](infrastructure/README.md) for detailed setup instructions, including:
- One-time bootstrap process for GitHub Actions
- Environment-specific configurations
- Infrastructure deployment workflow
- State management
- Security considerations

### Local Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
src/
├── components/
│   ├── editor/         # Editor components and extensions
│   ├── Layout.tsx      # Main layout component
│   ├── Sidebar.tsx     # Document navigation
│   └── DocumentEditor.tsx
├── contexts/           # React contexts
├── assets/            # Static assets
└── App.tsx           # Root component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Data Persistence Architecture

### Overview
Our application follows an offline-first architecture, ensuring that users can work seamlessly regardless of their network connection. The system is designed to:
- Work completely offline by default
- Sync automatically when online
- Handle conflicts gracefully
- Provide immediate feedback through optimistic updates

### Technical Stack
1. **Local Storage (IndexedDB)**
   - Primary data store for all application data
   - Handles large document content and binary data
   - Provides fast, indexed access to documents
   - Supports complex querying capabilities

2. **State Management**
   - Uses optimistic updates for immediate UI feedback
   - Maintains a sync queue for offline changes
   - Tracks document versions for conflict resolution
   - Implements event-based real-time updates

3. **Sync Strategy**
   - Background sync when online
   - Queue-based synchronization of changes
   - Version-based conflict detection
   - Merge resolution with user intervention when needed
   - Periodic full sync for consistency

### Data Flow
1. **Write Operations**
   - Save immediately to IndexedDB
   - Update UI optimistically
   - Queue change for sync
   - Attempt sync if online
   - Handle conflicts if detected

2. **Read Operations**
   - Read from IndexedDB first
   - Update from server if online
   - Cache server response
   - Update UI if newer data found

3. **Conflict Resolution**
   - Track document versions
   - Detect conflicts during sync
   - Auto-merge non-conflicting changes
   - Present diff UI for manual resolution
   - Maintain audit trail of changes

### Implementation Details
1. **Document Structure**
   ```typescript
   interface Document {
     id: string;           // UUID v4
     content: string;      // Document content
     version: number;      // Incremental version
     lastModified: number; // Timestamp
     syncStatus: 'synced' | 'pending' | 'conflict';
     localChanges?: DocumentDiff[]; // Pending changes
   }
   ```

2. **Sync Queue**
   ```typescript
   interface SyncOperation {
     id: string;          // Operation ID
     documentId: string;  // Target document
     type: 'create' | 'update' | 'delete';
     changes: DocumentDiff[];
     timestamp: number;
     retryCount: number;
   }
   ```

3. **Conflict Resolution**
   ```typescript
   interface DocumentDiff {
     type: 'insert' | 'delete' | 'replace';
     position: number;
     content?: string;
     length?: number;
   }
   ```

### Error Handling
1. **Network Errors**
   - Retry with exponential backoff
   - Queue operations for later
   - Notify user of sync status

2. **Conflict Errors**
   - Present diff UI to user
   - Allow manual merge
   - Option to force push or pull

3. **Storage Errors**
   - Implement storage quotas
   - Clean up old versions
   - Compress when needed

### Performance Considerations
1. **Indexing**
   - Index frequently queried fields
   - Use compound indexes for complex queries
   - Maintain search indices locally

2. **Caching**
   - Cache rendered content
   - Implement LRU cache for documents
   - Prefetch likely-to-be-needed data

3. **Bandwidth**
   - Compress payloads
   - Delta updates only
   - Batch sync operations

### Security
1. **Data Protection**
   - Encrypt sensitive data at rest
   - Sanitize data before storage
   - Implement access controls

2. **Sync Security**
   - Authenticate all sync operations
   - Validate data integrity
   - Rate limit sync requests

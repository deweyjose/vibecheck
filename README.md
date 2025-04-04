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

### 0. 🔄 Project Management Migration
- 🔜 Set up GitHub MCP
  - Configure GitHub MCP server
  - Set up model context protocol
  - Configure GitHub integration
- 🔜 Migrate project tracking to GitHub
  - Create milestones for each major feature set
  - Convert current tasks to GitHub issues
  - Set up project boards
  - Configure automated task tracking
- 🔜 Update documentation
  - Move detailed project plan to GitHub
  - Keep high-level overview in README
  - Set up automated README updates

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
- ✅ Drag-and-drop organization
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

### 8. 🤖 AI Writing Assistant
- 🔜 Style Guide Integration
  - Create comprehensive style guide
  - Define tone of voice guidelines
  - Set up writing rules and preferences
  - Configure custom style presets
- 🔜 Real-time Writing Feedback
  - Implement inline suggestions
  - Grammar and style checking
  - Tone consistency monitoring
  - Vocabulary enhancement
- 🔜 Document Review System
  - Full document analysis
  - Style consistency report
  - Tone analysis
  - Readability metrics
  - Improvement suggestions
- 🔜 AI Configuration
  - Custom prompt engineering
  - Context-aware suggestions
  - User preference learning
  - Feedback loop integration

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

1. Clone the repository:
   ```bash
   git clone https://github.com/deweyjose/vibecheck.git
   cd vibecheck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Cursor IDE

This project is optimized for development with [Cursor](https://cursor.sh), an AI-powered IDE that enhances the development experience:

### Features

- **AI Code Completion**: Get intelligent code suggestions as you type
- **Natural Language Commands**: Use natural language to generate code, refactor, or debug
- **Context-Aware Assistance**: AI understands your codebase and provides relevant suggestions
- **Built-in Git Integration**: Seamless version control with AI-powered commit messages

### Getting Started

1. Download and install [Cursor](https://cursor.sh)
2. Open the project in Cursor
3. The AI assistant will automatically understand your codebase context
4. Use `Cmd/Ctrl + K` to open the command palette and interact with the AI

### Best Practices

- Use natural language to describe what you want to achieve
- Let the AI help with boilerplate code and repetitive tasks
- Review AI-generated code before committing
- Use the AI to help with documentation and comments

### Dewey Notes for Mark

```
Thoughts on Cursor
- debugging the code with images of the console or images of the browers is amazing
- you can usually root cause issues by continuing to tell the model it's broken
- it will find a solution for you - I had an issue with text editor callouts. It tried to use SVG data icons, kept failing. then it decided to use unicode/emoticons. We finally found the root case, something else related to bad class names. I told it to go back and unify the callout icons in the toolbar with the editor canvas… easy peasy.
- when we struggled through a problem and got to a solution. I replied to the model ":)" and it celebrated with me.

Context
- we kept losing context about our todo list, so I had Cursor add it to the readme. it then learned to add/update the bug list or add new feature ideas automatically to it as we collaborated.
- Using the README as a bug tracker/project tracker has been  boon. I think 
- Should use GitHub MCP for issues, and the rest of GitHub to be honest. 
    - https://cursor.directory/mcp/github
    - https://github.com/modelcontextprotocol/servers/tree/main/src/github


Infra
- At first I thought... Did an awesome job with CICD… recommended some good practices with TF and account setup in AWS
- Then ... ChatGPT 4o - for me way easier to setup terraform.
- README for terraform bootstrap was really annoying… version control state files…
- After careful inspection, CICD wasn't a great experience after we started to get into it. The dir structure wasn't idiomatic and google/chatgpt was more useful.
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

### Pull Request Guidelines
- Ensure your code follows the project's style guidelines
- Update documentation as needed
- Include tests for new features
- Reference any related issues in your PR description
- Keep PRs focused on a single concern
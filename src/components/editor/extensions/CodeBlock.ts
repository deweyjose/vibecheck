import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CodeBlockView } from '../CodeBlockView'

// Create a new lowlight instance with common languages
const lowlight = createLowlight(common)

// Define language-specific indentation sizes
const LANGUAGE_INDENT_SIZE = {
  python: 4,
  ruby: 2,
  javascript: 2,
  typescript: 2,
  java: 4,
  go: 4,
  rust: 4,
  cpp: 4,
  c: 4,
} as const;

// Define commonly used languages
export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell' },
  { value: 'yaml', label: 'YAML' },
]

export const CodeBlock = CodeBlockLowlight.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        if (!editor.isActive('codeBlock')) return false
        
        const language = editor.getAttributes('codeBlock').language || 'javascript'
        const indentSize = LANGUAGE_INDENT_SIZE[language as keyof typeof LANGUAGE_INDENT_SIZE] || 2
        const spaces = ' '.repeat(indentSize)
        
        editor.commands.insertContent(spaces)
        return true
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView)
  },
}).configure({
  lowlight,
  defaultLanguage: 'javascript',
  HTMLAttributes: {
    class: 'code-block',
    spellcheck: 'false',
  },
}) 
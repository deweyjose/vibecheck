import { Editor } from '@tiptap/react'
import { Copy as CopyIcon, Check as CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { SUPPORTED_LANGUAGES } from './extensions/CodeBlock'

interface CodeBlockToolbarProps {
  editor: Editor
  language: string
  content: string
}

export function CodeBlockToolbar({ editor, language, content }: CodeBlockToolbarProps) {
  const [copied, setCopied] = useState(false)

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value
    editor
      .chain()
      .focus()
      .updateAttributes('codeBlock', { language: newLanguage })
      .run()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="code-block-toolbar" onClick={(e) => e.stopPropagation()}>
      <select
        value={language}
        onChange={handleLanguageChange}
        onClick={(e) => e.stopPropagation()}
      >
        {SUPPORTED_LANGUAGES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      
      <button
        onClick={handleCopy}
        title="Copy code"
      >
        {copied ? (
          <CheckIcon className="w-4 h-4 text-green-500" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
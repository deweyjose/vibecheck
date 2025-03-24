import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { CodeBlockToolbar } from './CodeBlockToolbar'

export function CodeBlockView({ node, editor }: NodeViewProps) {
  const language = node.attrs.language || 'javascript'
  const content = node.textContent || ''

  return (
    <NodeViewWrapper>
      <pre className="group">
        <CodeBlockToolbar 
          editor={editor} 
          language={language}
          content={content}
        />
        <code>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  )
}
import { Node } from '@tiptap/core'

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>
}

interface NodeJSON {
  type: string
  content?: NodeJSON[]
  text?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (type: 'info' | 'warning' | 'success' | 'error') => ReturnType
    }
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',
  
  group: 'block',
  
  content: 'block+',
  
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  
  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => {
          const type = element.getAttribute('data-type')
          return type || 'info'
        },
        renderHTML: attributes => {
          const type = attributes.type || 'info'
          return {
            'data-type': type,
            class: `callout callout-${type}`,
          }
        },
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[class*="callout"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {}
          const type = element.getAttribute('data-type') || 'info'
          return { type }
        },
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', {
      ...this.options.HTMLAttributes,
      ...HTMLAttributes,
    }, 0]
  },
  
  addCommands() {
    return {
      setCallout: (type: 'info' | 'warning' | 'success' | 'error') => ({ commands, editor }) => {
        // If we're in a callout, convert it to a new type
        if (editor.isActive('callout')) {
          return commands.updateAttributes('callout', { type })
        }

        // Get the current selection
        const { selection } = editor.state
        const { from, to } = selection

        // If there's a selection, wrap it in a callout
        if (from !== to) {
          // Get the selected content
          const content = editor.state.doc.slice(from, to)
          
          // Convert the content to an array of nodes
          const nodes: NodeJSON[] = []
          content.content.forEach(node => {
            // If it's already a block node, keep it as is
            if (node.type.isBlock) {
              nodes.push(node.toJSON())
            } else {
              // Otherwise wrap it in a paragraph
              nodes.push({
                type: 'paragraph',
                content: [node.toJSON()]
              })
            }
          })

          // If no nodes were created (e.g., empty selection), create a default paragraph
          const paragraphContent = nodes.length ? nodes : [{
            type: 'paragraph',
            content: [{ type: 'text', text: ' ' }]
          }]

          return commands.insertContent({
            type: this.name,
            attrs: { type },
            content: paragraphContent
          })
        }

        // If no selection, create a new callout with a paragraph
        return commands.insertContent({
          type: this.name,
          attrs: { type },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: ' ' }],
            },
          ],
        })
      },
    }
  },
}) 
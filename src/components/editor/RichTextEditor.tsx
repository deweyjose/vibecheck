import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { FontSize } from './extensions/FontSize'
import { Callout } from './extensions/Callout'
import { CodeBlock } from './extensions/CodeBlock'
import { MenuBar } from './MenuBar'
import './EditorStyles.css'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "min-h-[1.5em]",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "my-8",
          },
        },
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontSize,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Callout.configure({
        HTMLAttributes: {
          class: "my-callout",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      CodeBlock,
    ],
    content: content || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-text-editor",
      },
      handleClick: (view, pos) => {
        // If clicking in an empty space, create a new paragraph
        const $pos = view.state.doc.resolve(pos);
        if ($pos.parent.type.name === "doc") {
          view.dispatch(
            view.state.tr.insert(
              pos,
              view.state.schema.nodes.paragraph.create()
            )
          );
          return true;
        }
        return false;
      },
    },
  });

  // Update editor content when content prop changes, but only if it's significantly different
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      const currentSelection = editor.state.selection
      editor.commands.setContent(content || '<p></p>')
      // Restore the selection after content update
      editor.commands.setTextSelection(currentSelection.from)
    }
  }, [content, editor])

  return (
    <div className="border rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-4 min-h-[500px]"
      />
    </div>
  )
} 
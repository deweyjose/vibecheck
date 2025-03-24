import { useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListUnorderedIcon,
  ListOrdered as ListOrderedIcon,
  Heading1 as Heading1Icon,
  Heading2 as Heading2Icon,
  Heading3 as Heading3Icon,
  Heading4 as Heading4Icon,
  Code as CodeIcon,
  Palette as ColorIcon,
  Highlighter as HighlightIcon,
  Table as TableIcon,
  Minus as DividerIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
} from "lucide-react";
import { ColorPicker } from './ColorPicker'

interface MenuBarProps {
  editor: Editor | null
}

const fontSizes = [
  { label: 'Small', value: '0.875em' },
  { label: 'Normal', value: '1em' },
  { label: 'Large', value: '1.25em' },
  { label: 'Huge', value: '1.5em' },
]

export function MenuBar({ editor }: MenuBarProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false)
  const colorButtonRef = useRef<HTMLButtonElement>(null)
  const highlightButtonRef = useRef<HTMLButtonElement>(null)
  
  if (!editor) return null

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run()
  }

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run()
  }

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run()
  }

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run()
  }

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run()
  }

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run()
  }

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run()
  }

  const mergeOrSplitCells = () => {
    const { selection } = editor.state
    const isCellSelection = selection.ranges && selection.ranges.length > 0
    
    if (isCellSelection) {
      editor.chain().focus().mergeCells().run()
    } else {
      editor.chain().focus().splitCell().run()
    }
  }

  const toggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run()
  }

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run()
  }

  const toggleHeaderCell = () => {
    editor.chain().focus().toggleHeaderCell().run()
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bold") ? "bg-gray-100" : ""
        }`}
        title="Bold (Ctrl+B)"
      >
        <BoldIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("italic") ? "bg-gray-100" : ""
        }`}
        title="Italic (Ctrl+I)"
      >
        <ItalicIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("underline") ? "bg-gray-100" : ""
        }`}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-200 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-100" : ""
        }`}
      >
        <Heading1Icon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-100" : ""
        }`}
      >
        <Heading2Icon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("heading", { level: 3 }) ? "bg-gray-100" : ""
        }`}
      >
        <Heading3Icon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4}).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("heading", { level: 4 }) ? "bg-gray-100" : ""
        }`}
      >
        <Heading4Icon className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-200 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bulletList") ? "bg-gray-100" : ""
        }`}
      >
        <ListUnorderedIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("orderedList") ? "bg-gray-100" : ""
        }`}
      >
        <ListOrderedIcon className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-200 mx-1" />

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-gray-100"
        title="Add divider"
      >
        <DividerIcon className="w-4 h-4" />
      </button>

      <div className="relative group">
        <button
          onClick={addTable}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("table") ? "bg-gray-100" : ""
          }`}
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        
        {editor.isActive("table") && (
          <div className="absolute z-50 left-0 mt-2 p-2 bg-white rounded-lg shadow-lg border min-w-[200px] hidden group-hover:block">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={addColumnBefore}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Add column before
              </button>
              <button
                onClick={addColumnAfter}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Add column after
              </button>
              <button
                onClick={deleteColumn}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Delete column
              </button>
              <button
                onClick={addRowBefore}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Add row before
              </button>
              <button
                onClick={addRowAfter}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Add row after
              </button>
              <button
                onClick={deleteRow}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Delete row
              </button>
              <button
                onClick={mergeOrSplitCells}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Merge/split cells
              </button>
              <button
                onClick={toggleHeaderRow}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Toggle header row
              </button>
              <button
                onClick={toggleHeaderColumn}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Toggle header column
              </button>
              <button
                onClick={toggleHeaderCell}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left"
              >
                Toggle header cell
              </button>
              <button
                onClick={deleteTable}
                className="p-1 text-xs rounded hover:bg-gray-100 text-left text-red-500"
              >
                Delete table
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-px bg-gray-200 mx-1" />

      <div className="relative group">
        <button
          onClick={() => editor.chain().focus().setCallout('info').run()}
          className={`p-2 rounded hover:bg-gray-100 text-blue-500 ${
            editor.isActive('callout', { type: 'info' }) ? 'bg-blue-50' : ''
          }`}
          title="Add info callout"
        >
          <AlertCircleIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setCallout('warning').run()}
          className={`p-2 rounded hover:bg-gray-100 text-yellow-500 ${
            editor.isActive('callout', { type: 'warning' }) ? 'bg-yellow-50' : ''
          }`}
          title="Add warning callout"
        >
          <AlertTriangleIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setCallout('success').run()}
          className={`p-2 rounded hover:bg-gray-100 text-green-500 ${
            editor.isActive('callout', { type: 'success' }) ? 'bg-green-50' : ''
          }`}
          title="Add success callout"
        >
          <CheckCircleIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setCallout('error').run()}
          className={`p-2 rounded hover:bg-gray-100 text-red-500 ${
            editor.isActive('callout', { type: 'error' }) ? 'bg-red-50' : ''
          }`}
          title="Add error callout"
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px bg-gray-200 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('codeBlock') ? 'bg-gray-100' : ''
        }`}
        title="Code block"
      >
        <CodeIcon className="w-4 h-4" />
      </button>

      <div className="flex gap-1">
        <select
          onChange={(e) => {
            editor.chain().focus().setFontSize(e.target.value).run();
          }}
          className="h-8 px-2 border rounded hover:bg-gray-100"
          value={editor.getAttributes("textStyle").fontSize || ""}
        >
          <option value="">Font size</option>
          {fontSizes.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="relative">
          <button
            ref={colorButtonRef}
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
            className="p-2 rounded hover:bg-gray-100"
            title="Text Color"
          >
            <ColorIcon className="w-4 h-4" />
          </button>
          <ColorPicker
            editor={editor}
            isOpen={colorPickerOpen}
            setIsOpen={setColorPickerOpen}
            type="color"
            buttonRef={colorButtonRef}
          />
        </div>

        <div className="relative">
          <button
            ref={highlightButtonRef}
            onClick={() => setHighlightPickerOpen(!highlightPickerOpen)}
            className="p-2 rounded hover:bg-gray-100"
            title="Highlight"
          >
            <HighlightIcon className="w-4 h-4" />
          </button>
          <ColorPicker
            editor={editor}
            isOpen={highlightPickerOpen}
            setIsOpen={setHighlightPickerOpen}
            type="highlight"
            buttonRef={highlightButtonRef}
          />
        </div>
      </div>
    </div>
  )
} 
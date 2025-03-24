import React, { useRef, useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'

interface ColorPickerProps {
  editor: Editor
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  type: 'color' | 'highlight'
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

const colors = [
  { value: '#000000', label: 'Black' },
  { value: '#434343', label: 'Dark Gray' },
  { value: '#666666', label: 'Gray' },
  { value: '#999999', label: 'Light Gray' },
  { value: '#FF0000', label: 'Red' },
  { value: '#FF8C00', label: 'Orange' },
  { value: '#FFD700', label: 'Gold' },
  { value: '#008000', label: 'Green' },
  { value: '#0000FF', label: 'Blue' },
  { value: '#4B0082', label: 'Indigo' },
  { value: '#800080', label: 'Purple' },
  { value: '#FFC0CB', label: 'Pink' },
]

export function ColorPicker({ editor, isOpen, setIsOpen, type, buttonRef }: ColorPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom')
  const [currentColor, setCurrentColor] = useState<string | null>(null)

  // Get current color from editor
  useEffect(() => {
    if (editor) {
      const attrs = editor.getAttributes(type === 'color' ? 'textStyle' : 'highlight')
      setCurrentColor(type === 'color' ? attrs.color : attrs.color || null)
    }
  }, [editor, type])

  // Check available space and position picker
  useEffect(() => {
    if (isOpen && buttonRef.current && pickerRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const pickerHeight = pickerRef.current.offsetHeight
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top

      setPosition(spaceBelow < pickerHeight && spaceAbove > spaceBelow ? 'top' : 'bottom')
    }
  }, [isOpen])

  const command = (color: string | null) => {
    if (type === 'color') {
      if (color === null) {
        editor.chain().focus().unsetColor().run()
      } else {
        editor.chain().focus().setColor(color).run()
      }
    } else {
      if (color === null) {
        editor.chain().focus().unsetHighlight().run()
      } else {
        editor.chain().focus().toggleHighlight({ color }).run()
      }
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div
      ref={pickerRef}
      className={`
        absolute z-50 p-3 bg-white rounded-lg shadow-lg border min-w-[180px]
        ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
      `}
      style={{ left: '-75px' }}
    >
      {/* Default color option */}
      <button
        className={`
          w-full p-2 mb-2 text-sm rounded flex items-center gap-2 hover:bg-gray-100
          ${!currentColor ? 'bg-gray-100' : ''}
        `}
        onClick={() => command(null)}
      >
        <div className="w-4 h-4 rounded-full border border-gray-300 bg-white" />
        <span>Default</span>
      </button>

      {/* Color divider */}
      <div className="h-px bg-gray-200 mb-2" />

      {/* Color grid */}
      <div className="grid grid-cols-4 gap-2">
        {colors.map(({ value, label }) => (
          <button
            key={value}
            className={`
              group flex flex-col items-center gap-1 p-1 rounded hover:bg-gray-50
              ${value === currentColor ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
            `}
            onClick={() => command(value)}
            title={label}
          >
            <div 
              className="w-6 h-6 rounded shadow-sm" 
              style={{ backgroundColor: value }}
            />
          </button>
        ))}
      </div>
    </div>
  )
} 
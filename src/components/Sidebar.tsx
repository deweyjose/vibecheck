import { useState, useRef } from 'react'
import {
  ChevronDownIcon,
  DocumentIcon,
  FolderIcon,
  PlusIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { useWiki } from '../contexts/WikiContext'
import ContextMenu from './ContextMenu'
import { useDrag, useDrop } from 'react-dnd'
import type { DropTargetMonitor } from 'react-dnd'
import './DragStyles.css'

// Define our types
interface Page {
  id: string
  title: string
  type: 'folder' | 'document'
  children?: Page[]
  isExpanded?: boolean
}

// Define drag item types
const ItemTypes = {
  PAGE: 'page',
}

// Define the drag item structure
interface DragItem {
  id: string
  type: string
  pageType: 'folder' | 'document'
  depth: number
}

function SortablePage({ 
  page, 
  depth 
}: { 
  page: Page
  depth: number
}) {
  const { 
    activePage, 
    setActivePage, 
    toggleFolder, 
    addPage, 
    deletePage, 
    renamePage,
    duplicatePage,
    exportPage,
    copyPageLink,
    movePage
  } = useWiki()
  
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(page.title)
  const ref = useRef<HTMLDivElement>(null)
  const [dropIndicator, setDropIndicator] = useState<'top' | 'bottom' | 'inside' | null>(null)

  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFolder(page.id)
  }

  // Calculate padding based on depth
  const getPaddingClass = (depth: number) => {
    switch(depth) {
      case 0: return 'pl-3'
      case 1: return 'pl-8'
      case 2: return 'pl-12'
      case 3: return 'pl-16'
      case 4: return 'pl-20'
      default: return 'pl-24'
    }
  }

  // Set up drag source
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: ItemTypes.PAGE,
    item: { 
      id: page.id, 
      type: ItemTypes.PAGE,
      pageType: page.type,
      depth 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Set up drop target
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, unknown, { isOver: boolean; canDrop: boolean }>({
    accept: ItemTypes.PAGE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return
      
      // Don't allow dropping on itself
      if (item.id === page.id) {
        setDropIndicator(null)
        return
      }

      // Calculate vertical position to determine drop position
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      
      if (!clientOffset) return
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      
      // Determine drop position based on hover location
      if (hoverClientY < hoverMiddleY / 2) {
        setDropIndicator('top')
      } else if (hoverClientY > hoverMiddleY * 1.5) {
        setDropIndicator('bottom')
      } else if (page.type === 'folder') {
        setDropIndicator('inside')
      } else {
        // For documents, just use top or bottom
        setDropIndicator(hoverClientY < hoverMiddleY ? 'top' : 'bottom')
      }
    },
    drop: (item: DragItem, monitor) => {
      if (!ref.current) return
      
      if (item.id === page.id) return
      
      // Prevent dropping a parent into its own child
      if (item.pageType === 'folder') {
        // Logic for preventing folders from being dropped into their descendants
        // is handled in the movePage function
      }
      
      let position: 'before' | 'after' | 'inside' = 'inside'
      
      if (dropIndicator === 'top') {
        position = 'before'
      } else if (dropIndicator === 'bottom') {
        position = 'after'
      }
      
      // If dropping on a document with 'inside' position, change to 'after'
      if (position === 'inside' && page.type === 'document') {
        position = 'after'
      }
      
      movePage(item.id, page.id, position)
      setDropIndicator(null)
    },
  })
  
  // Clear indicator when not being dragged over
  if (!isOver && dropIndicator !== null) {
    setDropIndicator(null)
  }
  
  // Connect both drag and drop refs
  drag(drop(ref))

  return (
    <ContextMenu
      onNewDocument={() => addPage('document', page.id)}
      onNewFolder={() => addPage('folder', page.id)}
      onRename={() => setIsRenaming(true)}
      onDelete={() => deletePage(page.id)}
      onDuplicate={() => duplicatePage(page.id)}
      onExport={() => exportPage(page.id)}
      onCopyLink={() => copyPageLink(page.id)}
      isFolder={page.type === 'folder'}
    >
      <div className="relative">
        {dropIndicator === 'top' && (
          <div className="drop-target-indicator-top" />
        )}
        
        <div 
          ref={ref}
          className={`
            flex items-center gap-2 ${getPaddingClass(depth)} pr-3 py-1.5 rounded-md relative drag-item
            ${activePage === page.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
            ${depth > 0 ? 'before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-px before:bg-gray-200' : ''}
            ${isOver && dropIndicator === 'inside' ? 'drop-target-inside' : ''}
            ${isDragging ? 'dragging' : ''}
          `}
        >
          {page.type === 'folder' ? (
            <button
              onClick={handleFolderClick}
              className="p-0.5 relative z-10 text-gray-500"
            >
              {page.isExpanded ? (
                <FolderOpenIcon className="w-4 h-4" />
              ) : (
                <FolderIcon className="w-4 h-4" />
              )}
            </button>
          ) : (
            <DocumentIcon className="w-4 h-4 relative z-10 text-gray-500" />
          )}

          {isRenaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => {
                if (newTitle.trim()) {
                  renamePage(page.id, newTitle)
                }
                setIsRenaming(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTitle.trim()) {
                  renamePage(page.id, newTitle)
                  setIsRenaming(false)
                }
              }}
              className="flex-1 bg-white border rounded px-1 text-sm"
              autoFocus
            />
          ) : (
            <button
              onClick={() => page.type === 'document' && setActivePage(page.id)}
              className="flex-1 text-left text-sm relative z-10"
            >
              {page.title}
            </button>
          )}
        </div>
        
        {dropIndicator === 'bottom' && (
          <div className="drop-target-indicator-bottom" />
        )}

        {page.type === 'folder' && page.isExpanded && page.children && (
          <div className="mt-1">
            {page.children.map(childPage => (
              <SortablePage
                key={childPage.id}
                page={childPage}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </ContextMenu>
  )
}

function Sidebar() {
  const { pages, addPage } = useWiki()
  const [showNewMenu, setShowNewMenu] = useState(false)
  const rootDropRef = useRef<HTMLDivElement>(null)
  const [isOverRoot, setIsOverRoot] = useState(false)
  
  // Set up root level drop target
  const [, drop] = useDrop<DragItem, unknown, { isOver: boolean }>({
    accept: ItemTypes.PAGE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item: DragItem, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        setIsOverRoot(true)
      }
    },
    drop: (item: DragItem, monitor) => {
      // Only handle if dropped directly on the root, not on a child
      if (monitor.didDrop()) {
        return
      }
      
      const { id } = item
      // Add the page to the root level
      // This is handled by removing it from its current location and not specifying a parent
      useWiki().movePage(id, '', 'inside')
      setIsOverRoot(false)
    },
  })
  
  drop(rootDropRef)

  return (
    <div className="p-4" ref={rootDropRef}>
      <div className="flex items-center justify-between mb-6 relative">
        <h1 className="text-xl font-semibold text-gray-800">Vibecheck</h1>
        
        <div className="relative">
          <button 
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium inline-flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            New
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showNewMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white/100 backdrop-blur-lg rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  addPage('document')
                  setShowNewMenu(false)
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <DocumentIcon className="w-4 h-4" />
                New Document
              </button>
              <button
                onClick={() => {
                  addPage('folder')
                  setShowNewMenu(false)
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FolderIcon className="w-4 h-4" />
                New Folder
              </button>
            </div>
          )}
        </div>
      </div>
      
      <nav className={`space-y-1 root-drop-target ${isOverRoot ? 'active' : ''}`}>
        {pages.map(page => (
          <SortablePage
            key={page.id}
            page={page}
            depth={0}
          />
        ))}
      </nav>
    </div>
  )
}

export default Sidebar 
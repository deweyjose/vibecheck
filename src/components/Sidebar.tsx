import { useState } from 'react'
import {
  ChevronDownIcon,
  DocumentIcon,
  FolderIcon,
  PlusIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { useWiki } from '../contexts/WikiContext'
import ContextMenu from './ContextMenu'

// Define our types
interface Page {
  id: string
  title: string
  type: 'folder' | 'document'
  children?: Page[]
  isExpanded?: boolean
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
    copyPageLink
  } = useWiki()
  
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(page.title)

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
        <div className={`
          flex items-center gap-2 ${getPaddingClass(depth)} pr-3 py-1.5 rounded-md relative
          ${activePage === page.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
          ${depth > 0 ? 'before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-px before:bg-gray-200' : ''}
        `}>
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

  return (
    <div className="p-4">
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
      
      <nav className="space-y-1">
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
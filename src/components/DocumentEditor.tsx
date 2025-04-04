import { useEffect } from 'react'
import { useWiki } from '../contexts/WikiContext'
import { 
  CheckCircleIcon, 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import RichTextEditor from './editor/RichTextEditor'

function SaveStatus() {
  const { saveStatus, lastSaved, forceSave } = useWiki();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault(); // Prevent browser's save dialog
        forceSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [forceSave]);

  const getStatusIcon = () => {
    switch (saveStatus) {
      case "saved":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "saving":
        return <ArrowPathIcon className="w-4 h-4 text-gray-400 animate-spin" />;
      case "error":
        return <ExclamationCircleIcon className="w-4 h-4 text-red-500" />;
      case "unsaved":
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case "saved":
        return `Last saved ${lastSaved?.toLocaleTimeString()}`;
      case "saving":
        return "Saving...";
      case "error":
        return "Error saving";
      case "unsaved":
        return "Unsaved changes";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
      {(saveStatus === "unsaved" || saveStatus === "error") && (
        <button
          onClick={forceSave}
          className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-md
            text-sm font-medium transition-colors
            ${
              saveStatus === "error"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }
          `}
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Save now
        </button>
      )}
    </div>
  );
}

function DocumentEditor() {
  const { activePage, getPage, updatePageContent } = useWiki()
  const page = activePage ? getPage(activePage) : null

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-6 text-gray-500">
        Select a document to start editing
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={page.title}
            className="text-3xl font-bold border-none outline-none"
            placeholder="Page title"
            readOnly
          />
          <SaveStatus />
        </div>

        <RichTextEditor
          content={page.content ?? ''}
          onChange={(content) => updatePageContent(page.id, content)}
        />
      </div>
    </div>
  )
}

export default DocumentEditor 
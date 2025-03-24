import {
  DocumentPlusIcon,
  FolderPlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useRef, useEffect, useState } from "react";

interface ContextMenuProps {
  children: React.ReactNode;
  onNewDocument: () => void;
  onNewFolder: () => void;
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onCopyLink: () => void;
  isFolder: boolean;
}

function ContextMenu({
  children,
  onNewDocument,
  onNewFolder,
  onRename,
  onDelete,
  onDuplicate,
  onExport,
  onCopyLink,
  isFolder,
}: ContextMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={triggerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        const rect = (e.target as HTMLElement)
          .closest(".flex.items-center")
          ?.getBoundingClientRect();
        console.log(rect);
        if (rect) {
          setPosition({
            x: rect.x + 5,
            y: rect.y + rect.height,
          });
          setShowMenu(true);
        }
      }}
    >
      {children}

      {showMenu && (
        <div
          className="fixed min-w-[200px] max-w-[calc(100vw-theme(spacing.64))] bg-white/100 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
        >
          {isFolder && (
            <>
              <button
                className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
                onClick={() => {
                  onNewDocument();
                  setShowMenu(false);
                }}
              >
                <DocumentPlusIcon className="w-4 h-4" />
                New Document
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
                onClick={() => {
                  onNewFolder();
                  setShowMenu(false);
                }}
              >
                <FolderPlusIcon className="w-4 h-4" />
                New Folder
              </button>
              <div className="h-px bg-gray-200 my-1" />
            </>
          )}

          <button
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
            onClick={() => {
              onDuplicate();
              setShowMenu(false);
            }}
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
            Duplicate
          </button>

          <button
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
            onClick={() => {
              onRename();
              setShowMenu(false);
            }}
          >
            <PencilIcon className="w-4 h-4" />
            Rename
          </button>

          <button
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
            onClick={() => {
              onExport();
              setShowMenu(false);
            }}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Export
          </button>

          <button
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
            onClick={() => {
              onCopyLink();
              setShowMenu(false);
            }}
          >
            <LinkIcon className="w-4 h-4" />
            Copy Link
          </button>

          <div className="h-px bg-gray-200 my-1" />

          <button
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer outline-none"
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ContextMenu;

import toast from 'react-hot-toast';
import { createContext, useContext, useState, ReactNode } from "react";

interface Page {
  id: string;
  title: string;
  type: "folder" | "document";
  children?: Page[];
  isExpanded?: boolean;
  content?: string;
}

interface WikiContextType {
  pages: Page[];
  activePage: string | null;
  setActivePage: (id: string | null) => void;
  addPage: (type: "document" | "folder", parentId?: string) => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, newTitle: string) => void;
  toggleFolder: (id: string) => void;
  updatePageOrder: (pages: Page[]) => void;
  getPage: (id: string) => Page | null;
  updatePageContent: (id: string, content: string) => void;
  duplicatePage: (id: string) => void;
  exportPage: (id: string) => void;
  copyPageLink: (id: string) => void;
  movePage: (
    sourceId: string,
    targetId: string,
    position?: "before" | "after" | "inside"
  ) => void;
  lastSaved: Date | null;
  saveStatus: "saved" | "saving" | "error" | "unsaved";
  forceSave: () => Promise<void>;
}

const WikiContext = createContext<WikiContextType | null>(null);

export function WikiProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "1",
      title: "Getting Started",
      type: "folder",
      isExpanded: true,
      children: [
        {
          id: "1-1",
          title: "Welcome",
          type: "document",
          content: "Welcome to the wiki!",
        },
        { id: "1-2", title: "Quick Start", type: "document" },
      ],
    },
    {
      id: "2",
      title: "Documentation",
      type: "folder",
      isExpanded: false,
      children: [{ id: "2-1", title: "Installation", type: "document" }],
    },
  ]);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "error" | "unsaved"
  >("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const findPage = (id: string, pages: Page[]): Page | null => {
    for (const page of pages) {
      if (page.id === id) return page;
      if (page.children) {
        const found = findPage(id, page.children);
        if (found) return found;
      }
    }
    return null;
  };

  const addPage = (type: "document" | "folder", parentId?: string) => {
    const newPage: Page = {
      id: `${Date.now()}`,
      title: type === "document" ? "New Document" : "New Folder",
      type,
      children: type === "folder" ? [] : undefined,
      isExpanded: type === "folder" ? true : undefined,
      content: type === "document" ? "" : undefined,
    };

    setPages((prevPages) => {
      if (!parentId) return [...prevPages, newPage];

      const updateChildren = (pages: Page[]): Page[] => {
        return pages.map((page) => {
          if (page.id === parentId) {
            return {
              ...page,
              children: [...(page.children ?? []), newPage],
              isExpanded: true,
            };
          }
          if (page.children) {
            return { ...page, children: updateChildren(page.children) };
          }
          return page;
        });
      };

      return updateChildren(prevPages);
    });

    if (type === "document") {
      setActivePage(newPage.id);
    }
  };

  const deletePage = (id: string) => {
    const pageToDelete = findPage(id, pages);

    setPages((prevPages) => {
      const deleteFromPages = (pages: Page[]): Page[] => {
        return pages.filter((page) => {
          if (page.id === id) return false;
          if (page.children) {
            page.children = deleteFromPages(page.children);
          }
          return true;
        });
      };
      return deleteFromPages(prevPages);
    });

    if (activePage === id) {
      setActivePage(null);
    }

    const itemType = pageToDelete?.type === "folder" ? "Folder" : "Document";
    toast.success(`${itemType} deleted`);
  };

  const renamePage = (id: string, newTitle: string) => {
    const pageToRename = findPage(id, pages);

    setPages((prevPages) => {
      const updateTitle = (pages: Page[]): Page[] => {
        return pages.map((page) => {
          if (page.id === id) {
            return { ...page, title: newTitle };
          }
          if (page.children) {
            return { ...page, children: updateTitle(page.children) };
          }
          return page;
        });
      };
      return updateTitle(prevPages);
    });

    const itemType = pageToRename?.type === "folder" ? "Folder" : "Document";
    toast.success(`${itemType} renamed`);
  };

  const toggleFolder = (id: string) => {
    setPages((prevPages) => {
      const toggle = (pages: Page[]): Page[] => {
        return pages.map((page) => {
          if (page.id === id) {
            return { ...page, isExpanded: !page.isExpanded };
          }
          if (page.children) {
            return { ...page, children: toggle(page.children) };
          }
          return page;
        });
      };
      return toggle(prevPages);
    });
  };

  const saveContent = async (pageId: string, content: string) => {
    try {
      setSaveStatus("saving");

      // Simulate API call - replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update the page content
      setPages((prevPages) => {
        const updateContent = (pages: Page[]): Page[] => {
          return pages.map((page) => {
            if (page.id === pageId) {
              return { ...page, content };
            }
            if (page.children) {
              return { ...page, children: updateContent(page.children) };
            }
            return page;
          });
        };
        return updateContent(prevPages);
      });

      setLastSaved(new Date());
      setSaveStatus("saved");
      toast.success("Changes saved");
    } catch (error) {
      setSaveStatus("error");
      toast.error("Failed to save changes");
      console.error("Save error:", error);
    }
  };

  const updatePageContent = (id: string, content: string) => {
    setPages((prevPages) => {
      const updateContent = (pages: Page[]): Page[] => {
        return pages.map((page) => {
          if (page.id === id) {
            return { ...page, content };
          }
          if (page.children) {
            return { ...page, children: updateContent(page.children) };
          }
          return page;
        });
      };
      return updateContent(prevPages);
    });
    setSaveStatus("unsaved");
  };

  const forceSave = async () => {
    if (!activePage) return;
    const currentPage = findPage(activePage, pages);
    if (currentPage?.content !== undefined) {
      await saveContent(activePage, currentPage.content);
    }
  };

  const duplicatePage = (id: string) => {
    const sourcePage = findPage(id, pages);
    if (!sourcePage) return;

    const duplicateWithNewId = (page: Page): Page => {
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...page,
        id: newId,
        title: `${page.title} (Copy)`,
        children: page.children?.map(duplicateWithNewId),
      };
    };

    const newPage = duplicateWithNewId(sourcePage);
    setPages((prevPages) => {
      const insertDuplicate = (pages: Page[]): Page[] => {
        return pages
          .map((page) => {
            if (page.id === id) {
              return [page, newPage];
            }
            if (page.children) {
              return {
                ...page,
                children: insertDuplicate(page.children).flat(),
              };
            }
            return page;
          })
          .flat();
      };
      return insertDuplicate(prevPages);
    });

    const itemType = sourcePage.type === "folder" ? "Folder" : "Document";
    toast.success(`${itemType} duplicated`);
  };

  const exportPage = async (id: string) => {
    const page = findPage(id, pages);
    if (!page) return;

    const exportData = {
      title: page.title,
      content: page.content,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPageLink = (id: string) => {
    const baseUrl = window.location.origin;
    const pageUrl = `${baseUrl}/wiki/${id}`;
    navigator.clipboard
      .writeText(pageUrl)
      .then(() => {
        // You might want to add a toast notification here
        toast.success("Link copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy link:", err);
      });
  };

  const movePage = (
    sourceId: string,
    targetId: string,
    position: "before" | "after" | "inside" = "inside"
  ) => {
    // Don't move if source and target are the same
    if (sourceId === targetId) return;

    // Find source page and its parent
    let sourcePage: Page | null = null;
    let sourceParentId: string | null = null;

    const findSourceAndParent = (
      pages: Page[],
      parentId: string | null = null
    ): boolean => {
      for (const page of pages) {
        if (page.id === sourceId) {
          sourcePage = page;
          sourceParentId = parentId;
          return true;
        }
        if (page.children && findSourceAndParent(page.children, page.id)) {
          return true;
        }
      }
      return false;
    };
    findSourceAndParent(pages);

    if (!sourcePage) return;

    // If the targetId is empty, we're moving to the root level
    if (!targetId) {
      // Need to type assert sourcePage correctly to avoid TypeScript error
      const typedSourcePage = sourcePage as Page;
      const itemType =
        typedSourcePage.type === "folder" ? "Folder" : "Document";

      // Remove from current location and add to root level
      setPages((prevPages) => {
        // First, create a copy of the source page
        const sourcePageCopy = { ...typedSourcePage };

        // Then, filter out the source page from its current location
        const pagesWithoutSource = prevPages.filter((page) => {
          if (page.id === sourceId) return false;
          if (page.children) {
            page.children = page.children.filter(
              (child) => child.id !== sourceId
            );
          }
          return true;
        });

        // Add the source page to the root level
        return [...pagesWithoutSource, sourcePageCopy];
      });

      toast.success(`${itemType} moved to root level`);
      return;
    }

    // Check if target is a child of source (to prevent invalid moves)
    const isTargetChildOfSource = (
      sourceId: string,
      targetId: string
    ): boolean => {
      const checkChildren = (pageId: string, targetId: string): boolean => {
        const page = findPage(pageId, pages);
        if (!page || !page.children) return false;

        return page.children.some(
          (child) => child.id === targetId || checkChildren(child.id, targetId)
        );
      };

      return checkChildren(sourceId, targetId);
    };

    if (isTargetChildOfSource(sourceId, targetId)) {
      toast.error("Cannot move a folder into its own descendant");
      return;
    }

    // Remove the source page from its current location
    setPages((prevPages) => {
      const removeSource = (pages: Page[]): Page[] => {
        if (!pages) return [];
        return pages.filter((page) => {
          if (page.id === sourceId) return false;
          if (page.children) {
            page.children = removeSource(page.children);
          }
          return true;
        });
      };
      return removeSource(prevPages);
    });

    // Wait for state update to complete before inserting
    setTimeout(() => {
      // Insert the source page at the new location
      setPages((prevPages) => {
        const insertAtTarget = (pages: Page[]): Page[] => {
          return pages
            .map((page) => {
              // Handle the three possible positions
              if (page.id === targetId) {
                if (position === "inside") {
                  // If target is a folder, insert inside
                  if (page.type === "folder") {
                    return {
                      ...page,
                      children: [...(page.children || []), sourcePage!],
                      isExpanded: true, // Auto-expand the folder
                    };
                  } else {
                    // If target is a document, insert after
                    return [page, sourcePage!];
                  }
                } else if (position === "before") {
                  return [sourcePage!, page];
                } else if (position === "after") {
                  return [page, sourcePage!];
                }
              }

              // Recursively check children
              if (page.children) {
                const newChildren = insertAtTarget(page.children);
                return {
                  ...page,
                  children: Array.isArray(newChildren[0])
                    ? newChildren.flat()
                    : newChildren,
                };
              }

              return page;
            })
            .flat();
        };

        return insertAtTarget(prevPages);
      });

      // Show success message
      toast.success(
        `${
          sourcePage?.type === "folder" ? "Folder" : "Document"
        } moved successfully`
      );
    }, 0);
  };

  return (
    <WikiContext.Provider
      value={{
        pages,
        activePage,
        setActivePage,
        addPage,
        deletePage,
        renamePage,
        toggleFolder,
        updatePageOrder: setPages,
        getPage: (id) => findPage(id, pages),
        updatePageContent,
        duplicatePage,
        exportPage,
        copyPageLink,
        movePage,
        lastSaved,
        saveStatus,
        forceSave,
      }}
    >
      {children}
    </WikiContext.Provider>
  );
}

export const useWiki = () => {
  const context = useContext(WikiContext)
  if (!context) {
    throw new Error('useWiki must be used within a WikiProvider')
  }
  return context
} 
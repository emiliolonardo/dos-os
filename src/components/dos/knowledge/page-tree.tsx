'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Trash2,
  Copy,
  ExternalLink,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { KnowledgePage } from '@/types';

// Mock Data for Pages
const MOCK_PAGES: (KnowledgePage & { children?: KnowledgePage[] })[] = [
  {
    id: 'p1',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Getting Started',
    slug: 'getting-started',
    icon: '🚀',
    content: '# Getting Started\n\nWelcome to D.O.S. Collaboration OS!',
    isArchived: false,
    isPublished: true,
    order: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
    children: [
      {
        id: 'p1-1',
        workspaceId: 'ws1',
        projectId: null,
        parentId: 'p1',
        title: 'Installation',
        slug: 'installation',
        icon: '📦',
        content: '## Installation Guide...',
        isArchived: false,
        isPublished: true,
        order: 0,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
      {
        id: 'p1-2',
        workspaceId: 'ws1',
        projectId: null,
        parentId: 'p1',
        title: 'Quick Start',
        slug: 'quick-start',
        icon: '⚡',
        content: '## Quick Start Guide...',
        isArchived: false,
        isPublished: true,
        order: 1,
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      },
    ],
  },
  {
    id: 'p2',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Documentation',
    slug: 'documentation',
    icon: '📚',
    content: '# Documentation',
    isArchived: false,
    isPublished: true,
    order: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10'),
    children: [
      {
        id: 'p2-1',
        workspaceId: 'ws1',
        projectId: null,
        parentId: 'p2',
        title: 'API Reference',
        slug: 'api-reference',
        icon: '🔌',
        content: '## API Reference...',
        isArchived: false,
        isPublished: true,
        order: 0,
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-25'),
        children: [
          {
            id: 'p2-1-1',
            workspaceId: 'ws1',
            projectId: null,
            parentId: 'p2-1',
            title: 'Authentication',
            slug: 'authentication',
            icon: '🔐',
            content: '## Auth endpoints...',
            isArchived: false,
            isPublished: true,
            order: 0,
            createdAt: new Date('2024-01-22'),
            updatedAt: new Date('2024-01-22'),
          },
          {
            id: 'p2-1-2',
            workspaceId: 'ws1',
            projectId: null,
            parentId: 'p2-1',
            title: 'Projects',
            slug: 'projects-api',
            icon: '📁',
            content: '## Project endpoints...',
            isArchived: false,
            isPublished: true,
            order: 1,
            createdAt: new Date('2024-01-23'),
            updatedAt: new Date('2024-01-23'),
          },
        ],
      },
      {
        id: 'p2-2',
        workspaceId: 'ws1',
        projectId: null,
        parentId: 'p2',
        title: 'Components',
        slug: 'components',
        icon: '🧩',
        content: '## Component Library...',
        isArchived: false,
        isPublished: true,
        order: 1,
        createdAt: new Date('2024-01-24'),
        updatedAt: new Date('2024-01-24'),
      },
    ],
  },
  {
    id: 'p3',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Team Wiki',
    slug: 'team-wiki',
    icon: '🏠',
    content: '# Team Wiki',
    isArchived: false,
    isPublished: true,
    order: 2,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    children: [],
  },
  {
    id: 'p4',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Archived Pages',
    slug: 'archived',
    icon: '📦',
    content: '# Archived Content',
    isArchived: true,
    isPublished: false,
    order: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    children: [],
  },
];

interface PageTreeProps {
  workspaceId?: string;
  projectId?: string;
  selectedPageId?: string;
  onPageSelect?: (page: KnowledgePage) => void;
  onPageCreate?: (parentId?: string) => void;
  onPageDelete?: (pageId: string) => void;
  onPageDuplicate?: (pageId: string) => void;
  showArchived?: boolean;
}

export function PageTree({
  workspaceId,
  projectId,
  selectedPageId,
  onPageSelect,
  onPageCreate,
  onPageDelete,
  onPageDuplicate,
  showArchived = false,
}: PageTreeProps) {
  const [pages, setPages] = React.useState(MOCK_PAGES);
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set(['p1', 'p2', 'p2-1']));
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = React.useState<string | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newPageTitle, setNewPageTitle] = React.useState('');
  const [creatingParentId, setCreatingParentId] = React.useState<string | null>(null);

  // Filter pages based on archived status
  const filteredPages = React.useMemo(() => {
    if (showArchived) return pages;
    return pages.filter((p) => !p.isArchived);
  }, [pages, showArchived]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, pageId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(pageId);
  };

  const handleDragOver = (e: React.DragEvent, pageId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== pageId) {
      setDragOverItem(pageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetId) {
      // In a real app, this would update the page's parentId
      console.log(`Move ${draggedItem} to ${targetId}`);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      const newPage: KnowledgePage = {
        id: `new-${Date.now()}`,
        workspaceId: workspaceId || 'ws1',
        projectId: projectId || null,
        parentId: creatingParentId,
        title: newPageTitle,
        slug: newPageTitle.toLowerCase().replace(/\s+/g, '-'),
        icon: '📄',
        content: '',
        isArchived: false,
        isPublished: false,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      onPageCreate?.(creatingParentId || undefined);
      setNewPageTitle('');
      setIsCreating(false);
      setCreatingParentId(null);
    }
  };

  const startCreating = (parentId?: string) => {
    setIsCreating(true);
    setCreatingParentId(parentId || null);
    if (parentId && !expandedIds.has(parentId)) {
      setExpandedIds((prev) => new Set(prev).add(parentId));
    }
  };

  // Recursive page count
  const countPages = (pageList: typeof pages): number => {
    return pageList.reduce((acc, p) => acc + 1 + countPages(p.children || []), 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-semibold text-muted-foreground">PAGES</h3>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {countPages(filteredPages)}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => startCreating()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence initial={false}>
            {isCreating && !creatingParentId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-1"
              >
                <div className="flex items-center gap-2 pl-4">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreatePage();
                      if (e.key === 'Escape') {
                        setIsCreating(false);
                        setNewPageTitle('');
                      }
                    }}
                    onBlur={() => {
                      if (!newPageTitle.trim()) {
                        setIsCreating(false);
                      }
                    }}
                    placeholder="Untitled"
                    className="h-7 text-sm"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {filteredPages.map((page) => (
              <PageTreeItem
                key={page.id}
                page={page}
                depth={0}
                expandedIds={expandedIds}
                selectedPageId={selectedPageId}
                draggedItem={draggedItem}
                dragOverItem={dragOverItem}
                onToggle={toggleExpanded}
                onSelect={onPageSelect}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onCreateChild={startCreating}
                onDelete={onPageDelete}
                onDuplicate={onPageDuplicate}
                isCreating={isCreating}
                creatingParentId={creatingParentId}
                newPageTitle={newPageTitle}
                setNewPageTitle={setNewPageTitle}
                handleCreatePage={handleCreatePage}
                setIsCreating={setIsCreating}
              />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

// Individual Tree Item
interface PageTreeItemProps {
  page: KnowledgePage & { children?: KnowledgePage[] };
  depth: number;
  expandedIds: Set<string>;
  selectedPageId?: string;
  draggedItem: string | null;
  dragOverItem: string | null;
  onToggle: (id: string) => void;
  onSelect?: (page: KnowledgePage) => void;
  onDragStart: (e: React.DragEvent, pageId: string) => void;
  onDragOver: (e: React.DragEvent, pageId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
  onCreateChild: (parentId: string) => void;
  onDelete?: (pageId: string) => void;
  onDuplicate?: (pageId: string) => void;
  isCreating: boolean;
  creatingParentId: string | null;
  newPageTitle: string;
  setNewPageTitle: (title: string) => void;
  handleCreatePage: () => void;
  setIsCreating: (creating: boolean) => void;
}

function PageTreeItem({
  page,
  depth,
  expandedIds,
  selectedPageId,
  draggedItem,
  dragOverItem,
  onToggle,
  onSelect,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onCreateChild,
  onDelete,
  onDuplicate,
  isCreating,
  creatingParentId,
  newPageTitle,
  setNewPageTitle,
  handleCreatePage,
  setIsCreating,
}: PageTreeItemProps) {
  const hasChildren = page.children && page.children.length > 0;
  const isExpanded = expandedIds.has(page.id);
  const isSelected = selectedPageId === page.id;
  const isDragged = draggedItem === page.id;
  const isDropTarget = dragOverItem === page.id;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isDragged ? 0.5 : 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={cn(
          'group flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer',
          'hover:bg-accent/50 transition-colors',
          isSelected && 'bg-accent',
          isDropTarget && 'ring-2 ring-primary ring-offset-1'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onSelect?.(page)}
        draggable
        onDragStart={(e) => onDragStart(e, page.id)}
        onDragOver={(e) => onDragOver(e, page.id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, page.id)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(page.id);
            }}
            className="h-4 w-4 flex items-center justify-center hover:bg-accent rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Drag Handle */}
        <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />

        {/* Icon */}
        <span className="text-sm">{page.icon || '📄'}</span>

        {/* Title */}
        <span
          className={cn(
            'flex-1 text-sm truncate',
            page.isArchived && 'text-muted-foreground line-through'
          )}
        >
          {page.title}
        </span>

        {/* Badge */}
        {page.isArchived && (
          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
            Archived
          </Badge>
        )}

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent rounded"
            >
              <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onCreateChild(page.id)}>
              <Plus className="mr-2 h-4 w-4" />
              Add subpage
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate?.(page.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(page.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Create New Page Input */}
      {isCreating && creatingParentId === page.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 py-1"
          style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
        >
          <File className="h-4 w-4 text-muted-foreground" />
          <Input
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreatePage();
              if (e.key === 'Escape') {
                setIsCreating(false);
                setNewPageTitle('');
              }
            }}
            onBlur={() => {
              if (!newPageTitle.trim()) {
                setIsCreating(false);
              }
            }}
            placeholder="Untitled"
            className="h-7 text-sm"
            autoFocus
          />
        </motion.div>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <AnimatePresence initial={false}>
          {page.children!.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child as typeof page}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedPageId={selectedPageId}
              draggedItem={draggedItem}
              dragOverItem={dragOverItem}
              onToggle={onToggle}
              onSelect={onSelect}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              isCreating={isCreating}
              creatingParentId={creatingParentId}
              newPageTitle={newPageTitle}
              setNewPageTitle={setNewPageTitle}
              handleCreatePage={handleCreatePage}
              setIsCreating={setIsCreating}
            />
          ))}
        </AnimatePresence>
      )}
    </>
  );
}

export default PageTree;

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Calendar,
  File,
  Trash2,
  Copy,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { KnowledgePage } from '@/types';

// Mock Pages Data
const MOCK_PAGES: (KnowledgePage & { author?: string; wordCount?: number })[] = [
  {
    id: 'p1',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Getting Started Guide',
    slug: 'getting-started',
    icon: '🚀',
    content: '# Getting Started...',
    isArchived: false,
    isPublished: true,
    order: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
    author: 'Alice Chen',
    wordCount: 1250,
  },
  {
    id: 'p2',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'API Documentation',
    slug: 'api-docs',
    icon: '🔌',
    content: '## API Reference...',
    isArchived: false,
    isPublished: true,
    order: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10'),
    author: 'Bob Smith',
    wordCount: 3420,
  },
  {
    id: 'p3',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Design System',
    slug: 'design-system',
    icon: '🎨',
    content: '# Design System...',
    isArchived: false,
    isPublished: true,
    order: 2,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-08'),
    author: 'Carol White',
    wordCount: 2180,
  },
  {
    id: 'p4',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Team Handbook',
    slug: 'team-handbook',
    icon: '📖',
    content: '# Team Handbook...',
    isArchived: false,
    isPublished: true,
    order: 3,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-12'),
    author: 'Dave Johnson',
    wordCount: 4500,
  },
  {
    id: 'p5',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Meeting Notes - Feb',
    slug: 'meeting-notes-feb',
    icon: '📝',
    content: '## Meeting Notes...',
    isArchived: false,
    isPublished: false,
    order: 4,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-15'),
    author: 'Alice Chen',
    wordCount: 890,
  },
  {
    id: 'p6',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Release Notes v2.0',
    slug: 'release-v2',
    icon: '🎉',
    content: '## Release v2.0...',
    isArchived: false,
    isPublished: true,
    order: 5,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    author: 'Bob Smith',
    wordCount: 560,
  },
  {
    id: 'p7',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Deprecated Features',
    slug: 'deprecated',
    icon: '⚠️',
    content: '## Deprecated...',
    isArchived: true,
    isPublished: true,
    order: 6,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    author: 'Carol White',
    wordCount: 320,
  },
  {
    id: 'p8',
    workspaceId: 'ws1',
    projectId: null,
    parentId: null,
    title: 'Security Guidelines',
    slug: 'security',
    icon: '🔒',
    content: '# Security...',
    isArchived: false,
    isPublished: true,
    order: 7,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-14'),
    author: 'Dave Johnson',
    wordCount: 1890,
  },
];

type ViewMode = 'grid' | 'list';
type SortField = 'title' | 'updatedAt' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface PageListProps {
  workspaceId?: string;
  projectId?: string;
  selectedPageId?: string;
  onPageSelect?: (page: KnowledgePage) => void;
  onPageCreate?: () => void;
  onPageDelete?: (pageId: string) => void;
  onPageDuplicate?: (pageId: string) => void;
  showArchived?: boolean;
}

export function PageList({
  workspaceId,
  projectId,
  selectedPageId,
  onPageSelect,
  onPageCreate,
  onPageDelete,
  onPageDuplicate,
  showArchived = false,
}: PageListProps) {
  const [pages] = React.useState(MOCK_PAGES);
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [filterPublished, setFilterPublished] = React.useState<'all' | 'published' | 'draft'>('all');

  // Filter and sort pages
  const filteredPages = React.useMemo(() => {
    let result = [...pages];

    // Filter by archived status
    if (!showArchived) {
      result = result.filter((p) => !p.isArchived);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query)
      );
    }

    // Filter by published status
    if (filterPublished === 'published') {
      result = result.filter((p) => p.isPublished);
    } else if (filterPublished === 'draft') {
      result = result.filter((p) => !p.isPublished);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'updatedAt':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [pages, searchQuery, sortField, sortDirection, filterPublished, showArchived]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Knowledge Base</h2>
          <Badge variant="secondary">{filteredPages.length}</Badge>
        </div>
        <Button onClick={onPageCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 border-b bg-muted/30 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            className="pl-9"
          />
        </div>

        {/* Filter by Status */}
        <Select value={filterPublished} onValueChange={(v: any) => setFilterPublished(v)}>
          <SelectTrigger className="w-[130px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {sortDirection === 'asc' ? (
                <SortAsc className="h-4 w-4 mr-2" />
              ) : (
                <SortDesc className="h-4 w-4 mr-2" />
              )}
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleSort('updatedAt')}>
              Last Updated {sortField === 'updatedAt' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('createdAt')}>
              Created Date {sortField === 'createdAt' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('title')}>
              Title {sortField === 'title' && '✓'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 rounded-r-none px-3"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 rounded-l-none px-3"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Pages Display */}
      <ScrollArea className="flex-1">
        {filteredPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <File className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No pages found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPages.map((page, index) => (
                <motion.div
                  key={page.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <PageCard
                    page={page}
                    isSelected={selectedPageId === page.id}
                    onSelect={onPageSelect}
                    onDelete={onPageDelete}
                    onDuplicate={onPageDuplicate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-2">
            <AnimatePresence mode="popLayout">
              {filteredPages.map((page, index) => (
                <motion.div
                  key={page.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                >
                  <PageListItem
                    page={page}
                    isSelected={selectedPageId === page.id}
                    onSelect={onPageSelect}
                    onDelete={onPageDelete}
                    onDuplicate={onPageDuplicate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Grid Card Component
interface PageCardProps {
  page: KnowledgePage & { author?: string; wordCount?: number };
  isSelected?: boolean;
  onSelect?: (page: KnowledgePage) => void;
  onDelete?: (pageId: string) => void;
  onDuplicate?: (pageId: string) => void;
}

function PageCard({ page, isSelected, onSelect, onDelete, onDuplicate }: PageCardProps) {
  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary',
        page.isArchived && 'opacity-60'
      )}
      onClick={() => onSelect?.(page)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{page.icon || '📄'}</span>
            <CardTitle className="text-base line-clamp-1">{page.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDuplicate?.(page.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in new tab
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
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
          {page.isPublished ? (
            <Badge variant="secondary" className="text-xs ml-auto">
              Published
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs ml-auto">
              Draft
            </Badge>
          )}
        </div>
        {(page.author || page.wordCount) && (
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            {page.author && <span>by {page.author}</span>}
            {page.wordCount && <span>{page.wordCount} words</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// List Item Component
interface PageListItemProps {
  page: KnowledgePage & { author?: string; wordCount?: number };
  isSelected?: boolean;
  onSelect?: (page: KnowledgePage) => void;
  onDelete?: (pageId: string) => void;
  onDuplicate?: (pageId: string) => void;
}

function PageListItem({
  page,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: PageListItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
        'hover:bg-accent/50',
        isSelected && 'bg-accent',
        page.isArchived && 'opacity-60'
      )}
      onClick={() => onSelect?.(page)}
    >
      <span className="text-xl">{page.icon || '📄'}</span>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{page.title}</span>
          {page.isArchived && (
            <Badge variant="outline" className="text-xs">
              Archived
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
          {page.author && <span>by {page.author}</span>}
          {page.wordCount && <span>{page.wordCount} words</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {page.isPublished ? (
          <Badge variant="secondary" className="text-xs">
            Published
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">
            Draft
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDuplicate?.(page.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in new tab
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
      </div>
    </div>
  );
}

export default PageList;

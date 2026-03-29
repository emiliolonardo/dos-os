'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Sparkles,
  ChevronDown,
  X,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ConceptCard } from './concept-card';
import type { Concept, ConceptStatus } from '@/types';

// Categories for filtering
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'product', label: 'Product' },
  { value: 'service', label: 'Service' },
  { value: 'experience', label: 'Experience' },
  { value: 'feature', label: 'Feature' },
  { value: 'campaign', label: 'Campaign' },
];

// Status options
const STATUSES: { value: ConceptStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'refined', label: 'Refined' },
  { value: 'archived', label: 'Archived' },
];

// Sort options
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_liked', label: 'Most Liked' },
  { value: 'most_viewed', label: 'Most Viewed' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
];

interface ConceptGridProps {
  concepts: Concept[];
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onConceptClick?: (concept: Concept) => void;
  onConceptEdit?: (concept: Concept) => void;
  onConceptDelete?: (concept: Concept) => void;
  onConceptArchive?: (concept: Concept) => void;
  onConceptDuplicate?: (concept: Concept) => void;
  onConceptLike?: (concept: Concept) => void;
  onGenerateNew?: () => void;
  onRefresh?: () => void;
  likedConcepts?: Set<string>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function ConceptGrid({
  concepts,
  isLoading = false,
  viewMode = 'grid',
  onViewModeChange,
  onConceptClick,
  onConceptEdit,
  onConceptDelete,
  onConceptArchive,
  onConceptDuplicate,
  onConceptLike,
  onGenerateNew,
  onRefresh,
  likedConcepts = new Set(),
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: ConceptGridProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState<ConceptStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState('newest');
  const [showFilters, setShowFilters] = React.useState(false);

  // Extract all unique tags from concepts
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    concepts.forEach(concept => {
      if (concept.tags) {
        try {
          const tags = Array.isArray(concept.tags) ? concept.tags : JSON.parse(concept.tags as string);
          tags.forEach((tag: string) => tagSet.add(tag));
        } catch {
          // Ignore parse errors
        }
      }
    });
    return Array.from(tagSet).sort();
  }, [concepts]);

  // Filter and sort concepts
  const filteredConcepts = React.useMemo(() => {
    let filtered = [...concepts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(concept =>
        concept.title.toLowerCase().includes(query) ||
        concept.description.toLowerCase().includes(query) ||
        concept.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(concept =>
        concept.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(concept => concept.status === selectedStatus);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(concept => {
        if (!concept.tags) return false;
        try {
          const tags = Array.isArray(concept.tags) ? concept.tags : JSON.parse(concept.tags as string);
          return selectedTags.some(tag => tags.includes(tag));
        } catch {
          return false;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most_liked':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'most_viewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [concepts, searchQuery, selectedCategory, selectedStatus, selectedTags, sortBy]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedTags([]);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedTags.length > 0;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className={cn(
          'grid gap-4',
          viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
        )}>
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Concepts</h2>
          <Badge variant="secondary" className="text-sm">
            {filteredConcepts.length} {filteredConcepts.length === 1 ? 'concept' : 'concepts'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onViewModeChange?.('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onViewModeChange?.('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {onGenerateNew && (
            <Button onClick={onGenerateNew} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ConceptStatus | 'all')}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* More Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    !
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-2 space-y-3">
                {/* Sort */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Tags</label>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {allTags.slice(0, 10).map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer text-xs"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              Tag: {tag}
              <button onClick={() => toggleTag(tag)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Concepts Grid/List */}
      {filteredConcepts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No concepts found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more concepts'
              : 'Get started by generating your first concept with AI'}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : onGenerateNew && (
            <Button onClick={onGenerateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Generate Concept
            </Button>
          )}
        </motion.div>
      ) : (
        <>
          <div className={cn(
            'grid gap-4',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}>
            <AnimatePresence mode="popLayout">
              {filteredConcepts.map((concept) => (
                <motion.div
                  key={concept.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ConceptCard
                    concept={concept}
                    viewMode={viewMode}
                    onClick={() => onConceptClick?.(concept)}
                    onEdit={() => onConceptEdit?.(concept)}
                    onDelete={() => onConceptDelete?.(concept)}
                    onArchive={() => onConceptArchive?.(concept)}
                    onDuplicate={() => onConceptDuplicate?.(concept)}
                    onLike={() => onConceptLike?.(concept)}
                    isLiked={likedConcepts.has(concept.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {hasMore && onLoadMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="min-w-[200px]"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Skeleton component for loading state
function CardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="p-4 border-t flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export default ConceptGrid;

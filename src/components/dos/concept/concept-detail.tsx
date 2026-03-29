'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Heart,
  Eye,
  Sparkles,
  Calendar,
  FolderKanban,
  Image as ImageIcon,
  Share2,
  Download,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  FileText,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Concept, ConceptStatus } from '@/types';

// Category colors
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  product: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  service: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  experience: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  feature: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  campaign: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  default: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' },
};

// Status colors
const STATUS_COLORS: Record<ConceptStatus, { bg: string; text: string }> = {
  draft: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
  refined: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  archived: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
};

interface ConceptVariant {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
}

// Format date helper
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Detail Content Component (defined outside to avoid recreation)
interface DetailContentProps {
  concept: Concept;
  tags: string[];
  conceptVariants: ConceptVariant[];
  activeVariant: number;
  setActiveVariant: (idx: number) => void;
  currentVariant: ConceptVariant | null;
  imageError: boolean;
  setImageError: (error: boolean) => void;
  isLiked: boolean;
  onClose: () => void;
  onLike?: (concept: Concept) => void;
  onEdit?: (concept: Concept) => void;
  onDelete?: (concept: Concept) => void;
  onArchive?: (concept: Concept) => void;
  relatedConcepts: Concept[];
}

function DetailContent({
  concept,
  tags,
  conceptVariants,
  activeVariant,
  setActiveVariant,
  currentVariant,
  imageError,
  setImageError,
  isLiked,
  onClose,
  onLike,
  onEdit,
  onDelete,
  onArchive,
  relatedConcepts,
}: DetailContentProps) {
  const categoryStyle = CATEGORY_COLORS[concept.category?.toLowerCase() || ''] || CATEGORY_COLORS.default;
  const statusStyle = STATUS_COLORS[concept.status];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportContent = () => {
    const contentStr = `# ${concept.title}\n\n${concept.description}\n\n## Details\n\n${currentVariant?.content || concept.content || ''}\n\n## Tags\n${tags.join(', ')}`;
    const blob = new Blob([contentStr], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${concept.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {concept.imageUrl && !imageError ? (
          <img
            src={concept.imageUrl}
            alt={concept.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {concept.isAIGenerated && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Generated
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className={cn('shadow-sm', statusStyle.bg, statusStyle.text)}>
              {concept.status}
            </Badge>
          </div>
        </div>

        {/* Close button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full shadow-lg"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Title and Description */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{concept.title}</h2>
            <p className="text-muted-foreground">{concept.description}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FolderKanban className="h-4 w-4" />
              <Badge variant="outline" className={cn(categoryStyle.bg, categoryStyle.text, categoryStyle.border)}>
                {concept.category || 'Uncategorized'}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(concept.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {concept.views} views
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className={cn('h-4 w-4', isLiked && 'fill-rose-500 text-rose-500')} />
              {concept.likes} likes
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Variants Carousel */}
          {conceptVariants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Concept Variants</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {conceptVariants.map((variant, idx) => (
                  <motion.button
                    key={variant.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveVariant(idx)}
                    className={cn(
                      'flex-shrink-0 w-40 p-3 rounded-lg border text-left transition-colors',
                      activeVariant === idx
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="text-xs font-medium line-clamp-1">{variant.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {variant.description}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Content Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {currentVariant ? `Variant ${activeVariant + 1}: ${currentVariant.title}` : 'Detailed Content'}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(currentVariant?.content || concept.content || '')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy content</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg bg-muted/50 p-4">
              <div className="whitespace-pre-wrap">
                {currentVariant?.content || concept.content || 'No detailed content available.'}
              </div>
            </div>
          </div>

          {/* Related Concepts */}
          {relatedConcepts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Related Concepts</h3>
                <div className="grid grid-cols-2 gap-3">
                  {relatedConcepts.slice(0, 4).map(related => (
                    <div
                      key={related.id}
                      className="p-3 rounded-lg border hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <div className="text-sm font-medium line-clamp-1">{related.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {related.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(isLiked && 'text-rose-500 border-rose-500')}
                    onClick={() => onLike?.(concept)}
                  >
                    <Heart className={cn('h-4 w-4 mr-1', isLiked && 'fill-rose-500')} />
                    Like
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isLiked ? 'Unlike' : 'Like this concept'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => copyToClipboard(window.location.href)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={exportContent}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download as Markdown</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(concept)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive?.(concept)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(concept)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

interface ConceptDetailProps {
  concept: Concept | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (concept: Concept) => void;
  onDelete?: (concept: Concept) => void;
  onArchive?: (concept: Concept) => void;
  onLike?: (concept: Concept) => void;
  isLiked?: boolean;
  variants?: ConceptVariant[];
  relatedConcepts?: Concept[];
  viewMode?: 'dialog' | 'sheet';
}

export function ConceptDetail({
  concept,
  open,
  onClose,
  onEdit,
  onDelete,
  onArchive,
  onLike,
  isLiked = false,
  variants = [],
  relatedConcepts = [],
  viewMode = 'dialog',
}: ConceptDetailProps) {
  const [activeVariant, setActiveVariant] = React.useState(0);
  const [imageError, setImageError] = React.useState(false);

  // Reset state when concept changes
  React.useEffect(() => {
    setActiveVariant(0);
    setImageError(false);
  }, [concept?.id]);

  // Parse tags if stored as JSON string
  const tags = (() => {
    if (!concept?.tags) return [];
    if (Array.isArray(concept.tags)) return concept.tags;
    try {
      return JSON.parse(concept.tags as string);
    } catch {
      return [];
    }
  })();

  // Parse variants from concept
  const conceptVariants = (() => {
    if (variants.length > 0) return variants;
    if (!concept?.variants) return [];
    try {
      const parsed = Array.isArray(concept.variants) ? concept.variants : JSON.parse(concept.variants as string);
      return parsed.map((v: ConceptVariant, idx: number) => ({ ...v, id: v.id || `variant-${idx}` }));
    } catch {
      return [];
    }
  })();

  // Get current variant
  const currentVariant = conceptVariants[activeVariant] || null;

  // Handle null concept
  if (!concept) {
    return null;
  }

  if (viewMode === 'sheet') {
    return (
      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{concept.title}</SheetTitle>
          </SheetHeader>
          <DetailContent
            concept={concept}
            tags={tags}
            conceptVariants={conceptVariants}
            activeVariant={activeVariant}
            setActiveVariant={setActiveVariant}
            currentVariant={currentVariant}
            imageError={imageError}
            setImageError={setImageError}
            isLiked={isLiked}
            onClose={onClose}
            onLike={onLike}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            relatedConcepts={relatedConcepts}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{concept.title}</DialogTitle>
        </DialogHeader>
        <DetailContent
          concept={concept}
          tags={tags}
          conceptVariants={conceptVariants}
          activeVariant={activeVariant}
          setActiveVariant={setActiveVariant}
          currentVariant={currentVariant}
          imageError={imageError}
          setImageError={setImageError}
          isLiked={isLiked}
          onClose={onClose}
          onLike={onLike}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
          relatedConcepts={relatedConcepts}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ConceptDetail;

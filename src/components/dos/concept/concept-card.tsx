'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Heart,
  Sparkles,
  Image as ImageIcon,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface ConceptCardProps {
  concept: Concept;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onDuplicate?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  viewMode?: 'grid' | 'list';
}

export function ConceptCard({
  concept,
  onClick,
  onEdit,
  onDelete,
  onArchive,
  onDuplicate,
  onLike,
  isLiked = false,
  viewMode = 'grid',
}: ConceptCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Get category styling
  const categoryStyle = CATEGORY_COLORS[concept.category?.toLowerCase() || ''] || CATEGORY_COLORS.default;
  const statusStyle = STATUS_COLORS[concept.status];

  // Parse tags if they're stored as JSON string
  const tags = React.useMemo(() => {
    if (!concept.tags) return [];
    if (Array.isArray(concept.tags)) return concept.tags;
    try {
      return JSON.parse(concept.tags as string);
    } catch {
      return [];
    }
  }, [concept.tags]);

  // Format view count
  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.005 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        className="cursor-pointer"
      >
        <Card className={cn(
          'transition-all duration-200',
          isHovered && 'shadow-md border-primary/30'
        )}>
          <div className="flex items-center gap-4 p-4">
            {/* Image Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
              {concept.imageUrl && !imageError ? (
                <img
                  src={concept.imageUrl}
                  alt={concept.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{concept.title}</h3>
                {concept.isAIGenerated && (
                  <Badge variant="secondary" className="shrink-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                {concept.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={cn('text-xs', categoryStyle.bg, categoryStyle.text, categoryStyle.border)}>
                  {concept.category || 'Uncategorized'}
                </Badge>
                <Badge variant="outline" className={cn('text-xs', statusStyle.bg, statusStyle.text)}>
                  {concept.status}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{formatCount(concept.views)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className={cn('h-4 w-4', isLiked && 'fill-rose-500 text-rose-500')} />
                <span className="text-sm">{formatCount(concept.likes)}</span>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={cn(
        'h-full overflow-hidden transition-all duration-200',
        isHovered && 'shadow-lg border-primary/30'
      )}>
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {concept.imageUrl && !imageError ? (
            <img
              src={concept.imageUrl}
              alt={concept.title}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 opacity-50" />
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
            {concept.isAIGenerated && (
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white border-0 shadow-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
            <div className="ml-auto">
              <Badge variant="secondary" className={cn('shadow-sm', statusStyle.bg, statusStyle.text)}>
                {concept.status}
              </Badge>
            </div>
          </div>

          {/* Quick actions overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-3 gap-2"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike?.();
                    }}
                  >
                    <Heart className={cn('h-4 w-4', isLiked && 'fill-rose-500 text-rose-500')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Like</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open in new tab or expand
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </div>

        {/* Content */}
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-1">{concept.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {concept.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={cn('text-xs', categoryStyle.bg, categoryStyle.text, categoryStyle.border)}>
              {concept.category || 'Uncategorized'}
            </Badge>
            {tags.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{formatCount(concept.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className={cn('h-3.5 w-3.5', isLiked && 'fill-rose-500 text-rose-500')} />
                <span>{formatCount(concept.likes)}</span>
              </div>
            </div>
            <span className="text-xs">
              {new Date(concept.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ConceptCard;

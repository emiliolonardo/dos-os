'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  MoreHorizontal,
  ArrowRight,
  Users,
  Calendar,
  Clock,
  Pencil,
  Share2,
  Archive,
  Trash2,
  Copy,
  Star,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CompactABCoDETimeline, PhaseBadge } from './abcode-timeline';
import type { Project, ABCoDEPhase, User as UserType } from '@/types';

// ABCoDE Phase Configuration
const PHASE_CONFIG: Record<
  ABCoDEPhase,
  { label: string; color: string; bgColor: string; nextPhase?: ABCoDEPhase }
> = {
  ACQUAINTANCE: {
    label: 'Acquaintance',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    nextPhase: 'BUILD_UP',
  },
  BUILD_UP: {
    label: 'Build Up',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    nextPhase: 'CONTINUATION',
  },
  CONTINUATION: {
    label: 'Continuation',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    nextPhase: 'DETERIORATION',
  },
  DETERIORATION: {
    label: 'Deterioration',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    nextPhase: 'ENDING',
  },
  ENDING: {
    label: 'Ending',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PLANNING: { label: 'Planning', color: 'bg-slate-100 text-slate-700' },
  ACTIVE: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  ON_HOLD: { label: 'On Hold', color: 'bg-amber-100 text-amber-700' },
  COMPLETED: { label: 'Completed', color: 'bg-cyan-100 text-cyan-700' },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-700' },
};

interface ProjectHeaderProps {
  project: Project;
  teamMembers?: UserType[];
  onMoveToNextPhase?: () => void;
  onEditProject?: () => void;
  onShareProject?: () => void;
  onArchiveProject?: () => void;
  onDeleteProject?: () => void;
  onPhaseClick?: (phase: ABCoDEPhase) => void;
}

export function ProjectHeader({
  project,
  teamMembers = [],
  onMoveToNextPhase,
  onEditProject,
  onShareProject,
  onArchiveProject,
  onDeleteProject,
  onPhaseClick,
}: ProjectHeaderProps) {
  const [showPhaseDialog, setShowPhaseDialog] = React.useState(false);
  const [isStarred, setIsStarred] = React.useState(false);

  const phaseConfig = PHASE_CONFIG[project.currentPhase];
  const statusConfig = STATUS_CONFIG[project.status];
  const hasNextPhase = !!phaseConfig.nextPhase;

  // Calculate days remaining
  const daysRemaining = React.useMemo(() => {
    if (!project.endDate) return null;
    const end = new Date(project.endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [project.endDate]);

  const handleMoveToNextPhase = () => {
    setShowPhaseDialog(false);
    onMoveToNextPhase?.();
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col gap-4 p-4">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-4">
          {/* Project Info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shrink-0"
              style={{
                backgroundColor: project.color ? `${project.color}20` : '#f3f4f6',
              }}
            >
              {project.icon || '📁'}
            </div>

            {/* Title & Meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold truncate">{project.name}</h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIsStarred(!isStarred)}
                        className="shrink-0"
                      >
                        <Star
                          className={cn(
                            'h-5 w-5 transition-colors',
                            isStarred
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground hover:text-yellow-400'
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isStarred ? 'Unstar project' : 'Star project'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Status Badge */}
                <Badge variant="secondary" className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>

                {/* Current Phase Badge */}
                <PhaseBadge phase={project.currentPhase} showIcon />

                {/* Progress */}
                <Badge variant="outline" className="text-xs">
                  {project.progress}% complete
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Team Avatars */}
            <div className="hidden md:flex items-center -space-x-2 mr-2">
              {teamMembers.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {member.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {teamMembers.length > 4 && (
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs bg-muted">
                    +{teamMembers.length - 4}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Days Remaining */}
            {daysRemaining !== null && (
              <div
                className={cn(
                  'hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-md text-sm',
                  daysRemaining < 0
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : daysRemaining < 7
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Calendar className="h-4 w-4" />
                {daysRemaining < 0
                  ? `${Math.abs(daysRemaining)} days overdue`
                  : daysRemaining === 0
                  ? 'Due today'
                  : `${daysRemaining} days left`}
              </div>
            )}

            {/* Move to Next Phase Button */}
            {hasNextPhase && project.status === 'ACTIVE' && (
              <Dialog open={showPhaseDialog} onOpenChange={setShowPhaseDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="hidden sm:flex">
                    Move to Next Phase
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Move to Next Phase?</DialogTitle>
                    <DialogDescription>
                      You are about to move from{' '}
                      <span className={cn('font-medium', phaseConfig.color)}>
                        {phaseConfig.label}
                      </span>{' '}
                      to{' '}
                      <span
                        className={cn(
                          'font-medium',
                          PHASE_CONFIG[phaseConfig.nextPhase!].color
                        )}
                      >
                        {PHASE_CONFIG[phaseConfig.nextPhase!].label}
                      </span>
                      . This action will update the project&apos;s current phase.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowPhaseDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleMoveToNextPhase}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onEditProject}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShareProject}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onArchiveProject}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDeleteProject}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ABCoDE Timeline */}
        <div className="flex items-center justify-center py-2">
          <CompactABCoDETimeline
            currentPhase={project.currentPhase}
            onPhaseClick={onPhaseClick}
          />
        </div>

        {/* Quick Stats - Mobile Only */}
        <div className="flex sm:hidden items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {teamMembers.length} members
          </div>
          {daysRemaining !== null && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {daysRemaining} days left
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact Header for Sidebar
interface CompactProjectHeaderProps {
  project: Project;
  onPhaseClick?: (phase: ABCoDEPhase) => void;
}

export function CompactProjectHeader({
  project,
  onPhaseClick,
}: CompactProjectHeaderProps) {
  const phaseConfig = PHASE_CONFIG[project.currentPhase];

  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg shrink-0"
        style={{
          backgroundColor: project.color ? `${project.color}20` : '#f3f4f6',
        }}
      >
        {project.icon || '📁'}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{project.name}</h3>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn('text-xs', phaseConfig.bgColor, phaseConfig.color)}
          >
            {phaseConfig.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {project.progress}%
          </span>
        </div>
      </div>
      <CompactABCoDETimeline
        currentPhase={project.currentPhase}
        onPhaseClick={onPhaseClick}
      />
    </div>
  );
}

export default ProjectHeader;

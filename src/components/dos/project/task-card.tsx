'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
import type { Task, TaskStatus, TaskPriority, ABCoDEPhase, User as UserType } from '@/types';

// ABCoDE Phase Configuration
const PHASE_CONFIG: Record<
  ABCoDEPhase,
  { label: string; color: string; bgColor: string }
> = {
  ACQUAINTANCE: {
    label: 'Acquaintance',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  BUILD_UP: {
    label: 'Build Up',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  CONTINUATION: {
    label: 'Continuation',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  DETERIORATION: {
    label: 'Deterioration',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
  },
  ENDING: {
    label: 'Ending',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
  },
};

// Priority Configuration
const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  low: {
    label: 'Low',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    icon: Flag,
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Flag,
  },
  high: {
    label: 'High',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: Flag,
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: Flag,
  },
};

// Status Configuration
const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string }
> = {
  todo: {
    label: 'To Do',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  review: {
    label: 'Review',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  done: {
    label: 'Done',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
};

interface TaskCardProps {
  task: Task & { assignee?: UserType | null; subtasks?: Task[]; commentsCount?: number };
  viewMode?: 'compact' | 'expanded';
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskCard({
  task,
  viewMode = 'compact',
  onClick,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Get configurations
  const phaseConfig = task.abcodeTag ? PHASE_CONFIG[task.abcodeTag as ABCoDEPhase] : null;
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const statusConfig = STATUS_CONFIG[task.status];

  // Calculate subtask progress
  const subtaskProgress = React.useMemo(() => {
    if (!task.subtasks || task.subtasks.length === 0) return null;
    const completed = task.subtasks.filter((st) => st.status === 'done').length;
    return { completed, total: task.subtasks.length };
  }, [task.subtasks]);

  // Check if overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  // Format due date
  const formatDueDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (viewMode === 'compact') {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-md hover:border-primary/30',
          isOverdue && 'border-red-200 dark:border-red-900/50'
        )}
        onClick={onClick}
      >
        <CardContent className="p-3 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 pl-4">
              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            </div>
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
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {phaseConfig && (
              <Badge variant="secondary" className={cn('text-xs', phaseConfig.bgColor, phaseConfig.color)}>
                {phaseConfig.label}
              </Badge>
            )}
            <Badge variant="secondary" className={cn('text-xs', priorityConfig.bgColor, priorityConfig.color)}>
              {priorityConfig.label}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Subtask Progress */}
            {subtaskProgress && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {subtaskProgress.completed}/{subtaskProgress.total}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1 text-xs',
                  isOverdue ? 'text-red-500' : 'text-muted-foreground'
                )}
              >
                <Calendar className="h-3.5 w-3.5" />
                {formatDueDate(task.dueDate)}
              </div>
            )}

            {/* Assignee */}
            {task.assignee && (
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={task.assignee.image || undefined} />
                <AvatarFallback className="text-[10px]">
                  {task.assignee.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded View
  return (
    <Card className={cn('transition-all', isOverdue && 'border-red-200 dark:border-red-900/50')}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {task.status === 'done' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className={cn('text-lg', task.status === 'done' && 'line-through text-muted-foreground')}>
                {task.title}
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className={statusConfig.bgColor}>
                {statusConfig.label}
              </Badge>
              {phaseConfig && (
                <Badge variant="secondary" className={cn(phaseConfig.bgColor, phaseConfig.color)}>
                  {phaseConfig.label}
                </Badge>
              )}
              <Badge variant="secondary" className={cn(priorityConfig.bgColor, priorityConfig.color)}>
                <priorityConfig.icon className="h-3 w-3 mr-1" />
                {priorityConfig.label}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
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
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4">
          {/* Assignee */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Assignee:</span>
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{task.assignee.name}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Unassigned</span>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Due:</span>
            <span
              className={cn(
                'text-sm font-medium',
                isOverdue && 'text-red-500'
              )}
            >
              {task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}
            </span>
          </div>
        </div>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm font-medium w-full"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Subtasks ({subtaskProgress?.completed}/{subtaskProgress?.total})
            </button>

            {/* Progress Bar */}
            {subtaskProgress && (
              <Progress
                value={(subtaskProgress.completed / subtaskProgress.total) * 100}
                className="h-1.5"
              />
            )}

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 text-sm py-1"
                    >
                      {subtask.status === 'done' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={cn(
                          subtask.status === 'done' && 'line-through text-muted-foreground'
                        )}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 pt-2 border-t">
          {/* Comments */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{task.commentsCount || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Comments</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Created Date */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
            <Clock className="h-4 w-4" />
            Created {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini Task Card for lists
interface MiniTaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function MiniTaskCard({ task, onClick }: MiniTaskCardProps) {
  const phaseConfig = task.abcodeTag ? PHASE_CONFIG[task.abcodeTag as ABCoDEPhase] : null;

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      {task.status === 'done' ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
      <span
        className={cn(
          'text-sm flex-1',
          task.status === 'done' && 'line-through text-muted-foreground'
        )}
      >
        {task.title}
      </span>
      {phaseConfig && (
        <Badge variant="secondary" className={cn('text-xs', phaseConfig.bgColor)}>
          {phaseConfig.label.charAt(0)}
        </Badge>
      )}
    </div>
  );
}

export default TaskCard;

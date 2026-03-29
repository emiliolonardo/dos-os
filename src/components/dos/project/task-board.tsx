'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DraggableNode,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from './task-card';
import type { Task, TaskStatus, ABCoDEPhase, TaskPriority, User as UserType } from '@/types';

// ABCoDE Phase Colors (matching timeline)
const PHASE_COLORS: Record<ABCoDEPhase, string> = {
  ACQUAINTANCE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  BUILD_UP: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  CONTINUATION: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  DETERIORATION: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  ENDING: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

// Column Configuration
const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'Review', color: 'bg-amber-500' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500' },
];

// Mock Data
const MOCK_USERS: UserType[] = [
  { id: '1', email: 'alice@example.com', name: 'Alice Chen', image: null, displayName: null, bio: null, location: null, website: null, mode: 'design', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', email: 'bob@example.com', name: 'Bob Smith', image: null, displayName: null, bio: null, location: null, website: null, mode: 'innovation', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', email: 'carol@example.com', name: 'Carol White', image: null, displayName: null, bio: null, location: null, website: null, mode: 'education', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', email: 'dave@example.com', name: 'Dave Johnson', image: null, displayName: null, bio: null, location: null, website: null, mode: 'design', createdAt: new Date(), updatedAt: new Date() },
];

const MOCK_TASKS: (Task & { assignee?: UserType | null; subtasks?: Task[] })[] = [
  {
    id: 't1',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'Research competitor products',
    description: 'Analyze top 5 competitors and document their features',
    assigneeId: '1',
    status: 'done',
    priority: 'high',
    dueDate: new Date('2024-02-15'),
    completedAt: new Date('2024-02-14'),
    order: 0,
    abcodeTag: 'ACQUAINTANCE',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: MOCK_USERS[0],
    subtasks: [],
  },
  {
    id: 't2',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'Create wireframes for dashboard',
    description: 'Design low-fidelity wireframes for the main dashboard',
    assigneeId: '2',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-02-20'),
    completedAt: null,
    order: 0,
    abcodeTag: 'BUILD_UP',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: MOCK_USERS[1],
    subtasks: [
      { id: 't2-1', projectId: 'p1', phaseId: null, parentId: 't2', title: 'Header section', description: null, assigneeId: '2', status: 'done', priority: 'medium', dueDate: null, completedAt: new Date(), order: 0, abcodeTag: 'BUILD_UP', createdAt: new Date(), updatedAt: new Date() },
      { id: 't2-2', projectId: 'p1', phaseId: null, parentId: 't2', title: 'Sidebar navigation', description: null, assigneeId: '2', status: 'in_progress', priority: 'medium', dueDate: null, completedAt: null, order: 1, abcodeTag: 'BUILD_UP', createdAt: new Date(), updatedAt: new Date() },
      { id: 't2-3', projectId: 'p1', phaseId: null, parentId: 't2', title: 'Main content area', description: null, assigneeId: null, status: 'todo', priority: 'medium', dueDate: null, completedAt: null, order: 2, abcodeTag: 'BUILD_UP', createdAt: new Date(), updatedAt: new Date() },
    ],
  },
  {
    id: 't3',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'Set up development environment',
    description: 'Configure Node.js, database, and CI/CD pipeline',
    assigneeId: '3',
    status: 'done',
    priority: 'medium',
    dueDate: new Date('2024-02-10'),
    completedAt: new Date('2024-02-09'),
    order: 1,
    abcodeTag: 'BUILD_UP',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: MOCK_USERS[2],
    subtasks: [],
  },
  {
    id: 't4',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication with refresh tokens',
    assigneeId: '4',
    status: 'review',
    priority: 'high',
    dueDate: new Date('2024-02-25'),
    completedAt: null,
    order: 0,
    abcodeTag: 'BUILD_UP',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: MOCK_USERS[3],
    subtasks: [],
  },
  {
    id: 't5',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI spec',
    assigneeId: '1',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date('2024-03-01'),
    completedAt: null,
    order: 0,
    abcodeTag: 'CONTINUATION',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: MOCK_USERS[0],
    subtasks: [],
  },
  {
    id: 't6',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'Performance optimization',
    description: 'Optimize database queries and implement caching',
    assigneeId: null,
    status: 'todo',
    priority: 'low',
    dueDate: new Date('2024-03-15'),
    completedAt: null,
    order: 1,
    abcodeTag: 'CONTINUATION',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: null,
    subtasks: [],
  },
  {
    id: 't7',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'Bug: Fix login redirect issue',
    description: 'Users are not redirected correctly after OAuth login',
    assigneeId: '2',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: new Date('2024-02-18'),
    completedAt: null,
    order: 1,
    abcodeTag: 'DETERIORATION',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: MOCK_USERS[1],
    subtasks: [],
  },
  {
    id: 't8',
    projectId: 'p1',
    phaseId: null,
    parentId: null,
    title: 'User testing feedback review',
    description: 'Analyze feedback from beta testers and prioritize issues',
    assigneeId: '3',
    status: 'review',
    priority: 'high',
    dueDate: new Date('2024-02-28'),
    completedAt: null,
    order: 1,
    abcodeTag: 'DETERIORATION',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: MOCK_USERS[2],
    subtasks: [],
  },
];

interface TaskBoardProps {
  projectId?: string;
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: TaskStatus) => void;
}

export function TaskBoard({ projectId, onTaskClick, onAddTask }: TaskBoardProps) {
  const [tasks, setTasks] = React.useState(MOCK_TASKS);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    // Sort by order within each group
    Object.keys(grouped).forEach((status) => {
      grouped[status as TaskStatus].sort((a, b) => a.order - b.order);
    });
    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find if dropped over a column or another task
    const isOverColumn = COLUMNS.some((col) => col.id === overId);

    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId
            ? { ...task, status: newStatus }
            : task
        )
      );
    } else {
      // Dropped over another task - swap positions or change status
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask && activeTask) {
        setTasks((prev) =>
          prev.map((task) => {
            if (task.id === activeId) {
              return { ...task, status: overTask.status, order: overTask.order };
            }
            if (task.id === overId && task.status === overTask.status) {
              return { ...task, order: activeTask.order };
            }
            return task;
          })
        );
      }
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
            onTaskClick={onTaskClick}
            onAddTask={() => onAddTask?.(column.id)}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} viewMode="compact" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Column Component
interface TaskColumnProps {
  column: { id: TaskStatus; title: string; color: string };
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: () => void;
}

function TaskColumn({ column, tasks, onTaskClick, onAddTask }: TaskColumnProps) {
  const { setNodeRef } = useSortable({ id: column.id });

  return (
    <Card className="w-80 shrink-0 bg-muted/30">
      <CardHeader className="p-3 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', column.color)} />
            <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {tasks.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <SortableContext
          id={column.id}
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ScrollArea className="h-[calc(100vh-320px)] pr-2">
            <div ref={setNodeRef} className="space-y-2">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

// Sortable Task Card Wrapper
interface SortableTaskCardProps {
  task: Task;
  onClick?: () => void;
}

function SortableTaskCard({ task, onClick }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative group">
        <TaskCard
          task={task}
          viewMode="compact"
          onClick={onClick}
        />
        <button
          {...attributes}
          {...listeners}
          className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}

export default TaskBoard;

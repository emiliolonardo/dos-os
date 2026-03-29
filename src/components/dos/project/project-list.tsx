'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  Calendar,
  Users,
  MoreHorizontal,
  Folder,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import type { Project, ABCoDEPhase, ProjectStatus } from '@/types';

// ABCoDE Phase Configuration
const ABCODE_PHASE_CONFIG: Record<
  ABCoDEPhase,
  { label: string; color: string; bgColor: string; description: string }
> = {
  ACQUAINTANCE: {
    label: 'Acquaintance',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    description: 'Discovery, Research, Understanding',
  },
  BUILD_UP: {
    label: 'Build Up',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    description: 'Development, Creation, Growth',
  },
  CONTINUATION: {
    label: 'Continuation',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    description: 'Maintenance, Evolution, Optimization',
  },
  DETERIORATION: {
    label: 'Deterioration',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    description: 'Analysis, Problems, Challenges',
  },
  ENDING: {
    label: 'Ending',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
    description: 'Conclusion, Documentation, Archive',
  },
};

const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  PLANNING: { label: 'Planning', color: 'bg-slate-500' },
  ACTIVE: { label: 'Active', color: 'bg-emerald-500' },
  ON_HOLD: { label: 'On Hold', color: 'bg-amber-500' },
  COMPLETED: { label: 'Completed', color: 'bg-cyan-500' },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-500' },
};

// Mock data for demonstration
const MOCK_PROJECTS: (Project & { teamMembers: { id: string; name: string; image: string | null }[] })[] = [
  {
    id: '1',
    workspaceId: 'ws1',
    name: 'Website Redesign',
    slug: 'website-redesign',
    description: 'Complete overhaul of the company website with modern design',
    icon: '🌐',
    color: '#3b82f6',
    status: 'ACTIVE',
    progress: 65,
    currentPhase: 'BUILD_UP',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamMembers: [
      { id: '1', name: 'Alice Chen', image: null },
      { id: '2', name: 'Bob Smith', image: null },
      { id: '3', name: 'Carol White', image: null },
    ],
  },
  {
    id: '2',
    workspaceId: 'ws1',
    name: 'Mobile App Development',
    slug: 'mobile-app',
    description: 'Native iOS and Android application for customers',
    icon: '📱',
    color: '#10b981',
    status: 'ACTIVE',
    progress: 30,
    currentPhase: 'ACQUAINTANCE',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-09-30'),
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamMembers: [
      { id: '4', name: 'Dave Johnson', image: null },
      { id: '5', name: 'Eve Brown', image: null },
    ],
  },
  {
    id: '3',
    workspaceId: 'ws1',
    name: 'Data Migration',
    slug: 'data-migration',
    description: 'Migrate legacy data to new cloud infrastructure',
    icon: '🔄',
    color: '#f59e0b',
    status: 'ON_HOLD',
    progress: 45,
    currentPhase: 'DETERIORATION',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-04-30'),
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamMembers: [
      { id: '6', name: 'Frank Miller', image: null },
    ],
  },
  {
    id: '4',
    workspaceId: 'ws1',
    name: 'API Integration',
    slug: 'api-integration',
    description: 'Third-party API integrations for enhanced functionality',
    icon: '🔗',
    color: '#8b5cf6',
    status: 'COMPLETED',
    progress: 100,
    currentPhase: 'ENDING',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-01-31'),
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamMembers: [
      { id: '7', name: 'Grace Lee', image: null },
      { id: '8', name: 'Henry Wilson', image: null },
      { id: '9', name: 'Ivy Chen', image: null },
      { id: '10', name: 'Jack Brown', image: null },
    ],
  },
  {
    id: '5',
    workspaceId: 'ws1',
    name: 'Security Audit',
    slug: 'security-audit',
    description: 'Comprehensive security review and vulnerability assessment',
    icon: '🔒',
    color: '#ef4444',
    status: 'PLANNING',
    progress: 0,
    currentPhase: 'ACQUAINTANCE',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-05-31'),
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamMembers: [
      { id: '11', name: 'Karen Davis', image: null },
      { id: '12', name: 'Leo Martinez', image: null },
    ],
  },
];

interface ProjectListProps {
  onViewProject?: (project: Project) => void;
  onCreateProject?: () => void;
}

export function ProjectList({ onViewProject, onCreateProject }: ProjectListProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [phaseFilter, setPhaseFilter] = React.useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>('all');

  // Filter projects based on search and filters
  const filteredProjects = React.useMemo(() => {
    return MOCK_PROJECTS.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPhase = phaseFilter === 'all' || project.currentPhase === phaseFilter;

      let matchesAssignee = true;
      if (assigneeFilter !== 'all') {
        matchesAssignee = project.teamMembers.some((m) => m.id === assigneeFilter);
      }

      return matchesSearch && matchesStatus && matchesPhase && matchesAssignee;
    });
  }, [searchQuery, statusFilter, phaseFilter, assigneeFilter]);

  // Get all unique team members for filter
  const allTeamMembers = React.useMemo(() => {
    const members = new Map<string, { id: string; name: string }>();
    MOCK_PROJECTS.forEach((project) => {
      project.teamMembers.forEach((member) => {
        members.set(member.id, member);
      });
    });
    return Array.from(members.values());
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Badge variant="secondary">{filteredProjects.length}</Badge>
        </div>
        <Button onClick={onCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(PROJECT_STATUS_CONFIG).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <div className={cn('h-2 w-2 rounded-full', config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="ABCoDE Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {Object.entries(ABCODE_PHASE_CONFIG).map(([phase, config]) => (
                    <SelectItem key={phase} value={phase}>
                      <span className={config.color}>{config.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {allTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center rounded-md border">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="rounded-r-none"
                        onClick={() => setViewMode('grid')}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Grid View</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="rounded-l-none"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>List View</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <ProjectGridCard
                key={project.id}
                project={project}
                index={index}
                onView={() => onViewProject?.(project)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-2"
          >
            {filteredProjects.map((project, index) => (
              <ProjectListCard
                key={project.id}
                project={project}
                index={index}
                onView={() => onViewProject?.(project)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No projects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}

// Grid Card Component
interface ProjectCardProps {
  project: (Project & { teamMembers: { id: string; name: string; image: string | null }[] });
  index: number;
  onView: () => void;
}

function ProjectGridCard({ project, index, onView }: ProjectCardProps) {
  const phaseConfig = ABCODE_PHASE_CONFIG[project.currentPhase];
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
        onClick={onView}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                style={{ backgroundColor: project.color ? `${project.color}20` : '#f3f4f6' }}
              >
                {project.icon || '📁'}
              </div>
              <div>
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={cn('mt-1', phaseConfig.bgColor, phaseConfig.color)}
                >
                  {phaseConfig.label}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || 'No description provided'}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            {/* Team Avatars */}
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 4).map((member, i) => (
                <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={member.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.teamMembers.length > 4 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{project.teamMembers.length - 4}
                </div>
              )}
            </div>

            {/* Due Date */}
            {project.endDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(project.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// List Card Component
function ProjectListCard({ project, index, onView }: ProjectCardProps) {
  const phaseConfig = ABCODE_PHASE_CONFIG[project.currentPhase];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card
        className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
        onClick={onView}
      >
        <CardContent className="flex items-center gap-4 p-4">
          {/* Icon */}
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-xl shrink-0"
            style={{ backgroundColor: project.color ? `${project.color}20` : '#f3f4f6' }}
          >
            {project.icon || '📁'}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                {project.name}
              </h3>
              <Badge
                variant="secondary"
                className={cn('shrink-0', phaseConfig.bgColor, phaseConfig.color)}
              >
                {phaseConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {project.description || 'No description provided'}
            </p>
          </div>

          {/* Progress */}
          <div className="hidden sm:flex items-center gap-3 w-40 shrink-0">
            <Progress value={project.progress} className="h-2" />
            <span className="text-sm font-medium w-10">{project.progress}%</span>
          </div>

          {/* Team */}
          <div className="hidden md:flex -space-x-2 shrink-0">
            {project.teamMembers.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.image || undefined} />
                <AvatarFallback className="text-xs">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.teamMembers.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{project.teamMembers.length - 3}
              </div>
            )}
          </div>

          {/* Due Date */}
          {project.endDate && (
            <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground w-24 shrink-0">
              <Calendar className="h-4 w-4" />
              {new Date(project.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
          )}

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Project</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ProjectList;

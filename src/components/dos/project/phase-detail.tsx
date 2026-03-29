'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Lightbulb,
  Hammer,
  RefreshCw,
  AlertTriangle,
  Flag,
  Target,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  FileText,
  Calendar,
  Users,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MiniTaskCard } from './task-card';
import type { ABCoDEPhase, ProjectPhase, Task } from '@/types';

// ABCoDE Phase Configuration
const PHASE_CONFIG: Record<
  ABCoDEPhase,
  {
    label: string;
    description: string;
    fullDescription: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ElementType;
    objectives: string[];
    outputs: string[];
    aiSuggestions: string[];
  }
> = {
  ACQUAINTANCE: {
    label: 'Acquaintance',
    description: 'Discovery, Research, Understanding',
    fullDescription:
      'The Acquaintance phase focuses on building foundational knowledge and understanding. This is where you explore the problem space, gather requirements, and establish the groundwork for your project.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    icon: Search,
    objectives: [
      'Understand project scope and requirements',
      'Research existing solutions and best practices',
      'Identify stakeholders and their needs',
      'Gather and analyze initial data',
      'Define success criteria and KPIs',
    ],
    outputs: [
      'Requirements Document',
      'Stakeholder Analysis',
      'Research Findings',
      'Project Charter',
    ],
    aiSuggestions: [
      'Generate a stakeholder mapping template',
      'Create interview questions for user research',
      'Suggest similar projects for reference',
      'Draft a preliminary project timeline',
    ],
  },
  BUILD_UP: {
    label: 'Build Up',
    description: 'Development, Creation, Growth',
    fullDescription:
      'The Build Up phase is where active development happens. You design solutions, build features, and create the core product or service. This phase is characterized by rapid iteration and creative problem-solving.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-cyan-500',
    icon: Hammer,
    objectives: [
      'Design and develop core features',
      'Build MVP or incremental releases',
      'Implement feedback loops',
      'Scale infrastructure and processes',
      'Document technical decisions',
    ],
    outputs: [
      'MVP Release',
      'Technical Documentation',
      'Design System',
      'Test Suite',
    ],
    aiSuggestions: [
      'Generate code scaffolding for new features',
      'Review and suggest architecture improvements',
      'Create automated test cases',
      'Optimize performance bottlenecks',
    ],
  },
  CONTINUATION: {
    label: 'Continuation',
    description: 'Maintenance, Evolution, Optimization',
    fullDescription:
      'The Continuation phase focuses on sustaining and improving what has been built. You monitor performance, fix bugs, add enhancements, and ensure the product continues to deliver value over time.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500',
    icon: RefreshCw,
    objectives: [
      'Maintain system stability',
      'Optimize performance and efficiency',
      'Evolve features based on usage',
      'Implement continuous improvements',
      'Manage technical debt',
    ],
    outputs: [
      'Performance Reports',
      'Feature Enhancements',
      'Bug Fix Releases',
      'User Feedback Analysis',
    ],
    aiSuggestions: [
      'Analyze usage patterns and suggest improvements',
      'Identify potential performance optimizations',
      'Generate release notes from commits',
      'Propose A/B testing experiments',
    ],
  },
  DETERIORATION: {
    label: 'Deterioration',
    description: 'Analysis, Problems, Challenges',
    fullDescription:
      'The Deterioration phase is for honest assessment of challenges, issues, and problems. This is where you identify what\'s not working, analyze root causes, and plan corrective actions. It\'s a crucial phase for learning and improvement.',
    color: 'text-rose-600',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-500',
    icon: AlertTriangle,
    objectives: [
      'Identify issues and bottlenecks',
      'Analyze root causes of problems',
      'Document lessons learned',
      'Plan mitigation strategies',
      'Assess risks and dependencies',
    ],
    outputs: [
      'Issue Analysis Report',
      'Root Cause Analysis',
      'Lessons Learned Document',
      'Risk Mitigation Plan',
    ],
    aiSuggestions: [
      'Analyze patterns in reported issues',
      'Generate incident post-mortem template',
      'Suggest risk mitigation strategies',
      'Create action items from retrospectives',
    ],
  },
  ENDING: {
    label: 'Ending',
    description: 'Conclusion, Documentation, Archive',
    fullDescription:
      'The Ending phase is for proper closure of the project or phase. You document outcomes, archive artifacts, conduct post-mortems, and ensure knowledge is preserved for future reference.',
    color: 'text-slate-600',
    bgColor: 'bg-slate-500',
    borderColor: 'border-slate-500',
    icon: Flag,
    objectives: [
      'Finalize and deliver all outputs',
      'Document project outcomes',
      'Archive project artifacts',
      'Conduct post-mortem analysis',
      'Transition to maintenance or new projects',
    ],
    outputs: [
      'Final Deliverables',
      'Project Documentation',
      'Post-Mortem Report',
      'Knowledge Base Articles',
    ],
    aiSuggestions: [
      'Generate comprehensive project summary',
      'Create handoff documentation',
      'Archive and organize project files',
      'Draft team recognition notes',
    ],
  },
};

interface PhaseDetailProps {
  phase: ABCoDEPhase;
  phaseData?: ProjectPhase | null;
  tasks?: Task[];
  onTaskClick?: (task: Task) => void;
  onGenerateAI?: (suggestion: string) => void;
  onMoveToNextPhase?: () => void;
  isCurrentPhase?: boolean;
}

export function PhaseDetail({
  phase,
  phaseData,
  tasks = [],
  onTaskClick,
  onGenerateAI,
  onMoveToNextPhase,
  isCurrentPhase = false,
}: PhaseDetailProps) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;

  // Calculate progress
  const progress = phaseData?.progress ?? 0;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={cn('overflow-hidden', `border-t-4`, config.borderColor)}>
          <CardHeader className={cn('pb-4', config.bgColor, 'bg-opacity-10')}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', config.bgColor, 'text-white')}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className={cn('text-xl', config.color)}>
                    {config.label}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {config.description}
                  </CardDescription>
                </div>
              </div>
              {isCurrentPhase && (
                <Badge className={cn(config.bgColor, 'text-white')}>
                  Current Phase
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Phase Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-xs text-muted-foreground">Tasks</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
                <p className="text-xs text-muted-foreground">Done Rate</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {config.fullDescription}
            </p>

            {/* Move to Next Phase */}
            {isCurrentPhase && progress >= 80 && (
              <Button
                variant="outline"
                className={cn('w-full', config.borderColor, config.color)}
                onClick={onMoveToNextPhase}
              >
                Move to Next Phase
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Objectives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className={cn('h-5 w-5', config.color)} />
              <CardTitle className="text-base">Objectives</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {config.objectives.map((objective, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="mt-0.5">
                    <CheckCircle2 className={cn('h-4 w-4', progress > index * 20 ? 'text-emerald-500' : 'text-muted-foreground/30')} />
                  </div>
                  <span className={progress > index * 20 ? '' : 'text-muted-foreground'}>
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tasks in this Phase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className={cn('h-5 w-5', config.color)} />
                <CardTitle className="text-base">Tasks</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {tasks.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {tasks.length > 0 ? (
              <ScrollArea className="h-64">
                <div className="p-4 pt-0 space-y-1">
                  {tasks.map((task) => (
                    <MiniTaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick?.(task)}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks in this phase yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Phase Output/Insights */}
      {phaseData?.output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className={cn('h-5 w-5', config.color)} />
                <CardTitle className="text-base">Phase Output</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {phaseData.output}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {phaseData?.insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">AI Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {phaseData.insights}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Expected Outputs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className={cn('h-5 w-5', config.color)} />
              <CardTitle className="text-base">Expected Outputs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.outputs.map((output, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {output}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">AI Suggestions</CardTitle>
            </div>
            <CardDescription>
              Click to generate with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {config.aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onGenerateAI?.(suggestion)}
                  className="flex items-center justify-between w-full p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left group"
                >
                  <span className="text-sm">{suggestion}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PhaseDetail;

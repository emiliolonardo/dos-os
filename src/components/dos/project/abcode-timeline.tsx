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
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { ABCoDEPhase, ProjectPhase } from '@/types';

// ABCoDE Phase Configuration with Icons
const ABCODE_CONFIG: Record<
  ABCoDEPhase,
  {
    label: string;
    shortLabel: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ElementType;
    objectives: string[];
  }
> = {
  ACQUAINTANCE: {
    label: 'Acquaintance',
    shortLabel: 'A',
    description: 'Discovery, Research, Understanding',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    icon: Search,
    objectives: [
      'Understand project scope and requirements',
      'Research existing solutions and best practices',
      'Identify stakeholders and their needs',
      'Gather and analyze initial data',
    ],
  },
  BUILD_UP: {
    label: 'Build Up',
    shortLabel: 'B',
    description: 'Development, Creation, Growth',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-cyan-500',
    icon: Hammer,
    objectives: [
      'Design and develop core features',
      'Build MVP or incremental releases',
      'Implement feedback loops',
      'Scale infrastructure and processes',
    ],
  },
  CONTINUATION: {
    label: 'Continuation',
    shortLabel: 'C',
    description: 'Maintenance, Evolution, Optimization',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500',
    icon: RefreshCw,
    objectives: [
      'Maintain system stability',
      'Optimize performance and efficiency',
      'Evolve features based on usage',
      'Implement continuous improvements',
    ],
  },
  DETERIORATION: {
    label: 'Deterioration',
    shortLabel: 'D',
    description: 'Analysis, Problems, Challenges',
    color: 'text-rose-600',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-500',
    icon: AlertTriangle,
    objectives: [
      'Identify issues and bottlenecks',
      'Analyze root causes of problems',
      'Document lessons learned',
      'Plan mitigation strategies',
    ],
  },
  ENDING: {
    label: 'Ending',
    shortLabel: 'E',
    description: 'Conclusion, Documentation, Archive',
    color: 'text-slate-600',
    bgColor: 'bg-slate-500',
    borderColor: 'border-slate-500',
    icon: Flag,
    objectives: [
      'Finalize and deliver all outputs',
      'Document project outcomes',
      'Archive project artifacts',
      'Conduct post-mortem analysis',
    ],
  },
};

const PHASE_ORDER: ABCoDEPhase[] = [
  'ACQUAINTANCE',
  'BUILD_UP',
  'CONTINUATION',
  'DETERIORATION',
  'ENDING',
];

interface ABCoDETimelineProps {
  currentPhase: ABCoDEPhase;
  phases?: ProjectPhase[];
  onPhaseClick?: (phase: ABCoDEPhase) => void;
  selectedPhase?: ABCoDEPhase | null;
}

export function ABCoDETimeline({
  currentPhase,
  phases = [],
  onPhaseClick,
  selectedPhase,
}: ABCoDETimelineProps) {
  const currentPhaseIndex = PHASE_ORDER.indexOf(currentPhase);

  // Get progress for a phase
  const getPhaseProgress = (phase: ABCoDEPhase): number => {
    const phaseData = phases.find((p) => p.phase === phase);
    return phaseData?.progress ?? 0;
  };

  // Get status for a phase
  const getPhaseStatus = (phase: ABCoDEPhase, index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentPhaseIndex) return 'completed';
    if (index === currentPhaseIndex) return 'current';
    return 'upcoming';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">ABCoDE Timeline</CardTitle>
          <Badge variant="outline" className="text-xs">
            {ABCODE_CONFIG[currentPhase].label} Phase
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500"
              initial={{ width: '0%' }}
              animate={{
                width: `${(currentPhaseIndex / (PHASE_ORDER.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>

          {/* Phase Nodes */}
          <div className="relative flex justify-between">
            {PHASE_ORDER.map((phase, index) => {
              const config = ABCODE_CONFIG[phase];
              const status = getPhaseStatus(phase, index);
              const progress = getPhaseProgress(phase);
              const isSelected = selectedPhase === phase;
              const Icon = config.icon;

              return (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Phase Circle */}
                  <button
                    onClick={() => onPhaseClick?.(phase)}
                    className={cn(
                      'relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all',
                      status === 'completed' && [
                        config.borderColor,
                        config.bgColor,
                        'text-white',
                      ],
                      status === 'current' && [
                        config.borderColor,
                        'bg-background',
                        'ring-2 ring-offset-2',
                        config.color.replace('text-', 'ring-'),
                      ],
                      status === 'upcoming' && [
                        'border-muted-foreground/30',
                        'bg-background',
                        'text-muted-foreground',
                      ],
                      isSelected && 'ring-2 ring-primary ring-offset-2',
                      'hover:scale-110 cursor-pointer'
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : status === 'current' ? (
                      <Icon className={cn('h-6 w-6', config.color)} />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}

                    {/* Pulse animation for current */}
                    {status === 'current' && (
                      <span
                        className={cn(
                          'absolute inset-0 rounded-full animate-ping opacity-20',
                          config.bgColor
                        )}
                      />
                    )}
                  </button>

                  {/* Phase Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        status === 'current' ? config.color : 'text-muted-foreground'
                      )}
                    >
                      {config.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {config.description.split(',')[0]}
                    </p>
                  </div>

                  {/* Progress for current phase */}
                  {status === 'current' && progress > 0 && (
                    <div className="mt-2 w-20">
                      <Progress value={progress} className="h-1" />
                      <p className="text-xs text-center mt-1 text-muted-foreground">
                        {progress}%
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Phase Details Panel */}
        {selectedPhase && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t"
          >
            <PhaseDetails
              phase={selectedPhase}
              progress={getPhaseProgress(selectedPhase)}
              status={getPhaseStatus(selectedPhase, PHASE_ORDER.indexOf(selectedPhase))}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Phase Details Component
interface PhaseDetailsProps {
  phase: ABCoDEPhase;
  progress: number;
  status: 'completed' | 'current' | 'upcoming';
}

function PhaseDetails({ phase, progress, status }: PhaseDetailsProps) {
  const config = ABCODE_CONFIG[phase];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', config.bgColor, 'bg-opacity-10')}>
          <Icon className={cn('h-5 w-5', config.color)} />
        </div>
        <div>
          <h4 className={cn('font-semibold', config.color)}>{config.label}</h4>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        {status === 'current' && (
          <Badge className={cn('ml-auto', config.bgColor)}>Active</Badge>
        )}
        {status === 'completed' && (
          <Badge variant="outline" className="ml-auto border-emerald-500 text-emerald-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Objectives */}
      <div>
        <h5 className="text-sm font-medium mb-2">Objectives</h5>
        <ul className="space-y-1.5">
          {config.objectives.map((objective, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              {status === 'completed' || (status === 'current' && index < 2) ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 mt-0.5 text-muted-foreground/50 shrink-0" />
              )}
              {objective}
            </li>
          ))}
        </ul>
      </div>

      {status === 'current' && (
        <Button variant="outline" size="sm" className="w-full">
          <Lightbulb className="h-4 w-4 mr-2" />
          Get AI Suggestions for This Phase
        </Button>
      )}
    </div>
  );
}

// Compact Timeline for Sidebar/Header
interface CompactTimelineProps {
  currentPhase: ABCoDEPhase;
  onPhaseClick?: (phase: ABCoDEPhase) => void;
}

export function CompactABCoDETimeline({ currentPhase, onPhaseClick }: CompactTimelineProps) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-0.5">
      {PHASE_ORDER.map((phase, index) => {
        const config = ABCODE_CONFIG[phase];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <button
            key={phase}
            onClick={() => onPhaseClick?.(phase)}
            className={cn(
              'relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all',
              isCompleted && [config.bgColor, 'text-white'],
              isCurrent && [
                'ring-2 ring-offset-1',
                config.color.replace('text-', 'ring-'),
                config.bgColor,
                'text-white',
              ],
              !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
              'hover:scale-110 cursor-pointer'
            )}
            title={`${config.label}: ${config.description}`}
          >
            {config.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

// Phase Badge Component
interface PhaseBadgeProps {
  phase: ABCoDEPhase;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function PhaseBadge({ phase, size = 'md', showIcon = false }: PhaseBadgeProps) {
  const config = ABCODE_CONFIG[phase];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        sizeClasses[size],
        config.bgColor.replace('bg-', 'bg-'),
        config.color,
        'bg-opacity-20'
      )}
    >
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}

export default ABCoDETimeline;

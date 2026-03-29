'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  User,
  Folder,
  Lightbulb,
  CheckSquare,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import type { MeshNodeType, MeshEdge } from '@/types';

// Node type configuration
const NODE_TYPES: { type: MeshNodeType; icon: React.ReactNode; label: string; color: string }[] = [
  { type: 'USER', icon: <User className="h-4 w-4" />, label: 'Users', color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30' },
  { type: 'PROJECT', icon: <Folder className="h-4 w-4" />, label: 'Projects', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { type: 'CONCEPT', icon: <Lightbulb className="h-4 w-4" />, label: 'Concepts', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  { type: 'TASK', icon: <CheckSquare className="h-4 w-4" />, label: 'Tasks', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
  { type: 'KNOWLEDGE', icon: <FileText className="h-4 w-4" />, label: 'Knowledge', color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30' },
];

// Relationship types
const RELATIONSHIP_TYPES = [
  { type: 'created_by', label: 'Created by', color: 'bg-violet-500' },
  { type: 'works_on', label: 'Works on', color: 'bg-blue-500' },
  { type: 'relates_to', label: 'Relates to', color: 'bg-amber-500' },
  { type: 'depends_on', label: 'Depends on', color: 'bg-red-500' },
  { type: 'references', label: 'References', color: 'bg-cyan-500' },
  { type: 'assigned_to', label: 'Assigned to', color: 'bg-emerald-500' },
];

export interface MeshFiltersState {
  searchQuery: string;
  nodeTypes: Set<MeshNodeType>;
  relationshipTypes: Set<string>;
  dateRange: { from?: Date; to?: Date };
  showAISuggested: boolean;
  weightRange: [number, number];
}

interface MeshFiltersProps {
  filters: MeshFiltersState;
  onFiltersChange: (filters: MeshFiltersState) => void;
  onReset?: () => void;
  compact?: boolean;
}

export function MeshFilters({
  filters,
  onFiltersChange,
  onReset,
  compact = false,
}: MeshFiltersProps) {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(['nodeTypes', 'relationships'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const updateFilter = <K extends keyof MeshFiltersState>(key: K, value: MeshFiltersState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleNodeType = (type: MeshNodeType) => {
    const newTypes = new Set(filters.nodeTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    updateFilter('nodeTypes', newTypes);
  };

  const toggleRelationshipType = (type: string) => {
    const newTypes = new Set(filters.relationshipTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    updateFilter('relationshipTypes', newTypes);
  };

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.nodeTypes.size < NODE_TYPES.length) count++;
    if (filters.relationshipTypes.size < RELATIONSHIP_TYPES.length) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (!filters.showAISuggested) count++;
    if (filters.weightRange[0] > 0 || filters.weightRange[1] < 10) count++;
    return count;
  }, [filters]);

  // Compact mode - popover based
  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReset}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                placeholder="Search nodes..."
                className="pl-9"
              />
            </div>

            {/* Node Types */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Node Types</Label>
              <div className="flex flex-wrap gap-1">
                {NODE_TYPES.map(({ type, icon, label, color }) => (
                  <button
                    key={type}
                    onClick={() => toggleNodeType(type)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors',
                      filters.nodeTypes.has(type) ? color : 'bg-muted text-muted-foreground opacity-50'
                    )}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship Types */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Relationships</Label>
              <div className="flex flex-wrap gap-1">
                {RELATIONSHIP_TYPES.map(({ type, label, color }) => (
                  <button
                    key={type}
                    onClick={() => toggleRelationshipType(type)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors',
                      filters.relationshipTypes.has(type)
                        ? `${color} text-white`
                        : 'bg-muted text-muted-foreground opacity-50'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggested */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show AI Suggestions</Label>
              <Switch
                checked={filters.showAISuggested}
                onCheckedChange={(checked) => updateFilter('showAISuggested', checked)}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Full panel mode
  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search nodes..."
            className="pl-9"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Node Types */}
        <Collapsible open={expandedSections.has('nodeTypes')} onOpenChange={() => toggleSection('nodeTypes')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-sm font-medium">Node Types</Label>
            {expandedSections.has('nodeTypes') ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 pt-2">
              {NODE_TYPES.map(({ type, icon, label, color }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('p-1 rounded', color.split(' ')[1])}>
                      <span className={color.split(' ')[0]}>{icon}</span>
                    </div>
                    <span className="text-sm">{label}</span>
                  </div>
                  <Switch
                    checked={filters.nodeTypes.has(type)}
                    onCheckedChange={() => toggleNodeType(type)}
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Relationship Types */}
        <Collapsible open={expandedSections.has('relationships')} onOpenChange={() => toggleSection('relationships')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-sm font-medium">Relationship Types</Label>
            {expandedSections.has('relationships') ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 pt-2">
              {RELATIONSHIP_TYPES.map(({ type, label, color }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', color)} />
                    <span className="text-sm">{label}</span>
                  </div>
                  <Switch
                    checked={filters.relationshipTypes.has(type)}
                    onCheckedChange={() => toggleRelationshipType(type)}
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Date Range */}
        <Collapsible open={expandedSections.has('dateRange')} onOpenChange={() => toggleSection('dateRange')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-sm font-medium">Date Range</Label>
            {expandedSections.has('dateRange') ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 justify-start text-left">
                      <Calendar className="h-4 w-4 mr-2" />
                      {filters.dateRange.from ? (
                        filters.dateRange.from.toLocaleDateString()
                      ) : (
                        'From'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) =>
                        updateFilter('dateRange', { ...filters.dateRange, from: date })
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 justify-start text-left">
                      <Calendar className="h-4 w-4 mr-2" />
                      {filters.dateRange.to ? (
                        filters.dateRange.to.toLocaleDateString()
                      ) : (
                        'To'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) =>
                        updateFilter('dateRange', { ...filters.dateRange, to: date })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => updateFilter('dateRange', {})}
                >
                  Clear date range
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Weight Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Node Weight</Label>
            <span className="text-xs text-muted-foreground">
              {filters.weightRange[0]} - {filters.weightRange[1]}
            </span>
          </div>
          <Slider
            value={filters.weightRange}
            onValueChange={(value) => updateFilter('weightRange', value as [number, number])}
            min={0}
            max={10}
            step={1}
          />
        </div>

        <Separator />

        {/* AI Suggested */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">AI Suggestions</Label>
            <p className="text-xs text-muted-foreground">Show AI-suggested connections</p>
          </div>
          <Switch
            checked={filters.showAISuggested}
            onCheckedChange={(checked) => updateFilter('showAISuggested', checked)}
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="p-4 border-t bg-muted/30">
          <div className="flex flex-wrap gap-1">
            {filters.searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Search: {filters.searchQuery}
                <button
                  onClick={() => updateFilter('searchQuery', '')}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.nodeTypes.size < NODE_TYPES.length && (
              <Badge variant="secondary" className="text-xs">
                {filters.nodeTypes.size}/{NODE_TYPES.length} types
              </Badge>
            )}
            {!filters.showAISuggested && (
              <Badge variant="secondary" className="text-xs">
                No AI
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Default filters
export const DEFAULT_FILTERS: MeshFiltersState = {
  searchQuery: '',
  nodeTypes: new Set(NODE_TYPES.map(t => t.type)),
  relationshipTypes: new Set(RELATIONSHIP_TYPES.map(t => t.type)),
  dateRange: {},
  showAISuggested: true,
  weightRange: [0, 10],
};

export default MeshFilters;

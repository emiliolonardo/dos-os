'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  User,
  Folder,
  Lightbulb,
  CheckSquare,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { MeshNode, MeshEdge, MeshNodeType } from '@/types';

// Node type configuration
const NODE_CONFIG: Record<MeshNodeType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  USER: {
    icon: <User className="h-5 w-5" />,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    label: 'User',
  },
  PROJECT: {
    icon: <Folder className="h-5 w-5" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Project',
  },
  CONCEPT: {
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Concept',
  },
  TASK: {
    icon: <CheckSquare className="h-5 w-5" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: 'Task',
  },
  KNOWLEDGE: {
    icon: <FileText className="h-5 w-5" />,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    label: 'Knowledge',
  },
};

// Edge type labels
const EDGE_LABELS: Record<string, string> = {
  created_by: 'Created by',
  works_on: 'Works on',
  relates_to: 'Relates to',
  depends_on: 'Depends on',
  references: 'References',
  assigned_to: 'Assigned to',
};

const EDGE_COLORS: Record<string, string> = {
  created_by: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  works_on: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  relates_to: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  depends_on: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  references: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  assigned_to: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

interface MeshNodeDetailProps {
  node: MeshNode | null;
  edges?: MeshEdge[];
  allNodes?: MeshNode[];
  onClose?: () => void;
  onNavigate?: (nodeId: string) => void;
  aiSuggestions?: { nodeId: string; reason: string; confidence: number }[];
}

export function MeshNodeDetail({
  node,
  edges = [],
  allNodes = [],
  onClose,
  onNavigate,
  aiSuggestions = [],
}: MeshNodeDetailProps) {
  // Find connected nodes
  const connections = React.useMemo(() => {
    if (!node) return { incoming: [], outgoing: [] };

    const nodeMap = new Map(allNodes.map(n => [n.id, n]));
    
    const incoming = edges
      .filter(e => e.targetId === node.id)
      .map(e => ({
        edge: e,
        node: nodeMap.get(e.sourceId),
      }))
      .filter(c => c.node);

    const outgoing = edges
      .filter(e => e.sourceId === node.id)
      .map(e => ({
        edge: e,
        node: nodeMap.get(e.targetId),
      }))
      .filter(c => c.node);

    return { incoming, outgoing };
  }, [node, edges, allNodes]);

  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
        <GitBranch className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No node selected</p>
        <p className="text-sm">Click on a node to see its details</p>
      </div>
    );
  }

  const config = NODE_CONFIG[node.type];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className={cn('p-4 border-b', config.bgColor)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', config.bgColor)}>
              <div className={config.color}>{config.icon}</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{node.label}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn('text-xs', config.color, config.bgColor)}>
                  {config.label}
                </Badge>
                {node.weight > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    High Impact
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {node.description && (
          <p className="mt-3 text-sm text-muted-foreground">{node.description}</p>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(node.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated:</span>
              <span>{new Date(node.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Connections */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Connections
                <Badge variant="secondary" className="text-xs">
                  {connections.incoming.length + connections.outgoing.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Incoming */}
              {connections.incoming.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Incoming</p>
                  {connections.incoming.map(({ edge, node: connectedNode }) => (
                    <ConnectionItem
                      key={edge.id}
                      edge={edge}
                      node={connectedNode!}
                      direction="incoming"
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              )}

              {/* Outgoing */}
              {connections.outgoing.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Outgoing</p>
                  {connections.outgoing.map(({ edge, node: connectedNode }) => (
                    <ConnectionItem
                      key={edge.id}
                      edge={edge}
                      node={connectedNode!}
                      direction="outgoing"
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              )}

              {connections.incoming.length === 0 && connections.outgoing.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No connections found
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-4 w-4" />
                  AI Suggested Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => {
                    const suggestedNode = allNodes.find(n => n.id === suggestion.nodeId);
                    if (!suggestedNode) return null;

                    return (
                      <motion.div
                        key={suggestion.nodeId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn('p-1 rounded', NODE_CONFIG[suggestedNode.type].bgColor)}>
                            <div className={NODE_CONFIG[suggestedNode.type].color}>
                              {React.cloneElement(NODE_CONFIG[suggestedNode.type].icon as React.ReactElement, { className: 'h-3 w-3' })}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{suggestedNode.label}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(suggestion.confidence * 100)}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={() => onNavigate?.(suggestion.nodeId)}
                          >
                            View
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onNavigate?.(node.id)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Details
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Connection Item Component
interface ConnectionItemProps {
  edge: MeshEdge;
  node: MeshNode;
  direction: 'incoming' | 'outgoing';
  onNavigate?: (nodeId: string) => void;
}

function ConnectionItem({ edge, node, direction, onNavigate }: ConnectionItemProps) {
  const config = NODE_CONFIG[node.type];

  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onNavigate?.(node.id)}
    >
      <div className="flex items-center gap-2">
        <div className={cn('p-1 rounded', config.bgColor)}>
          <div className={config.color}>
            {React.cloneElement(config.icon as React.ReactElement, { className: 'h-3 w-3' })}
          </div>
        </div>
        <span className="text-sm font-medium">{node.label}</span>
        {edge.isAISuggested && (
          <Sparkles className="h-3 w-3 text-amber-500" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn('text-xs', EDGE_COLORS[edge.type] || '')}>
          {EDGE_LABELS[edge.type] || edge.type}
        </Badge>
        <ArrowRight className={cn(
          'h-3 w-3 text-muted-foreground',
          direction === 'incoming' && 'rotate-180'
        )} />
      </div>
    </div>
  );
}

export default MeshNodeDetail;

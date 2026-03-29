'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  User,
  Folder,
  Lightbulb,
  CheckSquare,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import type { MeshNode, MeshEdge, MeshNodeType } from '@/types';

// Node type configuration
const NODE_CONFIG: Record<MeshNodeType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  USER: {
    icon: <User className="h-4 w-4" />,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  PROJECT: {
    icon: <Folder className="h-4 w-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  CONCEPT: {
    icon: <Lightbulb className="h-4 w-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  TASK: {
    icon: <CheckSquare className="h-4 w-4" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  KNOWLEDGE: {
    icon: <FileText className="h-4 w-4" />,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
};

// Edge colors by type
const EDGE_COLORS: Record<string, string> = {
  created_by: '#8b5cf6',
  works_on: '#3b82f6',
  relates_to: '#f59e0b',
  depends_on: '#ef4444',
  references: '#06b6d4',
  assigned_to: '#10b981',
};

// Mock Data
const MOCK_NODES: MeshNode[] = [
  { id: 'n1', workspaceId: 'ws1', type: 'USER', referenceId: 'u1', label: 'Alice Chen', description: 'Product Designer', x: 200, y: 150, color: '#8b5cf6', weight: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n2', workspaceId: 'ws1', type: 'USER', referenceId: 'u2', label: 'Bob Smith', description: 'Developer', x: 400, y: 100, color: '#8b5cf6', weight: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n3', workspaceId: 'ws1', type: 'USER', referenceId: 'u3', label: 'Carol White', description: 'Project Manager', x: 150, y: 300, color: '#8b5cf6', weight: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n4', workspaceId: 'ws1', type: 'PROJECT', referenceId: 'p1', label: 'D.O.S. Platform', description: 'Main collaboration platform', x: 350, y: 250, color: '#3b82f6', weight: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n5', workspaceId: 'ws1', type: 'PROJECT', referenceId: 'p2', label: 'Mobile App', description: 'iOS and Android apps', x: 550, y: 200, color: '#3b82f6', weight: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n6', workspaceId: 'ws1', type: 'CONCEPT', referenceId: 'c1', label: 'AI Assistant', description: 'AI-powered help system', x: 500, y: 350, color: '#f59e0b', weight: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n7', workspaceId: 'ws1', type: 'CONCEPT', referenceId: 'c2', label: 'Real-time Sync', description: 'Live collaboration', x: 250, y: 400, color: '#f59e0b', weight: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n8', workspaceId: 'ws1', type: 'TASK', referenceId: 't1', label: 'Auth Module', description: 'Implement authentication', x: 450, y: 450, color: '#10b981', weight: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n9', workspaceId: 'ws1', type: 'TASK', referenceId: 't2', label: 'Dashboard UI', description: 'Build main dashboard', x: 300, y: 500, color: '#10b981', weight: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n10', workspaceId: 'ws1', type: 'KNOWLEDGE', referenceId: 'k1', label: 'API Docs', description: 'API documentation', x: 600, y: 400, color: '#06b6d4', weight: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'n11', workspaceId: 'ws1', type: 'KNOWLEDGE', referenceId: 'k2', label: 'User Guide', description: 'End-user documentation', x: 100, y: 450, color: '#06b6d4', weight: 2, createdAt: new Date(), updatedAt: new Date() },
];

const MOCK_EDGES: MeshEdge[] = [
  { id: 'e1', sourceId: 'n1', targetId: 'n4', type: 'works_on', weight: 1, isAISuggested: false, createdAt: new Date() },
  { id: 'e2', sourceId: 'n2', targetId: 'n4', type: 'works_on', weight: 1, isAISuggested: false, createdAt: new Date() },
  { id: 'e3', sourceId: 'n3', targetId: 'n4', type: 'created_by', weight: 1, isAISuggested: false, createdAt: new Date() },
  { id: 'e4', sourceId: 'n4', targetId: 'n5', type: 'relates_to', weight: 0.8, isAISuggested: false, createdAt: new Date() },
  { id: 'e5', sourceId: 'n4', targetId: 'n6', type: 'relates_to', weight: 0.9, isAISuggested: false, createdAt: new Date() },
  { id: 'e6', sourceId: 'n1', targetId: 'n6', type: 'created_by', weight: 0.7, isAISuggested: true, createdAt: new Date() },
  { id: 'e7', sourceId: 'n6', targetId: 'n7', type: 'depends_on', weight: 0.6, isAISuggested: true, createdAt: new Date() },
  { id: 'e8', sourceId: 'n2', targetId: 'n8', type: 'assigned_to', weight: 1, isAISuggested: false, createdAt: new Date() },
  { id: 'e9', sourceId: 'n1', targetId: 'n9', type: 'assigned_to', weight: 1, isAISuggested: false, createdAt: new Date() },
  { id: 'e10', sourceId: 'n8', targetId: 'n4', type: 'relates_to', weight: 0.8, isAISuggested: false, createdAt: new Date() },
  { id: 'e11', sourceId: 'n9', targetId: 'n4', type: 'relates_to', weight: 0.8, isAISuggested: false, createdAt: new Date() },
  { id: 'e12', sourceId: 'n10', targetId: 'n4', type: 'references', weight: 0.7, isAISuggested: false, createdAt: new Date() },
  { id: 'e13', sourceId: 'n11', targetId: 'n4', type: 'references', weight: 0.6, isAISuggested: false, createdAt: new Date() },
  { id: 'e14', sourceId: 'n2', targetId: 'n10', type: 'created_by', weight: 0.5, isAISuggested: false, createdAt: new Date() },
  { id: 'e15', sourceId: 'n3', targetId: 'n11', type: 'created_by', weight: 0.5, isAISuggested: false, createdAt: new Date() },
];

interface MeshVisualizationProps {
  workspaceId?: string;
  projectId?: string;
  nodes?: MeshNode[];
  edges?: MeshEdge[];
  selectedNodeId?: string;
  onNodeSelect?: (node: MeshNode) => void;
  onNodeDoubleClick?: (node: MeshNode) => void;
  showFilters?: boolean;
}

export function MeshVisualization({
  workspaceId,
  projectId,
  nodes = MOCK_NODES,
  edges = MOCK_EDGES,
  selectedNodeId,
  onNodeSelect,
  onNodeDoubleClick,
  showFilters = true,
}: MeshVisualizationProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // State
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = React.useState<MeshNode | null>(null);
  const [nodePositions, setNodePositions] = React.useState<Map<string, { x: number; y: number }>>(
    new Map(nodes.map(n => [n.id, { x: n.x || 0, y: n.y || 0 }]))
  );

  // Filtered data
  const [visibleNodeTypes, setVisibleNodeTypes] = React.useState<Set<MeshNodeType>>(
    new Set(['USER', 'PROJECT', 'CONCEPT', 'TASK', 'KNOWLEDGE'])
  );

  const filteredNodes = React.useMemo(() => {
    return nodes.filter(n => visibleNodeTypes.has(n.type));
  }, [nodes, visibleNodeTypes]);

  const filteredEdges = React.useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return edges.filter(e => nodeIds.has(e.sourceId) && nodeIds.has(e.targetId));
  }, [edges, filteredNodes]);

  // Draw the mesh
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    filteredEdges.forEach(edge => {
      const source = nodePositions.get(edge.sourceId);
      const target = nodePositions.get(edge.targetId);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      
      const color = EDGE_COLORS[edge.type] || '#94a3b8';
      ctx.strokeStyle = edge.isAISuggested ? `${color}80` : `${color}60`;
      ctx.lineWidth = edge.weight * 2;
      
      if (edge.isAISuggested) {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.stroke();
    });

    // Draw nodes
    filteredNodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      const config = NODE_CONFIG[node.type];
      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const radius = 20 + node.weight * 3;

      // Node background
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      
      if (isSelected) {
        ctx.fillStyle = node.color || config.bgColor;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (isHovered) {
        ctx.fillStyle = node.color || config.bgColor;
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = node.color || config.bgColor;
      }
      
      ctx.fill();

      // Node label
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(node.label, pos.x, pos.y + radius + 8);
    });

    ctx.restore();
  }, [filteredNodes, filteredEdges, nodePositions, zoom, pan, selectedNodeId, hoveredNode]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      // Check for node hover
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      let foundNode: MeshNode | null = null;
      for (const node of filteredNodes) {
        const pos = nodePositions.get(node.id);
        if (!pos) continue;

        const radius = 20 + node.weight * 3;
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        
        if (distance <= radius) {
          foundNode = node;
          break;
        }
      }
      
      setHoveredNode(foundNode);
      canvas.style.cursor = foundNode ? 'pointer' : 'grab';
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging && hoveredNode) {
      onNodeSelect?.(hoveredNode);
    }
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (hoveredNode) {
      onNodeDoubleClick?.(hoveredNode);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(3, prev + 0.2));
  const handleZoomOut = () => setZoom(prev => Math.max(0.3, prev - 0.2));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Auto-layout (simple force-directed)
  const handleAutoLayout = () => {
    const newPositions = new Map(nodePositions);
    const centerX = 350;
    const centerY = 300;
    
    filteredNodes.forEach((node, i) => {
      const angle = (i / filteredNodes.length) * Math.PI * 2;
      const radius = 150 + node.weight * 20;
      newPositions.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    });
    
    setNodePositions(newPositions);
  };

  return (
    <div className="relative flex flex-col h-full bg-muted/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Innovation Mesh</h3>
          <Badge variant="secondary">{filteredNodes.length} nodes</Badge>
          <Badge variant="outline">{filteredEdges.length} connections</Badge>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-24">
            <Slider
              value={[zoom * 100]}
              onValueChange={([v]) => setZoom(v / 100)}
              min={30}
              max={300}
              className="h-2"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleAutoLayout}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setHoveredNode(null);
          }}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
        />

        {/* Node Type Legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
          {Object.entries(NODE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              onClick={() => {
                setVisibleNodeTypes(prev => {
                  const next = new Set(prev);
                  if (next.has(type as MeshNodeType)) {
                    next.delete(type as MeshNodeType);
                  } else {
                    next.add(type as MeshNodeType);
                  }
                  return next;
                });
              }}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors',
                visibleNodeTypes.has(type as MeshNodeType)
                  ? config.bgColor + ' ' + config.color
                  : 'bg-muted text-muted-foreground opacity-50'
              )}
            >
              {config.icon}
              <span className="capitalize">{type.toLowerCase()}</span>
            </button>
          ))}
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredNode && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className={cn('p-1.5 rounded', NODE_CONFIG[hoveredNode.type].bgColor)}>
                  {NODE_CONFIG[hoveredNode.type].icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{hoveredNode.label}</p>
                  <p className="text-xs text-muted-foreground">{hoveredNode.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom Level Indicator */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}

export default MeshVisualization;

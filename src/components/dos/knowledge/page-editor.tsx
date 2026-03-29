'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Minus,
  CheckSquare,
  Table,
  Eye,
  Edit3,
  Save,
  Clock,
  ChevronRight,
  MoreHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { KnowledgePage } from '@/types';

// Mock page content
const MOCK_PAGE: KnowledgePage = {
  id: 'p1',
  workspaceId: 'ws1',
  projectId: null,
  parentId: null,
  title: 'Getting Started',
  slug: 'getting-started',
  icon: '🚀',
  content: `# Getting Started

Welcome to **D.O.S. Collaboration OS**! This guide will help you get up and running quickly.

## Quick Links

- [Installation Guide](/docs/installation)
- [API Reference](/docs/api)
- [Component Library](/docs/components)

## Features

### 🎯 Project Management

The ABCoDE framework provides a structured approach to project lifecycle:

1. **Acquaintance** - Discovery and research phase
2. **Build Up** - Development and creation
3. **Continuation** - Maintenance and optimization
4. **Deterioration** - Problem analysis
5. **Ending** - Documentation and archive

### 💬 Real-time Communication

Slack-like channels with:
- Public and private channels
- Direct messages
- Threaded conversations
- File attachments

### 🧠 Knowledge Base

A Notion-like knowledge system for:
- Documentation
- Team wiki
- Meeting notes
- Project specs

## Code Example

\`\`\`typescript
import { DOS } from '@dos/collaboration';

const workspace = await DOS.createWorkspace({
  name: 'My Team',
  organization: 'acme-corp'
});
\`\`\`

## Getting Help

If you need assistance, you can:
- Check our [documentation](/docs)
- Join our community Slack
- Contact support@dos.io

---

*Last updated: February 2024*
`,
  isArchived: false,
  isPublished: true,
  order: 0,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-02-01'),
};

// Toolbar Button Component
interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function ToolbarButton({ icon, label, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-8 p-0',
            active && 'bg-accent text-accent-foreground'
          )}
          disabled={disabled}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Editor Toolbar
interface EditorToolbarProps {
  onFormat: (format: string) => void;
  activeFormats: Set<string>;
}

function EditorToolbar({ onFormat, activeFormats }: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 p-1 border-b bg-muted/30 flex-wrap">
      {/* Text Style */}
      <ToolbarButton
        icon={<Bold className="h-4 w-4" />}
        label="Bold (Ctrl+B)"
        active={activeFormats.has('bold')}
        onClick={() => onFormat('bold')}
      />
      <ToolbarButton
        icon={<Italic className="h-4 w-4" />}
        label="Italic (Ctrl+I)"
        active={activeFormats.has('italic')}
        onClick={() => onFormat('italic')}
      />
      <ToolbarButton
        icon={<Strikethrough className="h-4 w-4" />}
        label="Strikethrough"
        active={activeFormats.has('strikethrough')}
        onClick={() => onFormat('strikethrough')}
      />
      <ToolbarButton
        icon={<Code className="h-4 w-4" />}
        label="Inline Code"
        active={activeFormats.has('code')}
        onClick={() => onFormat('code')}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings */}
      <ToolbarButton
        icon={<Heading1 className="h-4 w-4" />}
        label="Heading 1"
        active={activeFormats.has('h1')}
        onClick={() => onFormat('h1')}
      />
      <ToolbarButton
        icon={<Heading2 className="h-4 w-4" />}
        label="Heading 2"
        active={activeFormats.has('h2')}
        onClick={() => onFormat('h2')}
      />
      <ToolbarButton
        icon={<Heading3 className="h-4 w-4" />}
        label="Heading 3"
        active={activeFormats.has('h3')}
        onClick={() => onFormat('h3')}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists */}
      <ToolbarButton
        icon={<List className="h-4 w-4" />}
        label="Bullet List"
        active={activeFormats.has('bulletList')}
        onClick={() => onFormat('bulletList')}
      />
      <ToolbarButton
        icon={<ListOrdered className="h-4 w-4" />}
        label="Numbered List"
        active={activeFormats.has('numberedList')}
        onClick={() => onFormat('numberedList')}
      />
      <ToolbarButton
        icon={<CheckSquare className="h-4 w-4" />}
        label="Task List"
        active={activeFormats.has('taskList')}
        onClick={() => onFormat('taskList')}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Other Elements */}
      <ToolbarButton
        icon={<Quote className="h-4 w-4" />}
        label="Quote"
        active={activeFormats.has('quote')}
        onClick={() => onFormat('quote')}
      />
      <ToolbarButton
        icon={<Link className="h-4 w-4" />}
        label="Link (Ctrl+K)"
        active={activeFormats.has('link')}
        onClick={() => onFormat('link')}
      />
      <ToolbarButton
        icon={<Image className="h-4 w-4" />}
        label="Image"
        onClick={() => onFormat('image')}
      />
      <ToolbarButton
        icon={<Table className="h-4 w-4" />}
        label="Table"
        onClick={() => onFormat('table')}
      />
      <ToolbarButton
        icon={<Minus className="h-4 w-4" />}
        label="Horizontal Rule"
        onClick={() => onFormat('hr')}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <AlignLeft className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onFormat('alignLeft')}>
            <AlignLeft className="mr-2 h-4 w-4" /> Align Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFormat('alignCenter')}>
            <AlignCenter className="mr-2 h-4 w-4" /> Align Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFormat('alignRight')}>
            <AlignRight className="mr-2 h-4 w-4" /> Align Right
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Outline Sidebar
interface OutlineItem {
  id: string;
  level: number;
  text: string;
}

interface OutlineSidebarProps {
  content: string;
  onNavigate: (id: string) => void;
}

function OutlineSidebar({ content, onNavigate }: OutlineSidebarProps) {
  const outline = React.useMemo(() => {
    const lines = content.split('\n');
    const items: OutlineItem[] = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        items.push({
          id: `heading-${index}`,
          level: match[1].length,
          text: match[2],
        });
      }
    });
    
    return items;
  }, [content]);

  return (
    <div className="w-48 border-l bg-muted/10">
      <div className="p-3 border-b">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">
          Outline
        </h4>
      </div>
      <ScrollArea className="h-[calc(100%-45px)]">
        <div className="p-2">
          {outline.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No headings found
            </p>
          ) : (
            outline.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'w-full text-left text-xs py-1 px-2 rounded hover:bg-accent',
                  'text-muted-foreground hover:text-foreground transition-colors',
                  'truncate'
                )}
                style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
              >
                {item.text}
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Main Page Editor
interface PageEditorProps {
  page?: KnowledgePage;
  onSave?: (content: string) => void;
  onPublish?: () => void;
  readOnly?: boolean;
}

export function PageEditor({
  page = MOCK_PAGE,
  onSave,
  onPublish,
  readOnly = false,
}: PageEditorProps) {
  const [content, setContent] = React.useState(page.content);
  const [title, setTitle] = React.useState(page.title);
  const [icon, setIcon] = React.useState(page.icon || '📄');
  const [isEditing, setIsEditing] = React.useState(!readOnly);
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [activeFormats, setActiveFormats] = React.useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = React.useState<'edit' | 'preview'>('edit');

  const editorRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLastSaved(new Date());
    setIsSaving(false);
    onSave?.(content);
  }, [content, onSave]);

  // Auto-save simulation
  React.useEffect(() => {
    if (!isEditing) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000);

    return () => clearTimeout(timer);
  }, [content, title, isEditing, handleSave]);

  const handleFormat = (format: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'strikethrough':
        newText = `~~${selectedText || 'strikethrough'}~~`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'code':
        newText = `\`${selectedText || 'code'}\``;
        break;
      case 'h1':
        newText = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'h2':
        newText = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'h3':
        newText = `### ${selectedText || 'Heading 3'}`;
        break;
      case 'bulletList':
        newText = `- ${selectedText || 'List item'}`;
        break;
      case 'numberedList':
        newText = `1. ${selectedText || 'List item'}`;
        break;
      case 'taskList':
        newText = `- [ ] ${selectedText || 'Task'}`;
        break;
      case 'quote':
        newText = `> ${selectedText || 'Quote'}`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'image':
        newText = `![${selectedText || 'alt text'}](image-url)`;
        break;
      case 'hr':
        newText = '\n---\n';
        break;
      case 'table':
        newText = '\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n';
        break;
      default:
        newText = selectedText;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Simple markdown to HTML for preview
  const renderPreview = (markdown: string) => {
    return markdown
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
      .replace(/\n/g, '<br />');
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const newIcon = prompt('Enter emoji:', icon);
                if (newIcon) setIcon(newIcon);
              }}
              className="text-2xl hover:bg-accent rounded p-1 transition-colors"
            >
              {icon}
            </button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 px-0"
              placeholder="Untitled"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Save Status */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mr-2">
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Save className="h-3 w-3" />
                  </motion.div>
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Clock className="h-3 w-3" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </>
              ) : null}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 rounded-r-none"
                onClick={() => setViewMode('edit')}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 rounded-l-none"
                onClick={() => setViewMode('preview')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>

            {/* Publish Button */}
            <Button onClick={onPublish} disabled={page.isPublished}>
              {page.isPublished ? 'Published' : 'Publish'}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor / Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {viewMode === 'edit' && (
              <EditorToolbar onFormat={handleFormat} activeFormats={activeFormats} />
            )}
            
            <ScrollArea className="flex-1">
              {viewMode === 'edit' ? (
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full min-h-[calc(100vh-200px)] p-6 font-mono text-sm bg-transparent resize-none focus:outline-none"
                  placeholder="Start writing..."
                />
              ) : (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none p-6"
                  dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
                />
              )}
            </ScrollArea>
          </div>

          {/* Outline Sidebar */}
          <OutlineSidebar content={content} onNavigate={handleNavigate} />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default PageEditor;

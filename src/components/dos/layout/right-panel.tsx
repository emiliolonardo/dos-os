'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Sparkles,
  StickyNote,
  X,
  Send,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { useUIStore, selectRightPanelOpen, selectActivePanel } from '@/stores'

interface RightPanelProps {
  className?: string
}

interface ActivityItem {
  id: string
  type: 'message' | 'task' | 'mention' | 'update'
  title: string
  description: string
  time: string
  user?: {
    name: string
    avatar?: string
  }
}

interface QuickNote {
  id: string
  content: string
  createdAt: Date
  color: 'yellow' | 'green' | 'rose' | 'blue'
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message in #design',
    description: 'Sarah: "I just uploaded the new mockups..."',
    time: '2 min ago',
    user: { name: 'Sarah Chen' },
  },
  {
    id: '2',
    type: 'task',
    title: 'Task completed',
    description: 'Homepage redesign - Phase 1',
    time: '15 min ago',
    user: { name: 'Alex Kim' },
  },
  {
    id: '3',
    type: 'mention',
    title: 'You were mentioned',
    description: 'In Project Planning discussion',
    time: '1 hour ago',
    user: { name: 'Jordan Taylor' },
  },
  {
    id: '4',
    type: 'update',
    title: 'Project updated',
    description: 'Mobile App v2.0 moved to Build Up phase',
    time: '2 hours ago',
  },
  {
    id: '5',
    type: 'task',
    title: 'Task assigned',
    description: 'Create user flow diagrams',
    time: '3 hours ago',
    user: { name: 'Morgan Lee' },
  },
]

const mockNotes: QuickNote[] = [
  {
    id: '1',
    content: 'Remember to review the onboarding flow mockups before Friday meeting',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    color: 'yellow',
  },
  {
    id: '2',
    content: 'Ideas for improving user retention:\n- Gamification\n- Personalized content\n- Push notifications',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    color: 'green',
  },
]

const getActivityIcon = (type: ActivityItem['type']) => {
  const icons = {
    message: MessageSquare,
    task: CheckCircle2,
    mention: AlertCircle,
    update: Clock,
  }
  return icons[type]
}

const getActivityColor = (type: ActivityItem['type']) => {
  const colors = {
    message: 'text-emerald-500',
    task: 'text-amber-500',
    mention: 'text-rose-500',
    update: 'text-slate-500',
  }
  return colors[type]
}

const getNoteColorClasses = (color: QuickNote['color']) => {
  const colors = {
    yellow: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    green: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    rose: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
    blue: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800',
  }
  return colors[color]
}

export function RightPanel({ className }: RightPanelProps) {
  const rightPanelOpen = useUIStore(selectRightPanelOpen)
  const activePanel = useUIStore(selectActivePanel)
  
  const setRightPanelOpen = useUIStore((state) => state.setRightPanelOpen)
  const setActivePanel = useUIStore((state) => state.setActivePanel)
  
  const [aiInput, setAiInput] = React.useState('')
  const [aiMessages, setAiMessages] = React.useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [notes, setNotes] = React.useState<QuickNote[]>(mockNotes)
  const [newNote, setNewNote] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<string>('activity')

  const handleAiSend = () => {
    if (!aiInput.trim()) return
    
    setAiMessages((prev) => [
      ...prev,
      { role: 'user', content: aiInput },
      { role: 'assistant', content: 'I\'m here to help! Let me analyze your request and provide assistance. (This is a demo response)' },
    ])
    setAiInput('')
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    
    const noteColors: QuickNote['color'][] = ['yellow', 'green', 'rose', 'blue']
    const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)]
    
    setNotes((prev) => [
      {
        id: Date.now().toString(),
        content: newNote,
        createdAt: new Date(),
        color: randomColor,
      },
      ...prev,
    ])
    setNewNote('')
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update the active panel based on tab
    const panelMap: Record<string, 'activity' | 'chat' | null> = {
      activity: null,
      ai: 'chat',
      notes: null,
    }
    setActivePanel(panelMap[value] || null)
  }

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={cn(
            'relative flex flex-col h-full border-l border-slate-200 dark:border-slate-800 bg-background overflow-hidden',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-sm">Quick Panel</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setRightPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2 w-auto">
              <TabsTrigger value="activity" className="text-xs">
                <Activity className="h-3.5 w-3.5 mr-1" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                AI
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">
                <StickyNote className="h-3.5 w-3.5 mr-1" />
                Notes
              </TabsTrigger>
            </TabsList>

            {/* Activity Tab */}
            <TabsContent value="activity" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {mockActivities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type)
                    const color = getActivityColor(activity.type)
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className={cn('mt-0.5', color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {activity.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {activity.description}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                        {activity.user && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800">
                              {activity.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* AI Tab */}
            <TabsContent value="ai" className="flex-1 m-0 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {aiMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="h-6 w-6 text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        AI Assistant
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Ask anything about your projects, tasks, or get creative assistance
                      </p>
                    </div>
                  ) : (
                    aiMessages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'flex gap-3',
                          message.role === 'user' && 'flex-row-reverse'
                        )}
                      >
                        <div
                          className={cn(
                            'rounded-lg p-3 max-w-[85%]',
                            message.role === 'user'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800'
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask AI..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                    className="text-sm"
                  />
                  <Button size="icon" onClick={handleAiSend} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="flex-1 m-0 flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <Textarea
                  placeholder="Add a quick note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="text-sm resize-none"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={handleAddNote}>
                    Add Note
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {notes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'p-3 rounded-lg border text-sm',
                        getNoteColorClasses(note.color)
                      )}
                    >
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

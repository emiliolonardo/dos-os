'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Plus,
  MessageSquare,
  Lightbulb,
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Filter,
  MoreHorizontal,
  ArrowRight,
  Zap,
  Target,
  Brain,
  Calendar,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for demonstration
const currentUser = {
  name: 'Alex Morgan',
  avatar: '/avatars/alex.jpg',
  initials: 'AM',
}

const stats = [
  {
    title: 'Active Projects',
    value: '12',
    progress: 68,
    icon: FolderKanban,
    trend: '+3 this month',
    color: 'emerald',
  },
  {
    title: 'Tasks Due Today',
    value: '8',
    progress: 45,
    icon: CheckCircle2,
    trend: '3 completed',
    color: 'amber',
  },
  {
    title: 'Concepts Generated',
    value: '24',
    progress: 85,
    icon: Lightbulb,
    trend: '+7 this week',
    color: 'emerald',
  },
  {
    title: 'Team Online',
    value: '6/12',
    progress: 50,
    icon: Users,
    trend: '2 in meeting',
    color: 'slate',
  },
]

const activities = [
  {
    id: 1,
    user: { name: 'Sarah Chen', avatar: '/avatars/sarah.jpg', initials: 'SC' },
    action: 'completed task',
    target: 'Update API documentation',
    type: 'task',
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 2,
    user: { name: 'Marcus Webb', avatar: '/avatars/marcus.jpg', initials: 'MW' },
    action: 'created concept',
    target: 'AI-powered workflow automation',
    type: 'concept',
    timestamp: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 3,
    user: { name: 'Emma Davis', avatar: '/avatars/emma.jpg', initials: 'ED' },
    action: 'moved to Review phase',
    target: 'Dashboard redesign',
    type: 'project',
    timestamp: new Date(Date.now() - 32 * 60000),
  },
  {
    id: 4,
    user: { name: 'James Wilson', avatar: '/avatars/james.jpg', initials: 'JW' },
    action: 'commented on',
    target: 'Q4 Planning document',
    type: 'comment',
    timestamp: new Date(Date.now() - 45 * 60000),
  },
  {
    id: 5,
    user: { name: 'Lisa Park', avatar: '/avatars/lisa.jpg', initials: 'LP' },
    action: 'joined project',
    target: 'Mobile App Initiative',
    type: 'project',
    timestamp: new Date(Date.now() - 60 * 60000),
  },
  {
    id: 6,
    user: { name: 'David Kim', avatar: '/avatars/david.jpg', initials: 'DK' },
    action: 'generated prompt',
    target: 'Customer onboarding flow',
    type: 'prompt',
    timestamp: new Date(Date.now() - 90 * 60000),
  },
]

const projects = [
  {
    id: 1,
    name: 'D.O.S. Platform v2',
    phase: 'BUILD_UP',
    progress: 72,
    color: '#10b981',
    team: [
      { name: 'Sarah Chen', initials: 'SC' },
      { name: 'Marcus Webb', initials: 'MW' },
      { name: 'Emma Davis', initials: 'ED' },
    ],
  },
  {
    id: 2,
    name: 'AI Integration Suite',
    phase: 'ACQUAINTANCE',
    progress: 35,
    color: '#6366f1',
    team: [
      { name: 'James Wilson', initials: 'JW' },
      { name: 'Lisa Park', initials: 'LP' },
    ],
  },
  {
    id: 3,
    name: 'Mobile Experience',
    phase: 'CONTINUATION',
    progress: 89,
    color: '#f59e0b',
    team: [
      { name: 'David Kim', initials: 'DK' },
      { name: 'Sarah Chen', initials: 'SC' },
      { name: 'Emma Davis', initials: 'ED' },
      { name: 'Marcus Webb', initials: 'MW' },
    ],
  },
  {
    id: 4,
    name: 'Analytics Dashboard',
    phase: 'ENDING',
    progress: 95,
    color: '#8b5cf6',
    team: [
      { name: 'Lisa Park', initials: 'LP' },
    ],
  },
]

const tasks = [
  {
    id: 1,
    title: 'Review design system updates',
    project: 'D.O.S. Platform v2',
    priority: 'high',
    status: 'in_progress',
    dueDate: new Date(),
  },
  {
    id: 2,
    title: 'Update API documentation',
    project: 'AI Integration Suite',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(),
  },
  {
    id: 3,
    title: 'Fix authentication flow bug',
    project: 'Mobile Experience',
    priority: 'urgent',
    status: 'review',
    dueDate: new Date(Date.now() - 86400000),
  },
  {
    id: 4,
    title: 'Write unit tests for dashboard',
    project: 'Analytics Dashboard',
    priority: 'low',
    status: 'todo',
    dueDate: new Date(Date.now() + 86400000),
  },
  {
    id: 5,
    title: 'Implement dark mode toggle',
    project: 'D.O.S. Platform v2',
    priority: 'medium',
    status: 'in_progress',
    dueDate: new Date(),
  },
]

const aiInsights = [
  {
    id: 1,
    type: 'suggestion',
    title: 'Optimize Meeting Schedule',
    description: 'Based on team productivity patterns, consider moving team standups to 10:00 AM for 23% better engagement.',
    icon: TrendingUp,
    color: 'emerald',
  },
  {
    id: 2,
    type: 'concept',
    title: 'Concept Idea: Smart Notifications',
    description: 'AI-driven notification grouping to reduce context switching by grouping related alerts.',
    icon: Lightbulb,
    color: 'amber',
  },
  {
    id: 3,
    type: 'recommendation',
    title: 'Project Recommendation',
    description: 'Consider starting "API v3 Migration" - dependencies are resolved and team capacity is optimal.',
    icon: Target,
    color: 'slate',
  },
]

const phaseLabels: Record<string, { label: string; color: string }> = {
  ACQUAINTANCE: { label: 'A', color: 'bg-blue-500' },
  BUILD_UP: { label: 'B', color: 'bg-emerald-500' },
  CONTINUATION: { label: 'C', color: 'bg-amber-500' },
  DETERIORATION: { label: 'D', color: 'bg-orange-500' },
  ENDING: { label: 'E', color: 'bg-purple-500' },
}

const priorityColors: Record<string, string> = {
  urgent: 'bg-rose-100 text-rose-700 border-rose-200',
  high: 'bg-amber-100 text-amber-700 border-amber-200',
  medium: 'bg-slate-100 text-slate-700 border-slate-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200',
}

const activityTypeIcons: Record<string, React.ElementType> = {
  task: CheckCircle2,
  concept: Lightbulb,
  project: FolderKanban,
  comment: MessageSquare,
  prompt: Sparkles,
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function Dashboard() {
  const now = new Date()
  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(now, 'EEEE, MMMM d, yyyy • h:mm a')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
            <Button variant="outline" className="border-slate-200 dark:border-slate-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
            <Button variant="outline" className="border-slate-200 dark:border-slate-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Concept
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={cardVariants}
              whileHover="hover"
            >
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <stat.icon className={`h-5 w-5 ${
                        stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                        stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                        'text-slate-600 dark:text-slate-400'
                      }`} />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{stat.trend}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                  </div>
                  
                  <div className="mt-4">
                    <Progress 
                      value={stat.progress} 
                      className={`h-1.5 ${
                        stat.color === 'emerald' ? '[&>div]:bg-emerald-500' :
                        stat.color === 'amber' ? '[&>div]:bg-amber-500' :
                        '[&>div]:bg-slate-400'
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Activity Feed & Projects */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Activity Feed */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Activity Feed
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-4">
                    {activities.map((activity, index) => {
                      const ActivityIcon = activityTypeIcons[activity.type] || CheckCircle2
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm">
                            <AvatarImage src={activity.user.avatar} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-sm font-medium">
                              {activity.user.initials}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              <span className="font-medium text-slate-900 dark:text-slate-100">{activity.user.name}</span>
                              {' '}
                              <span className="text-slate-500">{activity.action}</span>
                              {' '}
                              <span className="font-medium text-slate-900 dark:text-slate-100">{activity.target}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatTimeAgo(activity.timestamp)}
                            </p>
                          </div>
                          
                          <div className={`p-1.5 rounded-md ${
                            activity.type === 'task' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                            activity.type === 'concept' ? 'bg-amber-100 dark:bg-amber-900/30' :
                            activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            activity.type === 'prompt' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            <ActivityIcon className={`h-3.5 w-3.5 ${
                              activity.type === 'task' ? 'text-emerald-600 dark:text-emerald-400' :
                              activity.type === 'concept' ? 'text-amber-600 dark:text-amber-400' :
                              activity.type === 'project' ? 'text-blue-600 dark:text-blue-400' :
                              activity.type === 'prompt' ? 'text-purple-600 dark:text-purple-400' :
                              'text-slate-600 dark:text-slate-400'
                            }`} />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* My Projects Section */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    My Projects
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                    View All Projects
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer overflow-hidden group">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: project.color }}
                              />
                              <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">
                                {project.name}
                              </h3>
                            </div>
                            <Badge variant="outline" className="text-xs font-medium border-slate-200 dark:border-slate-600">
                              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${phaseLabels[project.phase].color} text-white text-[10px] font-bold mr-1`}>
                                {phaseLabels[project.phase].label}
                              </span>
                              {project.phase.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>Progress</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">{project.progress}%</span>
                            </div>
                            <Progress 
                              value={project.progress} 
                              className="h-1.5"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-white dark:border-slate-800">
                                  <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-600 dark:text-slate-300">
                                    {member.initials}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {project.team.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                                    +{project.team.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tasks & AI Insights */}
          <div className="space-y-6">
            
            {/* Quick Tasks */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Quick Tasks
                </CardTitle>
                <CardDescription className="text-slate-500 text-sm">
                  {tasks.length} tasks assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Tabs defaultValue="in_progress" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-9 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger 
                      value="todo" 
                      className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                    >
                      To Do
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                        {groupedTasks.todo.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="in_progress"
                      className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                    >
                      In Progress
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                        {groupedTasks.in_progress.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="review"
                      className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                    >
                      Review
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                        {groupedTasks.review.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="todo" className="mt-3">
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2 pr-2">
                        {groupedTasks.todo.map(task => (
                          <div 
                            key={task.id}
                            className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {task.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 truncate">{task.project}</p>
                              </div>
                              <Badge variant="outline" className={`text-[10px] ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="in_progress" className="mt-3">
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2 pr-2">
                        {groupedTasks.in_progress.map(task => (
                          <div 
                            key={task.id}
                            className="p-3 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {task.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 truncate">{task.project}</p>
                              </div>
                              <Badge variant="outline" className={`text-[10px] ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="review" className="mt-3">
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2 pr-2">
                        {groupedTasks.review.map(task => (
                          <div 
                            key={task.id}
                            className="p-3 rounded-lg border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {task.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 truncate">{task.project}</p>
                              </div>
                              <Badge variant="outline" className={`text-[10px] ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* AI Insights Panel */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      AI Insights
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs">
                      Powered by D.O.S. AI
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea className="h-[260px]">
                  <div className="space-y-3 pr-2">
                    {aiInsights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                          insight.color === 'emerald' 
                            ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' 
                            : insight.color === 'amber'
                            ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-md ${
                            insight.color === 'emerald' 
                              ? 'bg-emerald-200 dark:bg-emerald-800/50' 
                              : insight.color === 'amber'
                              ? 'bg-amber-200 dark:bg-amber-800/50'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}>
                            <insight.icon className={`h-3.5 w-3.5 ${
                              insight.color === 'emerald' 
                                ? 'text-emerald-700 dark:text-emerald-300' 
                                : insight.color === 'amber'
                                ? 'text-amber-700 dark:text-amber-300'
                                : 'text-slate-600 dark:text-slate-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {insight.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="ghost" size="sm" className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                    <Zap className="h-4 w-4 mr-2" />
                    Get More Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

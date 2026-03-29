'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  MessageSquare,
  FolderKanban,
  Lightbulb,
  Terminal,
  BookOpen,
  Network,
  Palette,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { WorkspaceSwitcher } from './workspace-switcher'
import {
  useUIStore,
  useAuthStore,
  selectSidebarOpen,
  selectTheme,
  selectCurrentUser,
  selectUserMode,
} from '@/stores'
import type { UserMode } from '@/stores/types'

interface SidebarProps {
  className?: string
}

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: number
  active?: boolean
}

interface UserModeConfig {
  id: UserMode
  label: string
  icon: React.ElementType
  color: string
  description: string
}

const userModes: UserModeConfig[] = [
  {
    id: 'design',
    label: 'Design',
    icon: Palette,
    color: 'text-rose-500',
    description: 'Creative design workflows',
  },
  {
    id: 'innovation',
    label: 'Innovation',
    icon: Sparkles,
    color: 'text-amber-500',
    description: 'Innovation & research',
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    color: 'text-emerald-500',
    description: 'Learning & teaching',
  },
]

const navigationItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, active: true },
  { id: 'chat', label: 'Chat', icon: MessageSquare, badge: 5 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'concepts', label: 'Concepts', icon: Lightbulb },
  { id: 'prompts', label: 'Prompts', icon: Terminal },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'mesh', label: 'Mesh', icon: Network },
]

export function Sidebar({ className }: SidebarProps) {
  const sidebarOpen = useUIStore(selectSidebarOpen)
  const theme = useUIStore(selectTheme)
  const currentUser = useAuthStore(selectCurrentUser)
  const userMode = useAuthStore(selectUserMode)
  
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const setTheme = useUIStore((state) => state.setTheme)
  const setUserMode = useAuthStore((state) => state.setUserMode)

  const [activeNav, setActiveNav] = React.useState('home')

  // Mock user for demo
  const displayUser = currentUser || {
    name: 'John Doe',
    email: 'john@example.com',
    image: null,
    displayName: 'John D.',
  }

  const currentMode = userModes.find((m) => m.id === userMode) || userModes[0]

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 260 : 72,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'relative flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800',
          'transition-colors duration-200',
          className
        )}
      >
        {/* Workspace Switcher */}
        <div className="p-3">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="workspace-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <WorkspaceSwitcher />
              </motion.div>
            ) : (
              <motion.div
                key="workspace-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      <currentMode.icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Switch Workspace</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator className="mx-3" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeNav === item.id
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => setActiveNav(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        'hover:bg-slate-100 dark:hover:bg-slate-800/70',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      )}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive && 'text-emerald-500'
                        )}
                      />
                      <AnimatePresence mode="wait">
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {item.badge && sidebarOpen && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 px-1.5 text-xs bg-rose-500 text-white dark:bg-rose-600"
                          >
                            {item.badge}
                          </Badge>
                        </motion.span>
                      )}
                      {item.badge && !sidebarOpen && (
                        <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-rose-500" />
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                      {item.badge && (
                        <span className="ml-2 text-rose-400">({item.badge})</span>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>
        </ScrollArea>

        <Separator className="mx-3" />

        {/* User Mode Switcher */}
        <div className="p-3">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="mode-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
                  User Mode
                </p>
                <div className="flex gap-1">
                  {userModes.map((mode) => {
                    const isActive = userMode === mode.id
                    return (
                      <Tooltip key={mode.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUserMode(mode.id)}
                            className={cn(
                              'flex-1 h-auto py-2 px-2 flex-col gap-1',
                              isActive && 'bg-slate-100 dark:bg-slate-800'
                            )}
                          >
                            <mode.icon
                              className={cn(
                                'h-4 w-4',
                                isActive ? mode.color : 'text-slate-400'
                              )}
                            />
                            <span
                              className={cn(
                                'text-xs',
                                isActive
                                  ? 'text-slate-900 dark:text-slate-100'
                                  : 'text-slate-500'
                              )}
                            >
                              {mode.label}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{mode.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mode-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <currentMode.icon className={cn('h-5 w-5', currentMode.color)} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="right">
                    <DropdownMenuLabel>User Mode</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userModes.map((mode) => (
                      <DropdownMenuItem
                        key={mode.id}
                        onClick={() => setUserMode(mode.id)}
                        className="cursor-pointer"
                      >
                        <mode.icon className={cn('mr-2 h-4 w-4', mode.color)} />
                        {mode.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="profile-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-2 h-auto"
                    >
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={displayUser.image || undefined} />
                        <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                          {getInitials(displayUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-left min-w-0">
                        <span className="text-sm font-medium truncate">
                          {displayUser.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {displayUser.email}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
                      {theme === 'dark' ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-rose-500 focus:text-rose-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <motion.div
                key="profile-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={displayUser.image || undefined} />
                        <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                          {getInitials(displayUser.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{displayUser.name}</span>
                        <span className="font-normal text-xs text-slate-500">
                          {displayUser.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
                      {theme === 'dark' ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-rose-500 focus:text-rose-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-accent z-10"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      </motion.aside>
    </TooltipProvider>
  )
}

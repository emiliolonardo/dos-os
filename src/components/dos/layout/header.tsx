'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  Plus,
  FolderPlus,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Home,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command'
import {
  useUIStore,
  useAuthStore,
  selectTheme,
  selectCurrentUser,
} from '@/stores'

interface HeaderProps {
  className?: string
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  shortcut?: string
  description: string
}

const quickActions: QuickAction[] = [
  {
    id: 'create-project',
    label: 'Create Project',
    icon: FolderPlus,
    shortcut: '⌘P',
    description: 'Start a new project',
  },
  {
    id: 'new-concept',
    label: 'New Concept',
    icon: Lightbulb,
    shortcut: '⌘C',
    description: 'Create a concept note',
  },
  {
    id: 'ai-assist',
    label: 'AI Assist',
    icon: Sparkles,
    shortcut: '⌘I',
    description: 'Get AI assistance',
  },
]

const mockNotifications = [
  { id: '1', title: 'New message in #general', time: '2m ago', read: false },
  { id: '2', title: 'Task assigned to you', time: '1h ago', read: false },
  { id: '3', title: 'Project deadline approaching', time: '3h ago', read: true },
]

export function Header({ className }: HeaderProps) {
  const theme = useUIStore(selectTheme)
  const currentUser = useAuthStore(selectCurrentUser)
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen)
  
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [breadcrumbs] = React.useState<BreadcrumbItem[]>([
    { label: 'Home', href: '/' },
    { label: 'Dashboard' },
  ])

  // Mock user for demo
  const displayUser = currentUser || {
    name: 'John Doe',
    email: 'john@example.com',
    image: null,
  }

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Command+K to open search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6',
        className
      )}
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {item.href && index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl">
        <Button
          variant="outline"
          className={cn(
            'relative w-full justify-start text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
            'hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
          onClick={() => setSearchOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden md:inline-flex">Search...</span>
          <span className="inline-flex md:hidden">Search</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-xs font-medium sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="hidden md:flex gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {quickActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <action.icon className="h-4 w-4 text-slate-500" />
                  <div>
                    <span>{action.label}</span>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                </div>
                {action.shortcut && (
                  <span className="text-xs text-slate-400">{action.shortcut}</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Create Button */}
        <Button
          size="icon"
          variant="outline"
          className="md:hidden"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white"
                >
                  {unreadCount}
                </motion.span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'cursor-pointer flex flex-col items-start gap-1 p-3',
                    !notification.read && 'bg-slate-50 dark:bg-slate-800/50'
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                    <span className="font-medium text-sm flex-1">
                      {notification.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 ml-4">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-emerald-600 dark:text-emerald-400">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
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
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-rose-500 focus:text-rose-500">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem key={action.id} className="cursor-pointer">
                <action.icon className="mr-2 h-4 w-4" />
                {action.label}
                {action.shortcut && (
                  <CommandShortcut>{action.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent">
            <CommandItem className="cursor-pointer">
              <ChevronRight className="mr-2 h-4 w-4" />
              Project: Website Redesign
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <ChevronRight className="mr-2 h-4 w-4" />
              Concept: User Onboarding Flow
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <ChevronRight className="mr-2 h-4 w-4" />
              Document: Brand Guidelines
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}

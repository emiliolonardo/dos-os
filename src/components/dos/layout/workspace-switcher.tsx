'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronsUpDown,
  Plus,
  Building2,
  Briefcase,
  Rocket,
  Users,
  LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  useWorkspaceStore,
  selectWorkspaces,
  selectCurrentWorkspace,
} from '@/stores'

interface WorkspaceSwitcherProps {
  className?: string
}

// Icon map defined outside component
const iconMap: Record<string, LucideIcon> = {
  Building2,
  Briefcase,
  Rocket,
  Users,
}

// Helper component for workspace icons
const WorkspaceIconComponent = ({ iconName, className }: { iconName: string | null; className?: string }) => {
  const Icon = iconName && iconMap[iconName] ? iconMap[iconName] : Building2
  return <Icon className={className} />
}

export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const workspaces = useWorkspaceStore(selectWorkspaces)
  const currentWorkspace = useWorkspaceStore(selectCurrentWorkspace)
  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace)

  // Mock workspaces for demo if none exist
  const displayWorkspaces = workspaces.length > 0 ? workspaces : [
    { id: '1', name: 'Design Team', slug: 'design-team', icon: 'Building2', organizationId: 'org1', isDefault: true, description: 'Design workspace', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Innovation Lab', slug: 'innovation-lab', icon: 'Rocket', organizationId: 'org1', isDefault: false, description: 'Innovation workspace', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Education Hub', slug: 'education-hub', icon: 'Users', organizationId: 'org1', isDefault: false, description: 'Education workspace', createdAt: new Date(), updatedAt: new Date() },
  ]

  const currentDisplayWorkspace = currentWorkspace || displayWorkspaces[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select workspace"
          className={cn(
            'w-full justify-between px-3 py-2 h-auto text-left font-normal',
            'hover:bg-slate-100 dark:hover:bg-slate-800/50',
            'border border-transparent hover:border-slate-200 dark:hover:border-slate-700',
            'rounded-lg transition-all duration-200',
            className
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <motion.div
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WorkspaceIconComponent iconName={currentDisplayWorkspace?.icon || null} className="h-4 w-4" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm truncate text-slate-900 dark:text-slate-100">
                {currentDisplayWorkspace?.name || 'Select workspace'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentDisplayWorkspace?.description || 'No description'}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace..." />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              <AnimatePresence>
                {displayWorkspaces.map((workspace, index) => {
                  const isSelected = workspace.id === currentDisplayWorkspace?.id
                  return (
                    <CommandItem
                      key={workspace.id}
                      onSelect={() => {
                        setCurrentWorkspace(workspace as any)
                        setOpen(false)
                      }}
                      className="cursor-pointer"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 w-full"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800">
                          <WorkspaceIconComponent iconName={workspace.icon} className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm truncate">{workspace.name}</span>
                        </div>
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4 text-emerald-500',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </motion.div>
                    </CommandItem>
                  )
                })}
              </AnimatePresence>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  // TODO: Open create workspace modal
                  setOpen(false)
                }}
                className="cursor-pointer"
              >
                <motion.div
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                  whileHover={{ x: 2 }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Create Workspace</span>
                </motion.div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

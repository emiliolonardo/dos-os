'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { RightPanel } from './right-panel'
import { useUIStore, selectRightPanelOpen, selectTheme } from '@/stores'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const rightPanelOpen = useUIStore(selectRightPanelOpen)
  const theme = useUIStore(selectTheme)
  const toggleRightPanel = useUIStore((state) => state.toggleRightPanel)

  // Apply theme on mount and changes
  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 overflow-auto bg-slate-50 dark:bg-slate-950',
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Footer Actions - Right Panel Toggle */}
        <div className="absolute bottom-4 right-4 z-30">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleRightPanel}
            className={cn(
              'rounded-full shadow-lg transition-all duration-200',
              'bg-background/80 backdrop-blur-sm',
              'hover:bg-accent',
              rightPanelOpen && 'rotate-180'
            )}
          >
            {rightPanelOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  )
}

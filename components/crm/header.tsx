'use client'

import { Search, Plus, Film, Activity, Monitor, BarChart3, CalendarDays, ChevronDown, Folder, Archive, Check, LayoutGrid, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sparkline } from '@/components/crm/sparkline'
import { GlobalStatusGauge } from '@/components/crm/global-status-gauge'
import { cn } from '@/lib/utils'
import { type Project } from '@/lib/crm-data'

export type ViewMode = 'technical' | 'executive'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onQuickAdd: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onOpenCalendar: () => void
  projects: Project[]
  selectedProjectId: string
  onProjectChange: (projectId: string) => void
  onCreateProject: () => void
}

// Mock velocity data for last 7 days
const velocityData = [3, 5, 4, 7, 6, 8, 9]

export function Header({ searchQuery, onSearchChange, onQuickAdd, viewMode, onViewModeChange, onOpenCalendar, projects, selectedProjectId, onProjectChange, onCreateProject }: HeaderProps) {
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const activeProjects = projects.filter(p => p.status === 'active')
  const archivedProjects = projects.filter(p => p.status === 'archived')
  const totalClients = projects.reduce((sum, p) => sum + p.clientCount, 0)
  const isAllProjects = selectedProjectId === 'all'

  return (
    <header className="flex items-center justify-between glass-card border-b border-white/[0.06] px-4 md:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-4 lg:gap-6">
        {/* MSC Logo - compact on mobile */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 lg:h-11 lg:w-11 items-center justify-center rounded-xl lg:rounded-2xl bg-primary/10 border border-primary/20">
            <Film className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
            <div className="absolute inset-0 rounded-xl lg:rounded-2xl blur-xl bg-primary/20" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base lg:text-lg font-semibold tracking-wide text-foreground">
              <span className="text-primary">MSC</span>
              <span className="text-muted-foreground mx-1.5">/</span>
              <span className="text-muted-foreground">Studio</span>
            </h1>
          </div>
        </div>

        {/* Project Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl px-3 py-2 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-primary/30 transition-all"
            >
              {isAllProjects ? (
                <LayoutGrid className="h-4 w-4 text-primary flex-shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-primary flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-foreground truncate max-w-[120px] lg:max-w-[160px]">
                {isAllProjects ? 'All Projects' : selectedProject?.name || 'Select Project'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 rounded-xl bg-background/95 backdrop-blur-xl border-white/[0.08]">
            {/* All Projects Option */}
            <DropdownMenuItem
              onClick={() => onProjectChange('all')}
              className="flex items-center justify-between rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">All Projects</p>
                  <p className="text-[10px] text-muted-foreground">{totalClients} total clients</p>
                </div>
              </div>
              {isAllProjects && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Active Projects</DropdownMenuLabel>
            {activeProjects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => onProjectChange(project.id)}
                className="flex items-center justify-between rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-4 w-4 text-primary/70" />
                  <div>
                    <p className="text-sm font-medium">{project.name}</p>
                    <p className="text-[10px] text-muted-foreground">{project.clientCount} clients</p>
                  </div>
                </div>
                {project.id === selectedProjectId && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            {archivedProjects.length > 0 && (
              <>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Archived</DropdownMenuLabel>
                {archivedProjects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => onProjectChange(project.id)}
                    className="flex items-center justify-between rounded-lg cursor-pointer opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <Archive className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-[10px] text-muted-foreground">{project.clientCount} clients</p>
                      </div>
                    </div>
                    {project.id === selectedProjectId && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={onCreateProject}
              className="flex items-center gap-3 rounded-lg cursor-pointer text-primary"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="text-sm font-medium">Create New Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Project Velocity Sparkline - hidden on smaller screens */}
        <div className="hidden xl:flex items-center gap-3 border-l border-white/[0.06] pl-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Velocity</span>
          </div>
          <Sparkline data={velocityData} width={80} height={24} />
          <span className="text-sm text-primary font-semibold">+12%</span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* View Mode Toggle */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center rounded-xl bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => onViewModeChange('technical')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
                viewMode === 'technical'
                  ? 'bg-primary/20 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Technical</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('executive')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
                viewMode === 'executive'
                  ? 'bg-primary/20 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Executive</span>
            </button>
          </div>
        </div>

        {/* Global Status Gauge - only on large screens */}
        <div className="hidden xl:flex items-center">
          <GlobalStatusGauge percentage={85} label="Capacity" />
        </div>

        {/* Calendar Button */}
        <Button
          onClick={onOpenCalendar}
          variant="outline"
          size="icon"
          className="rounded-xl border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-primary/40 h-9 w-9"
        >
          <CalendarDays className="h-4 w-4 text-primary" />
        </Button>

        {/* Search - responsive width */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-32 lg:w-48 xl:w-64 rounded-xl border-white/[0.06] bg-white/[0.03] pl-9 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:ring-primary/20 focus:bg-white/[0.05] h-9"
          />
        </div>

        {/* Add Client Button */}
        <Button
          onClick={onQuickAdd}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 vader-btn-hover px-3 lg:px-4 py-2 text-sm font-semibold h-9"
        >
          <Plus className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:inline">Add Client</span>
        </Button>
      </div>
    </header>
  )
}

'use client'

import { Search, Plus, Film, Activity, Monitor, BarChart3, CalendarDays, ChevronDown, Folder, Archive, Check } from 'lucide-react'
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
}

// Mock velocity data for last 7 days
const velocityData = [3, 5, 4, 7, 6, 8, 9]

export function Header({ searchQuery, onSearchChange, onQuickAdd, viewMode, onViewModeChange, onOpenCalendar, projects, selectedProjectId, onProjectChange }: HeaderProps) {
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const activeProjects = projects.filter(p => p.status === 'active')
  const archivedProjects = projects.filter(p => p.status === 'archived')

  return (
    <header className="flex items-center justify-between glass-card border-b border-white/[0.06] px-8 py-5">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          {/* Soft MSC Icon */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Film className="h-5 w-5 text-primary" />
            <div className="absolute inset-0 rounded-2xl blur-xl bg-primary/20" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-foreground">
              <span className="text-primary">MSC</span>
              <span className="text-muted-foreground mx-2">/</span>
              <span className="text-muted-foreground">Studio</span>
            </h1>
            <p className="text-xs text-muted-foreground">Media Dashboard</p>
          </div>
        </div>

        {/* Project Selector Dropdown */}
        <div className="border-l border-white/[0.06] pl-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-primary/30 transition-all"
              >
                <Folder className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{selectedProject?.name || 'Select Project'}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedProject?.clientCount || 0} clients</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 rounded-xl bg-background/95 backdrop-blur-xl border-white/[0.08]">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Project Velocity Sparkline */}
        <div className="hidden md:flex items-center gap-4 border-l border-white/[0.06] pl-8">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Velocity
            </span>
          </div>
          <Sparkline data={velocityData} width={100} height={28} />
          <span className="text-sm text-primary font-semibold">+12%</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* View Mode Toggle */}
        <div className="hidden md:flex items-center border-r border-white/[0.06] pr-6">
          <div className="flex items-center rounded-xl bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => onViewModeChange('technical')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
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
                'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
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

        {/* Global Status Gauge */}
        <div className="hidden lg:flex items-center gap-4 border-r border-white/[0.06] pr-6">
          <GlobalStatusGauge percentage={85} label="Studio Capacity" />
        </div>

        {/* Calendar Button */}
        <Button
          onClick={onOpenCalendar}
          variant="outline"
          className="rounded-xl border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-primary/40 px-3 py-2.5"
        >
          <CalendarDays className="h-4 w-4 text-primary" />
        </Button>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-72 rounded-xl border-white/[0.06] bg-white/[0.03] pl-11 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:ring-primary/20 focus:bg-white/[0.05]"
          />
        </div>
        <Button
          onClick={onQuickAdd}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 vader-btn-hover px-5 py-2.5 text-sm font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>
    </header>
  )
}

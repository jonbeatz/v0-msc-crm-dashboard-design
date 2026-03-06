'use client'

import { User as UserIcon, Settings, LogOut, Moon, Sun, BarChart3, FolderOpen, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { User } from '@/lib/crm-data'

interface UserProfileDropdownProps {
  user: User
  onOpenDashboard: () => void
  onToggleTheme?: () => void
}

export function UserProfileDropdown({ user, onOpenDashboard, onToggleTheme }: UserProfileDropdownProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/[0.04] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Avatar className="h-8 w-8 border border-white/[0.1]">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground hidden lg:block max-w-[100px] truncate">
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-xl bg-background/95 backdrop-blur-xl border-white/[0.08] p-2">
        {/* User Header */}
        <div className="flex items-center gap-3 p-3 mb-2">
          <Avatar className="h-12 w-12 border-2 border-primary/30">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className={cn(
              "inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1",
              user.role === 'admin' && "bg-primary/15 text-primary",
              user.role === 'manager' && "bg-accent/15 text-accent",
              user.role === 'editor' && "bg-muted text-muted-foreground"
            )}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 p-2 mb-2 rounded-lg bg-white/[0.02]">
          <div className="text-center p-2">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <FolderOpen className="h-3 w-3" />
              <span className="text-sm font-bold">{user.stats.totalProjects}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Projects</p>
          </div>
          <div className="text-center p-2 border-x border-white/[0.06]">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <UserIcon className="h-3 w-3" />
              <span className="text-sm font-bold">{user.stats.activeClients}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Clients</p>
          </div>
          <div className="text-center p-2">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <CheckCircle className="h-3 w-3" />
              <span className="text-sm font-bold">{user.stats.tasksCompleted}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-white/[0.06]" />

        {/* Menu Items */}
        <DropdownMenuItem
          onClick={onOpenDashboard}
          className="flex items-center gap-3 rounded-lg cursor-pointer py-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">My Dashboard</p>
            <p className="text-[10px] text-muted-foreground">Profile, branding & settings</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onToggleTheme}
          className="flex items-center gap-3 rounded-lg cursor-pointer py-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/40">
            {user.preferences.theme === 'dark' ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-accent" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-[10px] text-muted-foreground">
              Currently: {user.preferences.theme.charAt(0).toUpperCase() + user.preferences.theme.slice(1)}
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onOpenDashboard}
          className="flex items-center gap-3 rounded-lg cursor-pointer py-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/40">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Settings</p>
            <p className="text-[10px] text-muted-foreground">Preferences & notifications</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/[0.06]" />

        <DropdownMenuItem
          className="flex items-center gap-3 rounded-lg cursor-pointer py-2.5 text-destructive focus:text-destructive"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

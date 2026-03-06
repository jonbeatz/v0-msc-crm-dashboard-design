'use client'

import { Search, Plus, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onQuickAdd: () => void
}

export function Header({ searchQuery, onSearchChange, onQuickAdd }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          {/* Minimalist MSC Icon */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-primary/50 bg-background">
            <Film className="h-4 w-4 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/10" />
          </div>
          <h1 className="font-mono text-lg font-bold tracking-wider text-foreground">
            <span className="text-primary vader-glow-text">MSC</span>
            <span className="text-muted-foreground mx-1">//</span>
            <span className="text-muted-foreground text-sm">VADER-01</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 rounded-sm border-border bg-background pl-10 font-mono text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
          />
        </div>
        <Button
          onClick={onQuickAdd}
          className="rounded-sm bg-primary text-primary-foreground hover:bg-primary/80 vader-glow-sm font-mono text-sm font-semibold transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </div>
    </header>
  )
}

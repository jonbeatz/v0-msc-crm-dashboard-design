'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Client } from '@/lib/crm-data'

interface ClientCardProps {
  client: Client
  onClick: () => void
  isRecentlyUpdated?: boolean
}

export function ClientCard({ client, onClick, isRecentlyUpdated }: ClientCardProps) {
  const completedCount = client.completedSteps.filter(Boolean).length

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-sm border border-border bg-card p-3 text-left transition-all duration-200',
        'hover:bg-muted/30 focus:outline-none',
        client.priority === 'high' && 'border-destructive/60 vader-alert-glow',
        isRecentlyUpdated && 'vader-active-border'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground truncate">{client.name}</h3>
            {client.priority === 'high' && (
              <AlertTriangle className="h-3.5 w-3.5 text-destructive animate-pulse flex-shrink-0" />
            )}
          </div>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground truncate">
            {client.projectId}
          </p>
        </div>
      </div>

      {/* Tactical Step Indicator (1-5) */}
      <div className="mt-3 flex items-center gap-1.5">
        {client.completedSteps.map((completed, index) => (
          <div
            key={index}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-sm font-mono text-xs font-bold transition-all duration-200',
              completed
                ? 'bg-primary text-primary-foreground vader-progress-glow'
                : 'bg-muted/50 text-muted-foreground border border-border'
            )}
          >
            {index + 1}
          </div>
        ))}
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {completedCount}/5
        </span>
      </div>
    </button>
  )
}

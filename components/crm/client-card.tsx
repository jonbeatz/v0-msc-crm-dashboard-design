'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CircularProgress } from '@/components/crm/circular-progress'
import type { Client } from '@/lib/crm-data'

interface ClientCardProps {
  client: Client
  onClick: () => void
  isRecentlyUpdated?: boolean
}

export function ClientCard({ client, onClick, isRecentlyUpdated }: ClientCardProps) {
  const completedCount = client.completedSteps.filter(Boolean).length
  const percentage = Math.round((completedCount / 5) * 100)
  const hasOverdueStep = client.priority === 'high' && completedCount < 5

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-sm border border-border bg-card p-3 text-left transition-all duration-200',
        'hover:bg-muted/30 focus:outline-none vader-btn-hover',
        client.priority === 'high' && 'border-destructive/60 vader-alert-glow',
        isRecentlyUpdated && 'vader-active-border'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Circular Progress Gauge */}
        <CircularProgress percentage={percentage} size={44} strokeWidth={3} />

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

          {/* Status Badges */}
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide',
                client.depositPaid
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-destructive/20 text-destructive border border-destructive/30 vader-critical-pulse'
              )}
            >
              {client.depositPaid ? 'Paid' : 'Unpaid'}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide',
                client.consultingCall
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted text-muted-foreground border border-border'
              )}
            >
              {client.consultingCall ? 'Called' : 'No Call'}
            </span>
          </div>
        </div>
      </div>

      {/* Tactical Step Indicator Row */}
      <div className="mt-3 flex items-center gap-1">
        {client.completedSteps.map((completed, index) => (
          <div
            key={index}
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-sm font-mono text-[10px] font-bold transition-all duration-200',
              completed
                ? 'bg-primary text-primary-foreground'
                : hasOverdueStep && index === completedCount
                  ? 'bg-destructive/20 text-destructive border border-destructive/40 vader-critical-pulse'
                  : 'bg-muted/50 text-muted-foreground border border-border'
            )}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </button>
  )
}

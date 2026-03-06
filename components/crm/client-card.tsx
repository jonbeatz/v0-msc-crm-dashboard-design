'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Client } from '@/lib/crm-data'

interface ClientCardProps {
  client: Client
  onClick: () => void
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  const completedCount = client.completedSteps.filter(Boolean).length
  const totalSteps = client.completedSteps.length
  const progressPercent = (completedCount / totalSteps) * 100

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border border-border bg-card p-4 text-left transition-all duration-300',
        'hover:border-primary/50 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary/50',
        client.priority === 'high' && 'border-destructive/50 vader-alert-glow'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{client.name}</h3>
            {client.priority === 'high' && (
              <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {client.projectId}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="font-mono">Progress</span>
          <span className="font-mono">{completedCount}/{totalSteps}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              progressPercent === 100
                ? 'bg-[#00ff88] vader-progress-glow'
                : 'bg-primary vader-progress-glow'
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mt-3 flex gap-1">
        {client.completedSteps.map((completed, index) => (
          <div
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              completed ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
    </button>
  )
}

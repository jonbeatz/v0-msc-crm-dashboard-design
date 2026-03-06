'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CircularProgress } from '@/components/crm/circular-progress'
import type { Client } from '@/lib/crm-data'

interface ClientCardProps {
  client: Client
  onClick: () => void
  isRecentlyUpdated?: boolean
  onStepClick?: (clientId: string, stepIndex: number) => void
  activeStepFilter?: { clientId: string; stepIndex: number } | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ClientCard({ client, onClick, isRecentlyUpdated, onStepClick, activeStepFilter }: ClientCardProps) {
  const completedCount = client.completedSteps.filter(Boolean).length
  const percentage = Math.round((completedCount / 5) * 100)
  const hasOverdueStep = client.priority === 'high' && completedCount < 5

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl glass-card p-4 text-left transition-all duration-300',
        'hover:bg-white/[0.04] focus:outline-none',
        client.priority === 'high' && 'border-destructive/30 vader-alert-glow',
        isRecentlyUpdated && 'vader-active-border breathing-glow'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar with Initials */}
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full avatar-initials">
            <span className="text-sm font-semibold text-primary">
              {getInitials(client.name)}
            </span>
          </div>
          {client.priority === 'high' && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive">
              <AlertTriangle className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-foreground truncate">{client.name}</h3>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/70 truncate">
            {client.projectId}
          </p>

          {/* Status Badges - Softer */}
          <div className="mt-2.5 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium',
                client.depositPaid
                  ? 'bg-primary/15 text-primary'
                  : 'bg-destructive/15 text-destructive'
              )}
            >
              {client.depositPaid ? 'Paid' : 'Unpaid'}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium',
                client.consultingCall
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {client.consultingCall ? 'Called' : 'No Call'}
            </span>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <CircularProgress percentage={percentage} size={48} strokeWidth={5} />
      </div>

      {/* Step Indicator Row - Rounded Pills */}
      <div className="mt-4 flex items-center gap-1.5">
        {client.completedSteps.map((completed, index) => {
          const isActive = activeStepFilter?.clientId === client.id && activeStepFilter?.stepIndex === index
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onStepClick?.(client.id, index)
              }}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-semibold step-btn-interactive',
                completed
                  ? 'bg-primary/20 text-primary'
                  : hasOverdueStep && index === completedCount
                    ? 'bg-destructive/15 text-destructive vader-critical-pulse'
                    : 'bg-muted/40 text-muted-foreground',
                isActive && 'active'
              )}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </button>
  )
}

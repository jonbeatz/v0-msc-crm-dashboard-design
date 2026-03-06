'use client'

import { PIPELINE_STAGES, type Client } from '@/lib/crm-data'
import { ClientCard } from './client-card'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  clients: Client[]
  onClientSelect: (client: Client) => void
  recentlyUpdatedId?: string
  onStepClick?: (clientId: string, stepIndex: number) => void
  activeStepFilter?: { clientId: string; stepIndex: number } | null
}

export function KanbanBoard({ clients, onClientSelect, recentlyUpdatedId, onStepClick, activeStepFilter }: KanbanBoardProps) {
  const getClientsForStage = (stageIndex: number) => {
    return clients.filter((client) => client.currentStep === stageIndex)
  }

  return (
    <div className="flex-1 overflow-x-auto p-4 md:p-6">
      <div className="flex gap-4 md:gap-5 min-w-max">
        {PIPELINE_STAGES.map((stage, index) => {
          const stageClients = getClientsForStage(index)
          
          return (
            <div
              key={stage}
              className="w-64 md:w-72 flex-shrink-0 rounded-2xl glass-card overflow-hidden"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      index === 5
                        ? 'bg-primary breathing-glow'
                        : index === 0
                        ? 'bg-muted-foreground/60'
                        : 'bg-muted-foreground/40'
                    )}
                  />
                  <h2 className="text-sm font-semibold text-foreground">
                    {stage}
                  </h2>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted/50 text-xs font-medium text-muted-foreground">
                  {stageClients.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex flex-col gap-3 p-4 min-h-[200px]">
                {stageClients.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/[0.06]">
                    <p className="text-sm text-muted-foreground">
                      No projects
                    </p>
                  </div>
                ) : (
                  stageClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onClick={() => onClientSelect(client)}
                      isRecentlyUpdated={client.id === recentlyUpdatedId}
                      onStepClick={onStepClick}
                      activeStepFilter={activeStepFilter}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

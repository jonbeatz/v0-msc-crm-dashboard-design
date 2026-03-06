'use client'

import { PIPELINE_STAGES, type Client } from '@/lib/crm-data'
import { ClientCard } from './client-card'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  clients: Client[]
  onClientSelect: (client: Client) => void
  recentlyUpdatedId?: string
}

export function KanbanBoard({ clients, onClientSelect, recentlyUpdatedId }: KanbanBoardProps) {
  const getClientsForStage = (stageIndex: number) => {
    return clients.filter((client) => client.currentStep === stageIndex)
  }

  return (
    <div className="flex-1 overflow-x-auto p-4">
      <div className="flex gap-3 min-w-max">
        {PIPELINE_STAGES.map((stage, index) => {
          const stageClients = getClientsForStage(index)
          
          return (
            <div
              key={stage}
              className="w-64 flex-shrink-0 rounded-sm border border-border bg-card/30"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      index === 5
                        ? 'bg-primary vader-progress-glow'
                        : index === 0
                        ? 'bg-muted-foreground'
                        : 'bg-muted-foreground/60'
                    )}
                  />
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                    {stage}
                  </h2>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-muted font-mono text-xs text-muted-foreground">
                  {stageClients.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex flex-col gap-2 p-2 min-h-[180px]">
                {stageClients.length === 0 ? (
                  <div className="flex h-20 items-center justify-center rounded-sm border border-dashed border-border/50">
                    <p className="font-mono text-xs text-muted-foreground">
                      Empty
                    </p>
                  </div>
                ) : (
                  stageClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onClick={() => onClientSelect(client)}
                      isRecentlyUpdated={client.id === recentlyUpdatedId}
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

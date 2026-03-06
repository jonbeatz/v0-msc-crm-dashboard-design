'use client'

import { PIPELINE_STAGES, type Client } from '@/lib/crm-data'
import { ClientCard } from './client-card'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  clients: Client[]
  onClientSelect: (client: Client) => void
}

export function KanbanBoard({ clients, onClientSelect }: KanbanBoardProps) {
  const getClientsForStage = (stageIndex: number) => {
    return clients.filter((client) => client.currentStep === stageIndex)
  }

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="flex gap-4 min-w-max">
        {PIPELINE_STAGES.map((stage, index) => {
          const stageClients = getClientsForStage(index)
          
          return (
            <div
              key={stage}
              className="w-72 flex-shrink-0 rounded-lg border border-border bg-card/50"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      index === 5
                        ? 'bg-[#00ff88]'
                        : index === 0
                        ? 'bg-muted-foreground'
                        : 'bg-primary'
                    )}
                  />
                  <h2 className="font-mono text-sm font-semibold text-foreground">
                    {stage}
                  </h2>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground">
                  {stageClients.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex flex-col gap-3 p-3 min-h-[200px]">
                {stageClients.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/50">
                    <p className="font-mono text-xs text-muted-foreground">
                      No clients
                    </p>
                  </div>
                ) : (
                  stageClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onClick={() => onClientSelect(client)}
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

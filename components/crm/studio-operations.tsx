'use client'

import { Clock, CheckCircle, AlertTriangle, FolderOpen, HardDrive, Headphones, MessageCircle, Film } from 'lucide-react'

// Mock data for pulse events
const pulseEvents = [
  { id: '1', type: 'success' as const, message: 'Theme Install completed', target: 'Keisha Williams', time: '2m ago' },
  { id: '2', type: 'alert' as const, message: 'Deposit overdue', target: 'Marcus Johnson', time: '15m ago' },
  { id: '3', type: 'success' as const, message: 'Domain configured', target: 'Antwuan Smith', time: '32m ago' },
  { id: '4', type: 'alert' as const, message: 'Project flagged high priority', target: 'Devon Carter', time: '1h ago' },
  { id: '5', type: 'success' as const, message: 'Hosting migration complete', target: 'Tyrone Mitchell', time: '2h ago' },
]

// Mock data for storage
const storageData = [
  { id: '1', client: 'Antwuan Smith', used: 2.4, total: 5, folder: '/antwuansmith' },
  { id: '2', client: 'Keisha Williams', used: 3.8, total: 5, folder: '/keishawilliams' },
  { id: '3', client: 'Jasmine Lee', used: 4.2, total: 5, folder: '/jasminelee' },
  { id: '4', client: 'Tyrone Mitchell', used: 1.1, total: 5, folder: '/tyronemitchell' },
]

// Mock data for support tickets
const supportTickets = [
  { id: '1', subject: 'Login Issue', client: 'Marcus Johnson', status: 'open' as const, time: '10m ago' },
  { id: '2', subject: 'Theme Customization Help', client: 'Keisha Williams', status: 'pending' as const, time: '45m ago' },
  { id: '3', subject: 'Domain Transfer', client: 'Devon Carter', status: 'open' as const, time: '2h ago' },
]

export function StudioOperations() {
  return (
    <section className="border-t border-border bg-card/50 vader-scanline">
      <div className="px-6 py-4">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">
            Studio Operations
          </h2>
          <div className="flex-1 h-px bg-border ml-3" />
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Column 1: Pulse Feed */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Vader Pulse
              </span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {pulseEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2.5 p-2 rounded-sm bg-background border border-border"
                >
                  {/* Pulse Dot */}
                  <div className="mt-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        event.type === 'success' ? 'bg-primary' : 'bg-destructive'
                      }`}
                      style={{
                        boxShadow: event.type === 'success' 
                          ? '0 0 6px rgba(0, 255, 136, 0.6)' 
                          : '0 0 6px rgba(255, 62, 62, 0.6)'
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{event.message}</p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">
                      {event.target}
                    </p>
                    <span className="font-mono text-[9px] text-muted-foreground">{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Storage/Media */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Asset Storage
              </span>
            </div>
            <div className="space-y-2.5">
              {storageData.map((item) => {
                const percentage = (item.used / item.total) * 100
                return (
                  <div key={item.id} className="p-2 rounded-sm bg-background border border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-foreground truncate flex-1">{item.client}</span>
                      <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                        <FolderOpen className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-primary storage-bar-fill rounded-sm"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground mt-1 block">
                      {item.used}GB / {item.total}GB
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Column 3: FluentSupport */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                FluentSupport
              </span>
            </div>
            <div className="space-y-2">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start gap-2.5 p-2 rounded-sm bg-background border border-border"
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-muted">
                    <MessageCircle className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{ticket.subject}</p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">
                      {ticket.client}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm ${
                          ticket.status === 'open'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {ticket.status.toUpperCase()}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">{ticket.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MSC Engine Footer */}
      <div className="border-t border-border py-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Film className="h-3 w-3 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Powered by the
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-primary vader-glow-text">
            MSC Media Engine
          </span>
        </div>
      </div>
    </section>
  )
}

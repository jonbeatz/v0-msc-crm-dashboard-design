'use client'

import { Clock, CheckCircle, FolderOpen, HardDrive, Headphones, MessageCircle, Film } from 'lucide-react'

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
    <section className="mx-6 mb-6">
      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-5">
        {/* Column 1: Pulse Feed */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Activity Pulse
            </span>
          </div>
          <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
            {pulseEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                {/* Soft Glow Dot */}
                <div className="mt-1">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: event.type === 'success' ? '#00ff88' : '#ff5555',
                      boxShadow: event.type === 'success' 
                        ? '0 0 12px rgba(0, 255, 136, 0.5)' 
                        : '0 0 12px rgba(255, 85, 85, 0.5)'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground truncate">{event.target}</span>
                    <span className="text-xs text-muted-foreground/60">{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Storage/Media */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <HardDrive className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Asset Storage
            </span>
          </div>
          <div className="p-4 space-y-3">
            {storageData.map((item) => {
              const percentage = (item.used / item.total) * 100
              return (
                <div key={item.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground truncate flex-1">{item.client}</span>
                    <button className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors">
                      <FolderOpen className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ 
                        width: `${percentage}%`,
                        boxShadow: '0 0 10px rgba(0, 255, 136, 0.4)'
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1.5 block">
                    {item.used}GB / {item.total}GB
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Column 3: FluentSupport */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Headphones className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Support Tickets
            </span>
          </div>
          <div className="p-4 space-y-3">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-muted/30">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {ticket.client}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        ticket.status === 'open'
                          ? 'bg-destructive/15 text-destructive'
                          : 'bg-primary/15 text-primary'
                      }`}
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground/60">{ticket.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MSC Engine Footer - Elegant & Integrated */}
      <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Film className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Powered by
            </span>
            <span className="text-sm font-semibold text-primary vader-glow-text">
              MSC Media Engine
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

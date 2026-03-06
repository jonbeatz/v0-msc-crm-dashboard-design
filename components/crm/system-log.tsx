'use client'

import { Terminal } from 'lucide-react'
import { systemLogs } from '@/lib/crm-data'

export function SystemLog() {
  // Duplicate logs for seamless infinite scroll
  const duplicatedLogs = [...systemLogs, ...systemLogs]

  return (
    <div className="w-full glass-card border-b border-white/[0.04] overflow-hidden">
      <div className="flex items-center h-8">
        {/* Terminal Icon */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-r border-white/[0.04] h-full">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            System
          </span>
        </div>

        {/* Scrolling Log */}
        <div className="flex-1 overflow-hidden">
          <div className="system-log-scroll whitespace-nowrap">
            {duplicatedLogs.map((log, index) => (
              <span
                key={index}
                className="inline-block font-mono text-xs text-primary/70 px-8"
              >
                {log}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

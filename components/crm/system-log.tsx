'use client'

import { Terminal } from 'lucide-react'
import { systemLogs } from '@/lib/crm-data'

export function SystemLog() {
  // Duplicate logs for seamless infinite scroll
  const duplicatedLogs = [...systemLogs, ...systemLogs]

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-border overflow-hidden">
      <div className="flex items-center h-7">
        {/* Terminal Icon */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 border-r border-border h-full bg-[#121212]">
          <Terminal className="h-3 w-3 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            SYS
          </span>
        </div>

        {/* Scrolling Log */}
        <div className="flex-1 overflow-hidden">
          <div className="system-log-scroll whitespace-nowrap">
            {duplicatedLogs.map((log, index) => (
              <span
                key={index}
                className="inline-block font-mono text-[11px] text-primary/80 px-6"
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

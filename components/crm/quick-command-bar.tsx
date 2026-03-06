'use client'

import { useState } from 'react'
import { Terminal, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function QuickCommandBar() {
  const [command, setCommand] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for command handling
    if (command.trim()) {
      console.log('Command submitted:', command)
      setCommand('')
    }
  }

  return (
    <div className="glass-card border-t border-white/[0.06] mt-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-4 px-8 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <Terminal className="h-4 w-4 text-primary" />
        </div>
        <Input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command (e.g., /status)..."
          className="flex-1 border-0 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <span className="text-xs text-muted-foreground">
          Press Enter to run
        </span>
      </form>
    </div>
  )
}

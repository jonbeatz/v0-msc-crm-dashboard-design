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
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm z-50">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-6 py-3">
        <div className="flex items-center gap-2 text-primary">
          <Terminal className="h-4 w-4" />
          <ChevronRight className="h-3 w-3" />
        </div>
        <Input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command (e.g., /status, /add-client, /search)..."
          className="flex-1 border-0 bg-transparent font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          Enter to execute
        </span>
      </form>
    </div>
  )
}

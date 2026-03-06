'use client'

import { useState, useRef, useEffect } from 'react'
import { Terminal, Search, Plus, Calendar, BarChart3, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface QuickCommandBarProps {
  onSearch?: (query: string) => void
  onAddClient?: () => void
  onOpenCalendar?: () => void
  onSwitchView?: (view: 'technical' | 'executive') => void
}

const COMMANDS = [
  { cmd: '/search', desc: 'Search clients', icon: Search },
  { cmd: '/add', desc: 'Add new client', icon: Plus },
  { cmd: '/calendar', desc: 'Open calendar', icon: Calendar },
  { cmd: '/exec', desc: 'Executive view', icon: BarChart3 },
  { cmd: '/help', desc: 'Show commands', icon: HelpCircle },
]

export function QuickCommandBar({ onSearch, onAddClient, onOpenCalendar, onSwitchView }: QuickCommandBarProps) {
  const [command, setCommand] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = command.startsWith('/')
    ? COMMANDS.filter(c => c.cmd.toLowerCase().includes(command.toLowerCase()))
    : []

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = command.trim().toLowerCase()
    
    if (trimmed === '/add' || trimmed === '/new') {
      onAddClient?.()
      setFeedback('Opening add client dialog...')
    } else if (trimmed === '/calendar' || trimmed === '/cal') {
      onOpenCalendar?.()
      setFeedback('Opening calendar...')
    } else if (trimmed === '/exec' || trimmed === '/executive') {
      onSwitchView?.('executive')
      setFeedback('Switched to executive view')
    } else if (trimmed === '/tech' || trimmed === '/technical') {
      onSwitchView?.('technical')
      setFeedback('Switched to technical view')
    } else if (trimmed === '/help') {
      setFeedback('Commands: /search, /add, /calendar, /exec, /tech')
    } else if (trimmed.startsWith('/search ')) {
      const query = command.slice(8).trim()
      onSearch?.(query)
      setFeedback(`Searching for "${query}"...`)
    } else if (trimmed && !trimmed.startsWith('/')) {
      onSearch?.(trimmed)
      setFeedback(`Searching for "${trimmed}"...`)
    }
    
    setCommand('')
    setShowSuggestions(false)
  }

  const handleCommandSelect = (cmd: string) => {
    setCommand(cmd + ' ')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className="glass-card border-t border-white/[0.06] mt-auto relative">
      {/* Command Suggestions */}
      {showSuggestions && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mx-4 md:mx-8 mb-2 glass-card rounded-xl border border-white/[0.08] p-2 space-y-1">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.cmd}
              type="button"
              onClick={() => handleCommandSelect(cmd.cmd)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
            >
              <cmd.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-foreground">{cmd.cmd}</span>
              <span className="text-xs text-muted-foreground">{cmd.desc}</span>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
          <Terminal className="h-4 w-4 text-primary" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => {
            setCommand(e.target.value)
            setShowSuggestions(e.target.value.startsWith('/'))
          }}
          onFocus={() => setShowSuggestions(command.startsWith('/'))}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Type a command or search..."
          className="flex-1 border-0 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {feedback ? (
          <span className="text-xs text-primary font-medium animate-pulse hidden sm:block">{feedback}</span>
        ) : (
          <span className="text-xs text-muted-foreground hidden sm:block">
            Type / for commands
          </span>
        )}
      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { User, Hash, Link2, AlertTriangle, Film } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Client } from '@/lib/crm-data'

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddClient: (client: Client) => void
}

export function AddClientDialog({
  open,
  onOpenChange,
  onAddClient,
}: AddClientDialogProps) {
  const [name, setName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [wpLoginUrl, setWpLoginUrl] = useState('')
  const [highPriority, setHighPriority] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newClient: Client = {
      id: Date.now().toString(),
      name,
      projectId: projectId || `msc_indie_${Date.now().toString().slice(-4)}`,
      currentStep: 0,
      completedSteps: [false, false, false, false, false],
      consultingCall: false,
      depositPaid: false,
      wpLoginUrl,
      loginUser: '',
      password: '',
      priority: highPriority ? 'high' : 'normal',
    }

    onAddClient(newClient)
    setName('')
    setProjectId('')
    setWpLoginUrl('')
    setHighPriority(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-sm border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-foreground">
            <Film className="h-4 w-4 text-primary" />
            New Client
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <User className="h-3 w-3" />
              Client Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client name"
              required
              className="rounded-sm border-border bg-background font-mono text-sm placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="projectId" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <Hash className="h-3 w-3" />
              Project ID
            </Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="msc_indie_XX (auto-generated)"
              className="rounded-sm border-border bg-background font-mono text-sm placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wpLoginUrl" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <Link2 className="h-3 w-3" />
              WP-Login URL
            </Label>
            <Input
              id="wpLoginUrl"
              value={wpLoginUrl}
              onChange={(e) => setWpLoginUrl(e.target.value)}
              placeholder="https://example.com/wp-login.php"
              className="rounded-sm border-border bg-background font-mono text-sm placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-sm border border-border bg-background p-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              <div className="space-y-0">
                <Label htmlFor="priority" className="font-mono text-xs text-foreground">
                  High Priority
                </Label>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Mark as urgent
                </p>
              </div>
            </div>
            <Switch
              id="priority"
              checked={highPriority}
              onCheckedChange={setHighPriority}
              className="data-[state=checked]:bg-destructive"
            />
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-sm border-border font-mono text-xs vader-btn-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-sm bg-primary text-primary-foreground hover:bg-primary/80 vader-btn-hover font-mono text-xs font-semibold"
            >
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

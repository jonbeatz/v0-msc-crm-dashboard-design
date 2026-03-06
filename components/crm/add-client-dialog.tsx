'use client'

import { useState } from 'react'
import { User, Hash, Link2 } from 'lucide-react'
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
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-lg tracking-wide text-foreground">
            <User className="h-5 w-5 text-primary" />
            Quick Add Client
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              Client Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client name"
              required
              className="border-border bg-background font-mono placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId" className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <Hash className="h-3 w-3" />
              Project ID
            </Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="msc_indie_XX (auto-generated if empty)"
              className="border-border bg-background font-mono placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wpLoginUrl" className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <Link2 className="h-3 w-3" />
              WP-Login URL
            </Label>
            <Input
              id="wpLoginUrl"
              value={wpLoginUrl}
              onChange={(e) => setWpLoginUrl(e.target.value)}
              placeholder="https://example.com/wp-login.php"
              className="border-border bg-background font-mono placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <div className="space-y-0.5">
              <Label htmlFor="priority" className="font-mono text-sm text-foreground">
                High Priority
              </Label>
              <p className="font-mono text-xs text-muted-foreground">
                Mark this client as urgent
              </p>
            </div>
            <Switch
              id="priority"
              checked={highPriority}
              onCheckedChange={setHighPriority}
              className="data-[state=checked]:bg-destructive"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 vader-glow-sm font-mono font-semibold"
            >
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

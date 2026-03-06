'use client'

import { useState } from 'react'
import { Folder, FileText } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Project } from '@/lib/crm-data'

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProject: (project: Project) => void
}

export function AddProjectDialog({
  open,
  onOpenChange,
  onAddProject,
}: AddProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'draft'>('active')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      clientCount: 0,
      status,
    }

    onAddProject(newProject)
    setName('')
    setDescription('')
    setStatus('active')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl glass-card border-white/[0.06] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-base font-semibold text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Folder className="h-4 w-4 text-primary" />
            </div>
            New Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Folder className="h-3.5 w-3.5" />
              Project Name
            </Label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
              className="rounded-xl border-white/[0.06] bg-white/[0.03] text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.05]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription" className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Description (optional)
            </Label>
            <Textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this project..."
              rows={3}
              className="rounded-xl border-white/[0.06] bg-white/[0.03] text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.05] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectStatus" className="text-xs text-muted-foreground">
              Status
            </Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'active' | 'draft')}>
              <SelectTrigger className="rounded-xl border-white/[0.06] bg-white/[0.03] text-sm focus:border-primary/40 focus:bg-white/[0.05]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-white/[0.06] text-sm vader-btn-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 vader-btn-hover text-sm font-semibold"
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

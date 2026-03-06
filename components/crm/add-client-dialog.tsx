'use client'

import { useState } from 'react'
import { User, Link2, AlertTriangle, Film, Folder, Plus } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Client, Project } from '@/lib/crm-data'

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddClient: (client: Client) => void
  projects: Project[]
  selectedProjectId: string
  onAddProject: (project: Project) => void
}

export function AddClientDialog({
  open,
  onOpenChange,
  onAddClient,
  projects,
  selectedProjectId,
  onAddProject,
}: AddClientDialogProps) {
  const [name, setName] = useState('')
  const [projectId, setProjectId] = useState(selectedProjectId !== 'all' ? selectedProjectId : '')
  const [wpLoginUrl, setWpLoginUrl] = useState('')
  const [highPriority, setHighPriority] = useState(false)
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  // Update project selection when the dialog opens with a different selected project
  const activeProjects = projects.filter(p => p.status === 'active')

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return
    
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: newProjectName.trim(),
      clientCount: 0,
      status: 'active',
    }
    
    onAddProject(newProject)
    setProjectId(newProject.id)
    setNewProjectName('')
    setShowNewProject(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectId) {
      return // Require a project selection
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name,
      projectId,
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
    setProjectId(selectedProjectId !== 'all' ? selectedProjectId : '')
    setWpLoginUrl('')
    setHighPriority(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl glass-card border-white/[0.06] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-base font-semibold text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Film className="h-4 w-4 text-primary" />
            </div>
            New Client
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Client Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client name"
              required
              className="rounded-xl border-white/[0.06] bg-white/[0.03] text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.05]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Folder className="h-3.5 w-3.5" />
              Project
            </Label>
            {showNewProject ? (
              <div className="flex gap-2">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="New project name..."
                  className="rounded-xl border-white/[0.06] bg-white/[0.03] text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.05]"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-3"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNewProject(false)
                    setNewProjectName('')
                  }}
                  className="rounded-xl border-white/[0.06] px-3"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="rounded-xl border-white/[0.06] bg-white/[0.03] text-sm focus:border-primary/40 focus:bg-white/[0.05]">
                    <SelectValue placeholder="Select a project..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {activeProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNewProject(true)}
                  className="rounded-xl border-white/[0.06] px-3 hover:border-primary/40"
                  title="Create new project"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wpLoginUrl" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="h-3.5 w-3.5" />
              WP-Login URL
            </Label>
            <Input
              id="wpLoginUrl"
              value={wpLoginUrl}
              onChange={(e) => setWpLoginUrl(e.target.value)}
              placeholder="https://example.com/wp-login.php"
              className="rounded-xl border-white/[0.06] bg-white/[0.03] text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.05]"
            />
          </div>

          <div className="flex items-center justify-between glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <Label htmlFor="priority" className="text-sm text-foreground">
                  High Priority
                </Label>
                <p className="text-xs text-muted-foreground">
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
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 vader-btn-hover text-sm font-semibold"
            >
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

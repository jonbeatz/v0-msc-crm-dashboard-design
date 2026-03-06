'use client'

import { useState, useMemo } from 'react'
import { Header, type ViewMode } from '@/components/crm/header'
import { ExecutiveSummary } from '@/components/crm/executive-summary'
import { KanbanBoard } from '@/components/crm/kanban-board'
import { ClientDrawer } from '@/components/crm/client-drawer'
import { ActivityFeed } from '@/components/crm/activity-feed'
import { AddClientDialog } from '@/components/crm/add-client-dialog'
import { StudioOperations } from '@/components/crm/studio-operations'
import { QuickCommandBar } from '@/components/crm/quick-command-bar'
import { StatusBar } from '@/components/crm/status-bar'
import { TacticalActionCenter } from '@/components/crm/tactical-action-center'
import { CalendarModal } from '@/components/crm/calendar-modal'
import { mockClients, mockActivities, mockTasks, mockProjects, type Client, type Task } from '@/lib/crm-data'

export default function CRMDashboard() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [viewMode, setViewMode] = useState<ViewMode>('technical')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | undefined>(undefined)
  const [stepFilter, setStepFilter] = useState<{ clientId: string; stepIndex: number } | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState('all')

  // Filter clients by project
  const projectFilteredClients = useMemo(() => {
    if (selectedProjectId && selectedProjectId !== 'all') {
      return clients.filter(client => client.projectId === selectedProjectId)
    }
    return clients
  }, [clients, selectedProjectId])

  // Filter tasks by project (based on clientId matching filtered clients)
  const projectFilteredTasks = useMemo(() => {
    if (selectedProjectId && selectedProjectId !== 'all') {
      const clientIds = projectFilteredClients.map(c => c.id)
      return tasks.filter(task => clientIds.includes(task.clientId) || task.clientId === '')
    }
    return tasks
  }, [tasks, selectedProjectId, projectFilteredClients])

  const filteredClients = useMemo(() => {
    let filtered = projectFilteredClients
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.projectId.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [projectFilteredClients, searchQuery])

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setDrawerOpen(true)
  }

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    )
    setSelectedClient(updatedClient)
    setRecentlyUpdatedId(updatedClient.id)
  }

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [...prev, newClient])
    setRecentlyUpdatedId(newClient.id)
  }

  const handleStepClick = (clientId: string, stepIndex: number) => {
    // Toggle filter: if same step clicked, clear filter
    if (stepFilter?.clientId === clientId && stepFilter?.stepIndex === stepIndex) {
      setStepFilter(null)
    } else {
      setStepFilter({ clientId, stepIndex })
    }
  }

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  }

  const handleAddTask = (taskName: string) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      name: taskName,
      clientId: '',
      clientName: 'Unassigned',
      stepIndex: 0,
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      assignedToMe: true,
      completed: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Status Bar */}
      <StatusBar 
        totalProjects={mockProjects.length}
        activeProjects={clients.filter(c => c.currentStage !== 'launch').length}
        completedToday={tasks.filter(t => t.completed).length}
        overdueCount={tasks.filter(t => !t.completed && t.dueAt < new Date()).length}
        onFilterActive={() => setSearchQuery('')}
        onFilterCompleted={() => {
          // Could filter to show only completed, for now just focus on tasks
        }}
        onFilterOverdue={() => {
          // Scroll to or highlight overdue tasks
          setCalendarOpen(true)
        }}
        onOpenProjects={() => {
          // The projects dropdown is in the header, this could open a projects modal
          // For now, we'll just log
        }}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAdd={() => setAddDialogOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCalendar={() => setCalendarOpen(true)}
        projects={mockProjects}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
      />

      {viewMode === 'technical' ? (
        <>
          <div className="flex flex-1 overflow-hidden">
            <KanbanBoard
              clients={filteredClients}
              onClientSelect={handleClientSelect}
              recentlyUpdatedId={recentlyUpdatedId}
              onStepClick={handleStepClick}
              activeStepFilter={stepFilter}
            />
          </div>

          {/* Slide-out Activity Feed */}
          <ActivityFeed activities={mockActivities} />

          {/* Tactical Action Center (To-Do HUD) */}
          <TacticalActionCenter
            tasks={tasks}
            selectedStepFilter={stepFilter}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />

          {/* Studio Operations Section */}
          <StudioOperations />

          {/* Quick Command Bar */}
          <QuickCommandBar />
        </>
      ) : (
        <ExecutiveSummary clients={projectFilteredClients} tasks={projectFilteredTasks} />
      )}

      <ClientDrawer
        client={selectedClient}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdateClient={handleUpdateClient}
      />

      <AddClientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddClient={handleAddClient}
        projects={mockProjects}
        selectedProjectId={selectedProjectId}
      />

      <CalendarModal
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        tasks={tasks}
        clients={clients}
        onAddEvent={(event) => {
          const newTask: Task = {
            id: `t${Date.now()}`,
            name: event.name,
            clientId: event.clientId,
            clientName: event.clientName,
            stepIndex: event.stepIndex,
            dueAt: event.dueAt,
            assignedToMe: true,
            completed: false,
            description: event.description,
          }
          setTasks((prev) => [...prev, newTask])
        }}
      />
    </div>
  )
}

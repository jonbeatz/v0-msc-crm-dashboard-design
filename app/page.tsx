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
import { mockClients, mockActivities, mockTasks, type Client, type Task } from '@/lib/crm-data'

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

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients
    
    const query = searchQuery.toLowerCase()
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.projectId.toLowerCase().includes(query)
    )
  }, [clients, searchQuery])

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
        totalProjects={clients.length}
        activeProjects={clients.filter(c => c.currentStage !== 'launch').length}
        completedToday={2}
        overdueCount={tasks.filter(t => !t.completed && t.dueAt < new Date()).length}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAdd={() => setAddDialogOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCalendar={() => setCalendarOpen(true)}
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
        <ExecutiveSummary clients={clients} tasks={tasks} />
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
      />

      <CalendarModal
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        tasks={tasks}
        clients={clients}
      />
    </div>
  )
}

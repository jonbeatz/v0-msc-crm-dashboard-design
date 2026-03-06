'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { AddProjectDialog } from '@/components/crm/add-project-dialog'
import { UserDashboardModal } from '@/components/crm/user-dashboard-modal'
import { useMSCData } from '@/hooks/use-msc-data'
import { mockActivities, mockUser, type Client, type Task, type Project, type User } from '@/lib/crm-data'
import type { MSCClient } from '@/lib/wordpress-types'

/**
 * MSC CRM Dashboard
 * 
 * Data is fetched via useMSCData hook which simulates WordPress REST API.
 * Cursor AI can swap mock data for real axios calls to:
 * - GET /wp-json/wp/v2/msc_clients
 * - GET /wp-json/wp/v2/msc_projects  
 * - GET /wp-json/wp/v2/msc_tasks
 */
export default function CRMDashboard() {
  // WordPress data fetching hook - replace mock with real API
  const {
    clients: mscClients,
    projects,
    tasks,
    isLoading,
    error,
    updateClient: updateMSCClient,
    addClient: addMSCClient,
    updateTask,
    addTask: addMSCTask,
    addProject: addMSCProject,
  } = useMSCData({ autoFetch: true })

  // Convert MSCClient to legacy Client format for existing components
  const clients = useMemo(() => mscClients.map(msc => ({
    id: msc.id,
    name: msc.title,
    projectId: msc.msc_project_id,
    currentStep: msc.currentStep,
    completedSteps: msc.completedSteps,
    consultingCall: msc.msc_consulting_call,
    depositPaid: msc.msc_deposit_status === 'paid',
    wpLoginUrl: msc.msc_wp_login_url,
    loginUser: msc.msc_login_user,
    password: msc.msc_vault_pass,
    priority: msc.msc_priority,
  } as Client)), [mscClients])

  const [user, setUser] = useState<User>(mockUser)
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false)
  const [userDashboardOpen, setUserDashboardOpen] = useState(false)
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
    // Convert back to MSCClient format and update via hook
    const mscClient = mscClients.find(c => c.id === updatedClient.id)
    if (mscClient) {
      updateMSCClient({
        ...mscClient,
        title: updatedClient.name,
        msc_project_id: updatedClient.projectId,
        msc_consulting_call: updatedClient.consultingCall,
        msc_deposit_status: updatedClient.depositPaid ? 'paid' : 'pending',
        msc_wp_login_url: updatedClient.wpLoginUrl,
        msc_login_user: updatedClient.loginUser,
        msc_vault_pass: updatedClient.password,
        msc_priority: updatedClient.priority,
        // Update step statuses based on completedSteps
        msc_step_1_domain: updatedClient.completedSteps[0] ? 'done' : 'pending',
        msc_step_2_hosting: updatedClient.completedSteps[1] ? 'done' : 'pending',
        msc_step_3_collab: updatedClient.completedSteps[2] ? 'done' : 'pending',
        msc_step_4_theme: updatedClient.completedSteps[3] ? 'done' : 'pending',
        msc_step_5_launch: updatedClient.completedSteps[4] ? 'done' : 'pending',
      })
    }
    setSelectedClient(updatedClient)
    setRecentlyUpdatedId(updatedClient.id)
  }

  const handleAddClient = (newClient: Client) => {
    // Convert to MSCClient format and add via hook
    addMSCClient({
      title: newClient.name,
      msc_project_id: newClient.projectId,
      msc_step_1_domain: newClient.completedSteps[0] ? 'done' : 'pending',
      msc_step_2_hosting: newClient.completedSteps[1] ? 'done' : 'pending',
      msc_step_3_collab: newClient.completedSteps[2] ? 'done' : 'pending',
      msc_step_4_theme: newClient.completedSteps[3] ? 'done' : 'pending',
      msc_step_5_launch: newClient.completedSteps[4] ? 'done' : 'pending',
      msc_vault_pass: newClient.password,
      msc_deposit_status: newClient.depositPaid ? 'paid' : 'pending',
      msc_wp_login_url: newClient.wpLoginUrl,
      msc_login_user: newClient.loginUser,
      msc_priority: newClient.priority,
      msc_consulting_call: newClient.consultingCall,
    })
    setRecentlyUpdatedId(newClient.id)
  }

  const handleAddProject = (newProject: Project) => {
    addMSCProject({
      name: newProject.name,
      clientCount: newProject.clientCount,
      status: newProject.status,
    })
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser)
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
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      updateTask({ ...task, completed: !task.completed })
    }
  }

  const handleAddTask = (taskName: string) => {
    addMSCTask({
      name: taskName,
      clientId: '',
      clientName: 'Unassigned',
      stepIndex: 0,
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      assignedToMe: true,
      completed: false,
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading MSC CRM...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-destructive text-4xl">!</div>
          <p className="text-sm text-muted-foreground">Failed to load data</p>
          <p className="text-xs text-muted-foreground/60">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Status Bar */}
      <StatusBar 
        totalProjects={projects.length}
        activeProjects={clients.filter(c => c.currentStep < 5).length}
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
        onOpenProjects={() => setAddProjectDialogOpen(true)}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAdd={() => setAddDialogOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCalendar={() => setCalendarOpen(true)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
        onCreateProject={() => setAddProjectDialogOpen(true)}
        user={user}
        onOpenUserDashboard={() => setUserDashboardOpen(true)}
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
            onViewClient={(clientId) => {
              const client = clients.find(c => c.id === clientId)
              if (client) {
                handleClientSelect(client)
              }
            }}
          />

          {/* Studio Operations Section */}
          <StudioOperations />

          {/* Quick Command Bar */}
          <QuickCommandBar 
            onSearch={setSearchQuery}
            onAddClient={() => setAddDialogOpen(true)}
            onOpenCalendar={() => setCalendarOpen(true)}
            onSwitchView={setViewMode}
          />
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
        projects={projects}
        selectedProjectId={selectedProjectId}
        onAddProject={handleAddProject}
      />

      <AddProjectDialog
        open={addProjectDialogOpen}
        onOpenChange={setAddProjectDialogOpen}
        onAddProject={handleAddProject}
      />

      <UserDashboardModal
        open={userDashboardOpen}
        onOpenChange={setUserDashboardOpen}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

      <CalendarModal
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        tasks={tasks}
        clients={clients}
        onAddEvent={(event) => {
          addMSCTask({
            name: event.name,
            clientId: event.clientId,
            clientName: event.clientName,
            stepIndex: event.stepIndex,
            dueAt: event.dueAt,
            assignedToMe: true,
            completed: false,
            description: event.description,
          })
        }}
      />
    </div>
  )
}

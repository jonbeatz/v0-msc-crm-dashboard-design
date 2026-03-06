/**
 * MSC Data Fetching Hook
 * 
 * This hook simulates fetching from WordPress REST API.
 * Cursor AI can easily swap the mock data for real axios calls:
 * 
 * Replace:
 *   const response = await mockFetch()
 * With:
 *   const response = await axios.get('/wp-json/wp/v2/msc_clients')
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { 
  MSCClient, 
  MSCProject, 
  MSCTask,
  MSCStepStatus,
  WP_API_CONFIG 
} from '@/lib/wordpress-types'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate current step index based on step completion
 * Returns 0-5 (0 = prep/no steps done, 5 = all complete)
 */
export function calculateCurrentStep(client: {
  msc_step_1_domain: MSCStepStatus
  msc_step_2_hosting: MSCStepStatus
  msc_step_3_collab: MSCStepStatus
  msc_step_4_theme: MSCStepStatus
  msc_step_5_launch: MSCStepStatus
}): number {
  const steps = [
    client.msc_step_1_domain,
    client.msc_step_2_hosting,
    client.msc_step_3_collab,
    client.msc_step_4_theme,
    client.msc_step_5_launch,
  ]
  
  // Find the first non-done step
  for (let i = 0; i < steps.length; i++) {
    if (steps[i] !== 'done') {
      return i
    }
  }
  return 5 // All done
}

/**
 * Convert step statuses to boolean array for UI components
 */
export function getCompletedSteps(client: {
  msc_step_1_domain: MSCStepStatus
  msc_step_2_hosting: MSCStepStatus
  msc_step_3_collab: MSCStepStatus
  msc_step_4_theme: MSCStepStatus
  msc_step_5_launch: MSCStepStatus
}): boolean[] {
  return [
    client.msc_step_1_domain === 'done',
    client.msc_step_2_hosting === 'done',
    client.msc_step_3_collab === 'done',
    client.msc_step_4_theme === 'done',
    client.msc_step_5_launch === 'done',
  ]
}

/**
 * Calculate completion percentage for gauge display
 * e.g., 3/5 steps = 60%
 */
export function calculateCompletionPercentage(completedSteps: boolean[]): number {
  const completed = completedSteps.filter(Boolean).length
  return Math.round((completed / 5) * 100)
}

// ============================================
// MOCK DATA (Replace with WordPress REST API)
// ============================================

const MOCK_CLIENTS: MSCClient[] = [
  {
    id: '1',
    title: 'Antwuan Smith',
    msc_step_1_domain: 'done',
    msc_step_2_hosting: 'done',
    msc_step_3_collab: 'done',
    msc_step_4_theme: 'in_progress',
    msc_step_5_launch: 'pending',
    msc_vault_pass: 'eyeDesignZ2024!',
    msc_deposit_status: 'paid',
    msc_wp_login_url: 'https://antwuansmith.com/wp-login.php',
    msc_login_user: 'admin_antwuan',
    msc_priority: 'normal',
    msc_project_id: 'proj_1',
    msc_consulting_call: true,
    currentStep: 3,
    completedSteps: [true, true, true, false, false],
    completionPercentage: 60,
  },
  {
    id: '2',
    title: 'Marcus Johnson',
    msc_step_1_domain: 'done',
    msc_step_2_hosting: 'pending',
    msc_step_3_collab: 'pending',
    msc_step_4_theme: 'pending',
    msc_step_5_launch: 'pending',
    msc_vault_pass: 'eyeDesignZ2024!',
    msc_deposit_status: 'pending',
    msc_wp_login_url: 'https://marcusjohnson.com/wp-login.php',
    msc_login_user: 'admin_marcus',
    msc_priority: 'high',
    msc_project_id: 'proj_1',
    msc_consulting_call: true,
    currentStep: 1,
    completedSteps: [true, false, false, false, false],
    completionPercentage: 20,
  },
  {
    id: '3',
    title: 'Keisha Williams',
    msc_step_1_domain: 'done',
    msc_step_2_hosting: 'done',
    msc_step_3_collab: 'done',
    msc_step_4_theme: 'done',
    msc_step_5_launch: 'in_progress',
    msc_vault_pass: 'eyeDesignZ2024!',
    msc_deposit_status: 'paid',
    msc_wp_login_url: 'https://keishawilliams.com/wp-login.php',
    msc_login_user: 'admin_keisha',
    msc_priority: 'normal',
    msc_project_id: 'proj_1',
    msc_consulting_call: true,
    currentStep: 4,
    completedSteps: [true, true, true, true, false],
    completionPercentage: 80,
  },
  {
    id: '4',
    title: 'Devon Carter',
    msc_step_1_domain: 'pending',
    msc_step_2_hosting: 'pending',
    msc_step_3_collab: 'pending',
    msc_step_4_theme: 'pending',
    msc_step_5_launch: 'pending',
    msc_vault_pass: '',
    msc_deposit_status: 'pending',
    msc_wp_login_url: '',
    msc_login_user: '',
    msc_priority: 'high',
    msc_project_id: 'proj_2',
    msc_consulting_call: false,
    currentStep: 0,
    completedSteps: [false, false, false, false, false],
    completionPercentage: 0,
  },
  {
    id: '5',
    title: 'Jasmine Lee',
    msc_step_1_domain: 'done',
    msc_step_2_hosting: 'done',
    msc_step_3_collab: 'done',
    msc_step_4_theme: 'done',
    msc_step_5_launch: 'done',
    msc_vault_pass: 'eyeDesignZ2024!',
    msc_deposit_status: 'paid',
    msc_wp_login_url: 'https://jasminelee.com/wp-login.php',
    msc_login_user: 'admin_jasmine',
    msc_priority: 'normal',
    msc_project_id: 'proj_2',
    msc_consulting_call: true,
    currentStep: 5,
    completedSteps: [true, true, true, true, true],
    completionPercentage: 100,
  },
  {
    id: '6',
    title: 'Tyrone Mitchell',
    msc_step_1_domain: 'done',
    msc_step_2_hosting: 'done',
    msc_step_3_collab: 'pending',
    msc_step_4_theme: 'pending',
    msc_step_5_launch: 'pending',
    msc_vault_pass: 'eyeDesignZ2024!',
    msc_deposit_status: 'paid',
    msc_wp_login_url: 'https://tyronemitchell.com/wp-login.php',
    msc_login_user: 'admin_tyrone',
    msc_priority: 'normal',
    msc_project_id: 'proj_3',
    msc_consulting_call: true,
    currentStep: 2,
    completedSteps: [true, true, false, false, false],
    completionPercentage: 40,
  },
]

const MOCK_PROJECTS: MSCProject[] = [
  { id: 'proj_1', name: 'MSC Indie Artists', clientCount: 3, status: 'active' },
  { id: 'proj_2', name: 'Label Services', clientCount: 2, status: 'active' },
  { id: 'proj_3', name: 'Distribution Partners', clientCount: 1, status: 'active' },
  { id: 'proj_4', name: 'Legacy Clients', clientCount: 0, status: 'archived' },
]

const MOCK_TASKS: MSCTask[] = [
  {
    id: 't1',
    name: 'Configure Hosting',
    clientId: '1',
    clientName: 'Antwuan Smith',
    stepIndex: 2,
    dueAt: new Date(Date.now() + 1000 * 60 * 120),
    assignedToMe: true,
    completed: false,
  },
  {
    id: 't2',
    name: 'Install Theme',
    clientId: '1',
    clientName: 'Antwuan Smith',
    stepIndex: 3,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    assignedToMe: true,
    completed: false,
  },
  {
    id: 't3',
    name: 'Setup Domain DNS',
    clientId: '2',
    clientName: 'Marcus Johnson',
    stepIndex: 0,
    dueAt: new Date(Date.now() - 1000 * 60 * 30),
    assignedToMe: true,
    completed: false,
  },
  {
    id: 't4',
    name: 'Send Collab Invite',
    clientId: '6',
    clientName: 'Tyrone Mitchell',
    stepIndex: 2,
    dueAt: new Date(Date.now() + 1000 * 60 * 45),
    assignedToMe: false,
    completed: false,
  },
  {
    id: 't5',
    name: 'Enable Coming Soon',
    clientId: '3',
    clientName: 'Keisha Williams',
    stepIndex: 4,
    dueAt: new Date(Date.now() + 1000 * 60 * 180),
    assignedToMe: true,
    completed: false,
  },
]

// ============================================
// DATA FETCHING HOOK
// ============================================

interface UseMSCDataOptions {
  autoFetch?: boolean
  refreshInterval?: number // ms, 0 = no auto refresh
}

interface UseMSCDataReturn {
  // Data
  clients: MSCClient[]
  projects: MSCProject[]
  tasks: MSCTask[]
  
  // Loading states
  isLoading: boolean
  isRefreshing: boolean
  error: Error | null
  
  // Actions
  refetch: () => Promise<void>
  updateClient: (client: MSCClient) => void
  addClient: (client: Omit<MSCClient, 'id' | 'currentStep' | 'completedSteps' | 'completionPercentage'>) => void
  updateTask: (task: MSCTask) => void
  addTask: (task: Omit<MSCTask, 'id'>) => void
  addProject: (project: Omit<MSCProject, 'id'>) => void
}

export function useMSCData(options: UseMSCDataOptions = {}): UseMSCDataReturn {
  const { autoFetch = true, refreshInterval = 0 } = options
  
  const [clients, setClients] = useState<MSCClient[]>([])
  const [projects, setProjects] = useState<MSCProject[]>([])
  const [tasks, setTasks] = useState<MSCTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Fetch all data from WordPress REST API
   * 
   * TODO (Cursor AI): Replace mock fetch with real API calls:
   * 
   * const [clientsRes, projectsRes, tasksRes] = await Promise.all([
   *   axios.get(`${WP_API_CONFIG.baseUrl}${WP_API_CONFIG.endpoints.clients}`),
   *   axios.get(`${WP_API_CONFIG.baseUrl}${WP_API_CONFIG.endpoints.projects}`),
   *   axios.get(`${WP_API_CONFIG.baseUrl}${WP_API_CONFIG.endpoints.tasks}`),
   * ])
   */
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // MOCK FETCH - Replace with real WordPress API call
      // const response = await axios.get('/wp-json/wp/v2/msc_clients')
      // const wpClients = response.data as WPMSCClient[]
      // const normalizedClients = wpClients.map(normalizeWPClient)
      
      setClients(MOCK_CLIENTS)
      setProjects(MOCK_PROJECTS)
      setTasks(MOCK_TASKS)
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [autoFetch, fetchData])

  // Auto refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => fetchData(true), refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, fetchData])

  // Client mutations
  const updateClient = useCallback((updatedClient: MSCClient) => {
    // Recalculate computed fields
    const completedSteps = getCompletedSteps(updatedClient)
    const currentStep = calculateCurrentStep(updatedClient)
    const completionPercentage = calculateCompletionPercentage(completedSteps)
    
    const normalized = {
      ...updatedClient,
      completedSteps,
      currentStep,
      completionPercentage,
    }
    
    setClients(prev => prev.map(c => c.id === normalized.id ? normalized : c))
    
    // TODO (Cursor AI): POST to WordPress
    // await axios.post(`/wp-json/wp/v2/msc_clients/${client.id}`, client)
  }, [])

  const addClient = useCallback((clientData: Omit<MSCClient, 'id' | 'currentStep' | 'completedSteps' | 'completionPercentage'>) => {
    const completedSteps = getCompletedSteps(clientData)
    const currentStep = calculateCurrentStep(clientData)
    const completionPercentage = calculateCompletionPercentage(completedSteps)
    
    const newClient: MSCClient = {
      ...clientData,
      id: `${Date.now()}`, // WordPress will assign real ID
      completedSteps,
      currentStep,
      completionPercentage,
    }
    
    setClients(prev => [...prev, newClient])
    
    // Update project count
    setProjects(prev => prev.map(p => 
      p.id === newClient.msc_project_id 
        ? { ...p, clientCount: p.clientCount + 1 }
        : p
    ))
    
    // TODO (Cursor AI): POST to WordPress
    // await axios.post('/wp-json/wp/v2/msc_clients', newClient)
  }, [])

  // Task mutations
  const updateTask = useCallback((task: MSCTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t))
    // TODO: POST to WordPress
  }, [])

  const addTask = useCallback((taskData: Omit<MSCTask, 'id'>) => {
    const newTask: MSCTask = {
      ...taskData,
      id: `t${Date.now()}`,
    }
    setTasks(prev => [...prev, newTask])
    // TODO: POST to WordPress
  }, [])

  // Project mutations
  const addProject = useCallback((projectData: Omit<MSCProject, 'id'>) => {
    const newProject: MSCProject = {
      ...projectData,
      id: `proj_${Date.now()}`,
    }
    setProjects(prev => [...prev, newProject])
    // TODO: POST to WordPress
  }, [])

  return {
    clients,
    projects,
    tasks,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(true),
    updateClient,
    addClient,
    updateTask,
    addTask,
    addProject,
  }
}

// ============================================
// UTILITY: Normalize WordPress Response
// ============================================

/**
 * Convert WordPress REST API response to normalized MSCClient
 * Use this when swapping mock data for real API calls
 */
export function normalizeWPClient(wpClient: {
  id: number
  title: { rendered: string }
  meta: {
    msc_step_1_domain: MSCStepStatus
    msc_step_2_hosting: MSCStepStatus
    msc_step_3_collab: MSCStepStatus
    msc_step_4_theme: MSCStepStatus
    msc_step_5_launch: MSCStepStatus
    msc_vault_pass: string
    msc_deposit_status: 'paid' | 'pending' | 'partial'
    msc_wp_login_url?: string
    msc_login_user?: string
    msc_priority?: 'normal' | 'high'
    msc_project_id?: string
    msc_consulting_call?: boolean
  }
}): MSCClient {
  const client = {
    id: String(wpClient.id),
    title: wpClient.title.rendered,
    msc_step_1_domain: wpClient.meta.msc_step_1_domain,
    msc_step_2_hosting: wpClient.meta.msc_step_2_hosting,
    msc_step_3_collab: wpClient.meta.msc_step_3_collab,
    msc_step_4_theme: wpClient.meta.msc_step_4_theme,
    msc_step_5_launch: wpClient.meta.msc_step_5_launch,
    msc_vault_pass: wpClient.meta.msc_vault_pass,
    msc_deposit_status: wpClient.meta.msc_deposit_status,
    msc_wp_login_url: wpClient.meta.msc_wp_login_url || '',
    msc_login_user: wpClient.meta.msc_login_user || '',
    msc_priority: wpClient.meta.msc_priority || 'normal',
    msc_project_id: wpClient.meta.msc_project_id || '',
    msc_consulting_call: wpClient.meta.msc_consulting_call || false,
    currentStep: 0,
    completedSteps: [false, false, false, false, false],
    completionPercentage: 0,
  }
  
  // Calculate computed fields
  client.completedSteps = getCompletedSteps(client)
  client.currentStep = calculateCurrentStep(client)
  client.completionPercentage = calculateCompletionPercentage(client.completedSteps)
  
  return client
}

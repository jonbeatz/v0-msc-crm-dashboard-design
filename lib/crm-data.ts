export interface Client {
  id: string
  name: string
  projectId: string
  currentStep: number
  completedSteps: boolean[]
  consultingCall: boolean
  depositPaid: boolean
  wpLoginUrl: string
  loginUser: string
  password: string
  priority: 'normal' | 'high'
}

export interface Activity {
  id: string
  user: string
  action: string
  target: string
  timestamp: Date
}

export interface Task {
  id: string
  name: string
  clientId: string
  clientName: string
  stepIndex: number
  dueAt: Date
  assignedToMe: boolean
  completed: boolean
  description?: string
}

export const PIPELINE_STAGES = [
  'Prep',
  'Step 1: Domain',
  'Step 2: Hosting',
  'Step 3: Collab',
  'Step 4: Theme',
  'Step 5: Launch',
] as const

export const TASK_STEPS = [
  'Domain',
  'Hosting',
  'Invite',
  'Theme',
  'Coming Soon',
] as const

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Antwuan Smith',
    projectId: 'msc_indie_01',
    currentStep: 3,
    completedSteps: [true, true, true, false, false],
    consultingCall: true,
    depositPaid: true,
    wpLoginUrl: 'https://antwuansmith.com/wp-login.php',
    loginUser: 'admin_antwuan',
    password: '••••••••••••',
    priority: 'normal',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    projectId: 'msc_indie_02',
    currentStep: 1,
    completedSteps: [true, false, false, false, false],
    consultingCall: true,
    depositPaid: false,
    wpLoginUrl: 'https://marcusjohnson.com/wp-login.php',
    loginUser: 'admin_marcus',
    password: '••••••••••••',
    priority: 'high',
  },
  {
    id: '3',
    name: 'Keisha Williams',
    projectId: 'msc_indie_03',
    currentStep: 4,
    completedSteps: [true, true, true, true, false],
    consultingCall: true,
    depositPaid: true,
    wpLoginUrl: 'https://keishawilliams.com/wp-login.php',
    loginUser: 'admin_keisha',
    password: '••••••••••••',
    priority: 'normal',
  },
  {
    id: '4',
    name: 'Devon Carter',
    projectId: 'msc_indie_04',
    currentStep: 0,
    completedSteps: [false, false, false, false, false],
    consultingCall: false,
    depositPaid: false,
    wpLoginUrl: '',
    loginUser: '',
    password: '',
    priority: 'high',
  },
  {
    id: '5',
    name: 'Jasmine Lee',
    projectId: 'msc_indie_05',
    currentStep: 5,
    completedSteps: [true, true, true, true, true],
    consultingCall: true,
    depositPaid: true,
    wpLoginUrl: 'https://jasminelee.com/wp-login.php',
    loginUser: 'admin_jasmine',
    password: '••••••••••••',
    priority: 'normal',
  },
  {
    id: '6',
    name: 'Tyrone Mitchell',
    projectId: 'msc_indie_06',
    currentStep: 2,
    completedSteps: [true, true, false, false, false],
    consultingCall: true,
    depositPaid: true,
    wpLoginUrl: 'https://tyronemitchell.com/wp-login.php',
    loginUser: 'admin_tyrone',
    password: '••••••••••••',
    priority: 'normal',
  },
]

export const mockTasks: Task[] = [
  {
    id: 't1',
    name: 'Configure Hosting',
    clientId: '1',
    clientName: 'Antwuan Smith',
    stepIndex: 2,
    dueAt: new Date(Date.now() + 1000 * 60 * 120), // 2h from now
    assignedToMe: true,
    completed: false,
  },
  {
    id: 't2',
    name: 'Install Theme',
    clientId: '1',
    clientName: 'Antwuan Smith',
    stepIndex: 3,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h from now
    assignedToMe: true,
    completed: false,
  },
  {
    id: 't3',
    name: 'Setup Domain DNS',
    clientId: '2',
    clientName: 'Marcus Johnson',
    stepIndex: 0,
    dueAt: new Date(Date.now() - 1000 * 60 * 30), // 30min overdue
    assignedToMe: true,
    completed: false,
  },
  {
    id: 't4',
    name: 'Send Collab Invite',
    clientId: '6',
    clientName: 'Tyrone Mitchell',
    stepIndex: 2,
    dueAt: new Date(Date.now() + 1000 * 60 * 45), // 45min from now
    assignedToMe: false,
    completed: false,
  },
  {
    id: 't5',
    name: 'Enable Coming Soon',
    clientId: '3',
    clientName: 'Keisha Williams',
    stepIndex: 4,
    dueAt: new Date(Date.now() + 1000 * 60 * 180), // 3h from now
    assignedToMe: true,
    completed: false,
  },
  {
    id: 't6',
    name: 'Verify SSL Certificate',
    clientId: '5',
    clientName: 'Jasmine Lee',
    stepIndex: 1,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days from now
    assignedToMe: false,
    completed: true,
  },
]

export const systemLogs: string[] = [
  '[SYS] Hosting node online — latency 12ms',
  '[MSC] Project msc_indie_01 synced to CDN',
  '[SEC] SSL renewal queued for keishawilliams.com',
  '[SYS] Database backup complete — 2.4GB archived',
  '[MSC] FluentCRM automation triggered for lead capture',
  '[NET] DNS propagation verified for antwuansmith.com',
  '[SYS] Storage threshold at 67% capacity',
  '[MSC] Theme update available for flavor starter pack',
]

export const mockActivities: Activity[] = [
  {
    id: '1',
    user: 'Jon',
    action: 'assigned',
    target: "'Theme Install' to Editor",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    user: 'System',
    action: 'confirmed',
    target: 'Deposit for Antwuan Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    user: 'Sarah',
    action: 'completed',
    target: "'Domain Setup' for Keisha Williams",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '4',
    user: 'Jon',
    action: 'moved',
    target: 'Marcus Johnson to Step 1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '5',
    user: 'System',
    action: 'flagged',
    target: 'Devon Carter as high priority',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
]

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

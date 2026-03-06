/**
 * WordPress REST API Types for MSC CRM
 * 
 * These types map directly to the WordPress custom post type 'msc_clients'
 * and its associated ACF/meta fields. Cursor AI can swap the mock fetch
 * for a real axios.get('/wp-json/wp/v2/msc_clients') call.
 */

// WordPress Post Status
export type WPPostStatus = 'publish' | 'draft' | 'pending' | 'private'

// MSC Step Status - matches WordPress meta fields
export type MSCStepStatus = 'pending' | 'in_progress' | 'done'

// Deposit Status
export type MSCDepositStatus = 'paid' | 'pending' | 'partial'

/**
 * MSC Client - WordPress Custom Post Type
 * Endpoint: /wp-json/wp/v2/msc_clients
 */
export interface WPMSCClient {
  // WordPress Core Fields
  id: number                          // WordPress Post ID
  title: {
    rendered: string                  // Client Name
  }
  status: WPPostStatus
  date: string                        // ISO date string
  modified: string                    // ISO date string
  
  // MSC Custom Meta Fields (ACF or custom meta)
  meta: {
    msc_step_1_domain: MSCStepStatus    // Domain setup status
    msc_step_2_hosting: MSCStepStatus   // Hosting setup status
    msc_step_3_collab: MSCStepStatus    // Collaboration/invite status
    msc_step_4_theme: MSCStepStatus     // Theme installation status
    msc_step_5_launch: MSCStepStatus    // Launch/coming soon status
    msc_vault_pass: string              // The 'eyeDesignZ' password
    msc_deposit_status: MSCDepositStatus
    msc_wp_login_url?: string           // Client's WP login URL
    msc_login_user?: string             // Client's WP username
    msc_priority?: 'normal' | 'high'
    msc_project_id?: string             // Associated project
    msc_consulting_call?: boolean
  }
}

/**
 * Normalized Client for internal use
 * Converted from WPMSCClient for easier component consumption
 */
export interface MSCClient {
  id: string                          // Converted from WordPress Post ID
  title: string                       // Client Name (from title.rendered)
  msc_step_1_domain: MSCStepStatus
  msc_step_2_hosting: MSCStepStatus
  msc_step_3_collab: MSCStepStatus
  msc_step_4_theme: MSCStepStatus
  msc_step_5_launch: MSCStepStatus
  msc_vault_pass: string
  msc_deposit_status: MSCDepositStatus
  msc_wp_login_url: string
  msc_login_user: string
  msc_priority: 'normal' | 'high'
  msc_project_id: string
  msc_consulting_call: boolean
  
  // Computed fields (not from WP, calculated client-side)
  currentStep: number                 // 0-5 based on step completion
  completedSteps: boolean[]           // [step1, step2, step3, step4, step5]
  completionPercentage: number        // 0-100, for gauge display
}

/**
 * MSC Project - WordPress Custom Post Type or Taxonomy
 * Endpoint: /wp-json/wp/v2/msc_projects
 */
export interface WPMSCProject {
  id: number
  title: {
    rendered: string
  }
  status: WPPostStatus
  meta: {
    msc_project_status: 'active' | 'archived' | 'draft'
    msc_client_count?: number
  }
}

export interface MSCProject {
  id: string
  name: string
  clientCount: number
  status: 'active' | 'archived' | 'draft'
}

/**
 * MSC Task - WordPress Custom Post Type
 * Endpoint: /wp-json/wp/v2/msc_tasks
 */
export interface WPMSCTask {
  id: number
  title: {
    rendered: string
  }
  status: WPPostStatus
  meta: {
    msc_client_id: number
    msc_client_name: string
    msc_step_index: number
    msc_due_date: string              // ISO date string
    msc_assigned_to_me: boolean
    msc_completed: boolean
    msc_description?: string
  }
}

export interface MSCTask {
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

/**
 * WordPress REST API Response wrapper
 */
export interface WPRESTResponse<T> {
  data: T[]
  headers: {
    'x-wp-total': string
    'x-wp-totalpages': string
  }
}

/**
 * API Configuration
 */
export const WP_API_CONFIG = {
  // Base URL - replace with your WordPress site
  baseUrl: process.env.NEXT_PUBLIC_WP_API_URL || 'https://mystudiochannel.com',
  
  // Endpoints
  endpoints: {
    clients: '/wp-json/wp/v2/msc_clients',
    projects: '/wp-json/wp/v2/msc_projects',
    tasks: '/wp-json/wp/v2/msc_tasks',
    users: '/wp-json/wp/v2/users/me',
  },
  
  // Default headers
  headers: {
    'Content-Type': 'application/json',
  },
}

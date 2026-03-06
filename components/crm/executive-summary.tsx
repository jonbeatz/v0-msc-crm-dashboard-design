'use client'

import { TrendingUp, TrendingDown, Users, FolderOpen, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react'
import { CircularProgress } from '@/components/crm/circular-progress'
import type { Client, Task } from '@/lib/crm-data'

interface ExecutiveSummaryProps {
  clients: Client[]
  tasks: Task[]
}

export function ExecutiveSummary({ clients, tasks }: ExecutiveSummaryProps) {
  // Calculate metrics
  const totalClients = clients.length
  const activeProjects = clients.filter(c => c.currentStage !== 'launch').length
  const completedProjects = clients.filter(c => c.currentStage === 'launch').length
  const highPriority = clients.filter(c => c.priority === 'high').length
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const overdueTasks = tasks.filter(t => !t.completed && t.dueAt < new Date()).length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const depositsCollected = clients.filter(c => c.depositPaid).length
  const depositRate = totalClients > 0 ? Math.round((depositsCollected / totalClients) * 100) : 0

  // Calculate average project progress
  const avgProgress = clients.length > 0 
    ? Math.round(clients.reduce((acc, c) => {
        const completed = c.completedSteps.filter(Boolean).length
        return acc + (completed / 5) * 100
      }, 0) / clients.length)
    : 0

  // Stage distribution
  const stageDistribution = {
    prep: clients.filter(c => c.currentStage === 'prep').length,
    domain: clients.filter(c => c.currentStage === 'domain').length,
    hosting: clients.filter(c => c.currentStage === 'hosting').length,
    collab: clients.filter(c => c.currentStage === 'collab').length,
    theme: clients.filter(c => c.currentStage === 'theme').length,
    launch: clients.filter(c => c.currentStage === 'launch').length,
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Executive Summary</h2>
            <p className="text-sm text-muted-foreground mt-1">High-level overview of studio operations</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm text-foreground font-medium">Just now</p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            icon={Users}
            label="Total Clients"
            value={totalClients}
            trend="+2 this week"
            trendUp={true}
          />
          <MetricCard 
            icon={FolderOpen}
            label="Active Projects"
            value={activeProjects}
            trend={`${completedProjects} completed`}
            trendUp={true}
          />
          <MetricCard 
            icon={CheckCircle}
            label="Task Completion"
            value={`${taskCompletionRate}%`}
            trend={`${completedTasks}/${totalTasks} tasks`}
            trendUp={taskCompletionRate >= 70}
          />
          <MetricCard 
            icon={DollarSign}
            label="Deposit Rate"
            value={`${depositRate}%`}
            trend={`${depositsCollected}/${totalClients} collected`}
            trendUp={depositRate >= 80}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Health */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-foreground mb-6">Project Health</h3>
            <div className="flex items-center justify-center mb-6">
              <CircularProgress percentage={avgProgress} size={120} strokeWidth={10} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
              <p className="text-xs text-muted-foreground mt-1">Average Completion</p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-primary">{activeProjects}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">{completedProjects}</p>
                <p className="text-xs text-muted-foreground">Launched</p>
              </div>
            </div>
          </div>

          {/* Pipeline Distribution */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-foreground mb-6">Pipeline Distribution</h3>
            <div className="space-y-4">
              <PipelineBar label="Prep" value={stageDistribution.prep} max={totalClients} />
              <PipelineBar label="Domain" value={stageDistribution.domain} max={totalClients} />
              <PipelineBar label="Hosting" value={stageDistribution.hosting} max={totalClients} />
              <PipelineBar label="Collab" value={stageDistribution.collab} max={totalClients} />
              <PipelineBar label="Theme" value={stageDistribution.theme} max={totalClients} />
              <PipelineBar label="Launch" value={stageDistribution.launch} max={totalClients} />
            </div>
          </div>

          {/* Alerts & Priorities */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-foreground mb-6">Attention Required</h3>
            <div className="space-y-4">
              {highPriority > 0 && (
                <AlertItem 
                  icon={AlertTriangle}
                  label="High Priority Projects"
                  value={highPriority}
                  color="destructive"
                />
              )}
              {overdueTasks > 0 && (
                <AlertItem 
                  icon={Clock}
                  label="Overdue Tasks"
                  value={overdueTasks}
                  color="destructive"
                />
              )}
              {clients.filter(c => !c.depositPaid).length > 0 && (
                <AlertItem 
                  icon={DollarSign}
                  label="Pending Deposits"
                  value={clients.filter(c => !c.depositPaid).length}
                  color="muted"
                />
              )}
              {highPriority === 0 && overdueTasks === 0 && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">All Clear</p>
                    <p className="text-xs text-muted-foreground">No urgent items</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Completions */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <h4 className="text-xs font-medium text-muted-foreground mb-3">Recent Launches</h4>
              {clients.filter(c => c.currentStage === 'launch').slice(0, 3).map(client => (
                <div key={client.id} className="flex items-center gap-3 py-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{client.name}</span>
                </div>
              ))}
              {completedProjects === 0 && (
                <p className="text-xs text-muted-foreground">No launches yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Client List Summary */}
        <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-foreground mb-4">Client Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Client</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Stage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Progress</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Priority</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Deposit</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => {
                  const progress = Math.round((client.completedSteps.filter(Boolean).length / 5) * 100)
                  return (
                    <tr key={client.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-foreground">{client.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-muted-foreground uppercase">{client.currentStage}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-primary" 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium ${client.priority === 'high' ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {client.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium ${client.depositPaid ? 'text-primary' : 'text-muted-foreground'}`}>
                          {client.depositPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  trendUp 
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  trend: string
  trendUp: boolean
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <div className="flex items-center gap-1 mt-2">
        {trendUp ? (
          <TrendingUp className="h-3 w-3 text-primary" />
        ) : (
          <TrendingDown className="h-3 w-3 text-destructive" />
        )}
        <span className="text-xs text-muted-foreground">{trend}</span>
      </div>
    </div>
  )
}

function PipelineBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = max > 0 ? (value / max) * 100 : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
        <div 
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function AlertItem({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  color: 'destructive' | 'muted'
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl ${
      color === 'destructive' ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/20 border border-white/[0.06]'
    }`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${color === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`} />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className={`text-lg font-bold ${color === 'destructive' ? 'text-destructive' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  )
}

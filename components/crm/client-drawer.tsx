'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  CheckSquare,
  Circle,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  Shield,
  User,
  UserCheck,
  Film,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { CircularProgress } from '@/components/crm/circular-progress'
import { TASK_STEPS, type Client } from '@/lib/crm-data'
import { cn } from '@/lib/utils'

interface ClientDrawerProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateClient: (client: Client) => void
}

// Mock Fluent ecosystem activity
const fluentActivity = [
  { id: 1, type: 'smtp', message: 'Welcome email sent', time: '2h ago' },
  { id: 2, type: 'crm', message: 'Tagged as "Active Client"', time: '1d ago' },
  { id: 3, type: 'boards', message: 'Added to Onboarding board', time: '2d ago' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ClientDrawer({
  client,
  open,
  onOpenChange,
  onUpdateClient,
}: ClientDrawerProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!client) return null

  const completedCount = client.completedSteps.filter(Boolean).length
  const percentage = Math.round((completedCount / 5) * 100)

  const handleTaskToggle = (index: number) => {
    const newCompletedSteps = [...client.completedSteps]
    newCompletedSteps[index] = !newCompletedSteps[index]
    onUpdateClient({ ...client, completedSteps: newCompletedSteps })
  }

  const handleCopyPassword = async () => {
    if (client.password) {
      await navigator.clipboard.writeText(client.password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getFluentIcon = (type: string) => {
    switch (type) {
      case 'smtp':
        return <Mail className="h-3.5 w-3.5 text-primary" />
      case 'crm':
        return <UserCheck className="h-3.5 w-3.5 text-primary" />
      case 'boards':
        return <CheckSquare className="h-3.5 w-3.5 text-primary" />
      default:
        return null
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full glass-card rounded-l-3xl border-l border-white/[0.06] sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="border-b border-white/[0.06] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <SheetTitle className="text-sm font-medium text-muted-foreground">
              Client Profile
            </SheetTitle>
          </div>
          <div className="mt-5 flex items-start gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl avatar-initials">
                <span className="text-xl font-semibold text-primary">
                  {getInitials(client.name)}
                </span>
              </div>
              {client.priority === 'high' && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive">
                  <span className="text-[10px] text-white font-bold">!</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">{client.name}</h2>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                {client.projectId}
              </p>
              {/* Status Badges */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium',
                    client.depositPaid
                      ? 'bg-primary/15 text-primary'
                      : 'bg-destructive/15 text-destructive'
                  )}
                >
                  {client.depositPaid ? 'Paid' : 'Unpaid'}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium',
                    client.consultingCall
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted/50 text-muted-foreground'
                  )}
                >
                  {client.consultingCall ? 'Called' : 'No Call'}
                </span>
              </div>
            </div>
            <CircularProgress percentage={percentage} size={56} strokeWidth={5} />
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {/* Fluent Ecosystem Activity Feed */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Mail className="h-4 w-4" />
              Communication Feed
            </h3>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-5 border-b border-white/[0.04] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">SMTP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">CRM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Boards</span>
                </div>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {fluentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 px-4 py-3">
                    {getFluentIcon(activity.type)}
                    <span className="flex-1 text-sm text-foreground">
                      {activity.message}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Financials Section */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              Financials
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Consulting Call</span>
                </div>
                <Badge
                  className={cn(
                    'rounded-full px-3',
                    client.consultingCall
                      ? 'bg-primary/15 text-primary hover:bg-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted/60'
                  )}
                >
                  {client.consultingCall ? 'Done' : 'Pending'}
                </Badge>
              </div>
              <div className="flex items-center justify-between glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Deposit</span>
                </div>
                <Badge
                  className={cn(
                    'rounded-full px-3',
                    client.depositPaid
                      ? 'bg-primary/15 text-primary hover:bg-primary/20'
                      : 'bg-destructive/15 text-destructive hover:bg-destructive/20'
                  )}
                >
                  {client.depositPaid ? 'Paid' : 'Unpaid'}
                </Badge>
              </div>
            </div>
          </section>

          {/* The Vault Section */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Key className="h-4 w-4" />
              The Vault
            </h3>
            <div className="glass-card rounded-2xl overflow-hidden border border-primary/20">
              {/* Secure Header */}
              <div className="flex items-center justify-between border-b border-white/[0.04] bg-primary/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary breathing-glow" />
                  <span className="text-xs text-primary">
                    Secure Access
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  AES-256
                </span>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Username
                  </label>
                  <div className="rounded-xl bg-muted/30 px-4 py-3 text-sm text-foreground font-mono">
                    {client.loginUser || '—'}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Key className="h-3.5 w-3.5" />
                    Password
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-xl bg-muted/30 px-4 py-3 text-sm font-mono tracking-widest">
                      {client.password
                        ? showPassword
                          ? client.password
                          : '••••••••••••'
                        : '—'}
                    </div>
                    {client.password && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopyPassword}
                          className={cn(
                            'h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10',
                            copied && 'text-primary'
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <Button
                  disabled={!client.wpLoginUrl}
                  className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 vader-btn-hover py-3 text-sm font-semibold disabled:opacity-40"
                  onClick={() => client.wpLoginUrl && window.open(client.wpLoginUrl, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Launch Site
                </Button>
              </div>
            </div>
          </section>

          {/* Task List Section */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Film className="h-4 w-4" />
              Production Tasks
            </h3>
            <div className="space-y-2">
              {TASK_STEPS.map((step, index) => {
                const isOverdue = client.priority === 'high' && !client.completedSteps[index] && index <= completedCount
                return (
                  <div
                    key={step}
                    className={cn(
                      'flex items-center gap-4 glass-card rounded-xl p-4 transition-all duration-200',
                      client.completedSteps[index] && 'bg-primary/5 border border-primary/10',
                      isOverdue && 'bg-destructive/5 border border-destructive/20'
                    )}
                  >
                    <Checkbox
                      id={`task-${index}`}
                      checked={client.completedSteps[index]}
                      onCheckedChange={() => handleTaskToggle(index)}
                      className="rounded-lg border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className={cn(
                      'text-xs w-5 font-medium',
                      isOverdue ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      {index + 1}.
                    </span>
                    <label
                      htmlFor={`task-${index}`}
                      className={cn(
                        'flex-1 cursor-pointer text-sm transition-all',
                        client.completedSteps[index]
                          ? 'text-primary'
                          : isOverdue
                            ? 'text-destructive'
                            : 'text-foreground'
                      )}
                    >
                      {step}
                    </label>
                    {client.completedSteps[index] ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : isOverdue ? (
                      <Circle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30" />
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.04] pt-5 mt-auto">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
              <Film className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">
              Powered by{' '}
              <span className="text-primary font-medium">MSC Media Engine</span>
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

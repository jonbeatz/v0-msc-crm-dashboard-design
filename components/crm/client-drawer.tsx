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
        return <Mail className="h-3 w-3 text-primary" />
      case 'crm':
        return <UserCheck className="h-3 w-3 text-primary" />
      case 'boards':
        return <CheckSquare className="h-3 w-3 text-primary" />
      default:
        return null
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full rounded-l-none border-l border-border bg-card sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <SheetTitle className="font-mono text-sm uppercase tracking-widest text-foreground">
              Clean Record
            </SheetTitle>
          </div>
          <div className="mt-3 flex items-start gap-4">
            <CircularProgress percentage={percentage} size={56} strokeWidth={4} />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">{client.name}</h2>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                {client.projectId}
              </p>
              {/* Tactical Status Badges */}
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  className={cn(
                    'font-mono text-[10px] rounded-sm px-2 py-0.5',
                    client.depositPaid
                      ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                      : 'bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 vader-critical-pulse'
                  )}
                >
                  {client.depositPaid ? 'DEPOSIT PAID' : 'UNPAID'}
                </Badge>
                <Badge
                  className={cn(
                    'font-mono text-[10px] rounded-sm px-2 py-0.5',
                    client.consultingCall
                      ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                      : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                  )}
                >
                  {client.consultingCall ? 'CALL DONE' : 'NO CALL'}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5 py-5">
          {/* Fluent Ecosystem Activity Feed */}
          <section>
            <h3 className="mb-2.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              Communication Feed
            </h3>
            <div className="rounded-sm border border-border bg-background overflow-hidden">
              <div className="flex items-center gap-4 border-b border-border px-3 py-2 bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">SMTP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">CRM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">Boards</span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {fluentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 px-3 py-2">
                    {getFluentIcon(activity.type)}
                    <span className="flex-1 font-mono text-xs text-foreground">
                      {activity.message}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Financials Section */}
          <section>
            <h3 className="mb-2.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              Financials
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-sm border border-border bg-background p-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">Consulting Call</span>
                </div>
                <Badge
                  variant={client.consultingCall ? 'default' : 'outline'}
                  className={cn(
                    'font-mono text-[10px] rounded-sm px-2 py-0',
                    client.consultingCall
                      ? 'bg-primary text-primary-foreground'
                      : 'border-muted-foreground/50 text-muted-foreground'
                  )}
                >
                  {client.consultingCall ? 'DONE' : 'PENDING'}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-sm border border-border bg-background p-2.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">Deposit Paid</span>
                </div>
                <Badge
                  variant={client.depositPaid ? 'default' : 'destructive'}
                  className={cn(
                    'font-mono text-[10px] rounded-sm px-2 py-0',
                    client.depositPaid
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-destructive text-destructive-foreground vader-critical-pulse'
                  )}
                >
                  {client.depositPaid ? 'PAID' : 'UNPAID'}
                </Badge>
              </div>
            </div>
          </section>

          {/* The Vault Section - Secure Terminal Look */}
          <section>
            <h3 className="mb-2.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Key className="h-3.5 w-3.5" />
              The Vault
            </h3>
            <div className="rounded-sm border border-primary/30 bg-[#0d0d0d] overflow-hidden">
              {/* Secure Terminal Header */}
              <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                    Secure Terminal
                  </span>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">
                  AES-256
                </span>
              </div>
              
              <div className="p-3 space-y-3 font-mono">
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary/70">
                    <User className="h-3 w-3" />
                    User
                  </label>
                  <div className="rounded-none border border-border/50 bg-[#0a0a0a] px-3 py-2 text-sm text-primary tracking-wide">
                    {client.loginUser || '—'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary/70">
                    <Key className="h-3 w-3" />
                    Pass
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 rounded-none border border-border/50 bg-[#0a0a0a] px-3 py-2 text-sm text-primary tracking-[0.3em]">
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
                          className="h-9 w-9 rounded-none text-primary/50 hover:text-primary hover:bg-primary/10 vader-btn-hover"
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
                            'h-9 w-9 rounded-none text-primary/50 hover:text-primary hover:bg-primary/10 vader-btn-hover',
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
                  className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/80 vader-btn-hover font-mono text-xs font-semibold disabled:opacity-40 mt-2"
                  onClick={() => client.wpLoginUrl && window.open(client.wpLoginUrl, '_blank')}
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  Launch Site
                </Button>
              </div>
            </div>
          </section>

          {/* Task List Section */}
          <section>
            <h3 className="mb-2.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Film className="h-3.5 w-3.5" />
              Production Tasks
            </h3>
            <div className="space-y-1.5">
              {TASK_STEPS.map((step, index) => {
                const isOverdue = client.priority === 'high' && !client.completedSteps[index] && index <= completedCount
                return (
                  <div
                    key={step}
                    className={cn(
                      'flex items-center gap-3 rounded-sm border border-border bg-background p-2.5 transition-all duration-200',
                      client.completedSteps[index] && 'border-primary/30 bg-primary/5',
                      isOverdue && 'border-destructive/50 bg-destructive/5 vader-critical-pulse'
                    )}
                  >
                    <Checkbox
                      id={`task-${index}`}
                      checked={client.completedSteps[index]}
                      onCheckedChange={() => handleTaskToggle(index)}
                      className="rounded-sm border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className={cn(
                      'font-mono text-xs w-5',
                      isOverdue ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      {index + 1}.
                    </span>
                    <label
                      htmlFor={`task-${index}`}
                      className={cn(
                        'flex-1 cursor-pointer font-mono text-xs transition-all',
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
                      <Circle className="h-4 w-4 text-destructive animate-pulse" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-4 mt-auto">
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Powered by the{' '}
            <span className="text-primary font-semibold">MSC Media Engine</span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

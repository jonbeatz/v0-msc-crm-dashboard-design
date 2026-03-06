'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Phone,
  Shield,
  User,
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
import { TASK_STEPS, type Client } from '@/lib/crm-data'
import { cn } from '@/lib/utils'

interface ClientDrawerProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateClient: (client: Client) => void
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
          <div className="mt-3">
            <h2 className="text-xl font-semibold text-foreground">{client.name}</h2>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {client.projectId}
            </p>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5 py-5">
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
                      ? 'bg-primary text-primary-foreground vader-glow-sm'
                      : 'bg-destructive text-destructive-foreground vader-alert-glow'
                  )}
                >
                  {client.depositPaid ? 'PAID' : 'UNPAID'}
                </Badge>
              </div>
            </div>
          </section>

          {/* The Vault Section - Encrypted Data Block Look */}
          <section>
            <h3 className="mb-2.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Key className="h-3.5 w-3.5" />
              The Vault
            </h3>
            <div className="rounded-sm border border-primary/30 bg-background overflow-hidden">
              {/* Encrypted Header Bar */}
              <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                  Encrypted Access
                </span>
              </div>
              
              <div className="p-3 space-y-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <User className="h-3 w-3" />
                    Login User
                  </label>
                  <div className="rounded-sm border border-border bg-muted/30 px-3 py-2 font-mono text-sm text-foreground tracking-wide">
                    {client.loginUser || '—'}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Key className="h-3 w-3" />
                    Password
                  </label>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 rounded-sm border border-border bg-muted/30 px-3 py-2 font-mono text-sm text-foreground tracking-widest">
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
                          className="h-9 w-9 rounded-sm text-muted-foreground hover:text-primary hover:bg-primary/10"
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
                            'h-9 w-9 rounded-sm text-muted-foreground hover:text-primary hover:bg-primary/10',
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
                  className="w-full rounded-sm bg-primary text-primary-foreground hover:bg-primary/80 vader-glow-sm font-mono text-xs font-semibold disabled:opacity-40 mt-2"
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
              {TASK_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    'flex items-center gap-3 rounded-sm border border-border bg-background p-2.5 transition-all duration-200',
                    client.completedSteps[index] && 'border-primary/30 bg-primary/5'
                  )}
                >
                  <Checkbox
                    id={`task-${index}`}
                    checked={client.completedSteps[index]}
                    onCheckedChange={() => handleTaskToggle(index)}
                    className="rounded-sm border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="font-mono text-xs text-muted-foreground w-5">
                    {index + 1}.
                  </span>
                  <label
                    htmlFor={`task-${index}`}
                    className={cn(
                      'flex-1 cursor-pointer font-mono text-xs transition-all',
                      client.completedSteps[index]
                        ? 'text-primary'
                        : 'text-foreground'
                    )}
                  >
                    {step}
                  </label>
                  {client.completedSteps[index] ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </div>
              ))}
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

'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  Phone,
  Shield,
  User,
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

  if (!client) return null

  const handleTaskToggle = (index: number) => {
    const newCompletedSteps = [...client.completedSteps]
    newCompletedSteps[index] = !newCompletedSteps[index]
    onUpdateClient({ ...client, completedSteps: newCompletedSteps })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-border bg-card sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <SheetTitle className="font-mono text-lg tracking-wide text-foreground">
              CLEAN RECORD
            </SheetTitle>
          </div>
          <div className="mt-2">
            <h2 className="text-xl font-semibold text-foreground">{client.name}</h2>
            <p className="font-mono text-sm text-muted-foreground">
              {client.projectId}
            </p>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {/* Financials Section */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              Financials
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">Consulting Call</span>
                </div>
                <Badge
                  variant={client.consultingCall ? 'default' : 'outline'}
                  className={cn(
                    'font-mono text-xs',
                    client.consultingCall
                      ? 'bg-primary text-primary-foreground vader-glow-sm'
                      : 'border-muted-foreground text-muted-foreground'
                  )}
                >
                  {client.consultingCall ? 'COMPLETE' : 'PENDING'}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">Deposit Paid</span>
                </div>
                <Badge
                  variant={client.depositPaid ? 'default' : 'destructive'}
                  className={cn(
                    'font-mono text-xs',
                    client.depositPaid
                      ? 'bg-[#00ff88] text-background'
                      : 'bg-destructive text-destructive-foreground vader-alert-glow'
                  )}
                >
                  {client.depositPaid ? 'PAID' : 'UNPAID'}
                </Badge>
              </div>
            </div>
          </section>

          {/* The Vault Section */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Lock className="h-4 w-4" />
              The Vault
            </h3>
            <div className="space-y-3 rounded-lg border border-primary/30 bg-background p-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  Login User
                </label>
                <div className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
                  {client.loginUser || '—'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
                    {client.password
                      ? showPassword
                        ? client.password
                        : '••••••••••••'
                      : '—'}
                  </div>
                  {client.password && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-9 w-9 text-muted-foreground hover:text-primary"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <Button
                disabled={!client.wpLoginUrl}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 vader-glow-sm font-mono text-sm font-semibold disabled:opacity-50"
                onClick={() => client.wpLoginUrl && window.open(client.wpLoginUrl, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Launch Site
              </Button>
            </div>
          </section>

          {/* Task List Section */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Task List
            </h3>
            <div className="space-y-2">
              {TASK_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition-all duration-200',
                    client.completedSteps[index] && 'border-primary/30 bg-primary/5'
                  )}
                >
                  <Checkbox
                    id={`task-${index}`}
                    checked={client.completedSteps[index]}
                    onCheckedChange={() => handleTaskToggle(index)}
                    className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`task-${index}`}
                    className={cn(
                      'flex-1 cursor-pointer font-mono text-sm transition-all',
                      client.completedSteps[index]
                        ? 'text-primary line-through'
                        : 'text-foreground'
                    )}
                  >
                    {step}
                  </label>
                  {client.completedSteps[index] ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-4 mt-auto">
          <p className="text-center font-mono text-xs text-muted-foreground">
            Powered by the{' '}
            <span className="text-primary">MSC Media Engine</span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { useState } from 'react'
import { 
  X, User, Palette, Bell, BarChart3, Camera, Upload, 
  Mail, Building2, Check, Moon, Sun, Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { User as UserType } from '@/lib/crm-data'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface UserDashboardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserType
  onUpdateUser: (user: UserType) => void
}

type TabId = 'profile' | 'branding' | 'preferences' | 'activity'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'preferences', label: 'Preferences', icon: Bell },
  { id: 'activity', label: 'Activity', icon: BarChart3 },
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function UserDashboardModal({ open, onOpenChange, user, onUpdateUser }: UserDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    avatar: user.avatar || '',
    companyName: user.branding.companyName,
    logo: user.branding.logo || '',
    primaryColor: user.branding.primaryColor,
    accentColor: user.branding.accentColor,
    theme: user.preferences.theme,
    emailNotifications: user.preferences.emailNotifications,
    desktopNotifications: user.preferences.desktopNotifications,
    weeklyDigest: user.preferences.weeklyDigest,
    defaultView: user.preferences.defaultView,
  })

  const initials = formData.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const chartData = user.stats.tasksCompletedThisWeek.map((count, index) => ({
    day: WEEKDAYS[index],
    tasks: count,
  }))

  // Use computed colors instead of CSS variables
  const primaryColor = '#00ff88'
  const accentColor = '#ffaa00'

  const handleSave = () => {
    const updatedUser: UserType = {
      ...user,
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      avatar: formData.avatar,
      branding: {
        companyName: formData.companyName,
        logo: formData.logo,
        primaryColor: formData.primaryColor,
        accentColor: formData.accentColor,
      },
      preferences: {
        theme: formData.theme,
        emailNotifications: formData.emailNotifications,
        desktopNotifications: formData.desktopNotifications,
        weeklyDigest: formData.weeklyDigest,
        defaultView: formData.defaultView,
      },
    }
    onUpdateUser(updatedUser)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl glass-card border border-white/[0.08] shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-semibold text-foreground">My Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your profile, branding, and preferences</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 mx-6 mt-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary/30">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Avatar URL</Label>
                  <Input
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="rounded-xl border-white/[0.08] bg-white/[0.03]"
                  />
                  <p className="text-xs text-muted-foreground">Enter a URL for your profile picture</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-white/[0.08] bg-white/[0.03]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-white/[0.08] bg-white/[0.03]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs text-muted-foreground">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="rounded-xl border-white/[0.08] bg-white/[0.03] resize-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Account Role</p>
                    <p className="text-xs text-muted-foreground">Your current access level</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-sm font-medium">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              {/* Logo Section */}
              <div className="flex items-center gap-6">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="h-16 w-16 object-contain" />
                  ) : (
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  )}
                  <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Logo URL</Label>
                  <Input
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="rounded-xl border-white/[0.08] bg-white/[0.03]"
                  />
                  <p className="text-xs text-muted-foreground">Enter a URL for your company logo</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="rounded-xl border-white/[0.08] bg-white/[0.03]"
                />
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="h-10 w-10 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 rounded-xl border-white/[0.08] bg-white/[0.03] font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="h-10 w-10 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                    />
                    <Input
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="flex-1 rounded-xl border-white/[0.08] bg-white/[0.03] font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-xs text-muted-foreground mb-3">Preview</p>
                <div className="flex items-center gap-4">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: formData.primaryColor + '20' }}
                  >
                    <Building2 className="h-6 w-6" style={{ color: formData.primaryColor }} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold" style={{ color: formData.primaryColor }}>
                      {formData.companyName || 'Your Company'}
                    </p>
                    <p className="text-sm" style={{ color: formData.accentColor }}>
                      Accent text preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'system', label: 'System', icon: Monitor },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setFormData({ ...formData, theme: theme.id as 'dark' | 'light' | 'system' })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                        formData.theme === theme.id
                          ? "border-primary bg-primary/10"
                          : "border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]"
                      )}
                    >
                      <theme.icon className={cn(
                        "h-6 w-6",
                        formData.theme === theme.id ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        formData.theme === theme.id ? "text-primary" : "text-foreground"
                      )}>
                        {theme.label}
                      </span>
                      {formData.theme === theme.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default View */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">Default Dashboard View</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'technical', label: 'Technical', desc: 'Kanban board with task details' },
                    { id: 'executive', label: 'Executive', desc: 'Charts and summary metrics' },
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setFormData({ ...formData, defaultView: view.id as 'technical' | 'executive' })}
                      className={cn(
                        "flex flex-col items-start p-4 rounded-xl border transition-all text-left",
                        formData.defaultView === view.id
                          ? "border-primary bg-primary/10"
                          : "border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        formData.defaultView === view.id ? "text-primary" : "text-foreground"
                      )}>
                        {view.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">{view.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <Label className="text-xs text-muted-foreground">Notifications</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-sm font-medium text-foreground">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-sm font-medium text-foreground">Desktop Notifications</p>
                      <p className="text-xs text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={formData.desktopNotifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, desktopNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-sm font-medium text-foreground">Weekly Digest</p>
                      <p className="text-xs text-muted-foreground">Summary of your week's activity</p>
                    </div>
                    <Switch
                      checked={formData.weeklyDigest}
                      onCheckedChange={(checked) => setFormData({ ...formData, weeklyDigest: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-2xl font-bold text-primary">{user.stats.totalProjects}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Projects</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-2xl font-bold text-accent">{user.stats.activeClients}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active Clients</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-2xl font-bold text-primary">{user.stats.tasksCompleted}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats.tasksCompletedThisWeek.reduce((a, b) => a + b, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">This Week</p>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Tasks Completed This Week</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Daily breakdown of completed tasks</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs text-primary font-medium">
                      {user.stats.tasksCompletedThisWeek.reduce((a, b) => a + b, 0)} total
                    </span>
                  </div>
                </div>
                
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barCategoryGap="20%">
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#71717a', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: primaryColor }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === new Date().getDay() ? primaryColor : `${primaryColor}60`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity Summary */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h3 className="text-sm font-semibold text-foreground mb-3">Performance Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. tasks per day</span>
                    <span className="text-sm font-medium text-foreground">
                      {(user.stats.tasksCompletedThisWeek.reduce((a, b) => a + b, 0) / 7).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best day this week</span>
                    <span className="text-sm font-medium text-primary">
                      {WEEKDAYS[user.stats.tasksCompletedThisWeek.indexOf(Math.max(...user.stats.tasksCompletedThisWeek))]}
                      {' '}({Math.max(...user.stats.tasksCompletedThisWeek)} tasks)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Clients per project</span>
                    <span className="text-sm font-medium text-foreground">
                      {(user.stats.activeClients / user.stats.totalProjects).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/[0.06]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

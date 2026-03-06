'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/crm/header'
import { KanbanBoard } from '@/components/crm/kanban-board'
import { ClientDrawer } from '@/components/crm/client-drawer'
import { ActivityFeed } from '@/components/crm/activity-feed'
import { AddClientDialog } from '@/components/crm/add-client-dialog'
import { StudioOperations } from '@/components/crm/studio-operations'
import { QuickCommandBar } from '@/components/crm/quick-command-bar'
import { mockClients, mockActivities, type Client } from '@/lib/crm-data'

export default function CRMDashboard() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | undefined>(undefined)

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients
    
    const query = searchQuery.toLowerCase()
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.projectId.toLowerCase().includes(query)
    )
  }, [clients, searchQuery])

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setDrawerOpen(true)
  }

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    )
    setSelectedClient(updatedClient)
    setRecentlyUpdatedId(updatedClient.id)
  }

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [...prev, newClient])
    setRecentlyUpdatedId(newClient.id)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-14">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAdd={() => setAddDialogOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <KanbanBoard
          clients={filteredClients}
          onClientSelect={handleClientSelect}
          recentlyUpdatedId={recentlyUpdatedId}
        />
        <ActivityFeed activities={mockActivities} />
      </div>

      {/* Studio Operations Section */}
      <StudioOperations />

      {/* Quick Command Bar */}
      <QuickCommandBar />

      <ClientDrawer
        client={selectedClient}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdateClient={handleUpdateClient}
      />

      <AddClientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddClient={handleAddClient}
      />
    </div>
  )
}

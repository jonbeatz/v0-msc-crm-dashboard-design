'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/crm/header'
import { KanbanBoard } from '@/components/crm/kanban-board'
import { ClientDrawer } from '@/components/crm/client-drawer'
import { ActivityFeed } from '@/components/crm/activity-feed'
import { AddClientDialog } from '@/components/crm/add-client-dialog'
import { mockClients, mockActivities, type Client } from '@/lib/crm-data'

export default function CRMDashboard() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
  }

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [...prev, newClient])
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAdd={() => setAddDialogOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <KanbanBoard
          clients={filteredClients}
          onClientSelect={handleClientSelect}
        />
        <ActivityFeed activities={mockActivities} />
      </div>

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

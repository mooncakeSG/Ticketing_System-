'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { TicketCard } from '@/components/TicketCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ticketApi, Ticket } from '@/lib/api'
import { Plus, Ticket as TicketIcon, Clock, CheckCircle, AlertCircle, TrendingUp, FileText, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const data = await ticketApi.getTickets()
        setTickets(data)
      } catch (err) {
        setError('Failed to load tickets')
        console.error('Error fetching tickets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const openTickets = tickets.filter(ticket => ticket.status === 'needs_support' || ticket.status === 'in_progress')
  const closedTickets = tickets.filter(ticket => ticket.status === 'resolved' || ticket.status === 'closed')
  const highPriorityTickets = tickets.filter(ticket => ticket.priority === 'high')

  const stats = [
    {
      title: 'Total Tickets',
      value: tickets.length,
      icon: TicketIcon,
      color: 'text-blue-500',
    },
    {
      title: 'Open Tickets',
      value: openTickets.length,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Closed Tickets',
      value: closedTickets.length,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'High Priority',
      value: highPriorityTickets.length,
      icon: AlertCircle,
      color: 'text-red-500',
    },
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Overview of your ticketing system</p>
          </div>
          <Link href="/create">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Ticket</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/analytics">
            <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Analytics</h3>
                    <p className="text-gray-400 text-sm">View performance metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/reports">
            <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Reports</h3>
                    <p className="text-gray-400 text-sm">Generate detailed reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin">
            <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Admin</h3>
                    <p className="text-gray-400 text-sm">System administration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/tickets">
            <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TicketIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">All Tickets</h3>
                    <p className="text-gray-400 text-sm">View all tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Tickets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Tickets</h2>
            <Link href="/tickets">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {tickets.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-12 text-center">
                <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No tickets yet</h3>
                <p className="text-gray-400 mb-4">Create your first ticket to get started</p>
                <Link href="/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.slice(0, 6).map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TicketCard ticket={ticket} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
} 
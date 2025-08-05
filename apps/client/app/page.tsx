'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { TicketCard } from '@/components/TicketCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ticketApi, Ticket } from '@/lib/api'
import { Plus, Ticket as TicketIcon, Clock, CheckCircle, AlertCircle, TrendingUp, FileText, Shield, Users, Settings, MessageSquare } from 'lucide-react'
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
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTickets(data)
        } else {
          console.error('getTickets returned non-array data:', data)
          setTickets([])
        }
      } catch (err) {
        setError('Failed to load tickets')
        console.error('Error fetching tickets:', err)
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Only calculate stats if tickets are loaded and is an array
  const ticketsArray = Array.isArray(tickets) ? tickets : []
  const openTickets = ticketsArray.filter(ticket => ticket.status === 'needs_support' || ticket.status === 'in_progress')
  const closedTickets = ticketsArray.filter(ticket => ticket.status === 'resolved' || ticket.status === 'closed')
  const highPriorityTickets = ticketsArray.filter(ticket => ticket.priority === 'high')

  const stats = [
    {
      title: 'Total Tickets',
      value: ticketsArray.length,
      icon: TicketIcon,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
    {
      title: 'Open Tickets',
      value: openTickets.length,
      icon: Clock,
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
    },
    {
      title: 'Closed Tickets',
      value: closedTickets.length,
      icon: CheckCircle,
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      hoverBorder: 'hover:border-violet-500/40',
    },
    {
      title: 'High Priority',
      value: highPriorityTickets.length,
      icon: AlertCircle,
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
    },
  ]

  const quickActions = [
    {
      title: 'Analytics',
      description: 'View performance metrics',
      icon: TrendingUp,
      href: '/analytics',
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
    {
      title: 'Reports',
      description: 'Generate detailed reports',
      icon: FileText,
      href: '/reports',
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
    },
    {
      title: 'Messages',
      description: 'View conversations',
      icon: MessageSquare,
      href: '/messages',
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      hoverBorder: 'hover:border-violet-500/40',
    },
    {
      title: 'Users',
      description: 'Manage team members',
      icon: Users,
      href: '/users',
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Overview of your MintDesk ticketing system
            </p>
          </div>
          <Link href="/create">
            <Button className="flex items-center space-x-2 text-sm w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
              <Plus className="h-4 w-4" />
              <span>Create Ticket</span>
            </Button>
          </Link>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <div className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-lg p-3 sm:p-4 ${stat.hoverBorder} transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                    <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {quickActions.map((action, index) => (
            <motion.div key={action.title} variants={itemVariants}>
              <Link href={action.href}>
                <div className={`bg-gradient-to-br ${action.gradient} border ${action.border} rounded-lg p-3 sm:p-4 ${action.hoverBorder} transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-emerald-500/10`}>
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 ${action.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Recent Tickets
            </h2>
            <Link href="/tickets">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm hover:border-emerald-500/50 hover:text-emerald-400"
              >
                View All
              </Button>
            </Link>
          </div>

          <AnimatePresence>
            {ticketsArray.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-8 sm:p-12">
                  <TicketIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No tickets yet</h3>
                  <p className="text-gray-400 mb-6 text-sm sm:text-base">Create your first ticket to get started with MintDesk</p>
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ticket
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {ticketsArray.slice(0, 6).map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    variants={itemVariants}
                    layout
                  >
                    <TicketCard ticket={ticket} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MainLayout>
  )
} 
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { TicketCard } from '@/components/TicketCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ticketApi, Ticket } from '@/lib/api'
import { Plus, Filter, Search, Ticket as TicketIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function TicketsListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Handle URL search parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const data = await ticketApi.getTickets()
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTickets(data)
          setFilteredTickets(data)
        } else {
          console.error('getTickets returned non-array data:', data)
          setTickets([])
          setFilteredTickets([])
        }
      } catch (err) {
        setError('Failed to load tickets')
        console.error('Error fetching tickets:', err)
        setTickets([])
        setFilteredTickets([])
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  useEffect(() => {
    // Ensure tickets is an array before filtering
    const ticketsArray = Array.isArray(tickets) ? tickets : []
    let filtered = ticketsArray

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.detail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toString().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    setFilteredTickets(filtered)
  }, [tickets, searchTerm, statusFilter, priorityFilter])

  // Only calculate stats if tickets are loaded and is an array
  const ticketsArray = Array.isArray(tickets) ? tickets : []
  const openTickets = ticketsArray.filter(ticket => 
    ticket.status === 'needs_support' || ticket.status === 'in_progress'
  )
  const closedTickets = ticketsArray.filter(ticket => ticket.status === 'closed')
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
      badge: 'All',
      badgeVariant: 'default' as const,
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
      badge: 'Open',
      badgeVariant: 'success' as const,
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
      badge: 'Closed',
      badgeVariant: 'secondary' as const,
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
      badge: 'High',
      badgeVariant: 'destructive' as const,
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              All Tickets
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              {filteredTickets.length} of {ticketsArray.length} tickets
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm hover:border-emerald-500/50 hover:text-emerald-400"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Link href="/create">
              <Button className="flex items-center space-x-2 text-sm w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                <Plus className="h-4 w-4" />
                <span>Create Ticket</span>
              </Button>
            </Link>
          </div>
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
                  <div className="flex flex-col items-end space-y-2">
                    <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                      <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.iconColor}`} />
                    </div>
                    <Badge variant={stat.badgeVariant} className="text-xs">
                      {stat.badge}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-3 sm:p-4 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="flex items-center space-x-2">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Tickets Grid */}
        <AnimatePresence>
          {filteredTickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-8 sm:p-12">
                <TicketIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? (
                  <>
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No tickets found</h3>
                    <p className="text-gray-400 mb-6 text-sm sm:text-base">Try adjusting your filters</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No tickets yet</h3>
                    <p className="text-gray-400 mb-6 text-sm sm:text-base">Create your first ticket to get started with MintDesk</p>
                  </>
                )}
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
              {filteredTickets.map((ticket, index) => (
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
      </div>
    </MainLayout>
  )
}

export default function TicketsList() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </MainLayout>
    }>
      <TicketsListContent />
    </Suspense>
  )
} 
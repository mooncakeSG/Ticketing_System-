'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ticketApi, Ticket } from '@/lib/api'
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'

export default function TicketDetail() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const ticketId = params.id as string

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        const data = await ticketApi.getTicket(ticketId)
        setTicket(data)
      } catch (err) {
        setError('Failed to load ticket')
        console.error('Error fetching ticket:', err)
      } finally {
        setLoading(false)
      }
    }

    if (ticketId) {
      fetchTicket()
    }
  }, [ticketId])

  const handleStatusToggle = async () => {
    if (!ticket) return

    try {
      setUpdating(true)
      const updatedTicket = ticket.status === 'open' 
        ? await ticketApi.closeTicket(ticket.id)
        : await ticketApi.reopenTicket(ticket.id)
      setTicket(updatedTicket)
    } catch (err) {
      console.error('Error updating ticket status:', err)
    } finally {
      setUpdating(false)
    }
  }

  const priorityColors = {
    low: 'info',
    medium: 'warning',
    high: 'destructive',
  } as const

  const statusColors = {
    open: 'success',
    closed: 'secondary',
  } as const

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </MainLayout>
    )
  }

  if (error || !ticket) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Ticket not found'}</p>
            <Button onClick={() => router.back()}>
              Go Back
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
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{ticket.subject}</h1>
              <p className="text-gray-400 mt-1">Ticket #{ticket.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge 
              variant={statusColors[ticket.status] as any}
              className="text-sm"
            >
              {ticket.status === 'open' ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Open
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Closed
                </>
              )}
            </Badge>
            <Badge 
              variant={priorityColors[ticket.priority] as any}
              className="text-sm"
            >
              {ticket.priority === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
              {ticket.priority}
            </Badge>
            <Button
              onClick={handleStatusToggle}
              disabled={updating}
              variant={ticket.status === 'open' ? 'destructive' : 'default'}
            >
              {updating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : ticket.status === 'open' ? (
                'Close Ticket'
              ) : (
                'Reopen Ticket'
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No comments yet</p>
                    <p className="text-sm text-gray-500 mt-1">Be the first to add a comment</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Ticket Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <Badge variant={statusColors[ticket.status] as any}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Priority</span>
                    <Badge variant={priorityColors[ticket.priority] as any}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white text-sm">
                      {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Updated</span>
                    <span className="text-white text-sm">
                      {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  {ticket.assigned_to && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Assigned to</span>
                      <span className="text-white text-sm">{ticket.assigned_to}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created by</span>
                    <span className="text-white text-sm">{ticket.created_by}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Assign Ticket
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Due Date
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 
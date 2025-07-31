'use client'

import { motion } from 'framer-motion'
import { Ticket } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, User, MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface TicketCardProps {
  ticket: Ticket
}

const priorityColors = {
  low: 'info',
  medium: 'warning',
  high: 'destructive',
} as const

const statusColors = {
  needs_support: 'default',
  in_progress: 'warning',
  waiting_for_customer: 'secondary',
  resolved: 'success',
  closed: 'secondary',
} as const

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Link href={`/tickets/${ticket.id}`}>
        <Card className="h-full cursor-pointer border-gray-800 bg-gray-900/50 transition-all duration-200 hover:border-gray-700 hover:bg-gray-900/80 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="line-clamp-2 text-lg font-semibold text-white group-hover:text-gray-200">
                {ticket.title}
              </CardTitle>
              <div className="flex flex-col gap-2">
                <Badge 
                  variant={statusColors[ticket.status] as any}
                  className="text-xs"
                >
                  {ticket.status}
                </Badge>
                <Badge 
                  variant={priorityColors[ticket.priority] as any}
                  className="text-xs"
                >
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="line-clamp-3 text-sm text-gray-400 group-hover:text-gray-300">
              {ticket.detail}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>
                Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </span>
              {ticket.assignedTo && (
                <span className="text-gray-400">
                  Assigned to {ticket.assignedTo.name}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
} 
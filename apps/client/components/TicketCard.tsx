'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticket } from '@/lib/api'
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
  open: 'success',
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
                {ticket.subject}
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
              {ticket.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>
                Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              </span>
              {ticket.assigned_to && (
                <span className="text-gray-400">
                  Assigned to {ticket.assigned_to}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  MessageSquare, 
  User, 
  Clock, 
  Send,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Message {
  id: string;
  subject: string;
  participants: string[];
  last_message: string;
  last_sender: string;
  last_sent_at: string;
  unread_count: number;
  status: 'active' | 'archived' | 'spam';
  priority: 'low' | 'medium' | 'high';
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Website loading issues',
    participants: ['John Doe', 'Sarah Wilson', 'Mike Johnson'],
    last_message: 'I\'ve identified the issue with the database connection. Should be resolved by tomorrow.',
    last_sender: 'Mike Johnson',
    last_sent_at: '2024-01-15T14:30:00Z',
    unread_count: 2,
    status: 'active',
    priority: 'high',
  },
  {
    id: '2',
    subject: 'New feature request',
    participants: ['Lisa Chen', 'David Smith'],
    last_message: 'The new dashboard design looks great! When can we expect it to go live?',
    last_sender: 'Lisa Chen',
    last_sent_at: '2024-01-15T13:45:00Z',
    unread_count: 0,
    status: 'active',
    priority: 'medium',
  },
  {
    id: '3',
    subject: 'System maintenance notification',
    participants: ['System Admin', 'All Users'],
    last_message: 'Scheduled maintenance will begin at 2 AM tonight. Expected downtime: 30 minutes.',
    last_sender: 'System Admin',
    last_sent_at: '2024-01-15T12:00:00Z',
    unread_count: 1,
    status: 'active',
    priority: 'high',
  },
  {
    id: '4',
    subject: 'User training session',
    participants: ['Alex Rodriguez', 'Training Team'],
    last_message: 'The training session has been rescheduled to next Tuesday at 10 AM.',
    last_sender: 'Training Team',
    last_sent_at: '2024-01-15T11:15:00Z',
    unread_count: 0,
    status: 'active',
    priority: 'low',
  },
  {
    id: '5',
    subject: 'Bug report - Mobile app',
    participants: ['QA Team', 'Development Team'],
    last_message: 'The crash issue on iOS 15 has been fixed in the latest build.',
    last_sender: 'Development Team',
    last_sent_at: '2024-01-14T16:30:00Z',
    unread_count: 0,
    status: 'active',
    priority: 'high',
  },
  {
    id: '6',
    subject: 'Monthly team meeting',
    participants: ['All Team Members'],
    last_message: 'Great work everyone! Let\'s keep up the momentum for next month.',
    last_sender: 'John Doe',
    last_sent_at: '2024-01-14T15:00:00Z',
    unread_count: 0,
    status: 'archived',
    priority: 'low',
  },
];

export default function MessagesList() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(mockMessages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived' | 'spam'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  useEffect(() => {
    let filtered = messages

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
        message.last_message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(message => message.priority === priorityFilter)
    }

    setFilteredMessages(filtered)
  }, [messages, searchTerm, statusFilter, priorityFilter])

  const activeMessages = messages.filter(message => message.status === 'active')
  const archivedMessages = messages.filter(message => message.status === 'archived')
  const unreadMessages = messages.filter(message => message.unread_count > 0)

  const priorityColors = {
    low: 'info',
    medium: 'warning',
    high: 'destructive',
  } as const

  const statusColors = {
    active: 'success',
    archived: 'secondary',
    spam: 'destructive',
  } as const

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <p className="text-gray-400 mt-1">
              {filteredMessages.length} of {messages.length} conversations
            </p>
          </div>
          <Link href="/messages/compose">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Message</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-white">{messages.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">{activeMessages.length}</p>
              </div>
              <Badge variant="success" className="text-xs">
                Active
              </Badge>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Unread</p>
                <p className="text-2xl font-bold text-white">{unreadMessages.length}</p>
              </div>
              <Badge variant="warning" className="text-xs">
                Unread
              </Badge>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Archived</p>
                <p className="text-2xl font-bold text-white">{archivedMessages.length}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                Archived
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="spam">Spam</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? (
                <>
                  <p className="text-lg font-medium text-white mb-2">No messages found</p>
                  <p className="text-gray-400">Try adjusting your filters</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-white mb-2">No messages yet</p>
                  <p className="text-gray-400">Start a conversation to get started</p>
                </>
              )}
            </div>
            <Link href="/messages/compose">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/messages/${message.id}`}>
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials(message.participants[0])}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-medium">{message.subject}</h3>
                                {message.unread_count > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {message.unread_count}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">
                                {message.participants.join(', ')}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                            <span className="text-gray-500">{message.last_sender}:</span> {message.last_message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Badge variant={priorityColors[message.priority] as any} className="text-xs">
                                {message.priority}
                              </Badge>
                              <Badge variant={statusColors[message.status] as any} className="text-xs">
                                {message.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatDistanceToNow(new Date(message.last_sent_at), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
} 
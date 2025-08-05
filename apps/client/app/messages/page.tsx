'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Trash2,
  Filter,
  Star,
  Archive,
  Mail,
  Bell,
  TrendingUp
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
  isStarred?: boolean;
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
    isStarred: true,
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
  const [showFilters, setShowFilters] = useState(false)

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
  const starredMessages = messages.filter(message => message.isStarred)

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

  const toggleStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
  }

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
              Messages
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              {filteredMessages.length} of {messages.length} conversations
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Link href="/messages/compose">
              <Button className="flex items-center space-x-2 text-sm w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                <Plus className="h-4 w-4" />
                <span>New Message</span>
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
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-3 sm:p-4 hover:border-blue-500/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Total Messages</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{messages.length}</p>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-3 sm:p-4 hover:border-green-500/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Active</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{activeMessages.length}</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Badge variant="success" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-3 sm:p-4 hover:border-orange-500/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Unread</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{unreadMessages.length}</p>
                </div>
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Badge variant="warning" className="text-xs">
                    Unread
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-3 sm:p-4 hover:border-purple-500/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Archived</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{archivedMessages.length}</p>
                </div>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Badge variant="secondary" className="text-xs">
                    Archived
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
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
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all duration-200"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all duration-200"
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
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all duration-200"
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

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          <Button variant="outline" size="sm" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Starred ({starredMessages.length})
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Mail className="h-3 w-3 mr-1" />
            Unread ({unreadMessages.length})
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Archive className="h-3 w-3 mr-1" />
            Archived ({archivedMessages.length})
          </Button>
        </motion.div>

        {/* Enhanced Messages List */}
        {filteredMessages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <div className="text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? (
                <>
                  <p className="text-base sm:text-lg font-medium text-white mb-2">No messages found</p>
                  <p className="text-sm sm:text-base text-gray-400">Try adjusting your filters</p>
                </>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-medium text-white mb-2">No messages yet</p>
                  <p className="text-sm sm:text-base text-gray-400">Start a conversation to get started</p>
                </>
              )}
            </div>
            <Link href="/messages/compose">
                              <Button className="text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  variants={itemVariants}
                  layout
                  className="group"
                >
                  <Link href={`/messages/${message.id}`}>
                    <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <div className="relative">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                                  {getInitials(message.participants[0])}
                                </div>
                                {message.unread_count > 0 && (
                                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">{message.unread_count}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-white font-medium text-sm sm:text-base truncate group-hover:text-emerald-400 transition-colors">
                                    {message.subject}
                                  </h3>
                                  {message.isStarred && (
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 truncate">
                                  {message.participants.join(', ')}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2">
                              <span className="text-gray-500">{message.last_sender}:</span> {message.last_message}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                              <div className="flex items-center space-x-2 sm:space-x-4">
                                <Badge variant={priorityColors[message.priority] as any} className="text-xs">
                                  {message.priority}
                                </Badge>
                                <Badge variant={statusColors[message.status] as any} className="text-xs">
                                  {message.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span className="truncate">{formatDistanceToNow(new Date(message.last_sent_at), { addSuffix: true })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                          <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-emerald-500/20 hover:text-emerald-400"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleStar(message.id)
                              }}
                            >
                              <Star className={`h-3 w-3 sm:h-4 sm:w-4 ${message.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-gray-500/20">
                              <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </MainLayout>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  User, 
  Clock,
  Reply,
  Forward,
  Archive,
  Trash2,
  Paperclip,
  Smile
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Message {
  id: string;
  subject: string;
  participants: string[];
  status: 'active' | 'archived' | 'spam';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  last_updated: string;
  messages: MessageItem[];
}

interface MessageItem {
  id: string;
  sender: string;
  content: string;
  sent_at: string;
  is_read: boolean;
  attachments?: string[];
}

// Mock message data
const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Website loading issues',
    participants: ['John Doe', 'Sarah Wilson', 'Mike Johnson'],
    status: 'active',
    priority: 'high',
    created_at: '2024-01-10T09:00:00Z',
    last_updated: '2024-01-15T14:30:00Z',
    messages: [
      {
        id: '1',
        sender: 'John Doe',
        content: 'The website is taking too long to load. Users are reporting 10+ second load times.',
        sent_at: '2024-01-10T09:00:00Z',
        is_read: true,
      },
      {
        id: '2',
        sender: 'Sarah Wilson',
        content: 'I can confirm this issue. I\'ve checked the server logs and there are some database connection problems.',
        sent_at: '2024-01-10T10:15:00Z',
        is_read: true,
      },
      {
        id: '3',
        sender: 'Mike Johnson',
        content: 'I\'ve identified the issue with the database connection. Should be resolved by tomorrow.',
        sent_at: '2024-01-15T14:30:00Z',
        is_read: false,
      },
    ],
  },
  {
    id: '2',
    subject: 'New feature request',
    participants: ['Lisa Chen', 'David Smith'],
    status: 'active',
    priority: 'medium',
    created_at: '2024-01-12T11:00:00Z',
    last_updated: '2024-01-15T13:45:00Z',
    messages: [
      {
        id: '1',
        sender: 'Lisa Chen',
        content: 'Can we add a dark mode option to the dashboard?',
        sent_at: '2024-01-12T11:00:00Z',
        is_read: true,
      },
      {
        id: '2',
        sender: 'David Smith',
        content: 'That\'s a great idea! I\'ll look into the implementation.',
        sent_at: '2024-01-13T14:20:00Z',
        is_read: true,
      },
      {
        id: '3',
        sender: 'Lisa Chen',
        content: 'The new dashboard design looks great! When can we expect it to go live?',
        sent_at: '2024-01-15T13:45:00Z',
        is_read: false,
      },
    ],
  },
];

export default function MessageDetail() {
  const params = useParams()
  const router = useRouter()
  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const messageId = params.id as string

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        const foundMessage = mockMessages.find(m => m.id === messageId)
        if (!foundMessage) {
          setError('Message not found')
          return
        }
        setMessage(foundMessage)
      } catch (err) {
        setError('Failed to load message')
        console.error('Error fetching message:', err)
      } finally {
        setLoading(false)
      }
    }

    if (messageId) {
      fetchMessage()
    }
  }, [messageId])

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

  const handleReply = () => {
    if (!replyText.trim()) return
    
    // Add new message to the thread
    const newMessage: MessageItem = {
      id: Date.now().toString(),
      sender: 'You',
      content: replyText,
      sent_at: new Date().toISOString(),
      is_read: false,
    }
    
    if (message) {
      setMessage({
        ...message,
        messages: [...message.messages, newMessage],
        last_updated: new Date().toISOString(),
      })
    }
    
    setReplyText('')
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </MainLayout>
    )
  }

  if (error || !message) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Message not found'}</p>
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
            <Link href="/messages">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{message.subject}</h1>
              <p className="text-gray-400 mt-1">
                {message.participants.join(', ')} • {formatDistanceToNow(new Date(message.last_updated), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={priorityColors[message.priority] as any}>
              {message.priority}
            </Badge>
            <Badge variant={statusColors[message.status] as any}>
              {message.status}
            </Badge>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="space-y-4">
          {message.messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${msg.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {getInitials(msg.sender)}
                    </div>
                    <span className="font-medium">{msg.sender}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs opacity-75">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(msg.sent_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <p className="text-sm">{msg.content}</p>
                {!msg.is_read && msg.sender !== 'You' && (
                  <div className="mt-2 text-xs opacity-75">Unread</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Section */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md p-3 text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                </div>
                <Button onClick={handleReply} disabled={!replyText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            Created {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 
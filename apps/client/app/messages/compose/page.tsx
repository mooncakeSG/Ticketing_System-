'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Smile,
  User,
  Users,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Mock users for recipient selection
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Admin' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', role: 'Agent' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'Agent' },
  { id: '4', name: 'Lisa Chen', email: 'lisa.chen@company.com', role: 'User' },
  { id: '5', name: 'David Smith', email: 'david.smith@company.com', role: 'Agent' },
  { id: '6', name: 'Alex Rodriguez', email: 'alex.rodriguez@company.com', role: 'User' },
];

export default function ComposeMessage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    recipients: [] as string[],
    subject: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)

  const priorityColors = {
    low: 'info',
    medium: 'warning',
    high: 'destructive',
  } as const

  const handleRecipientToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(userId)
        ? prev.recipients.filter(id => id !== userId)
        : [...prev.recipients, userId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject.trim() || !formData.content.trim() || formData.recipients.length === 0) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, just redirect back to messages
      router.push('/messages')
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const selectedUsers = mockUsers.filter(user => formData.recipients.includes(user.id))

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
              <h1 className="text-3xl font-bold text-white">Compose Message</h1>
              <p className="text-gray-400 mt-1">Create a new message</p>
            </div>
          </div>
        </div>

        {/* Compose Form */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Recipients */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Recipients <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {selectedUsers.length === 0 
                          ? 'Select recipients...' 
                          : `${selectedUsers.length} recipient${selectedUsers.length > 1 ? 's' : ''} selected`
                        }
                      </span>
                    </span>
                  </Button>
                  
                  {showRecipientDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {mockUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleRecipientToggle(user.id)}
                        >
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{user.name}</p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {user.role}
                            </Badge>
                            {formData.recipients.includes(user.id) && (
                              <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="h-2 w-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Selected Recipients */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <Badge key={user.id} variant="secondary" className="text-xs">
                        {user.name}
                        <button
                          type="button"
                          onClick={() => handleRecipientToggle(user.id)}
                          className="ml-1 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-white">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  placeholder="Enter message subject"
                  required
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Priority</label>
                <div className="flex items-center space-x-4">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <Badge variant={priorityColors[priority] as any} className="text-xs">
                        {priority}
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-white">
                  Message <span className="text-red-400">*</span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-none"
                    placeholder="Type your message..."
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 
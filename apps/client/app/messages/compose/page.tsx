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
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})
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
    if (fieldErrors.recipients) {
      setFieldErrors(prev => ({ ...prev, recipients: '' }))
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (formData.recipients.length === 0) {
      errors.recipients = 'Please select at least one recipient'
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required'
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Message content is required'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError('Please fix the validation errors below')
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
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const selectedUsers = mockUsers.filter(user => formData.recipients.includes(user.id))

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/messages">
              <Button variant="ghost" size="icon" data-testid="back-button" aria-label="Go back to messages">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Compose Message</h1>
              <p className="text-gray-400 mt-1">Send a new message to team members</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-md" role="alert" aria-live="polite">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="compose-message-form">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">New Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
                      className={`w-full justify-between ${
                        fieldErrors.recipients ? 'border-red-500' : ''
                      }`}
                      data-testid="recipients-dropdown-button"
                      aria-describedby={fieldErrors.recipients ? "recipients-error" : undefined}
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
                      <div
                        className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                        data-testid="recipients-dropdown"
                        role="listbox"
                        aria-label="Select recipients"
                      >
                        {mockUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleRecipientToggle(user.id)}
                            role="option"
                            aria-selected={formData.recipients.includes(user.id)}
                            data-testid={`recipient-option-${user.id}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {fieldErrors.recipients && (
                    <div id="recipients-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.recipients}
                    </div>
                  )}
                  
                  {/* Selected Recipients */}
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUsers.map((user) => (
                        <Badge
                          key={user.id}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{user.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRecipientToggle(user.id)}
                            className="ml-1 hover:text-red-400"
                            data-testid={`remove-recipient-${user.id}`}
                            aria-label={`Remove ${user.name} from recipients`}
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
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                      fieldErrors.subject ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter message subject"
                    required
                    data-testid="message-subject-input"
                    aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
                  />
                  {fieldErrors.subject && (
                    <div id="subject-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.subject}
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium text-white">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    data-testid="message-priority-select"
                    aria-label="Select message priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium text-white">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    rows={8}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-none ${
                      fieldErrors.content ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Type your message here..."
                    required
                    data-testid="message-content-input"
                    aria-describedby={fieldErrors.content ? "content-error" : undefined}
                  />
                  {fieldErrors.content && (
                    <div id="content-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.content}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                      data-testid="attach-file-button"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span>Attach</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                      data-testid="add-emoji-button"
                      aria-label="Add emoji"
                    >
                      <Smile className="h-4 w-4" />
                      <span>Emoji</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Link href="/messages">
                      <Button variant="outline" type="button" data-testid="cancel-button">
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="flex items-center space-x-2"
                      data-testid="send-message-button"
                      aria-label={loading ? "Sending message..." : "Send message"}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  )
} 
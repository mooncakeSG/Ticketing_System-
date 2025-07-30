'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ticketApi, CreateTicketData } from '@/lib/api'
import { ArrowLeft, Send, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CreateTicket() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateTicketData>({
    title: '',
    detail: '',
    priority: 'medium',
    type: 'support',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }
    
    if (!formData.detail?.trim()) {
      errors.detail = 'Description is required'
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
      const newTicket = await ticketApi.createTicket(formData)
      router.push(`/tickets/${newTicket.id}`)
    } catch (err) {
      setError('Failed to create ticket. Please try again.')
      console.error('Error creating ticket:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateTicketData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="back-button" aria-label="Go back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Ticket</h1>
            <p className="text-gray-400 mt-1">Submit a new support ticket</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Ticket Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="create-ticket-form">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-white">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                      fieldErrors.title ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Brief description of the issue"
                    required
                    data-testid="ticket-title-input"
                    aria-describedby={fieldErrors.title ? "title-error" : undefined}
                  />
                  {fieldErrors.title && (
                    <div id="title-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.title}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium text-white">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    data-testid="ticket-priority-select"
                    aria-label="Select ticket priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="detail" className="text-sm font-medium text-white">
                    Description *
                  </label>
                  <textarea
                    id="detail"
                    value={formData.detail}
                    onChange={(e) => handleChange('detail', e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-none ${
                      fieldErrors.detail ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Provide detailed information about the issue..."
                    required
                    data-testid="ticket-description-input"
                    aria-describedby={fieldErrors.detail ? "detail-error" : undefined}
                  />
                  {fieldErrors.detail && (
                    <div id="detail-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.detail}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link href="/">
                    <Button variant="outline" type="button" data-testid="cancel-button">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center space-x-2"
                    data-testid="submit-ticket-button"
                    aria-label={loading ? "Creating ticket..." : "Create ticket"}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{loading ? 'Creating...' : 'Create Ticket'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  )
} 
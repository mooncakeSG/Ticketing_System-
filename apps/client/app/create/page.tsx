'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ticketApi, CreateTicketData } from '@/lib/api'
import { ArrowLeft, Send, AlertCircle, Ticket, AlertTriangle, Info } from 'lucide-react'
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

  const priorityOptions = [
    {
      value: 'low',
      label: 'Low',
      icon: Info,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
      description: 'Minor issues, non-urgent'
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: AlertTriangle,
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
      description: 'Standard priority issues'
    },
    {
      value: 'high',
      label: 'High',
      icon: AlertCircle,
      gradient: 'from-red-500/10 to-red-600/10',
      border: 'border-red-500/20',
      iconColor: 'text-red-400',
      description: 'Urgent issues requiring immediate attention'
    }
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

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon" 
              data-testid="back-button" 
              aria-label="Go back"
              className="hover:bg-emerald-500/20 hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Create New Ticket
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Submit a new MintDesk support ticket
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent flex items-center">
                <Ticket className="h-5 w-5 mr-2" />
                Ticket Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="create-ticket-form">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 text-sm">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-white">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-md text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-200 ${
                      fieldErrors.title ? 'border-red-500' : 'border-gray-700/50'
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
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium text-white">
                    Priority
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {priorityOptions.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label className={`block cursor-pointer`}>
                          <input
                            type="radio"
                            name="priority"
                            value={option.value}
                            checked={formData.priority === option.value}
                            onChange={(e) => handleChange('priority', e.target.value as any)}
                            className="sr-only"
                          />
                          <div className={`p-3 rounded-lg border transition-all duration-200 ${
                            formData.priority === option.value 
                              ? `${option.gradient} ${option.border} border-opacity-50` 
                              : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <option.icon className={`h-4 w-4 ${option.iconColor}`} />
                              <span className="text-white font-medium">{option.label}</span>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">{option.description}</p>
                          </div>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="detail" className="text-sm font-medium text-white">
                    Description *
                  </label>
                  <textarea
                    id="detail"
                    value={formData.detail}
                    onChange={(e) => handleChange('detail', e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-md text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-200 resize-none ${
                      fieldErrors.detail ? 'border-red-500' : 'border-gray-700/50'
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
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-between pt-4 space-y-3 sm:space-y-0"
                >
                  <Link href="/">
                    <Button 
                      variant="outline" 
                      type="button" 
                      data-testid="cancel-button"
                      className="hover:border-emerald-500/50 hover:text-emerald-400"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
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
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  )
} 
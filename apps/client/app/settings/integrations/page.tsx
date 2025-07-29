'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Plus, Trash2, Edit, Eye, EyeOff, Copy, ExternalLink, Check, X, AlertCircle, Zap, Mail, MessageSquare, Calendar, CreditCard, Database, Shield } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'connected' | 'disconnected' | 'error'
  category: 'communication' | 'payment' | 'storage' | 'analytics' | 'development' | 'updates'
  apiKey?: string
  webhookUrl?: string
  lastSync?: string
}

const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications to Slack channels',
    icon: <MessageSquare className="h-5 w-5" />,
    status: 'connected',
    category: 'communication',
    lastSync: '2 minutes ago'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Integrate with Discord webhooks',
    icon: <MessageSquare className="h-5 w-5" />,
    status: 'disconnected',
    category: 'communication'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and subscriptions',
    icon: <CreditCard className="h-5 w-5" />,
    status: 'connected',
    category: 'payment',
    lastSync: '1 hour ago'
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Store files and attachments',
    icon: <Database className="h-5 w-5" />,
    status: 'connected',
    category: 'storage',
    lastSync: '5 minutes ago'
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track user behavior and metrics',
    icon: <Zap className="h-5 w-5" />,
    status: 'error',
    category: 'analytics'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect repositories for issue tracking',
    icon: <ExternalLink className="h-5 w-5" />,
    status: 'disconnected',
    category: 'development'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Connect with users track their profile',
    icon: <ExternalLink className="h-5 w-5" />,
    status: 'disconnected',
    category: 'updates'
  }
]


const availableIntegrations = [
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Import tickets from Zendesk',
    icon: <MessageSquare className="h-5 w-5" />,
    category: 'communication'
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Sync with Jira projects',
    icon: <ExternalLink className="h-5 w-5" />,
    category: 'development'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing integration',
    icon: <Mail className="h-5 w-5" />,
    category: 'communication'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'File storage and sharing',
    icon: <Database className="h-5 w-5" />,
    category: 'storage'
  }
]

export default function IntegrationsSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({})
  const [editingIntegration, setEditingIntegration] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({
    slack: 'xoxb-1234567890-abcdefghijklmnop',
    stripe: 'sk_test_1234567890abcdefghijklmnop',
    'aws-s3': 'AKIAIOSFODNN7EXAMPLE'
  })
  const [webhookUrls, setWebhookUrls] = useState<{ [key: string]: string }>({
    slack: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    discord: 'https://discord.com/api/webhooks/1234567890/abcdefghijklmnop'
  })

  const handleConnect = async (integrationId: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleDisconnect = async (integrationId: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleSaveApiKey = (integrationId: string, apiKey: string) => {
    setApiKeys(prev => ({ ...prev, [integrationId]: apiKey }))
    setEditingIntegration(null)
  }

  const handleSaveWebhook = (integrationId: string, webhookUrl: string) => {
    setWebhookUrls(prev => ({ ...prev, [integrationId]: webhookUrl }))
    setEditingIntegration(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'disconnected': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'disconnected': return 'Disconnected'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Integrations</h1>
              <p className="text-gray-400">Connect third-party services and manage API keys</p>
            </div>
          </div>
          <Button onClick={() => setIsLoading(true)} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Connected Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Connected Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <h3 className="text-white font-medium">{integration.name}</h3>
                        <p className="text-gray-400 text-sm">{integration.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={integration.status === 'connected' ? 'default' : integration.status === 'error' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {getStatusText(integration.status)}
                    </Badge>
                  </div>

                  {integration.lastSync && (
                    <p className="text-gray-500 text-xs mb-3">
                      Last sync: {integration.lastSync}
                    </p>
                  )}

                  <div className="space-y-2">
                    {/* API Key Section */}
                    {apiKeys[integration.id] && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">API Key</span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowApiKey(prev => ({ ...prev, [integration.id]: !prev[integration.id] }))}
                            >
                              {showApiKey[integration.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKeys[integration.id])}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingIntegration(integration.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded text-xs font-mono">
                          {showApiKey[integration.id] ? apiKeys[integration.id] : '••••••••••••••••••••••••••••••••'}
                        </div>
                      </div>
                    )}

                    {/* Webhook URL Section */}
                    {webhookUrls[integration.id] && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Webhook URL</span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(webhookUrls[integration.id])}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingIntegration(integration.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded text-xs font-mono truncate">
                          {webhookUrls[integration.id]}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      {integration.status === 'connected' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                          className="flex-1"
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(integration.id)}
                          className="flex-1"
                        >
                          Connect
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Available Integrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableIntegrations.map((integration) => (
                <div key={integration.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <h3 className="text-white font-medium">{integration.name}</h3>
                        <p className="text-gray-400 text-sm">{integration.description}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Integration
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Webhook Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">Incoming Webhooks</h3>
                    <p className="text-gray-400 text-sm">Configure webhooks to receive data from external services</p>
                  </div>
                  <Button size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Webhook
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-white text-sm">Ticket Created</span>
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-white text-sm">User Registration</span>
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">Outgoing Webhooks</h3>
                    <p className="text-gray-400 text-sm">Send notifications to external services</p>
                  </div>
                  <Button size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Webhook
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-white text-sm">Slack Notifications</span>
                    <Badge variant="default" className="text-xs">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-white text-sm">Discord Alerts</span>
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>API Documentation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-white font-medium mb-2">REST API</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Use our REST API to integrate with your own applications
                </p>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-700 px-2 py-1 rounded text-sm">
                    https://api.peppermint.com/v1
                  </code>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Docs
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-white font-medium mb-2">Webhook Events</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Available events for webhook integration
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="text-xs">ticket.created</Badge>
                  <Badge variant="outline" className="text-xs">ticket.updated</Badge>
                  <Badge variant="outline" className="text-xs">user.registered</Badge>
                  <Badge variant="outline" className="text-xs">message.sent</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 
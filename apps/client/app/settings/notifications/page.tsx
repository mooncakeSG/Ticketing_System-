'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Bell, 
  Mail, 
  Smartphone,
  Monitor,
  AlertCircle,
  CheckCircle,
  Settings,
  Clock,
  User,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface NotificationSettings {
  email: {
    newTicket: boolean;
    ticketUpdate: boolean;
    ticketAssigned: boolean;
    ticketResolved: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
  push: {
    newTicket: boolean;
    ticketUpdate: boolean;
    ticketAssigned: boolean;
    ticketResolved: boolean;
  };
  inApp: {
    newTicket: boolean;
    ticketUpdate: boolean;
    ticketAssigned: boolean;
    ticketResolved: boolean;
    mention: boolean;
    systemUpdate: boolean;
  };
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    sms: boolean;
  };
  schedule: {
    quietHours: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
}

export default function NotificationSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newTicket: true,
      ticketUpdate: true,
      ticketAssigned: true,
      ticketResolved: false,
      dailyDigest: true,
      weeklyReport: false,
    },
    push: {
      newTicket: true,
      ticketUpdate: true,
      ticketAssigned: true,
      ticketResolved: false,
    },
    inApp: {
      newTicket: true,
      ticketUpdate: true,
      ticketAssigned: true,
      ticketResolved: true,
      mention: true,
      systemUpdate: true,
    },
    channels: {
      email: true,
      push: true,
      inApp: true,
      sms: false,
    },
    schedule: {
      quietHours: false,
      startTime: '22:00',
      endTime: '08:00',
      timezone: 'America/New_York',
    },
  })

  const handleToggle = (category: keyof NotificationSettings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !(prev[category] as any)[setting]
      }
    }))
    if (error) setError(null)
  }

  const handleChannelToggle = (channel: string) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel as keyof typeof prev.channels]
      }
    }))
    if (error) setError(null)
  }

  const handleScheduleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError('Failed to save notification settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const notificationTypes = [
    { key: 'newTicket', label: 'New Ticket Created', description: 'When a new ticket is created' },
    { key: 'ticketUpdate', label: 'Ticket Updated', description: 'When a ticket is modified' },
    { key: 'ticketAssigned', label: 'Ticket Assigned', description: 'When a ticket is assigned to you' },
    { key: 'ticketResolved', label: 'Ticket Resolved', description: 'When a ticket is marked as resolved' },
  ]

  const additionalEmailTypes = [
    { key: 'dailyDigest', label: 'Daily Digest', description: 'Daily summary of all tickets' },
    { key: 'weeklyReport', label: 'Weekly Report', description: 'Weekly performance report' },
  ]

  const additionalInAppTypes = [
    { key: 'mention', label: 'Mentions', description: 'When someone mentions you' },
    { key: 'systemUpdate', label: 'System Updates', description: 'Important system announcements' },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Notification Settings</h1>
              <p className="text-gray-400 mt-1">Configure how and when you receive notifications</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400">Notification settings saved successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Channels */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Notification Channels</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.channels.email}
                      onChange={() => handleChannelToggle('email')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-400">Receive push notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.channels.push}
                      onChange={() => handleChannelToggle('push')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-white font-medium">In-App Notifications</p>
                      <p className="text-sm text-gray-400">Show notifications in the app</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.channels.inApp}
                      onChange={() => handleChannelToggle('inApp')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-white font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-400">Receive SMS notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.channels.sms}
                      onChange={() => handleChannelToggle('sms')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{type.label}</p>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.email[type.key as keyof typeof settings.email]}
                      onChange={() => handleToggle('email', type.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              ))}
              
              {additionalEmailTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{type.label}</p>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.email[type.key as keyof typeof settings.email]}
                      onChange={() => handleToggle('email', type.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Push Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{type.label}</p>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.push[type.key as keyof typeof settings.push]}
                      onChange={() => handleToggle('push', type.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>In-App Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...notificationTypes, ...additionalInAppTypes].map((type) => (
                <div key={type.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{type.label}</p>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.inApp[type.key as keyof typeof settings.inApp]}
                      onChange={() => handleToggle('inApp', type.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Quiet Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enable Quiet Hours</p>
                  <p className="text-sm text-gray-400">Pause notifications during specified hours</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.schedule.quietHours}
                    onChange={() => handleScheduleChange('quietHours', !settings.schedule.quietHours)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {settings.schedule.quietHours && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Start Time</label>
                    <input
                      type="time"
                      value={settings.schedule.startTime}
                      onChange={(e) => handleScheduleChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">End Time</label>
                    <input
                      type="time"
                      value={settings.schedule.endTime}
                      onChange={(e) => handleScheduleChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Timezone</label>
                    <select
                      value={settings.schedule.timezone}
                      onChange={(e) => handleScheduleChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
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
                  <Save className="h-4 w-4" />
                  <span>Save Settings</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
} 
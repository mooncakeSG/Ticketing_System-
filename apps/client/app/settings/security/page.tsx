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
  Shield, 
  Lock, 
  Key,
  Smartphone,
  Monitor,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface SecuritySettings {
  password: {
    current: string;
    new: string;
    confirm: string;
  };
  twoFactor: {
    enabled: boolean;
    method: 'app' | 'sms' | 'email';
    backupCodes: string[];
  };
  sessions: {
    current: {
      id: string;
      device: string;
      location: string;
      lastActive: string;
      ip: string;
    };
    active: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      ip: string;
    }>;
  };
  preferences: {
    requirePasswordChange: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
}

export default function SecuritySettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [settings, setSettings] = useState<SecuritySettings>({
    password: {
      current: '',
      new: '',
      confirm: '',
    },
    twoFactor: {
      enabled: false,
      method: 'app',
      backupCodes: ['12345678', '87654321', '11111111', '22222222', '33333333', '44444444', '55555555', '66666666'],
    },
    sessions: {
      current: {
        id: 'current-session',
        device: 'Chrome on Windows 11',
        location: 'New York, NY, USA',
        lastActive: '2024-01-15T14:30:00Z',
        ip: '192.168.1.100',
      },
      active: [
        {
          id: 'session-1',
          device: 'Safari on iPhone 15',
          location: 'New York, NY, USA',
          lastActive: '2024-01-15T13:45:00Z',
          ip: '192.168.1.101',
        },
        {
          id: 'session-2',
          device: 'Firefox on MacBook Pro',
          location: 'San Francisco, CA, USA',
          lastActive: '2024-01-15T12:20:00Z',
          ip: '192.168.1.102',
        },
      ],
    },
    preferences: {
      requirePasswordChange: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
    },
  })

  const handlePasswordChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      password: {
        ...prev.password,
        [field]: value
      }
    }))
    if (error) setError(null)
  }

  const handlePreferenceChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
    if (error) setError(null)
  }

  const validatePasswordChange = () => {
    if (!settings.password.current) return 'Current password is required'
    if (!settings.password.new) return 'New password is required'
    if (settings.password.new.length < 8) return 'Password must be at least 8 characters'
    if (settings.password.new !== settings.password.confirm) return 'Passwords do not match'
    return null
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validatePasswordChange()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setSettings(prev => ({
        ...prev,
        password: {
          current: '',
          new: '',
          confirm: '',
        }
      }))
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError('Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorToggle = () => {
    setSettings(prev => ({
      ...prev,
      twoFactor: {
        ...prev.twoFactor,
        enabled: !prev.twoFactor.enabled
      }
    }))
  }

  const handleSessionTerminate = async (sessionId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSettings(prev => ({
        ...prev,
        sessions: {
          ...prev.sessions,
          active: prev.sessions.active.filter(session => session.id !== sessionId)
        }
      }))
    } catch (err) {
      setError('Failed to terminate session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError('Failed to save security preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-3xl font-bold text-white">Security Settings</h1>
              <p className="text-gray-400 mt-1">Manage your account security and privacy</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400">Security settings updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Change Password */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-white">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={settings.password.current}
                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                    className="w-full pr-10 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-white">
                    New Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={settings.password.new}
                      onChange={(e) => handlePasswordChange('new', e.target.value)}
                      className="w-full pr-10 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                    Confirm New Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={settings.password.confirm}
                      onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                      className="w-full pr-10 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    <span>Change Password</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Two-Factor Authentication</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Enable 2FA</p>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactor.enabled}
                  onChange={handleTwoFactorToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {settings.twoFactor.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Authentication Method</label>
                  <select
                    value={settings.twoFactor.method}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      twoFactor: {
                        ...prev.twoFactor,
                        method: e.target.value as 'app' | 'sms' | 'email'
                      }
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  >
                    <option value="app">Authenticator App</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium">Backup Codes</p>
                      <p className="text-sm text-yellow-400/80 mt-1">
                        Save these backup codes in a secure location. You can use them to access your account if you lose your 2FA device.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {settings.twoFactor.backupCodes.map((code, index) => (
                          <div key={index} className="bg-gray-800 px-3 py-2 rounded text-center font-mono text-sm text-white">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Active Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Session */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 font-medium">Current Session</p>
                  <p className="text-sm text-blue-400/80">{settings.sessions.current.device}</p>
                  <p className="text-xs text-blue-400/60">{settings.sessions.current.location} • {settings.sessions.current.ip}</p>
                </div>
                <Badge variant="success" className="text-xs">Current</Badge>
              </div>
            </div>

            {/* Other Active Sessions */}
            {settings.sessions.active.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{session.device}</p>
                  <p className="text-sm text-gray-400">{session.location} • {session.ip}</p>
                  <p className="text-xs text-gray-500">Last active: {new Date(session.lastActive).toLocaleString()}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSessionTerminate(session.id)}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Terminate</span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Preferences */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreferencesSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Require Password Change</p>
                    <p className="text-sm text-gray-400">Force password change on next login</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.requirePasswordChange}
                      onChange={(e) => handlePreferenceChange('requirePasswordChange', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.preferences.sessionTimeout}
                      onChange={(e) => handlePreferenceChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      min="5"
                      max="1440"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.preferences.maxLoginAttempts}
                      onChange={(e) => handlePreferenceChange('maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      min="3"
                      max="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Lockout Duration (minutes)</label>
                    <input
                      type="number"
                      value={settings.preferences.lockoutDuration}
                      onChange={(e) => handlePreferenceChange('lockoutDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      min="5"
                      max="1440"
                    />
                  </div>
                </div>
              </div>

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
                    <span>Save Preferences</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  )
} 
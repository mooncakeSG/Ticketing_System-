'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  User, 
  Mail,
  Smartphone,
  Globe,
  Save,
  Moon,
  Sun,
  Edit,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Manage your account preferences and system settings</p>
          </div>
        </div>

        {/* Quick Settings */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {darkMode ? <Moon className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-400">Toggle dark theme</p>
                  </div>
                </div>
                <Button
                  variant={darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "On" : "Off"}
                </Button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive email alerts</p>
                  </div>
                </div>
                <Button
                  variant={emailNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                >
                  {emailNotifications ? "On" : "Off"}
                </Button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-400">Browser notifications</p>
                  </div>
                </div>
                <Button
                  variant={pushNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPushNotifications(!pushNotifications)}
                >
                  {pushNotifications ? "On" : "Off"}
                </Button>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Save className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-white font-medium">Auto Save</p>
                    <p className="text-sm text-gray-400">Auto-save changes</p>
                  </div>
                </div>
                <Button
                  variant={autoSave ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoSave(!autoSave)}
                >
                  {autoSave ? "On" : "Off"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <Link href="/settings/general">
            <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer h-full rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center">
                  <SettingsIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">General Settings</h3>
                  </div>
                  <p className="text-gray-400 text-sm">Manage your account information and preferences</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Notifications */}
          <Link href="/settings/notifications">
            <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer h-full rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    <Badge variant="destructive" className="text-xs">3 new</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Configure email and push notifications</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Security */}
          <Link href="/settings/security">
            <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer h-full rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Security</h3>
                  </div>
                  <p className="text-gray-400 text-sm">Password, two-factor authentication, and privacy</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Appearance */}
          <Link href="/settings/appearance">
            <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer h-full rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Palette className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Appearance</h3>
                  </div>
                  <p className="text-gray-400 text-sm">Theme, colors, layout, and typography</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Integrations */}
          <Link href="/settings/integrations">
            <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer h-full rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Integrations</h3>
                  </div>
                  <p className="text-gray-400 text-sm">Third-party services and API connections</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Account Information */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <p className="text-white">John Doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <p className="text-white">john.doe@company.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Role</label>
                  <Badge variant="warning" className="mt-1">Admin</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Department</label>
                  <p className="text-white">IT Support</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Member Since</label>
                  <p className="text-white">January 10, 2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Last Login</label>
                  <p className="text-white">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button variant="outline" className="mr-3">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Zap,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  const quickSettings = [
    {
      title: 'Dark Mode',
      description: 'Toggle dark theme',
      icon: darkMode ? Moon : Sun,
      iconColor: darkMode ? 'text-blue-400' : 'text-yellow-400',
      iconBg: darkMode ? 'bg-blue-500/20' : 'bg-yellow-500/20',
      gradient: darkMode ? 'from-blue-500/10 to-blue-600/10' : 'from-yellow-500/10 to-yellow-600/10',
      border: darkMode ? 'border-blue-500/20' : 'border-yellow-500/20',
      hoverBorder: darkMode ? 'hover:border-blue-500/40' : 'hover:border-yellow-500/40',
      value: darkMode,
      setValue: setDarkMode,
    },
    {
      title: 'Email Notifications',
      description: 'Receive email alerts',
      icon: Mail,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/40',
      value: emailNotifications,
      setValue: setEmailNotifications,
    },
    {
      title: 'Push Notifications',
      description: 'Browser notifications',
      icon: Smartphone,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/20',
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      hoverBorder: 'hover:border-violet-500/40',
      value: pushNotifications,
      setValue: setPushNotifications,
    },
    {
      title: 'Auto Save',
      description: 'Auto-save changes',
      icon: Save,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      hoverBorder: 'hover:border-amber-500/40',
      value: autoSave,
      setValue: setAutoSave,
    },
  ]

  const settingsSections = [
    {
      title: 'General Settings',
      description: 'Manage your account information and preferences',
      icon: SettingsIcon,
      href: '/settings/general',
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
    {
      title: 'Notifications',
      description: 'Configure email and push notifications',
      icon: Bell,
      href: '/settings/notifications',
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
      badge: '3 new',
      badgeVariant: 'destructive' as const,
    },
    {
      title: 'Security',
      description: 'Password, two-factor authentication, and privacy',
      icon: Shield,
      href: '/settings/security',
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      hoverBorder: 'hover:border-violet-500/40',
    },
    {
      title: 'Appearance',
      description: 'Theme, colors, layout, and typography',
      icon: Palette,
      href: '/settings/appearance',
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
    },
    {
      title: 'Integrations',
      description: 'Third-party services and API connections',
      icon: Zap,
      href: '/settings/integrations',
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Manage your MintDesk account preferences and system settings
            </p>
          </div>
        </motion.div>

        {/* Enhanced Quick Settings */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickSettings.map((setting, index) => (
                  <motion.div key={setting.title} variants={itemVariants}>
                    <div className={`bg-gradient-to-br ${setting.gradient} border ${setting.border} rounded-lg p-4 ${setting.hoverBorder} transition-all duration-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${setting.iconBg} rounded-lg`}>
                            <setting.icon className={`h-5 w-5 ${setting.iconColor}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">{setting.title}</p>
                            <p className="text-gray-400 text-xs sm:text-sm">{setting.description}</p>
                          </div>
                        </div>
                        <Button
                          variant={setting.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setting.setValue(!setting.value)}
                          className={setting.value ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" : "hover:border-emerald-500/50 hover:text-emerald-400"}
                        >
                          {setting.value ? "On" : "Off"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Settings Sections */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {settingsSections.map((section, index) => (
            <motion.div key={section.title} variants={itemVariants}>
              <Link href={section.href}>
                <div className={`bg-gradient-to-br ${section.gradient} border ${section.border} rounded-lg p-4 sm:p-6 ${section.hoverBorder} transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-emerald-500/10 h-full`}>
                  <div className="flex items-start space-x-4">
                    <div className={`h-12 w-12 rounded-lg ${section.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {section.title}
                        </h3>
                        {section.badge && (
                          <Badge variant={section.badgeVariant} className="text-xs">
                            {section.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{section.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
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
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <Button 
                  variant="outline" 
                  className="mr-3 hover:border-emerald-500/50 hover:text-emerald-400"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline"
                  className="hover:border-emerald-500/50 hover:text-emerald-400"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Users, Activity, Server, Settings, AlertTriangle, CheckCircle, Clock, Database, Cpu, HardDrive, Network, Eye, Edit, Trash2, Download } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SystemHealth {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  lastBackup: string
  activeConnections: number
}

interface UserActivity {
  id: string
  user: string
  action: string
  timestamp: string
  ip: string
  userAgent: string
  status: 'success' | 'error' | 'warning'
}

interface SystemLog {
  id: string
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
  timestamp: string
  source: string
  details?: string
}

const mockSystemHealth: SystemHealth = {
  cpu: 23.5,
  memory: 67.2,
  disk: 45.8,
  network: 12.3,
  uptime: '15 days, 8 hours, 32 minutes',
  lastBackup: '2024-01-15T02:00:00Z',
  activeConnections: 156
}

const mockUserActivity: UserActivity[] = [
  {
    id: '1',
    user: 'john.doe@company.com',
    action: 'Login successful',
    timestamp: '2024-01-15T14:30:00Z',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success'
  },
  {
    id: '2',
    user: 'sarah.wilson@company.com',
    action: 'Created ticket #1247',
    timestamp: '2024-01-15T14:25:00Z',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success'
  },
  {
    id: '3',
    user: 'mike.johnson@company.com',
    action: 'Failed login attempt',
    timestamp: '2024-01-15T14:20:00Z',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'error'
  },
  {
    id: '4',
    user: 'jane.smith@company.com',
    action: 'Updated user permissions',
    timestamp: '2024-01-15T14:15:00Z',
    ip: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Linux; x86_64)',
    status: 'success'
  }
]

const mockSystemLogs: SystemLog[] = [
  {
    id: '1',
    level: 'info',
    message: 'Database backup completed successfully',
    timestamp: '2024-01-15T14:30:00Z',
    source: 'backup-service'
  },
  {
    id: '2',
    level: 'warning',
    message: 'High memory usage detected',
    timestamp: '2024-01-15T14:25:00Z',
    source: 'system-monitor',
    details: 'Memory usage at 85%'
  },
  {
    id: '3',
    level: 'error',
    message: 'Failed to connect to external API',
    timestamp: '2024-01-15T14:20:00Z',
    source: 'api-service',
    details: 'Connection timeout after 30 seconds'
  },
  {
    id: '4',
    level: 'debug',
    message: 'User session created',
    timestamp: '2024-01-15T14:15:00Z',
    source: 'auth-service'
  }
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-emerald-500'
    case 'error': return 'bg-red-500'
    case 'warning': return 'bg-amber-500'
    default: return 'bg-gray-500'
  }
}

const getLogLevelColor = (level: string) => {
  switch (level) {
    case 'info': return 'bg-blue-500'
    case 'warning': return 'bg-amber-500'
    case 'error': return 'bg-red-500'
    case 'debug': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

export default function AdminDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(mockSystemHealth)
  const [userActivity, setUserActivity] = useState<UserActivity[]>(mockUserActivity)
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(mockSystemLogs)
  const [selectedTab, setSelectedTab] = useState('overview')

  const systemMetrics = [
    {
      title: 'CPU Usage',
      value: `${systemHealth.cpu}%`,
      icon: Cpu,
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
    },
    {
      title: 'Memory Usage',
      value: `${systemHealth.memory}%`,
      icon: HardDrive,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
    {
      title: 'Disk Usage',
      value: `${systemHealth.disk}%`,
      icon: Database,
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
    },
    {
      title: 'Network',
      value: `${systemHealth.network} MB/s`,
      icon: Network,
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      hoverBorder: 'hover:border-violet-500/40',
    },
  ]

  const quickActions = [
    {
      title: 'Backup Database',
      icon: Database,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
    {
      title: 'System Settings',
      icon: Settings,
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
    },
    {
      title: 'User Management',
      icon: Users,
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      hoverBorder: 'hover:border-violet-500/40',
    },
    {
      title: 'Security Settings',
      icon: Shield,
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
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

  const refreshData = async () => {
    // Simulate data refresh
    console.log('Refreshing admin data...')
  }

  const exportLogs = () => {
    // Simulate log export
    console.log('Exporting system logs...')
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
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              MintDesk system administration and monitoring
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={refreshData}
              className="hover:border-emerald-500/50 hover:text-emerald-400"
            >
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={exportLogs}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </motion.div>

        {/* Enhanced System Health Overview */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {systemMetrics.map((metric, index) => (
            <motion.div key={metric.title} variants={itemVariants}>
              <div className={`bg-gradient-to-br ${metric.gradient} border ${metric.border} rounded-lg p-3 sm:p-4 ${metric.hoverBorder} transition-all duration-200`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${metric.iconBg} rounded-lg`}>
                    <metric.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${metric.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">{metric.title}</p>
                    <p className="text-white text-lg sm:text-2xl font-bold">{metric.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced System Information & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* System Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  <Server className="h-5 w-5" />
                  <span>System Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Uptime</span>
                  <span className="text-white text-sm">{systemHealth.uptime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Active Connections</span>
                  <span className="text-white text-sm">{systemHealth.activeConnections}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Last Backup</span>
                  <span className="text-white text-sm">{formatDate(systemHealth.lastBackup)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">System Status</span>
                  <Badge variant="default" className="bg-emerald-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  <Activity className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start ${action.hoverBorder} hover:text-emerald-400`}
                    >
                      <action.icon className={`h-4 w-4 mr-2 ${action.iconColor}`} />
                      {action.title}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced User Activity & System Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* User Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  <Users className="h-5 w-5" />
                  <span>Recent User Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                        <div>
                          <p className="text-white text-sm font-medium">{activity.user}</p>
                          <p className="text-gray-400 text-xs">{activity.action}</p>
                          <p className="text-gray-500 text-xs">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">{activity.ip}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  <Activity className="h-5 w-5" />
                  <span>System Logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${getLogLevelColor(log.level)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium">{log.message}</p>
                          <Badge variant="outline" className="text-xs uppercase">
                            {log.level}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs">{log.source}</p>
                        <p className="text-gray-500 text-xs">{formatDate(log.timestamp)}</p>
                        {log.details && (
                          <p className="text-gray-400 text-xs mt-1">{log.details}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Alerts & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                <AlertTriangle className="h-5 w-5" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-white font-medium">High Memory Usage</p>
                      <p className="text-gray-400 text-sm">Memory usage is at 85%</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:border-amber-500/50 hover:text-amber-400">
                    Dismiss
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-white font-medium">Backup Completed</p>
                      <p className="text-gray-400 text-sm">Database backup completed successfully</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:border-emerald-500/50 hover:text-emerald-400">
                    View Details
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  )
} 
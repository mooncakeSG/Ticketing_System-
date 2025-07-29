'use client'

import { useState, useEffect } from 'react'
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
    case 'success': return 'bg-green-500'
    case 'error': return 'bg-red-500'
    case 'warning': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getLogLevelColor = (level: string) => {
  switch (level) {
    case 'info': return 'bg-blue-500'
    case 'warning': return 'bg-yellow-500'
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">System administration and monitoring</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={refreshData}>
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">CPU Usage</p>
                  <p className="text-white text-2xl font-bold">{systemHealth.cpu}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <HardDrive className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Memory Usage</p>
                  <p className="text-white text-2xl font-bold">{systemHealth.memory}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Disk Usage</p>
                  <p className="text-white text-2xl font-bold">{systemHealth.disk}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Network className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Network</p>
                  <p className="text-white text-2xl font-bold">{systemHealth.network} MB/s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>System Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Uptime</span>
                <span className="text-white">{systemHealth.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Connections</span>
                <span className="text-white">{systemHealth.activeConnections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Backup</span>
                <span className="text-white">{formatDate(systemHealth.lastBackup)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">System Status</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Backup Database
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Activity & System Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Recent User Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-white font-medium">High Memory Usage</p>
                    <p className="text-gray-400 text-sm">Memory usage is at 85%</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Dismiss
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-white font-medium">Backup Completed</p>
                    <p className="text-gray-400 text-sm">Database backup completed successfully</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 
'use client'

import { useState } from 'react'
import { ArrowLeft, Search, Filter, Download, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SystemLog {
  id: string
  level: 'info' | 'warning' | 'error' | 'debug' | 'critical'
  message: string
  timestamp: string
  source: string
  details?: string
  userId?: string
  ip?: string
  userAgent?: string
  stackTrace?: string
}

const mockLogs: SystemLog[] = [
  {
    id: '1',
    level: 'info',
    message: 'Database backup completed successfully',
    timestamp: '2024-01-15T14:30:00Z',
    source: 'backup-service',
    details: 'Backup size: 2.3GB, Duration: 15 minutes'
  },
  {
    id: '2',
    level: 'warning',
    message: 'High memory usage detected',
    timestamp: '2024-01-15T14:25:00Z',
    source: 'system-monitor',
    details: 'Memory usage at 85% - consider scaling'
  },
  {
    id: '3',
    level: 'error',
    message: 'Failed to connect to external API',
    timestamp: '2024-01-15T14:20:00Z',
    source: 'api-service',
    details: 'Connection timeout after 30 seconds',
    stackTrace: 'Error: connect ECONNREFUSED 127.0.0.1:3001\n    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)'
  },
  {
    id: '4',
    level: 'debug',
    message: 'User session created',
    timestamp: '2024-01-15T14:15:00Z',
    source: 'auth-service',
    userId: 'user-123',
    ip: '192.168.1.100'
  },
  {
    id: '5',
    level: 'critical',
    message: 'Database connection pool exhausted',
    timestamp: '2024-01-15T14:10:00Z',
    source: 'database-service',
    details: 'All connections in use, new requests queued'
  },
  {
    id: '6',
    level: 'info',
    message: 'Email notification sent',
    timestamp: '2024-01-15T14:05:00Z',
    source: 'email-service',
    details: 'To: john.doe@company.com, Subject: Ticket Update'
  },
  {
    id: '7',
    level: 'error',
    message: 'File upload failed',
    timestamp: '2024-01-15T14:00:00Z',
    source: 'file-service',
    details: 'File size exceeds limit: 50MB',
    userId: 'user-456',
    ip: '192.168.1.101'
  },
  {
    id: '8',
    level: 'warning',
    message: 'Slow query detected',
    timestamp: '2024-01-15T13:55:00Z',
    source: 'database-service',
    details: 'Query took 2.3 seconds to execute'
  }
]

const logLevels = [
  { id: 'all', name: 'All Levels', color: 'bg-gray-500' },
  { id: 'info', name: 'Info', color: 'bg-blue-500' },
  { id: 'warning', name: 'Warning', color: 'bg-yellow-500' },
  { id: 'error', name: 'Error', color: 'bg-red-500' },
  { id: 'critical', name: 'Critical', color: 'bg-red-600' },
  { id: 'debug', name: 'Debug', color: 'bg-gray-400' }
]

const sources = [
  'all',
  'backup-service',
  'system-monitor',
  'api-service',
  'auth-service',
  'database-service',
  'email-service',
  'file-service'
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'info': return 'bg-blue-500'
    case 'warning': return 'bg-yellow-500'
    case 'error': return 'bg-red-500'
    case 'critical': return 'bg-red-600'
    case 'debug': return 'bg-gray-400'
    default: return 'bg-gray-500'
  }
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'info': return <Info className="h-4 w-4" />
    case 'warning': return <AlertTriangle className="h-4 w-4" />
    case 'error': return <XCircle className="h-4 w-4" />
    case 'critical': return <XCircle className="h-4 w-4" />
    case 'debug': return <Info className="h-4 w-4" />
    default: return <Info className="h-4 w-4" />
  }
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel
    const matchesSource = selectedSource === 'all' || log.source === selectedSource
    
    return matchesSearch && matchesLevel && matchesSource
  })

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const handleExport = () => {
    // Simulate log export
    console.log('Exporting logs...')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLevel('all')
    setSelectedSource('all')
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">System Logs</h1>
              <p className="text-gray-400">Monitor and analyze system activity</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              {/* Level and Source Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Log Level</label>
                  <div className="flex flex-wrap gap-2">
                    {logLevels.map((level) => (
                      <Button
                        key={level.id}
                        variant={selectedLevel === level.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedLevel(level.id)}
                      >
                        <div className={`w-2 h-2 rounded-full ${level.color} mr-2`}></div>
                        {level.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Source</label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  >
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source === 'all' ? 'All Sources' : source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  Showing {filteredLogs.length} of {logs.length} logs
                </span>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getLevelColor(log.level)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getLevelIcon(log.level)}
                            <p className="text-white font-medium">{log.message}</p>
                            <Badge variant="outline" className="text-xs uppercase">
                              {log.level}
                            </Badge>
                          </div>
                          <span className="text-gray-400 text-sm">{formatDate(log.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                          <span>Source: {log.source}</span>
                          {log.userId && <span>User: {log.userId}</span>}
                          {log.ip && <span>IP: {log.ip}</span>}
                        </div>
                        
                        {log.details && (
                          <p className="text-gray-300 text-sm mb-2">{log.details}</p>
                        )}
                        
                        {log.stackTrace && showDetails === log.id && (
                          <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                            <p className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                              {log.stackTrace}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {log.stackTrace && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                        >
                          {showDetails === log.id ? 'Hide' : 'Show'} Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredLogs.length === 0 && (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No logs found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 
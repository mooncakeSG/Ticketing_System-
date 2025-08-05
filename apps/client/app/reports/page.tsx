'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ReportData {
  id: string
  name: string
  description: string
  type: 'ticket' | 'time' | 'user' | 'performance'
  lastGenerated: string
  status: 'ready' | 'generating' | 'error'
  format: 'pdf' | 'excel' | 'csv'
}

const mockReports: ReportData[] = [
  {
    id: '1',
    name: 'Ticket Summary Report',
    description: 'Comprehensive overview of all tickets with status, priority, and resolution times',
    type: 'ticket',
    lastGenerated: '2024-01-15T10:30:00Z',
    status: 'ready',
    format: 'pdf'
  },
  {
    id: '2',
    name: 'Time Tracking Report',
    description: 'Detailed time entries with billable hours and productivity metrics',
    type: 'time',
    lastGenerated: '2024-01-14T16:45:00Z',
    status: 'ready',
    format: 'excel'
  },
  {
    id: '3',
    name: 'User Performance Report',
    description: 'Individual user statistics including tickets resolved and average resolution time',
    type: 'user',
    lastGenerated: '2024-01-13T14:20:00Z',
    status: 'ready',
    format: 'pdf'
  },
  {
    id: '4',
    name: 'System Performance Report',
    description: 'System health metrics including response times and error rates',
    type: 'performance',
    lastGenerated: '2024-01-12T09:15:00Z',
    status: 'ready',
    format: 'csv'
  }
]

const reportTypes = [
  { id: 'ticket', name: 'Ticket Reports', icon: FileText, color: 'text-emerald-500' },
  { id: 'time', name: 'Time Reports', icon: Clock, color: 'text-blue-500' },
  { id: 'user', name: 'User Reports', icon: Users, color: 'text-violet-500' },
  { id: 'performance', name: 'Performance Reports', icon: TrendingUp, color: 'text-amber-500' }
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
    case 'ready': return 'bg-emerald-500'
    case 'generating': return 'bg-amber-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'ready': return 'Ready'
    case 'generating': return 'Generating'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
}

export default function Reports() {
  const [reports, setReports] = useState<ReportData[]>(mockReports)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [dateRange, setDateRange] = useState('30d')
  const [generating, setGenerating] = useState<string | null>(null)

  const handleGenerateReport = async (reportId: string) => {
    setGenerating(reportId)
    // Simulate report generation
    setTimeout(() => {
      setGenerating(null)
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'ready' as const }
          : report
      ))
    }, 2000)
  }

  const handleDownloadReport = (reportId: string) => {
    // Simulate download
    console.log(`Downloading report ${reportId}`)
  }

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedType)

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
              Reports
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Generate and download comprehensive reports
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="flex items-center space-x-2 text-sm w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
              <BarChart3 className="h-4 w-4" />
              <span>New Report</span>
            </Button>
          </div>
        </motion.div>

        {/* Report Type Filters */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {reportTypes.map((type) => {
            const Icon = type.icon
            return (
              <motion.div key={type.id} variants={itemVariants}>
                <button
                  onClick={() => setSelectedType(selectedType === type.id ? 'all' : type.id)}
                  className={`w-full h-auto py-3 px-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedType === type.id
                      ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${type.color}`} />
                    <span className="text-sm sm:text-base font-medium truncate">{type.name}</span>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Reports */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white">Today's Tickets</p>
                    <p className="text-xs sm:text-sm text-gray-400">Quick summary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 cursor-pointer">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white">Time Tracking</p>
                    <p className="text-xs sm:text-sm text-gray-400">Weekly report</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/10 border-violet-500/20 hover:border-violet-500/40 transition-all duration-200 cursor-pointer">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white">User Activity</p>
                    <p className="text-xs sm:text-sm text-gray-400">Monthly stats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20 hover:border-amber-500/40 transition-all duration-200 cursor-pointer">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white">Performance</p>
                    <p className="text-xs sm:text-sm text-gray-400">System metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Reports List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                variants={itemVariants}
                layout
                className="group"
              >
                <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <FileText className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm sm:text-base truncate group-hover:text-emerald-400 transition-colors">
                              {report.name}
                            </h3>
                            <p className="text-gray-400 text-xs sm:text-sm truncate">
                              {report.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {report.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {report.format.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>Last generated: {formatDate(report.lastGenerated)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
                          <span className="text-xs text-gray-400">{getStatusText(report.status)}</span>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {report.status === 'ready' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-emerald-500/20 hover:text-emerald-400"
                              onClick={(e) => {
                                e.preventDefault()
                                handleDownloadReport(report.id)
                              }}
                            >
                              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-emerald-500/20 hover:text-emerald-400"
                              onClick={(e) => {
                                e.preventDefault()
                                handleGenerateReport(report.id)
                              }}
                              disabled={generating === report.id}
                            >
                              {generating === report.id ? (
                                <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                              ) : (
                                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </MainLayout>
  )
} 
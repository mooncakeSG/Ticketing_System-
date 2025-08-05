'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Users, Ticket, AlertCircle, CheckCircle, Download, Calendar, Filter, RefreshCw } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AnalyticsData {
  totalTickets: number
  openTickets: number
  closedTickets: number
  avgResolutionTime: number
  totalUsers: number
  activeUsers: number
  responseTime: number
  satisfactionRate: number
  ticketsByPriority: {
    low: number
    medium: number
    high: number
  }
  ticketsByStatus: {
    open: number
    inProgress: number
    closed: number
  }
  ticketsByCategory: {
    bug: number
    feature: number
    support: number
    other: number
  }
  weeklyTrends: {
    date: string
    opened: number
    closed: number
  }[]
  topUsers: {
    name: string
    tickets: number
    resolutionTime: number
  }[]
}

const mockAnalyticsData: AnalyticsData = {
  totalTickets: 1247,
  openTickets: 89,
  closedTickets: 1158,
  avgResolutionTime: 2.4,
  totalUsers: 156,
  activeUsers: 89,
  responseTime: 4.2,
  satisfactionRate: 94.5,
  ticketsByPriority: {
    low: 45,
    medium: 32,
    high: 12
  },
  ticketsByStatus: {
    open: 89,
    inProgress: 23,
    closed: 1158
  },
  ticketsByCategory: {
    bug: 67,
    feature: 34,
    support: 28,
    other: 12
  },
  weeklyTrends: [
    { date: '2024-01-08', opened: 12, closed: 15 },
    { date: '2024-01-09', opened: 18, closed: 14 },
    { date: '2024-01-10', opened: 15, closed: 19 },
    { date: '2024-01-11', opened: 22, closed: 16 },
    { date: '2024-01-12', opened: 19, closed: 21 },
    { date: '2024-01-13', opened: 14, closed: 18 },
    { date: '2024-01-14', opened: 16, closed: 20 }
  ],
  topUsers: [
    { name: 'John Doe', tickets: 45, resolutionTime: 1.8 },
    { name: 'Sarah Wilson', tickets: 38, resolutionTime: 2.1 },
    { name: 'Mike Johnson', tickets: 32, resolutionTime: 2.5 },
    { name: 'Jane Smith', tickets: 28, resolutionTime: 2.8 },
    { name: 'David Brown', tickets: 25, resolutionTime: 3.2 }
  ]
}

const formatTime = (hours: number) => {
  return `${hours.toFixed(1)}h`
}

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const SimpleBarChart = ({ data, title, color = 'bg-emerald-500' }: { data: { [key: string]: number }, title: string, color?: string }) => {
  const maxValue = Math.max(...Object.values(data))
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-16 capitalize">{key}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${color} transition-all duration-300`}
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white w-8 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const LineChart = ({ data, title }: { data: { date: string, opened: number, closed: number }[], title: string }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.opened, d.closed]))
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-16">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <div className="flex-1 flex space-x-1">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(item.opened / maxValue) * 100}%` }}
                />
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(item.closed / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-white w-16 text-right">
              <span className="text-emerald-400">{item.opened}</span> / <span className="text-blue-400">{item.closed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('30d')

  const refreshData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const exportReport = () => {
    // Simulate export
    console.log('Exporting analytics report')
  }

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
              Analytics
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Comprehensive insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="flex items-center space-x-2 text-sm w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Total Tickets</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatNumber(data.totalTickets)}</p>
                  </div>
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40 transition-all duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Open Tickets</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatNumber(data.openTickets)}</p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/10 border-violet-500/20 hover:border-violet-500/40 transition-all duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Active Users</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatNumber(data.activeUsers)}</p>
                  </div>
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-violet-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20 hover:border-amber-500/40 transition-all duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Satisfaction</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatPercentage(data.satisfactionRate)}</p>
                  </div>
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  <span>Ticket Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SimpleBarChart 
                  data={data.ticketsByPriority} 
                  title="By Priority" 
                  color="bg-emerald-500"
                />
                <SimpleBarChart 
                  data={data.ticketsByStatus} 
                  title="By Status" 
                  color="bg-blue-500"
                />
                <SimpleBarChart 
                  data={data.ticketsByCategory} 
                  title="By Category" 
                  color="bg-violet-500"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span>Weekly Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={data.weeklyTrends} title="Opened vs Closed" />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  <span>Response Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{formatTime(data.responseTime)}</p>
                  <p className="text-sm text-gray-400 mt-2">Average response time</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>Resolution Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{formatTime(data.avgResolutionTime)}</p>
                  <p className="text-sm text-gray-400 mt-2">Average resolution time</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-emerald-400" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topUsers.slice(0, 3).map((user, index) => (
                    <div key={user.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-white">{user.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-emerald-400">{user.tickets} tickets</p>
                        <p className="text-xs text-gray-400">{formatTime(user.resolutionTime)} avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  )
} 
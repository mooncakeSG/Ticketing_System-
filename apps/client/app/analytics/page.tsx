'use client'

import { useState, useEffect } from 'react'
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

const SimpleBarChart = ({ data, title, color = 'bg-blue-500' }: { data: { [key: string]: number }, title: string, color?: string }) => {
  const maxValue = Math.max(...Object.values(data))
  
  return (
    <div className="space-y-3">
      <h3 className="text-white font-medium">{title}</h3>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 capitalize">{key}</span>
            <span className="text-white">{value}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`${color} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${(value / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

const LineChart = ({ data, title }: { data: { date: string, opened: number, closed: number }[], title: string }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.opened, d.closed]))
  
  return (
    <div className="space-y-3">
      <h3 className="text-white font-medium">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
              <div className="flex space-x-4">
                <span className="text-green-400">Opened: {item.opened}</span>
                <span className="text-red-400">Closed: {item.closed}</span>
              </div>
            </div>
            <div className="flex space-x-1 h-2">
              <div 
                className="bg-green-500 rounded-l-full transition-all duration-300"
                style={{ width: `${(item.opened / maxValue) * 50}%` }}
              ></div>
              <div 
                className="bg-red-500 rounded-r-full transition-all duration-300"
                style={{ width: `${(item.closed / maxValue) * 50}%` }}
              ></div>
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
  const [timeRange, setTimeRange] = useState('7d')

  const refreshData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const exportReport = () => {
    // Simulate report export
    console.log('Exporting analytics report...')
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Track performance and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Tickets</p>
                  <p className="text-white text-2xl font-bold">{formatNumber(data.totalTickets)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Resolution Rate</p>
                  <p className="text-white text-2xl font-bold">{formatPercentage((data.closedTickets / data.totalTickets) * 100)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Resolution Time</p>
                  <p className="text-white text-2xl font-bold">{formatTime(data.avgResolutionTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-white text-2xl font-bold">{data.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Weekly Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={data.weeklyTrends} title="Ticket Activity" />
            </CardContent>
          </Card>

          {/* Tickets by Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Tickets by Priority</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart 
                data={data.ticketsByPriority} 
                title="Priority Distribution"
                color="bg-red-500"
              />
            </CardContent>
          </Card>

          {/* Tickets by Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Tickets by Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart 
                data={data.ticketsByStatus} 
                title="Status Distribution"
                color="bg-blue-500"
              />
            </CardContent>
          </Card>

          {/* Tickets by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Tickets by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart 
                data={data.ticketsByCategory} 
                title="Category Distribution"
                color="bg-green-500"
              />
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topUsers.map((user, index) => (
                  <div key={user.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.tickets} tickets resolved</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatTime(user.resolutionTime)}</p>
                      <p className="text-gray-400 text-sm">avg time</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-white">Satisfaction Rate</span>
                  </div>
                  <Badge variant="default">{formatPercentage(data.satisfactionRate)}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-white">Response Time</span>
                  </div>
                  <Badge variant="secondary">{formatTime(data.responseTime)}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-white">Active Users</span>
                  </div>
                  <Badge variant="outline">{data.activeUsers}/{data.totalUsers}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Ticket className="h-4 w-4 text-yellow-500" />
                    </div>
                    <span className="text-white">Open Tickets</span>
                  </div>
                  <Badge variant="destructive">{data.openTickets}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 
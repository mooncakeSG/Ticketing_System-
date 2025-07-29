'use client'

import { useState } from 'react'
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
  { id: 'ticket', name: 'Ticket Reports', icon: FileText, color: 'text-blue-500' },
  { id: 'time', name: 'Time Reports', icon: Clock, color: 'text-green-500' },
  { id: 'user', name: 'User Reports', icon: Users, color: 'text-purple-500' },
  { id: 'performance', name: 'Performance Reports', icon: TrendingUp, color: 'text-yellow-500' }
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
    case 'ready': return 'bg-green-500'
    case 'generating': return 'bg-yellow-500'
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
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGenerating(null)
  }

  const handleDownloadReport = (reportId: string) => {
    // Simulate download
    console.log(`Downloading report ${reportId}`)
  }

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedType)

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports</h1>
            <p className="text-gray-400 mt-1">Generate and download detailed analytics reports</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        {/* Report Type Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Report Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                className="justify-start"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                All Reports
              </Button>
              {reportTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? 'default' : 'outline'}
                  onClick={() => setSelectedType(type.id)}
                  className="justify-start"
                >
                  <type.icon className={`h-4 w-4 mr-2 ${type.color}`} />
                  {type.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{report.name}</CardTitle>
                  <Badge 
                    variant={report.status === 'ready' ? 'default' : report.status === 'error' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {getStatusText(report.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">{report.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Last Generated:</span>
                  <span className="text-white">{formatDate(report.lastGenerated)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Format:</span>
                  <Badge variant="outline" className="text-xs uppercase">
                    {report.format}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  {report.status === 'ready' ? (
                    <Button
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={generating === report.id}
                      className="flex-1"
                    >
                      {generating === report.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      {generating === report.id ? 'Generating...' : 'Generate'}
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Daily Summary</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Clock className="h-6 w-6" />
                <span className="text-sm">Time Report</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">User Activity</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Performance</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-700 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Executive Summary</h3>
                  <p className="text-gray-400 text-sm mb-3">High-level overview for management</p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
                
                <div className="p-4 border border-gray-700 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Team Performance</h3>
                  <p className="text-gray-400 text-sm mb-3">Detailed team metrics and KPIs</p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
                
                <div className="p-4 border border-gray-700 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Customer Support</h3>
                  <p className="text-gray-400 text-sm mb-3">Support ticket analysis and trends</p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 
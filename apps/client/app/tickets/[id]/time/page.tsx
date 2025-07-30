'use client'

import { useState } from 'react'
import { ArrowLeft, Play, Pause, Square, Clock, Timer, Calendar, BarChart3, Download, Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TimeEntry {
  id: string
  description: string
  hours: number
  minutes: number
  date: string
  user: string
  category: 'development' | 'testing' | 'research' | 'meeting' | 'other'
  isBillable: boolean
  isRunning?: boolean
  startTime?: string
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    description: 'Initial investigation of the authentication issue',
    hours: 2,
    minutes: 30,
    date: '2024-01-15',
    user: 'John Doe',
    category: 'research',
    isBillable: true
  },
  {
    id: '2',
    description: 'Code review and testing of the fix',
    hours: 1,
    minutes: 45,
    date: '2024-01-15',
    user: 'Sarah Wilson',
    category: 'testing',
    isBillable: true
  },
  {
    id: '3',
    description: 'Team meeting to discuss the solution',
    hours: 0,
    minutes: 30,
    date: '2024-01-15',
    user: 'Mike Johnson',
    category: 'meeting',
    isBillable: false
  },
  {
    id: '4',
    description: 'Implementing the authentication fix',
    hours: 3,
    minutes: 15,
    date: '2024-01-14',
    user: 'John Doe',
    category: 'development',
    isBillable: true,
    isRunning: true,
    startTime: '2024-01-15T14:30:00Z'
  }
]

const categories = [
  { id: 'development', name: 'Development', color: 'bg-blue-500' },
  { id: 'testing', name: 'Testing', color: 'bg-green-500' },
  { id: 'research', name: 'Research', color: 'bg-yellow-500' },
  { id: 'meeting', name: 'Meeting', color: 'bg-purple-500' },
  { id: 'other', name: 'Other', color: 'bg-gray-500' }
]

const formatTime = (hours: number, minutes: number) => {
  return `${hours}h ${minutes}m`
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCategoryColor = (category: string) => {
  const cat = categories.find(c => c.id === category)
  return cat?.color || 'bg-gray-500'
}

export default function TicketTimeTracking() {
  const params = useParams()
  const ticketId = params.id as string
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries)
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    description: '',
    hours: 0,
    minutes: 0,
    category: 'development' as const,
    isBillable: true
  })
  const [editingEntry, setEditingEntry] = useState<string | null>(null)

  const totalTime = timeEntries.reduce((total, entry) => {
    return total + (entry.hours * 60 + entry.minutes)
  }, 0)

  const billableTime = timeEntries
    .filter(entry => entry.isBillable)
    .reduce((total, entry) => {
      return total + (entry.hours * 60 + entry.minutes)
    }, 0)

  const runningEntry = timeEntries.find(entry => entry.isRunning)

  const handleAddEntry = () => {
    if (!newEntry.description.trim()) return

    const entry: TimeEntry = {
      id: `new-${Date.now()}`,
      description: newEntry.description,
      hours: newEntry.hours,
      minutes: newEntry.minutes,
      date: new Date().toISOString().split('T')[0],
      user: 'Current User',
      category: newEntry.category,
      isBillable: newEntry.isBillable
    }

    setTimeEntries(prev => [entry, ...prev])
    setNewEntry({
      description: '',
      hours: 0,
      minutes: 0,
      category: 'development',
      isBillable: true
    })
    setIsAddingEntry(false)
  }

  const handleStartTimer = () => {
    const entry: TimeEntry = {
      id: `timer-${Date.now()}`,
      description: 'Time tracking session',
      hours: 0,
      minutes: 0,
      date: new Date().toISOString().split('T')[0],
      user: 'Current User',
      category: 'development',
      isBillable: true,
      isRunning: true,
      startTime: new Date().toISOString()
    }

    setTimeEntries(prev => [entry, ...prev])
  }

  const handleStopTimer = (entryId: string) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, isRunning: false }
        : entry
    ))
  }

  const handleDeleteEntry = (entryId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
  }

  const handleEditEntry = (entryId: string, updatedEntry: Partial<TimeEntry>) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, ...updatedEntry }
        : entry
    ))
    setEditingEntry(null)
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/tickets/${ticketId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Time Tracking</h1>
              <p className="text-gray-400">Track time spent on ticket #{ticketId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setIsAddingEntry(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
            {!runningEntry && (
              <Button onClick={handleStartTimer}>
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
            )}
          </div>
        </div>

        {/* Time Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">Total Time</p>
                  <p className="text-white text-xl font-bold">{formatDuration(totalTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Timer className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-gray-400 text-sm">Billable Time</p>
                  <p className="text-white text-xl font-bold">{formatDuration(billableTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-gray-400 text-sm">Entries</p>
                  <p className="text-white text-xl font-bold">{timeEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Running Timer */}
        {runningEntry && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Play className="h-5 w-5 text-green-500" />
                <span>Timer Running</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{runningEntry.description}</p>
                  <p className="text-gray-400 text-sm">Started at {formatDate(runningEntry.startTime!)}</p>
                </div>
                <Button onClick={() => handleStopTimer(runningEntry.id)}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Timer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Time Entry */}
        {isAddingEntry && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Add Time Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium">Description</label>
                  <textarea
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What did you work on?"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Hours</label>
                    <input
                      type="number"
                      value={newEntry.hours}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mt-1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Minutes</label>
                    <input
                      type="number"
                      value={newEntry.minutes}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mt-1"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Category</label>
                    <select
                      value={newEntry.category}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mt-1"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="billable"
                      checked={newEntry.isBillable}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, isBillable: e.target.checked }))}
                      className="rounded border-gray-600"
                    />
                    <label htmlFor="billable" className="text-sm text-gray-400">
                      Billable
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={handleAddEntry} disabled={!newEntry.description.trim()}>
                    Add Entry
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Entries List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Time Entries</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(entry.category)}`}></div>
                    <div>
                      <p className="text-white font-medium">{entry.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{entry.user}</span>
                        <span>•</span>
                        <span>{formatDate(entry.date)}</span>
                        <span>•</span>
                        <span>{formatTime(entry.hours, entry.minutes)}</span>
                        {entry.isBillable && (
                          <>
                            <span>•</span>
                            <Badge variant="default" className="text-xs">Billable</Badge>
                          </>
                        )}
                        {entry.isRunning && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">Running</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingEntry(entry.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {timeEntries.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No time entries yet</p>
                  <p className="text-gray-500 text-sm">Start tracking time to monitor progress</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 
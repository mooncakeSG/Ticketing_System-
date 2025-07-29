'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  Clock,
  Ticket,
  CheckCircle,
  AlertCircle,
  Edit,
  MoreVertical
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  phone?: string;
  department?: string;
  created_at: string;
  last_login?: string;
  tickets_assigned: number;
  tickets_resolved: number;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    status: 'active',
    phone: '+1 (555) 123-4567',
    department: 'IT Support',
    created_at: '2024-01-10T09:00:00Z',
    last_login: '2024-01-15T14:30:00Z',
    tickets_assigned: 15,
    tickets_resolved: 12,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'agent',
    status: 'active',
    phone: '+1 (555) 234-5678',
    department: 'Customer Support',
    created_at: '2024-01-08T10:30:00Z',
    last_login: '2024-01-15T13:45:00Z',
    tickets_assigned: 23,
    tickets_resolved: 20,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'agent',
    status: 'active',
    phone: '+1 (555) 345-6789',
    department: 'Technical Support',
    created_at: '2024-01-05T11:15:00Z',
    last_login: '2024-01-15T12:20:00Z',
    tickets_assigned: 18,
    tickets_resolved: 16,
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    role: 'user',
    status: 'active',
    phone: '+1 (555) 456-7890',
    department: 'Marketing',
    created_at: '2024-01-12T14:00:00Z',
    last_login: '2024-01-15T10:15:00Z',
    tickets_assigned: 5,
    tickets_resolved: 3,
  },
  {
    id: '5',
    name: 'David Smith',
    email: 'david.smith@company.com',
    role: 'agent',
    status: 'inactive',
    phone: '+1 (555) 567-8901',
    department: 'System Administration',
    created_at: '2024-01-03T08:45:00Z',
    last_login: '2024-01-10T16:30:00Z',
    tickets_assigned: 8,
    tickets_resolved: 7,
  },
  {
    id: '6',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    role: 'user',
    status: 'pending',
    phone: '+1 (555) 678-9012',
    department: 'Sales',
    created_at: '2024-01-14T15:30:00Z',
    tickets_assigned: 2,
    tickets_resolved: 0,
  },
];

export default function UserDetail() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params.id as string

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        const foundUser = mockUsers.find(u => u.id === userId)
        if (!foundUser) {
          setError('User not found')
          return
        }
        setUser(foundUser)
      } catch (err) {
        setError('Failed to load user')
        console.error('Error fetching user:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const roleColors = {
    admin: 'destructive',
    agent: 'warning',
    user: 'info',
  } as const

  const statusColors = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
  } as const

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </MainLayout>
    )
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'User not found'}</p>
            <Button onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/users">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-xl">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400 mt-1">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge 
              variant={roleColors[user.role] as any}
              className="text-sm"
            >
              {user.role}
            </Badge>
            <Badge 
              variant={statusColors[user.status] as any}
              className="text-sm"
            >
              {user.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Ticket className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{user.tickets_assigned}</p>
                      <p className="text-sm text-gray-400">Tickets Assigned</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{user.tickets_resolved}</p>
                      <p className="text-sm text-gray-400">Tickets Resolved</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{user.tickets_assigned - user.tickets_resolved}</p>
                      <p className="text-sm text-gray-400">Open Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Last login</p>
                        <p className="text-gray-400 text-xs">
                          {user.last_login ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true }) : 'Never'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Account created</p>
                        <p className="text-gray-400 text-xs">
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Role</span>
                    <Badge variant={roleColors[user.role] as any}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <Badge variant={statusColors[user.status] as any}>
                      {user.status}
                    </Badge>
                  </div>
                  {user.department && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Department</span>
                      <span className="text-white text-sm">{user.department}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Phone</span>
                      <span className="text-white text-sm">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white text-sm">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {user.last_login && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Login</span>
                      <span className="text-white text-sm">
                        {formatDistanceToNow(new Date(user.last_login), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Role
                  </Button>
                  {user.status === 'active' ? (
                    <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300">
                      Deactivate User
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full justify-start text-green-400 hover:text-green-300">
                      Activate User
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 
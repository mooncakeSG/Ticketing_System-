'use client'

import { useState } from 'react'
import { ArrowLeft, Search, Filter, Edit, Trash2, Shield, UserCheck, UserX, Clock, Activity, Mail, Phone, MapPin, Calendar, Eye, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'agent' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  department: string
  lastLogin: string
  createdAt: string
  ticketsResolved: number
  avgResolutionTime: number
  permissions: string[]
  phone?: string
  location?: string
  avatar?: string
}

const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    status: 'active',
    department: 'IT Support',
    lastLogin: '2024-01-15T14:30:00Z',
    createdAt: '2023-01-15T10:00:00Z',
    ticketsResolved: 156,
    avgResolutionTime: 2.1,
    permissions: ['all'],
    phone: '+1 (555) 123-4567',
    location: 'New York, NY'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'manager',
    status: 'active',
    department: 'Customer Support',
    lastLogin: '2024-01-15T13:45:00Z',
    createdAt: '2023-03-20T09:00:00Z',
    ticketsResolved: 89,
    avgResolutionTime: 3.2,
    permissions: ['tickets', 'users', 'reports'],
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'agent',
    status: 'active',
    department: 'Technical Support',
    lastLogin: '2024-01-15T12:20:00Z',
    createdAt: '2023-06-10T14:00:00Z',
    ticketsResolved: 67,
    avgResolutionTime: 4.5,
    permissions: ['tickets', 'comments'],
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL'
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'user',
    status: 'inactive',
    department: 'Marketing',
    lastLogin: '2024-01-10T16:15:00Z',
    createdAt: '2023-08-05T11:00:00Z',
    ticketsResolved: 0,
    avgResolutionTime: 0,
    permissions: ['tickets'],
    phone: '+1 (555) 456-7890',
    location: 'Boston, MA'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'agent',
    status: 'suspended',
    department: 'Sales Support',
    lastLogin: '2024-01-12T09:30:00Z',
    createdAt: '2023-09-15T13:00:00Z',
    ticketsResolved: 34,
    avgResolutionTime: 6.8,
    permissions: ['tickets'],
    phone: '+1 (555) 567-8901',
    location: 'Miami, FL'
  }
]

const roles = [
  { id: 'all', name: 'All Roles', color: 'bg-gray-500' },
  { id: 'admin', name: 'Admin', color: 'bg-red-500' },
  { id: 'manager', name: 'Manager', color: 'bg-blue-500' },
  { id: 'agent', name: 'Agent', color: 'bg-green-500' },
  { id: 'user', name: 'User', color: 'bg-gray-400' }
]

const statuses = [
  { id: 'all', name: 'All Status', color: 'bg-gray-500' },
  { id: 'active', name: 'Active', color: 'bg-green-500' },
  { id: 'inactive', name: 'Inactive', color: 'bg-yellow-500' },
  { id: 'suspended', name: 'Suspended', color: 'bg-red-500' }
]

const departments = [
  'all',
  'IT Support',
  'Customer Support',
  'Technical Support',
  'Sales Support',
  'Marketing',
  'Engineering',
  'HR'
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

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-500'
    case 'manager': return 'bg-blue-500'
    case 'agent': return 'bg-green-500'
    case 'user': return 'bg-gray-400'
    default: return 'bg-gray-500'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'inactive': return 'bg-yellow-500'
    case 'suspended': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment
  })

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' }
        : user
    ))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length
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
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-gray-400">Manage users, roles, and permissions</p>
            </div>
          </div>
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-white text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-white text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <UserX className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Suspended</p>
                  <p className="text-white text-2xl font-bold">{stats.suspended}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Admins</p>
                  <p className="text-white text-2xl font-bold">{stats.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Role</label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <Button
                        key={role.id}
                        variant={selectedRole === role.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className={`w-2 h-2 rounded-full ${role.color} mr-2`}></div>
                        {role.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <Button
                        key={status.id}
                        variant={selectedStatus === status.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedStatus(status.id)}
                      >
                        <div className={`w-2 h-2 rounded-full ${status.color} mr-2`}></div>
                        {status.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-medium">{user.name}</h3>
                          <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                            {user.role}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(user.status)}`}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </span>
                          )}
                          {user.location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.location}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span>Department: {user.department}</span>
                          <span>Resolved: {user.ticketsResolved} tickets</span>
                          <span>Avg Time: {user.avgResolutionTime}h</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        {user.status === 'suspended' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Joined: {formatDate(user.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Last login: {formatDate(user.lastLogin)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-xs">Permissions:</span>
                        {user.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No users found</p>
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
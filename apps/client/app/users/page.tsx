'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Search, User, Mail, Phone, Shield, MoreVertical, Edit } from 'lucide-react'
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

// Mock users data
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

export default function UsersList() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'agent' | 'user'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')

  useEffect(() => {
    let filtered = users

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const activeUsers = users.filter(user => user.status === 'active')
  const inactiveUsers = users.filter(user => user.status === 'inactive')
  const pendingUsers = users.filter(user => user.status === 'pending')

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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="text-gray-400 mt-1">
              {filteredUsers.length} of {users.length} users
            </p>
          </div>
          <Link href="/users/create">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-white">{activeUsers.length}</p>
              </div>
              <Badge variant="success" className="text-xs">
                Active
              </Badge>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Inactive Users</p>
                <p className="text-2xl font-bold text-white">{inactiveUsers.length}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingUsers.length}</p>
              </div>
              <Badge variant="warning" className="text-xs">
                Pending
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? (
                <>
                  <p className="text-lg font-medium text-white mb-2">No users found</p>
                  <p className="text-gray-400">Try adjusting your filters</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-white mb-2">No users yet</p>
                  <p className="text-gray-400">Add your first user to get started</p>
                </>
              )}
            </div>
            <Link href="/users/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="min-w-0"
              >
                <Card className="h-full bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-white truncate">{user.name}</h3>
                          <p className="text-sm text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Badge variant={roleColors[user.role] as any} className="text-xs">
                          {user.role}
                        </Badge>
                        <Badge variant={statusColors[user.status] as any} className="text-xs">
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {user.department && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{user.department}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tickets Assigned</span>
                        <span className="text-white font-medium">{user.tickets_assigned}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tickets Resolved</span>
                        <span className="text-white font-medium">{user.tickets_resolved}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1">
                          <Link href={`/users/${user.id}`}>
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                              View Profile
                            </Button>
                          </Link>
                          <Link href={`/users/${user.id}/edit`}>
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
} 
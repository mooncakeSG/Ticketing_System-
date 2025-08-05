'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Search, User, Mail, Phone, Shield, MoreVertical, Edit, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'
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
  const [showFilters, setShowFilters] = useState(false)

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
  const adminUsers = users.filter(user => user.role === 'admin')

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
    {
      title: 'Active Users',
      value: activeUsers.length,
      icon: CheckCircle,
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers.length,
      icon: Clock,
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      hoverBorder: 'hover:border-violet-500/40',
    },
    {
      title: 'Pending Users',
      value: pendingUsers.length,
      icon: AlertCircle,
      gradient: 'from-amber-500/10 to-amber-600/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
    },
  ]

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

  const getAvatarGradient = (user: User) => {
    if (user.role === 'admin') {
      return 'bg-gradient-to-br from-red-500 to-red-600'
    } else if (user.role === 'agent') {
      return 'bg-gradient-to-br from-amber-500 to-amber-600'
    } else {
      return 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    }
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
              Users
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              {filteredUsers.length} of {users.length} users
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm hover:border-emerald-500/50 hover:text-emerald-400"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Link href="/users/create">
              <Button className="flex items-center space-x-2 text-sm w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <div className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-lg p-3 sm:p-4 ${stat.hoverBorder} transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                    <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-3 sm:p-4 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
                  />
                </div>

                {/* Role Filter */}
                <div className="flex items-center space-x-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
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
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Users Grid */}
        <AnimatePresence>
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-8 sm:p-12">
                <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? (
                  <>
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No users found</h3>
                    <p className="text-gray-400 mb-6 text-sm sm:text-base">Try adjusting your filters</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No users yet</h3>
                    <p className="text-gray-400 mb-6 text-sm sm:text-base">Add your first user to get started with MintDesk</p>
                  </>
                )}
                <Link href="/users/create">
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6"
            >
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  variants={itemVariants}
                  layout
                  className="min-w-0"
                >
                  <Card className="h-full bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-emerald-500/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`h-10 w-10 rounded-full ${getAvatarGradient(user)} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                            ) : (
                              getInitials(user.name)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">{user.name}</h3>
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
                              <Button variant="outline" size="sm" className="text-xs h-7 px-2 hover:border-emerald-500/50 hover:text-emerald-400">
                                View Profile
                              </Button>
                            </Link>
                            <Link href={`/users/${user.id}/edit`}>
                              <Button variant="outline" size="sm" className="text-xs h-7 px-2 hover:border-emerald-500/50 hover:text-emerald-400">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-emerald-500/20 hover:text-emerald-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { authApi, User } from '@/lib/api'
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X,
  AlertCircle,
  Ticket,
  MessageSquare,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    email: ''
  })

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/auth/login')
          return
        }
        
        const userData = await authApi.getCurrentUser()
        setUser(userData)
        setEditData({
          name: userData.name,
          email: userData.email
        })
      } catch (err) {
        setError('Failed to load profile')
        console.error('Error fetching user:', err)
        // If user is not authenticated, redirect to login
        localStorage.removeItem('auth_token')
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleSave = async () => {
    try {
      setLoading(true)
      const updatedUser = await authApi.updateProfile(editData)
      setUser(updatedUser)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getAvatarGradient = (user: User) => {
    if (user.isAdmin) {
      return 'bg-gradient-to-br from-red-500 to-red-600'
    } else {
      return 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    }
  }

  const accountStats = [
    {
      title: 'Tickets Created',
      value: '0',
      icon: Ticket,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Tickets Assigned',
      value: '0',
      icon: Activity,
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Comments Made',
      value: '0',
      icon: MessageSquare,
      gradient: 'from-violet-500/10 to-violet-600/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
    },
  ]

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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No user data available</p>
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Manage your MintDesk account information
            </p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleSave} 
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  className="flex items-center space-x-2 hover:border-emerald-500/50 hover:text-emerald-400"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Enhanced Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
                <CardHeader className="text-center">
                  <div className={`mx-auto h-24 w-24 rounded-full ${getAvatarGradient(user)} flex items-center justify-center mb-4 text-white font-bold text-xl`}>
                    {getInitials(user.name)}
                  </div>
                  <CardTitle className="text-white text-xl bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    {user.name}
                  </CardTitle>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="flex justify-center mt-2">
                    <Badge variant={user.isAdmin ? "destructive" : "default"}>
                      {user.isAdmin ? "Admin" : "User"}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced Profile Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-400 text-sm">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-md">
                          <UserIcon className="h-4 w-4 text-emerald-400" />
                          <span className="text-white">{user.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-md">
                          <Mail className="h-4 w-4 text-emerald-400" />
                          <span className="text-white">{user.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-md">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        <span className="text-white">{user.isAdmin ? "Administrator" : "User"}</span>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Member Since
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-md">
                        <Calendar className="h-4 w-4 text-emerald-400" />
                        <span className="text-white">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Account Statistics */}
                  <div className="border-t border-gray-700/50 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                      Account Statistics
                    </h3>
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {accountStats.map((stat, index) => (
                        <motion.div key={stat.title} variants={itemVariants}>
                          <div className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-lg p-4 text-center`}>
                            <div className={`inline-flex p-2 ${stat.iconBg} rounded-lg mb-2`}>
                              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                            </div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.title}</div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 
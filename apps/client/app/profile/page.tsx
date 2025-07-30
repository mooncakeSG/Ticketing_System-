'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  AlertCircle 
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
            <Button onClick={() => window.location.reload()}>
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
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-gray-400 mt-1">Manage your account information</p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="text-center">
                  <div className="mx-auto h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardTitle className="text-white text-xl">{user.name}</CardTitle>
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

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-400 text-sm">{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-md">
                          <UserIcon className="h-4 w-4 text-gray-400" />
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
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-md">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{user.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-md">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{user.isAdmin ? "Administrator" : "User"}</span>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Member Since
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-md">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-white">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Statistics */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Account Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-400">Tickets Created</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-400">Tickets Assigned</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-400">Comments Made</div>
                      </div>
                    </div>
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
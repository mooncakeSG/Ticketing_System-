'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone,
  Building,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react'
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

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Department {
  id: string;
  name: string;
  description: string;
}

// Mock data
const roles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and management',
    permissions: ['manage_users', 'manage_tickets', 'manage_settings', 'view_reports']
  },
  {
    id: 'agent',
    name: 'Support Agent',
    description: 'Handle tickets and customer support',
    permissions: ['manage_tickets', 'view_reports']
  },
  {
    id: 'user',
    name: 'User',
    description: 'Basic access to create and view tickets',
    permissions: ['create_tickets', 'view_own_tickets']
  }
]

const departments: Department[] = [
  { id: '1', name: 'Technical Support', description: 'Hardware and software issues' },
  { id: '2', name: 'Customer Service', description: 'General customer inquiries' },
  { id: '3', name: 'Sales', description: 'Sales and account management' },
  { id: '4', name: 'Development', description: 'Software development team' },
  { id: '5', name: 'Marketing', description: 'Marketing and communications' },
]

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    status: 'active',
    phone: '+1 (555) 123-4567',
    department: 'Technical Support',
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
    department: 'Customer Service',
    created_at: '2024-01-11T10:00:00Z',
    last_login: '2024-01-15T13:45:00Z',
    tickets_assigned: 8,
    tickets_resolved: 6,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'agent',
    status: 'active',
    phone: '+1 (555) 345-6789',
    department: 'Technical Support',
    created_at: '2024-01-12T11:00:00Z',
    last_login: '2024-01-15T12:20:00Z',
    tickets_assigned: 12,
    tickets_resolved: 10,
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    role: 'user',
    status: 'active',
    phone: '+1 (555) 456-7890',
    department: 'Sales',
    created_at: '2024-01-13T12:00:00Z',
    last_login: '2024-01-15T11:15:00Z',
    tickets_assigned: 3,
    tickets_resolved: 1,
  },
  {
    id: '5',
    name: 'David Smith',
    email: 'david.smith@company.com',
    role: 'agent',
    status: 'inactive',
    phone: '+1 (555) 567-8901',
    department: 'Development',
    created_at: '2024-01-14T13:00:00Z',
    last_login: '2024-01-10T16:45:00Z',
    tickets_assigned: 5,
    tickets_resolved: 4,
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

export default function EditUser() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
    password: '',
    confirmPassword: '',
  })

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
        
        // Parse name into first and last name
        const nameParts = foundUser.name.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        setFormData({
          firstName,
          lastName,
          email: foundUser.email,
          phone: foundUser.phone || '',
          department: foundUser.department || '',
          role: foundUser.role,
          status: foundUser.status,
          password: '',
          confirmPassword: '',
        })
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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required'
    if (!formData.lastName.trim()) return 'Last name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!formData.role) return 'Role is required'
    
    // Only validate password if it's being changed
    if (formData.password && formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    if (formData.password && formData.password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address'
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSaving(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/users')
      }, 2000)
    } catch (err) {
      setError('Failed to update user. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      setSaving(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/users')
    } catch (err) {
      setError('Failed to delete user. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const selectedRole = roles.find(r => r.id === formData.role)
  const selectedDepartment = departments.find(d => d.id === formData.department)

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
            <div>
              <h1 className="text-3xl font-bold text-white">Edit User</h1>
              <p className="text-gray-400 mt-1">Update user information and settings</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete User</span>
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">User updated successfully!</p>
              <p className="text-green-400/80 text-sm">Redirecting to users list...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400">Tickets Assigned</p>
            <p className="text-2xl font-bold text-white">{user.tickets_assigned}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400">Tickets Resolved</p>
            <p className="text-2xl font-bold text-white">{user.tickets_resolved}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400">Created</p>
            <p className="text-sm text-white">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400">Last Login</p>
            <p className="text-sm text-white">
              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-white">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role & Department */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Role & Department</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-white">
                    Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium text-white">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              {selectedRole && (
                <div className="p-3 bg-gray-800/50 rounded-md">
                  <p className="text-sm text-gray-300 mb-2">{selectedRole.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedRole.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium text-white">
                  Department
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedDepartment && (
                  <p className="text-sm text-gray-400 mt-1">{selectedDepartment.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Change Password (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="w-full pr-10 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="w-full pr-10 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="flex items-center space-x-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

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

export default function CreateUser() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    password: '',
    confirmPassword: '',
    isActive: true,
    sendWelcomeEmail: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required'
    if (!formData.lastName.trim()) return 'Last name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!formData.role) return 'Role is required'
    if (!formData.password) return 'Password is required'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    if (formData.password.length < 8) return 'Password must be at least 8 characters'
    
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
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/users')
      }, 2000)
    } catch (err) {
      setError('Failed to create user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roles.find(r => r.id === formData.role)
  const selectedDepartment = departments.find(d => d.id === formData.department)

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
              <h1 className="text-3xl font-bold text-white">Create New User</h1>
              <p className="text-gray-400 mt-1">Add a new user to the system</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">User created successfully!</p>
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
                
                {selectedRole && (
                  <div className="mt-2 p-3 bg-gray-800/50 rounded-md">
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
              </div>

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

          {/* Account Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="w-full pr-10 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      placeholder="Enter password"
                      required
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
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="w-full pr-10 pl-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      placeholder="Confirm password"
                      required
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

              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Active account</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => handleChange('sendWelcomeEmail', e.target.checked)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Send welcome email</span>
                </label>
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
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create User</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
} 
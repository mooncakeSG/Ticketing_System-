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
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.role) {
      errors.role = 'Role is required'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError('Please fix the validation errors below')
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
              <Button variant="ghost" size="icon" data-testid="back-button" aria-label="Go back to users">
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
          <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-md" role="alert" aria-live="polite">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">User created successfully!</p>
              <p className="text-green-400/80 text-sm">Redirecting to users list...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-md" role="alert" aria-live="polite">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="create-user-form">
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
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                      fieldErrors.firstName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter first name"
                    required
                    data-testid="user-first-name-input"
                    aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                  />
                  {fieldErrors.firstName && (
                    <div id="firstName-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.firstName}
                    </div>
                  )}
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
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                      fieldErrors.lastName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter last name"
                    required
                    data-testid="user-last-name-input"
                    aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                  />
                  {fieldErrors.lastName && (
                    <div id="lastName-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                    Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                        fieldErrors.email ? 'border-red-500' : 'border-gray-700'
                      }`}
                    placeholder="Enter email address"
                    required
                      data-testid="user-email-input"
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    />
                  </div>
                  {fieldErrors.email && (
                    <div id="email-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.email}
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-white">
                  Phone Number
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    placeholder="Enter phone number"
                      data-testid="user-phone-input"
                  />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role and Department */}
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
                    className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                      fieldErrors.role ? 'border-red-500' : 'border-gray-700'
                    }`}
                  required
                    data-testid="user-role-select"
                    aria-describedby={fieldErrors.role ? "role-error" : undefined}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                  {fieldErrors.role && (
                    <div id="role-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.role}
                    </div>
                  )}
                  {selectedRole && (
                    <p className="text-gray-400 text-xs mt-1">{selectedRole.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium text-white">
                  Department
                </label>
                <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                      data-testid="user-department-select"
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
                    <p className="text-gray-400 text-xs mt-1">{selectedDepartment.description}</p>
                )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
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
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className={`w-full pr-10 pl-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                        fieldErrors.password ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter password"
                      required
                      data-testid="user-password-input"
                      aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      data-testid="toggle-password-visibility"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div id="password-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.password}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={`w-full pr-10 pl-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                        fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Confirm password"
                      required
                      data-testid="user-confirm-password-input"
                      aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      data-testid="toggle-confirm-password-visibility"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <div id="confirmPassword-error" className="text-red-400 text-xs mt-1" role="alert">
                      {fieldErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Account Status</h4>
                  <p className="text-gray-400 text-xs">Enable or disable the user account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="sr-only"
                    data-testid="user-active-toggle"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Welcome Email</h4>
                  <p className="text-gray-400 text-xs">Send welcome email to the new user</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => handleChange('sendWelcomeEmail', e.target.checked)}
                    className="sr-only"
                    data-testid="user-welcome-email-toggle"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <Link href="/users">
              <Button variant="outline" type="button" data-testid="cancel-button">
              Cancel
            </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex items-center space-x-2"
              data-testid="create-user-submit-button"
              aria-label={loading ? "Creating user..." : "Create user"}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                  <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Creating...' : 'Create User'}</span>
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
} 
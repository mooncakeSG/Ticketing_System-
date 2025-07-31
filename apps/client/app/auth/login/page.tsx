'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, LogIn, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const router = useRouter()

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:5003/api/v1/health')
        if (response.ok) {
          setBackendStatus('online')
        } else {
          setBackendStatus('offline')
        }
      } catch (error) {
        setBackendStatus('offline')
      }
    }

    checkBackendStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authApi.login({ email, password })
      router.push('/')
    } catch (err: any) {
      console.error('Login error:', err)
      
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later or contact support.')
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Unable to connect to the server. Please check your internet connection and ensure the backend is running.')
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')

    try {
      // Try demo credentials
      await authApi.login({ 
        email: 'admin@peppermint.com', 
        password: 'admin123' 
      })
      router.push('/')
    } catch (err: any) {
      console.error('Demo login error:', err)
      
      if (err.response?.status === 401) {
        setError('Demo login failed: Invalid credentials. Please contact support.')
      } else if (err.response?.status === 500) {
        setError('Demo login failed: Server error. Please try again later.')
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Demo login failed: Unable to connect to the server. Please ensure the backend is running on http://localhost:5003')
      } else {
        setError('Demo login failed. Please check if the backend is running and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">MintDesk</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-center space-x-2">
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Backend Status Indicator */}
              {backendStatus !== 'checking' && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  backendStatus === 'online' 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-yellow-500/10 border border-yellow-500/20'
                }`}>
                  {backendStatus === 'online' ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className={`text-sm ${
                    backendStatus === 'online' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {backendStatus === 'online' 
                      ? 'Backend server is online' 
                      : 'Backend server is offline - login may not work'
                    }
                  </span>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <LogIn className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full"
                >
                  Try Demo Login
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Demo Credentials:
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Email: admin@peppermint.com
              </p>
              <p className="text-gray-500 text-xs">
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 
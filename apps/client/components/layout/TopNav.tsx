'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  Search, 
  User,
  LogOut,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { authApi, User as UserType } from '@/lib/api'
import Link from 'next/link'

export function TopNav() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (!token) {
            router.push('/auth/login')
            return
          }
        }
        
        const userData = await authApi.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to get current user:', error)
        // If user is not authenticated, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          router.push('/auth/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    authApi.logout()
    setIsUserMenuOpen(false)
  }

  const handleProfileClick = () => {
    setIsUserMenuOpen(false)
    router.push('/profile')
  }

  const handleSettingsClick = () => {
    setIsUserMenuOpen(false)
    router.push('/settings')
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
      setIsNotificationsOpen(false)
    }

    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border border-gray-700 bg-gray-800 pl-10 pr-3 text-sm text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              data-testid="search-input"
              aria-label="Search"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="animate-pulse h-8 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-gray-700 bg-gray-800 pl-10 pr-3 text-sm text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
            data-testid="search-input"
            aria-label="Search tickets and content"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setIsNotificationsOpen(!isNotificationsOpen)
            }}
            className="relative text-gray-300 hover:text-white"
            data-testid="notifications-button"
            aria-label="View notifications"
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button>

          {isNotificationsOpen && (
            <div 
              className="absolute right-0 top-12 w-80 rounded-md border border-gray-700 bg-gray-900 p-4 shadow-lg z-50"
              data-testid="notifications-dropdown"
              role="menu"
              aria-label="Notifications menu"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-400"
                    data-testid="mark-all-read-button"
                    aria-label="Mark all notifications as read"
                  >
                    Mark all read
                  </Button>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-md bg-gray-800 p-3" role="menuitem">
                      <p className="text-sm text-white">New ticket assigned to you</p>
                      <p className="text-xs text-gray-400">2 minutes ago</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              setIsUserMenuOpen(!isUserMenuOpen)
            }}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
            data-testid="user-menu-button"
            aria-label={`User menu for ${user?.name || 'User'}`}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm">{user?.name || 'User'}</span>
          </Button>

          {isUserMenuOpen && (
            <div 
              className="absolute right-0 top-12 w-48 rounded-md border border-gray-700 bg-gray-900 p-2 shadow-lg z-50"
              data-testid="user-menu-dropdown"
              role="menu"
              aria-label="User menu"
            >
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={handleProfileClick}
                  className="w-full justify-start text-sm text-gray-300 hover:text-white"
                  data-testid="profile-menu-item"
                  role="menuitem"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSettingsClick}
                  className="w-full justify-start text-sm text-gray-300 hover:text-white"
                  data-testid="settings-menu-item"
                  role="menuitem"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <div className="border-t border-gray-700 my-1"></div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-sm text-red-400 hover:text-red-300"
                  data-testid="logout-menu-item"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
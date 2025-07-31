'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  Search, 
  User,
  LogOut,
  Settings,
  Check,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { authApi, User as UserType } from '@/lib/api'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'ticket_assigned' | 'ticket_updated' | 'comment_added' | 'system'
}

export function TopNav() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New ticket assigned',
      message: 'Ticket #1234 has been assigned to you',
      timestamp: '2 minutes ago',
      read: false,
      type: 'ticket_assigned'
    },
    {
      id: '2',
      title: 'Ticket updated',
      message: 'Ticket #1235 status changed to "In Progress"',
      timestamp: '5 minutes ago',
      read: false,
      type: 'ticket_updated'
    },
    {
      id: '3',
      title: 'New comment',
      message: 'A new comment was added to ticket #1236',
      timestamp: '10 minutes ago',
      read: false,
      type: 'comment_added'
    }
  ])
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

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(false)
    router.push('/settings/notifications')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Search across multiple areas
      const searchTermLower = searchTerm.trim().toLowerCase()
      
      // Check if it's a ticket search
      if (searchTermLower.includes('ticket') || searchTermLower.includes('issue') || searchTermLower.includes('bug')) {
        router.push(`/tickets?search=${encodeURIComponent(searchTerm.trim())}`)
        return
      }
      
      // Check if it's a user search
      if (searchTermLower.includes('user') || searchTermLower.includes('admin') || searchTermLower.includes('profile')) {
        router.push(`/users?search=${encodeURIComponent(searchTerm.trim())}`)
        return
      }
      
      // Check if it's a settings search
      if (searchTermLower.includes('setting') || searchTermLower.includes('config') || searchTermLower.includes('preference')) {
        router.push(`/settings?search=${encodeURIComponent(searchTerm.trim())}`)
        return
      }
      
      // Check if it's a notification search
      if (searchTermLower.includes('notification') || searchTermLower.includes('alert') || searchTermLower.includes('bell')) {
        router.push(`/settings/notifications?search=${encodeURIComponent(searchTerm.trim())}`)
        return
      }
      
      // Default to tickets search
      router.push(`/tickets?search=${encodeURIComponent(searchTerm.trim())}`)
    }
    setShowSearchSuggestions(false)
  }

  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      setShowSearchSuggestions(true)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value.trim()) {
      setShowSearchSuggestions(true)
    } else {
      setShowSearchSuggestions(false)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
      setIsNotificationsOpen(false)
      setShowSearchSuggestions(false)
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
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets, users, settings..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="h-9 w-64 rounded-md border border-gray-700 bg-gray-800 pl-10 pr-3 text-sm text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
                data-testid="search-input"
                aria-label="Search tickets, users, settings and content"
              />
            </form>
            
            {/* Search Suggestions */}
            {showSearchSuggestions && searchTerm.trim() && (
              <div 
                className="absolute top-12 left-0 w-64 rounded-md border border-gray-700 bg-gray-900 p-2 shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1">
                  <div 
                    className="flex items-center space-x-2 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => router.push(`/tickets?search=${encodeURIComponent(searchTerm.trim())}`)}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search tickets for "{searchTerm}"</span>
                  </div>
                  <div 
                    className="flex items-center space-x-2 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => router.push(`/users?search=${encodeURIComponent(searchTerm.trim())}`)}
                  >
                    <User className="h-4 w-4" />
                    <span>Search users for "{searchTerm}"</span>
                  </div>
                  <div 
                    className="flex items-center space-x-2 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => router.push(`/settings?search=${encodeURIComponent(searchTerm.trim())}`)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Search settings for "{searchTerm}"</span>
                  </div>
                </div>
              </div>
            )}
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
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {isNotificationsOpen && (
            <div 
              className="absolute right-0 top-12 w-80 rounded-md border border-gray-700 bg-gray-900 p-4 shadow-lg z-50"
              data-testid="notifications-dropdown"
              role="menu"
              aria-label="Notifications menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-gray-400 hover:text-white"
                        data-testid="mark-all-read-button"
                        aria-label="Mark all notifications as read"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAllAsRead()
                        }}
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-blue-400 hover:text-blue-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotificationsClick()
                      }}
                    >
                      View all
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`rounded-md p-3 transition-colors cursor-pointer hover:bg-gray-800/70 ${
                          notification.read ? 'bg-gray-800/50' : 'bg-gray-800'
                        }`} 
                        role="menuitem"
                        onClick={(e) => {
                          e.stopPropagation()
                          markNotificationAsRead(notification.id)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>
                          {!notification.read && (
                            <div className="ml-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProfileClick()
                  }}
                  className="w-full justify-start text-sm text-gray-300 hover:text-white"
                  data-testid="profile-menu-item"
                  role="menuitem"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSettingsClick()
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLogout()
                  }}
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
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Ticket, 
  Plus, 
  BarChart3, 
  Settings, 
  Users,
  MessageSquare,
  TrendingUp,
  FileText,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Create Ticket', href: '/create', icon: Plus },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Admin', href: '/admin', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900/50 border-r border-gray-800">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">MintDesk</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
              {isActive && (
                <div className="absolute left-0 h-8 w-1 bg-white rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 
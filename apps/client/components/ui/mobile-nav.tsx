'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Home, FileText, Users, MessageSquare, Settings, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const mobileNavItems: MobileNavItem[] = [
  { id: 'home', label: 'Dashboard', icon: <Home className="h-5 w-5" />, href: '/' },
  { id: 'tickets', label: 'Tickets', icon: <FileText className="h-5 w-5" />, href: '/tickets' },
  { id: 'users', label: 'Users', icon: <Users className="h-5 w-5" />, href: '/users' },
  { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" />, href: '/messages' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, href: '/analytics' },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
];

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('home');
  const router = useRouter();

  // Close mobile nav when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Handle swipe gestures
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Swipe right to open menu (if closed)
      if (diffX < -50 && Math.abs(diffY) < 50 && !isOpen) {
        setIsOpen(true);
      }
      // Swipe left to close menu (if open)
      else if (diffX > 50 && Math.abs(diffY) < 50 && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen]);

  const handleItemClick = (item: MobileNavItem) => {
    setActiveItem(item.id);
    router.push(item.href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-background border border-border rounded-lg shadow-lg"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-2">
                  {mobileNavItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 ${
                        activeItem === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="flex-shrink-0 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Swipe right to open, left to close
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Bottom Navigation for mobile
export function BottomNavigation() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>('home');

  const bottomNavItems = mobileNavItems.slice(0, 4); // Show only first 4 items

  const handleItemClick = (item: MobileNavItem) => {
    setActiveItem(item.id);
    router.push(item.href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="flex items-center justify-around p-2">
        {bottomNavItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-200 ${
              activeItem === item.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
} 
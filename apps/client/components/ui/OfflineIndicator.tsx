'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    // Check initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={cn(
          'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
          'flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg',
          isOnline
            ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
            : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
        )}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Offline actions indicator
export function OfflineActionsIndicator() {
  const [offlineActions, setOfflineActions] = useState<any[]>([]);

  useEffect(() => {
    const checkOfflineActions = () => {
      try {
        const stored = localStorage.getItem('offlineActions');
        const actions = stored ? JSON.parse(stored) : [];
        setOfflineActions(actions);
      } catch (error) {
        console.error('Failed to get offline actions:', error);
      }
    };

    // Check initially
    checkOfflineActions();

    // Check periodically
    const interval = setInterval(checkOfflineActions, 5000);

    return () => clearInterval(interval);
  }, []);

  if (offlineActions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {offlineActions.length} pending
      </Badge>
    </motion.div>
  );
}

// Service worker registration hook
export function useServiceWorker() {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          setIsRegistered(true);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return { isRegistered };
}

// Offline storage hook
export function useOfflineStorage() {
  const storeAction = async (action: any) => {
    try {
      const stored = localStorage.getItem('offlineActions');
      const actions = stored ? JSON.parse(stored) : [];
      actions.push({
        ...action,
        id: Date.now().toString(),
        timestamp: Date.now(),
      });
      localStorage.setItem('offlineActions', JSON.stringify(actions));
    } catch (error) {
      console.error('Failed to store offline action:', error);
    }
  };

  const getOfflineActions = async () => {
    try {
      const stored = localStorage.getItem('offlineActions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get offline actions:', error);
      return [];
    }
  };

  const removeOfflineAction = async (actionId: string) => {
    try {
      const actions = await getOfflineActions();
      const filtered = actions.filter((action: any) => action.id !== actionId);
      localStorage.setItem('offlineActions', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove offline action:', error);
    }
  };

  return {
    storeAction,
    getOfflineActions,
    removeOfflineAction,
  };
} 
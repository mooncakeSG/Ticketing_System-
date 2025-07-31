'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications, useWebSocket } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

interface RealTimeNotificationProps {
  className?: string;
  maxNotifications?: number;
  autoHide?: boolean;
  hideDelay?: number;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const notificationColors = {
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
};

export function RealTimeNotification({
  className,
  maxNotifications = 5,
  autoHide = true,
  hideDelay = 5000,
}: RealTimeNotificationProps) {
  const notifications = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<any[]>([]);

  // Don't show real-time notifications in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_WS_AUTO_CONNECT !== 'true') {
    return null;
  }

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setVisibleNotifications(prev => {
        const newNotifications = [...prev, { ...latestNotification, id: Date.now() }];
        return newNotifications.slice(-maxNotifications);
      });

      if (autoHide) {
        setTimeout(() => {
          setVisibleNotifications(prev => prev.filter(n => n.id !== latestNotification.id));
        }, hideDelay);
      }
    }
  }, [notifications, maxNotifications, autoHide, hideDelay]);

  const removeNotification = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className={cn('fixed top-4 right-4 z-50 space-y-2', className)}>
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Info;
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm',
                notificationColors[notification.type as keyof typeof notificationColors]
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-sm mt-1 opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Connection status indicator
export function WebSocketStatus() {
  const { isConnected } = useWebSocket();
  
  // Don't show WebSocket status in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_WS_AUTO_CONNECT !== 'true') {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          isConnected ? 'bg-green-500' : 'bg-red-500'
        )}
      />
      <span className={cn(
        isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      )}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
} 
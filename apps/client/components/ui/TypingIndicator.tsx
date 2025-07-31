'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTypingIndicator, useWebSocket } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  ticketId: string;
  className?: string;
  showNames?: boolean;
}

export function TypingIndicator({ ticketId, className, showNames = true }: TypingIndicatorProps) {
  const typingUsers = useTypingIndicator(ticketId);

  if (typingUsers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {typingUsers.slice(0, 3).map((userId, index) => (
          <motion.div
            key={userId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium"
          >
            {userId.charAt(0).toUpperCase()}
          </motion.div>
        ))}
        {typingUsers.length > 3 && (
          <span className="text-xs">+{typingUsers.length - 3}</span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="w-1 h-1 bg-muted-foreground rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
          className="w-1 h-1 bg-muted-foreground rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
          className="w-1 h-1 bg-muted-foreground rounded-full"
        />
      </div>
      
      {showNames && (
        <span className="text-xs">
          {typingUsers.length === 1
            ? `${typingUsers[0]} is typing`
            : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` and ${typingUsers.length - 2} others` : ''} are typing`}
        </span>
      )}
    </motion.div>
  );
}

// Hook for sending typing indicators
export function useTypingIndicatorSender(ticketId: string) {
  const { send } = useWebSocket();
  const [isTyping, setIsTyping] = React.useState(false);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout>();

  const sendTypingIndicator = React.useCallback((typing: boolean) => {
    send({
      type: 'typing_indicator',
      data: {
        ticketId,
        isTyping: typing,
        userId: 'current-user', // This should be replaced with actual user ID
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    });
  }, [send, ticketId]);

  const handleTyping = React.useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false);
    }, 2000);
  }, [isTyping, sendTypingIndicator]);

  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        sendTypingIndicator(false);
      }
    };
  }, [isTyping, sendTypingIndicator]);

  return { handleTyping };
} 
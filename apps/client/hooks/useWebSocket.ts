import { useEffect, useRef, useState } from 'react';
import wsService, { WebSocketMessage, NotificationData } from '@/lib/websocket';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  token?: string;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  connect: (token?: string) => void;
  disconnect: () => void;
  send: (message: WebSocketMessage) => void;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string, callback: (data: any) => void) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { autoConnect = true, token } = options;
  const [isConnected, setIsConnected] = useState(false);
  const callbacksRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    // Set up connection status listener
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    wsService.subscribe('connected', handleConnected);
    wsService.subscribe('disconnected', handleDisconnected);

    // Auto-connect if enabled and in production or explicitly enabled
    if (autoConnect && (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_WS_AUTO_CONNECT === 'true')) {
      wsService.connect(token);
    }

    // Cleanup
    return () => {
      wsService.unsubscribe('connected', handleConnected);
      wsService.unsubscribe('disconnected', handleDisconnected);
      
      // Unsubscribe all custom callbacks
      callbacksRef.current.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          wsService.unsubscribe(event, callback);
        });
      });
    };
  }, [autoConnect, token]);

  const connect = (newToken?: string) => {
    wsService.connect(newToken || token);
  };

  const disconnect = () => {
    wsService.disconnect();
  };

  const send = (message: WebSocketMessage) => {
    wsService.send(message);
  };

  const subscribe = (event: string, callback: (data: any) => void) => {
    // Store callback for cleanup
    if (!callbacksRef.current.has(event)) {
      callbacksRef.current.set(event, new Set());
    }
    callbacksRef.current.get(event)!.add(callback);

    // Subscribe to WebSocket service
    wsService.subscribe(event, callback);
  };

  const unsubscribe = (event: string, callback: (data: any) => void) => {
    // Remove from stored callbacks
    const callbacks = callbacksRef.current.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }

    // Unsubscribe from WebSocket service
    wsService.unsubscribe(event, callback);
  };

  return {
    isConnected,
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
  };
}

// Specialized hooks for common use cases
export function useTicketUpdates(ticketId?: string) {
  const [updates, setUpdates] = useState<any[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    if (!ticketId) return;

    const handleTicketUpdate = (data: any) => {
      if (data.ticketId === ticketId) {
        setUpdates(prev => [...prev, { ...data, timestamp: Date.now() }]);
      }
    };

    subscribe('ticket_update', handleTicketUpdate);

    return () => {
      unsubscribe('ticket_update', handleTicketUpdate);
    };
  }, [ticketId, subscribe, unsubscribe]);

  return updates;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    const handleNotification = (data: NotificationData) => {
      setNotifications(prev => [...prev, data]);
    };

    subscribe('notification', handleNotification);

    return () => {
      unsubscribe('notification', handleNotification);
    };
  }, [subscribe, unsubscribe]);

  return notifications;
}

export function useTypingIndicator(ticketId?: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    if (!ticketId) return;

    const handleTypingIndicator = (data: any) => {
      if (data.ticketId === ticketId) {
        if (data.isTyping) {
          setTypingUsers(prev => {
            const newUsers = [...prev];
            if (!newUsers.includes(data.userId)) {
              newUsers.push(data.userId);
            }
            return newUsers;
          });
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      }
    };

    subscribe('typing_indicator', handleTypingIndicator);

    return () => {
      unsubscribe('typing_indicator', handleTypingIndicator);
    };
  }, [ticketId, subscribe, unsubscribe]);

  return typingUsers;
} 
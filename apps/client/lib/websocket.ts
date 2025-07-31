import { toast } from '@/@/shadcn/hooks/use-toast';

export interface WebSocketMessage {
  type: 'ticket_update' | 'notification' | 'typing_indicator' | 'collaborative_edit';
  data: any;
  timestamp: number;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  ticketId?: string;
  userId?: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnected = false;

  constructor(private url: string) {}

  connect(token?: string) {
    try {
      const wsUrl = token ? `${this.url}?token=${token}` : this.url;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('disconnected', {});
        // Only attempt reconnect if we're not in development mode
        if (process.env.NODE_ENV === 'production') {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        // Only log errors in production or if explicitly enabled
        if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_WS_DEBUG === 'true') {
          console.error('WebSocket error:', error);
        }
        this.emit('error', error);
      };
    } catch (error) {
      // Only log connection errors in production or if explicitly enabled
      if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_WS_DEBUG === 'true') {
        console.error('Failed to connect to WebSocket:', error);
      }
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'ticket_update':
        this.handleTicketUpdate(message.data);
        break;
      case 'notification':
        this.handleNotification(message.data);
        break;
      case 'typing_indicator':
        this.handleTypingIndicator(message.data);
        break;
      case 'collaborative_edit':
        this.handleCollaborativeEdit(message.data);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleTicketUpdate(data: any) {
    this.emit('ticket_update', data);
    
    // Show toast notification for ticket updates
    toast({
      title: 'Ticket Updated',
      description: `Ticket #${data.ticketNumber} has been updated`,
      duration: 3000,
    });
  }

  private handleNotification(data: NotificationData) {
    this.emit('notification', data);
    
    // Show toast notification
    toast({
      title: data.title,
      description: data.message,
      duration: 5000,
    });
  }

  private handleTypingIndicator(data: any) {
    this.emit('typing_indicator', data);
  }

  private handleCollaborativeEdit(data: any) {
    this.emit('collaborative_edit', data);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect_failed', {});
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const wsService = new WebSocketService(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

// Only auto-connect in production or if explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_WS_AUTO_CONNECT === 'true') {
  wsService.connect();
}

export default wsService; 
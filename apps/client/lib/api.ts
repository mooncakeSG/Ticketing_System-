import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Updated interfaces to match the database schema
export interface Ticket {
  id: string;
  title: string;
  detail?: string;
  status: 'needs_support' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  type: 'support' | 'bug' | 'feature' | 'other';
  createdAt: string;
  updatedAt: string;
  assignedTo?: User;
  createdBy?: any;
  client?: Client;
  isComplete: boolean;
  hidden: boolean;
  locked: boolean;
  Number: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  contactName: string;
  number?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  public: boolean;
  reply: boolean;
  replyEmail?: string;
  edited: boolean;
  editedAt?: string;
  previous?: string;
  createdAt: string;
  user?: User;
  ticketId: string;
}

export interface TimeTracking {
  id: string;
  title: string;
  comment?: string;
  time: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  ticketId?: string;
}

export interface CreateTicketData {
  title: string;
  detail?: string;
  priority: 'low' | 'medium' | 'high';
  type?: 'support' | 'bug' | 'feature' | 'other';
  email?: string;
  engineer?: User;
  company?: Client;
  createdBy?: any;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Mock data for fallback
const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Website not loading properly',
    detail: 'The homepage is taking too long to load and some images are broken. Users are reporting 404 errors.',
    status: 'needs_support',
    priority: 'high',
    type: 'bug',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    isComplete: false,
    hidden: false,
    locked: false,
    Number: 1,
  },
  {
    id: '2',
    title: 'User registration form issue',
    detail: 'New users cannot complete the registration process. The form submits but shows an error message.',
    status: 'in_progress',
    priority: 'medium',
    type: 'support',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    isComplete: false,
    hidden: false,
    locked: false,
    Number: 2,
  },
  {
    id: '3',
    title: 'Mobile app crashes on startup',
    detail: 'The iOS app crashes immediately when opened on iPhone 12 and newer devices.',
    status: 'resolved',
    priority: 'high',
    type: 'bug',
    createdAt: '2024-01-13T11:00:00Z',
    updatedAt: '2024-01-14T08:30:00Z',
    isComplete: true,
    hidden: false,
    locked: false,
    Number: 3,
  },
];

// Authentication API
export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      return { token, user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/auth/login';
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  register: async (data: { email: string; password: string; name: string; admin: boolean }): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/user/register', data);
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      return { token, user };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
};

// Ticket API functions
export const ticketApi = {
  // Get all tickets
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await api.get('/ticket');
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data');
      return mockTickets;
    }
  },

  // Get single ticket
  getTicket: async (id: string): Promise<Ticket> => {
    try {
      const response = await api.get(`/ticket/${id}`);
      return response.data;
    } catch (error) {
      const ticket = mockTickets.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket not found');
      return ticket;
    }
  },

  // Create new ticket
  createTicket: async (data: CreateTicketData): Promise<Ticket> => {
    try {
      const response = await api.post('/ticket/create', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      // Create mock ticket for fallback
      const newTicket: Ticket = {
        id: (mockTickets.length + 1).toString(),
        title: data.title,
        detail: data.detail,
        status: 'needs_support',
        priority: data.priority,
        type: data.type || 'support',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isComplete: false,
        hidden: false,
        locked: false,
        Number: mockTickets.length + 1,
      };
      mockTickets.push(newTicket);
      return newTicket;
    }
  },

  // Update ticket
  updateTicket: async (id: string, data: Partial<CreateTicketData>): Promise<Ticket> => {
    try {
      const response = await api.put(`/ticket/${id}`, data);
      return response.data;
    } catch (error) {
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return mockTickets[ticketIndex];
    }
  },

  // Close ticket
  closeTicket: async (id: string): Promise<Ticket> => {
    try {
      const response = await api.patch(`/ticket/${id}/close`);
      return response.data;
    } catch (error) {
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        status: 'closed',
        isComplete: true,
        updatedAt: new Date().toISOString(),
      };
      return mockTickets[ticketIndex];
    }
  },

  // Reopen ticket
  reopenTicket: async (id: string): Promise<Ticket> => {
    try {
      const response = await api.patch(`/ticket/${id}/reopen`);
      return response.data;
    } catch (error) {
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        status: 'needs_support',
        isComplete: false,
        updatedAt: new Date().toISOString(),
      };
      return mockTickets[ticketIndex];
    }
  },

  // Get ticket comments
  getComments: async (ticketId: string): Promise<Comment[]> => {
    try {
      const response = await api.get(`/ticket/${ticketId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Failed to get comments:', error);
      return [];
    }
  },

  // Add comment
  addComment: async (ticketId: string, data: { text: string; public?: boolean }): Promise<Comment> => {
    try {
      const response = await api.post(`/ticket/${ticketId}/comments`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  },

  // Get time tracking
  getTimeTracking: async (ticketId: string): Promise<TimeTracking[]> => {
    try {
      const response = await api.get(`/ticket/${ticketId}/time`);
      return response.data;
    } catch (error) {
      console.error('Failed to get time tracking:', error);
      return [];
    }
  },

  // Add time tracking
  addTimeTracking: async (ticketId: string, data: { title: string; comment?: string; time: number }): Promise<TimeTracking> => {
    try {
      const response = await api.post(`/ticket/${ticketId}/time`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to add time tracking:', error);
      throw error;
    }
  },
};

// User API functions
export const userApi = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  },

  getUser: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  },

  createUser: async (data: { email: string; password: string; name: string; admin: boolean }): Promise<User> => {
    try {
      const response = await api.post('/users', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
};

export default api; 
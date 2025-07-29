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

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  created_by: string;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

// Mock data for demonstration
const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Website not loading properly',
    description: 'The homepage is taking too long to load and some images are broken. Users are reporting 404 errors.',
    status: 'open',
    priority: 'high',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:20:00Z',
    assigned_to: 'John Doe',
    created_by: 'Sarah Wilson',
  },
  {
    id: '2',
    subject: 'User registration form issue',
    description: 'New users cannot complete the registration process. The form submits but shows an error message.',
    status: 'open',
    priority: 'medium',
    created_at: '2024-01-14T09:15:00Z',
    updated_at: '2024-01-14T16:45:00Z',
    assigned_to: 'Mike Johnson',
    created_by: 'Customer Support',
  },
  {
    id: '3',
    subject: 'Mobile app crashes on startup',
    description: 'The iOS app crashes immediately when opened on iPhone 12 and newer devices.',
    status: 'closed',
    priority: 'high',
    created_at: '2024-01-13T11:00:00Z',
    updated_at: '2024-01-14T08:30:00Z',
    assigned_to: 'Lisa Chen',
    created_by: 'QA Team',
  },
  {
    id: '4',
    subject: 'Email notifications not working',
    description: 'Users are not receiving email notifications for important updates and password resets.',
    status: 'open',
    priority: 'medium',
    created_at: '2024-01-12T15:20:00Z',
    updated_at: '2024-01-13T10:15:00Z',
    created_by: 'System Admin',
  },
  {
    id: '5',
    subject: 'Database performance issues',
    description: 'Slow query performance affecting user experience. Some reports are timing out.',
    status: 'open',
    priority: 'high',
    created_at: '2024-01-11T08:45:00Z',
    updated_at: '2024-01-12T14:30:00Z',
    assigned_to: 'David Smith',
    created_by: 'System Monitor',
  },
  {
    id: '6',
    subject: 'UI design feedback',
    description: 'Users have provided feedback about the new dashboard design. Some elements need adjustment.',
    status: 'closed',
    priority: 'low',
    created_at: '2024-01-10T13:30:00Z',
    updated_at: '2024-01-11T09:45:00Z',
    assigned_to: 'Alex Rodriguez',
    created_by: 'Product Manager',
  },
];

// Ticket API functions
export const ticketApi = {
  // Get all tickets
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (error) {
      // Fallback to mock data if API is not available
      console.log('API not available, using mock data');
      return mockTickets;
    }
  },

  // Get single ticket
  getTicket: async (id: string): Promise<Ticket> => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      const ticket = mockTickets.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket not found');
      return ticket;
    }
  },

  // Create new ticket
  createTicket: async (data: CreateTicketData): Promise<Ticket> => {
    try {
      const response = await api.post('/tickets', data);
      return response.data;
    } catch (error) {
      // Create mock ticket
      const newTicket: Ticket = {
        id: (mockTickets.length + 1).toString(),
        ...data,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'Current User',
      };
      mockTickets.push(newTicket);
      return newTicket;
    }
  },

  // Update ticket
  updateTicket: async (id: string, data: Partial<CreateTicketData>): Promise<Ticket> => {
    try {
      const response = await api.put(`/tickets/${id}`, data);
      return response.data;
    } catch (error) {
      // Update mock ticket
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockTickets[ticketIndex];
    }
  },

  // Close ticket
  closeTicket: async (id: string): Promise<Ticket> => {
    try {
      const response = await api.patch(`/tickets/${id}/close`);
      return response.data;
    } catch (error) {
      // Close mock ticket
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        status: 'closed',
        updated_at: new Date().toISOString(),
      };
      return mockTickets[ticketIndex];
    }
  },

  // Reopen ticket
  reopenTicket: async (id: string): Promise<Ticket> => {
    try {
      const response = await api.patch(`/tickets/${id}/reopen`);
      return response.data;
    } catch (error) {
      // Reopen mock ticket
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        status: 'open',
        updated_at: new Date().toISOString(),
      };
      return mockTickets[ticketIndex];
    }
  },
};

export default api; 
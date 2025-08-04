import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API handlers
const handlers = [
  // Health check
  http.get('/api/v1/health', () => {
    return HttpResponse.json({
      service: 'peppermint-api',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  }),

  // Authentication
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
    })
  }),

  // Users
  http.get('/api/v1/users', () => {
    return HttpResponse.json({
      users: [
        {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      ],
    })
  }),

  // Tickets
  http.get('/api/v1/tickets', () => {
    return HttpResponse.json({
      tickets: [
        {
          id: 1,
          title: 'Test Ticket',
          description: 'This is a test ticket',
          status: 'open',
          priority: 'medium',
          assignedTo: null,
          createdBy: {
            id: 1,
            name: 'Test User',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
    })
  }),

  // Clients
  http.get('/api/v1/clients', () => {
    return HttpResponse.json({
      clients: [
        {
          id: 1,
          name: 'Test Client',
          email: 'client@example.com',
          phone: '+1234567890',
          company: 'Test Company',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
    })
  }),

  // Default handler for unmatched requests
  http.all('*', () => {
    console.warn('Unhandled request')
    return HttpResponse.json({ message: 'Not found' }, { status: 404 })
  }),
]

export const server = setupServer(...handlers) 
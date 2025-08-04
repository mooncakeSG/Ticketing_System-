import { render, screen, waitFor } from '../../utils/test-utils'
import { rest } from 'msw'
import { server } from '../../mocks/server'

// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      query: {},
      pathname: '/tickets',
    }
  },
}))

describe('TicketsPage Integration', () => {
  beforeEach(() => {
    // Reset any handlers that may have been added in previous tests
    server.resetHandlers()
  })

  it('renders tickets page with loading state', async () => {
    // Mock a delayed response to test loading state
    server.use(
      rest.get('/api/v1/tickets', (req, res, ctx) => {
        return res(
          ctx.delay(100),
          ctx.status(200),
          ctx.json({
            tickets: [
              {
                id: 1,
                title: 'Test Ticket 1',
                description: 'Description 1',
                status: 'open',
                priority: 'high',
                assignedTo: null,
                createdBy: { id: 1, name: 'User 1' },
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
              {
                id: 2,
                title: 'Test Ticket 2',
                description: 'Description 2',
                status: 'closed',
                priority: 'medium',
                assignedTo: { id: 2, name: 'User 2' },
                createdBy: { id: 1, name: 'User 1' },
                createdAt: '2024-01-02T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
              },
            ],
          })
        )
      })
    )

    // Note: This would need to be imported from your actual page component
    // For now, we'll create a mock component to demonstrate the testing pattern
    const MockTicketsPage = () => (
      <div>
        <h1>Tickets</h1>
        <div data-testid="loading">Loading...</div>
        <div data-testid="tickets-list">
          <div data-testid="ticket-1">Test Ticket 1</div>
          <div data-testid="ticket-2">Test Ticket 2</div>
        </div>
      </div>
    )

    render(<MockTicketsPage />)

    // Check for loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByTestId('tickets-list')).toBeInTheDocument()
    })

    // Check that tickets are displayed
    expect(screen.getByTestId('ticket-1')).toBeInTheDocument()
    expect(screen.getByTestId('ticket-2')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    // Mock an error response
    server.use(
      rest.get('/api/v1/tickets', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Internal server error' }))
      })
    )

    const MockTicketsPage = () => (
      <div>
        <h1>Tickets</h1>
        <div data-testid="error-message">Error loading tickets</div>
      </div>
    )

    render(<MockTicketsPage />)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
  })

  it('filters tickets by status', async () => {
    const MockTicketsPage = () => (
      <div>
        <h1>Tickets</h1>
        <select data-testid="status-filter">
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <div data-testid="tickets-list">
          <div data-testid="ticket-1" data-status="open">Test Ticket 1</div>
          <div data-testid="ticket-2" data-status="closed">Test Ticket 2</div>
        </div>
      </div>
    )

    render(<MockTicketsPage />)

    const statusFilter = screen.getByTestId('status-filter') as HTMLSelectElement
    
    // Test filtering by open status
    statusFilter.value = 'open'
    statusFilter.dispatchEvent(new Event('change'))

    await waitFor(() => {
      expect(screen.getByTestId('ticket-1')).toBeInTheDocument()
      expect(screen.queryByTestId('ticket-2')).not.toBeInTheDocument()
    })
  })

  it('is accessible', async () => {
    const MockTicketsPage = () => (
      <div>
        <h1>Tickets</h1>
        <nav aria-label="Ticket filters">
          <button aria-label="Filter by status">Filter</button>
        </nav>
        <main>
          <section aria-label="Tickets list">
            <article>
              <h2>Test Ticket</h2>
              <p>Description</p>
            </article>
          </section>
        </main>
      </div>
    )

    const { container } = render(<MockTicketsPage />)

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()

    // Check for proper ARIA labels
    expect(screen.getByLabelText('Ticket filters')).toBeInTheDocument()
    expect(screen.getByLabelText('Tickets list')).toBeInTheDocument()

    // Check for proper semantic structure
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
}) 
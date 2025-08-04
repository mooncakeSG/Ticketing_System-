import { render, screen } from '../../../utils/test-utils'
import TicketCard from '../../../components/TicketCard'

describe('TicketCard', () => {
  const mockTicket = {
    id: 1,
    title: 'Test Ticket',
    description: 'This is a test ticket description',
    status: 'open',
    priority: 'high',
    assignedTo: null,
    createdBy: {
      id: 1,
      name: 'Test User',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  it('renders ticket information correctly', () => {
    render(<TicketCard ticket={mockTicket} />)
    
    expect(screen.getByText('Test Ticket')).toBeInTheDocument()
    expect(screen.getByText('This is a test ticket description')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('displays correct status badge', () => {
    render(<TicketCard ticket={mockTicket} />)
    
    const statusBadge = screen.getByText('open')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveClass('badge')
  })

  it('displays correct priority indicator', () => {
    render(<TicketCard ticket={mockTicket} />)
    
    const priorityIndicator = screen.getByTestId('priority-indicator')
    expect(priorityIndicator).toBeInTheDocument()
    expect(priorityIndicator).toHaveClass('priority-high')
  })

  it('shows unassigned when no assignee', () => {
    render(<TicketCard ticket={mockTicket} />)
    
    expect(screen.getByText('Unassigned')).toBeInTheDocument()
  })

  it('shows assignee when assigned', () => {
    const assignedTicket = {
      ...mockTicket,
      assignedTo: {
        id: 2,
        name: 'Assigned User',
      },
    }
    
    render(<TicketCard ticket={assignedTicket} />)
    
    expect(screen.getByText('Assigned User')).toBeInTheDocument()
  })

  it('formats date correctly', () => {
    render(<TicketCard ticket={mockTicket} />)
    
    // Check if date is formatted (this will depend on your date formatting utility)
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const mockOnClick = jest.fn()
    render(<TicketCard ticket={mockTicket} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    await card.click()
    
    expect(mockOnClick).toHaveBeenCalledWith(mockTicket)
  })

  it('is accessible', async () => {
    const { container } = render(<TicketCard ticket={mockTicket} />)
    
    // Check for proper ARIA attributes
    expect(screen.getByRole('button')).toHaveAttribute('aria-label')
    
    // Check for proper heading structure
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
}) 
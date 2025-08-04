import { render, screen } from '../../utils/test-utils'

const SimpleComponent = () => (
  <div>
    <h1>Test Component</h1>
    <p>This is a test paragraph</p>
    <button>Click me</button>
  </div>
)

describe('SimpleComponent', () => {
  it('renders correctly', () => {
    render(<SimpleComponent />)
    
    expect(screen.getByText('Test Component')).toBeInTheDocument()
    expect(screen.getByText('This is a test paragraph')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has proper heading structure', () => {
    render(<SimpleComponent />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Test Component')
  })

  it('has accessible button', () => {
    render(<SimpleComponent />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })
}) 
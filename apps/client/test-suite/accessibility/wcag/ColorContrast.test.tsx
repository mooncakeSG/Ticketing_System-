import { render } from '../../utils/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('WCAG Color Contrast Compliance', () => {
  it('meets WCAG 2.1 AA contrast requirements', async () => {
    const MockComponent = () => (
      <div>
        <h1 style={{ color: '#000000', backgroundColor: '#ffffff' }}>
          High Contrast Heading
        </h1>
        <p style={{ color: '#333333', backgroundColor: '#ffffff' }}>
          Normal text with good contrast
        </p>
        <button 
          style={{ 
            color: '#ffffff', 
            backgroundColor: '#0066cc',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Accessible Button
        </button>
        <a 
          href="#" 
          style={{ color: '#0066cc', textDecoration: 'underline' }}
        >
          Accessible Link
        </a>
      </div>
    )

    const { container } = render(<MockComponent />)
    const results = await axe(container)
    
    expect(results).toHaveNoViolations()
  })

  it('identifies insufficient color contrast', async () => {
    const MockComponentWithPoorContrast = () => (
      <div>
        <h1 style={{ color: '#cccccc', backgroundColor: '#ffffff' }}>
          Poor Contrast Heading
        </h1>
        <p style={{ color: '#999999', backgroundColor: '#ffffff' }}>
          Text with poor contrast
        </p>
        <button 
          style={{ 
            color: '#cccccc', 
            backgroundColor: '#f0f0f0',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Poor Contrast Button
        </button>
      </div>
    )

    const { container } = render(<MockComponentWithPoorContrast />)
    const results = await axe(container)
    
    // This should fail the accessibility test
    expect(results.violations.length).toBeGreaterThan(0)
  })

  it('ensures focus indicators are visible', async () => {
    const MockComponentWithFocus = () => (
      <div>
        <button 
          style={{ 
            color: '#ffffff', 
            backgroundColor: '#0066cc',
            padding: '8px 16px',
            border: '2px solid transparent',
            borderRadius: '4px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ff6600'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'transparent'
          }}
        >
          Focusable Button
        </button>
        <a 
          href="#" 
          style={{ 
            color: '#0066cc', 
            textDecoration: 'underline',
            outline: '2px solid #ff6600',
            outlineOffset: '2px'
          }}
        >
          Focusable Link
        </a>
      </div>
    )

    const { container } = render(<MockComponentWithFocus />)
    const results = await axe(container)
    
    expect(results).toHaveNoViolations()
  })

  it('validates form field contrast', async () => {
    const MockForm = () => (
      <form>
        <label htmlFor="name" style={{ color: '#333333' }}>
          Name:
        </label>
        <input 
          id="name"
          type="text"
          style={{ 
            color: '#000000',
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            padding: '8px'
          }}
        />
        
        <label htmlFor="email" style={{ color: '#333333' }}>
          Email:
        </label>
        <input 
          id="email"
          type="email"
          style={{ 
            color: '#000000',
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            padding: '8px'
          }}
        />
        
        <button 
          type="submit"
          style={{ 
            color: '#ffffff', 
            backgroundColor: '#0066cc',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Submit
        </button>
      </form>
    )

    const { container } = render(<MockForm />)
    const results = await axe(container)
    
    expect(results).toHaveNoViolations()
  })

  it('checks for color-only information', async () => {
    const MockComponentWithColorInfo = () => (
      <div>
        {/* Good: Uses both color and text */}
        <span style={{ color: '#ff0000' }}>Error: Invalid input</span>
        
        {/* Good: Uses both color and icon */}
        <span style={{ color: '#00ff00' }}>
          <span aria-label="Success">✓</span> Success
        </span>
        
        {/* Good: Uses both color and pattern */}
        <div style={{ backgroundColor: '#ffff00' }}>
          <span aria-label="Warning">⚠</span> Warning message
        </div>
      </div>
    )

    const { container } = render(<MockComponentWithColorInfo />)
    const results = await axe(container)
    
    expect(results).toHaveNoViolations()
  })
}) 
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test data utilities
export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockTicket = (overrides = {}) => ({
  id: 1,
  title: 'Test Ticket',
  description: 'This is a test ticket',
  status: 'open',
  priority: 'medium',
  assignedTo: null,
  createdBy: createMockUser(),
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockClient = (overrides = {}) => ({
  id: 1,
  name: 'Test Client',
  email: 'client@example.com',
  phone: '+1234567890',
  company: 'Test Company',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

// Wait utilities
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0))

export const waitForElementToBeRemoved = (element: Element) =>
  new Promise(resolve => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect()
        resolve(undefined)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })

// Form testing utilities
export const fillForm = async (formData: Record<string, string>) => {
  const { user } = await import('@testing-library/user-event')
  const userEvent = user.setup()
  
  for (const [name, value] of Object.entries(formData)) {
    const element = document.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (element) {
      await userEvent.type(element, value)
    }
  }
}

export const submitForm = async () => {
  const { user } = await import('@testing-library/user-event')
  const userEvent = user.setup()
  
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
  if (submitButton) {
    await userEvent.click(submitButton)
  }
}

// Accessibility testing utilities
export const checkA11y = async (container: HTMLElement) => {
  const { axe, toHaveNoViolations } = await import('jest-axe')
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Mock router utilities
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
}

// Mock session utilities
export const mockSession = {
  user: createMockUser(),
  expires: '2024-12-31T23:59:59Z',
}

// Mock API response utilities
export const createApiResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
  config: {},
})

export const createApiError = (message: string, status = 400) => ({
  response: {
    data: { message },
    status,
    statusText: 'Error',
    headers: {},
    config: {},
  },
}) 
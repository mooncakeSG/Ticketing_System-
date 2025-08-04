import dynamic from 'next/dynamic'

// Dynamic imports for heavy components
export const DynamicEditor = dynamic(
  () => import('@/components/BlockEditor'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
    ssr: false,
  }
)

export const DynamicMonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
    ssr: false,
  }
)

export const DynamicChart = dynamic(
  () => import('@/components/analytics/Chart'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
    ssr: false,
  }
)

export const DynamicCalendar = dynamic(
  () => import('@/components/Calendar'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
    ssr: false,
  }
)

export const DynamicFileUpload = dynamic(
  () => import('@/components/FileUpload'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded" />,
    ssr: false,
  }
)

// Modal components with dynamic loading
export const DynamicCreateTicketModal = dynamic(
  () => import('@/components/CreateTicketModal'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
    ssr: false,
  }
)

export const DynamicCreateUserModal = dynamic(
  () => import('@/components/UpdateUserModal'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
    ssr: false,
  }
)

// Heavy UI components
export const DynamicDataTable = dynamic(
  () => import('@/components/ui/DataTable'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
    ssr: false,
  }
)

export const DynamicRichTextEditor = dynamic(
  () => import('@/components/RichTextEditor'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
    ssr: false,
  }
)

// Analytics and reporting components
export const DynamicAnalytics = dynamic(
  () => import('@/components/analytics/Analytics'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
    ssr: false,
  }
)

export const DynamicReports = dynamic(
  () => import('@/components/reports/Reports'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
    ssr: false,
  }
)

// Utility function for creating dynamic imports
export const createDynamicImport = (
  importFn: () => Promise<any>,
  options: {
    loading?: React.ComponentType
    ssr?: boolean
    fallback?: React.ReactNode
  } = {}
) => {
  return dynamic(importFn, {
    loading: options.loading || (() => <div className="animate-pulse bg-gray-200 h-32 rounded" />),
    ssr: options.ssr ?? false,
  })
}

// Route-based code splitting
export const DynamicPage = {
  Analytics: dynamic(() => import('@/app/analytics/page'), {
    loading: () => <div className="animate-pulse bg-gray-200 h-screen rounded" />,
  }),
  Reports: dynamic(() => import('@/app/reports/page'), {
    loading: () => <div className="animate-pulse bg-gray-200 h-screen rounded" />,
  }),
  Settings: dynamic(() => import('@/app/settings/page'), {
    loading: () => <div className="animate-pulse bg-gray-200 h-screen rounded" />,
  }),
  Admin: dynamic(() => import('@/app/admin/page'), {
    loading: () => <div className="animate-pulse bg-gray-200 h-screen rounded" />,
  }),
}

// Performance monitoring for dynamic imports
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    const startTime = performance.now()
    
    return (
      <Component
        {...props}
        onLoad={() => {
          const loadTime = performance.now() - startTime
          console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`)
        }}
      />
    )
  }
} 
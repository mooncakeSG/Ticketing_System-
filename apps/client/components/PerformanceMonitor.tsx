'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
}

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // First Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime)
            // Send to analytics
            sendMetric('fcp', entry.startTime)
          }
        }
      }).observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('LCP:', entry.startTime)
          sendMetric('lcp', entry.startTime)
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime)
          sendMetric('fid', entry.processingStart - entry.startTime)
        }
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        let cls = 0
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += (entry as any).value
          }
        }
        console.log('CLS:', cls)
        sendMetric('cls', cls)
      }).observe({ entryTypes: ['layout-shift'] })

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
        console.log('TTFB:', ttfb)
        sendMetric('ttfb', ttfb)
      }
    }

    // Send metrics to analytics
    const sendMetric = (metric: string, value: number) => {
      // In production, send to your analytics service
      // Example: Google Analytics, Sentry, etc.
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metric - ${metric}:`, value)
      }
    }

    // Track page load performance
    const trackPageLoad = () => {
      window.addEventListener('load', () => {
        const loadTime = performance.now()
        console.log('Page Load Time:', loadTime)
        sendMetric('pageLoad', loadTime)
      })
    }

    // Track resource loading
    const trackResourceLoading = () => {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            console.log(`Resource Load - ${resourceEntry.name}:`, resourceEntry.duration)
          }
        }
      }).observe({ entryTypes: ['resource'] })
    }

    // Initialize tracking
    trackWebVitals()
    trackPageLoad()
    trackResourceLoading()

    // Track memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      console.log('Memory Usage:', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      })
    }
  }, [])

  return null // This component doesn't render anything
}

export default PerformanceMonitor 
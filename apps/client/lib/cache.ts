interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
}

class Cache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize: number
  private defaultTTL: number

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100
    this.defaultTTL = options.ttl || 5 * 60 * 1000 // 5 minutes default
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Remove expired entries
    this.cleanup()

    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    this.cleanup()
    return this.cache.size
  }

  private cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache statistics
  getStats() {
    this.cleanup()
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Create cache instances for different purposes
export const apiCache = new Cache({ ttl: 2 * 60 * 1000, maxSize: 50 }) // 2 minutes for API calls
export const userCache = new Cache({ ttl: 10 * 60 * 1000, maxSize: 20 }) // 10 minutes for user data
export const configCache = new Cache({ ttl: 30 * 60 * 1000, maxSize: 10 }) // 30 minutes for config

// Cache utility functions
export const cacheUtils = {
  // Generate cache key from API endpoint and parameters
  generateKey: (endpoint: string, params?: Record<string, any>): string => {
    const paramString = params ? JSON.stringify(params) : ''
    return `${endpoint}:${paramString}`
  },

  // Cache API response
  cacheApiResponse: async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    // Check cache first
    const cached = apiCache.get<T>(key)
    if (cached) {
      return cached
    }

    // Fetch fresh data
    const data = await fetchFn()
    apiCache.set(key, data, ttl)
    return data
  },

  // Invalidate cache entries by pattern
  invalidatePattern: (pattern: string): void => {
    // Note: This would need a public method to access cache keys
    // For now, we'll use a different approach
    console.warn('invalidatePattern: Not implemented - cache keys are private')
  },

  // Preload data into cache
  preload: async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<void> => {
    try {
      const data = await fetchFn()
      apiCache.set(key, data, ttl)
    } catch (error) {
      console.warn('Failed to preload cache:', error)
    }
  },
}

// React Query cache integration
export const queryCache = {
  // Cache query results
  setQueryData: <T>(queryKey: string[], data: T): void => {
    const key = queryKey.join(':')
    apiCache.set(key, data)
  },

  // Get cached query data
  getQueryData: <T>(queryKey: string[]): T | null => {
    const key = queryKey.join(':')
    return apiCache.get<T>(key)
  },

  // Invalidate query cache
  invalidateQueries: (queryKey: string[]): void => {
    const key = queryKey.join(':')
    apiCache.delete(key)
  },
}

// Local storage cache for persistent data
export const localStorageCache = {
  set: <T>(key: string, data: T, ttl?: number): void => {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || 24 * 60 * 60 * 1000, // 24 hours default
    }
    localStorage.setItem(key, JSON.stringify(entry))
  },

  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const entry: CacheEntry<T> = JSON.parse(item)
      
      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        localStorage.removeItem(key)
        return null
      }

      return entry.data
    } catch {
      return null
    }
  },

  delete: (key: string): void => {
    localStorage.removeItem(key)
  },

  clear: (): void => {
    localStorage.clear()
  },
}

// Performance monitoring for cache
export const cachePerformance = {
  hits: 0,
  misses: 0,

  recordHit: () => {
    cachePerformance.hits++
  },

  recordMiss: () => {
    cachePerformance.misses++
  },

  getHitRate: (): number => {
    const total = cachePerformance.hits + cachePerformance.misses
    return total > 0 ? cachePerformance.hits / total : 0
  },

  reset: () => {
    cachePerformance.hits = 0
    cachePerformance.misses = 0
  },
}

export default Cache 
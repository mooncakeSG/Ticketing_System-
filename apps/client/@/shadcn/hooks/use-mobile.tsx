import * as React from "react"
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      
      const updateIsMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }

      updateIsMobile()
      mql.addEventListener('change', updateIsMobile)

      return () => mql.removeEventListener('change', updateIsMobile)
    }
  }, [])

  return isMobile
}

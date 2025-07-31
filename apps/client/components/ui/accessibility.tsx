'use client';

import React, { useEffect, useRef, useState } from 'react';

// Focus trap hook for modals and dialogs
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors.join(', '))
    ).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    setFocusableElements(elements);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (elements.length > 0) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the first element when trap is enabled
      elements[0].focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, focusableElements]);

  return containerRef;
}

// Skip link component for keyboard users
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {children}
    </a>
  );
}

// Screen reader only text
export function ScreenReaderText({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Live region for announcements
export function LiveRegion({ 
  children, 
  role = 'status', 
  'aria-live': ariaLive = 'polite' 
}: { 
  children: React.ReactNode; 
  role?: 'status' | 'alert' | 'log'; 
  'aria-live'?: 'polite' | 'assertive' | 'off';
}) {
  return (
    <div role={role} aria-live={ariaLive} className="sr-only">
      {children}
    </div>
  );
}

// Keyboard shortcut display component
export function KeyboardShortcut({ keys }: { keys: string[] }) {
  return (
    <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <span className="text-xs">{key}</span>
          {index < keys.length - 1 && <span className="text-xs">+</span>}
        </React.Fragment>
      ))}
    </kbd>
  );
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Color scheme detection
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'no-preference'>('no-preference');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateColorScheme = () => {
      if (mediaQuery.matches) {
        setColorScheme('dark');
      } else {
        setColorScheme('light');
      }
    };

    updateColorScheme();
    mediaQuery.addEventListener('change', updateColorScheme);
    return () => mediaQuery.removeEventListener('change', updateColorScheme);
  }, []);

  return colorScheme;
}

// Accessibility announcement hook
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (announcement) {
      const timeout = setTimeout(() => {
        setAnnouncement('');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [announcement]);

  return { announcement, setAnnouncement };
}

// Focus management hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const trapFocus = (container: HTMLElement) => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setFocusedElement(container);
  };

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      setFocusedElement(null);
    }
  };

  return { focusedElement, trapFocus, restoreFocus };
}

// Accessibility context provider
interface AccessibilityContextType {
  announcements: string[];
  addAnnouncement: (message: string) => void;
  isHighContrast: boolean;
  prefersReducedMotion: boolean;
  colorScheme: 'light' | 'dark' | 'no-preference';
}

const AccessibilityContext = React.createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const isHighContrast = useHighContrastMode();
  const prefersReducedMotion = useReducedMotion();
  const colorScheme = useColorScheme();

  const addAnnouncement = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    // Remove announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(announcement => announcement !== message));
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        announcements,
        addAnnouncement,
        isHighContrast,
        prefersReducedMotion,
        colorScheme,
      }}
    >
      {children}
      {/* Live region for announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = React.useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
} 
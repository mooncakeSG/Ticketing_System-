'use client';

import React from 'react';
import { MobileNavigation, BottomNavigation } from '../ui/mobile-nav';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export function ResponsiveLayout({ children, showBottomNav = true }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Main Content */}
      <main className="pb-20 lg:pb-0">
        {children}
      </main>
      
      {/* Bottom Navigation for mobile */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}

// Responsive container with proper padding for mobile
export function ResponsiveContainer({ children, className = '' }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`px-4 py-6 lg:px-6 lg:py-8 ${className}`}>
      {children}
    </div>
  );
}

// Responsive grid that adapts to screen size
export function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className = ''
}: { 
  children: React.ReactNode; 
  cols?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  className?: string;
}) {
  const gridCols = {
    sm: cols.sm ? `grid-cols-${cols.sm}` : '',
    md: cols.md ? `md:grid-cols-${cols.md}` : '',
    lg: cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    xl: cols.xl ? `xl:grid-cols-${cols.xl}` : '',
  };

  const gridClasses = Object.values(gridCols).filter(Boolean).join(' ');
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid ${gridClasses} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

// Responsive card that adapts to screen size
export function ResponsiveCard({ 
  children, 
  className = '',
  padding = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  padding?: 'sm' | 'default' | 'lg';
}) {
  const paddingClasses = {
    sm: 'p-3 lg:p-4',
    default: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8',
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-sm ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

// Responsive text that scales with screen size
export function ResponsiveText({ 
  children, 
  size = 'base',
  className = ''
}: { 
  children: React.ReactNode; 
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'text-xs lg:text-sm',
    sm: 'text-sm lg:text-base',
    base: 'text-base lg:text-lg',
    lg: 'text-lg lg:text-xl',
    xl: 'text-xl lg:text-2xl',
    '2xl': 'text-2xl lg:text-3xl',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Responsive button that adapts to touch targets on mobile
export function ResponsiveButton({ 
  children, 
  className = '',
  size = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm lg:px-4 lg:py-2',
    default: 'px-4 py-2 text-base lg:px-6 lg:py-3',
    lg: 'px-6 py-3 text-lg lg:px-8 lg:py-4',
  };

  return (
    <button 
      className={`${sizeClasses[size]} min-h-[44px] lg:min-h-[40px] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 
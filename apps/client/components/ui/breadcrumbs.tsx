'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-foreground">
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Auto-generated breadcrumbs based on current route
export function AutoBreadcrumbs() {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(Boolean);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4" />
    }
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbItems.push({
      label,
      href: index === pathSegments.length - 1 ? undefined : currentPath
    });
  });

  return <Breadcrumbs items={breadcrumbItems} />;
}

// Collapsible breadcrumbs for mobile
export function CollapsibleBreadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (items.length <= 2) {
    return <Breadcrumbs items={items} className={className} />;
  }

  const visibleItems = isExpanded ? items : [items[0], items[items.length - 1]];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Breadcrumbs items={visibleItems} />
      {items.length > 2 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-muted-foreground hover:text-foreground"
          aria-label={isExpanded ? 'Collapse breadcrumbs' : 'Expand breadcrumbs'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      )}
    </div>
  );
}

// Breadcrumb with page title
export function PageBreadcrumbs({ 
  title, 
  items = [], 
  className = '' 
}: { 
  title: string; 
  items?: BreadcrumbItem[];
  className?: string;
}) {
  const allItems = [
    ...items,
    { label: title }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <CollapsibleBreadcrumbs items={allItems} />
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

// Breadcrumb with actions
export function BreadcrumbsWithActions({ 
  items, 
  actions, 
  className = '' 
}: { 
  items: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Breadcrumbs items={items} />
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
} 
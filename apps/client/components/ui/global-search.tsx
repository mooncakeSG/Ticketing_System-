'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { KeyboardShortcut } from './accessibility';

interface SearchResult {
  id: string;
  type: 'ticket' | 'user' | 'message' | 'page';
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Mock search results - in real app, this would come from API
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'ticket',
    title: 'Login page not working',
    description: 'Users cannot access the login page',
    url: '/tickets/1',
    icon: <div className="w-2 h-2 bg-red-500 rounded-full" />,
    priority: 'high'
  },
  {
    id: '2',
    type: 'user',
    title: 'John Doe',
    description: 'john.doe@example.com',
    url: '/users/2',
    icon: <div className="w-2 h-2 bg-blue-500 rounded-full" />
  },
  {
    id: '3',
    type: 'page',
    title: 'Settings',
    description: 'Application settings and preferences',
    url: '/settings',
    icon: <div className="w-2 h-2 bg-green-500 rounded-full" />
  }
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }

      // Escape to close search
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle search input navigation
  useEffect(() => {
    const handleSearchKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (results[selectedIndex]) {
            router.push(results[selectedIndex].url);
            setIsOpen(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleSearchKeyDown);
    return () => document.removeEventListener('keydown', handleSearchKeyDown);
  }, [isOpen, results, selectedIndex, router]);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API search delay
    const timeout = setTimeout(() => {
      const filteredResults = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-accent transition-colors"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <KeyboardShortcut keys={['⌘', 'K']} />
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50"
            >
              <div className="bg-background border border-border rounded-lg shadow-lg">
                {/* Search Input */}
                <div className="flex items-center p-4 border-b border-border">
                  <Search className="h-5 w-5 text-muted-foreground mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tickets, users, messages..."
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-accent rounded"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <motion.button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            index === selectedIndex
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent/50'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex-shrink-0">{result.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium truncate">{result.title}</span>
                              {result.priority && (
                                <span className={`text-xs ${getPriorityColor(result.priority)}`}>
                                  {result.priority}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-xs text-muted-foreground">
                            {result.type}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found for "{query}"
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Start typing to search...
                    </div>
                  )}
                </div>

                {/* Search Tips */}
                <div className="p-4 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Use ↑↓ to navigate, Enter to select</span>
                    <span>Esc to close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Search filters component
export function SearchFilters() {
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    status: 'all'
  });

  return (
    <div className="flex items-center space-x-2 p-2 border-b border-border">
      <select
        value={filters.type}
        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        className="text-xs border border-border rounded px-2 py-1 bg-background"
      >
        <option value="all">All Types</option>
        <option value="ticket">Tickets</option>
        <option value="user">Users</option>
        <option value="message">Messages</option>
      </select>
      
      <select
        value={filters.priority}
        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
        className="text-xs border border-border rounded px-2 py-1 bg-background"
      >
        <option value="all">All Priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      
      <select
        value={filters.status}
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        className="text-xs border border-border rounded px-2 py-1 bg-background"
      >
        <option value="all">All Status</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
        <option value="in-progress">In Progress</option>
      </select>
    </div>
  );
} 
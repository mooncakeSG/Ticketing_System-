'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, Plus, Settings, Users, BarChart3, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/@/shadcn/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Shortcut {
  key: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { key: '⌘ + K', description: 'Open search', category: 'Navigation', icon: <Search className="w-4 h-4" /> },
  { key: '⌘ + N', description: 'New ticket', category: 'Navigation', icon: <Plus className="w-4 h-4" /> },
  { key: '⌘ + ,', description: 'Settings', category: 'Navigation', icon: <Settings className="w-4 h-4" /> },
  { key: '⌘ + U', description: 'Users', category: 'Navigation', icon: <Users className="w-4 h-4" /> },
  { key: '⌘ + A', description: 'Analytics', category: 'Navigation', icon: <BarChart3 className="w-4 h-4" /> },
  { key: '⌘ + T', description: 'Tickets', category: 'Navigation', icon: <FileText className="w-4 h-4" /> },
  
  // Actions
  { key: '⌘ + Enter', description: 'Save changes', category: 'Actions' },
  { key: '⌘ + S', description: 'Save ticket', category: 'Actions' },
  { key: '⌘ + D', description: 'Duplicate ticket', category: 'Actions' },
  { key: '⌘ + Delete', description: 'Delete ticket', category: 'Actions' },
  { key: '⌘ + Z', description: 'Undo', category: 'Actions' },
  { key: '⌘ + Shift + Z', description: 'Redo', category: 'Actions' },
  
  // Selection
  { key: '⌘ + A', description: 'Select all tickets', category: 'Selection' },
  { key: 'Shift + Click', description: 'Multi-select tickets', category: 'Selection' },
  { key: '⌘ + Click', description: 'Add to selection', category: 'Selection' },
  
  // View
  { key: '⌘ + 1', description: 'List view', category: 'View' },
  { key: '⌘ + 2', description: 'Kanban view', category: 'View' },
  { key: '⌘ + 3', description: 'Timeline view', category: 'View' },
  { key: '⌘ + F', description: 'Focus search', category: 'View' },
  { key: '⌘ + B', description: 'Toggle sidebar', category: 'View' },
  
  // Help
  { key: '⌘ + ?', description: 'Show shortcuts', category: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
];

const categories = ['Navigation', 'Actions', 'Selection', 'View', 'Help'];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Navigation');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + ? to open shortcuts
      if ((event.metaKey || event.ctrlKey) && event.key === '?') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredShortcuts = shortcuts.filter(s => s.category === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs">
          <HelpCircle className="w-4 h-4 mr-1" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Category Tabs */}
          <div className="flex gap-1 mb-4 border-b">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Shortcuts List */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-3">
              {filteredShortcuts.map((shortcut) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    {shortcut.icon && (
                      <div className="text-muted-foreground">
                        {shortcut.icon}
                      </div>
                    )}
                    <span className="text-sm">{shortcut.description}</span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {shortcut.key}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <p>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">⌘ + ?</kbd> anytime to show this help.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Global keyboard shortcuts hook
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (!modifier) return;

      switch (event.key.toLowerCase()) {
        case 'k':
          event.preventDefault();
          // Trigger search
          break;
        case 'n':
          event.preventDefault();
          // Create new ticket
          break;
        case ',':
          event.preventDefault();
          // Open settings
          break;
        case 'a':
          event.preventDefault();
          // Select all
          break;
        case 'f':
          event.preventDefault();
          // Focus search
          break;
        case 'b':
          event.preventDefault();
          // Toggle sidebar
          break;
        case '1':
        case '2':
        case '3':
          event.preventDefault();
          // Switch views
          break;
        case 'enter':
          event.preventDefault();
          // Save changes
          break;
        case 's':
          event.preventDefault();
          // Save ticket
          break;
        case 'd':
          event.preventDefault();
          // Duplicate ticket
          break;
        case 'delete':
          event.preventDefault();
          // Delete ticket
          break;
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            // Redo
          } else {
            // Undo
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Shortcut indicator component
interface ShortcutIndicatorProps {
  shortcut: string;
  className?: string;
}

export function ShortcutIndicator({ shortcut, className }: ShortcutIndicatorProps) {
  return (
    <Badge variant="outline" className={cn('font-mono text-xs', className)}>
      {shortcut}
    </Badge>
  );
} 
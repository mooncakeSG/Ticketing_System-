'use client';

import React, { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Check, GripVertical, MoreHorizontal, User, Calendar, Tag } from 'lucide-react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/@/shadcn/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Ticket {
  id: string;
  Number: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface DraggableTicketProps {
  ticket: Ticket;
  isSelected?: boolean;
  onSelect?: (ticketId: string, selected: boolean) => void;
  onStatusChange?: (ticketId: string, newStatus: string) => void;
  onPriorityChange?: (ticketId: string, newPriority: string) => void;
  onAssign?: (ticketId: string, userId: string) => void;
  className?: string;
  showCheckbox?: boolean;
}

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800',
  high: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-800',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800',
  low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
};

const statusColors = {
  open: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-800',
  resolved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
  closed: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-800',
  hold: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800',
};

export function DraggableTicket({
  ticket,
  isSelected = false,
  onSelect,
  onStatusChange,
  onPriorityChange,
  onAssign,
  className,
  showCheckbox = true,
}: DraggableTicketProps) {
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!elementRef.current) return;

    const cleanup = draggable({
      element: elementRef.current,
      dragHandle: elementRef.current.querySelector('[data-drag-handle]') as HTMLElement,
      getInitialData: () => ({ ticketId: ticket.id }),
    });

    return cleanup;
  }, [ticket.id]);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(ticket.id, !isSelected);
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange?.(ticket.id, newStatus);
  };

  const handlePriorityChange = (newPriority: string) => {
    onPriorityChange?.(ticket.id, newPriority);
  };

  return (
    <motion.div
      ref={elementRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative group cursor-pointer',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isDragging && 'opacity-50',
        className
      )}
    >
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <div
              data-drag-handle
              className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Checkbox */}
            {showCheckbox && (
              <div className="flex-shrink-0 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={handleSelect}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </Button>
              </div>
            )}

            {/* Ticket Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-baseline gap-2 min-w-0 flex-1">
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    #{ticket.Number}
                  </span>
                  <h3 className="text-sm font-medium truncate">{ticket.title}</h3>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange('open')}>
                      Mark as Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('resolved')}>
                      Mark as Resolved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('closed')}>
                      Mark as Closed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('hold')}>
                      Put On Hold
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tags and Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    priorityColors[ticket.priority as keyof typeof priorityColors]
                  )}
                >
                  {ticket.priority}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    statusColors[ticket.status as keyof typeof statusColors]
                  )}
                >
                  {ticket.status.replace('_', ' ')}
                </Badge>
                {ticket.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{ticket.assignedTo.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Multi-select container component
interface MultiSelectContainerProps {
  children: React.ReactNode;
  selectedTickets: string[];
  onBulkAction?: (action: string, ticketIds: string[]) => void;
  className?: string;
}

export function MultiSelectContainer({
  children,
  selectedTickets,
  onBulkAction,
  className,
}: MultiSelectContainerProps) {
  if (selectedTickets.length === 0) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {/* Bulk Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background border-b p-3 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.('status', selectedTickets)}
            >
              Change Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.('priority', selectedTickets)}
            >
              Change Priority
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.('assign', selectedTickets)}
            >
              Assign
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction?.('clear', [])}
          >
            Clear Selection
          </Button>
        </div>
      </motion.div>
      {children}
    </div>
  );
} 
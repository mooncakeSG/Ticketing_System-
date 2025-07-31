'use client';

import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Grid, Settings, Plus, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/@/shadcn/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DashboardWidget {
  id: string;
  type: 'tickets' | 'analytics' | 'users' | 'reports' | 'notifications' | 'activity';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  isMinimized: boolean;
  isPinned: boolean;
}

interface CustomizableDashboardProps {
  className?: string;
  initialWidgets?: DashboardWidget[];
  onLayoutChange?: (widgets: DashboardWidget[]) => void;
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'tickets-overview',
    type: 'tickets',
    title: 'Recent Tickets',
    size: 'medium',
    position: { x: 0, y: 0 },
    isMinimized: false,
    isPinned: false,
  },
  {
    id: 'analytics-chart',
    type: 'analytics',
    title: 'Analytics Overview',
    size: 'large',
    position: { x: 0, y: 1 },
    isMinimized: false,
    isPinned: false,
  },
  {
    id: 'user-activity',
    type: 'activity',
    title: 'User Activity',
    size: 'small',
    position: { x: 1, y: 0 },
    isMinimized: false,
    isPinned: false,
  },
];

const widgetSizes = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-2 row-span-2',
  large: 'col-span-3 row-span-3',
};

export function CustomizableDashboard({
  className,
  initialWidgets = defaultWidgets,
  onLayoutChange,
}: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(initialWidgets);
  const [isEditing, setIsEditing] = useState(false);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  useEffect(() => {
    onLayoutChange?.(widgets);
  }, [widgets, onLayoutChange]);

  const addWidget = (type: DashboardWidget['type']) => {
    const newWidget: DashboardWidget = {
      id: `${type}-${Date.now()}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      size: 'medium',
      position: { x: 0, y: widgets.length },
      isMinimized: false,
      isPinned: false,
    };
    setWidgets(prev => [...prev, newWidget]);
    setShowWidgetSelector(false);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const toggleMinimize = (widgetId: string) => {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId ? { ...w, isMinimized: !w.isMinimized } : w
      )
    );
  };

  const togglePin = (widgetId: string) => {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId ? { ...w, isPinned: !w.isPinned } : w
      )
    );
  };

  const changeSize = (widgetId: string, size: DashboardWidget['size']) => {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId ? { ...w, size } : w
      )
    );
  };

  const renderWidgetContent = (widget: DashboardWidget) => {
    if (widget.isMinimized) {
      return (
        <div className="flex items-center justify-center h-12 text-muted-foreground">
          {widget.title}
        </div>
      );
    }

    switch (widget.type) {
      case 'tickets':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Tickets</h3>
              <Badge variant="secondary">5 new</Badge>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2 p-2 rounded border">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Ticket #{1000 + i}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Open
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-xs text-muted-foreground">Resolved Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-xs text-muted-foreground">Total Tickets</div>
              </div>
            </div>
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-white">
              <span className="text-sm">Chart Placeholder</span>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-3">
            <h3 className="font-medium">Recent Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>User John updated ticket #1234</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>New ticket #1235 created</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Ticket #1230 assigned to Sarah</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {widget.title}
          </div>
        );
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <Badge variant="outline">{widgets.length} widgets</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditing ? 'Done' : 'Customize'}
          </Button>
          <Dialog open={showWidgetSelector} onOpenChange={setShowWidgetSelector}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Widget</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {(['tickets', 'analytics', 'users', 'reports', 'notifications', 'activity'] as const).map(type => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => addWidget(type)}
                  >
                    <div className="text-lg font-medium capitalize">{type}</div>
                    <div className="text-xs text-muted-foreground">Widget</div>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-4 gap-4 auto-rows-min">
        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            layout
            className={cn(
              'relative',
              widgetSizes[widget.size],
              widget.isPinned && 'ring-2 ring-primary'
            )}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {widget.title}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {isEditing && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => togglePin(widget.id)}
                        >
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            widget.isPinned ? 'bg-primary' : 'bg-muted'
                          )} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeWidget(widget.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleMinimize(widget.id)}
                    >
                      {widget.isMinimized ? (
                        <Maximize2 className="w-3 h-3" />
                      ) : (
                        <Minimize2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {renderWidgetContent(widget)}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <Grid className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No widgets yet</h3>
          <p className="text-muted-foreground mb-4">
            Add widgets to customize your dashboard
          </p>
          <Button onClick={() => setShowWidgetSelector(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Widget
          </Button>
        </div>
      )}
    </div>
  );
}

// Hook for managing dashboard state
export function useDashboardState() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [layout, setLayout] = useState('grid');

  const saveLayout = () => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
    localStorage.setItem('dashboard-layout', layout);
  };

  const loadLayout = () => {
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    const savedLayout = localStorage.getItem('dashboard-layout');
    
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
    if (savedLayout) {
      setLayout(savedLayout);
    }
  };

  useEffect(() => {
    loadLayout();
  }, []);

  useEffect(() => {
    saveLayout();
  }, [widgets, layout]);

  return {
    widgets,
    setWidgets,
    layout,
    setLayout,
    saveLayout,
    loadLayout,
  };
} 
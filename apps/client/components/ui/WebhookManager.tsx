'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Trash2, Copy, Eye, EyeOff, TestTube, Zap, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/@/shadcn/ui/input';
import { Label } from '@/@/shadcn/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/@/shadcn/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/@/shadcn/ui/select';
import { Switch } from '@/@/shadcn/ui/switch';
import { Textarea } from '@/@/shadcn/ui/textarea';
import { cn } from '@/lib/utils';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  method: 'POST' | 'PUT' | 'PATCH';
  headers: Record<string, string>;
  isActive: boolean;
  retryCount: number;
  timeout: number;
  lastTriggered?: Date;
  lastStatus?: number;
  createdAt: Date;
  description?: string;
}

interface WebhookManagerProps {
  className?: string;
  onWebhooksChange?: (webhooks: Webhook[]) => void;
}

const availableEvents = [
  { value: 'ticket.created', label: 'Ticket Created' },
  { value: 'ticket.updated', label: 'Ticket Updated' },
  { value: 'ticket.closed', label: 'Ticket Closed' },
  { value: 'ticket.assigned', label: 'Ticket Assigned' },
  { value: 'comment.created', label: 'Comment Created' },
  { value: 'user.created', label: 'User Created' },
  { value: 'user.updated', label: 'User Updated' },
  { value: 'notification.sent', label: 'Notification Sent' },
] as const;

const httpMethods = [
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
] as const;

export function WebhookManager({
  className,
  onWebhooksChange,
}: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  // Form state for new/editing webhook
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
    method: 'POST' as Webhook['method'],
    headers: {} as Record<string, string>,
    isActive: true,
    retryCount: 3,
    timeout: 30,
    description: '',
  });

  useEffect(() => {
    loadWebhooks();
  }, []);

  useEffect(() => {
    onWebhooksChange?.(webhooks);
  }, [webhooks, onWebhooksChange]);

  const loadWebhooks = () => {
    const savedWebhooks = localStorage.getItem('webhooks');
    if (savedWebhooks) {
      setWebhooks(JSON.parse(savedWebhooks));
    }
  };

  const saveWebhooks = (newWebhooks: Webhook[]) => {
    localStorage.setItem('webhooks', JSON.stringify(newWebhooks));
    setWebhooks(newWebhooks);
  };

  const createWebhook = () => {
    const newWebhook: Webhook = {
      id: `webhook-${Date.now()}`,
      name: webhookForm.name,
      url: webhookForm.url,
      events: webhookForm.events,
      method: webhookForm.method,
      headers: webhookForm.headers,
      isActive: webhookForm.isActive,
      retryCount: webhookForm.retryCount,
      timeout: webhookForm.timeout,
      description: webhookForm.description,
      createdAt: new Date(),
    };

    const updatedWebhooks = [...webhooks, newWebhook];
    saveWebhooks(updatedWebhooks);
    resetForm();
  };

  const updateWebhook = () => {
    if (!editingWebhook) return;

    const updatedWebhook: Webhook = {
      ...editingWebhook,
      name: webhookForm.name,
      url: webhookForm.url,
      events: webhookForm.events,
      method: webhookForm.method,
      headers: webhookForm.headers,
      isActive: webhookForm.isActive,
      retryCount: webhookForm.retryCount,
      timeout: webhookForm.timeout,
      description: webhookForm.description,
    };

    const updatedWebhooks = webhooks.map(w => w.id === editingWebhook.id ? updatedWebhook : w);
    saveWebhooks(updatedWebhooks);
    setEditingWebhook(null);
    resetForm();
  };

  const deleteWebhook = (webhookId: string) => {
    const updatedWebhooks = webhooks.filter(w => w.id !== webhookId);
    saveWebhooks(updatedWebhooks);
  };

  const toggleWebhookActive = (webhookId: string) => {
    const updatedWebhooks = webhooks.map(w =>
      w.id === webhookId ? { ...w, isActive: !w.isActive } : w
    );
    saveWebhooks(updatedWebhooks);
  };

  const duplicateWebhook = (webhook: Webhook) => {
    const duplicatedWebhook: Webhook = {
      ...webhook,
      id: `webhook-${Date.now()}`,
      name: `${webhook.name} (Copy)`,
      createdAt: new Date(),
    };
    const updatedWebhooks = [...webhooks, duplicatedWebhook];
    saveWebhooks(updatedWebhooks);
  };

  const testWebhook = async (webhook: Webhook) => {
    try {
      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookId: webhook.id,
          testData: {
            event: 'test',
            timestamp: new Date().toISOString(),
            data: {
              message: 'This is a test webhook',
              webhookId: webhook.id,
            },
          },
        }),
      });

      if (response.ok) {
        // Update webhook with test results
        const updatedWebhooks = webhooks.map(w =>
          w.id === webhook.id
            ? { ...w, lastTriggered: new Date(), lastStatus: response.status }
            : w
        );
        saveWebhooks(updatedWebhooks);
      }
    } catch (error) {
      console.error('Failed to test webhook:', error);
    }
  };

  const resetForm = () => {
    setWebhookForm({
      name: '',
      url: '',
      events: [],
      method: 'POST',
      headers: {},
      isActive: true,
      retryCount: 3,
      timeout: 30,
      description: '',
    });
    setIsEditing(false);
    setEditingWebhook(null);
  };

  const startEditing = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setWebhookForm({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      method: webhook.method,
      headers: webhook.headers,
      isActive: webhook.isActive,
      retryCount: webhook.retryCount,
      timeout: webhook.timeout,
      description: webhook.description || '',
    });
    setIsEditing(true);
  };

  const addHeader = () => {
    const key = prompt('Enter header key:');
    const value = prompt('Enter header value:');
    if (key && value) {
      setWebhookForm(prev => ({
        ...prev,
        headers: { ...prev.headers, [key]: value },
      }));
    }
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...webhookForm.headers };
    delete newHeaders[key];
    setWebhookForm(prev => ({ ...prev, headers: newHeaders }));
  };

  const getStatusColor = (status?: number) => {
    if (!status) return 'bg-gray-500';
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Webhook Manager</h2>
          <Badge variant="outline">{webhooks.length} webhooks</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showLogs ? 'Hide' : 'Show'} Logs
          </Button>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhook Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {isEditing ? 'Edit Webhook' : 'Add New Webhook'}
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={editingWebhook ? updateWebhook : createWebhook}>
                      {editingWebhook ? 'Update' : 'Create'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhook-name">Webhook Name</Label>
                  <Input
                    id="webhook-name"
                    value={webhookForm.name}
                    onChange={(e) => setWebhookForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Slack Notifications"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={webhookForm.url}
                    onChange={(e) => setWebhookForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://hooks.slack.com/..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="webhook-method">HTTP Method</Label>
                <Select
                  value={webhookForm.method}
                  onValueChange={(value) => setWebhookForm(prev => ({ ...prev, method: value as Webhook['method'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {httpMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Events</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableEvents.map(event => (
                    <label key={event.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={webhookForm.events.includes(event.value)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setWebhookForm(prev => ({
                              ...prev,
                              events: [...prev.events, event.value],
                            }));
                          } else {
                            setWebhookForm(prev => ({
                              ...prev,
                              events: prev.events.filter(ev => ev !== event.value),
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhook-retry">Retry Count</Label>
                  <Input
                    id="webhook-retry"
                    type="number"
                    min="0"
                    max="10"
                    value={webhookForm.retryCount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebhookForm(prev => ({ ...prev, retryCount: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-timeout">Timeout (seconds)</Label>
                  <Input
                    id="webhook-timeout"
                    type="number"
                    min="5"
                    max="300"
                    value={webhookForm.timeout}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebhookForm(prev => ({ ...prev, timeout: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="webhook-active"
                  checked={webhookForm.isActive}
                  onCheckedChange={(checked) => setWebhookForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="webhook-active">Active</Label>
              </div>

              <div>
                <Label htmlFor="webhook-description">Description</Label>
                <Textarea
                  id="webhook-description"
                  value={webhookForm.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWebhookForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>

              {/* Headers Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Headers</Label>
                  <Button variant="outline" size="sm" onClick={addHeader}>
                    Add Header
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(webhookForm.headers).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Input
                        value={key}
                        disabled
                        className="flex-1"
                      />
                      <Input
                        value={value}
                        disabled
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHeader(key)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhooks List */}
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        webhook.isActive ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                      <div>
                        <div className="font-medium">{webhook.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {webhook.url} • {webhook.events.length} events
                        </div>
                        {webhook.lastTriggered && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last: {new Date(webhook.lastTriggered).toLocaleString()}
                            {webhook.lastStatus && (
                              <div className={cn(
                                'w-2 h-2 rounded-full',
                                getStatusColor(webhook.lastStatus)
                              )} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testWebhook(webhook)}
                      >
                        <TestTube className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(webhook)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateWebhook(webhook)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWebhookActive(webhook.id)}
                      >
                        {webhook.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {webhooks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No webhooks configured
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Logs */}
        {showLogs && (
          <Card>
            <CardHeader>
              <CardTitle>Webhook Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{webhook.name}</span>
                      <Badge variant="outline">{webhook.events.length} events</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>URL: {webhook.url}</div>
                      <div>Method: {webhook.method}</div>
                      <div>Events: {webhook.events.join(', ')}</div>
                      {webhook.lastTriggered && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                          {webhook.lastStatus && (
                            <Badge
                              variant={webhook.lastStatus >= 200 && webhook.lastStatus < 300 ? 'default' : 'destructive'}
                              className="ml-2"
                            >
                              {webhook.lastStatus}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {webhooks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No webhooks to show logs for
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Hook for managing webhooks
export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  useEffect(() => {
    const savedWebhooks = localStorage.getItem('webhooks');
    if (savedWebhooks) {
      setWebhooks(JSON.parse(savedWebhooks));
    }
  }, []);

  const getActiveWebhooks = () => webhooks.filter(w => w.isActive);

  const getWebhooksByEvent = (event: string) => webhooks.filter(w => w.events.includes(event));

  return {
    webhooks,
    setWebhooks,
    getActiveWebhooks,
    getWebhooksByEvent,
  };
} 
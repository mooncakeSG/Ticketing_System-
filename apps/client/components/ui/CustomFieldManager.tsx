'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
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

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'email' | 'url';
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: string[]; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
}

interface CustomFieldManagerProps {
  className?: string;
  onFieldsChange?: (fields: CustomField[]) => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'date', label: 'Date Picker' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'email', label: 'Email Input' },
  { value: 'url', label: 'URL Input' },
] as const;

export function CustomFieldManager({
  className,
  onFieldsChange,
}: CustomFieldManagerProps) {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Form state for new/editing field
  const [fieldForm, setFieldForm] = useState({
    name: '',
    label: '',
    type: 'text' as CustomField['type'],
    required: false,
    defaultValue: '',
    placeholder: '',
    options: [] as string[],
    validation: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
      pattern: '',
      message: '',
    },
  });

  useEffect(() => {
    loadFields();
  }, []);

  useEffect(() => {
    onFieldsChange?.(fields);
  }, [fields, onFieldsChange]);

  const loadFields = () => {
    const savedFields = localStorage.getItem('custom-ticket-fields');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    }
  };

  const saveFields = (newFields: CustomField[]) => {
    localStorage.setItem('custom-ticket-fields', JSON.stringify(newFields));
    setFields(newFields);
  };

  const createField = () => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      name: fieldForm.name,
      label: fieldForm.label,
      type: fieldForm.type,
      required: fieldForm.required,
      defaultValue: fieldForm.defaultValue,
      placeholder: fieldForm.placeholder,
      options: fieldForm.options,
      validation: fieldForm.validation,
      isActive: true,
      order: fields.length,
      createdAt: new Date(),
    };

    const updatedFields = [...fields, newField];
    saveFields(updatedFields);
    resetForm();
  };

  const updateField = () => {
    if (!editingField) return;

    const updatedField: CustomField = {
      ...editingField,
      name: fieldForm.name,
      label: fieldForm.label,
      type: fieldForm.type,
      required: fieldForm.required,
      defaultValue: fieldForm.defaultValue,
      placeholder: fieldForm.placeholder,
      options: fieldForm.options,
      validation: fieldForm.validation,
    };

    const updatedFields = fields.map(f => f.id === editingField.id ? updatedField : f);
    saveFields(updatedFields);
    setEditingField(null);
    resetForm();
  };

  const deleteField = (fieldId: string) => {
    const updatedFields = fields.filter(f => f.id !== fieldId);
    saveFields(updatedFields);
  };

  const toggleFieldActive = (fieldId: string) => {
    const updatedFields = fields.map(f =>
      f.id === fieldId ? { ...f, isActive: !f.isActive } : f
    );
    saveFields(updatedFields);
  };

  const duplicateField = (field: CustomField) => {
    const duplicatedField: CustomField = {
      ...field,
      id: `field-${Date.now()}`,
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
      createdAt: new Date(),
    };
    const updatedFields = [...fields, duplicatedField];
    saveFields(updatedFields);
  };

  const resetForm = () => {
    setFieldForm({
      name: '',
      label: '',
      type: 'text',
      required: false,
      defaultValue: '',
      placeholder: '',
      options: [],
      validation: {
        min: undefined,
        max: undefined,
        pattern: '',
        message: '',
      },
    });
    setIsEditing(false);
    setEditingField(null);
  };

  const startEditing = (field: CustomField) => {
    setEditingField(field);
    setFieldForm({
      name: field.name,
      label: field.label,
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue || '',
      placeholder: field.placeholder || '',
      options: field.options || [],
      validation: field.validation ? {
        min: field.validation.min,
        max: field.validation.max,
        pattern: field.validation.pattern || '',
        message: field.validation.message || '',
      } : {
        min: undefined,
        max: undefined,
        pattern: '',
        message: '',
      },
    });
    setIsEditing(true);
  };

  const renderFieldPreview = (field: CustomField) => {
    const baseProps = {
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      required: field.required,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <Input
            type={field.type}
            {...baseProps}
            className="w-full"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            {...baseProps}
            min={field.validation?.min}
            max={field.validation?.max}
            className="w-full"
          />
        );

      case 'select':
        return (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            {...baseProps}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...baseProps}
            className="w-full"
            rows={3}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              className="rounded border-gray-300"
            />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        );

      default:
        return <Input {...baseProps} className="w-full" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Custom Fields</h2>
          <Badge variant="outline">{fields.length} fields</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {isEditing ? 'Edit Field' : 'Add New Field'}
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={editingField ? updateField : createField}>
                      {editingField ? 'Update' : 'Create'}
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
                  <Label htmlFor="field-name">Field Name</Label>
                  <Input
                    id="field-name"
                    value={fieldForm.name}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., priority_level"
                  />
                </div>
                <div>
                  <Label htmlFor="field-label">Display Label</Label>
                  <Input
                    id="field-label"
                    value={fieldForm.label}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Priority Level"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="field-type">Field Type</Label>
                <Select
                  value={fieldForm.type}
                  onValueChange={(value) => setFieldForm(prev => ({ ...prev, type: value as CustomField['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={fieldForm.required}
                  onCheckedChange={(checked) => setFieldForm(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="field-required">Required field</Label>
              </div>

              <div>
                <Label htmlFor="field-placeholder">Placeholder Text</Label>
                <Input
                  id="field-placeholder"
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm(prev => ({ ...prev, placeholder: e.target.value }))}
                  placeholder="Enter placeholder text"
                />
              </div>

              <div>
                <Label htmlFor="field-default">Default Value</Label>
                <Input
                  id="field-default"
                  value={fieldForm.defaultValue}
                  onChange={(e) => setFieldForm(prev => ({ ...prev, defaultValue: e.target.value }))}
                  placeholder="Enter default value"
                />
              </div>

              {fieldForm.type === 'select' && (
                <div>
                  <Label>Options (one per line)</Label>
                  <Textarea
                    value={fieldForm.options.join('\n')}
                    onChange={(e) => setFieldForm(prev => ({
                      ...prev,
                      options: e.target.value.split('\n').filter(option => option.trim())
                    }))}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={4}
                  />
                </div>
              )}

              {(fieldForm.type === 'text' || fieldForm.type === 'number') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field-min">Min Value</Label>
                    <Input
                      id="field-min"
                      type="number"
                      value={fieldForm.validation.min || ''}
                      onChange={(e) => setFieldForm(prev => ({
                        ...prev,
                        validation: { ...prev.validation, min: e.target.value ? Number(e.target.value) : undefined }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="field-max">Max Value</Label>
                    <Input
                      id="field-max"
                      type="number"
                      value={fieldForm.validation.max || ''}
                      onChange={(e) => setFieldForm(prev => ({
                        ...prev,
                        validation: { ...prev.validation, max: e.target.value ? Number(e.target.value) : undefined }
                      }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fields List */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        field.isActive ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                      <div>
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {field.name} • {field.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(field)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateField(field)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFieldActive(field.id)}
                      >
                        {field.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteField(field.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {fields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No custom fields yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Preview */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Field Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.filter(f => f.isActive).map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderFieldPreview(field)}
                    {field.validation?.message && (
                      <p className="text-sm text-muted-foreground">
                        {field.validation.message}
                      </p>
                    )}
                  </div>
                ))}
                {fields.filter(f => f.isActive).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active fields to preview
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

// Hook for managing custom fields
export function useCustomFields() {
  const [fields, setFields] = useState<CustomField[]>([]);

  useEffect(() => {
    const savedFields = localStorage.getItem('custom-ticket-fields');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    }
  }, []);

  const getActiveFields = () => fields.filter(f => f.isActive);

  const getFieldByName = (name: string) => fields.find(f => f.name === name);

  return {
    fields,
    setFields,
    getActiveFields,
    getFieldByName,
  };
} 
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Download, Upload, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/@/shadcn/ui/input';
import { Label } from '@/@/shadcn/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/@/shadcn/ui/dialog';
import { cn } from '@/lib/utils';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  warning: string;
  info: string;
}

interface CustomTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  isDark: boolean;
  createdAt: Date;
  isDefault?: boolean;
}

const defaultColors: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#f59e0b',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  border: '#e2e8f0',
  input: '#ffffff',
  ring: '#3b82f6',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const colorLabels: Record<keyof ThemeColors, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  background: 'Background',
  foreground: 'Foreground',
  muted: 'Muted',
  mutedForeground: 'Muted Foreground',
  border: 'Border',
  input: 'Input',
  ring: 'Ring',
  destructive: 'Destructive',
  destructiveForeground: 'Destructive Foreground',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
};

export function ThemeCreator() {
  const [themes, setThemes] = useState<CustomTheme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<CustomTheme | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = () => {
    const savedThemes = localStorage.getItem('custom-themes');
    if (savedThemes) {
      setThemes(JSON.parse(savedThemes));
    }
  };

  const saveThemes = (newThemes: CustomTheme[]) => {
    localStorage.setItem('custom-themes', JSON.stringify(newThemes));
    setThemes(newThemes);
  };

  const createNewTheme = () => {
    const newTheme: CustomTheme = {
      id: `theme-${Date.now()}`,
      name: themeName || 'New Theme',
      description: themeDescription || 'A custom theme',
      colors: { ...defaultColors },
      isDark: false,
      createdAt: new Date(),
    };
    
    setCurrentTheme(newTheme);
    setIsEditing(true);
    setThemeName('');
    setThemeDescription('');
  };

  const updateThemeColor = (colorKey: keyof ThemeColors, value: string) => {
    if (!currentTheme) return;
    
    setCurrentTheme(prev => prev ? {
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    } : null);
  };

  const saveTheme = () => {
    if (!currentTheme) return;
    
    const updatedThemes = themes.filter(t => t.id !== currentTheme.id);
    const newThemes = [...updatedThemes, currentTheme];
    saveThemes(newThemes);
    setIsEditing(false);
    setCurrentTheme(null);
  };

  const deleteTheme = (themeId: string) => {
    const updatedThemes = themes.filter(t => t.id !== themeId);
    saveThemes(updatedThemes);
  };

  const applyTheme = (theme: CustomTheme) => {
    // Apply theme to document
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Update theme class
    root.className = theme.isDark ? 'dark' : '';
    
    // Save to localStorage
    localStorage.setItem('current-theme', JSON.stringify(theme));
  };

  const exportTheme = (theme: CustomTheme) => {
    const themeData = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const theme: CustomTheme = JSON.parse(e.target?.result as string);
        theme.id = `theme-${Date.now()}`;
        theme.createdAt = new Date();
        
        const newThemes = [...themes, theme];
        saveThemes(newThemes);
      } catch (error) {
        console.error('Failed to import theme:', error);
      }
    };
    reader.readAsText(file);
  };

  const ColorPicker = ({ colorKey, value, onChange }: {
    colorKey: keyof ThemeColors;
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium min-w-24">
        {colorLabels[colorKey]}
      </Label>
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 p-1 border rounded"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 text-xs"
        placeholder="#000000"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Theme Creator</h2>
          <Badge variant="outline">{themes.length} themes</Badge>
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
          <input
            type="file"
            accept=".json"
            onChange={importTheme}
            className="hidden"
            id="import-theme"
          />
          <label htmlFor="import-theme">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Theme Editor
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={saveTheme}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme-name">Theme Name</Label>
                      <Input
                        id="theme-name"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        placeholder="Enter theme name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="theme-description">Description</Label>
                      <Input
                        id="theme-description"
                        value={themeDescription}
                        onChange={(e) => setThemeDescription(e.target.value)}
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                  <Button onClick={createNewTheme} className="w-full">
                    <Palette className="w-4 h-4 mr-2" />
                    Create New Theme
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(currentTheme?.colors || defaultColors).map(([key, value]) => (
                      <ColorPicker
                        key={key}
                        colorKey={key as keyof ThemeColors}
                        value={value}
                        onChange={(newValue) => updateThemeColor(key as keyof ThemeColors, newValue)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Themes */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div>
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {theme.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyTheme(theme)}
                      >
                        Apply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportTheme(theme)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTheme(theme.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {themes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No saved themes yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theme Preview */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Theme Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="space-y-4 p-4 rounded-lg border"
                style={{
                  backgroundColor: currentTheme?.colors.background || defaultColors.background,
                  color: currentTheme?.colors.foreground || defaultColors.foreground,
                }}
              >
                <div className="flex items-center gap-2">
                  <Button
                    style={{
                      backgroundColor: currentTheme?.colors.primary || defaultColors.primary,
                      color: '#ffffff',
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      borderColor: currentTheme?.colors.border || defaultColors.border,
                      color: currentTheme?.colors.foreground || defaultColors.foreground,
                    }}
                  >
                    Secondary Button
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Input field"
                    style={{
                      backgroundColor: currentTheme?.colors.input || defaultColors.input,
                      borderColor: currentTheme?.colors.border || defaultColors.border,
                      color: currentTheme?.colors.foreground || defaultColors.foreground,
                    }}
                  />
                  
                  <div className="flex items-center gap-2">
                    <Badge
                      style={{
                        backgroundColor: currentTheme?.colors.success || defaultColors.success,
                        color: '#ffffff',
                      }}
                    >
                      Success
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: currentTheme?.colors.warning || defaultColors.warning,
                        color: '#ffffff',
                      }}
                    >
                      Warning
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: currentTheme?.colors.destructive || defaultColors.destructive,
                        color: '#ffffff',
                      }}
                    >
                      Error
                    </Badge>
                  </div>
                </div>
                
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: currentTheme?.colors.muted || defaultColors.muted,
                    color: currentTheme?.colors.mutedForeground || defaultColors.mutedForeground,
                  }}
                >
                  <div className="text-sm">Muted content area</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Hook for theme management
export function useThemeManager() {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('current-theme');
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
    }
  }, []);

  const applyTheme = (theme: CustomTheme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    root.className = theme.isDark ? 'dark' : '';
    localStorage.setItem('current-theme', JSON.stringify(theme));
    setCurrentTheme(theme);
  };

  return {
    currentTheme,
    applyTheme,
  };
} 
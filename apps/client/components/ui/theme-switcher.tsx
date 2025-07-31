'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Sun, Moon, Eye, EyeOff, Zap, ZapOff } from 'lucide-react';
import { useAccessibility } from './accessibility';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  className: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Default dark theme',
    icon: <Moon className="h-4 w-4" />,
    className: 'dark'
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Light theme for daytime use',
    icon: <Sun className="h-4 w-4" />,
    className: 'light'
  },
  {
    id: 'high-contrast-light',
    name: 'High Contrast Light',
    description: 'High contrast light theme for accessibility',
    icon: <Eye className="h-4 w-4" />,
    className: 'high-contrast-light'
  },
  {
    id: 'high-contrast-dark',
    name: 'High Contrast Dark',
    description: 'High contrast dark theme for accessibility',
    icon: <EyeOff className="h-4 w-4" />,
    className: 'high-contrast-dark'
  },
  {
    id: 'auto',
    name: 'Auto',
    description: 'Follows system preference',
    icon: <Monitor className="h-4 w-4" />,
    className: 'auto'
  }
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const { isHighContrast, prefersReducedMotion, addAnnouncement } = useAccessibility();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('dark', 'light', 'high-contrast-light', 'high-contrast-dark');
    
    if (theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      html.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
    setCurrentTheme(theme);
    
    // Announce theme change
    const themeOption = themeOptions.find(t => t.id === theme);
    if (themeOption) {
      addAnnouncement(`Theme changed to ${themeOption.name}`);
    }
  };

  const handleThemeChange = (theme: string) => {
    applyTheme(theme);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Theme</h3>
        <div className="grid grid-cols-1 gap-2">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                currentTheme === theme.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background hover:bg-accent'
              }`}
              aria-pressed={currentTheme === theme.id}
              aria-describedby={`${theme.id}-description`}
            >
              <div className="flex items-center space-x-3">
                {theme.icon}
                <div className="text-left">
                  <div className="font-medium">{theme.name}</div>
                  <div id={`${theme.id}-description`} className="text-sm text-muted-foreground">
                    {theme.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Options */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-foreground">Accessibility</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">High Contrast</div>
              <div className="text-sm text-muted-foreground">
                Enhanced contrast for better visibility
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isHighContrast ? (
                <Eye className="h-4 w-4 text-primary" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Reduced Motion</div>
              <div className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {prefersReducedMotion ? (
                <ZapOff className="h-4 w-4 text-primary" />
              ) : (
                <Zap className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          These settings follow your system preferences and can be changed in your operating system settings.
        </div>
      </div>
    </div>
  );
} 
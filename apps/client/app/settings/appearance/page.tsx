'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Palette, Monitor, Type, Layout, Eye, Moon, Sun, Smartphone, Check } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ThemeOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  preview: string
}

interface ColorScheme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  preview: string
}

interface LayoutOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const themeOptions: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Elegant dark theme with high contrast',
    icon: <Moon className="h-5 w-5" />,
    preview: 'bg-black text-white'
  },
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean light theme for daytime use',
    icon: <Sun className="h-5 w-5" />,
    preview: 'bg-white text-black'
  },
  {
    id: 'auto',
    name: 'Auto (System)',
    description: 'Follows your system preference',
    icon: <Monitor className="h-5 w-5" />,
    preview: 'bg-gray-100 text-gray-900'
  }
]

const colorSchemes: ColorScheme[] = [
  {
    id: 'default',
    name: 'Default',
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#8b5cf6',
    preview: 'bg-black'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#1e40af',
    secondary: '#ffffff',
    accent: '#3b82f6',
    preview: 'bg-blue-800'
  },
  {
    id: 'green',
    name: 'Forest Green',
    primary: '#166534',
    secondary: '#ffffff',
    accent: '#22c55e',
    preview: 'bg-green-800'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#7c3aed',
    secondary: '#ffffff',
    accent: '#a855f7',
    preview: 'bg-purple-800'
  },
  {
    id: 'red',
    name: 'Crimson Red',
    primary: '#dc2626',
    secondary: '#ffffff',
    accent: '#ef4444',
    preview: 'bg-red-800'
  }
]

const layoutOptions: LayoutOption[] = [
  {
    id: 'comfortable',
    name: 'Comfortable',
    description: 'More spacing for better readability',
    icon: <Monitor className="h-5 w-5" />
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Tighter spacing for more content',
    icon: <Smartphone className="h-5 w-5" />
  }
]

export default function AppearanceSettings() {
  const [selectedTheme, setSelectedTheme] = useState('dark')
  const [selectedColorScheme, setSelectedColorScheme] = useState('default')
  const [selectedLayout, setSelectedLayout] = useState('comfortable')
  const [fontSize, setFontSize] = useState('medium')
  const [fontFamily, setFontFamily] = useState('inter')
  const [sidebarWidth, setSidebarWidth] = useState('default')
  const [animations, setAnimations] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Appearance Settings</h1>
              <p className="text-gray-400">Customize the look and feel of your workspace</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {themeOptions.map((theme) => (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTheme === theme.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {theme.icon}
                        <div>
                          <p className="text-white font-medium">{theme.name}</p>
                          <p className="text-gray-400 text-sm">{theme.description}</p>
                        </div>
                      </div>
                      {selectedTheme === theme.id && (
                        <Check className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <div className={`mt-3 h-8 rounded ${theme.preview}`}></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Color Scheme</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {colorSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedColorScheme === scheme.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedColorScheme(scheme.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{scheme.name}</span>
                      {selectedColorScheme === scheme.id && (
                        <Check className="h-4 w-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: scheme.primary }}
                      ></div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: scheme.secondary }}
                      ></div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: scheme.accent }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Layout Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Layout className="h-5 w-5" />
                <span>Layout</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {layoutOptions.map((layout) => (
                  <div
                    key={layout.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLayout === layout.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedLayout(layout.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {layout.icon}
                        <div>
                          <p className="text-white font-medium">{layout.name}</p>
                          <p className="text-gray-400 text-sm">{layout.description}</p>
                        </div>
                      </div>
                      {selectedLayout === layout.id && (
                        <Check className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Width */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Sidebar Width</label>
                <select
                  value={sidebarWidth}
                  onChange={(e) => setSidebarWidth(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="compact">Compact (200px)</option>
                  <option value="default">Default (250px)</option>
                  <option value="wide">Wide (300px)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Type className="h-5 w-5" />
                <span>Typography</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Font Size</label>
                <div className="flex space-x-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFontSize(size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="inter">Inter (Default)</option>
                  <option value="roboto">Roboto</option>
                  <option value="open-sans">Open Sans</option>
                  <option value="system">System Font</option>
                </select>
              </div>

              {/* Preview */}
              <div className="p-3 bg-gray-800 rounded">
                <p className="text-white text-sm">Preview Text</p>
                <p className="text-gray-400 text-xs mt-1">
                  This is how your text will appear with the selected settings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Animations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Animations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Enable Animations</p>
                    <p className="text-gray-400 text-sm">
                      Smooth transitions and hover effects
                    </p>
                  </div>
                  <Button
                    variant={animations ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnimations(!animations)}
                  >
                    {animations ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="p-3 bg-gray-800 rounded">
                  <p className="text-white text-sm">Animation Preview</p>
                  <div className="mt-2 flex space-x-2">
                    <div className="w-4 h-4 bg-purple-500 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded animate-bounce"></div>
                    <div className="w-4 h-4 bg-green-500 rounded animate-spin"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset to Defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Reset to Defaults</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Reset all appearance settings to their default values.
              </p>
              <Button variant="outline" className="w-full">
                Reset All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 
'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw, Sun, Moon, Monitor, Building2, User, Ruler, Clock, Brain, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db, DEFAULT_SETTINGS, initializeSettings } from '@/lib/db';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import type { AppSettings } from '@/types/traq';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    async function loadSettings() {
      const s = await initializeSettings();
      setSettings(s);
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const updateNestedSetting = (path: string, value: unknown) => {
    if (!settings) return;
    const updated = { ...settings };
    const parts = path.split('.');
    let current: Record<string, unknown> = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = { ...(current[parts[i]] as Record<string, unknown>) };
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;

    setSettings(updated as AppSettings);
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await db.settings.put(settings);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset all settings to defaults?')) {
      await db.settings.put(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const handleClearMemory = async () => {
    if (confirm('Clear all remembered field values?')) {
      await db.memory.clear();
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    if (settings) {
      const updated = { ...settings, theme: newTheme };
      setSettings(updated);
      await setTheme(newTheme);
      await db.settings.put(updated);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div className="mb-4 p-3 bg-accent/20 text-accent-foreground rounded-md text-sm">
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              Appearance
            </CardTitle>
            <CardDescription>
              Choose your preferred theme. VGK Home colors for dark, Away colors for light.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  theme === 'light'
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-border flex items-center justify-center">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-sm font-medium">Light</span>
                <span className="text-xs text-muted-foreground">Away</span>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  theme === 'dark'
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-[#1a1d21] border-2 border-accent flex items-center justify-center">
                  <Moon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Dark</span>
                <span className="text-xs text-muted-foreground">Home</span>
              </button>

              <button
                onClick={() => handleThemeChange('system')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  theme === 'system'
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#1a1d21] border-2 border-border flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium">System</span>
                <span className="text-xs text-muted-foreground">Auto</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Company Info for Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent" />
              Company Information
            </CardTitle>
            <CardDescription>
              This information will appear on exported PDF reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName || ''}
                onChange={(e) => updateSetting('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                value={settings.companyAddress || ''}
                onChange={(e) => updateSetting('companyAddress', e.target.value)}
                placeholder="123 Main St, City, State 12345"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  value={settings.companyPhone || ''}
                  onChange={(e) => updateSetting('companyPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={settings.companyEmail || ''}
                  onChange={(e) => updateSetting('companyEmail', e.target.value)}
                  placeholder="info@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyLicense">License/Certification #</Label>
              <Input
                id="companyLicense"
                value={settings.companyLicense || ''}
                onChange={(e) => updateSetting('companyLicense', e.target.value)}
                placeholder="ISA Certified Arborist #XX-1234A"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assessor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              Assessor Information
            </CardTitle>
            <CardDescription>
              Pre-fill your name on new assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assessorName">Default Assessor Name</Label>
              <Input
                id="assessorName"
                value={settings.assessorName}
                onChange={(e) => updateSetting('assessorName', e.target.value)}
                placeholder="Your name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Default Units */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-accent" />
              Default Units
            </CardTitle>
            <CardDescription>
              Set your preferred measurement units
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diameterUnit">Diameter</Label>
                <Select
                  value={settings.defaultUnits.diameter}
                  onValueChange={(value) =>
                    updateNestedSetting('defaultUnits.diameter', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Inches (in)</SelectItem>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heightUnit">Height</Label>
                <Select
                  value={settings.defaultUnits.height}
                  onValueChange={(value) =>
                    updateNestedSetting('defaultUnits.height', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ft">Feet (ft)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distanceUnit">Distance</Label>
                <Select
                  value={settings.defaultUnits.distance}
                  onValueChange={(value) =>
                    updateNestedSetting('defaultUnits.distance', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ft">Feet (ft)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Time Frame */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Assessment Defaults
            </CardTitle>
            <CardDescription>
              Default values for new assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultTimeFrame">Default Time Frame</Label>
              <Input
                id="defaultTimeFrame"
                value={settings.defaultTimeFrame}
                onChange={(e) => updateSetting('defaultTimeFrame', e.target.value)}
                placeholder="e.g., 1 year"
              />
            </div>
          </CardContent>
        </Card>

        {/* Field Memory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              Field Memory
            </CardTitle>
            <CardDescription>
              Remember field values for future assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Field Memory</Label>
                <p className="text-sm text-muted-foreground">
                  Show memory toggle buttons on form fields
                </p>
              </div>
              <Switch
                checked={settings.enableMemory}
                onCheckedChange={(checked) => updateSetting('enableMemory', checked)}
              />
            </div>

            <Button variant="outline" onClick={handleClearMemory} className="w-full">
              Clear All Remembered Values
            </Button>
          </CardContent>
        </Card>

        {/* Auto Save */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-accent" />
              Auto Save
            </CardTitle>
            <CardDescription>
              Automatically save assessments while editing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="autoSaveInterval">Auto Save Interval (seconds)</Label>
              <Input
                id="autoSaveInterval"
                type="number"
                min={10}
                max={300}
                value={settings.autoSaveInterval / 1000}
                onChange={(e) =>
                  updateSetting('autoSaveInterval', parseInt(e.target.value) * 1000 || 30000)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db, DEFAULT_SETTINGS, initializeSettings } from '@/lib/db';
import type { AppSettings } from '@/types/traq';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  if (isLoading || !settings) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Assessor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Assessor Information</CardTitle>
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
            <CardTitle>Default Units</CardTitle>
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
            <CardTitle>Assessment Defaults</CardTitle>
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
            <CardTitle>Field Memory</CardTitle>
            <CardDescription>
              Remember field values for future assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Field Memory</Label>
                <p className="text-sm text-gray-500">
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
            <CardTitle>Auto Save</CardTitle>
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

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the app appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  updateSetting('theme', value as 'light' | 'dark' | 'system')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

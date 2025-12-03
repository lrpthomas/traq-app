'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, CheckboxField } from '@/components/form/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Assessment, OccupancyRate } from '@/types/traq';
import { LABELS } from '@/lib/riskMatrix';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
  addTarget: () => void;
  removeTarget: (id: string) => void;
}

export function TargetSection({ assessment, updateField, addTarget, removeTarget }: Props) {
  if (!assessment) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const targets = Array.isArray(assessment.targets) ? assessment.targets : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Identify up to 4 targets that could be affected by tree failure.
        </p>
        {targets.length < 4 && (
          <Button variant="outline" size="sm" onClick={addTarget}>
            <Plus className="h-4 w-4 mr-1" />
            Add Target
          </Button>
        )}
      </div>

      {targets.map((target, index) => (
        <Card key={target.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Target {target.targetNumber}</CardTitle>
              {targets.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTarget(target.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              fieldPath={`targets.${index}.targetDescription`}
              label="Target Description"
            >
              <Input
                id={`targets.${index}.targetDescription`}
                value={target.targetDescription}
                onChange={(e) =>
                  updateField(`targets.${index}.targetDescription`, e.target.value)
                }
                placeholder="e.g., Sidewalk, building, playground"
              />
            </FormField>

            <FormField
              fieldPath={`targets.${index}.targetProtection`}
              label="Target Protection"
            >
              <Input
                id={`targets.${index}.targetProtection`}
                value={target.targetProtection}
                onChange={(e) =>
                  updateField(`targets.${index}.targetProtection`, e.target.value)
                }
                placeholder="e.g., Fence, warning sign"
              />
            </FormField>

            {/* Target Zone */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Target Zone</p>
              <div className="flex flex-wrap gap-4">
                <CheckboxField
                  fieldPath={`targets.${index}.targetZone.withinDripLine`}
                  label="Within Drip Line"
                  checked={target.targetZone.withinDripLine}
                  onChange={(checked) =>
                    updateField(`targets.${index}.targetZone.withinDripLine`, checked)
                  }
                />
                <CheckboxField
                  fieldPath={`targets.${index}.targetZone.within1xHt`}
                  label="Within 1× Height"
                  checked={target.targetZone.within1xHt}
                  onChange={(checked) =>
                    updateField(`targets.${index}.targetZone.within1xHt`, checked)
                  }
                />
                <CheckboxField
                  fieldPath={`targets.${index}.targetZone.within1_5xHt`}
                  label="Within 1.5× Height"
                  checked={target.targetZone.within1_5xHt}
                  onChange={(checked) =>
                    updateField(`targets.${index}.targetZone.within1_5xHt`, checked)
                  }
                />
              </div>
            </div>

            {/* Occupancy Rate */}
            <FormField
              fieldPath={`targets.${index}.occupancyRate`}
              label="Occupancy Rate"
            >
              <Select
                value={target.occupancyRate?.toString() || ''}
                onValueChange={(value) =>
                  updateField(`targets.${index}.occupancyRate`, value ? parseInt(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select occupancy rate" />
                </SelectTrigger>
                <SelectContent>
                  {([1, 2, 3, 4] as OccupancyRate[]).map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {LABELS.occupancyRate[rate]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Practical Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                fieldPath={`targets.${index}.practicalToMoveTarget`}
                label="Practical to Move Target?"
              >
                <Select
                  value={target.practicalToMoveTarget === null ? '' : target.practicalToMoveTarget ? 'yes' : 'no'}
                  onValueChange={(value) =>
                    updateField(`targets.${index}.practicalToMoveTarget`, value === '' ? null : value === 'yes')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                fieldPath={`targets.${index}.restrictionPractical`}
                label="Restriction Practical?"
              >
                <Select
                  value={target.restrictionPractical === null ? '' : target.restrictionPractical ? 'yes' : 'no'}
                  onValueChange={(value) =>
                    updateField(`targets.${index}.restrictionPractical`, value === '' ? null : value === 'yes')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

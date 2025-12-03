'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, CheckboxField } from '@/components/form/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Assessment } from '@/types/traq';
import { LABELS } from '@/lib/riskMatrix';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
}

export function TreeHealthSection({ assessment, updateField }: Props) {
  if (!assessment?.treeHealth) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const { treeHealth } = assessment;

  return (
    <div className="space-y-6">
      {/* Vigor */}
      <FormField required fieldPath="treeHealth.vigor" label="Vigor">
        <Select
          value={treeHealth.vigor || ''}
          onValueChange={(value) =>
            updateField('treeHealth.vigor', value || null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vigor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{LABELS.vigor.low}</SelectItem>
            <SelectItem value="normal">{LABELS.vigor.normal}</SelectItem>
            <SelectItem value="high">{LABELS.vigor.high}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* Foliage */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Foliage</h3>
        <div className="flex flex-wrap gap-4">
          <CheckboxField
            fieldPath="treeHealth.foliage.noneSeasonal"
            label="None (Seasonal)"
            checked={treeHealth.foliage.noneSeasonal}
            onChange={(checked) => updateField('treeHealth.foliage.noneSeasonal', checked)}
          />
          <CheckboxField
            fieldPath="treeHealth.foliage.noneDead"
            label="None (Dead)"
            checked={treeHealth.foliage.noneDead}
            onChange={(checked) => updateField('treeHealth.foliage.noneDead', checked)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField required fieldPath="treeHealth.foliage.normalPercent" label="Normal %">
            <Input
              id="treeHealth.foliage.normalPercent"
              type="number"
              min={0}
              max={100}
              value={treeHealth.foliage.normalPercent || ''}
              onChange={(e) =>
                updateField(
                  'treeHealth.foliage.normalPercent',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="%"
            />
          </FormField>
          <FormField required fieldPath="treeHealth.foliage.chloroticPercent" label="Chlorotic %">
            <Input
              id="treeHealth.foliage.chloroticPercent"
              type="number"
              min={0}
              max={100}
              value={treeHealth.foliage.chloroticPercent || ''}
              onChange={(e) =>
                updateField(
                  'treeHealth.foliage.chloroticPercent',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="%"
            />
          </FormField>
          <FormField required fieldPath="treeHealth.foliage.necroticPercent" label="Necrotic %">
            <Input
              id="treeHealth.foliage.necroticPercent"
              type="number"
              min={0}
              max={100}
              value={treeHealth.foliage.necroticPercent || ''}
              onChange={(e) =>
                updateField(
                  'treeHealth.foliage.necroticPercent',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="%"
            />
          </FormField>
        </div>
      </div>

      {/* Pests/Biotic */}
      <FormField required fieldPath="treeHealth.pestsBiotic" label="Pests/Biotic">
        <Textarea
          id="treeHealth.pestsBiotic"
          value={treeHealth.pestsBiotic}
          onChange={(e) => updateField('treeHealth.pestsBiotic', e.target.value)}
          placeholder="Describe any pests, diseases, or biotic factors"
          rows={2}
        />
      </FormField>

      {/* Abiotic */}
      <FormField required fieldPath="treeHealth.abiotic" label="Abiotic">
        <Textarea
          id="treeHealth.abiotic"
          value={treeHealth.abiotic}
          onChange={(e) => updateField('treeHealth.abiotic', e.target.value)}
          placeholder="Describe any abiotic factors (drought stress, chemical damage, etc.)"
          rows={2}
        />
      </FormField>

      {/* Species Failure Profile */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Species Failure Profile</h3>
        <p className="text-xs text-gray-500">
          Does this species have a known failure pattern?
        </p>
        <div className="flex flex-wrap gap-4">
          <CheckboxField
            fieldPath="treeHealth.speciesFailureProfile.branches"
            label="Branches"
            checked={treeHealth.speciesFailureProfile.branches}
            onChange={(checked) =>
              updateField('treeHealth.speciesFailureProfile.branches', checked)
            }
          />
          <CheckboxField
            fieldPath="treeHealth.speciesFailureProfile.trunk"
            label="Trunk"
            checked={treeHealth.speciesFailureProfile.trunk}
            onChange={(checked) =>
              updateField('treeHealth.speciesFailureProfile.trunk', checked)
            }
          />
          <CheckboxField
            fieldPath="treeHealth.speciesFailureProfile.roots"
            label="Roots"
            checked={treeHealth.speciesFailureProfile.roots}
            onChange={(checked) =>
              updateField('treeHealth.speciesFailureProfile.roots', checked)
            }
          />
        </div>
        <FormField
          fieldPath="treeHealth.speciesFailureProfile.describe"
          label="Describe"
        >
          <Input
            id="treeHealth.speciesFailureProfile.describe"
            value={treeHealth.speciesFailureProfile.describe}
            onChange={(e) =>
              updateField('treeHealth.speciesFailureProfile.describe', e.target.value)
            }
            placeholder="Additional details"
          />
        </FormField>
      </div>
    </div>
  );
}

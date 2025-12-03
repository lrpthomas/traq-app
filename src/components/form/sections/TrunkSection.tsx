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
import type { Assessment, LoadOnDefect, LikelihoodOfFailure } from '@/types/traq';
import { LABELS } from '@/lib/riskMatrix';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
}

export function TrunkSection({ assessment, updateField }: Props) {
  if (!assessment?.trunk) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const { trunk } = assessment;

  return (
    <div className="space-y-6">
      {/* Trunk Conditions */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Trunk Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            fieldPath="trunk.deadMissingBark"
            label="Dead/Missing Bark"
            checked={trunk.deadMissingBark}
            onChange={(checked) => updateField('trunk.deadMissingBark', checked)}
          />
          <CheckboxField
            fieldPath="trunk.abnormalBarkTextureColor"
            label="Abnormal Bark Texture/Color"
            checked={trunk.abnormalBarkTextureColor}
            onChange={(checked) => updateField('trunk.abnormalBarkTextureColor', checked)}
          />
          <CheckboxField
            fieldPath="trunk.codominantStems"
            label="Codominant Stems"
            checked={trunk.codominantStems}
            onChange={(checked) => updateField('trunk.codominantStems', checked)}
          />
          <CheckboxField
            fieldPath="trunk.includedBark"
            label="Included Bark"
            checked={trunk.includedBark}
            onChange={(checked) => updateField('trunk.includedBark', checked)}
          />
          <CheckboxField
            fieldPath="trunk.cracks"
            label="Cracks"
            checked={trunk.cracks}
            onChange={(checked) => updateField('trunk.cracks', checked)}
          />
          <CheckboxField
            fieldPath="trunk.sapwoodDamageDecay"
            label="Sapwood Damage/Decay"
            checked={trunk.sapwoodDamageDecay}
            onChange={(checked) => updateField('trunk.sapwoodDamageDecay', checked)}
          />
          <CheckboxField
            fieldPath="trunk.cankersGallsBurls"
            label="Cankers/Galls/Burls"
            checked={trunk.cankersGallsBurls}
            onChange={(checked) => updateField('trunk.cankersGallsBurls', checked)}
          />
          <CheckboxField
            fieldPath="trunk.sapOoze"
            label="Sap/Ooze"
            checked={trunk.sapOoze}
            onChange={(checked) => updateField('trunk.sapOoze', checked)}
          />
          <CheckboxField
            fieldPath="trunk.lightningDamage"
            label="Lightning Damage"
            checked={trunk.lightningDamage}
            onChange={(checked) => updateField('trunk.lightningDamage', checked)}
          />
          <CheckboxField
            fieldPath="trunk.heartwoodDecay"
            label="Heartwood Decay"
            checked={trunk.heartwoodDecay}
            onChange={(checked) => updateField('trunk.heartwoodDecay', checked)}
          />
          <CheckboxField
            fieldPath="trunk.conksMushrooms"
            label="Conks/Mushrooms"
            checked={trunk.conksMushrooms}
            onChange={(checked) => updateField('trunk.conksMushrooms', checked)}
          />
          <CheckboxField
            fieldPath="trunk.poorTaper"
            label="Poor Taper"
            checked={trunk.poorTaper}
            onChange={(checked) => updateField('trunk.poorTaper', checked)}
          />
        </div>
      </div>

      {/* Cavity/Nest Hole */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="trunk.cavityNestHole.present"
          label="Cavity/Nest Hole"
          checked={trunk.cavityNestHole.present}
          onChange={(checked) => updateField('trunk.cavityNestHole.present', checked)}
        />
        {trunk.cavityNestHole.present && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              fieldPath="trunk.cavityNestHole.percentCirc"
              label="% Circumference"
            >
              <Input
                id="trunk.cavityNestHole.percentCirc"
                type="number"
                min={0}
                max={100}
                value={trunk.cavityNestHole.percentCirc || ''}
                onChange={(e) =>
                  updateField(
                    'trunk.cavityNestHole.percentCirc',
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="%"
              />
            </FormField>
            <FormField fieldPath="trunk.cavityNestHole.depth" label="Depth">
              <Input
                id="trunk.cavityNestHole.depth"
                value={trunk.cavityNestHole.depth}
                onChange={(e) => updateField('trunk.cavityNestHole.depth', e.target.value)}
                placeholder="e.g., 6 in"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Lean */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="trunk.lean.present"
          label="Lean"
          checked={trunk.lean.present}
          onChange={(checked) => updateField('trunk.lean.present', checked)}
        />
        {trunk.lean.present && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField fieldPath="trunk.lean.degrees" label="Degrees">
              <Input
                id="trunk.lean.degrees"
                type="number"
                min={0}
                max={90}
                value={trunk.lean.degrees || ''}
                onChange={(e) =>
                  updateField(
                    'trunk.lean.degrees',
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="degrees"
              />
            </FormField>
            <FormField fieldPath="trunk.lean.corrected" label="Corrected/Natural">
              <Input
                id="trunk.lean.corrected"
                value={trunk.lean.corrected}
                onChange={(e) => updateField('trunk.lean.corrected', e.target.value)}
                placeholder="e.g., Natural, Corrected"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Response Growth & Conditions of Concern */}
      <FormField fieldPath="trunk.responseGrowth" label="Response Growth">
        <Textarea
          id="trunk.responseGrowth"
          value={trunk.responseGrowth}
          onChange={(e) => updateField('trunk.responseGrowth', e.target.value)}
          placeholder="Describe response growth"
          rows={2}
        />
      </FormField>

      <FormField fieldPath="trunk.conditionsOfConcern" label="Conditions of Concern">
        <Textarea
          id="trunk.conditionsOfConcern"
          value={trunk.conditionsOfConcern}
          onChange={(e) => updateField('trunk.conditionsOfConcern', e.target.value)}
          placeholder="Summarize conditions of concern for trunk"
          rows={2}
        />
      </FormField>

      {/* Failure Assessment */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium">Trunk Failure Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField fieldPath="trunk.partSize" label="Part Size">
            <Input
              id="trunk.partSize"
              value={trunk.partSize}
              onChange={(e) => updateField('trunk.partSize', e.target.value)}
              placeholder="e.g., 24 in DBH"
            />
          </FormField>
          <FormField fieldPath="trunk.fallDistance" label="Fall Distance">
            <Input
              id="trunk.fallDistance"
              value={trunk.fallDistance}
              onChange={(e) => updateField('trunk.fallDistance', e.target.value)}
              placeholder="e.g., 50 ft"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField fieldPath="trunk.loadOnDefect" label="Load on Defect">
            <Select
              value={trunk.loadOnDefect || ''}
              onValueChange={(value) =>
                updateField('trunk.loadOnDefect', value || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {(['n/a', 'minor', 'moderate', 'significant'] as LoadOnDefect[]).map(
                  (load) => (
                    <SelectItem key={load} value={load}>
                      {LABELS.loadOnDefect[load]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </FormField>
          <FormField fieldPath="trunk.likelihoodOfFailure" label="Likelihood of Failure">
            <Select
              value={trunk.likelihoodOfFailure || ''}
              onValueChange={(value) =>
                updateField('trunk.likelihoodOfFailure', value || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {(
                  ['improbable', 'possible', 'probable', 'imminent'] as LikelihoodOfFailure[]
                ).map((lof) => (
                  <SelectItem key={lof} value={lof}>
                    {LABELS.likelihoodOfFailure[lof]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </div>
    </div>
  );
}

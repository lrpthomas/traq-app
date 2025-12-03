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

export function RootsSection({ assessment, updateField }: Props) {
  if (!assessment?.rootsAndRootCollar) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const { rootsAndRootCollar } = assessment;

  return (
    <div className="space-y-6">
      {/* Root Collar */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Root Collar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            fieldPath="rootsAndRootCollar.collarBuriedNotVisible"
            label="Collar Buried/Not Visible"
            checked={rootsAndRootCollar.collarBuriedNotVisible}
            onChange={(checked) =>
              updateField('rootsAndRootCollar.collarBuriedNotVisible', checked)
            }
          />
          <FormField required fieldPath="rootsAndRootCollar.depth" label="Depth Buried">
            <Input
              id="rootsAndRootCollar.depth"
              value={rootsAndRootCollar.depth}
              onChange={(e) => updateField('rootsAndRootCollar.depth', e.target.value)}
              placeholder="e.g., 4 in"
            />
          </FormField>
        </div>
      </div>

      {/* Root Conditions */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Root Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            fieldPath="rootsAndRootCollar.stemGirdling"
            label="Stem Girdling Roots"
            checked={rootsAndRootCollar.stemGirdling}
            onChange={(checked) => updateField('rootsAndRootCollar.stemGirdling', checked)}
          />
          <CheckboxField
            fieldPath="rootsAndRootCollar.dead"
            label="Dead Roots"
            checked={rootsAndRootCollar.dead}
            onChange={(checked) => updateField('rootsAndRootCollar.dead', checked)}
          />
          <CheckboxField
            fieldPath="rootsAndRootCollar.decay"
            label="Decay"
            checked={rootsAndRootCollar.decay}
            onChange={(checked) => updateField('rootsAndRootCollar.decay', checked)}
          />
          <CheckboxField
            fieldPath="rootsAndRootCollar.conksMushrooms"
            label="Conks/Mushrooms"
            checked={rootsAndRootCollar.conksMushrooms}
            onChange={(checked) => updateField('rootsAndRootCollar.conksMushrooms', checked)}
          />
          <CheckboxField
            fieldPath="rootsAndRootCollar.ooze"
            label="Ooze"
            checked={rootsAndRootCollar.ooze}
            onChange={(checked) => updateField('rootsAndRootCollar.ooze', checked)}
          />
          <CheckboxField
            fieldPath="rootsAndRootCollar.cracks"
            label="Cracks"
            checked={rootsAndRootCollar.cracks}
            onChange={(checked) => updateField('rootsAndRootCollar.cracks', checked)}
          />
          <CheckboxField
            fieldPath="rootsAndRootCollar.rootPlateLifting"
            label="Root Plate Lifting"
            checked={rootsAndRootCollar.rootPlateLifting}
            onChange={(checked) => updateField('rootsAndRootCollar.rootPlateLifting', checked)}
          />
          <CheckboxField
            fieldPath="rootsAndRootCollar.soilWeakness"
            label="Soil Weakness"
            checked={rootsAndRootCollar.soilWeakness}
            onChange={(checked) => updateField('rootsAndRootCollar.soilWeakness', checked)}
          />
        </div>
      </div>

      {/* Cavity */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="rootsAndRootCollar.cavity.present"
          label="Cavity"
          checked={rootsAndRootCollar.cavity.present}
          onChange={(checked) => updateField('rootsAndRootCollar.cavity.present', checked)}
        />
        {rootsAndRootCollar.cavity.present && (
          <FormField
            fieldPath="rootsAndRootCollar.cavity.percentCirc"
            label="% Circumference"
          >
            <Input
              id="rootsAndRootCollar.cavity.percentCirc"
              type="number"
              min={0}
              max={100}
              value={rootsAndRootCollar.cavity.percentCirc || ''}
              onChange={(e) =>
                updateField(
                  'rootsAndRootCollar.cavity.percentCirc',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="%"
            />
          </FormField>
        )}
      </div>

      {/* Cut/Damaged Roots */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="rootsAndRootCollar.cutDamagedRoots.present"
          label="Cut/Damaged Roots"
          checked={rootsAndRootCollar.cutDamagedRoots.present}
          onChange={(checked) =>
            updateField('rootsAndRootCollar.cutDamagedRoots.present', checked)
          }
        />
        {rootsAndRootCollar.cutDamagedRoots.present && (
          <FormField
            fieldPath="rootsAndRootCollar.cutDamagedRoots.distanceFromTrunk"
            label="Distance from Trunk"
          >
            <Input
              id="rootsAndRootCollar.cutDamagedRoots.distanceFromTrunk"
              value={rootsAndRootCollar.cutDamagedRoots.distanceFromTrunk}
              onChange={(e) =>
                updateField(
                  'rootsAndRootCollar.cutDamagedRoots.distanceFromTrunk',
                  e.target.value
                )
              }
              placeholder="e.g., 4 ft"
            />
          </FormField>
        )}
      </div>

      {/* Response Growth & Conditions of Concern */}
      <FormField required fieldPath="rootsAndRootCollar.responseGrowth" label="Response Growth">
        <Textarea
          id="rootsAndRootCollar.responseGrowth"
          value={rootsAndRootCollar.responseGrowth}
          onChange={(e) => updateField('rootsAndRootCollar.responseGrowth', e.target.value)}
          placeholder="Describe response growth"
          rows={2}
        />
      </FormField>

      <FormField
        fieldPath="rootsAndRootCollar.conditionsOfConcern"
        label="Conditions of Concern"
      >
        <Textarea
          id="rootsAndRootCollar.conditionsOfConcern"
          value={rootsAndRootCollar.conditionsOfConcern}
          onChange={(e) =>
            updateField('rootsAndRootCollar.conditionsOfConcern', e.target.value)
          }
          placeholder="Summarize conditions of concern for roots"
          rows={2}
        />
      </FormField>

      {/* Failure Assessment */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium">Roots Failure Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField required fieldPath="rootsAndRootCollar.partSize" label="Part Size">
            <Input
              id="rootsAndRootCollar.partSize"
              value={rootsAndRootCollar.partSize}
              onChange={(e) => updateField('rootsAndRootCollar.partSize', e.target.value)}
              placeholder="e.g., Whole tree"
            />
          </FormField>
          <FormField required fieldPath="rootsAndRootCollar.fallDistance" label="Fall Distance">
            <Input
              id="rootsAndRootCollar.fallDistance"
              value={rootsAndRootCollar.fallDistance}
              onChange={(e) =>
                updateField('rootsAndRootCollar.fallDistance', e.target.value)
              }
              placeholder="e.g., 50 ft"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField required fieldPath="rootsAndRootCollar.loadOnDefect" label="Load on Defect">
            <Select
              value={rootsAndRootCollar.loadOnDefect || ''}
              onValueChange={(value) =>
                updateField('rootsAndRootCollar.loadOnDefect', value || null)
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
          <FormField
            fieldPath="rootsAndRootCollar.likelihoodOfFailure"
            label="Likelihood of Failure"
          >
            <Select
              value={rootsAndRootCollar.likelihoodOfFailure || ''}
              onValueChange={(value) =>
                updateField('rootsAndRootCollar.likelihoodOfFailure', value || null)
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

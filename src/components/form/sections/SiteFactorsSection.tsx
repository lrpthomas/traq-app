'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, CheckboxField } from '@/components/form/FormField';
import type { Assessment } from '@/types/traq';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
}

export function SiteFactorsSection({ assessment, updateField }: Props) {
  if (!assessment?.siteFactors) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const { siteFactors } = assessment;

  return (
    <div className="space-y-6">
      {/* History of Failures */}
      <FormField fieldPath="siteFactors.historyOfFailures" label="History of Failures">
        <Textarea
          id="siteFactors.historyOfFailures"
          value={siteFactors.historyOfFailures}
          onChange={(e) => updateField('siteFactors.historyOfFailures', e.target.value)}
          placeholder="Describe any previous tree failures in the area"
          rows={3}
        />
      </FormField>

      {/* Topography */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Topography</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CheckboxField
            fieldPath="siteFactors.topography.flat"
            label="Flat"
            checked={siteFactors.topography.flat}
            onChange={(checked) => updateField('siteFactors.topography.flat', checked)}
          />

          <FormField fieldPath="siteFactors.topography.slopePercent" label="Slope %">
            <Input
              id="siteFactors.topography.slopePercent"
              type="number"
              value={siteFactors.topography.slopePercent || ''}
              onChange={(e) =>
                updateField('siteFactors.topography.slopePercent', e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="%"
            />
          </FormField>

          <FormField fieldPath="siteFactors.topography.aspect" label="Aspect">
            <Input
              id="siteFactors.topography.aspect"
              value={siteFactors.topography.aspect}
              onChange={(e) => updateField('siteFactors.topography.aspect', e.target.value)}
              placeholder="e.g., N, NE, S"
            />
          </FormField>
        </div>
      </div>

      {/* Site Changes */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Site Changes</h3>
        <div className="flex flex-wrap gap-4">
          <CheckboxField
            fieldPath="siteFactors.siteChanges.none"
            label="None"
            checked={siteFactors.siteChanges.none}
            onChange={(checked) => updateField('siteFactors.siteChanges.none', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.siteChanges.gradeChange"
            label="Grade Change"
            checked={siteFactors.siteChanges.gradeChange}
            onChange={(checked) => updateField('siteFactors.siteChanges.gradeChange', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.siteChanges.siteClearing"
            label="Site Clearing"
            checked={siteFactors.siteChanges.siteClearing}
            onChange={(checked) => updateField('siteFactors.siteChanges.siteClearing', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.siteChanges.changedSoilHydrology"
            label="Changed Soil Hydrology"
            checked={siteFactors.siteChanges.changedSoilHydrology}
            onChange={(checked) => updateField('siteFactors.siteChanges.changedSoilHydrology', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.siteChanges.rootCuts"
            label="Root Cuts"
            checked={siteFactors.siteChanges.rootCuts}
            onChange={(checked) => updateField('siteFactors.siteChanges.rootCuts', checked)}
          />
        </div>
        <FormField fieldPath="siteFactors.siteChanges.describe" label="Describe">
          <Input
            id="siteFactors.siteChanges.describe"
            value={siteFactors.siteChanges.describe}
            onChange={(e) => updateField('siteFactors.siteChanges.describe', e.target.value)}
            placeholder="Additional details"
          />
        </FormField>
      </div>

      {/* Soil Conditions */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Soil Conditions</h3>
        <div className="flex flex-wrap gap-4">
          <CheckboxField
            fieldPath="siteFactors.soilConditions.limitedVolume"
            label="Limited Volume"
            checked={siteFactors.soilConditions.limitedVolume}
            onChange={(checked) => updateField('siteFactors.soilConditions.limitedVolume', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.soilConditions.saturated"
            label="Saturated"
            checked={siteFactors.soilConditions.saturated}
            onChange={(checked) => updateField('siteFactors.soilConditions.saturated', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.soilConditions.shallow"
            label="Shallow"
            checked={siteFactors.soilConditions.shallow}
            onChange={(checked) => updateField('siteFactors.soilConditions.shallow', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.soilConditions.compacted"
            label="Compacted"
            checked={siteFactors.soilConditions.compacted}
            onChange={(checked) => updateField('siteFactors.soilConditions.compacted', checked)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            fieldPath="siteFactors.soilConditions.pavementOverRootsPercent"
            label="Pavement Over Roots %"
          >
            <Input
              id="siteFactors.soilConditions.pavementOverRootsPercent"
              type="number"
              value={siteFactors.soilConditions.pavementOverRootsPercent || ''}
              onChange={(e) =>
                updateField(
                  'siteFactors.soilConditions.pavementOverRootsPercent',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="%"
            />
          </FormField>
          <FormField fieldPath="siteFactors.soilConditions.describe" label="Describe">
            <Input
              id="siteFactors.soilConditions.describe"
              value={siteFactors.soilConditions.describe}
              onChange={(e) => updateField('siteFactors.soilConditions.describe', e.target.value)}
              placeholder="Additional details"
            />
          </FormField>
        </div>
      </div>

      {/* Prevailing Wind Direction */}
      <FormField
        fieldPath="siteFactors.prevailingWindDirection"
        label="Prevailing Wind Direction"
      >
        <Input
          id="siteFactors.prevailingWindDirection"
          value={siteFactors.prevailingWindDirection}
          onChange={(e) => updateField('siteFactors.prevailingWindDirection', e.target.value)}
          placeholder="e.g., SW"
        />
      </FormField>

      {/* Common Weather */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Common Weather Events</h3>
        <div className="flex flex-wrap gap-4">
          <CheckboxField
            fieldPath="siteFactors.commonWeather.strongWinds"
            label="Strong Winds"
            checked={siteFactors.commonWeather.strongWinds}
            onChange={(checked) => updateField('siteFactors.commonWeather.strongWinds', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.commonWeather.ice"
            label="Ice"
            checked={siteFactors.commonWeather.ice}
            onChange={(checked) => updateField('siteFactors.commonWeather.ice', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.commonWeather.snow"
            label="Snow"
            checked={siteFactors.commonWeather.snow}
            onChange={(checked) => updateField('siteFactors.commonWeather.snow', checked)}
          />
          <CheckboxField
            fieldPath="siteFactors.commonWeather.heavyRain"
            label="Heavy Rain"
            checked={siteFactors.commonWeather.heavyRain}
            onChange={(checked) => updateField('siteFactors.commonWeather.heavyRain', checked)}
          />
        </div>
        <FormField fieldPath="siteFactors.commonWeather.describe" label="Describe">
          <Input
            id="siteFactors.commonWeather.describe"
            value={siteFactors.commonWeather.describe}
            onChange={(e) => updateField('siteFactors.commonWeather.describe', e.target.value)}
            placeholder="Additional details"
          />
        </FormField>
      </div>
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';
import { FormField, CheckboxField } from '@/components/form/FormField';
import { MultiSelectPicker } from '@/components/form/MultiSelectPicker';
import { DirectionPicker } from '@/components/form/DirectionPicker';
import type { Assessment } from '@/types/traq';

// Common failure types for tree risk assessment
const FAILURE_HISTORY_OPTIONS = [
  { id: 'branch-failure', label: 'Branch failure', description: 'Previous branch drops or breakage' },
  { id: 'whole-tree', label: 'Whole tree failure', description: 'Complete tree uprooting or trunk failure' },
  { id: 'trunk-failure', label: 'Trunk failure', description: 'Trunk breakage or splitting' },
  { id: 'root-failure', label: 'Root failure', description: 'Root plate lifting or root breakage' },
  { id: 'codominant-failure', label: 'Codominant stem failure', description: 'Failure at codominant stem union' },
  { id: 'storm-damage', label: 'Storm damage', description: 'Weather-related failures' },
  { id: 'decay-related', label: 'Decay-related failure', description: 'Failure due to wood decay' },
  { id: 'none-known', label: 'None known', description: 'No known history of failures' },
];

// Common site changes
const SITE_CHANGES_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'grade-change', label: 'Grade Change' },
  { id: 'site-clearing', label: 'Site Clearing' },
  { id: 'changed-soil-hydrology', label: 'Changed Soil Hydrology' },
  { id: 'root-cuts', label: 'Root Cuts' },
  { id: 'construction', label: 'Construction Activity' },
  { id: 'paving', label: 'Paving / Hardscape Added' },
  { id: 'irrigation-change', label: 'Irrigation Change' },
  { id: 'trenching', label: 'Trenching / Excavation' },
  { id: 'fill-added', label: 'Fill Added Over Roots' },
  { id: 'compaction', label: 'Soil Compaction' },
  { id: 'tree-removal', label: 'Adjacent Tree Removal' },
];

// Common soil conditions
const SOIL_CONDITIONS_OPTIONS = [
  { id: 'limited-volume', label: 'Limited Volume' },
  { id: 'saturated', label: 'Saturated' },
  { id: 'shallow', label: 'Shallow' },
  { id: 'compacted', label: 'Compacted' },
  { id: 'clay', label: 'Clay Soil' },
  { id: 'sandy', label: 'Sandy Soil' },
  { id: 'rocky', label: 'Rocky / Hardpan' },
  { id: 'fill-soil', label: 'Fill Soil' },
  { id: 'contaminated', label: 'Contaminated' },
  { id: 'poorly-drained', label: 'Poorly Drained' },
  { id: 'well-drained', label: 'Well Drained' },
];

// Common weather events
const WEATHER_OPTIONS = [
  { id: 'strong-winds', label: 'Strong Winds', description: 'High wind events common in area' },
  { id: 'ice', label: 'Ice Storms', description: 'Ice accumulation on branches' },
  { id: 'snow', label: 'Heavy Snow', description: 'Snow loading on branches' },
  { id: 'heavy-rain', label: 'Heavy Rain', description: 'Intense rainfall events' },
  { id: 'drought', label: 'Drought', description: 'Extended dry periods' },
  { id: 'flooding', label: 'Flooding', description: 'Periodic flooding events' },
  { id: 'lightning', label: 'Lightning', description: 'Frequent lightning storms' },
  { id: 'hail', label: 'Hail', description: 'Hail storms' },
  { id: 'tornadoes', label: 'Tornadoes', description: 'Tornado activity in area' },
  { id: 'hurricanes', label: 'Hurricanes / Tropical Storms', description: 'Hurricane or tropical storm exposure' },
  { id: 'microbursts', label: 'Microbursts', description: 'Localized intense downdrafts' },
];

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
}

export function SiteFactorsSection({ assessment, updateField }: Props) {
  if (!assessment?.siteFactors) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const { siteFactors } = assessment;

  // Check if any site change is selected (other than "None")
  const hasSiteChangeSelected =
    siteFactors.siteChanges.gradeChange ||
    siteFactors.siteChanges.siteClearing ||
    siteFactors.siteChanges.changedSoilHydrology ||
    siteFactors.siteChanges.rootCuts;

  // Check if any soil condition is selected
  const hasSoilConditionSelected =
    siteFactors.soilConditions.limitedVolume ||
    siteFactors.soilConditions.saturated ||
    siteFactors.soilConditions.shallow ||
    siteFactors.soilConditions.compacted;

  // Convert site changes to comma-separated string for MultiSelectPicker
  const getSiteChangesValue = () => {
    const selected: string[] = [];
    if (siteFactors.siteChanges.none) selected.push('None');
    if (siteFactors.siteChanges.gradeChange) selected.push('Grade Change');
    if (siteFactors.siteChanges.siteClearing) selected.push('Site Clearing');
    if (siteFactors.siteChanges.changedSoilHydrology) selected.push('Changed Soil Hydrology');
    if (siteFactors.siteChanges.rootCuts) selected.push('Root Cuts');
    // Include any custom entries from describe field
    if (siteFactors.siteChanges.describe) {
      const customEntries = siteFactors.siteChanges.describe.split(',').map(s => s.trim()).filter(Boolean);
      const presetLabels = ['None', 'Grade Change', 'Site Clearing', 'Changed Soil Hydrology', 'Root Cuts'];
      customEntries.forEach(entry => {
        if (!presetLabels.includes(entry) && !selected.includes(entry)) {
          selected.push(entry);
        }
      });
    }
    return selected.join(', ');
  };

  // Handle site changes multi-select
  const handleSiteChangesChange = (value: string) => {
    const selected = value.split(',').map(s => s.trim()).filter(Boolean);

    // Update checkbox fields
    updateField('siteFactors.siteChanges.none', selected.includes('None'));
    updateField('siteFactors.siteChanges.gradeChange', selected.includes('Grade Change'));
    updateField('siteFactors.siteChanges.siteClearing', selected.includes('Site Clearing'));
    updateField('siteFactors.siteChanges.changedSoilHydrology', selected.includes('Changed Soil Hydrology'));
    updateField('siteFactors.siteChanges.rootCuts', selected.includes('Root Cuts'));

    // Store any custom entries in describe
    const presetBooleanLabels = ['None', 'Grade Change', 'Site Clearing', 'Changed Soil Hydrology', 'Root Cuts'];
    const otherEntries = selected.filter(s => !presetBooleanLabels.includes(s));
    if (otherEntries.length > 0) {
      updateField('siteFactors.siteChanges.describe', otherEntries.join(', '));
    }
  };

  // Convert soil conditions to comma-separated string
  const getSoilConditionsValue = () => {
    const selected: string[] = [];
    if (siteFactors.soilConditions.limitedVolume) selected.push('Limited Volume');
    if (siteFactors.soilConditions.saturated) selected.push('Saturated');
    if (siteFactors.soilConditions.shallow) selected.push('Shallow');
    if (siteFactors.soilConditions.compacted) selected.push('Compacted');
    // Include custom entries from describe
    if (siteFactors.soilConditions.describe) {
      const customEntries = siteFactors.soilConditions.describe.split(',').map(s => s.trim()).filter(Boolean);
      const presetLabels = ['Limited Volume', 'Saturated', 'Shallow', 'Compacted'];
      customEntries.forEach(entry => {
        if (!presetLabels.includes(entry) && !selected.includes(entry)) {
          selected.push(entry);
        }
      });
    }
    return selected.join(', ');
  };

  // Handle soil conditions multi-select
  const handleSoilConditionsChange = (value: string) => {
    const selected = value.split(',').map(s => s.trim()).filter(Boolean);

    updateField('siteFactors.soilConditions.limitedVolume', selected.includes('Limited Volume'));
    updateField('siteFactors.soilConditions.saturated', selected.includes('Saturated'));
    updateField('siteFactors.soilConditions.shallow', selected.includes('Shallow'));
    updateField('siteFactors.soilConditions.compacted', selected.includes('Compacted'));

    // Store custom entries in describe
    const presetBooleanLabels = ['Limited Volume', 'Saturated', 'Shallow', 'Compacted'];
    const otherEntries = selected.filter(s => !presetBooleanLabels.includes(s));
    if (otherEntries.length > 0) {
      updateField('siteFactors.soilConditions.describe', otherEntries.join(', '));
    }
  };

  // Convert common weather to comma-separated string
  const getCommonWeatherValue = () => {
    const selected: string[] = [];
    if (siteFactors.commonWeather.strongWinds) selected.push('Strong Winds');
    if (siteFactors.commonWeather.ice) selected.push('Ice Storms');
    if (siteFactors.commonWeather.snow) selected.push('Heavy Snow');
    if (siteFactors.commonWeather.heavyRain) selected.push('Heavy Rain');
    // Include custom entries from describe
    if (siteFactors.commonWeather.describe) {
      const customEntries = siteFactors.commonWeather.describe.split(',').map(s => s.trim()).filter(Boolean);
      const presetLabels = ['Strong Winds', 'Ice Storms', 'Heavy Snow', 'Heavy Rain'];
      customEntries.forEach(entry => {
        if (!presetLabels.includes(entry) && !selected.includes(entry)) {
          selected.push(entry);
        }
      });
    }
    return selected.join(', ');
  };

  // Handle common weather multi-select
  const handleCommonWeatherChange = (value: string) => {
    const selected = value.split(',').map(s => s.trim()).filter(Boolean);

    updateField('siteFactors.commonWeather.strongWinds', selected.includes('Strong Winds'));
    updateField('siteFactors.commonWeather.ice', selected.includes('Ice Storms'));
    updateField('siteFactors.commonWeather.snow', selected.includes('Heavy Snow'));
    updateField('siteFactors.commonWeather.heavyRain', selected.includes('Heavy Rain'));

    // Store custom entries in describe
    const presetBooleanLabels = ['Strong Winds', 'Ice Storms', 'Heavy Snow', 'Heavy Rain'];
    const otherEntries = selected.filter(s => !presetBooleanLabels.includes(s));
    if (otherEntries.length > 0) {
      updateField('siteFactors.commonWeather.describe', otherEntries.join(', '));
    }
  };

  return (
    <div className="space-y-6">
      {/* History of Failures */}
      <FormField required fieldPath="siteFactors.historyOfFailures" label="History of Failures">
        <MultiSelectPicker
          value={siteFactors.historyOfFailures}
          onChange={(value) => updateField('siteFactors.historyOfFailures', value)}
          options={FAILURE_HISTORY_OPTIONS}
          placeholder="Select failure history..."
          allowCustom={true}
          customPlaceholder="Add custom failure type..."
        />
      </FormField>

      {/* Topography */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Topography <span className="text-red-500">*</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CheckboxField
            fieldPath="siteFactors.topography.flat"
            label="Flat"
            checked={siteFactors.topography.flat}
            onChange={(checked) => updateField('siteFactors.topography.flat', checked)}
          />

          <FormField required fieldPath="siteFactors.topography.slopePercent" label="Slope %">
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

          <FormField required fieldPath="siteFactors.topography.aspect" label="Aspect">
            <DirectionPicker
              value={siteFactors.topography.aspect}
              onChange={(value) => updateField('siteFactors.topography.aspect', value)}
              placeholder="Select aspect..."
            />
          </FormField>
        </div>
      </div>

      {/* Site Changes */}
      <div className="space-y-4">
        <FormField required fieldPath="siteFactors.siteChanges" label="Site Changes">
          <MultiSelectPicker
            value={getSiteChangesValue()}
            onChange={handleSiteChangesChange}
            options={SITE_CHANGES_OPTIONS}
            placeholder="Select site changes..."
            allowCustom={true}
            customPlaceholder="Add custom site change..."
          />
        </FormField>
        {hasSiteChangeSelected && (
          <FormField
            required
            fieldPath="siteFactors.siteChanges.describe"
            label="Describe Site Changes"
          >
            <Input
              id="siteFactors.siteChanges.describeDetail"
              value={siteFactors.siteChanges.describe}
              onChange={(e) => updateField('siteFactors.siteChanges.describe', e.target.value)}
              placeholder="Provide additional details about site changes"
            />
          </FormField>
        )}
      </div>

      {/* Soil Conditions */}
      <div className="space-y-4">
        <FormField required fieldPath="siteFactors.soilConditions" label="Soil Conditions">
          <MultiSelectPicker
            value={getSoilConditionsValue()}
            onChange={handleSoilConditionsChange}
            options={SOIL_CONDITIONS_OPTIONS}
            placeholder="Select soil conditions..."
            allowCustom={true}
            customPlaceholder="Add custom soil condition..."
          />
        </FormField>
        <FormField
          required
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
        {hasSoilConditionSelected && (
          <FormField
            required
            fieldPath="siteFactors.soilConditions.describe"
            label="Describe Soil Conditions"
          >
            <Input
              id="siteFactors.soilConditions.describeDetail"
              value={siteFactors.soilConditions.describe}
              onChange={(e) => updateField('siteFactors.soilConditions.describe', e.target.value)}
              placeholder="Provide additional details about soil conditions"
            />
          </FormField>
        )}
      </div>

      {/* Prevailing Wind Direction */}
      <FormField
        required
        fieldPath="siteFactors.prevailingWindDirection"
        label="Prevailing Wind Direction"
      >
        <DirectionPicker
          value={siteFactors.prevailingWindDirection}
          onChange={(value) => updateField('siteFactors.prevailingWindDirection', value)}
          placeholder="Select wind direction..."
        />
      </FormField>

      {/* Common Weather */}
      <FormField required fieldPath="siteFactors.commonWeather" label="Common Weather Events">
        <MultiSelectPicker
          value={getCommonWeatherValue()}
          onChange={handleCommonWeatherChange}
          options={WEATHER_OPTIONS}
          placeholder="Select weather events..."
          allowCustom={true}
          customPlaceholder="Add custom weather event..."
        />
      </FormField>
    </div>
  );
}

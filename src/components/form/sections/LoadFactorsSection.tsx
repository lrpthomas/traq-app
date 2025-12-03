'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/form/FormField';
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

export function LoadFactorsSection({ assessment, updateField }: Props) {
  if (!assessment?.loadFactors) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const { loadFactors } = assessment;

  return (
    <div className="space-y-6">
      {/* Wind Exposure */}
      <FormField required fieldPath="loadFactors.windExposure" label="Wind Exposure">
        <Select
          value={loadFactors.windExposure || ''}
          onValueChange={(value) =>
            updateField('loadFactors.windExposure', value || null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select wind exposure" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="protected">{LABELS.windExposure.protected}</SelectItem>
            <SelectItem value="partial">{LABELS.windExposure.partial}</SelectItem>
            <SelectItem value="full">{LABELS.windExposure.full}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* Wind Funneling */}
      <FormField required fieldPath="loadFactors.windFunneling" label="Wind Funneling">
        <Input
          id="loadFactors.windFunneling"
          value={loadFactors.windFunneling}
          onChange={(e) => updateField('loadFactors.windFunneling', e.target.value)}
          placeholder="Describe wind funneling effects"
        />
      </FormField>

      {/* Relative Crown Size */}
      <FormField required fieldPath="loadFactors.relativeCrownSize" label="Relative Crown Size">
        <Select
          value={loadFactors.relativeCrownSize || ''}
          onValueChange={(value) =>
            updateField('loadFactors.relativeCrownSize', value || null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select crown size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">{LABELS.crownSize.small}</SelectItem>
            <SelectItem value="medium">{LABELS.crownSize.medium}</SelectItem>
            <SelectItem value="large">{LABELS.crownSize.large}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* Crown Density */}
      <FormField required fieldPath="loadFactors.crownDensity" label="Crown Density">
        <Select
          value={loadFactors.crownDensity || ''}
          onValueChange={(value) =>
            updateField('loadFactors.crownDensity', value || null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select crown density" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sparse">{LABELS.density.sparse}</SelectItem>
            <SelectItem value="normal">{LABELS.density.normal}</SelectItem>
            <SelectItem value="dense">{LABELS.density.dense}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* Interior Branches */}
      <FormField required fieldPath="loadFactors.interiorBranches" label="Interior Branches">
        <Select
          value={loadFactors.interiorBranches || ''}
          onValueChange={(value) =>
            updateField('loadFactors.interiorBranches', value || null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select interior branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="few">{LABELS.interiorBranches.few}</SelectItem>
            <SelectItem value="normal">{LABELS.interiorBranches.normal}</SelectItem>
            <SelectItem value="dense">{LABELS.interiorBranches.dense}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* Vines/Mistletoe/Moss */}
      <FormField
        fieldPath="loadFactors.vinesMistletoeMoss"
        label="Vines / Mistletoe / Moss"
      >
        <Input
          id="loadFactors.vinesMistletoeMoss"
          value={loadFactors.vinesMistletoeMoss}
          onChange={(e) => updateField('loadFactors.vinesMistletoeMoss', e.target.value)}
          placeholder="Describe any vines, mistletoe, or moss"
        />
      </FormField>

      {/* Recent or Expected Change */}
      <FormField
        fieldPath="loadFactors.recentOrExpectedChangeInLoadFactors"
        label="Recent or Expected Change in Load Factors"
      >
        <Textarea
          id="loadFactors.recentOrExpectedChangeInLoadFactors"
          value={loadFactors.recentOrExpectedChangeInLoadFactors}
          onChange={(e) =>
            updateField('loadFactors.recentOrExpectedChangeInLoadFactors', e.target.value)
          }
          placeholder="Describe any recent or expected changes"
          rows={2}
        />
      </FormField>
    </div>
  );
}

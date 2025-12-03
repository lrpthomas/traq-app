'use client';

import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { TreeSpeciesInput } from '@/components/form/TreeSpeciesInput';
import type { Assessment } from '@/types/traq';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
}

export function HeaderSection({ assessment, updateField }: Props) {
  if (!assessment?.header) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const { header } = assessment;

  return (
    <div className="space-y-6">
      {/* Client & Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField fieldPath="header.client" label="Client" required>
          <Input
            id="header.client"
            value={header.client}
            onChange={(e) => updateField('header.client', e.target.value)}
            placeholder="Client name"
          />
        </FormField>

        <FormField fieldPath="header.date" label="Date" required>
          <Input
            id="header.date"
            type="date"
            value={header.date}
            onChange={(e) => updateField('header.date', e.target.value)}
          />
        </FormField>

        <FormField fieldPath="header.time" label="Time">
          <Input
            id="header.time"
            type="time"
            value={header.time}
            onChange={(e) => updateField('header.time', e.target.value)}
          />
        </FormField>
      </div>

      {/* Location Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FormField fieldPath="header.addressTreeLocation" label="Address / Tree Location" required>
            <Input
              id="header.addressTreeLocation"
              value={header.addressTreeLocation}
              onChange={(e) => updateField('header.addressTreeLocation', e.target.value)}
              placeholder="123 Main St, City, State"
            />
          </FormField>
        </div>

        <FormField fieldPath="header.treeNo" label="Tree No.">
          <Input
            id="header.treeNo"
            value={header.treeNo}
            onChange={(e) => updateField('header.treeNo', e.target.value)}
            placeholder="e.g., 1, A1"
          />
        </FormField>
      </div>

      {/* Sheet Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField fieldPath="header.sheetNumber" label="Sheet #">
          <Input
            id="header.sheetNumber"
            type="number"
            min={1}
            value={header.sheetNumber}
            onChange={(e) => updateField('header.sheetNumber', parseInt(e.target.value) || 1)}
          />
        </FormField>

        <FormField fieldPath="header.sheetTotal" label="of Total">
          <Input
            id="header.sheetTotal"
            type="number"
            min={1}
            value={header.sheetTotal}
            onChange={(e) => updateField('header.sheetTotal', parseInt(e.target.value) || 1)}
          />
        </FormField>
      </div>

      {/* Tree Species */}
      <FormField fieldPath="header.treeSpecies" label="Tree Species" required>
        <TreeSpeciesInput
          id="header.treeSpecies"
          value={header.treeSpecies}
          onChange={(value) => updateField('header.treeSpecies', value)}
          placeholder="Start typing to search species..."
        />
      </FormField>

      {/* Tree Measurements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField fieldPath="header.dbh" label="DBH (Diameter at Breast Height)">
          <Input
            id="header.dbh"
            value={header.dbh}
            onChange={(e) => updateField('header.dbh', e.target.value)}
            placeholder="e.g., 24 in"
          />
        </FormField>

        <FormField fieldPath="header.height" label="Height">
          <Input
            id="header.height"
            value={header.height}
            onChange={(e) => updateField('header.height', e.target.value)}
            placeholder="e.g., 50 ft"
          />
        </FormField>

        <FormField fieldPath="header.crownSpreadDia" label="Crown Spread Dia.">
          <Input
            id="header.crownSpreadDia"
            value={header.crownSpreadDia}
            onChange={(e) => updateField('header.crownSpreadDia', e.target.value)}
            placeholder="e.g., 40 ft"
          />
        </FormField>
      </div>

      {/* Assessor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField fieldPath="header.assessors" label="Assessor(s)" required>
          <Input
            id="header.assessors"
            value={header.assessors}
            onChange={(e) => updateField('header.assessors', e.target.value)}
            placeholder="Name(s) of assessor(s)"
          />
        </FormField>

        <FormField fieldPath="header.toolsUsed" label="Tools Used">
          <Input
            id="header.toolsUsed"
            value={header.toolsUsed}
            onChange={(e) => updateField('header.toolsUsed', e.target.value)}
            placeholder="e.g., Mallet, binoculars"
          />
        </FormField>
      </div>

      {/* Time Frame */}
      <FormField fieldPath="header.timeFrame" label="Time Frame for Assessment">
        <Input
          id="header.timeFrame"
          value={header.timeFrame}
          onChange={(e) => updateField('header.timeFrame', e.target.value)}
          placeholder="e.g., 1 year"
        />
      </FormField>
    </div>
  );
}

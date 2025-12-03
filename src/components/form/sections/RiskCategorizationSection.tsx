'use client';

import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/form/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  Assessment,
  TreePart,
  LikelihoodOfFailure,
  LikelihoodOfImpact,
  Consequences,
} from '@/types/traq';
import {
  LABELS,
  RISK_COLORS,
  calculateFailureAndImpact,
  calculateRiskRating,
} from '@/lib/riskMatrix';
import { cn } from '@/lib/utils';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
  addRiskRow: () => void;
  removeRiskRow: (id: string) => void;
}

export function RiskCategorizationSection({
  assessment,
  updateField,
  addRiskRow,
  removeRiskRow,
}: Props) {
  if (!assessment) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const riskRows = Array.isArray(assessment.riskRows) ? assessment.riskRows : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Use the ISA risk matrices to calculate risk ratings for each defect identified.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addRiskRow}>
          <Plus className="h-4 w-4 mr-1" />
          Add Row
        </Button>
      </div>

      {/* Risk Matrix Legend */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Risk Rating Legend</h4>
        <div className="flex flex-wrap gap-2">
          {(['low', 'moderate', 'high', 'extreme'] as const).map((rating) => (
            <Badge
              key={rating}
              className={cn(
                RISK_COLORS[rating].bg,
                RISK_COLORS[rating].text,
                RISK_COLORS[rating].border
              )}
            >
              {LABELS.riskRating[rating]}
            </Badge>
          ))}
        </div>
      </div>

      {riskRows.map((row, index) => (
        <RiskRow
          key={row.id}
          row={row}
          index={index}
          updateField={updateField}
          onRemove={() => removeRiskRow(row.id)}
          canRemove={riskRows.length > 1}
        />
      ))}
    </div>
  );
}

interface RiskRowProps {
  row: Assessment['riskRows'][0];
  index: number;
  updateField: (path: string, value: unknown) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function RiskRow({ row, index, updateField, onRemove, canRemove }: RiskRowProps) {
  // Auto-calculate failureAndImpact when inputs change
  useEffect(() => {
    const calculated = calculateFailureAndImpact(
      row.likelihoodOfFailure,
      row.likelihoodOfImpact
    );
    if (calculated !== row.failureAndImpact) {
      updateField(`riskRows.${index}.failureAndImpact`, calculated);
    }
  }, [row.likelihoodOfFailure, row.likelihoodOfImpact, row.failureAndImpact, index, updateField]);

  // Auto-calculate riskRating when inputs change
  useEffect(() => {
    const calculated = calculateRiskRating(row.failureAndImpact, row.consequences);
    if (calculated !== row.riskRating) {
      updateField(`riskRows.${index}.riskRating`, calculated);
    }
  }, [row.failureAndImpact, row.consequences, row.riskRating, index, updateField]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Risk Row {index + 1}</CardTitle>
          <div className="flex items-center gap-2">
            {row.riskRating && (
              <Badge
                className={cn(
                  RISK_COLORS[row.riskRating].bg,
                  RISK_COLORS[row.riskRating].text,
                  RISK_COLORS[row.riskRating].border
                )}
              >
                {LABELS.riskRating[row.riskRating]} Risk
              </Badge>
            )}
            {canRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField required fieldPath={`riskRows.${index}.target`} label="Target">
            <Input
              id={`riskRows.${index}.target`}
              value={row.target}
              onChange={(e) => updateField(`riskRows.${index}.target`, e.target.value)}
              placeholder="Target # or description"
            />
          </FormField>

          <FormField required fieldPath={`riskRows.${index}.treePart`} label="Tree Part">
            <Select
              value={row.treePart || ''}
              onValueChange={(value) =>
                updateField(`riskRows.${index}.treePart`, value || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tree part" />
              </SelectTrigger>
              <SelectContent>
                {(
                  ['branches', 'trunk', 'root-collar', 'roots', 'soil'] as TreePart[]
                ).map((part) => (
                  <SelectItem key={part} value={part}>
                    {LABELS.treePart[part]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField
          fieldPath={`riskRows.${index}.conditionsOfConcern`}
          label="Conditions of Concern"
        >
          <Input
            id={`riskRows.${index}.conditionsOfConcern`}
            value={row.conditionsOfConcern}
            onChange={(e) =>
              updateField(`riskRows.${index}.conditionsOfConcern`, e.target.value)
            }
            placeholder="Describe the defect or condition"
          />
        </FormField>

        {/* Matrix 1 Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <FormField
            fieldPath={`riskRows.${index}.likelihoodOfFailure`}
            label="Likelihood of Failure"
          >
            <Select
              value={row.likelihoodOfFailure || ''}
              onValueChange={(value) =>
                updateField(`riskRows.${index}.likelihoodOfFailure`, value || null)
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

          <FormField
            fieldPath={`riskRows.${index}.likelihoodOfImpact`}
            label="Likelihood of Impact"
          >
            <Select
              value={row.likelihoodOfImpact || ''}
              onValueChange={(value) =>
                updateField(`riskRows.${index}.likelihoodOfImpact`, value || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {(['very-low', 'low', 'medium', 'high'] as LikelihoodOfImpact[]).map(
                  (loi) => (
                    <SelectItem key={loi} value={loi}>
                      {LABELS.likelihoodOfImpact[loi]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            fieldPath={`riskRows.${index}.failureAndImpact`}
            label="Failure & Impact (Auto)"
          >
            <div className="h-10 px-3 py-2 rounded-md border bg-white text-sm">
              {row.failureAndImpact
                ? LABELS.failureAndImpact[row.failureAndImpact]
                : '-'}
            </div>
          </FormField>
        </div>

        {/* Matrix 2 Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
          <FormField required fieldPath={`riskRows.${index}.consequences`} label="Consequences">
            <Select
              value={row.consequences || ''}
              onValueChange={(value) =>
                updateField(`riskRows.${index}.consequences`, value || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {(['negligible', 'minor', 'significant', 'severe'] as Consequences[]).map(
                  (c) => (
                    <SelectItem key={c} value={c}>
                      {LABELS.consequences[c]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            fieldPath={`riskRows.${index}.riskRating`}
            label="Risk Rating (Auto)"
          >
            <div
              className={cn(
                'h-10 px-3 py-2 rounded-md border text-sm font-medium',
                row.riskRating
                  ? cn(
                      RISK_COLORS[row.riskRating].bg,
                      RISK_COLORS[row.riskRating].text,
                      RISK_COLORS[row.riskRating].border
                    )
                  : 'bg-white'
              )}
            >
              {row.riskRating ? LABELS.riskRating[row.riskRating] : '-'}
            </div>
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}

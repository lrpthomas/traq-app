'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { MediaSection } from './MediaSection';
import type { Assessment, ResidualRiskRating } from '@/types/traq';
import { LABELS, RISK_COLORS } from '@/lib/riskMatrix';
import { cn } from '@/lib/utils';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
  addMitigationOption: () => void;
  removeMitigationOption: (id: string) => void;
}

export function MitigationSection({
  assessment,
  updateField,
  addMitigationOption,
  removeMitigationOption,
}: Props) {
  if (!assessment) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }
  const mitigationOptions = Array.isArray(assessment.mitigationOptions) ? assessment.mitigationOptions : [];
  const inspectionLimitations = assessment.inspectionLimitations || {
    none: true,
    visibility: false,
    access: false,
    vines: false,
    rootCollarBuried: false,
    describe: '',
  };

  return (
    <div className="space-y-6">
      {/* Notes */}
      <FormField required fieldPath="notes" label="Notes">
        <Textarea
          id="notes"
          value={assessment.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional notes, observations, or recommendations"
          rows={4}
        />
      </FormField>

      {/* Overall Tree Risk Rating */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Overall Tree Risk Rating</h3>
        <div
          className={cn(
            'p-4 rounded-md text-center font-bold text-lg',
            assessment.overallTreeRiskRating
              ? cn(
                  RISK_COLORS[assessment.overallTreeRiskRating].bg,
                  RISK_COLORS[assessment.overallTreeRiskRating].text,
                  RISK_COLORS[assessment.overallTreeRiskRating].border,
                  'border'
                )
              : 'bg-gray-100 text-gray-500'
          )}
        >
          {assessment.overallTreeRiskRating
            ? `${LABELS.riskRating[assessment.overallTreeRiskRating]} Risk`
            : 'Not Calculated'}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Automatically calculated as the highest risk rating from all risk rows.
        </p>
      </div>

      {/* Mitigation Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Mitigation Options</h3>
          {mitigationOptions.length < 4 && (
            <Button variant="outline" size="sm" onClick={addMitigationOption}>
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          )}
        </div>

        {mitigationOptions.map((option, index) => (
          <Card key={option.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Option {option.optionNumber}</CardTitle>
                {mitigationOptions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMitigationOption(option.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                fieldPath={`mitigationOptions.${index}.description`}
                label="Description"
              >
                <Textarea
                  id={`mitigationOptions.${index}.description`}
                  value={option.description}
                  onChange={(e) =>
                    updateField(`mitigationOptions.${index}.description`, e.target.value)
                  }
                  placeholder="Describe the mitigation action"
                  rows={2}
                />
              </FormField>

              <FormField
                fieldPath={`mitigationOptions.${index}.residualRisk`}
                label="Residual Risk"
              >
                <Select
                  value={option.residualRisk || ''}
                  onValueChange={(value) =>
                    updateField(`mitigationOptions.${index}.residualRisk`, value || null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select residual risk" />
                  </SelectTrigger>
                  <SelectContent>
                    {(['none', 'low', 'moderate', 'high', 'extreme'] as ResidualRiskRating[]).map(
                      (risk) => (
                        <SelectItem key={risk} value={risk}>
                          {risk.charAt(0).toUpperCase() + risk.slice(1)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Residual Risk */}
      <FormField required fieldPath="overallResidualRisk" label="Overall Residual Risk">
        <Select
          value={assessment.overallResidualRisk || ''}
          onValueChange={(value) => updateField('overallResidualRisk', value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select overall residual risk" />
          </SelectTrigger>
          <SelectContent>
            {(['none', 'low', 'moderate', 'high', 'extreme'] as ResidualRiskRating[]).map(
              (risk) => (
                <SelectItem key={risk} value={risk}>
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </FormField>

      {/* Recommended Inspection Interval */}
      <FormField
        fieldPath="recommendedInspectionInterval"
        label="Recommended Inspection Interval"
      >
        <Input
          id="recommendedInspectionInterval"
          value={assessment.recommendedInspectionInterval}
          onChange={(e) => updateField('recommendedInspectionInterval', e.target.value)}
          placeholder="e.g., 1 year, 6 months"
        />
      </FormField>

      {/* Data Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField required fieldPath="dataStatus" label="Data Status">
          <Select
            value={assessment.dataStatus}
            onValueChange={(value) => updateField('dataStatus', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preliminary">Preliminary</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="space-y-4">
          <CheckboxField
            fieldPath="advancedAssessmentNeeded"
            label="Advanced Assessment Needed"
            checked={assessment.advancedAssessmentNeeded}
            onChange={(checked) => updateField('advancedAssessmentNeeded', checked)}
          />
          {assessment.advancedAssessmentNeeded && (
            <FormField
              fieldPath="advancedAssessmentTypeReason"
              label="Type/Reason"
            >
              <Input
                id="advancedAssessmentTypeReason"
                value={assessment.advancedAssessmentTypeReason}
                onChange={(e) =>
                  updateField('advancedAssessmentTypeReason', e.target.value)
                }
                placeholder="e.g., Resistograph, Aerial inspection"
              />
            </FormField>
          )}
        </div>
      </div>

      {/* Inspection Limitations */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Inspection Limitations</h3>
        <div className="flex flex-wrap gap-4">
          <CheckboxField
            fieldPath="inspectionLimitations.none"
            label="None"
            checked={inspectionLimitations.none}
            onChange={(checked) => updateField('inspectionLimitations.none', checked)}
          />
          <CheckboxField
            fieldPath="inspectionLimitations.visibility"
            label="Visibility"
            checked={inspectionLimitations.visibility}
            onChange={(checked) => updateField('inspectionLimitations.visibility', checked)}
          />
          <CheckboxField
            fieldPath="inspectionLimitations.access"
            label="Access"
            checked={inspectionLimitations.access}
            onChange={(checked) => updateField('inspectionLimitations.access', checked)}
          />
          <CheckboxField
            fieldPath="inspectionLimitations.vines"
            label="Vines"
            checked={inspectionLimitations.vines}
            onChange={(checked) => updateField('inspectionLimitations.vines', checked)}
          />
          <CheckboxField
            fieldPath="inspectionLimitations.rootCollarBuried"
            label="Root Collar Buried"
            checked={inspectionLimitations.rootCollarBuried}
            onChange={(checked) =>
              updateField('inspectionLimitations.rootCollarBuried', checked)
            }
          />
        </div>
        {!inspectionLimitations.none && (
          <FormField required fieldPath="inspectionLimitations.describe" label="Describe">
            <Input
              id="inspectionLimitations.describe"
              value={inspectionLimitations.describe}
              onChange={(e) =>
                updateField('inspectionLimitations.describe', e.target.value)
              }
              placeholder="Describe inspection limitations"
            />
          </FormField>
        )}
      </div>

      {/* Media Attachments */}
      <div className="border-t pt-6 mt-6">
        <MediaSection assessmentId={assessment.id} />
      </div>
    </div>
  );
}

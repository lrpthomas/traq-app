'use client';

import { Plus } from 'lucide-react';
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
import type { Assessment, LoadOnDefect, LikelihoodOfFailure } from '@/types/traq';
import { LABELS } from '@/lib/riskMatrix';

interface Props {
  assessment: Assessment;
  updateField: (path: string, value: unknown) => void;
  addBranchFailureAssessment: () => void;
}

export function CrownBranchesSection({
  assessment,
  updateField,
  addBranchFailureAssessment,
}: Props) {
  if (!assessment?.crownAndBranches) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }

  const { crownAndBranches } = assessment;
  const failureAssessments = Array.isArray(crownAndBranches.failureAssessments)
    ? crownAndBranches.failureAssessments
    : [];

  return (
    <div className="space-y-6">
      {/* Crown Structure */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Crown Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            fieldPath="crownAndBranches.unbalancedCrown"
            label="Unbalanced Crown"
            checked={crownAndBranches.unbalancedCrown}
            onChange={(checked) => updateField('crownAndBranches.unbalancedCrown', checked)}
          />
          <FormField required fieldPath="crownAndBranches.lcrPercent" label="Live Crown Ratio %">
            <Input
              id="crownAndBranches.lcrPercent"
              type="number"
              min={0}
              max={100}
              value={crownAndBranches.lcrPercent || ''}
              onChange={(e) =>
                updateField(
                  'crownAndBranches.lcrPercent',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="%"
            />
          </FormField>
        </div>
      </div>

      {/* Dead Twigs/Branches */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Dead Twigs/Branches</h3>
        <CheckboxField
          fieldPath="crownAndBranches.deadTwigsBranches.present"
          label="Present"
          checked={crownAndBranches.deadTwigsBranches.present}
          onChange={(checked) =>
            updateField('crownAndBranches.deadTwigsBranches.present', checked)
          }
        />
        {crownAndBranches.deadTwigsBranches.present && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              fieldPath="crownAndBranches.deadTwigsBranches.percentOverall"
              label="% of Overall Crown"
            >
              <Input
                id="crownAndBranches.deadTwigsBranches.percentOverall"
                type="number"
                min={0}
                max={100}
                value={crownAndBranches.deadTwigsBranches.percentOverall || ''}
                onChange={(e) =>
                  updateField(
                    'crownAndBranches.deadTwigsBranches.percentOverall',
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="%"
              />
            </FormField>
            <FormField
              fieldPath="crownAndBranches.deadTwigsBranches.maxDia"
              label="Max Diameter"
            >
              <Input
                id="crownAndBranches.deadTwigsBranches.maxDia"
                value={crownAndBranches.deadTwigsBranches.maxDia}
                onChange={(e) =>
                  updateField('crownAndBranches.deadTwigsBranches.maxDia', e.target.value)
                }
                placeholder="e.g., 4 in"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Broken/Hangers */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Broken/Hangers</h3>
        <CheckboxField
          fieldPath="crownAndBranches.brokenHangers.present"
          label="Present"
          checked={crownAndBranches.brokenHangers.present}
          onChange={(checked) =>
            updateField('crownAndBranches.brokenHangers.present', checked)
          }
        />
        {crownAndBranches.brokenHangers.present && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField required fieldPath="crownAndBranches.brokenHangers.number" label="Number">
              <Input
                id="crownAndBranches.brokenHangers.number"
                type="number"
                min={0}
                value={crownAndBranches.brokenHangers.number || ''}
                onChange={(e) =>
                  updateField(
                    'crownAndBranches.brokenHangers.number',
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              />
            </FormField>
            <FormField required fieldPath="crownAndBranches.brokenHangers.maxDia" label="Max Diameter">
              <Input
                id="crownAndBranches.brokenHangers.maxDia"
                value={crownAndBranches.brokenHangers.maxDia}
                onChange={(e) =>
                  updateField('crownAndBranches.brokenHangers.maxDia', e.target.value)
                }
                placeholder="e.g., 4 in"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Various Conditions */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Branch Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            fieldPath="crownAndBranches.overExtendedBranches"
            label="Over-extended Branches"
            checked={crownAndBranches.overExtendedBranches}
            onChange={(checked) =>
              updateField('crownAndBranches.overExtendedBranches', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.lightningDamage"
            label="Lightning Damage"
            checked={crownAndBranches.lightningDamage}
            onChange={(checked) => updateField('crownAndBranches.lightningDamage', checked)}
          />
          <CheckboxField
            fieldPath="crownAndBranches.includedBark"
            label="Included Bark"
            checked={crownAndBranches.includedBark}
            onChange={(checked) => updateField('crownAndBranches.includedBark', checked)}
          />
          <CheckboxField
            fieldPath="crownAndBranches.similarBranchesPresent"
            label="Similar Branches Present"
            checked={crownAndBranches.similarBranchesPresent}
            onChange={(checked) =>
              updateField('crownAndBranches.similarBranchesPresent', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.deadMissingBark"
            label="Dead/Missing Bark"
            checked={crownAndBranches.deadMissingBark}
            onChange={(checked) => updateField('crownAndBranches.deadMissingBark', checked)}
          />
          <CheckboxField
            fieldPath="crownAndBranches.cankersGallsBurls"
            label="Cankers/Galls/Burls"
            checked={crownAndBranches.cankersGallsBurls}
            onChange={(checked) =>
              updateField('crownAndBranches.cankersGallsBurls', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.sapwoodDamageDecay"
            label="Sapwood Damage/Decay"
            checked={crownAndBranches.sapwoodDamageDecay}
            onChange={(checked) =>
              updateField('crownAndBranches.sapwoodDamageDecay', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.conks"
            label="Conks"
            checked={crownAndBranches.conks}
            onChange={(checked) => updateField('crownAndBranches.conks', checked)}
          />
        </div>
      </div>

      {/* Pruning History */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Pruning History</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CheckboxField
            fieldPath="crownAndBranches.pruningHistory.crownCleaned"
            label="Crown Cleaned"
            checked={crownAndBranches.pruningHistory.crownCleaned}
            onChange={(checked) =>
              updateField('crownAndBranches.pruningHistory.crownCleaned', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.pruningHistory.thinned"
            label="Thinned"
            checked={crownAndBranches.pruningHistory.thinned}
            onChange={(checked) =>
              updateField('crownAndBranches.pruningHistory.thinned', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.pruningHistory.raised"
            label="Raised"
            checked={crownAndBranches.pruningHistory.raised}
            onChange={(checked) =>
              updateField('crownAndBranches.pruningHistory.raised', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.pruningHistory.reduced"
            label="Reduced"
            checked={crownAndBranches.pruningHistory.reduced}
            onChange={(checked) =>
              updateField('crownAndBranches.pruningHistory.reduced', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.pruningHistory.topped"
            label="Topped"
            checked={crownAndBranches.pruningHistory.topped}
            onChange={(checked) =>
              updateField('crownAndBranches.pruningHistory.topped', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.pruningHistory.lionTailed"
            label="Lion-tailed"
            checked={crownAndBranches.pruningHistory.lionTailed}
            onChange={(checked) =>
              updateField('crownAndBranches.pruningHistory.lionTailed', checked)
            }
          />
          <CheckboxField
            fieldPath="crownAndBranches.pruningHistory.flushCuts"
            label="Flush Cuts"
            checked={crownAndBranches.pruningHistory.flushCuts}
            onChange={(checked) =>
              updateField('crownAndBranches.pruningHistory.flushCuts', checked)
            }
          />
        </div>
        <FormField required fieldPath="crownAndBranches.pruningHistory.other" label="Other">
          <Input
            id="crownAndBranches.pruningHistory.other"
            value={crownAndBranches.pruningHistory.other}
            onChange={(e) =>
              updateField('crownAndBranches.pruningHistory.other', e.target.value)
            }
            placeholder="Other pruning history"
          />
        </FormField>
      </div>

      {/* Cracks */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="crownAndBranches.cracks.present"
          label="Cracks Present"
          checked={crownAndBranches.cracks.present}
          onChange={(checked) => updateField('crownAndBranches.cracks.present', checked)}
        />
        {crownAndBranches.cracks.present && (
          <FormField required fieldPath="crownAndBranches.cracks.describe" label="Describe">
            <Input
              id="crownAndBranches.cracks.describe"
              value={crownAndBranches.cracks.describe}
              onChange={(e) =>
                updateField('crownAndBranches.cracks.describe', e.target.value)
              }
              placeholder="Describe crack location and severity"
            />
          </FormField>
        )}
      </div>

      {/* Codominant */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="crownAndBranches.codominant.present"
          label="Codominant Stems/Branches"
          checked={crownAndBranches.codominant.present}
          onChange={(checked) => updateField('crownAndBranches.codominant.present', checked)}
        />
        {crownAndBranches.codominant.present && (
          <FormField required fieldPath="crownAndBranches.codominant.describe" label="Describe">
            <Input
              id="crownAndBranches.codominant.describe"
              value={crownAndBranches.codominant.describe}
              onChange={(e) =>
                updateField('crownAndBranches.codominant.describe', e.target.value)
              }
              placeholder="Describe location and condition"
            />
          </FormField>
        )}
      </div>

      {/* Weak Attachments */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="crownAndBranches.weakAttachments.present"
          label="Weak Attachments"
          checked={crownAndBranches.weakAttachments.present}
          onChange={(checked) =>
            updateField('crownAndBranches.weakAttachments.present', checked)
          }
        />
        {crownAndBranches.weakAttachments.present && (
          <FormField
            fieldPath="crownAndBranches.weakAttachments.describe"
            label="Describe"
          >
            <Input
              id="crownAndBranches.weakAttachments.describe"
              value={crownAndBranches.weakAttachments.describe}
              onChange={(e) =>
                updateField('crownAndBranches.weakAttachments.describe', e.target.value)
              }
              placeholder="Describe weak attachments"
            />
          </FormField>
        )}
      </div>

      {/* Cavity/Nest Hole */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="crownAndBranches.cavityNestHole.present"
          label="Cavity/Nest Hole"
          checked={crownAndBranches.cavityNestHole.present}
          onChange={(checked) =>
            updateField('crownAndBranches.cavityNestHole.present', checked)
          }
        />
        {crownAndBranches.cavityNestHole.present && (
          <FormField
            fieldPath="crownAndBranches.cavityNestHole.percentCirc"
            label="% Circumference"
          >
            <Input
              id="crownAndBranches.cavityNestHole.percentCirc"
              type="number"
              min={0}
              max={100}
              value={crownAndBranches.cavityNestHole.percentCirc || ''}
              onChange={(e) =>
                updateField(
                  'crownAndBranches.cavityNestHole.percentCirc',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="%"
            />
          </FormField>
        )}
      </div>

      {/* Previous Branch Failures */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="crownAndBranches.previousBranchFailures.present"
          label="Previous Branch Failures"
          checked={crownAndBranches.previousBranchFailures.present}
          onChange={(checked) =>
            updateField('crownAndBranches.previousBranchFailures.present', checked)
          }
        />
        {crownAndBranches.previousBranchFailures.present && (
          <FormField
            fieldPath="crownAndBranches.previousBranchFailures.describe"
            label="Describe"
          >
            <Input
              id="crownAndBranches.previousBranchFailures.describe"
              value={crownAndBranches.previousBranchFailures.describe}
              onChange={(e) =>
                updateField('crownAndBranches.previousBranchFailures.describe', e.target.value)
              }
              placeholder="Describe previous failures"
            />
          </FormField>
        )}
      </div>

      {/* Heartwood Decay */}
      <div className="space-y-4">
        <CheckboxField
          fieldPath="crownAndBranches.heartwoodDecay.present"
          label="Heartwood Decay"
          checked={crownAndBranches.heartwoodDecay.present}
          onChange={(checked) =>
            updateField('crownAndBranches.heartwoodDecay.present', checked)
          }
        />
        {crownAndBranches.heartwoodDecay.present && (
          <FormField
            fieldPath="crownAndBranches.heartwoodDecay.describe"
            label="Describe"
          >
            <Input
              id="crownAndBranches.heartwoodDecay.describe"
              value={crownAndBranches.heartwoodDecay.describe}
              onChange={(e) =>
                updateField('crownAndBranches.heartwoodDecay.describe', e.target.value)
              }
              placeholder="Describe decay"
            />
          </FormField>
        )}
      </div>

      {/* Response Growth & Conditions of Concern */}
      <FormField required fieldPath="crownAndBranches.responseGrowth" label="Response Growth">
        <Textarea
          id="crownAndBranches.responseGrowth"
          value={crownAndBranches.responseGrowth}
          onChange={(e) => updateField('crownAndBranches.responseGrowth', e.target.value)}
          placeholder="Describe response growth (wound wood, adventitious shoots, etc.)"
          rows={2}
        />
      </FormField>

      <FormField
        fieldPath="crownAndBranches.conditionsOfConcern"
        label="Conditions of Concern"
      >
        <Textarea
          id="crownAndBranches.conditionsOfConcern"
          value={crownAndBranches.conditionsOfConcern}
          onChange={(e) =>
            updateField('crownAndBranches.conditionsOfConcern', e.target.value)
          }
          placeholder="Summarize conditions of concern for branches"
          rows={2}
        />
      </FormField>

      {/* Failure Assessments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Failure Assessment for Branches</h3>
          {failureAssessments.length < 2 && (
            <Button variant="outline" size="sm" onClick={addBranchFailureAssessment}>
              <Plus className="h-4 w-4 mr-1" />
              Add Assessment
            </Button>
          )}
        </div>

        {failureAssessments.map((fa, index) => (
          <Card key={fa.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Branch Assessment {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  fieldPath={`crownAndBranches.failureAssessments.${index}.partSize`}
                  label="Part Size"
                >
                  <Input
                    id={`crownAndBranches.failureAssessments.${index}.partSize`}
                    value={fa.partSize}
                    onChange={(e) =>
                      updateField(
                        `crownAndBranches.failureAssessments.${index}.partSize`,
                        e.target.value
                      )
                    }
                    placeholder="e.g., 6 in dia"
                  />
                </FormField>
                <FormField
                  fieldPath={`crownAndBranches.failureAssessments.${index}.fallDistance`}
                  label="Fall Distance"
                >
                  <Input
                    id={`crownAndBranches.failureAssessments.${index}.fallDistance`}
                    value={fa.fallDistance}
                    onChange={(e) =>
                      updateField(
                        `crownAndBranches.failureAssessments.${index}.fallDistance`,
                        e.target.value
                      )
                    }
                    placeholder="e.g., 30 ft"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  fieldPath={`crownAndBranches.failureAssessments.${index}.loadOnDefect`}
                  label="Load on Defect"
                >
                  <Select
                    value={fa.loadOnDefect || ''}
                    onValueChange={(value) =>
                      updateField(
                        `crownAndBranches.failureAssessments.${index}.loadOnDefect`,
                        value || null
                      )
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
                  fieldPath={`crownAndBranches.failureAssessments.${index}.likelihoodOfFailure`}
                  label="Likelihood of Failure"
                >
                  <Select
                    value={fa.likelihoodOfFailure || ''}
                    onValueChange={(value) =>
                      updateField(
                        `crownAndBranches.failureAssessments.${index}.likelihoodOfFailure`,
                        value || null
                      )
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

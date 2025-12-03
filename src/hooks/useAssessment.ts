'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import type {
  Assessment,
  TargetAssessment,
  RiskCategorizationRow,
  MitigationOption,
  BranchFailureAssessment,
} from '@/types/traq';
import { getOverallRiskRating } from '@/lib/riskMatrix';

/**
 * Creates a new empty assessment with default values matching ISA 2017 form
 */
export function createEmptyAssessment(): Assessment {
  const now = new Date();
  return {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    status: 'draft',

    // Header
    header: {
      client: '',
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      addressTreeLocation: '',
      treeNo: '',
      sheetNumber: 1,
      sheetTotal: 1,
      treeSpecies: '',
      dbh: '',
      height: '',
      crownSpreadDia: '',
      assessors: '',
      toolsUsed: '',
      timeFrame: '1 year',
    },

    // Targets (start with 1)
    targets: [createEmptyTarget(1)],

    // Site Factors
    siteFactors: {
      historyOfFailures: '',
      topography: {
        flat: false,
        slopePercent: null,
        aspect: '',
      },
      siteChanges: {
        none: true,
        gradeChange: false,
        siteClearing: false,
        changedSoilHydrology: false,
        rootCuts: false,
        describe: '',
      },
      soilConditions: {
        limitedVolume: false,
        saturated: false,
        shallow: false,
        compacted: false,
        pavementOverRootsPercent: null,
        describe: '',
      },
      prevailingWindDirection: '',
      commonWeather: {
        strongWinds: false,
        ice: false,
        snow: false,
        heavyRain: false,
        describe: '',
      },
    },

    // Tree Health
    treeHealth: {
      vigor: null,
      foliage: {
        noneSeasonal: false,
        noneDead: false,
        normalPercent: null,
        chloroticPercent: null,
        necroticPercent: null,
      },
      pestsBiotic: '',
      abiotic: '',
      speciesFailureProfile: {
        branches: false,
        trunk: false,
        roots: false,
        describe: '',
      },
    },

    // Load Factors
    loadFactors: {
      windExposure: null,
      windFunneling: '',
      relativeCrownSize: null,
      crownDensity: null,
      interiorBranches: null,
      vinesMistletoeMoss: '',
      recentOrExpectedChangeInLoadFactors: '',
    },

    // Crown and Branches
    crownAndBranches: {
      unbalancedCrown: false,
      lcrPercent: null,
      deadTwigsBranches: {
        present: false,
        percentOverall: null,
        maxDia: '',
      },
      brokenHangers: {
        present: false,
        number: null,
        maxDia: '',
      },
      overExtendedBranches: false,
      pruningHistory: {
        crownCleaned: false,
        thinned: false,
        raised: false,
        reduced: false,
        topped: false,
        lionTailed: false,
        flushCuts: false,
        other: '',
      },
      cracks: {
        present: false,
        describe: '',
      },
      lightningDamage: false,
      codominant: {
        present: false,
        describe: '',
      },
      includedBark: false,
      weakAttachments: {
        present: false,
        describe: '',
      },
      cavityNestHole: {
        present: false,
        percentCirc: null,
      },
      previousBranchFailures: {
        present: false,
        describe: '',
      },
      similarBranchesPresent: false,
      deadMissingBark: false,
      cankersGallsBurls: false,
      sapwoodDamageDecay: false,
      conks: false,
      heartwoodDecay: {
        present: false,
        describe: '',
      },
      responseGrowth: '',
      conditionsOfConcern: '',
      failureAssessments: [createEmptyBranchFailureAssessment()],
    },

    // Trunk
    trunk: {
      deadMissingBark: false,
      abnormalBarkTextureColor: false,
      codominantStems: false,
      includedBark: false,
      cracks: false,
      sapwoodDamageDecay: false,
      cankersGallsBurls: false,
      sapOoze: false,
      lightningDamage: false,
      heartwoodDecay: false,
      conksMushrooms: false,
      cavityNestHole: {
        present: false,
        percentCirc: null,
        depth: '',
      },
      poorTaper: false,
      lean: {
        present: false,
        degrees: null,
        corrected: '',
      },
      responseGrowth: '',
      conditionsOfConcern: '',
      partSize: '',
      fallDistance: '',
      loadOnDefect: null,
      likelihoodOfFailure: null,
    },

    // Roots and Root Collar
    rootsAndRootCollar: {
      collarBuriedNotVisible: false,
      depth: '',
      stemGirdling: false,
      dead: false,
      decay: false,
      conksMushrooms: false,
      ooze: false,
      cavity: {
        present: false,
        percentCirc: null,
      },
      cracks: false,
      cutDamagedRoots: {
        present: false,
        distanceFromTrunk: '',
      },
      rootPlateLifting: false,
      soilWeakness: false,
      responseGrowth: '',
      conditionsOfConcern: '',
      partSize: '',
      fallDistance: '',
      loadOnDefect: null,
      likelihoodOfFailure: null,
    },

    // Risk Categorization (Page 2)
    riskRows: [createEmptyRiskRow()],

    // Notes
    notes: '',

    // Mitigation
    mitigationOptions: [createEmptyMitigationOption(1)],

    // Overall ratings
    overallTreeRiskRating: null,
    overallResidualRisk: null,
    recommendedInspectionInterval: '',

    // Data status
    dataStatus: 'preliminary',
    advancedAssessmentNeeded: false,
    advancedAssessmentTypeReason: '',

    // Inspection limitations
    inspectionLimitations: {
      none: true,
      visibility: false,
      access: false,
      vines: false,
      rootCollarBuried: false,
      describe: '',
    },

    // Media
    mediaIds: [],
  };
}

export function createEmptyTarget(targetNumber: 1 | 2 | 3 | 4): TargetAssessment {
  return {
    id: uuidv4(),
    targetNumber,
    targetDescription: '',
    targetProtection: '',
    targetZone: {
      withinDripLine: false,
      within1xHt: false,
      within1_5xHt: false,
    },
    occupancyRate: null,
    practicalToMoveTarget: null,
    restrictionPractical: null,
  };
}

export function createEmptyRiskRow(): RiskCategorizationRow {
  return {
    id: uuidv4(),
    target: '',
    treePart: null,
    conditionsOfConcern: '',
    likelihoodOfFailure: null,
    likelihoodOfImpact: null,
    failureAndImpact: null,
    consequences: null,
    riskRating: null,
  };
}

export function createEmptyMitigationOption(optionNumber: 1 | 2 | 3 | 4): MitigationOption {
  return {
    id: uuidv4(),
    optionNumber,
    description: '',
    residualRisk: null,
  };
}

export function createEmptyBranchFailureAssessment(): BranchFailureAssessment {
  return {
    id: uuidv4(),
    partSize: '',
    fallDistance: '',
    loadOnDefect: null,
    likelihoodOfFailure: null,
  };
}

/**
 * Validate and migrate an assessment to ensure all required fields exist
 */
function validateAssessment(assessment: Assessment): Assessment {
  const empty = createEmptyAssessment();
  return {
    ...empty,
    ...assessment,
    // Ensure all arrays exist
    targets: Array.isArray(assessment.targets) ? assessment.targets : [createEmptyTarget(1)],
    riskRows: Array.isArray(assessment.riskRows) ? assessment.riskRows : [createEmptyRiskRow()],
    mitigationOptions: Array.isArray(assessment.mitigationOptions)
      ? assessment.mitigationOptions
      : [createEmptyMitigationOption(1)],
    mediaIds: Array.isArray(assessment.mediaIds) ? assessment.mediaIds : [],
    // Ensure nested objects exist
    header: { ...empty.header, ...assessment.header },
    siteFactors: { ...empty.siteFactors, ...assessment.siteFactors },
    treeHealth: { ...empty.treeHealth, ...assessment.treeHealth },
    loadFactors: { ...empty.loadFactors, ...assessment.loadFactors },
    crownAndBranches: {
      ...empty.crownAndBranches,
      ...assessment.crownAndBranches,
      failureAssessments: Array.isArray(assessment.crownAndBranches?.failureAssessments)
        ? assessment.crownAndBranches.failureAssessments
        : [createEmptyBranchFailureAssessment()],
    },
    trunk: { ...empty.trunk, ...assessment.trunk },
    rootsAndRootCollar: { ...empty.rootsAndRootCollar, ...assessment.rootsAndRootCollar },
    inspectionLimitations: { ...empty.inspectionLimitations, ...assessment.inspectionLimitations },
  };
}

/**
 * Hook for managing a single assessment
 */
export function useAssessment(assessmentId?: string) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load assessment from database
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        if (assessmentId) {
          const existing = await db.assessments.get(assessmentId);
          if (existing) {
            // Validate and migrate old data to ensure all fields exist
            setAssessment(validateAssessment(existing));
          } else {
            setError('Assessment not found');
          }
        } else {
          // Create new assessment
          setAssessment(createEmptyAssessment());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [assessmentId]);

  // Update assessment field (deep path supported)
  const updateField = useCallback((path: string, value: unknown) => {
    setAssessment((prev) => {
      if (!prev) return prev;

      const updated = { ...prev };
      const parts = path.split('.');
      let current: Record<string, unknown> = updated;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (typeof current[part] === 'object' && current[part] !== null) {
          // Preserve arrays as arrays, objects as objects
          if (Array.isArray(current[part])) {
            current[part] = [...(current[part] as unknown[])];
          } else {
            current[part] = { ...(current[part] as Record<string, unknown>) };
          }
          current = current[part] as Record<string, unknown>;
        }
      }

      current[parts[parts.length - 1]] = value;
      updated.updatedAt = new Date();

      // Recalculate overall risk rating when risk rows change
      if (path.startsWith('riskRows') && Array.isArray(updated.riskRows)) {
        updated.overallTreeRiskRating = getOverallRiskRating(
          updated.riskRows.map((row) => row.riskRating)
        );
      }

      return updated;
    });
  }, []);

  // Save assessment to database
  const save = useCallback(async () => {
    if (!assessment) return;

    setIsSaving(true);
    setError(null);

    try {
      assessment.updatedAt = new Date();
      await db.assessments.put(assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  }, [assessment]);

  // Mark as complete
  const complete = useCallback(async () => {
    if (!assessment) return;

    setAssessment((prev) => {
      if (!prev) return prev;
      return { ...prev, status: 'complete', updatedAt: new Date() };
    });
  }, [assessment]);

  // Add target (max 4)
  const addTarget = useCallback(() => {
    setAssessment((prev) => {
      if (!prev) return prev;
      const currentTargets = Array.isArray(prev.targets) ? prev.targets : [];
      if (currentTargets.length >= 4) return prev;
      const nextNumber = (currentTargets.length + 1) as 1 | 2 | 3 | 4;
      return {
        ...prev,
        targets: [...currentTargets, createEmptyTarget(nextNumber)],
        updatedAt: new Date(),
      };
    });
  }, []);

  // Remove target
  const removeTarget = useCallback((targetId: string) => {
    setAssessment((prev) => {
      if (!prev) return prev;
      const currentTargets = Array.isArray(prev.targets) ? prev.targets : [];
      if (currentTargets.length <= 1) return prev;
      const filtered = currentTargets.filter((t) => t.id !== targetId);
      // Renumber remaining targets
      const renumbered = filtered.map((t, i) => ({
        ...t,
        targetNumber: (i + 1) as 1 | 2 | 3 | 4,
      }));
      return {
        ...prev,
        targets: renumbered,
        updatedAt: new Date(),
      };
    });
  }, []);

  // Add risk row
  const addRiskRow = useCallback(() => {
    setAssessment((prev) => {
      if (!prev) return prev;
      const currentRows = Array.isArray(prev.riskRows) ? prev.riskRows : [];
      return {
        ...prev,
        riskRows: [...currentRows, createEmptyRiskRow()],
        updatedAt: new Date(),
      };
    });
  }, []);

  // Remove risk row
  const removeRiskRow = useCallback((rowId: string) => {
    setAssessment((prev) => {
      if (!prev) return prev;
      const currentRows = Array.isArray(prev.riskRows) ? prev.riskRows : [];
      if (currentRows.length <= 1) return prev;
      return {
        ...prev,
        riskRows: currentRows.filter((r) => r.id !== rowId),
        updatedAt: new Date(),
      };
    });
  }, []);

  // Add mitigation option (max 4)
  const addMitigationOption = useCallback(() => {
    setAssessment((prev) => {
      if (!prev) return prev;
      const currentOptions = Array.isArray(prev.mitigationOptions) ? prev.mitigationOptions : [];
      if (currentOptions.length >= 4) return prev;
      const nextNumber = (currentOptions.length + 1) as 1 | 2 | 3 | 4;
      return {
        ...prev,
        mitigationOptions: [...currentOptions, createEmptyMitigationOption(nextNumber)],
        updatedAt: new Date(),
      };
    });
  }, []);

  // Remove mitigation option
  const removeMitigationOption = useCallback((optionId: string) => {
    setAssessment((prev) => {
      if (!prev) return prev;
      const currentOptions = Array.isArray(prev.mitigationOptions) ? prev.mitigationOptions : [];
      if (currentOptions.length <= 1) return prev;
      const filtered = currentOptions.filter((o) => o.id !== optionId);
      // Renumber remaining options
      const renumbered = filtered.map((o, i) => ({
        ...o,
        optionNumber: (i + 1) as 1 | 2 | 3 | 4,
      }));
      return {
        ...prev,
        mitigationOptions: renumbered,
        updatedAt: new Date(),
      };
    });
  }, []);

  // Add branch failure assessment (max 2)
  const addBranchFailureAssessment = useCallback(() => {
    setAssessment((prev) => {
      if (!prev || !prev.crownAndBranches) return prev;
      const currentAssessments = Array.isArray(prev.crownAndBranches.failureAssessments)
        ? prev.crownAndBranches.failureAssessments
        : [];
      if (currentAssessments.length >= 2) return prev;
      return {
        ...prev,
        crownAndBranches: {
          ...prev.crownAndBranches,
          failureAssessments: [
            ...currentAssessments,
            createEmptyBranchFailureAssessment(),
          ],
        },
        updatedAt: new Date(),
      };
    });
  }, []);

  return {
    assessment,
    isLoading,
    isSaving,
    error,
    updateField,
    save,
    complete,
    addTarget,
    removeTarget,
    addRiskRow,
    removeRiskRow,
    addMitigationOption,
    removeMitigationOption,
    addBranchFailureAssessment,
  };
}

/**
 * Hook for listing all assessments
 */
export function useAssessments() {
  const assessments = useLiveQuery(() =>
    db.assessments.orderBy('updatedAt').reverse().toArray()
  );

  const deleteAssessment = useCallback(async (id: string) => {
    await db.assessments.delete(id);
    // Also delete associated media
    await db.media.where('assessmentId').equals(id).delete();
  }, []);

  return {
    assessments: assessments || [],
    isLoading: assessments === undefined,
    deleteAssessment,
  };
}

import type {
  LikelihoodOfFailure,
  LikelihoodOfImpact,
  FailureAndImpact,
  Consequences,
  RiskRating,
} from '@/types/traq';

/**
 * TRAQ Risk Assessment Matrix Calculations
 * Based on ISA Basic Tree Risk Assessment Form (2017)
 *
 * Matrix 1: Likelihood of Failure × Likelihood of Impact → Failure & Impact
 * Matrix 2: Failure & Impact × Consequences → Risk Rating
 */

// Matrix 1: Likelihood matrix (from ISA form page 2)
// Rows: Likelihood of Failure (Imminent → Improbable)
// Cols: Likelihood of Impact (Very low → High)
const MATRIX_1: Record<LikelihoodOfFailure, Record<LikelihoodOfImpact, FailureAndImpact>> = {
  imminent: {
    'very-low': 'unlikely',
    'low': 'somewhat',
    'medium': 'likely',
    'high': 'very-likely',
  },
  probable: {
    'very-low': 'unlikely',
    'low': 'unlikely',
    'medium': 'somewhat',
    'high': 'likely',
  },
  possible: {
    'very-low': 'unlikely',
    'low': 'unlikely',
    'medium': 'unlikely',
    'high': 'somewhat',
  },
  improbable: {
    'very-low': 'unlikely',
    'low': 'unlikely',
    'medium': 'unlikely',
    'high': 'unlikely',
  },
};

// Matrix 2: Risk rating matrix (from ISA form page 2)
// Rows: Likelihood of Failure & Impact (Very likely → Unlikely)
// Cols: Consequences (Negligible → Severe)
const MATRIX_2: Record<FailureAndImpact, Record<Consequences, RiskRating>> = {
  'very-likely': {
    negligible: 'low',
    minor: 'moderate',
    significant: 'high',
    severe: 'extreme',
  },
  likely: {
    negligible: 'low',
    minor: 'moderate',
    significant: 'high',
    severe: 'high',
  },
  somewhat: {
    negligible: 'low',
    minor: 'low',
    significant: 'moderate',
    severe: 'moderate',
  },
  unlikely: {
    negligible: 'low',
    minor: 'low',
    significant: 'low',
    severe: 'low',
  },
};

/**
 * Calculate Failure & Impact from Matrix 1
 */
export function calculateFailureAndImpact(
  likelihoodOfFailure: LikelihoodOfFailure | null,
  likelihoodOfImpact: LikelihoodOfImpact | null
): FailureAndImpact | null {
  if (!likelihoodOfFailure || !likelihoodOfImpact) return null;
  return MATRIX_1[likelihoodOfFailure][likelihoodOfImpact];
}

/**
 * Calculate Risk Rating from Matrix 2
 */
export function calculateRiskRating(
  failureAndImpact: FailureAndImpact | null,
  consequences: Consequences | null
): RiskRating | null {
  if (!failureAndImpact || !consequences) return null;
  return MATRIX_2[failureAndImpact][consequences];
}

/**
 * Calculate complete risk from all inputs
 */
export function calculateFullRisk(
  likelihoodOfFailure: LikelihoodOfFailure | null,
  likelihoodOfImpact: LikelihoodOfImpact | null,
  consequences: Consequences | null
): {
  failureAndImpact: FailureAndImpact | null;
  riskRating: RiskRating | null;
} {
  const failureAndImpact = calculateFailureAndImpact(likelihoodOfFailure, likelihoodOfImpact);
  const riskRating = calculateRiskRating(failureAndImpact, consequences);
  return { failureAndImpact, riskRating };
}

/**
 * Get the highest risk rating from multiple risk items
 */
export function getOverallRiskRating(riskRatings: (RiskRating | null)[]): RiskRating | null {
  const order: RiskRating[] = ['low', 'moderate', 'high', 'extreme'];
  let highest: RiskRating | null = null;

  for (const rating of riskRatings) {
    if (rating === null) continue;
    if (highest === null || order.indexOf(rating) > order.indexOf(highest)) {
      highest = rating;
    }
  }

  return highest;
}

/**
 * Risk rating colors for UI
 */
export const RISK_COLORS: Record<RiskRating, { bg: string; text: string; border: string }> = {
  low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  moderate: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
  },
  high: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
  },
  extreme: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
  },
};

/**
 * Display labels for enum values (matching ISA form exactly)
 */
export const LABELS = {
  likelihoodOfFailure: {
    improbable: 'Improbable',
    possible: 'Possible',
    probable: 'Probable',
    imminent: 'Imminent',
  } as Record<LikelihoodOfFailure, string>,

  likelihoodOfImpact: {
    'very-low': 'Very low',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  } as Record<LikelihoodOfImpact, string>,

  failureAndImpact: {
    unlikely: 'Unlikely',
    somewhat: 'Somewhat likely',
    likely: 'Likely',
    'very-likely': 'Very likely',
  } as Record<FailureAndImpact, string>,

  consequences: {
    negligible: 'Negligible',
    minor: 'Minor',
    significant: 'Significant',
    severe: 'Severe',
  } as Record<Consequences, string>,

  riskRating: {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    extreme: 'Extreme',
  } as Record<RiskRating, string>,

  loadOnDefect: {
    'n/a': 'N/A',
    minor: 'Minor',
    moderate: 'Moderate',
    significant: 'Significant',
  },

  treePart: {
    branches: 'Branches',
    trunk: 'Trunk',
    'root-collar': 'Root Collar',
    roots: 'Roots',
    soil: 'Soil',
  },

  occupancyRate: {
    1: '1 - Rare',
    2: '2 - Occasional',
    3: '3 - Frequent',
    4: '4 - Constant',
  },

  vigor: {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
  },

  windExposure: {
    protected: 'Protected',
    partial: 'Partial',
    full: 'Full',
  },

  crownSize: {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },

  density: {
    sparse: 'Sparse',
    normal: 'Normal',
    dense: 'Dense',
  },

  interiorBranches: {
    few: 'Few',
    normal: 'Normal',
    dense: 'Dense',
  },
};

/**
 * Descriptions for risk ratings (for tooltips)
 */
export const RISK_DESCRIPTIONS: Record<RiskRating, string> = {
  low: 'Low risk - Routine maintenance or monitoring may be appropriate.',
  moderate: 'Moderate risk - Some level of concern; mitigation or monitoring may be needed.',
  high: 'High risk - Significant concern; mitigation is typically warranted.',
  extreme: 'Extreme risk - Urgent concern; immediate mitigation is typically warranted.',
};

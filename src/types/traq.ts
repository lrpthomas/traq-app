// TRAQ Form TypeScript Definitions
// Based on ISA Basic Tree Risk Assessment Form (2017)
// Matches exact PDF form structure

export interface Assessment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'complete';

  // Page 1 - Header
  header: HeaderInfo;

  // Page 1 - Target Assessment (up to 4)
  targets: TargetAssessment[];

  // Page 1 - Site Factors
  siteFactors: SiteFactors;

  // Page 1 - Tree Health and Species Profile
  treeHealth: TreeHealthProfile;

  // Page 1 - Load Factors
  loadFactors: LoadFactors;

  // Page 1 - Tree Defects: Crown and Branches
  crownAndBranches: CrownAndBranches;

  // Page 1 - Tree Defects: Trunk
  trunk: TrunkDefects;

  // Page 1 - Tree Defects: Roots and Root Collar
  rootsAndRootCollar: RootsAndRootCollar;

  // Page 2 - Risk Categorization rows
  riskRows: RiskCategorizationRow[];

  // Page 2 - Notes
  notes: string;

  // Page 2 - Mitigation options (up to 4)
  mitigationOptions: MitigationOption[];

  // Page 2 - Overall ratings
  overallTreeRiskRating: RiskRating | null;
  overallResidualRisk: ResidualRiskRating | null;
  recommendedInspectionInterval: string;

  // Page 2 - Data status
  dataStatus: 'final' | 'preliminary';
  advancedAssessmentNeeded: boolean;
  advancedAssessmentTypeReason: string;

  // Page 2 - Inspection limitations
  inspectionLimitations: InspectionLimitations;

  // Media Attachments (for report)
  mediaIds: string[];
}

// ============ Header Info ============
export interface HeaderInfo {
  client: string;
  date: string;
  time: string;
  addressTreeLocation: string;
  treeNo: string;
  sheetNumber: number;
  sheetTotal: number;
  treeSpecies: string;
  dbh: string; // includes unit e.g., "24 in" or "60 cm"
  height: string; // includes unit e.g., "50 ft" or "15 m"
  crownSpreadDia: string; // includes unit
  assessors: string;
  toolsUsed: string;
  timeFrame: string; // e.g., "1 year", "3 years"
}

// ============ Target Assessment ============
export interface TargetAssessment {
  id: string;
  targetNumber: 1 | 2 | 3 | 4;
  targetDescription: string;
  targetProtection: string;
  targetZone: {
    withinDripLine: boolean;
    within1xHt: boolean;
    within1_5xHt: boolean;
  };
  occupancyRate: OccupancyRate | null;
  practicalToMoveTarget: boolean | null;
  restrictionPractical: boolean | null;
}

export type OccupancyRate = 1 | 2 | 3 | 4; // 1=rare, 2=occasional, 3=frequent, 4=constant

// ============ Site Factors ============
export interface SiteFactors {
  historyOfFailures: string;
  topography: {
    flat: boolean;
    slopePercent: number | null;
    aspect: string;
  };
  siteChanges: {
    none: boolean;
    gradeChange: boolean;
    siteClearing: boolean;
    changedSoilHydrology: boolean;
    rootCuts: boolean;
    describe: string;
  };
  soilConditions: {
    limitedVolume: boolean;
    saturated: boolean;
    shallow: boolean;
    compacted: boolean;
    pavementOverRootsPercent: number | null;
    describe: string;
  };
  prevailingWindDirection: string;
  commonWeather: {
    strongWinds: boolean;
    ice: boolean;
    snow: boolean;
    heavyRain: boolean;
    describe: string;
  };
}

// ============ Tree Health and Species Profile ============
export interface TreeHealthProfile {
  vigor: 'low' | 'normal' | 'high' | null;
  foliage: {
    noneSeasonal: boolean;
    noneDead: boolean;
    normalPercent: number | null;
    chloroticPercent: number | null;
    necroticPercent: number | null;
  };
  pestsBiotic: string;
  abiotic: string;
  speciesFailureProfile: {
    branches: boolean;
    trunk: boolean;
    roots: boolean;
    describe: string;
  };
}

// ============ Load Factors ============
export interface LoadFactors {
  windExposure: 'protected' | 'partial' | 'full' | null;
  windFunneling: string;
  relativeCrownSize: 'small' | 'medium' | 'large' | null;
  crownDensity: 'sparse' | 'normal' | 'dense' | null;
  interiorBranches: 'few' | 'normal' | 'dense' | null;
  vinesMistletoeMoss: string;
  recentOrExpectedChangeInLoadFactors: string;
}

// ============ Crown and Branches Defects ============
export interface CrownAndBranches {
  unbalancedCrown: boolean;
  lcrPercent: number | null; // Live Crown Ratio
  deadTwigsBranches: {
    present: boolean;
    percentOverall: number | null;
    maxDia: string;
  };
  brokenHangers: {
    present: boolean;
    number: number | null;
    maxDia: string;
  };
  overExtendedBranches: boolean;
  pruningHistory: {
    crownCleaned: boolean;
    thinned: boolean;
    raised: boolean;
    reduced: boolean;
    topped: boolean;
    lionTailed: boolean;
    flushCuts: boolean;
    other: string;
  };
  cracks: {
    present: boolean;
    describe: string;
  };
  lightningDamage: boolean;
  codominant: {
    present: boolean;
    describe: string;
  };
  includedBark: boolean;
  weakAttachments: {
    present: boolean;
    describe: string;
  };
  cavityNestHole: {
    present: boolean;
    percentCirc: number | null;
  };
  previousBranchFailures: {
    present: boolean;
    describe: string;
  };
  similarBranchesPresent: boolean;
  deadMissingBark: boolean;
  cankersGallsBurls: boolean;
  sapwoodDamageDecay: boolean;
  conks: boolean;
  heartwoodDecay: {
    present: boolean;
    describe: string;
  };
  responseGrowth: string;
  conditionsOfConcern: string;
  // Failure assessment for branches (up to 2)
  failureAssessments: BranchFailureAssessment[];
}

export interface BranchFailureAssessment {
  id: string;
  partSize: string;
  fallDistance: string;
  loadOnDefect: LoadOnDefect | null;
  likelihoodOfFailure: LikelihoodOfFailure | null;
}

// ============ Trunk Defects ============
export interface TrunkDefects {
  deadMissingBark: boolean;
  abnormalBarkTextureColor: boolean;
  codominantStems: boolean;
  includedBark: boolean;
  cracks: boolean;
  sapwoodDamageDecay: boolean;
  cankersGallsBurls: boolean;
  sapOoze: boolean;
  lightningDamage: boolean;
  heartwoodDecay: boolean;
  conksMushrooms: boolean;
  cavityNestHole: {
    present: boolean;
    percentCirc: number | null;
    depth: string;
  };
  poorTaper: boolean;
  lean: {
    present: boolean;
    degrees: number | null;
    corrected: string;
  };
  responseGrowth: string;
  conditionsOfConcern: string;
  // Failure assessment for trunk
  partSize: string;
  fallDistance: string;
  loadOnDefect: LoadOnDefect | null;
  likelihoodOfFailure: LikelihoodOfFailure | null;
}

// ============ Roots and Root Collar Defects ============
export interface RootsAndRootCollar {
  collarBuriedNotVisible: boolean;
  depth: string;
  stemGirdling: boolean;
  dead: boolean;
  decay: boolean;
  conksMushrooms: boolean;
  ooze: boolean;
  cavity: {
    present: boolean;
    percentCirc: number | null;
  };
  cracks: boolean;
  cutDamagedRoots: {
    present: boolean;
    distanceFromTrunk: string;
  };
  rootPlateLifting: boolean;
  soilWeakness: boolean;
  responseGrowth: string;
  conditionsOfConcern: string;
  // Failure assessment for roots
  partSize: string;
  fallDistance: string;
  loadOnDefect: LoadOnDefect | null;
  likelihoodOfFailure: LikelihoodOfFailure | null;
}

// ============ Risk Categorization Row (Page 2) ============
export interface RiskCategorizationRow {
  id: string;
  target: string; // Target number or description
  treePart: TreePart | null;
  conditionsOfConcern: string;
  // Likelihood of Failure
  likelihoodOfFailure: LikelihoodOfFailure | null;
  // Likelihood of Impact
  likelihoodOfImpact: LikelihoodOfImpact | null;
  // Failure & Impact (calculated from Matrix 1)
  failureAndImpact: FailureAndImpact | null;
  // Consequences
  consequences: Consequences | null;
  // Risk Rating (calculated from Matrix 2)
  riskRating: RiskRating | null;
}

// ============ Mitigation Option ============
export interface MitigationOption {
  id: string;
  optionNumber: 1 | 2 | 3 | 4;
  description: string;
  residualRisk: ResidualRiskRating | null;
}

// ============ Inspection Limitations ============
export interface InspectionLimitations {
  none: boolean;
  visibility: boolean;
  access: boolean;
  vines: boolean;
  rootCollarBuried: boolean;
  describe: string;
}

// ============ Enums ============
export type LoadOnDefect = 'n/a' | 'minor' | 'moderate' | 'significant';

export type LikelihoodOfFailure = 'improbable' | 'possible' | 'probable' | 'imminent';

export type LikelihoodOfImpact = 'very-low' | 'low' | 'medium' | 'high';

export type FailureAndImpact = 'unlikely' | 'somewhat' | 'likely' | 'very-likely';

export type Consequences = 'negligible' | 'minor' | 'significant' | 'severe';

export type RiskRating = 'low' | 'moderate' | 'high' | 'extreme';

export type ResidualRiskRating = 'none' | 'low' | 'moderate' | 'high' | 'extreme';

export type TreePart = 'branches' | 'trunk' | 'root-collar' | 'roots' | 'soil';

// ============ Media Attachment ============
export interface MediaAttachment {
  id: string;
  assessmentId: string;
  type: 'photo' | 'video' | 'document';
  filename: string;
  mimeType: string;
  blob: Blob;
  caption: string;
  createdAt: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// ============ Answer Memory ============
export interface FieldMemory {
  id: string;
  fieldPath: string;
  value: unknown;
  enabled: boolean;
  lastUsed: Date;
}

// ============ App Settings ============
export interface AppSettings {
  id: string;
  defaultTimeFrame: string;
  defaultUnits: {
    diameter: 'in' | 'cm';
    height: 'ft' | 'm';
    distance: 'ft' | 'm';
  };
  autoSaveInterval: number;
  enableMemory: boolean;
  theme: 'light' | 'dark' | 'system';
  assessorName: string; // Pre-fill assessor field
}

// ============ Tooltip/Help Content ============
export interface FieldHelp {
  title: string;
  description: string;
  examples?: string[];
  reference?: string;
}

// ============ CSV Data Types ============
export interface TreeSpecies {
  scientificName: string;
  commonName: string;
  family: string;
  failureProfile?: string;
}

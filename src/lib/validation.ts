import { z } from 'zod'

/**
 * TRAQ Form Validation Schemas
 * Based on ISA Basic Tree Risk Assessment Form (2017)
 */

// ============ Enum Schemas ============

export const loadOnDefectSchema = z.enum(['n/a', 'minor', 'moderate', 'significant'])

export const likelihoodOfFailureSchema = z.enum(['improbable', 'possible', 'probable', 'imminent'])

export const likelihoodOfImpactSchema = z.enum(['very-low', 'low', 'medium', 'high'])

export const failureAndImpactSchema = z.enum(['unlikely', 'somewhat', 'likely', 'very-likely'])

export const consequencesSchema = z.enum(['negligible', 'minor', 'significant', 'severe'])

export const riskRatingSchema = z.enum(['low', 'moderate', 'high', 'extreme'])

export const residualRiskRatingSchema = z.enum(['none', 'low', 'moderate', 'high', 'extreme'])

export const treePartSchema = z.enum(['branches', 'trunk', 'root-collar', 'roots', 'soil'])

export const occupancyRateSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])

export const vigorSchema = z.enum(['low', 'normal', 'high'])

export const windExposureSchema = z.enum(['protected', 'partial', 'full'])

export const crownSizeSchema = z.enum(['small', 'medium', 'large'])

export const densitySchema = z.enum(['sparse', 'normal', 'dense'])

export const interiorBranchesSchema = z.enum(['few', 'normal', 'dense'])

// ============ Percentage Validation ============

export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage cannot exceed 100')
  .nullable()

export const positiveNumberSchema = z
  .number()
  .positive('Value must be positive')
  .nullable()

// ============ Header Info Schema ============

export const headerInfoSchema = z.object({
  client: z.string().min(1, 'Client name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string(),
  addressTreeLocation: z.string().min(1, 'Tree location is required'),
  treeNo: z.string(),
  sheetNumber: z.number().int().positive(),
  sheetTotal: z.number().int().positive(),
  treeSpecies: z.string(),
  dbh: z.string(),
  height: z.string(),
  crownSpreadDia: z.string(),
  assessors: z.string().min(1, 'Assessor name is required'),
  toolsUsed: z.string(),
  timeFrame: z.string(),
})

// ============ Target Assessment Schema ============

export const targetZoneSchema = z.object({
  withinDripLine: z.boolean(),
  within1xHt: z.boolean(),
  within1_5xHt: z.boolean(),
})

export const targetAssessmentSchema = z.object({
  id: z.string().uuid(),
  targetNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  targetDescription: z.string(),
  targetProtection: z.string(),
  targetZone: targetZoneSchema,
  occupancyRate: occupancyRateSchema.nullable(),
  practicalToMoveTarget: z.boolean().nullable(),
  restrictionPractical: z.boolean().nullable(),
})

// ============ Site Factors Schema ============

export const topographySchema = z.object({
  flat: z.boolean(),
  slopePercent: percentageSchema,
  aspect: z.string(),
})

export const siteChangesSchema = z.object({
  none: z.boolean(),
  gradeChange: z.boolean(),
  siteClearing: z.boolean(),
  changedSoilHydrology: z.boolean(),
  rootCuts: z.boolean(),
  describe: z.string(),
})

export const soilConditionsSchema = z.object({
  limitedVolume: z.boolean(),
  saturated: z.boolean(),
  shallow: z.boolean(),
  compacted: z.boolean(),
  pavementOverRootsPercent: percentageSchema,
  describe: z.string(),
})

export const commonWeatherSchema = z.object({
  strongWinds: z.boolean(),
  ice: z.boolean(),
  snow: z.boolean(),
  heavyRain: z.boolean(),
  describe: z.string(),
})

export const siteFactorsSchema = z.object({
  historyOfFailures: z.string(),
  topography: topographySchema,
  siteChanges: siteChangesSchema,
  soilConditions: soilConditionsSchema,
  prevailingWindDirection: z.string(),
  commonWeather: commonWeatherSchema,
})

// ============ Tree Health Profile Schema ============

export const foliageSchema = z.object({
  noneSeasonal: z.boolean(),
  noneDead: z.boolean(),
  normalPercent: percentageSchema,
  chloroticPercent: percentageSchema,
  necroticPercent: percentageSchema,
})

export const speciesFailureProfileSchema = z.object({
  branches: z.boolean(),
  trunk: z.boolean(),
  roots: z.boolean(),
  describe: z.string(),
})

export const treeHealthProfileSchema = z.object({
  vigor: vigorSchema.nullable(),
  foliage: foliageSchema,
  pestsBiotic: z.string(),
  abiotic: z.string(),
  speciesFailureProfile: speciesFailureProfileSchema,
})

// ============ Load Factors Schema ============

export const loadFactorsSchema = z.object({
  windExposure: windExposureSchema.nullable(),
  windFunneling: z.string(),
  relativeCrownSize: crownSizeSchema.nullable(),
  crownDensity: densitySchema.nullable(),
  interiorBranches: interiorBranchesSchema.nullable(),
  vinesMistletoeMoss: z.string(),
  recentOrExpectedChangeInLoadFactors: z.string(),
})

// ============ Crown and Branches Schema ============

export const deadTwigsBranchesSchema = z.object({
  present: z.boolean(),
  percentOverall: percentageSchema,
  maxDia: z.string(),
})

export const brokenHangersSchema = z.object({
  present: z.boolean(),
  number: z.number().int().nonnegative().nullable(),
  maxDia: z.string(),
})

export const pruningHistorySchema = z.object({
  crownCleaned: z.boolean(),
  thinned: z.boolean(),
  raised: z.boolean(),
  reduced: z.boolean(),
  topped: z.boolean(),
  lionTailed: z.boolean(),
  flushCuts: z.boolean(),
  other: z.string(),
})

export const presentWithDescribeSchema = z.object({
  present: z.boolean(),
  describe: z.string(),
})

export const cavityNestHoleSchema = z.object({
  present: z.boolean(),
  percentCirc: percentageSchema,
})

export const branchFailureAssessmentSchema = z.object({
  id: z.string().uuid(),
  partSize: z.string(),
  fallDistance: z.string(),
  loadOnDefect: loadOnDefectSchema.nullable(),
  likelihoodOfFailure: likelihoodOfFailureSchema.nullable(),
})

export const crownAndBranchesSchema = z.object({
  unbalancedCrown: z.boolean(),
  lcrPercent: percentageSchema,
  deadTwigsBranches: deadTwigsBranchesSchema,
  brokenHangers: brokenHangersSchema,
  overExtendedBranches: z.boolean(),
  pruningHistory: pruningHistorySchema,
  cracks: presentWithDescribeSchema,
  lightningDamage: z.boolean(),
  codominant: presentWithDescribeSchema,
  includedBark: z.boolean(),
  weakAttachments: presentWithDescribeSchema,
  cavityNestHole: cavityNestHoleSchema,
  previousBranchFailures: presentWithDescribeSchema,
  similarBranchesPresent: z.boolean(),
  deadMissingBark: z.boolean(),
  cankersGallsBurls: z.boolean(),
  sapwoodDamageDecay: z.boolean(),
  conks: z.boolean(),
  heartwoodDecay: presentWithDescribeSchema,
  responseGrowth: z.string(),
  conditionsOfConcern: z.string(),
  failureAssessments: z.array(branchFailureAssessmentSchema),
})

// ============ Trunk Defects Schema ============

export const trunkCavitySchema = z.object({
  present: z.boolean(),
  percentCirc: percentageSchema,
  depth: z.string(),
})

export const trunkLeanSchema = z.object({
  present: z.boolean(),
  degrees: z.number().min(0).max(90).nullable(),
  corrected: z.string(),
})

export const trunkDefectsSchema = z.object({
  deadMissingBark: z.boolean(),
  abnormalBarkTextureColor: z.boolean(),
  codominantStems: z.boolean(),
  includedBark: z.boolean(),
  cracks: z.boolean(),
  sapwoodDamageDecay: z.boolean(),
  cankersGallsBurls: z.boolean(),
  sapOoze: z.boolean(),
  lightningDamage: z.boolean(),
  heartwoodDecay: z.boolean(),
  conksMushrooms: z.boolean(),
  cavityNestHole: trunkCavitySchema,
  poorTaper: z.boolean(),
  lean: trunkLeanSchema,
  responseGrowth: z.string(),
  conditionsOfConcern: z.string(),
  partSize: z.string(),
  fallDistance: z.string(),
  loadOnDefect: loadOnDefectSchema.nullable(),
  likelihoodOfFailure: likelihoodOfFailureSchema.nullable(),
})

// ============ Roots and Root Collar Schema ============

export const rootCavitySchema = z.object({
  present: z.boolean(),
  percentCirc: percentageSchema,
})

export const cutDamagedRootsSchema = z.object({
  present: z.boolean(),
  distanceFromTrunk: z.string(),
})

export const rootsAndRootCollarSchema = z.object({
  collarBuriedNotVisible: z.boolean(),
  depth: z.string(),
  stemGirdling: z.boolean(),
  dead: z.boolean(),
  decay: z.boolean(),
  conksMushrooms: z.boolean(),
  ooze: z.boolean(),
  cavity: rootCavitySchema,
  cracks: z.boolean(),
  cutDamagedRoots: cutDamagedRootsSchema,
  rootPlateLifting: z.boolean(),
  soilWeakness: z.boolean(),
  responseGrowth: z.string(),
  conditionsOfConcern: z.string(),
  partSize: z.string(),
  fallDistance: z.string(),
  loadOnDefect: loadOnDefectSchema.nullable(),
  likelihoodOfFailure: likelihoodOfFailureSchema.nullable(),
})

// ============ Risk Categorization Row Schema ============

export const riskCategorizationRowSchema = z.object({
  id: z.string().uuid(),
  target: z.string(),
  treePart: treePartSchema.nullable(),
  conditionsOfConcern: z.string(),
  likelihoodOfFailure: likelihoodOfFailureSchema.nullable(),
  likelihoodOfImpact: likelihoodOfImpactSchema.nullable(),
  failureAndImpact: failureAndImpactSchema.nullable(),
  consequences: consequencesSchema.nullable(),
  riskRating: riskRatingSchema.nullable(),
})

// ============ Mitigation Option Schema ============

export const mitigationOptionSchema = z.object({
  id: z.string().uuid(),
  optionNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  description: z.string(),
  residualRisk: residualRiskRatingSchema.nullable(),
})

// ============ Inspection Limitations Schema ============

export const inspectionLimitationsSchema = z.object({
  none: z.boolean(),
  visibility: z.boolean(),
  access: z.boolean(),
  vines: z.boolean(),
  rootCollarBuried: z.boolean(),
  describe: z.string(),
})

// ============ Full Assessment Schema ============

export const assessmentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['draft', 'complete']),
  header: headerInfoSchema,
  targets: z.array(targetAssessmentSchema).max(4),
  siteFactors: siteFactorsSchema,
  treeHealth: treeHealthProfileSchema,
  loadFactors: loadFactorsSchema,
  crownAndBranches: crownAndBranchesSchema,
  trunk: trunkDefectsSchema,
  rootsAndRootCollar: rootsAndRootCollarSchema,
  riskRows: z.array(riskCategorizationRowSchema),
  notes: z.string(),
  mitigationOptions: z.array(mitigationOptionSchema).max(4),
  overallTreeRiskRating: riskRatingSchema.nullable(),
  overallResidualRisk: residualRiskRatingSchema.nullable(),
  recommendedInspectionInterval: z.string(),
  dataStatus: z.enum(['final', 'preliminary']),
  advancedAssessmentNeeded: z.boolean(),
  advancedAssessmentTypeReason: z.string(),
  inspectionLimitations: inspectionLimitationsSchema,
  mediaIds: z.array(z.string().uuid()),
})

// ============ Type Exports ============

export type ValidatedAssessment = z.infer<typeof assessmentSchema>
export type ValidatedHeaderInfo = z.infer<typeof headerInfoSchema>
export type ValidatedTargetAssessment = z.infer<typeof targetAssessmentSchema>
export type ValidatedSiteFactors = z.infer<typeof siteFactorsSchema>
export type ValidatedTreeHealthProfile = z.infer<typeof treeHealthProfileSchema>
export type ValidatedLoadFactors = z.infer<typeof loadFactorsSchema>
export type ValidatedCrownAndBranches = z.infer<typeof crownAndBranchesSchema>
export type ValidatedTrunkDefects = z.infer<typeof trunkDefectsSchema>
export type ValidatedRootsAndRootCollar = z.infer<typeof rootsAndRootCollarSchema>
export type ValidatedRiskCategorizationRow = z.infer<typeof riskCategorizationRowSchema>
export type ValidatedMitigationOption = z.infer<typeof mitigationOptionSchema>

// ============ Validation Helper Functions ============

/**
 * Validate a full assessment object
 */
export function validateAssessment(data: unknown): {
  success: boolean
  data?: ValidatedAssessment
  errors?: z.ZodError
} {
  const result = assessmentSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Validate header info
 */
export function validateHeaderInfo(data: unknown): {
  success: boolean
  data?: ValidatedHeaderInfo
  errors?: z.ZodError
} {
  const result = headerInfoSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Get formatted validation error messages
 */
export function getValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((e) => {
    const path = e.path.join('.')
    return path ? `${path}: ${e.message}` : e.message
  })
}

/**
 * Validate a percentage value (0-100)
 */
export function isValidPercentage(value: number | null): boolean {
  if (value === null) return true
  return value >= 0 && value <= 100
}

/**
 * Validate that foliage percentages sum to 100 or less
 */
export function validateFoliagePercentages(
  normal: number | null,
  chlorotic: number | null,
  necrotic: number | null
): boolean {
  const total = (normal ?? 0) + (chlorotic ?? 0) + (necrotic ?? 0)
  return total <= 100
}

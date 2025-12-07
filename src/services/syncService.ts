/**
 * Sync Service
 * =============================================================================
 * Manages synchronization between IndexedDB (Dexie) and Supabase
 * Handles offline queue, conflict detection, and real-time updates
 */

import { db } from '@/lib/db'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Assessment, MediaAttachment } from '@/types/traq'
import type {
  Assessment as DbAssessment,
  AssessmentTarget,
  AssessmentRiskRow,
  AssessmentMitigation,
} from '@/types/supabase'

// =============================================================================
// TYPES
// =============================================================================

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline'
export type SyncOperation = 'create' | 'update' | 'delete'

export interface SyncQueueItem {
  id: string
  operation: SyncOperation
  entityType: 'assessment' | 'media'
  entityId: string
  entityData?: Assessment | MediaAttachment
  createdAt: Date
  retryCount: number
  error?: string
}

export interface SyncState {
  status: SyncStatus
  lastSyncedAt: Date | null
  pendingCount: number
  error: string | null
  isOnline: boolean
}

export interface ConflictInfo {
  localVersion: Assessment
  remoteVersion: Partial<DbAssessment>
  lastLocalUpdate: Date
  lastRemoteUpdate: Date
}

// =============================================================================
// LOCAL SYNC QUEUE (stored in localStorage for simplicity)
// =============================================================================

const SYNC_QUEUE_KEY = 'traq-sync-queue'
const LAST_SYNC_KEY = 'traq-last-sync'

function getSyncQueue(): SyncQueueItem[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(SYNC_QUEUE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data, (key, value) => {
      if (key === 'createdAt') return new Date(value)
      return value
    })
  } catch {
    return []
  }
}

function saveSyncQueue(queue: SyncQueueItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
}

function addToQueue(item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retryCount'>): void {
  const queue = getSyncQueue()

  // Check if there's already an operation for this entity
  const existingIndex = queue.findIndex(
    q => q.entityType === item.entityType && q.entityId === item.entityId
  )

  const newItem: SyncQueueItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    retryCount: 0,
  }

  if (existingIndex >= 0) {
    // Merge operations intelligently
    const existing = queue[existingIndex]
    if (existing.operation === 'create' && item.operation === 'update') {
      // Keep as create with updated data
      queue[existingIndex] = { ...existing, entityData: item.entityData }
    } else if (existing.operation === 'create' && item.operation === 'delete') {
      // Remove from queue entirely (never synced)
      queue.splice(existingIndex, 1)
    } else if (item.operation === 'delete') {
      // Replace with delete
      queue[existingIndex] = newItem
    } else {
      // Replace with new operation
      queue[existingIndex] = newItem
    }
  } else {
    queue.push(newItem)
  }

  saveSyncQueue(queue)
}

function removeFromQueue(itemId: string): void {
  const queue = getSyncQueue().filter(q => q.id !== itemId)
  saveSyncQueue(queue)
}

function updateQueueItem(itemId: string, updates: Partial<SyncQueueItem>): void {
  const queue = getSyncQueue().map(q =>
    q.id === itemId ? { ...q, ...updates } : q
  )
  saveSyncQueue(queue)
}

// =============================================================================
// DATA TRANSFORMERS
// =============================================================================

/**
 * Convert local Assessment to Supabase format (flattened)
 */
export function localToCloud(
  local: Assessment,
  userId: string,
  teamId: string | null
): {
  assessment: Partial<DbAssessment>
  targets: Partial<AssessmentTarget>[]
  riskRows: Partial<AssessmentRiskRow>[]
  mitigations: Partial<AssessmentMitigation>[]
} {
  const assessment: Partial<DbAssessment> = {
    id: local.id,
    user_id: userId,
    team_id: teamId,
    status: local.status,
    data_status: local.dataStatus,

    // GPS
    gps_latitude: local.gpsLocation?.latitude ?? null,
    gps_longitude: local.gpsLocation?.longitude ?? null,
    gps_address: local.gpsLocation?.address ?? null,
    gps_accuracy: local.gpsLocation?.accuracy ?? null,
    gps_timestamp: local.gpsLocation?.timestamp?.toISOString() ?? null,

    // Header
    header_client: local.header.client,
    header_date: local.header.date,
    header_time: local.header.time || null,
    header_address: local.header.addressTreeLocation,
    header_tree_no: local.header.treeNo || null,
    header_sheet_number: local.header.sheetNumber,
    header_sheet_total: local.header.sheetTotal,
    header_tree_species: local.header.treeSpecies || null,
    header_dbh: local.header.dbh || null,
    header_height: local.header.height || null,
    header_crown_spread: local.header.crownSpreadDia || null,
    header_assessors: local.header.assessors,
    header_tools_used: local.header.toolsUsed || null,
    header_time_frame: local.header.timeFrame,

    // Site Factors
    site_history_of_failures: local.siteFactors.historyOfFailures || null,
    site_topography_flat: local.siteFactors.topography.flat,
    site_topography_slope_percent: local.siteFactors.topography.slopePercent,
    site_topography_aspect: local.siteFactors.topography.aspect || null,
    site_changes_none: local.siteFactors.siteChanges.none,
    site_changes_grade_change: local.siteFactors.siteChanges.gradeChange,
    site_changes_clearing: local.siteFactors.siteChanges.siteClearing,
    site_changes_soil_hydrology: local.siteFactors.siteChanges.changedSoilHydrology,
    site_changes_root_cuts: local.siteFactors.siteChanges.rootCuts,
    site_changes_describe: local.siteFactors.siteChanges.describe || null,
    site_soil_limited_volume: local.siteFactors.soilConditions.limitedVolume,
    site_soil_saturated: local.siteFactors.soilConditions.saturated,
    site_soil_shallow: local.siteFactors.soilConditions.shallow,
    site_soil_compacted: local.siteFactors.soilConditions.compacted,
    site_soil_pavement_percent: local.siteFactors.soilConditions.pavementOverRootsPercent,
    site_soil_describe: local.siteFactors.soilConditions.describe || null,
    site_prevailing_wind: local.siteFactors.prevailingWindDirection || null,
    site_weather_strong_winds: local.siteFactors.commonWeather.strongWinds,
    site_weather_ice: local.siteFactors.commonWeather.ice,
    site_weather_snow: local.siteFactors.commonWeather.snow,
    site_weather_heavy_rain: local.siteFactors.commonWeather.heavyRain,
    site_weather_describe: local.siteFactors.commonWeather.describe || null,

    // Health
    health_vigor: local.treeHealth.vigor,
    health_foliage_none_seasonal: local.treeHealth.foliage.noneSeasonal,
    health_foliage_none_dead: local.treeHealth.foliage.noneDead,
    health_foliage_normal_percent: local.treeHealth.foliage.normalPercent,
    health_foliage_chlorotic_percent: local.treeHealth.foliage.chloroticPercent,
    health_foliage_necrotic_percent: local.treeHealth.foliage.necroticPercent,
    health_pests_biotic: local.treeHealth.pestsBiotic || null,
    health_abiotic: local.treeHealth.abiotic || null,
    health_species_failure_branches: local.treeHealth.speciesFailureProfile.branches,
    health_species_failure_trunk: local.treeHealth.speciesFailureProfile.trunk,
    health_species_failure_roots: local.treeHealth.speciesFailureProfile.roots,
    health_species_failure_describe: local.treeHealth.speciesFailureProfile.describe || null,

    // Load
    load_wind_exposure: local.loadFactors.windExposure,
    load_wind_funneling: local.loadFactors.windFunneling || null,
    load_relative_crown_size: local.loadFactors.relativeCrownSize,
    load_crown_density: local.loadFactors.crownDensity,
    load_interior_branches: local.loadFactors.interiorBranches,
    load_vines_mistletoe_moss: local.loadFactors.vinesMistletoeMoss || null,
    load_recent_change: local.loadFactors.recentOrExpectedChangeInLoadFactors || null,

    // Crown/Branches (selected fields)
    crown_unbalanced: local.crownAndBranches.unbalancedCrown,
    crown_lcr_percent: local.crownAndBranches.lcrPercent,

    // Trunk (selected fields)
    trunk_dead_missing_bark: local.trunk.deadMissingBark,

    // Roots (selected fields)
    roots_collar_buried: local.rootsAndRootCollar.collarBuriedNotVisible,

    // Overall
    overall_tree_risk_rating: local.overallTreeRiskRating,
    overall_residual_risk: local.overallResidualRisk,
    recommended_inspection_interval: local.recommendedInspectionInterval || null,
    advanced_assessment_needed: local.advancedAssessmentNeeded,
    advanced_assessment_reason: local.advancedAssessmentTypeReason || null,

    // Limits
    limits_none: local.inspectionLimitations.none,
    limits_visibility: local.inspectionLimitations.visibility,
    limits_access: local.inspectionLimitations.access,
    limits_vines: local.inspectionLimitations.vines,
    limits_root_collar_buried: local.inspectionLimitations.rootCollarBuried,
    limits_describe: local.inspectionLimitations.describe || null,

    // Notes
    notes: local.notes || null,

    // Timestamps
    local_updated_at: local.updatedAt.toISOString(),
  }

  // Targets
  const targets: Partial<AssessmentTarget>[] = local.targets.map((t, i) => ({
    id: t.id,
    assessment_id: local.id,
    target_number: i + 1,
    target_description: t.targetDescription || null,
    target_protection: t.targetProtection || null,
    within_drip_line: t.targetZone.withinDripLine,
    within_1x_height: t.targetZone.within1xHt,
    within_1_5x_height: t.targetZone.within1_5xHt,
    occupancy_rate: t.occupancyRate?.toString() as '1' | '2' | '3' | '4' | null,
    practical_to_move: t.practicalToMoveTarget,
    restriction_practical: t.restrictionPractical,
  }))

  // Risk Rows
  const riskRows: Partial<AssessmentRiskRow>[] = local.riskRows.map((r, i) => ({
    id: r.id,
    assessment_id: local.id,
    target: r.target,
    tree_part: r.treePart,
    conditions_of_concern: r.conditionsOfConcern || null,
    likelihood_failure: r.likelihoodOfFailure,
    likelihood_impact: r.likelihoodOfImpact,
    failure_and_impact: r.failureAndImpact,
    consequences: r.consequences,
    risk_rating: r.riskRating,
    sort_order: i,
  }))

  // Mitigations
  const mitigations: Partial<AssessmentMitigation>[] = local.mitigationOptions.map((m, i) => ({
    id: m.id,
    assessment_id: local.id,
    option_number: i + 1,
    description: m.description || null,
    residual_risk: m.residualRisk,
  }))

  return { assessment, targets, riskRows, mitigations }
}

// =============================================================================
// SYNC OPERATIONS
// =============================================================================

/**
 * Queue an assessment for sync
 */
export function queueAssessmentSync(
  assessment: Assessment,
  operation: SyncOperation
): void {
  addToQueue({
    operation,
    entityType: 'assessment',
    entityId: assessment.id,
    entityData: operation !== 'delete' ? assessment : undefined,
  })
}

/**
 * Queue media for sync
 */
export function queueMediaSync(
  media: MediaAttachment,
  operation: SyncOperation
): void {
  addToQueue({
    operation,
    entityType: 'media',
    entityId: media.id,
    entityData: operation !== 'delete' ? media : undefined,
  })
}

/**
 * Process the sync queue
 */
export async function processQueue(
  userId: string,
  teamId: string | null,
  onProgress?: (processed: number, total: number) => void
): Promise<{ success: number; failed: number; errors: string[] }> {
  const supabase = getSupabaseClient()
  const queue = getSyncQueue()

  let success = 0
  let failed = 0
  const errors: string[] = []

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i]

    try {
      if (item.entityType === 'assessment') {
        await syncAssessment(supabase, item, userId, teamId)
      } else if (item.entityType === 'media') {
        await syncMedia(supabase, item, userId)
      }

      removeFromQueue(item.id)
      success++
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      errors.push(`${item.entityType} ${item.entityId}: ${message}`)

      // Update retry count
      updateQueueItem(item.id, {
        retryCount: item.retryCount + 1,
        error: message,
      })

      failed++
    }

    onProgress?.(i + 1, queue.length)
  }

  // Update last sync time
  if (success > 0) {
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
  }

  return { success, failed, errors }
}

async function syncAssessment(
  supabase: ReturnType<typeof getSupabaseClient>,
  item: SyncQueueItem,
  userId: string,
  teamId: string | null
): Promise<void> {
  if (item.operation === 'delete') {
    // Delete assessment (cascades to related tables)
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', item.entityId)

    if (error) throw error
    return
  }

  const assessment = item.entityData as Assessment
  const { assessment: cloudData, targets, riskRows, mitigations } = localToCloud(
    assessment, userId, teamId
  )

  if (item.operation === 'create') {
    // Insert assessment
    const { error: assessmentError } = await supabase
      .from('assessments')
      .insert(cloudData as never)

    if (assessmentError) throw assessmentError

    // Insert targets
    if (targets.length > 0) {
      const { error: targetsError } = await supabase
        .from('assessment_targets')
        .insert(targets as never[])

      if (targetsError) throw targetsError
    }

    // Insert risk rows
    if (riskRows.length > 0) {
      const { error: riskError } = await supabase
        .from('assessment_risk_rows')
        .insert(riskRows as never[])

      if (riskError) throw riskError
    }

    // Insert mitigations
    if (mitigations.length > 0) {
      const { error: mitigationError } = await supabase
        .from('assessment_mitigations')
        .insert(mitigations as never[])

      if (mitigationError) throw mitigationError
    }
  } else {
    // Update - delete related and re-insert
    const { error: assessmentError } = await supabase
      .from('assessments')
      .update(cloudData as never)
      .eq('id', item.entityId)

    if (assessmentError) throw assessmentError

    // Delete and re-insert related data
    await supabase.from('assessment_targets').delete().eq('assessment_id', item.entityId)
    await supabase.from('assessment_risk_rows').delete().eq('assessment_id', item.entityId)
    await supabase.from('assessment_mitigations').delete().eq('assessment_id', item.entityId)

    if (targets.length > 0) {
      await supabase.from('assessment_targets').insert(targets as never[])
    }
    if (riskRows.length > 0) {
      await supabase.from('assessment_risk_rows').insert(riskRows as never[])
    }
    if (mitigations.length > 0) {
      await supabase.from('assessment_mitigations').insert(mitigations as never[])
    }
  }

  // Update synced_at on the assessment
  await supabase
    .from('assessments')
    .update({ synced_at: new Date().toISOString() } as never)
    .eq('id', item.entityId)
}

async function syncMedia(
  supabase: ReturnType<typeof getSupabaseClient>,
  item: SyncQueueItem,
  userId: string
): Promise<void> {
  if (item.operation === 'delete') {
    // Get storage path first
    const { data: existing } = await supabase
      .from('media_attachments')
      .select('storage_path')
      .eq('id', item.entityId)
      .single()

    const mediaData = existing as { storage_path: string } | null
    if (mediaData) {
      // Delete from storage
      await supabase.storage
        .from('assessments')
        .remove([mediaData.storage_path])
    }

    // Delete record
    await supabase
      .from('media_attachments')
      .delete()
      .eq('id', item.entityId)

    return
  }

  const media = item.entityData as MediaAttachment
  const storagePath = `${userId}/${media.assessmentId}/${media.id}-${media.filename}`

  // Upload blob to storage
  const { error: uploadError } = await supabase.storage
    .from('assessments')
    .upload(storagePath, media.blob, {
      contentType: media.mimeType,
      upsert: true,
    })

  if (uploadError) throw uploadError

  // Insert/update record
  const record = {
    id: media.id,
    user_id: userId,
    assessment_id: media.assessmentId,
    type: media.type,
    filename: media.filename,
    mime_type: media.mimeType,
    storage_path: storagePath,
    caption: media.caption || null,
    file_size_bytes: media.blob.size,
    gps_latitude: media.location?.latitude ?? null,
    gps_longitude: media.location?.longitude ?? null,
  }

  if (item.operation === 'create') {
    const { error } = await supabase
      .from('media_attachments')
      .insert(record as never)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('media_attachments')
      .update(record as never)
      .eq('id', media.id)
    if (error) throw error
  }
}

// =============================================================================
// SYNC STATE
// =============================================================================

export function getSyncState(): SyncState {
  const queue = getSyncQueue()
  const lastSynced = localStorage.getItem(LAST_SYNC_KEY)

  return {
    status: 'idle',
    lastSyncedAt: lastSynced ? new Date(lastSynced) : null,
    pendingCount: queue.length,
    error: null,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  }
}

/**
 * Pull remote assessments and merge with local
 */
export async function pullFromCloud(
  userId: string,
  teamId: string | null
): Promise<{ added: number; updated: number; errors: string[] }> {
  const supabase = getSupabaseClient()
  const errors: string[] = []
  let added = 0
  let updated = 0

  try {
    // Fetch all assessments user has access to
    let query = supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)

    if (teamId) {
      // Also get team assessments
      query = supabase
        .from('assessments')
        .select('*')
        .or(`user_id.eq.${userId},team_id.eq.${teamId}`)
    }

    const { data: cloudAssessments, error } = await query

    if (error) throw error

    // Type the cloud assessments
    const assessments = cloudAssessments as { id: string; updated_at: string }[] | null

    // For each cloud assessment, check if local exists and compare timestamps
    for (const cloudAssessment of (assessments || [])) {
      try {
        const localAssessment = await db.assessments.get(cloudAssessment.id)

        if (!localAssessment) {
          // New from cloud - would need to convert and add locally
          // This is complex as we need to fetch related data too
          added++
        } else {
          // Compare timestamps for conflict detection
          const cloudUpdated = new Date(cloudAssessment.updated_at)
          const localUpdated = localAssessment.updatedAt

          if (cloudUpdated > localUpdated) {
            // Cloud is newer - would update local
            updated++
          }
        }
      } catch (err) {
        errors.push(`Assessment ${cloudAssessment.id}: ${err}`)
      }
    }
  } catch (err) {
    errors.push(`Pull failed: ${err}`)
  }

  return { added, updated, errors }
}

/**
 * Full sync - push local changes then pull remote
 */
export async function fullSync(
  userId: string,
  teamId: string | null,
  onProgress?: (status: string) => void
): Promise<{
  pushed: { success: number; failed: number }
  pulled: { added: number; updated: number }
  errors: string[]
}> {
  const allErrors: string[] = []

  // Push local changes
  onProgress?.('Pushing local changes...')
  const pushResult = await processQueue(userId, teamId)
  allErrors.push(...pushResult.errors)

  // Pull remote changes
  onProgress?.('Pulling remote changes...')
  const pullResult = await pullFromCloud(userId, teamId)
  allErrors.push(...pullResult.errors)

  onProgress?.('Sync complete')

  return {
    pushed: { success: pushResult.success, failed: pushResult.failed },
    pulled: { added: pullResult.added, updated: pullResult.updated },
    errors: allErrors,
  }
}

/**
 * Mirror Service (TRAQ-BRIDGE-004)
 * =============================================================================
 * The TRAQ side of the mirror-on-sync bridge: after an assessment
 * syncs to TRAQ's own cloud, POST it to the CanopyGIS `traq-mirror`
 * edge function so it appears as a risk-attributed point on the
 * user's CanopyGIS map.
 *
 * Best-effort by design: a mirror failure is recorded on the
 * assessment (`assessment.mirror`) and NEVER fails or blocks the
 * primary TRAQ cloud sync. Retries ride the existing sync queue —
 * every subsequent sync re-runs the mirror, and replays are
 * idempotent server-side (one feature per assessment, keyed by
 * traq_links.traq_assessment_id).
 *
 * Auth: the caller's own TRAQ session token. The mirror function
 * verifies it against TRAQ's Supabase project and bridges identity
 * by the VERIFIED email — nothing client-claimed is trusted.
 */

import { db } from '@/lib/db'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Assessment, MirrorStatus } from '@/types/traq'

export type { MirrorState, MirrorStatus } from '@/types/traq'

export const TRAQ_MIRROR_URL =
  process.env.NEXT_PUBLIC_CANOPY_MIRROR_URL ||
  'https://hwunoknghoygddzzysxi.supabase.co/functions/v1/traq-mirror'

export interface MirrorPayload {
  assessmentId: string
  client?: string
  dateOfAssessment?: string
  species?: string
  treeNumber?: string
  overallRiskRating?: string
  residualRisk?: string
  assessor?: string
  notes?: string
  address?: string
  gps?: { lat: number; lng: number; accuracy?: number }
}

function nonEmpty(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/**
 * Map the TRAQ form to the traq-mirror payload contract
 * (supabase/functions/_shared/traq-field-map.ts in the CanopyGIS
 * repo). Pure — carries only real data, empty strings omitted.
 */
export function buildMirrorPayload(assessment: Assessment): MirrorPayload {
  const payload: MirrorPayload = { assessmentId: assessment.id }

  const client = nonEmpty(assessment.header?.client)
  if (client) payload.client = client
  const date = nonEmpty(assessment.header?.date)
  if (date) payload.dateOfAssessment = date
  const species = nonEmpty(assessment.header?.treeSpecies)
  if (species) payload.species = species
  const treeNumber = nonEmpty(assessment.header?.treeNo)
  if (treeNumber) payload.treeNumber = treeNumber
  if (assessment.overallTreeRiskRating) {
    payload.overallRiskRating = assessment.overallTreeRiskRating
  }
  // 'none' is not a map risk class — the server drops non-mappable
  // values per-field, so passing it through is safe, but omitting is
  // cleaner.
  if (assessment.overallResidualRisk && assessment.overallResidualRisk !== 'none') {
    payload.residualRisk = assessment.overallResidualRisk
  }
  const assessor = nonEmpty(assessment.header?.assessors)
  if (assessor) payload.assessor = assessor
  const notes = nonEmpty(assessment.notes)
  if (notes) payload.notes = notes

  const gps = assessment.gpsLocation
  if (gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)) {
    payload.gps = { lat: gps.latitude, lng: gps.longitude }
    if (typeof gps.accuracy === 'number' && Number.isFinite(gps.accuracy)) {
      payload.gps.accuracy = gps.accuracy
    }
  }
  // Address lets the server geocode when GPS is absent.
  const address = nonEmpty(gps?.address) ?? nonEmpty(assessment.header?.addressTreeLocation)
  if (address) payload.address = address

  return payload
}

function statusFromResponse(status: number, body: Record<string, unknown>): MirrorStatus {
  const ts = new Date().toISOString()
  if (status === 200 && body.status === 'mirrored') {
    return {
      state: 'mirrored',
      featureId: typeof body.feature_id === 'string' ? body.feature_id : undefined,
      geoSource: typeof body.geo_source === 'string' ? body.geo_source : undefined,
      ts,
    }
  }
  if (status === 200 && body.status === 'needs_location') {
    return { state: 'needs_location', ts }
  }
  if (status === 401) return { state: 'unauthorized', ts }
  if (status === 403) return { state: 'not_linked', ts }
  if (status === 409) return { state: 'conflict', ts }
  if (status === 503) return { state: 'not_configured', ts }
  return {
    state: 'error',
    detail: typeof body.error === 'string' ? body.error : `HTTP ${status}`,
    ts,
  }
}

async function persistStatus(assessmentId: string, mirror: MirrorStatus): Promise<MirrorStatus> {
  try {
    // Non-indexed Dexie property — no schema bump; a targeted update
    // that cannot re-trigger the sync queue.
    await db.assessments.update(assessmentId, { mirror })
  } catch {
    // Recording the status is itself best-effort.
  }
  return mirror
}

/**
 * Mirror one assessment to CanopyGIS. Never throws — every outcome
 * (including network failure) becomes an explicit persisted status.
 */
export async function mirrorAssessment(assessment: Assessment): Promise<MirrorStatus> {
  const ts = new Date().toISOString()
  try {
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getSession()
    const token = data?.session?.access_token
    if (!token) {
      return persistStatus(assessment.id, {
        state: 'error',
        detail: 'No TRAQ session token',
        ts,
      })
    }

    const response = await fetch(TRAQ_MIRROR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(buildMirrorPayload(assessment)),
    })
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    return persistStatus(assessment.id, statusFromResponse(response.status, body))
  } catch (error) {
    return persistStatus(assessment.id, {
      state: 'error',
      detail: error instanceof Error ? error.message : 'Mirror request failed',
      ts,
    })
  }
}

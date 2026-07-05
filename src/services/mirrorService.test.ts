/**
 * TRAQ-BRIDGE-004 — mirror-on-sync client (behavioral).
 *
 * Contracts: payload maps the TRAQ form to the traq-mirror contract
 * (gps latitude/longitude → lat/lng, address fallback chain, empty
 * strings omitted); no session token → recorded error, fetch never
 * called; every function response maps to an explicit persisted
 * MirrorStatus; network failure never throws; the sync hook is
 * fail-open — a rejecting mirror cannot fail processQueue.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUpdate = vi.fn(async () => 1);
vi.mock('@/lib/db', () => ({
  db: { assessments: { update: (...args: unknown[]) => mockUpdate(...args) } },
}));

let mockToken: string | null = 'traq-session-token';
vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => ({
    auth: {
      getSession: async () => ({
        data: { session: mockToken ? { access_token: mockToken } : null },
      }),
    },
    // processQueue's chainable surface (used by the sync-isolation test)
    from: () => ({
      upsert: async () => ({ error: null }),
      insert: async () => ({ error: null }),
      delete: () => ({ eq: async () => ({ error: null }) }),
      update: () => ({ eq: async () => ({ error: null }) }),
    }),
  }),
}));

import {
  buildMirrorPayload,
  mirrorAssessment,
  TRAQ_MIRROR_URL,
} from './mirrorService';
import { createEmptyAssessment } from '@/hooks/useAssessment';
import type { Assessment } from '@/types/traq';

function mockFetchResponse(status: number, body: unknown) {
  return vi.fn(async () => ({
    status,
    json: async () => body,
  })) as unknown as typeof fetch;
}

function fullAssessment(): Assessment {
  const a = createEmptyAssessment();
  a.id = 'traq-abc';
  a.header.client = 'City of Reno';
  a.header.date = '2026-07-05';
  a.header.treeSpecies = 'Quercus rubra';
  a.header.treeNo = '117';
  a.header.assessors = 'J. Doe';
  a.header.addressTreeLocation = '123 Main St, Reno NV';
  a.overallTreeRiskRating = 'high';
  a.overallResidualRisk = 'low';
  a.notes = 'Deadwood over path';
  a.gpsLocation = {
    latitude: 39.52,
    longitude: -119.81,
    address: '456 GPS Ave',
    accuracy: 4.2,
    timestamp: new Date('2026-07-05T12:00:00Z'),
  };
  return a;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockToken = 'traq-session-token';
});

describe('buildMirrorPayload', () => {
  it('maps the full form to the traq-mirror contract', () => {
    const payload = buildMirrorPayload(fullAssessment());
    expect(payload).toEqual({
      assessmentId: 'traq-abc',
      client: 'City of Reno',
      dateOfAssessment: '2026-07-05',
      species: 'Quercus rubra',
      treeNumber: '117',
      overallRiskRating: 'high',
      residualRisk: 'low',
      assessor: 'J. Doe',
      notes: 'Deadwood over path',
      address: '456 GPS Ave',
      gps: { lat: 39.52, lng: -119.81, accuracy: 4.2 },
    });
  });

  it('omits empty strings and falls back to the header address without GPS', () => {
    const a = createEmptyAssessment();
    a.id = 'sparse-1';
    a.header.addressTreeLocation = '789 Fallback Rd';
    a.overallResidualRisk = 'none'; // not a map risk class — omitted
    const payload = buildMirrorPayload(a);
    expect(payload.assessmentId).toBe('sparse-1');
    expect(payload.gps).toBeUndefined();
    expect(payload.address).toBe('789 Fallback Rd');
    expect(payload.residualRisk).toBeUndefined();
    expect(payload.client).toBeUndefined();
    expect(payload.species).toBeUndefined();
  });
});

describe('mirrorAssessment — response mapping + persistence', () => {
  it('no session token → error status, fetch never called', async () => {
    mockToken = null;
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const status = await mirrorAssessment(fullAssessment());
    expect(status.state).toBe('error');
    expect(status.detail).toContain('token');
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith('traq-abc', { mirror: status });
  });

  it('200 mirrored → featureId + geoSource persisted; token + URL used', async () => {
    const fetchSpy = mockFetchResponse(200, {
      status: 'mirrored',
      feature_id: 'feat-9',
      geo_source: 'gps',
    });
    vi.stubGlobal('fetch', fetchSpy);

    const status = await mirrorAssessment(fullAssessment());
    expect(status).toMatchObject({ state: 'mirrored', featureId: 'feat-9', geoSource: 'gps' });
    expect(typeof status.ts).toBe('string');

    const [url, init] = (fetchSpy as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe(TRAQ_MIRROR_URL);
    expect(init.headers.Authorization).toBe('Bearer traq-session-token');
    expect(JSON.parse(init.body).assessmentId).toBe('traq-abc');
    expect(mockUpdate).toHaveBeenCalledWith('traq-abc', { mirror: status });
  });

  it('maps needs_location / 403 / 503 / 409 to explicit states', async () => {
    const cases: Array<[number, unknown, string]> = [
      [200, { status: 'needs_location' }, 'needs_location'],
      [403, { error: 'not_linked' }, 'not_linked'],
      [503, { error: 'not_configured' }, 'not_configured'],
      [409, { error: 'link_conflict' }, 'conflict'],
      [401, { error: 'unauthorized' }, 'unauthorized'],
    ];
    for (const [httpStatus, body, expected] of cases) {
      vi.stubGlobal('fetch', mockFetchResponse(httpStatus, body));
      const status = await mirrorAssessment(fullAssessment());
      expect(status.state).toBe(expected);
    }
  });

  it('network failure → error status, never a throw', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      })
    );
    const status = await mirrorAssessment(fullAssessment());
    expect(status.state).toBe('error');
    expect(status.detail).toBe('offline');
  });
});

describe('sync isolation — the mirror can never fail the primary sync', () => {
  it('processQueue reports success even when the mirror request throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('mirror down');
      })
    );
    localStorage.clear();
    const { processQueue, queueAssessmentSync } = await import('./syncService');
    queueAssessmentSync(fullAssessment(), 'create');
    const result = await processQueue('44444444-4444-4444-8444-444444444444', null);
    expect(result.success).toBe(1);
    expect(result.failed).toBe(0);
  });
});

/**
 * TRAQ-BRIDGE-001 — sync write-path idempotency (behavioral).
 *
 * The assessment write path must be replay-safe: the parent row is
 * upsert(onConflict:'id') — never a bare insert — so a retried partial
 * create converges instead of dying on duplicate-key, and an update
 * that arrives before its create materializes the row instead of
 * silently updating 0 rows. Children are delete-then-reinsert with
 * errors checked. Failures keep the queue item (retryCount++), never
 * silently drop it.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Chainable Supabase mock that records every call ─────────────────────────

type RecordedCall = { table: string; method: string; args: unknown[] };

const calls: RecordedCall[] = [];
let upsertError: { message: string } | null = null;

function makeClient() {
  return {
    from: (table: string) => ({
      upsert: (data: unknown, opts: unknown) => {
        calls.push({ table, method: 'upsert', args: [data, opts] });
        return Promise.resolve({ error: table === 'assessments' ? upsertError : null });
      },
      insert: (data: unknown) => {
        calls.push({ table, method: 'insert', args: [data] });
        return Promise.resolve({ error: null });
      },
      delete: () => ({
        eq: (col: string, val: unknown) => {
          calls.push({ table, method: 'delete', args: [col, val] });
          return Promise.resolve({ error: null });
        },
      }),
      update: (data: unknown) => ({
        eq: (col: string, val: unknown) => {
          calls.push({ table, method: 'update', args: [data, col, val] });
          return Promise.resolve({ error: null });
        },
      }),
    }),
  };
}

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => makeClient(),
}));

import { processQueue, queueAssessmentSync, getSyncQueue } from './syncService';
import { createEmptyAssessment } from '@/hooks/useAssessment';

const USER_ID = '44444444-4444-4444-8444-444444444444';

function freshAssessment() {
  const a = createEmptyAssessment();
  a.header.client = 'Sync Test Client';
  return a;
}

beforeEach(() => {
  localStorage.clear();
  calls.length = 0;
  upsertError = null;
});

describe('assessment write path is idempotent (upsert, never bare insert)', () => {
  it("parent row is written via upsert with onConflict:'id' on create", async () => {
    queueAssessmentSync(freshAssessment(), 'create');
    const result = await processQueue(USER_ID, null);

    expect(result.errors).toEqual([]);
    expect(result.success).toBe(1);
    const parentWrites = calls.filter((c) => c.table === 'assessments' && c.method === 'upsert');
    expect(parentWrites).toHaveLength(1);
    expect(parentWrites[0].args[1]).toEqual({ onConflict: 'id' });
    // No bare insert on the parent table — the 23505-on-retry class.
    expect(calls.some((c) => c.table === 'assessments' && c.method === 'insert')).toBe(false);
  });

  it('update operations also upsert (update-before-create materializes the row)', async () => {
    queueAssessmentSync(freshAssessment(), 'update');
    const result = await processQueue(USER_ID, null);

    expect(result.success).toBe(1);
    expect(calls.some((c) => c.table === 'assessments' && c.method === 'upsert')).toBe(true);
  });

  it('children are delete-then-reinserted per table', async () => {
    // createEmptyAssessment seeds 1 target, 1 risk row, 1 mitigation.
    queueAssessmentSync(freshAssessment(), 'create');
    await processQueue(USER_ID, null);

    for (const table of ['assessment_targets', 'assessment_risk_rows', 'assessment_mitigations']) {
      const tableCalls = calls.filter((c) => c.table === table).map((c) => c.method);
      expect(tableCalls[0]).toBe('delete');
      expect(tableCalls).toContain('insert');
    }
  });

  it('replaying the same assessment converges (no duplicate-key path, queue drains both times)', async () => {
    const assessment = freshAssessment();

    queueAssessmentSync(assessment, 'create');
    const first = await processQueue(USER_ID, null);
    expect(first.success).toBe(1);
    expect(getSyncQueue()).toHaveLength(0);

    const firstCalls = calls.map((c) => `${c.table}:${c.method}`);
    calls.length = 0;

    // Same assessment queued again (simulates a retry/merge replay).
    queueAssessmentSync(assessment, 'create');
    const second = await processQueue(USER_ID, null);
    expect(second.success).toBe(1);
    expect(getSyncQueue()).toHaveLength(0);

    // Identical call shape — the write path converges.
    expect(calls.map((c) => `${c.table}:${c.method}`)).toEqual(firstCalls);
  });
});

describe('failures are never silently dropped', () => {
  it('a failing parent upsert keeps the item with retryCount incremented', async () => {
    upsertError = { message: 'connection reset' };
    queueAssessmentSync(freshAssessment(), 'create');

    const result = await processQueue(USER_ID, null);

    expect(result.failed).toBe(1);
    expect(result.errors).toHaveLength(1);
    const queue = getSyncQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].retryCount).toBe(1);
    // Children were never touched after the parent failed.
    expect(calls.some((c) => c.table !== 'assessments')).toBe(false);
  });

  it('N queued assessments produce N successes', async () => {
    queueAssessmentSync(freshAssessment(), 'create');
    queueAssessmentSync(freshAssessment(), 'create');
    queueAssessmentSync(freshAssessment(), 'create');
    expect(getSyncQueue()).toHaveLength(3);

    const result = await processQueue(USER_ID, null);

    expect(result.success).toBe(3);
    expect(result.failed).toBe(0);
    expect(getSyncQueue()).toHaveLength(0);
  });
});

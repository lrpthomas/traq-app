/**
 * TRAQ-BRIDGE-001 — useAssessment.save() wakes the cloud sync
 * (behavioral).
 *
 * Ordering contract: the enqueue runs only AFTER the durable
 * IndexedDB put resolves; a failed put never enqueues; a throwing
 * enqueue is surfaced (the local save already happened). First save
 * of a fresh assessment queues 'create', later saves 'update'.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const callOrder: string[] = [];

const putMock = vi.fn(async () => {
  callOrder.push('put');
  return 'ok';
});
const getMock = vi.fn(async () => undefined);

vi.mock('@/lib/db', () => ({
  db: {
    assessments: {
      put: (...args: unknown[]) => putMock(...(args as [])),
      get: (...args: unknown[]) => getMock(...(args as [])),
    },
  },
}));

const queueAssessmentMock = vi.fn(() => {
  callOrder.push('enqueue');
});

vi.mock('@/contexts/SyncContext', () => ({
  useSync: () => ({ queueAssessment: queueAssessmentMock }),
}));

import { useAssessment } from './useAssessment';

async function renderFreshAssessment() {
  const rendered = renderHook(() => useAssessment());
  await waitFor(() => expect(rendered.result.current.isLoading).toBe(false));
  expect(rendered.result.current.assessment).not.toBeNull();
  return rendered;
}

beforeEach(() => {
  vi.clearAllMocks();
  callOrder.length = 0;
  putMock.mockImplementation(async () => {
    callOrder.push('put');
    return 'ok';
  });
  queueAssessmentMock.mockImplementation(() => {
    callOrder.push('enqueue');
  });
});

describe('save() — durable put first, then enqueue', () => {
  it('enqueues only after the IndexedDB put resolves', async () => {
    const { result } = await renderFreshAssessment();

    await act(async () => {
      await result.current.save();
    });

    expect(putMock).toHaveBeenCalledTimes(1);
    expect(queueAssessmentMock).toHaveBeenCalledTimes(1);
    expect(callOrder).toEqual(['put', 'enqueue']);
    expect(result.current.error).toBeNull();
  });

  it("first save of a fresh assessment queues 'create', the second 'update'", async () => {
    const { result } = await renderFreshAssessment();

    await act(async () => {
      await result.current.save();
    });
    await act(async () => {
      await result.current.save();
    });

    expect(queueAssessmentMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: expect.any(String) }),
      'create'
    );
    expect(queueAssessmentMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: expect.any(String) }),
      'update'
    );
  });

  it("an existing assessment (loaded by id) queues 'update' from the first save", async () => {
    const existingId = 'existing-assessment-1';
    getMock.mockImplementationOnce(async () => {
      const { createEmptyAssessment } = await import('./useAssessment');
      const a = createEmptyAssessment();
      a.id = existingId;
      return a;
    });

    const rendered = renderHook(() => useAssessment(existingId));
    await waitFor(() => expect(rendered.result.current.isLoading).toBe(false));

    await act(async () => {
      await rendered.result.current.save();
    });

    expect(queueAssessmentMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: existingId }),
      'update'
    );
  });
});

describe('save() — failure modes are never silent', () => {
  it('a failed put sets the error and never enqueues', async () => {
    putMock.mockImplementationOnce(async () => {
      throw new Error('IndexedDB write failed');
    });

    const { result } = await renderFreshAssessment();

    await act(async () => {
      await result.current.save();
    });

    expect(result.current.error).toBe('IndexedDB write failed');
    expect(queueAssessmentMock).not.toHaveBeenCalled();
    expect(result.current.isSaving).toBe(false);
  });

  it('a throwing enqueue is surfaced while the local save already happened', async () => {
    queueAssessmentMock.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = await renderFreshAssessment();

    await act(async () => {
      await result.current.save();
    });

    expect(putMock).toHaveBeenCalledTimes(1); // durability first
    expect(result.current.error).toContain('Saved on this device');
    expect(result.current.isSaving).toBe(false);
  });
});

'use client';

import { useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import type { FieldMemory } from '@/types/traq';

const EMPTY_MEMORIES: FieldMemory[] = [];

/**
 * Hook for managing field memory (remembered answers)
 */
export function useMemory() {
  // Get all memory entries
  const memoriesQuery = useLiveQuery(() => db.memory.toArray());
  const memories = useMemo(() => memoriesQuery ?? EMPTY_MEMORIES, [memoriesQuery]);

  // Get memory for a specific field
  const getMemory = useCallback(
    (fieldPath: string): FieldMemory | undefined => {
      return memories.find((m) => m.fieldPath === fieldPath && m.enabled);
    },
    [memories]
  );

  // Check if memory is enabled for a field
  const isMemoryEnabled = useCallback(
    (fieldPath: string): boolean => {
      const memory = memories.find((m) => m.fieldPath === fieldPath);
      return memory?.enabled ?? false;
    },
    [memories]
  );

  // Get remembered value for a field
  const getRememberedValue = useCallback(
    <T>(fieldPath: string): T | undefined => {
      const memory = memories.find((m) => m.fieldPath === fieldPath && m.enabled);
      return memory?.value as T | undefined;
    },
    [memories]
  );

  // Save/update memory for a field
  const saveMemory = useCallback(
    async (fieldPath: string, value: unknown, enabled: boolean = true) => {
      const existing = await db.memory.where('fieldPath').equals(fieldPath).first();

      if (existing) {
        await db.memory.update(existing.id, {
          value,
          enabled,
          lastUsed: new Date(),
        });
      } else {
        await db.memory.add({
          id: uuidv4(),
          fieldPath,
          value,
          enabled,
          lastUsed: new Date(),
        });
      }
    },
    []
  );

  // Toggle memory for a field
  const toggleMemory = useCallback(
    async (fieldPath: string, currentValue?: unknown) => {
      const existing = await db.memory.where('fieldPath').equals(fieldPath).first();

      if (existing) {
        await db.memory.update(existing.id, {
          enabled: !existing.enabled,
          lastUsed: new Date(),
        });
      } else if (currentValue !== undefined) {
        // Create new memory entry with the current value
        await db.memory.add({
          id: uuidv4(),
          fieldPath,
          value: currentValue,
          enabled: true,
          lastUsed: new Date(),
        });
      }
    },
    []
  );

  // Clear memory for a field
  const clearMemory = useCallback(async (fieldPath: string) => {
    await db.memory.where('fieldPath').equals(fieldPath).delete();
  }, []);

  // Clear all memories
  const clearAllMemories = useCallback(async () => {
    await db.memory.clear();
  }, []);

  // Get all enabled memories (for applying to new assessments)
  const getEnabledMemories = useCallback((): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    for (const memory of memories) {
      if (memory.enabled) {
        result[memory.fieldPath] = memory.value;
      }
    }
    return result;
  }, [memories]);

  return {
    memories,
    getMemory,
    isMemoryEnabled,
    getRememberedValue,
    saveMemory,
    toggleMemory,
    clearMemory,
    clearAllMemories,
    getEnabledMemories,
  };
}

/**
 * Hook for a single field's memory toggle
 */
export function useFieldMemory(fieldPath: string, currentValue: unknown) {
  const { isMemoryEnabled, toggleMemory, saveMemory } = useMemory();

  const enabled = isMemoryEnabled(fieldPath);

  const toggle = useCallback(async () => {
    await toggleMemory(fieldPath, currentValue);
  }, [fieldPath, currentValue, toggleMemory]);

  const save = useCallback(async () => {
    if (enabled) {
      await saveMemory(fieldPath, currentValue, true);
    }
  }, [fieldPath, currentValue, enabled, saveMemory]);

  return {
    enabled,
    toggle,
    save,
  };
}

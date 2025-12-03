'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadTreeSpecies, searchTreeSpecies } from '@/lib/csvLoader';
import type { TreeSpecies } from '@/types/traq';

/**
 * Hook for loading and searching tree species
 */
export function useTreeSpecies() {
  const [species, setSpecies] = useState<TreeSpecies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await loadTreeSpecies();
        setSpecies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load species');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { species, isLoading, error };
}

/**
 * Hook for searching tree species with debounce
 */
export function useTreeSpeciesSearch(query: string, debounceMs = 300) {
  const { species, isLoading: isLoadingSpecies } = useTreeSpecies();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    return searchTreeSpecies(species, debouncedQuery);
  }, [species, debouncedQuery]);

  return {
    results,
    isLoading: isLoadingSpecies,
    hasQuery: debouncedQuery.length >= 2,
  };
}

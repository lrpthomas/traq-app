'use client';

import Papa from 'papaparse';
import type { TreeSpecies } from '@/types/traq';

let treeSpeciesCache: TreeSpecies[] | null = null;

/**
 * Load tree species from CSV file
 */
export async function loadTreeSpecies(): Promise<TreeSpecies[]> {
  if (treeSpeciesCache) {
    return treeSpeciesCache;
  }

  try {
    const response = await fetch('/data/tree-species.csv');
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<TreeSpecies>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          treeSpeciesCache = results.data;
          resolve(results.data);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Failed to load tree species:', error);
    return [];
  }
}

/**
 * Search tree species by common or scientific name
 */
export function searchTreeSpecies(
  species: TreeSpecies[],
  query: string
): TreeSpecies[] {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  return species
    .filter(
      (s) =>
        s.commonName.toLowerCase().includes(lowerQuery) ||
        s.scientificName.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 20); // Limit results
}

/**
 * Format species for display
 */
export function formatSpeciesDisplay(species: TreeSpecies): string {
  return `${species.commonName} (${species.scientificName})`;
}

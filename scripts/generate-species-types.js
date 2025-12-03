#!/usr/bin/env node

/**
 * Generates TypeScript types and constants from tree-species.csv
 * Creates src/types/species.ts with:
 * - TreeSpecies interface
 * - TREE_SPECIES constant array
 * - TREE_FAMILIES union type
 * - Helper lookup functions
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'src', 'data', 'tree-species.csv');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'types', 'species.ts');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

function escapeString(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function generate() {
  console.log('Generating TypeScript types from tree-species.csv...');

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`ERROR: CSV file not found at ${CSV_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const species = parseCSV(content);

  // Extract unique families
  const families = [...new Set(species.map(s => s.family))].filter(Boolean).sort();

  // Generate TypeScript content
  const output = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * Generated from: src/data/tree-species.csv
 * Run: npm run generate:types
 */

export interface TreeSpecies {
  scientificName: string;
  commonName: string;
  family: TreeFamily;
  riskFactors: string;
}

export type TreeFamily =
${families.map(f => `  | '${escapeString(f)}'`).join('\n')};

export const TREE_FAMILIES: TreeFamily[] = [
${families.map(f => `  '${escapeString(f)}',`).join('\n')}
] as const;

export const TREE_SPECIES: TreeSpecies[] = [
${species.map(s => `  {
    scientificName: '${escapeString(s.scientificName)}',
    commonName: '${escapeString(s.commonName)}',
    family: '${escapeString(s.family)}' as TreeFamily,
    riskFactors: '${escapeString(s.riskFactors)}',
  },`).join('\n')}
];

/**
 * Get species by scientific name (case-insensitive)
 */
export function getSpeciesByScientificName(name: string): TreeSpecies | undefined {
  return TREE_SPECIES.find(
    s => s.scientificName.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get species by common name (case-insensitive, partial match)
 */
export function searchSpeciesByCommonName(query: string): TreeSpecies[] {
  const lowerQuery = query.toLowerCase();
  return TREE_SPECIES.filter(
    s => s.commonName.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all species in a family
 */
export function getSpeciesByFamily(family: TreeFamily): TreeSpecies[] {
  return TREE_SPECIES.filter(s => s.family === family);
}

/**
 * Total number of species in the database
 */
export const SPECIES_COUNT = ${species.length};
`;

  // Ensure types directory exists
  const typesDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, output);
  console.log(`Generated ${OUTPUT_PATH}`);
  console.log(`  - ${species.length} species`);
  console.log(`  - ${families.length} families`);
}

generate();

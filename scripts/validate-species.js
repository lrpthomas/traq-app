#!/usr/bin/env node

/**
 * Validates the tree-species.csv data file
 * Checks for:
 * - Required columns
 * - No empty scientific names
 * - No duplicate species
 * - Valid data formatting
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'src', 'data', 'tree-species.csv');
const REQUIRED_COLUMNS = ['scientificName', 'commonName', 'family', 'riskFactors'];

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
    row._lineNumber = i + 1;
    rows.push(row);
  }

  return { headers, rows };
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

function validate() {
  console.log('='.repeat(60));
  console.log('TRAQ Tree Species Data Validator');
  console.log('='.repeat(60));
  console.log();

  // Check file exists
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`ERROR: CSV file not found at ${CSV_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const errors = [];
  const warnings = [];

  // Check required columns
  console.log('Checking required columns...');
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push(`Missing required column: ${col}`);
    }
  }

  // Check for empty scientific names
  console.log('Checking for empty scientific names...');
  for (const row of rows) {
    if (!row.scientificName) {
      errors.push(`Line ${row._lineNumber}: Empty scientific name`);
    }
    if (!row.commonName) {
      warnings.push(`Line ${row._lineNumber}: Empty common name for ${row.scientificName || 'unknown'}`);
    }
  }

  // Check for duplicates
  console.log('Checking for duplicate species...');
  const seen = new Map();
  for (const row of rows) {
    const key = row.scientificName.toLowerCase();
    if (seen.has(key)) {
      errors.push(`Duplicate species: ${row.scientificName} (lines ${seen.get(key)} and ${row._lineNumber})`);
    } else {
      seen.set(key, row._lineNumber);
    }
  }

  // Check family names are capitalized
  console.log('Checking family name formatting...');
  for (const row of rows) {
    if (row.family && row.family[0] !== row.family[0].toUpperCase()) {
      warnings.push(`Line ${row._lineNumber}: Family name should be capitalized: ${row.family}`);
    }
  }

  // Report results
  console.log();
  console.log('='.repeat(60));
  console.log('RESULTS');
  console.log('='.repeat(60));
  console.log(`Total species: ${rows.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log();

  if (errors.length > 0) {
    console.log('ERRORS:');
    errors.forEach(e => console.log(`  - ${e}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log('WARNINGS:');
    warnings.forEach(w => console.log(`  - ${w}`));
    console.log();
  }

  if (errors.length === 0) {
    console.log('Validation PASSED');
    process.exit(0);
  } else {
    console.log('Validation FAILED');
    process.exit(1);
  }
}

validate();

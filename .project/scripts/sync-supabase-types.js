#!/usr/bin/env node
/**
 * TRAQ Supabase Type Generator
 * =============================================================================
 * Generates TypeScript types from Supabase database schema
 *
 * Usage: node .project/scripts/sync-supabase-types.js
 *
 * Requirements:
 * - SUPABASE_PROJECT_ID in .env.local or PROJECT_STATUS.yaml
 * - Supabase CLI installed: npm install -g supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const STATUS_FILE = path.join(PROJECT_ROOT, '.project/PROJECT_STATUS.yaml');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src/types/supabase.ts');

function getProjectId() {
  // Try environment variable first
  if (process.env.SUPABASE_PROJECT_ID) {
    return process.env.SUPABASE_PROJECT_ID;
  }

  // Try PROJECT_STATUS.yaml
  try {
    const status = yaml.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
    if (status.supabase?.project_id) {
      return status.supabase.project_id;
    }
  } catch (e) {
    // Ignore
  }

  return null;
}

function generateTypes() {
  console.log('🔄 Generating Supabase TypeScript types...\n');

  const projectId = getProjectId();

  if (!projectId) {
    console.log('⚠️  No Supabase project ID found.');
    console.log('   Set supabase.project_id in .project/PROJECT_STATUS.yaml');
    console.log('   Or set SUPABASE_PROJECT_ID environment variable\n');
    console.log('📝 Creating placeholder types file...');

    // Create placeholder types
    const placeholder = `// =============================================================================
// Supabase Database Types (Placeholder)
// =============================================================================
// This file will be auto-generated once Supabase project is configured.
// Run: npm run sync:types
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tables will be generated from your Supabase schema
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      // Enums will be generated from your Supabase schema
      assessment_status: 'draft' | 'complete'
      team_role: 'owner' | 'admin' | 'editor' | 'viewer'
      risk_rating: 'low' | 'moderate' | 'high' | 'extreme'
      // ... more enums from schema
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type exports
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
`;

    fs.writeFileSync(OUTPUT_FILE, placeholder);
    console.log(`✅ Created placeholder at ${OUTPUT_FILE}\n`);
    return;
  }

  console.log(`📦 Project ID: ${projectId}`);

  try {
    // Check if Supabase CLI is installed
    execSync('supabase --version', { stdio: 'ignore' });
  } catch (e) {
    console.error('❌ Supabase CLI not found. Install with:');
    console.error('   npm install -g supabase');
    process.exit(1);
  }

  try {
    // Generate types
    console.log('⏳ Fetching schema from Supabase...');

    const result = execSync(
      `supabase gen types typescript --project-id ${projectId}`,
      { encoding: 'utf8' }
    );

    // Add header comment
    const header = `// =============================================================================
// Supabase Database Types (Auto-generated)
// =============================================================================
// DO NOT EDIT - This file is auto-generated from your Supabase schema
// Run: npm run sync:types
// Generated: ${new Date().toISOString()}
// =============================================================================

`;

    fs.writeFileSync(OUTPUT_FILE, header + result);
    console.log(`\n✅ Types generated at ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Failed to generate types:', error.message);
    console.error('\nMake sure you are logged in:');
    console.error('   supabase login');
    process.exit(1);
  }
}

// Run
generateTypes();

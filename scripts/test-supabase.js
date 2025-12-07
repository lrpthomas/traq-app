#!/usr/bin/env node
/**
 * Test Supabase Connection
 * Run: node scripts/test-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🔍 Testing Supabase Connection...\n');
console.log('━'.repeat(50));

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log(`   URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`   Anon Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
console.log(`   Service Key: ${serviceKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing required environment variables!');
  console.error('   Make sure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function testConnection() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('\n📡 Testing Database Connection...');

  // Test 1: Check if we can reach the database
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      // Expected error if no users exist and RLS is blocking
      if (error.code === 'PGRST116' || error.message.includes('0 rows')) {
        console.log('   ✅ Database reachable (no users yet - expected)');
      } else if (error.code === '42P01') {
        console.log('   ❌ Table "users" not found - run the schema SQL first');
        return false;
      } else {
        console.log(`   ⚠️  Query returned: ${error.message}`);
      }
    } else {
      console.log('   ✅ Database connected successfully');
    }
  } catch (err) {
    console.log(`   ❌ Connection failed: ${err.message}`);
    return false;
  }

  // Test 2: Check if tables exist (using service role to bypass RLS)
  if (serviceKey) {
    console.log('\n📊 Checking Tables (with service role)...');
    const adminClient = createClient(supabaseUrl, serviceKey);

    const tables = [
      'users',
      'teams',
      'team_members',
      'assessments',
      'assessment_targets',
      'assessment_risk_rows',
      'assessment_mitigations',
      'media_attachments',
      'app_settings',
      'field_memories',
      'sync_queue',
      'audit_logs'
    ];

    let allExist = true;
    for (const table of tables) {
      try {
        const { error } = await adminClient.from(table).select('id').limit(1);
        if (error && error.code === '42P01') {
          console.log(`   ❌ ${table} - NOT FOUND`);
          allExist = false;
        } else {
          console.log(`   ✅ ${table}`);
        }
      } catch (err) {
        console.log(`   ❌ ${table} - Error: ${err.message}`);
        allExist = false;
      }
    }

    if (!allExist) {
      console.log('\n⚠️  Some tables are missing. Run the schema SQL in Supabase Dashboard.');
    }
  }

  // Test 3: Check Auth service
  console.log('\n🔐 Testing Auth Service...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(`   ⚠️  Auth error: ${error.message}`);
    } else {
      console.log('   ✅ Auth service responding');
      console.log(`   Session: ${data.session ? 'Active' : 'None (expected - not logged in)'}`);
    }
  } catch (err) {
    console.log(`   ❌ Auth failed: ${err.message}`);
  }

  return true;
}

testConnection().then((success) => {
  console.log('\n' + '━'.repeat(50));
  if (success) {
    console.log('\n✅ Supabase connection test complete!\n');
  } else {
    console.log('\n❌ Some tests failed. Check the output above.\n');
    process.exit(1);
  }
}).catch((err) => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});

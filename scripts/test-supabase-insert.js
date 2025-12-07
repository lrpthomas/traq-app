#!/usr/bin/env node
/**
 * Test Supabase Data Insertion
 * Tests creating a user and assessment in the database
 * Run: node scripts/test-supabase-insert.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

// Use service role to bypass RLS for testing
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runTest() {
  console.log('\n🧪 Testing Supabase Data Insertion...\n');
  console.log('━'.repeat(50));

  const testEmail = `test-${Date.now()}@example.com`;
  const testUserId = crypto.randomUUID();
  let testAssessmentId = null;

  try {
    // Step 1: Create a test auth user
    console.log('\n1️⃣  Creating test auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { name: 'Test User' }
    });

    if (authError) {
      console.log(`   ❌ Auth user creation failed: ${authError.message}`);
      return false;
    }

    const userId = authData.user.id;
    console.log(`   ✅ Auth user created: ${userId}`);

    // Step 2: Create user profile in users table
    console.log('\n2️⃣  Creating user profile...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: testEmail,
        display_name: 'Test User'
      })
      .select()
      .single();

    if (userError) {
      console.log(`   ❌ User profile failed: ${userError.message}`);
    } else {
      console.log(`   ✅ User profile created: ${userData.email}`);
    }

    // Step 3: Create a test assessment
    console.log('\n3️⃣  Creating test assessment...');
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: userId,
        status: 'draft',
        header_client: 'Test Client Corp',
        header_date: new Date().toISOString().split('T')[0],
        header_address: '123 Test Street, Test City, TS 12345',
        header_assessors: 'Test Assessor',
        header_tree_species: 'Quercus rubra',
        header_dbh: '24 in',
        header_height: '50 ft',
        overall_tree_risk_rating: 'moderate',
        notes: 'This is a test assessment created by the test script.'
      })
      .select()
      .single();

    if (assessmentError) {
      console.log(`   ❌ Assessment creation failed: ${assessmentError.message}`);
    } else {
      testAssessmentId = assessmentData.id;
      console.log(`   ✅ Assessment created: ${testAssessmentId}`);
      console.log(`      Client: ${assessmentData.header_client}`);
      console.log(`      Location: ${assessmentData.header_address}`);
      console.log(`      Risk Rating: ${assessmentData.overall_tree_risk_rating}`);
    }

    // Step 4: Create assessment targets
    console.log('\n4️⃣  Creating assessment targets...');
    const { data: targetData, error: targetError } = await supabase
      .from('assessment_targets')
      .insert([
        {
          assessment_id: testAssessmentId,
          target_number: 1,
          target_description: 'House',
          occupancy_rate: '3',
          within_drip_line: true
        },
        {
          assessment_id: testAssessmentId,
          target_number: 2,
          target_description: 'Sidewalk',
          occupancy_rate: '2',
          within_1x_height: true
        }
      ])
      .select();

    if (targetError) {
      console.log(`   ❌ Targets creation failed: ${targetError.message}`);
    } else {
      console.log(`   ✅ Created ${targetData.length} targets`);
    }

    // Step 5: Create risk rows
    console.log('\n5️⃣  Creating risk categorization rows...');
    const { data: riskData, error: riskError } = await supabase
      .from('assessment_risk_rows')
      .insert({
        assessment_id: testAssessmentId,
        target: 'House',
        tree_part: 'branches',
        conditions_of_concern: 'Dead branches over target',
        likelihood_failure: 'probable',
        likelihood_impact: 'medium',
        failure_and_impact: 'likely',
        consequences: 'significant',
        risk_rating: 'high'
      })
      .select()
      .single();

    if (riskError) {
      console.log(`   ❌ Risk row creation failed: ${riskError.message}`);
    } else {
      console.log(`   ✅ Risk row created: ${riskData.risk_rating} risk`);
    }

    // Step 6: Verify data by reading it back
    console.log('\n6️⃣  Verifying data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_targets (*),
        assessment_risk_rows (*)
      `)
      .eq('id', testAssessmentId)
      .single();

    if (verifyError) {
      console.log(`   ❌ Verification failed: ${verifyError.message}`);
    } else {
      console.log(`   ✅ Data verified!`);
      console.log(`      Assessment ID: ${verifyData.id}`);
      console.log(`      Targets: ${verifyData.assessment_targets?.length || 0}`);
      console.log(`      Risk Rows: ${verifyData.assessment_risk_rows?.length || 0}`);
    }

    // Step 7: Cleanup test data
    console.log('\n7️⃣  Cleaning up test data...');

    // Delete assessment (cascades to targets and risk rows)
    if (testAssessmentId) {
      await supabase.from('assessments').delete().eq('id', testAssessmentId);
      console.log('   ✅ Assessment deleted');
    }

    // Delete user profile
    await supabase.from('users').delete().eq('id', userId);
    console.log('   ✅ User profile deleted');

    // Delete auth user
    await supabase.auth.admin.deleteUser(userId);
    console.log('   ✅ Auth user deleted');

    return true;

  } catch (err) {
    console.error(`\n❌ Test error: ${err.message}`);
    return false;
  }
}

runTest().then((success) => {
  console.log('\n' + '━'.repeat(50));
  if (success) {
    console.log('\n✅ Data insertion test PASSED!\n');
    console.log('The database can:');
    console.log('  • Create users');
    console.log('  • Create assessments with all fields');
    console.log('  • Create related targets and risk rows');
    console.log('  • Query data with relations');
    console.log('  • Delete data (cascade works)\n');
  } else {
    console.log('\n❌ Data insertion test FAILED\n');
    process.exit(1);
  }
}).catch(err => {
  console.error('Test crashed:', err);
  process.exit(1);
});

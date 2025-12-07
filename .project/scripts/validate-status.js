#!/usr/bin/env node
/**
 * TRAQ Project Status Validator
 * =============================================================================
 * Validates PROJECT_STATUS.yaml for consistency and completeness
 *
 * Usage: node .project/scripts/validate-status.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const STATUS_FILE = path.join(PROJECT_ROOT, '.project/PROJECT_STATUS.yaml');

function loadYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(content);
}

function validate() {
  console.log('🔍 Validating PROJECT_STATUS.yaml...\n');

  const errors = [];
  const warnings = [];

  // Load status file
  let status;
  try {
    status = loadYaml(STATUS_FILE);
  } catch (error) {
    console.error('❌ Failed to parse PROJECT_STATUS.yaml:', error.message);
    process.exit(1);
  }

  // Validate project section
  if (!status.project) {
    errors.push('Missing required section: project');
  } else {
    if (!status.project.name) errors.push('Missing project.name');
    if (!status.project.version) errors.push('Missing project.version');
    if (!status.project.status) errors.push('Missing project.status');
  }

  // Validate features
  if (!status.features || !Array.isArray(status.features)) {
    errors.push('Missing or invalid features array');
  } else {
    const featureIds = new Set();

    for (const feature of status.features) {
      if (!feature.id) {
        errors.push('Feature missing id');
        continue;
      }

      if (featureIds.has(feature.id)) {
        errors.push(`Duplicate feature id: ${feature.id}`);
      }
      featureIds.add(feature.id);

      if (!feature.name) errors.push(`Feature ${feature.id} missing name`);
      if (!feature.status) errors.push(`Feature ${feature.id} missing status`);
      if (feature.progress === undefined) warnings.push(`Feature ${feature.id} missing progress`);

      // Validate status values
      const validStatuses = ['complete', 'in_progress', 'not_started', 'blocked'];
      if (feature.status && !validStatuses.includes(feature.status)) {
        errors.push(`Feature ${feature.id} has invalid status: ${feature.status}`);
      }

      // Validate progress range
      if (feature.progress !== undefined && (feature.progress < 0 || feature.progress > 100)) {
        errors.push(`Feature ${feature.id} has invalid progress: ${feature.progress}`);
      }

      // Check consistency
      if (feature.status === 'complete' && feature.progress !== 100) {
        warnings.push(`Feature ${feature.id} is complete but progress is ${feature.progress}%`);
      }
      if (feature.status === 'not_started' && feature.progress > 0) {
        warnings.push(`Feature ${feature.id} is not_started but progress is ${feature.progress}%`);
      }
    }
  }

  // Validate blockers
  if (status.blockers && Array.isArray(status.blockers)) {
    const blockerIds = new Set();

    for (const blocker of status.blockers) {
      if (!blocker.id) {
        errors.push('Blocker missing id');
        continue;
      }

      if (blockerIds.has(blocker.id)) {
        errors.push(`Duplicate blocker id: ${blocker.id}`);
      }
      blockerIds.add(blocker.id);

      if (!blocker.title) errors.push(`Blocker ${blocker.id} missing title`);
      if (!blocker.severity) errors.push(`Blocker ${blocker.id} missing severity`);

      const validSeverities = ['critical', 'high', 'medium', 'low'];
      if (blocker.severity && !validSeverities.includes(blocker.severity)) {
        errors.push(`Blocker ${blocker.id} has invalid severity: ${blocker.severity}`);
      }
    }
  }

  // Validate phases
  if (!status.phases || !Array.isArray(status.phases)) {
    errors.push('Missing or invalid phases array');
  } else {
    for (const phase of status.phases) {
      if (!phase.id) errors.push('Phase missing id');
      if (!phase.name) errors.push(`Phase ${phase.id || 'unknown'} missing name`);
      if (!phase.week) warnings.push(`Phase ${phase.id || 'unknown'} missing week`);

      if (phase.tasks && Array.isArray(phase.tasks)) {
        for (const task of phase.tasks) {
          if (!task.id) errors.push(`Task in phase ${phase.id} missing id`);
          if (!task.name) errors.push(`Task ${task.id || 'unknown'} missing name`);
        }
      }
    }
  }

  // Validate testing section
  if (!status.testing) {
    warnings.push('Missing testing section');
  } else {
    if (!status.testing.unit_tests) warnings.push('Missing testing.unit_tests');
    if (!status.testing.component_tests) warnings.push('Missing testing.component_tests');
  }

  // Validate deployments
  if (!status.deployments || !Array.isArray(status.deployments)) {
    warnings.push('Missing or invalid deployments array');
  }

  // Report results
  console.log('━'.repeat(60));

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ PROJECT_STATUS.yaml is valid!\n');
    return true;
  }

  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    for (const error of errors) {
      console.log(`   • ${error}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.log(`   • ${warning}`);
    }
  }

  console.log('\n' + '━'.repeat(60));

  if (errors.length > 0) {
    console.log(`\n❌ Validation failed with ${errors.length} error(s)`);
    return false;
  }

  console.log(`\n✅ Validation passed with ${warnings.length} warning(s)`);
  return true;
}

// Run
const isValid = validate();
process.exit(isValid ? 0 : 1);

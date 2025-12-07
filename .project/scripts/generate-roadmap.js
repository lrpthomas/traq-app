#!/usr/bin/env node
/**
 * TRAQ Roadmap Generator
 * =============================================================================
 * Generates ROADMAP.md from PROJECT_STATUS.yaml
 *
 * Usage: node .project/scripts/generate-roadmap.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const STATUS_FILE = path.join(PROJECT_ROOT, '.project/PROJECT_STATUS.yaml');
const TEMPLATE_FILE = path.join(PROJECT_ROOT, '.project/templates/ROADMAP.template.md');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'ROADMAP.md');

function loadYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(content);
}

function loadTemplate(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function generateFeaturesTable(features) {
  let table = '| Feature | Status | Progress |\n';
  table += '|---------|--------|----------|\n';

  for (const feature of features) {
    const statusEmoji = {
      'complete': '✅',
      'in_progress': '🔄',
      'not_started': '⬜',
      'blocked': '🚫'
    }[feature.status] || '❓';

    const progressBar = generateProgressBar(feature.progress);
    table += `| ${feature.name} | ${statusEmoji} ${feature.status} | ${progressBar} ${feature.progress}% |\n`;
  }

  return table;
}

function generateProgressBar(percent) {
  const filled = Math.round(percent / 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function generateBlockersTable(blockers) {
  if (!blockers || blockers.length === 0) {
    return '*No current blockers*';
  }

  let table = '| ID | Title | Severity | Status |\n';
  table += '|----|-------|----------|--------|\n';

  for (const blocker of blockers) {
    const severityEmoji = {
      'critical': '🔴',
      'high': '🟠',
      'medium': '🟡',
      'low': '🟢'
    }[blocker.severity] || '⚪';

    table += `| ${blocker.id} | ${blocker.title} | ${severityEmoji} ${blocker.severity} | ${blocker.status} |\n`;
  }

  return table;
}

function generatePhasesSection(phases) {
  let content = '';

  for (const phase of phases) {
    const statusEmoji = {
      'complete': '✅',
      'in_progress': '🔄',
      'not_started': '⬜'
    }[phase.status] || '❓';

    content += `### ${statusEmoji} Phase: ${phase.name}\n`;
    content += `**Week ${phase.week}**\n\n`;

    if (phase.tasks && phase.tasks.length > 0) {
      for (const task of phase.tasks) {
        const taskEmoji = task.status === 'complete' ? '✅' :
                         task.status === 'in_progress' ? '🔄' : '⬜';
        content += `- ${taskEmoji} ${task.name}\n`;
      }
    }

    content += '\n';
  }

  return content;
}

function generateDeploymentsTable(deployments) {
  let table = '| Platform | Name | Status |\n';
  table += '|----------|------|--------|\n';

  for (const deployment of deployments) {
    const statusEmoji = {
      'ready': '✅',
      'blocked': '🚫',
      'in_progress': '🔄',
      'deployed': '🚀'
    }[deployment.status] || '⬜';

    table += `| ${deployment.platform} | ${deployment.name} | ${statusEmoji} ${deployment.status} |\n`;
  }

  return table;
}

function generateStackList(stack) {
  let list = '';
  for (const [key, value] of Object.entries(stack)) {
    list += `- **${key}**: ${value}\n`;
  }
  return list;
}

function generate() {
  console.log('📄 Generating ROADMAP.md from PROJECT_STATUS.yaml...\n');

  // Load data
  const status = loadYaml(STATUS_FILE);
  let template = loadTemplate(TEMPLATE_FILE);

  // Replace placeholders
  const replacements = {
    '{{LAST_UPDATED}}': new Date().toISOString().split('T')[0],
    '{{PROJECT_NAME}}': status.project.full_name,
    '{{VERSION}}': status.project.version,
    '{{STATUS}}': status.project.status,
    '{{TARGET_RELEASE}}': status.project.target_release,
    '{{FEATURES_TABLE}}': generateFeaturesTable(status.features),
    '{{BLOCKERS_TABLE}}': generateBlockersTable(status.blockers),
    '{{PHASES_SECTION}}': generatePhasesSection(status.phases),
    '{{UNIT_TESTS}}': status.testing.unit_tests.total,
    '{{UNIT_COVERAGE}}': status.testing.unit_tests.coverage_percent,
    '{{COMPONENT_TESTS}}': status.testing.component_tests.total,
    '{{COMPONENT_TARGET}}': status.testing.component_tests.target,
    '{{INTEGRATION_TESTS}}': status.testing.integration_tests.total,
    '{{INTEGRATION_TARGET}}': status.testing.integration_tests.target,
    '{{E2E_TESTS}}': status.testing.e2e_tests.total,
    '{{E2E_TARGET}}': status.testing.e2e_tests.target,
    '{{DEPLOYMENTS_TABLE}}': generateDeploymentsTable(status.deployments),
    '{{FRONTEND_STACK}}': generateStackList(status.stack.frontend),
    '{{BACKEND_STACK}}': generateStackList(status.stack.backend),
    '{{MOBILE_STACK}}': generateStackList(status.stack.mobile),
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(placeholder, 'g'), value);
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, template);

  console.log('✅ Generated ROADMAP.md');
  console.log(`   Features: ${status.features.length}`);
  console.log(`   Phases: ${status.phases.length}`);
  console.log(`   Blockers: ${status.blockers?.length || 0}`);
}

// Run
try {
  generate();
} catch (error) {
  console.error('❌ Error generating roadmap:', error.message);
  process.exit(1);
}

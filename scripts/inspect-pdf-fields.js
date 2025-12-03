#!/usr/bin/env node

/**
 * Extracts and lists all form field names from the TRAQ PDF template
 * This helps map assessment data to the correct PDF form fields
 */

const fs = require('fs');
const path = require('path');

async function inspectPdfFields() {
  // Dynamic import for ES module
  const { PDFDocument } = await import('pdf-lib');

  const pdfPath = path.join(__dirname, '..', 'public', 'templates', 'traq-form.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error('ERROR: PDF template not found at:', pdfPath);
    process.exit(1);
  }

  console.log('Loading PDF from:', pdfPath);
  console.log('');

  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log('='.repeat(80));
  console.log('TRAQ PDF Form Fields');
  console.log('='.repeat(80));
  console.log(`Total fields found: ${fields.length}`);
  console.log('');

  // Group by field type
  const textFields = [];
  const checkBoxFields = [];
  const radioFields = [];
  const dropdownFields = [];
  const otherFields = [];

  for (const field of fields) {
    const name = field.getName();
    const type = field.constructor.name;

    const fieldInfo = { name, type };

    switch (type) {
      case 'PDFTextField':
        textFields.push(fieldInfo);
        break;
      case 'PDFCheckBox':
        checkBoxFields.push(fieldInfo);
        break;
      case 'PDFRadioGroup':
        radioFields.push(fieldInfo);
        break;
      case 'PDFDropdown':
        dropdownFields.push(fieldInfo);
        break;
      default:
        otherFields.push(fieldInfo);
    }
  }

  // Print text fields
  if (textFields.length > 0) {
    console.log('-'.repeat(80));
    console.log(`TEXT FIELDS (${textFields.length})`);
    console.log('-'.repeat(80));
    textFields.forEach((f, i) => {
      console.log(`  ${(i + 1).toString().padStart(3)}. "${f.name}"`);
    });
    console.log('');
  }

  // Print checkbox fields
  if (checkBoxFields.length > 0) {
    console.log('-'.repeat(80));
    console.log(`CHECKBOX FIELDS (${checkBoxFields.length})`);
    console.log('-'.repeat(80));
    checkBoxFields.forEach((f, i) => {
      console.log(`  ${(i + 1).toString().padStart(3)}. "${f.name}"`);
    });
    console.log('');
  }

  // Print radio fields
  if (radioFields.length > 0) {
    console.log('-'.repeat(80));
    console.log(`RADIO BUTTON GROUPS (${radioFields.length})`);
    console.log('-'.repeat(80));
    radioFields.forEach((f, i) => {
      console.log(`  ${(i + 1).toString().padStart(3)}. "${f.name}"`);
    });
    console.log('');
  }

  // Print dropdown fields
  if (dropdownFields.length > 0) {
    console.log('-'.repeat(80));
    console.log(`DROPDOWN FIELDS (${dropdownFields.length})`);
    console.log('-'.repeat(80));
    dropdownFields.forEach((f, i) => {
      console.log(`  ${(i + 1).toString().padStart(3)}. "${f.name}"`);
    });
    console.log('');
  }

  // Print other fields
  if (otherFields.length > 0) {
    console.log('-'.repeat(80));
    console.log(`OTHER FIELDS (${otherFields.length})`);
    console.log('-'.repeat(80));
    otherFields.forEach((f, i) => {
      console.log(`  ${(i + 1).toString().padStart(3)}. "${f.name}" (${f.type})`);
    });
    console.log('');
  }

  // Generate mapping template
  console.log('='.repeat(80));
  console.log('SUGGESTED FIELD MAPPING (copy to pdfGenerator.ts)');
  console.log('='.repeat(80));
  console.log('');
  console.log('const PDF_FIELD_MAP = {');
  console.log('  // Header fields');
  textFields.slice(0, 20).forEach(f => {
    const safeName = f.name.replace(/'/g, "\\'");
    console.log(`  // '${safeName}': 'assessment.path.here',`);
  });
  console.log('  // ... more fields');
  console.log('};');
}

inspectPdfFields().catch(console.error);

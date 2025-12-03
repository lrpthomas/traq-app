#!/usr/bin/env node

/**
 * Analyzes the PDF structure to understand what type of form it is
 */

const fs = require('fs');
const path = require('path');

async function analyzePdf() {
  const { PDFDocument } = await import('pdf-lib');

  const pdfPath = path.join(__dirname, '..', 'public', 'templates', 'traq-form.pdf');
  const pdfBytes = fs.readFileSync(pdfPath);

  console.log('PDF File Size:', (pdfBytes.length / 1024).toFixed(2), 'KB');
  console.log('');

  // Check for XFA marker in raw bytes
  const pdfString = pdfBytes.toString('latin1');
  const hasXFA = pdfString.includes('/XFA') || pdfString.includes('xfa:');
  console.log('Contains XFA (dynamic forms):', hasXFA ? 'YES - Not supported by pdf-lib!' : 'No');

  // Check for AcroForm
  const hasAcroForm = pdfString.includes('/AcroForm');
  console.log('Contains AcroForm:', hasAcroForm ? 'Yes' : 'No');

  // Load and check structure
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    console.log('');
    console.log('PDF Properties:');
    console.log('  Pages:', pdfDoc.getPageCount());
    console.log('  Title:', pdfDoc.getTitle() || '(none)');
    console.log('  Author:', pdfDoc.getAuthor() || '(none)');
    console.log('  Creator:', pdfDoc.getCreator() || '(none)');
    console.log('  Producer:', pdfDoc.getProducer() || '(none)');

    const form = pdfDoc.getForm();
    const fields = form.getFields();
    console.log('  Form Fields:', fields.length);

    // Get page dimensions
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();
    console.log('  Page 1 Size:', width.toFixed(0), 'x', height.toFixed(0), 'points');

  } catch (error) {
    console.log('Error loading PDF:', error.message);
  }

  console.log('');
  console.log('='.repeat(60));

  if (hasXFA) {
    console.log('ISSUE: This PDF uses XFA (Adobe LiveCycle) forms.');
    console.log('XFA forms are not supported by pdf-lib.');
    console.log('');
    console.log('OPTIONS:');
    console.log('  1. Use the custom report generator (generateReportPDF)');
    console.log('  2. Find a non-XFA version of the TRAQ form');
    console.log('  3. Create a new fillable PDF with AcroForm fields');
    console.log('  4. Use text overlay at fixed coordinates');
  } else if (!hasAcroForm) {
    console.log('ISSUE: This PDF has no form fields (not fillable).');
    console.log('');
    console.log('OPTIONS:');
    console.log('  1. Use the custom report generator (generateReportPDF)');
    console.log('  2. Add form fields using Adobe Acrobat or LibreOffice');
    console.log('  3. Use text overlay at fixed coordinates');
  }
}

analyzePdf().catch(console.error);

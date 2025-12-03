import { PDFDocument } from 'pdf-lib';
import type { Assessment, MediaAttachment } from '@/types/traq';
import { db } from '@/lib/db';

/**
 * PDF Form Field Mapping
 * Field names extracted from the official ISA TRAQ fillable PDF form
 */

/**
 * Generate a filled PDF from assessment data
 * Uses pdf-lib to fill form fields in the official TRAQ PDF template
 */
export async function generateFilledPDF(assessment: Assessment): Promise<Uint8Array> {
  // Fetch the blank PDF template
  const templateUrl = '/templates/traq-form.pdf';
  const templateBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());

  // Load the PDF
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // ============================================
  // HEADER SECTION
  // ============================================
  fillText(form, 'Client', assessment.header.client);
  fillText(form, 'Date', assessment.header.date);
  fillText(form, 'Time', assessment.header.time);
  fillText(form, 'AddressTree location', assessment.header.addressTreeLocation);
  fillText(form, 'Tree no', assessment.header.treeNo);
  fillText(form, 'Sheet', assessment.header.sheetNumber?.toString());
  fillText(form, 'of', assessment.header.sheetTotal?.toString());
  fillText(form, 'Tree species', assessment.header.treeSpecies);
  fillText(form, 'dbh', assessment.header.dbh);
  fillText(form, 'Height', assessment.header.height);
  fillText(form, 'Crown spread dia', assessment.header.crownSpreadDia);
  fillText(form, 'Assessors', assessment.header.assessors);
  fillText(form, 'Tools used', assessment.header.toolsUsed);
  fillText(form, 'Time frame', assessment.header.timeFrame);

  // ============================================
  // TARGET ASSESSMENT SECTION
  // ============================================
  if (assessment.targets[0]) {
    fillText(form, 'Target description1', assessment.targets[0].targetDescription);
    fillText(form, 'Target protection1', assessment.targets[0].targetProtection);
    fillText(form, 'Occupancy rate 1 rare 2  occasional 3  frequent 4  constant',
      assessment.targets[0].occupancyRate?.toString());
  }
  if (assessment.targets[1]) {
    fillText(form, 'Target description2', assessment.targets[1].targetDescription);
    fillText(form, 'Target protection2', assessment.targets[1].targetProtection);
    fillText(form, 'Occupancy rate 1 rare 2  occasional 3  frequent 4  constant_2',
      assessment.targets[1].occupancyRate?.toString());
  }
  if (assessment.targets[2]) {
    fillText(form, 'Target description3', assessment.targets[2].targetDescription);
    fillText(form, 'Target protection3', assessment.targets[2].targetProtection);
    fillText(form, 'Occupancy rate 1 rare 2  occasional 3  frequent 4  constant_3',
      assessment.targets[2].occupancyRate?.toString());
  }
  if (assessment.targets[3]) {
    fillText(form, 'Target description4', assessment.targets[3].targetDescription);
    fillText(form, 'Target protection4', assessment.targets[3].targetProtection);
    fillText(form, 'Occupancy rate 1 rare 2  occasional 3  frequent 4  constant_4',
      assessment.targets[3].occupancyRate?.toString());
  }

  // ============================================
  // SITE FACTORS SECTION
  // ============================================
  fillText(form, 'History of failures', assessment.siteFactors.historyOfFailures);
  fillText(form, 'Prevailing wind direction', assessment.siteFactors.prevailingWindDirection);
  fillText(form, 'Describe', assessment.siteFactors.siteChanges.describe);

  // Site Changes checkboxes
  checkBox(form, 'Site changes  None', assessment.siteFactors.siteChanges.none);
  checkBox(form, 'Grade change', assessment.siteFactors.siteChanges.gradeChange);
  checkBox(form, 'Site clearing', assessment.siteFactors.siteChanges.siteClearing);
  checkBox(form, 'Changed soil hydrology', assessment.siteFactors.siteChanges.changedSoilHydrology);
  checkBox(form, 'Root cuts', assessment.siteFactors.siteChanges.rootCuts);

  // Soil Conditions checkboxes
  checkBox(form, 'Soil conditions Limited volume', assessment.siteFactors.soilConditions.limitedVolume);
  checkBox(form, 'Saturated', assessment.siteFactors.soilConditions.saturated);
  checkBox(form, 'Shallow', assessment.siteFactors.soilConditions.shallow);
  checkBox(form, 'Compacted', assessment.siteFactors.soilConditions.compacted);
  checkBox(form, 'Pavement over roots', !!assessment.siteFactors.soilConditions.pavementOverRootsPercent);

  // Common Weather checkboxes
  checkBox(form, 'Common weather  Strong winds', assessment.siteFactors.commonWeather.strongWinds);
  checkBox(form, 'Ice', assessment.siteFactors.commonWeather.ice);
  checkBox(form, 'Snow', assessment.siteFactors.commonWeather.snow);
  checkBox(form, 'Heavy rain', assessment.siteFactors.commonWeather.heavyRain);

  // ============================================
  // TREE HEALTH SECTION
  // ============================================
  // Vigor checkboxes
  checkBox(form, 'Vigor Low', assessment.treeHealth.vigor === 'low');
  checkBox(form, 'Normal', assessment.treeHealth.vigor === 'normal');
  checkBox(form, 'High', assessment.treeHealth.vigor === 'high');

  // Foliage
  fillText(form, 'Normal_4', assessment.treeHealth.foliage.normalPercent?.toString());
  checkBox(form, 'Foliage None seasonal', assessment.treeHealth.foliage.noneSeasonal);
  checkBox(form, 'None dead', assessment.treeHealth.foliage.noneDead);

  // Pests
  fillText(form, 'PestsBiotic', assessment.treeHealth.pestsBiotic);

  // Species failure profile
  checkBox(form, 'Species failure profile Branches', assessment.treeHealth.speciesFailureProfile.branches);
  checkBox(form, 'Trunk', assessment.treeHealth.speciesFailureProfile.trunk);
  checkBox(form, 'Roots', assessment.treeHealth.speciesFailureProfile.roots);

  // ============================================
  // LOAD FACTORS SECTION
  // ============================================
  // Wind Exposure
  checkBox(form, 'Wind exposure Protected', assessment.loadFactors.windExposure === 'protected');
  checkBox(form, 'Partial', assessment.loadFactors.windExposure === 'partial');
  checkBox(form, 'Full', assessment.loadFactors.windExposure === 'full');
  checkBox(form, 'Wind funneling', !!assessment.loadFactors.windFunneling);

  // Crown Size
  checkBox(form, 'Relative crown size  Small', assessment.loadFactors.relativeCrownSize === 'small');
  // Medium and Large checkboxes would need to be identified

  // Crown Density
  checkBox(form, 'Crown density Sparse', assessment.loadFactors.crownDensity === 'sparse');
  checkBox(form, 'Normal_2', assessment.loadFactors.crownDensity === 'normal');
  checkBox(form, 'Dense', assessment.loadFactors.crownDensity === 'dense');

  // Interior Branches
  checkBox(form, 'Interior branches Few', assessment.loadFactors.interiorBranches === 'few');
  checkBox(form, 'Normal_3', assessment.loadFactors.interiorBranches === 'normal');
  checkBox(form, 'Dense_2', assessment.loadFactors.interiorBranches === 'dense');

  checkBox(form, 'Unbalanced crown', assessment.crownAndBranches.unbalancedCrown);

  // ============================================
  // CROWN AND BRANCHES SECTION
  // ============================================
  fillText(form, 'LCR', assessment.crownAndBranches.lcrPercent?.toString());

  // Dead twigs/branches
  checkBox(form, 'Dead twigsbranches', !!assessment.crownAndBranches.deadTwigsBranches.percentOverall);
  fillText(form, 'Max dia', assessment.crownAndBranches.deadTwigsBranches.maxDia);

  // Broken/Hangers
  fillText(form, 'Number', assessment.crownAndBranches.brokenHangers.number?.toString());
  fillText(form, 'Max dia_2', assessment.crownAndBranches.brokenHangers.maxDia);

  // Pruning History
  checkBox(form, 'Crown   cleaned', assessment.crownAndBranches.pruningHistory.crownCleaned);
  checkBox(form, 'Reduced', assessment.crownAndBranches.pruningHistory.reduced);
  checkBox(form, 'Thinned', assessment.crownAndBranches.pruningHistory.thinned);
  checkBox(form, 'Topped', assessment.crownAndBranches.pruningHistory.topped);
  checkBox(form, 'Liontailed', assessment.crownAndBranches.pruningHistory.lionTailed);
  checkBox(form, 'Flush cuts', assessment.crownAndBranches.pruningHistory.flushCuts);
  fillText(form, 'Other', assessment.crownAndBranches.pruningHistory.other);

  // Defects
  checkBox(form, 'Cracks', assessment.crownAndBranches.cracks.present);
  checkBox(form, 'Codominant', assessment.crownAndBranches.codominant.present);
  checkBox(form, 'Weak attachments', assessment.crownAndBranches.weakAttachments.present);
  checkBox(form, 'Overextended branches', assessment.crownAndBranches.overExtendedBranches);
  checkBox(form, 'Previous branch failures', assessment.crownAndBranches.previousBranchFailures.present);
  checkBox(form, 'DeadMissing bark', assessment.crownAndBranches.deadMissingBark);
  checkBox(form, 'CankersGallsBurls', assessment.crownAndBranches.cankersGallsBurls);
  checkBox(form, 'Conks', assessment.crownAndBranches.conks);
  checkBox(form, 'Heartwood decay', assessment.crownAndBranches.heartwoodDecay.present);

  // Response Growth - Crown (text field, not checkboxes for this type)
  fillText(form, 'Response growth', assessment.crownAndBranches.responseGrowth);

  fillText(form, 'Conditions of concern', assessment.crownAndBranches.conditionsOfConcern);

  // Crown failure assessment
  if (assessment.crownAndBranches.failureAssessments[0]) {
    const fa = assessment.crownAndBranches.failureAssessments[0];
    fillText(form, 'Part Size', fa.partSize);
    fillText(form, 'Fall Distance', fa.fallDistance);
    // Likelihood of failure checkboxes
    checkBox(form, 'Likelihood of failure Improbable', fa.likelihoodOfFailure === 'improbable');
    checkBox(form, 'Possible', fa.likelihoodOfFailure === 'possible');
    checkBox(form, 'Probable', fa.likelihoodOfFailure === 'probable');
    checkBox(form, 'Imminent', fa.likelihoodOfFailure === 'imminent');
  }

  // ============================================
  // TRUNK SECTION
  // ============================================
  // Trunk defects
  checkBox(form, 'DeadMissing bark_2', assessment.trunk.deadMissingBark);
  checkBox(form, 'Abnormal bark texturecolor', assessment.trunk.abnormalBarkTextureColor);
  checkBox(form, 'Stem girdling', false); // Not in type - using root collar field
  checkBox(form, 'Codominant stems', assessment.trunk.codominantStems);
  checkBox(form, 'Included bark', assessment.trunk.includedBark);
  checkBox(form, 'Cracks_2', assessment.trunk.cracks);
  checkBox(form, 'Decay', false); // General decay not separate in type
  checkBox(form, 'ConksMushrooms', assessment.trunk.conksMushrooms);
  checkBox(form, 'Sapwood damagedecay', assessment.trunk.sapwoodDamageDecay);
  checkBox(form, 'CankersGallsBurls_2', assessment.trunk.cankersGallsBurls);
  checkBox(form, 'Sap ooze', assessment.trunk.sapOoze);
  checkBox(form, 'Cavity', assessment.trunk.cavityNestHole.present);
  checkBox(form, 'Lightning damage', assessment.trunk.lightningDamage);
  checkBox(form, 'Heartwood decay_2', assessment.trunk.heartwoodDecay);
  checkBox(form, 'Poor taper', assessment.trunk.poorTaper);

  // Trunk cavity
  fillText(form, 'circ', assessment.trunk.cavityNestHole.percentCirc?.toString());
  fillText(form, 'Depth', assessment.trunk.cavityNestHole.depth);

  // Lean
  fillText(form, 'Lean', assessment.trunk.lean.degrees?.toString());
  fillText(form, 'Corrected', assessment.trunk.lean.corrected);

  // Response Growth - Trunk (text field)
  fillText(form, 'Response growth_2', assessment.trunk.responseGrowth);

  fillText(form, 'Conditions of concern_2', assessment.trunk.conditionsOfConcern);
  fillText(form, 'Part Size_3', assessment.trunk.partSize);
  fillText(form, 'Fall Distance_2', assessment.trunk.fallDistance);

  // Trunk likelihood of failure
  checkBox(form, 'Likelihood of failure Improbable_3', assessment.trunk.likelihoodOfFailure === 'improbable');
  checkBox(form, 'Possible_3', assessment.trunk.likelihoodOfFailure === 'possible');
  checkBox(form, 'Probable_3', assessment.trunk.likelihoodOfFailure === 'probable');
  checkBox(form, 'Imminent_3', assessment.trunk.likelihoodOfFailure === 'imminent');

  // ============================================
  // ROOTS AND ROOT COLLAR SECTION
  // ============================================
  checkBox(form, 'Collar buriedNot visible', assessment.rootsAndRootCollar.collarBuriedNotVisible);
  checkBox(form, 'Stem girdling', assessment.rootsAndRootCollar.stemGirdling);
  checkBox(form, 'Dead', assessment.rootsAndRootCollar.dead);
  checkBox(form, 'Decay', assessment.rootsAndRootCollar.decay);
  checkBox(form, 'Ooze', assessment.rootsAndRootCollar.ooze);
  checkBox(form, 'ConksMushrooms_2', assessment.rootsAndRootCollar.conksMushrooms);
  checkBox(form, 'Cracks_3', assessment.rootsAndRootCollar.cracks);
  checkBox(form, 'CutDamaged roots', assessment.rootsAndRootCollar.cutDamagedRoots.present);
  checkBox(form, 'Root plate lifting', assessment.rootsAndRootCollar.rootPlateLifting);
  checkBox(form, 'Soil weakness', assessment.rootsAndRootCollar.soilWeakness);

  fillText(form, 'CavityNest hole', assessment.rootsAndRootCollar.cavity.percentCirc?.toString());
  fillText(form, 'Depth_2', assessment.rootsAndRootCollar.depth);
  fillText(form, 'Distance from trunk', assessment.rootsAndRootCollar.cutDamagedRoots.distanceFromTrunk);

  // Response Growth - Roots (text field)
  fillText(form, 'Response growth_3', assessment.rootsAndRootCollar.responseGrowth);

  fillText(form, 'Conditions of concern_3', assessment.rootsAndRootCollar.conditionsOfConcern);
  fillText(form, 'Part Size_4', assessment.rootsAndRootCollar.partSize);
  fillText(form, 'Fall Distance_3', assessment.rootsAndRootCollar.fallDistance);

  // Roots likelihood of failure
  checkBox(form, 'Likelihood of failure Improbable_4', assessment.rootsAndRootCollar.likelihoodOfFailure === 'improbable');
  checkBox(form, 'Possible_4', assessment.rootsAndRootCollar.likelihoodOfFailure === 'possible');
  checkBox(form, 'Probable_4', assessment.rootsAndRootCollar.likelihoodOfFailure === 'probable');
  checkBox(form, 'Imminent_4', assessment.rootsAndRootCollar.likelihoodOfFailure === 'imminent');

  // ============================================
  // RISK CATEGORIZATION (PAGE 2)
  // ============================================
  // Risk rows - these field names are complex, mapping the first few
  if (assessment.riskRows[0]) {
    fillText(form, 'Target Target  number or descriptionRow1', assessment.riskRows[0].target);
    fillText(form, 'Tree partRow1', assessment.riskRows[0].treePart);
    fillText(form, 'Risk rating from Matrix 2Row1', assessment.riskRows[0].riskRating);
  }
  if (assessment.riskRows[1]) {
    fillText(form, 'Target Target  number or descriptionRow2', assessment.riskRows[1].target);
    fillText(form, 'Tree partRow2', assessment.riskRows[1].treePart);
    fillText(form, 'Risk rating from Matrix 2Row2', assessment.riskRows[1].riskRating);
  }

  // ============================================
  // NOTES
  // ============================================
  // Split notes across multiple lines if needed
  const notes = assessment.notes || '';
  const noteLines = notes.split('\n');
  fillText(form, 'Notes explanations descriptions 1', noteLines[0]);
  fillText(form, 'Notes explanations descriptions 2', noteLines[1]);
  fillText(form, 'Notes explanations descriptions 3', noteLines[2]);
  fillText(form, 'Notes explanations descriptions 4', noteLines[3]);
  fillText(form, 'Notes explanations descriptions 5', noteLines[4]);

  // ============================================
  // MITIGATION OPTIONS
  // ============================================
  if (assessment.mitigationOptions[0]) {
    fillText(form, '1', assessment.mitigationOptions[0].description);
    fillText(form, 'Residual risk', assessment.mitigationOptions[0].residualRisk);
  }
  if (assessment.mitigationOptions[1]) {
    fillText(form, '2', assessment.mitigationOptions[1].description);
    fillText(form, 'Residual risk_2', assessment.mitigationOptions[1].residualRisk);
  }
  if (assessment.mitigationOptions[2]) {
    fillText(form, '3', assessment.mitigationOptions[2].description);
    fillText(form, 'Residual risk_3', assessment.mitigationOptions[2].residualRisk);
  }
  if (assessment.mitigationOptions[3]) {
    fillText(form, '4', assessment.mitigationOptions[3].description);
    fillText(form, 'Residual risk_4', assessment.mitigationOptions[3].residualRisk);
  }

  // ============================================
  // OVERALL RATINGS
  // ============================================
  // Overall Risk Rating checkboxes
  checkBox(form, 'Low_2', assessment.overallTreeRiskRating === 'low');
  checkBox(form, 'Moderate_5', assessment.overallTreeRiskRating === 'moderate');
  checkBox(form, 'High_3', assessment.overallTreeRiskRating === 'high');
  checkBox(form, 'Extreme', assessment.overallTreeRiskRating === 'extreme');

  // Data Status
  checkBox(form, 'Final', assessment.dataStatus === 'final');
  checkBox(form, 'Preliminary   Advanced assessment needed', assessment.dataStatus === 'preliminary');
  // Advanced assessment
  checkBox(form, 'No', !assessment.advancedAssessmentNeeded);

  fillText(form, 'YesTypeReason', assessment.advancedAssessmentTypeReason);
  fillText(form, 'Recommended inspection interval', assessment.recommendedInspectionInterval);

  // Residual Risk
  checkBox(form, 'Low_3', assessment.overallResidualRisk === 'low');
  checkBox(form, 'Moderate_6', assessment.overallResidualRisk === 'moderate');
  checkBox(form, 'High_4', assessment.overallResidualRisk === 'high');
  checkBox(form, 'Extreme_2', assessment.overallResidualRisk === 'extreme');

  // ============================================
  // INSPECTION LIMITATIONS
  // ============================================
  checkBox(form, 'Inspection limitations', true); // Header checkbox
  checkBox(form, 'None_2', assessment.inspectionLimitations.none);
  checkBox(form, 'Visibility', assessment.inspectionLimitations.visibility);
  checkBox(form, 'Access', assessment.inspectionLimitations.access);
  checkBox(form, 'Vines', assessment.inspectionLimitations.vines);
  fillText(form, 'Root collar buried  Describe', assessment.inspectionLimitations.describe);

  // Flatten the form so fields can't be edited (optional)
  // form.flatten();

  // Return the PDF bytes
  return pdfDoc.save();
}

/**
 * Helper to safely fill a text field
 */
function fillText(
  form: ReturnType<PDFDocument['getForm']>,
  fieldName: string,
  value: string | undefined | null
) {
  if (!value) return;
  try {
    const field = form.getTextField(fieldName);
    field.setText(value);
  } catch {
    // Field not found - continue silently
    console.debug(`Text field not found: ${fieldName}`);
  }
}

/**
 * Helper to safely check a checkbox
 */
function checkBox(
  form: ReturnType<PDFDocument['getForm']>,
  fieldName: string,
  checked: boolean | undefined
) {
  if (!checked) return;
  try {
    const field = form.getCheckBox(fieldName);
    field.check();
  } catch {
    // Field not found - continue silently
    console.debug(`Checkbox field not found: ${fieldName}`);
  }
}

/**
 * Download the generated PDF
 */
export async function downloadFilledPDF(assessment: Assessment) {
  const pdfBytes = await generateFilledPDF(assessment);
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const filename = `TRAQ-${assessment.header.treeSpecies || 'Assessment'}-${assessment.header.date || 'unknown'}.pdf`.replace(
    /[^a-zA-Z0-9.-]/g,
    '_'
  );

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a comprehensive report PDF with all assessment data and media
 * This creates a new PDF from scratch with complete form information
 */
export async function generateReportPDF(
  assessment: Assessment,
  mediaAttachments?: MediaAttachment[]
): Promise<Uint8Array> {
  const { StandardFonts, rgb } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const lineHeight = 14;
  const colWidth = (pageWidth - margin * 2) / 2;
  let y = pageHeight - margin;
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

  // Helper to add new page
  function addPage() {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    return currentPage;
  }

  // Helper to check if we need a new page
  function checkPage(neededSpace: number = lineHeight) {
    if (y < margin + neededSpace) {
      addPage();
    }
  }

  // Draw section header
  function drawSectionHeader(title: string) {
    checkPage(lineHeight * 3);
    y -= lineHeight;
    currentPage.drawRectangle({
      x: margin - 5,
      y: y - 3,
      width: pageWidth - margin * 2 + 10,
      height: lineHeight + 6,
      color: rgb(0.1, 0.4, 0.1),
    });
    currentPage.drawText(title.toUpperCase(), {
      x: margin,
      y,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
    });
    y -= lineHeight * 1.5;
  }

  // Draw subsection header
  function drawSubsection(title: string) {
    checkPage(lineHeight * 2);
    y -= lineHeight * 0.5;
    currentPage.drawText(title, {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.5, 0.2),
    });
    y -= lineHeight;
  }

  // Draw field with label and value
  function drawField(label: string, value: string | number | null | undefined, indent = 0) {
    checkPage();
    const displayValue = value === null || value === undefined || value === '' ? '-' : String(value);
    currentPage.drawText(`${label}:`, {
      x: margin + indent,
      y,
      size: 9,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    const labelWidth = boldFont.widthOfTextAtSize(`${label}: `, 9);
    currentPage.drawText(displayValue, {
      x: margin + indent + labelWidth,
      y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  }

  // Draw checkbox field
  function drawCheckField(label: string, checked: boolean | undefined, indent = 0) {
    checkPage();
    const symbol = checked ? '☑' : '☐';
    currentPage.drawText(`${symbol} ${label}`, {
      x: margin + indent,
      y,
      size: 9,
      font: font,
      color: checked ? rgb(0, 0.4, 0) : rgb(0.5, 0.5, 0.5),
    });
    y -= lineHeight;
  }

  // Draw two-column checkbox list
  function drawCheckboxGrid(items: Array<{ label: string; checked: boolean | undefined }>) {
    const itemsPerRow = 2;
    for (let i = 0; i < items.length; i += itemsPerRow) {
      checkPage();
      for (let j = 0; j < itemsPerRow && i + j < items.length; j++) {
        const item = items[i + j];
        const symbol = item.checked ? '☑' : '☐';
        currentPage.drawText(`${symbol} ${item.label}`, {
          x: margin + j * colWidth,
          y,
          size: 9,
          font: font,
          color: item.checked ? rgb(0, 0.4, 0) : rgb(0.5, 0.5, 0.5),
        });
      }
      y -= lineHeight;
    }
  }

  // Draw wrapped text
  function drawWrappedText(text: string, maxWidth: number = pageWidth - margin * 2) {
    if (!text) return;
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(testLine, 9) < maxWidth) {
        line = testLine;
      } else {
        if (line) {
          checkPage();
          currentPage.drawText(line, { x: margin, y, size: 9, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
        }
        line = word;
      }
    }
    if (line) {
      checkPage();
      currentPage.drawText(line, { x: margin, y, size: 9, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    }
  }

  // ============================================
  // TITLE PAGE
  // ============================================
  currentPage.drawText('TREE RISK ASSESSMENT', {
    x: margin,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.4, 0.1),
  });
  y -= lineHeight * 2;
  currentPage.drawText('Comprehensive Report', {
    x: margin,
    y,
    size: 16,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= lineHeight * 3;

  // ============================================
  // HEADER INFORMATION
  // ============================================
  drawSectionHeader('Assessment Information');
  drawField('Client', assessment.header.client);
  drawField('Date', assessment.header.date);
  drawField('Time', assessment.header.time);
  drawField('Address/Tree Location', assessment.header.addressTreeLocation);
  drawField('Tree No.', assessment.header.treeNo);
  drawField('Sheet', assessment.header.sheetNumber && assessment.header.sheetTotal
    ? `${assessment.header.sheetNumber} of ${assessment.header.sheetTotal}` : null);
  drawField('Tree Species', assessment.header.treeSpecies);
  drawField('DBH', assessment.header.dbh);
  drawField('Height', assessment.header.height);
  drawField('Crown Spread Diameter', assessment.header.crownSpreadDia);
  drawField('Assessor(s)', assessment.header.assessors);
  drawField('Tools Used', assessment.header.toolsUsed);
  drawField('Time Frame', assessment.header.timeFrame);

  // ============================================
  // TARGET ASSESSMENT
  // ============================================
  if (assessment.targets.length > 0) {
    drawSectionHeader('Target Assessment');
    for (const target of assessment.targets) {
      drawSubsection(`Target ${target.targetNumber}`);
      drawField('Description', target.targetDescription, 10);
      drawField('Protection', target.targetProtection, 10);
      drawField('Occupancy Rate', target.occupancyRate
        ? `${target.occupancyRate} (${['', 'Rare', 'Occasional', 'Frequent', 'Constant'][target.occupancyRate]})`
        : null, 10);
      drawCheckboxGrid([
        { label: 'Within drip line', checked: target.targetZone.withinDripLine },
        { label: 'Within 1x height', checked: target.targetZone.within1xHt },
        { label: 'Within 1.5x height', checked: target.targetZone.within1_5xHt },
        { label: 'Practical to move target', checked: target.practicalToMoveTarget ?? false },
      ]);
    }
  }

  // ============================================
  // SITE FACTORS
  // ============================================
  drawSectionHeader('Site Factors');
  drawField('History of Failures', assessment.siteFactors.historyOfFailures);
  drawField('Prevailing Wind Direction', assessment.siteFactors.prevailingWindDirection);

  drawSubsection('Topography');
  drawCheckField('Flat', assessment.siteFactors.topography.flat, 10);
  if (assessment.siteFactors.topography.slopePercent) {
    drawField('Slope', `${assessment.siteFactors.topography.slopePercent}%`, 10);
  }
  drawField('Aspect', assessment.siteFactors.topography.aspect, 10);

  drawSubsection('Site Changes');
  drawCheckboxGrid([
    { label: 'None', checked: assessment.siteFactors.siteChanges.none },
    { label: 'Grade change', checked: assessment.siteFactors.siteChanges.gradeChange },
    { label: 'Site clearing', checked: assessment.siteFactors.siteChanges.siteClearing },
    { label: 'Changed soil hydrology', checked: assessment.siteFactors.siteChanges.changedSoilHydrology },
    { label: 'Root cuts', checked: assessment.siteFactors.siteChanges.rootCuts },
  ]);
  if (assessment.siteFactors.siteChanges.describe) {
    drawField('Description', assessment.siteFactors.siteChanges.describe, 10);
  }

  drawSubsection('Soil Conditions');
  drawCheckboxGrid([
    { label: 'Limited volume', checked: assessment.siteFactors.soilConditions.limitedVolume },
    { label: 'Saturated', checked: assessment.siteFactors.soilConditions.saturated },
    { label: 'Shallow', checked: assessment.siteFactors.soilConditions.shallow },
    { label: 'Compacted', checked: assessment.siteFactors.soilConditions.compacted },
  ]);
  if (assessment.siteFactors.soilConditions.pavementOverRootsPercent) {
    drawField('Pavement over roots', `${assessment.siteFactors.soilConditions.pavementOverRootsPercent}%`, 10);
  }
  if (assessment.siteFactors.soilConditions.describe) {
    drawField('Description', assessment.siteFactors.soilConditions.describe, 10);
  }

  drawSubsection('Common Weather');
  drawCheckboxGrid([
    { label: 'Strong winds', checked: assessment.siteFactors.commonWeather.strongWinds },
    { label: 'Ice', checked: assessment.siteFactors.commonWeather.ice },
    { label: 'Snow', checked: assessment.siteFactors.commonWeather.snow },
    { label: 'Heavy rain', checked: assessment.siteFactors.commonWeather.heavyRain },
  ]);
  if (assessment.siteFactors.commonWeather.describe) {
    drawField('Description', assessment.siteFactors.commonWeather.describe, 10);
  }

  // ============================================
  // TREE HEALTH AND SPECIES PROFILE
  // ============================================
  drawSectionHeader('Tree Health and Species Profile');
  drawField('Vigor', assessment.treeHealth.vigor?.toUpperCase());

  drawSubsection('Foliage');
  drawCheckboxGrid([
    { label: 'None (seasonal)', checked: assessment.treeHealth.foliage.noneSeasonal },
    { label: 'None (dead)', checked: assessment.treeHealth.foliage.noneDead },
  ]);
  if (assessment.treeHealth.foliage.normalPercent !== null) {
    drawField('Normal', `${assessment.treeHealth.foliage.normalPercent}%`, 10);
  }
  if (assessment.treeHealth.foliage.chloroticPercent !== null) {
    drawField('Chlorotic', `${assessment.treeHealth.foliage.chloroticPercent}%`, 10);
  }
  if (assessment.treeHealth.foliage.necroticPercent !== null) {
    drawField('Necrotic', `${assessment.treeHealth.foliage.necroticPercent}%`, 10);
  }

  drawField('Pests/Biotic', assessment.treeHealth.pestsBiotic);
  drawField('Abiotic', assessment.treeHealth.abiotic);

  drawSubsection('Species Failure Profile');
  drawCheckboxGrid([
    { label: 'Branches', checked: assessment.treeHealth.speciesFailureProfile.branches },
    { label: 'Trunk', checked: assessment.treeHealth.speciesFailureProfile.trunk },
    { label: 'Roots', checked: assessment.treeHealth.speciesFailureProfile.roots },
  ]);
  if (assessment.treeHealth.speciesFailureProfile.describe) {
    drawField('Description', assessment.treeHealth.speciesFailureProfile.describe, 10);
  }

  // ============================================
  // LOAD FACTORS
  // ============================================
  drawSectionHeader('Load Factors');
  drawField('Wind Exposure', assessment.loadFactors.windExposure?.toUpperCase());
  drawField('Wind Funneling', assessment.loadFactors.windFunneling);
  drawField('Relative Crown Size', assessment.loadFactors.relativeCrownSize?.toUpperCase());
  drawField('Crown Density', assessment.loadFactors.crownDensity?.toUpperCase());
  drawField('Interior Branches', assessment.loadFactors.interiorBranches?.toUpperCase());
  drawField('Vines/Mistletoe/Moss', assessment.loadFactors.vinesMistletoeMoss);
  drawField('Recent/Expected Load Changes', assessment.loadFactors.recentOrExpectedChangeInLoadFactors);

  // ============================================
  // CROWN AND BRANCHES
  // ============================================
  drawSectionHeader('Crown and Branches');
  drawCheckField('Unbalanced Crown', assessment.crownAndBranches.unbalancedCrown);
  drawField('Live Crown Ratio (LCR)', assessment.crownAndBranches.lcrPercent
    ? `${assessment.crownAndBranches.lcrPercent}%` : null);

  drawSubsection('Dead Twigs/Branches');
  drawCheckField('Present', assessment.crownAndBranches.deadTwigsBranches.present, 10);
  drawField('Percent Overall', assessment.crownAndBranches.deadTwigsBranches.percentOverall
    ? `${assessment.crownAndBranches.deadTwigsBranches.percentOverall}%` : null, 10);
  drawField('Max Diameter', assessment.crownAndBranches.deadTwigsBranches.maxDia, 10);

  drawSubsection('Broken/Hangers');
  drawCheckField('Present', assessment.crownAndBranches.brokenHangers.present, 10);
  drawField('Number', assessment.crownAndBranches.brokenHangers.number, 10);
  drawField('Max Diameter', assessment.crownAndBranches.brokenHangers.maxDia, 10);

  drawSubsection('Pruning History');
  drawCheckboxGrid([
    { label: 'Crown cleaned', checked: assessment.crownAndBranches.pruningHistory.crownCleaned },
    { label: 'Thinned', checked: assessment.crownAndBranches.pruningHistory.thinned },
    { label: 'Raised', checked: assessment.crownAndBranches.pruningHistory.raised },
    { label: 'Reduced', checked: assessment.crownAndBranches.pruningHistory.reduced },
    { label: 'Topped', checked: assessment.crownAndBranches.pruningHistory.topped },
    { label: 'Lion-tailed', checked: assessment.crownAndBranches.pruningHistory.lionTailed },
    { label: 'Flush cuts', checked: assessment.crownAndBranches.pruningHistory.flushCuts },
  ]);
  if (assessment.crownAndBranches.pruningHistory.other) {
    drawField('Other', assessment.crownAndBranches.pruningHistory.other, 10);
  }

  drawSubsection('Defects');
  drawCheckboxGrid([
    { label: 'Cracks', checked: assessment.crownAndBranches.cracks.present },
    { label: 'Lightning damage', checked: assessment.crownAndBranches.lightningDamage },
    { label: 'Codominant', checked: assessment.crownAndBranches.codominant.present },
    { label: 'Included bark', checked: assessment.crownAndBranches.includedBark },
    { label: 'Weak attachments', checked: assessment.crownAndBranches.weakAttachments.present },
    { label: 'Over-extended branches', checked: assessment.crownAndBranches.overExtendedBranches },
    { label: 'Cavity/Nest hole', checked: assessment.crownAndBranches.cavityNestHole.present },
    { label: 'Previous branch failures', checked: assessment.crownAndBranches.previousBranchFailures.present },
    { label: 'Similar branches present', checked: assessment.crownAndBranches.similarBranchesPresent },
    { label: 'Dead/Missing bark', checked: assessment.crownAndBranches.deadMissingBark },
    { label: 'Cankers/Galls/Burls', checked: assessment.crownAndBranches.cankersGallsBurls },
    { label: 'Sapwood damage/decay', checked: assessment.crownAndBranches.sapwoodDamageDecay },
    { label: 'Conks', checked: assessment.crownAndBranches.conks },
    { label: 'Heartwood decay', checked: assessment.crownAndBranches.heartwoodDecay.present },
  ]);

  if (assessment.crownAndBranches.cracks.describe) {
    drawField('Cracks description', assessment.crownAndBranches.cracks.describe, 10);
  }
  if (assessment.crownAndBranches.codominant.describe) {
    drawField('Codominant description', assessment.crownAndBranches.codominant.describe, 10);
  }
  if (assessment.crownAndBranches.weakAttachments.describe) {
    drawField('Weak attachments description', assessment.crownAndBranches.weakAttachments.describe, 10);
  }
  if (assessment.crownAndBranches.previousBranchFailures.describe) {
    drawField('Previous failures description', assessment.crownAndBranches.previousBranchFailures.describe, 10);
  }
  if (assessment.crownAndBranches.heartwoodDecay.describe) {
    drawField('Heartwood decay description', assessment.crownAndBranches.heartwoodDecay.describe, 10);
  }
  if (assessment.crownAndBranches.cavityNestHole.percentCirc) {
    drawField('Cavity % circumference', `${assessment.crownAndBranches.cavityNestHole.percentCirc}%`, 10);
  }

  drawField('Response Growth', assessment.crownAndBranches.responseGrowth);
  drawField('Conditions of Concern', assessment.crownAndBranches.conditionsOfConcern);

  // Crown failure assessments
  if (assessment.crownAndBranches.failureAssessments.length > 0) {
    drawSubsection('Branch Failure Assessment');
    for (const fa of assessment.crownAndBranches.failureAssessments) {
      drawField('Part Size', fa.partSize, 10);
      drawField('Fall Distance', fa.fallDistance, 10);
      drawField('Load on Defect', fa.loadOnDefect?.toUpperCase(), 10);
      drawField('Likelihood of Failure', fa.likelihoodOfFailure?.toUpperCase(), 10);
      y -= lineHeight * 0.5;
    }
  }

  // ============================================
  // TRUNK
  // ============================================
  drawSectionHeader('Trunk Defects');
  drawCheckboxGrid([
    { label: 'Dead/Missing bark', checked: assessment.trunk.deadMissingBark },
    { label: 'Abnormal bark texture/color', checked: assessment.trunk.abnormalBarkTextureColor },
    { label: 'Codominant stems', checked: assessment.trunk.codominantStems },
    { label: 'Included bark', checked: assessment.trunk.includedBark },
    { label: 'Cracks', checked: assessment.trunk.cracks },
    { label: 'Sapwood damage/decay', checked: assessment.trunk.sapwoodDamageDecay },
    { label: 'Cankers/Galls/Burls', checked: assessment.trunk.cankersGallsBurls },
    { label: 'Sap ooze', checked: assessment.trunk.sapOoze },
    { label: 'Lightning damage', checked: assessment.trunk.lightningDamage },
    { label: 'Heartwood decay', checked: assessment.trunk.heartwoodDecay },
    { label: 'Conks/Mushrooms', checked: assessment.trunk.conksMushrooms },
    { label: 'Poor taper', checked: assessment.trunk.poorTaper },
  ]);

  drawSubsection('Cavity/Nest Hole');
  drawCheckField('Present', assessment.trunk.cavityNestHole.present, 10);
  if (assessment.trunk.cavityNestHole.percentCirc) {
    drawField('% Circumference', `${assessment.trunk.cavityNestHole.percentCirc}%`, 10);
  }
  drawField('Depth', assessment.trunk.cavityNestHole.depth, 10);

  drawSubsection('Lean');
  drawCheckField('Present', assessment.trunk.lean.present, 10);
  if (assessment.trunk.lean.degrees) {
    drawField('Degrees', `${assessment.trunk.lean.degrees}°`, 10);
  }
  drawField('Corrected', assessment.trunk.lean.corrected, 10);

  drawField('Response Growth', assessment.trunk.responseGrowth);
  drawField('Conditions of Concern', assessment.trunk.conditionsOfConcern);

  drawSubsection('Trunk Failure Assessment');
  drawField('Part Size', assessment.trunk.partSize, 10);
  drawField('Fall Distance', assessment.trunk.fallDistance, 10);
  drawField('Load on Defect', assessment.trunk.loadOnDefect?.toUpperCase(), 10);
  drawField('Likelihood of Failure', assessment.trunk.likelihoodOfFailure?.toUpperCase(), 10);

  // ============================================
  // ROOTS AND ROOT COLLAR
  // ============================================
  drawSectionHeader('Roots and Root Collar');
  drawCheckboxGrid([
    { label: 'Collar buried/Not visible', checked: assessment.rootsAndRootCollar.collarBuriedNotVisible },
    { label: 'Stem girdling', checked: assessment.rootsAndRootCollar.stemGirdling },
    { label: 'Dead', checked: assessment.rootsAndRootCollar.dead },
    { label: 'Decay', checked: assessment.rootsAndRootCollar.decay },
    { label: 'Conks/Mushrooms', checked: assessment.rootsAndRootCollar.conksMushrooms },
    { label: 'Ooze', checked: assessment.rootsAndRootCollar.ooze },
    { label: 'Cracks', checked: assessment.rootsAndRootCollar.cracks },
    { label: 'Root plate lifting', checked: assessment.rootsAndRootCollar.rootPlateLifting },
    { label: 'Soil weakness', checked: assessment.rootsAndRootCollar.soilWeakness },
  ]);

  drawField('Depth', assessment.rootsAndRootCollar.depth);

  drawSubsection('Cavity');
  drawCheckField('Present', assessment.rootsAndRootCollar.cavity.present, 10);
  if (assessment.rootsAndRootCollar.cavity.percentCirc) {
    drawField('% Circumference', `${assessment.rootsAndRootCollar.cavity.percentCirc}%`, 10);
  }

  drawSubsection('Cut/Damaged Roots');
  drawCheckField('Present', assessment.rootsAndRootCollar.cutDamagedRoots.present, 10);
  drawField('Distance from Trunk', assessment.rootsAndRootCollar.cutDamagedRoots.distanceFromTrunk, 10);

  drawField('Response Growth', assessment.rootsAndRootCollar.responseGrowth);
  drawField('Conditions of Concern', assessment.rootsAndRootCollar.conditionsOfConcern);

  drawSubsection('Roots Failure Assessment');
  drawField('Part Size', assessment.rootsAndRootCollar.partSize, 10);
  drawField('Fall Distance', assessment.rootsAndRootCollar.fallDistance, 10);
  drawField('Load on Defect', assessment.rootsAndRootCollar.loadOnDefect?.toUpperCase(), 10);
  drawField('Likelihood of Failure', assessment.rootsAndRootCollar.likelihoodOfFailure?.toUpperCase(), 10);

  // ============================================
  // RISK CATEGORIZATION
  // ============================================
  if (assessment.riskRows.length > 0) {
    drawSectionHeader('Risk Categorization');
    for (let i = 0; i < assessment.riskRows.length; i++) {
      const row = assessment.riskRows[i];
      drawSubsection(`Risk Row ${i + 1}`);
      drawField('Target', row.target, 10);
      drawField('Tree Part', row.treePart?.toUpperCase(), 10);
      drawField('Conditions of Concern', row.conditionsOfConcern, 10);
      drawField('Likelihood of Failure', row.likelihoodOfFailure?.toUpperCase(), 10);
      drawField('Likelihood of Impact', row.likelihoodOfImpact?.toUpperCase(), 10);
      drawField('Failure & Impact', row.failureAndImpact?.toUpperCase(), 10);
      drawField('Consequences', row.consequences?.toUpperCase(), 10);
      drawField('Risk Rating', row.riskRating?.toUpperCase(), 10);
    }
  }

  // ============================================
  // MITIGATION OPTIONS
  // ============================================
  if (assessment.mitigationOptions.length > 0) {
    drawSectionHeader('Mitigation Options');
    for (const opt of assessment.mitigationOptions) {
      drawSubsection(`Option ${opt.optionNumber}`);
      drawField('Description', opt.description, 10);
      drawField('Residual Risk', opt.residualRisk?.toUpperCase(), 10);
    }
  }

  // ============================================
  // OVERALL RATINGS
  // ============================================
  drawSectionHeader('Overall Ratings');

  // Highlight overall risk rating
  checkPage(lineHeight * 3);
  const riskColor = assessment.overallTreeRiskRating === 'extreme' ? rgb(0.8, 0, 0)
    : assessment.overallTreeRiskRating === 'high' ? rgb(0.9, 0.5, 0)
    : assessment.overallTreeRiskRating === 'moderate' ? rgb(0.8, 0.7, 0)
    : rgb(0, 0.6, 0);

  currentPage.drawRectangle({
    x: margin,
    y: y - 5,
    width: 200,
    height: lineHeight + 10,
    color: riskColor,
    opacity: 0.2,
  });
  currentPage.drawText(`OVERALL TREE RISK RATING: ${(assessment.overallTreeRiskRating || 'Not calculated').toUpperCase()}`, {
    x: margin + 5,
    y,
    size: 11,
    font: boldFont,
    color: riskColor,
  });
  y -= lineHeight * 2;

  drawField('Overall Residual Risk', assessment.overallResidualRisk?.toUpperCase());
  drawField('Data Status', assessment.dataStatus?.toUpperCase());
  drawCheckField('Advanced Assessment Needed', assessment.advancedAssessmentNeeded);
  if (assessment.advancedAssessmentTypeReason) {
    drawField('Type/Reason', assessment.advancedAssessmentTypeReason, 10);
  }
  drawField('Recommended Inspection Interval', assessment.recommendedInspectionInterval);

  // ============================================
  // INSPECTION LIMITATIONS
  // ============================================
  drawSectionHeader('Inspection Limitations');
  drawCheckboxGrid([
    { label: 'None', checked: assessment.inspectionLimitations.none },
    { label: 'Visibility', checked: assessment.inspectionLimitations.visibility },
    { label: 'Access', checked: assessment.inspectionLimitations.access },
    { label: 'Vines', checked: assessment.inspectionLimitations.vines },
    { label: 'Root collar buried', checked: assessment.inspectionLimitations.rootCollarBuried },
  ]);
  if (assessment.inspectionLimitations.describe) {
    drawField('Description', assessment.inspectionLimitations.describe);
  }

  // ============================================
  // NOTES
  // ============================================
  if (assessment.notes) {
    drawSectionHeader('Notes');
    drawWrappedText(assessment.notes);
  }

  // ============================================
  // MEDIA ATTACHMENTS
  // ============================================
  if (mediaAttachments && mediaAttachments.length > 0) {
    // Start a new page for media
    addPage();
    drawSectionHeader('Media Attachments');

    const photos = mediaAttachments.filter(m => m.type === 'photo');
    const documents = mediaAttachments.filter(m => m.type === 'document');
    const videos = mediaAttachments.filter(m => m.type === 'video');

    // Embed photos
    if (photos.length > 0) {
      drawSubsection(`Photos (${photos.length})`);

      for (const photo of photos) {
        try {
          const imageBytes = await photo.blob.arrayBuffer();
          const uint8Array = new Uint8Array(imageBytes);

          let image;
          if (photo.mimeType === 'image/png') {
            image = await pdfDoc.embedPng(uint8Array);
          } else if (photo.mimeType === 'image/jpeg' || photo.mimeType === 'image/jpg') {
            image = await pdfDoc.embedJpg(uint8Array);
          } else {
            // Try as JPEG first, then PNG
            try {
              image = await pdfDoc.embedJpg(uint8Array);
            } catch {
              try {
                image = await pdfDoc.embedPng(uint8Array);
              } catch {
                // Can't embed this image type
                drawField('Image', `${photo.filename} (unsupported format: ${photo.mimeType})`);
                continue;
              }
            }
          }

          // Calculate image dimensions to fit on page
          const maxWidth = pageWidth - margin * 2;
          const maxHeight = 300;
          const aspectRatio = image.width / image.height;

          let imgWidth = maxWidth;
          let imgHeight = imgWidth / aspectRatio;

          if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = imgHeight * aspectRatio;
          }

          // Check if we need a new page
          if (y - imgHeight - lineHeight * 2 < margin) {
            addPage();
          }

          // Draw image
          y -= imgHeight;
          currentPage.drawImage(image, {
            x: margin + (maxWidth - imgWidth) / 2,
            y,
            width: imgWidth,
            height: imgHeight,
          });
          y -= lineHeight;

          // Caption
          if (photo.caption) {
            currentPage.drawText(photo.caption, {
              x: margin,
              y,
              size: 9,
              font: font,
              color: rgb(0.3, 0.3, 0.3),
            });
            y -= lineHeight;
          }

          // Filename and metadata
          currentPage.drawText(`${photo.filename} | ${new Date(photo.createdAt).toLocaleString()}`, {
            x: margin,
            y,
            size: 8,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
          });
          y -= lineHeight * 2;

        } catch {
          // If image embedding fails, show placeholder
          drawField('Image', `${photo.filename} (could not embed)`);
          if (photo.caption) {
            drawField('Caption', photo.caption, 10);
          }
        }
      }
    }

    // List documents
    if (documents.length > 0) {
      checkPage(lineHeight * 3);
      drawSubsection(`Documents (${documents.length})`);

      for (const doc of documents) {
        checkPage(lineHeight * 4);

        // Draw document info box
        currentPage.drawRectangle({
          x: margin,
          y: y - lineHeight * 2,
          width: pageWidth - margin * 2,
          height: lineHeight * 3,
          borderColor: rgb(0.3, 0.3, 0.3),
          borderWidth: 1,
          color: rgb(0.95, 0.95, 0.95),
        });

        currentPage.drawText(`📄 ${doc.filename}`, {
          x: margin + 10,
          y: y - lineHeight * 0.5,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        });

        currentPage.drawText(`Type: ${doc.mimeType} | Created: ${new Date(doc.createdAt).toLocaleString()}`, {
          x: margin + 10,
          y: y - lineHeight * 1.5,
          size: 8,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });

        if (doc.caption) {
          currentPage.drawText(`Caption: ${doc.caption}`, {
            x: margin + 10,
            y: y - lineHeight * 2.3,
            size: 8,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          });
        }

        y -= lineHeight * 4;
      }
    }

    // List videos
    if (videos.length > 0) {
      checkPage(lineHeight * 3);
      drawSubsection(`Videos (${videos.length})`);

      for (const video of videos) {
        checkPage(lineHeight * 4);

        // Draw video info box
        currentPage.drawRectangle({
          x: margin,
          y: y - lineHeight * 2,
          width: pageWidth - margin * 2,
          height: lineHeight * 3,
          borderColor: rgb(0.3, 0.3, 0.7),
          borderWidth: 1,
          color: rgb(0.95, 0.95, 1),
        });

        currentPage.drawText(`🎬 ${video.filename}`, {
          x: margin + 10,
          y: y - lineHeight * 0.5,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        });

        currentPage.drawText(`Type: ${video.mimeType} | Created: ${new Date(video.createdAt).toLocaleString()}`, {
          x: margin + 10,
          y: y - lineHeight * 1.5,
          size: 8,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });

        if (video.caption) {
          currentPage.drawText(`Caption: ${video.caption}`, {
            x: margin + 10,
            y: y - lineHeight * 2.3,
            size: 8,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          });
        }

        y -= lineHeight * 4;
      }
    }
  }

  // ============================================
  // FOOTER ON ALL PAGES
  // ============================================
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    page.drawText(`Generated: ${new Date().toLocaleString()} | Page ${i + 1} of ${pages.length}`, {
      x: margin,
      y: 25,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText('TRAQ Assessment Report', {
      x: pageWidth - margin - font.widthOfTextAtSize('TRAQ Assessment Report', 8),
      y: 25,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  return pdfDoc.save();
}

/**
 * Download a comprehensive report PDF with all assessment data and media
 * Fetches media attachments from IndexedDB automatically
 */
export async function downloadReportPDF(assessment: Assessment) {
  // Fetch media attachments from IndexedDB
  let mediaAttachments: MediaAttachment[] = [];
  try {
    mediaAttachments = await db.media
      .where('assessmentId')
      .equals(assessment.id)
      .toArray();
  } catch (error) {
    console.warn('Could not fetch media attachments:', error);
  }

  const pdfBytes = await generateReportPDF(assessment, mediaAttachments);
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const filename = `TRAQ-Report-${assessment.header.treeSpecies || 'Assessment'}-${assessment.header.date || 'unknown'}.pdf`.replace(
    /[^a-zA-Z0-9.-]/g,
    '_'
  );

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

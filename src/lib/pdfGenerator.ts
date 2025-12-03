import { PDFDocument } from 'pdf-lib';
import type { Assessment } from '@/types/traq';

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
 * Generate a custom report PDF with all assessment data
 * This creates a new PDF from scratch rather than filling a template
 */
export async function generateReportPDF(assessment: Assessment): Promise<Uint8Array> {
  const { StandardFonts, rgb } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const lineHeight = 14;
  let y = pageHeight - margin;

  function addPage() {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    return page;
  }

  function drawSection(page: ReturnType<typeof pdfDoc.addPage>, title: string) {
    y -= lineHeight;
    if (y < margin + lineHeight * 2) {
      page = addPage();
    }
    page.drawText(title, {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.4, 0.1),
    });
    y -= lineHeight * 1.5;
    return page;
  }

  function drawField(
    page: ReturnType<typeof pdfDoc.addPage>,
    label: string,
    value: string | null | undefined
  ) {
    if (y < margin + lineHeight) {
      page = addPage();
    }
    page.drawText(`${label}: `, {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    const labelWidth = boldFont.widthOfTextAtSize(`${label}: `, 10);
    page.drawText(value || '-', {
      x: margin + labelWidth,
      y,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= lineHeight;
    return page;
  }

  let page = addPage();

  // Title
  page.drawText('Tree Risk Assessment Report', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.4, 0.1),
  });
  y -= lineHeight * 2;

  // Header Info
  page = drawSection(page, 'Assessment Information');
  page = drawField(page, 'Client', assessment.header.client);
  page = drawField(page, 'Date', assessment.header.date);
  page = drawField(page, 'Location', assessment.header.addressTreeLocation);
  page = drawField(page, 'Tree Species', assessment.header.treeSpecies);
  page = drawField(page, 'Tree No', assessment.header.treeNo);
  page = drawField(page, 'DBH', assessment.header.dbh);
  page = drawField(page, 'Height', assessment.header.height);
  page = drawField(page, 'Crown Spread', assessment.header.crownSpreadDia);
  page = drawField(page, 'Assessor(s)', assessment.header.assessors);
  page = drawField(page, 'Time Frame', assessment.header.timeFrame);

  // Overall Risk Rating
  page = drawSection(page, 'Risk Summary');
  page = drawField(
    page,
    'Overall Tree Risk Rating',
    assessment.overallTreeRiskRating?.toUpperCase() || 'Not calculated'
  );
  page = drawField(
    page,
    'Overall Residual Risk',
    assessment.overallResidualRisk || 'Not specified'
  );
  page = drawField(page, 'Recommended Inspection Interval', assessment.recommendedInspectionInterval);

  // Notes
  if (assessment.notes) {
    page = drawSection(page, 'Notes');
    const words = assessment.notes.split(' ');
    let line = '';
    for (const word of words) {
      if (font.widthOfTextAtSize(line + ' ' + word, 10) < pageWidth - margin * 2) {
        line += (line ? ' ' : '') + word;
      } else {
        if (y < margin + lineHeight) page = addPage();
        page.drawText(line, { x: margin, y, size: 10, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
        line = word;
      }
    }
    if (line) {
      if (y < margin + lineHeight) page = addPage();
      page.drawText(line, { x: margin, y, size: 10, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    }
  }

  // Footer
  y = margin;
  page.drawText(`Generated: ${new Date().toLocaleString()}`, {
    x: margin,
    y,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  return pdfDoc.save();
}

/**
 * Download a custom report PDF
 */
export async function downloadReportPDF(assessment: Assessment) {
  const pdfBytes = await generateReportPDF(assessment);
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

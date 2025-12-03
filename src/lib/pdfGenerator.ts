import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Assessment } from '@/types/traq';
import { LABELS } from './riskMatrix';

/**
 * PDF Form Field Mapping
 * Maps assessment data paths to PDF form field names
 * The field names need to match the actual form field names in the PDF
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

  try {
    // Try to fill text fields - field names will vary based on PDF
    fillTextField(form, 'Client', assessment.header.client);
    fillTextField(form, 'Date', assessment.header.date);
    fillTextField(form, 'Time', assessment.header.time);
    fillTextField(form, 'Address  Tree Location', assessment.header.addressTreeLocation);
    fillTextField(form, 'Tree No', assessment.header.treeNo);
    fillTextField(form, 'Sheet', assessment.header.sheetNumber.toString());
    fillTextField(form, 'of', assessment.header.sheetTotal.toString());
    fillTextField(form, 'Tree Species', assessment.header.treeSpecies);
    fillTextField(form, 'DBH', assessment.header.dbh);
    fillTextField(form, 'Height', assessment.header.height);
    fillTextField(form, 'Crown Spread', assessment.header.crownSpreadDia);
    fillTextField(form, 'Assessors', assessment.header.assessors);
    fillTextField(form, 'Tools Used', assessment.header.toolsUsed);
    fillTextField(form, 'Time Frame', assessment.header.timeFrame);

    // Target Assessments
    for (let i = 0; i < assessment.targets.length; i++) {
      const target = assessment.targets[i];
      const num = i + 1;
      fillTextField(form, `Target ${num}`, target.targetDescription);
      fillTextField(form, `Target Protection ${num}`, target.targetProtection);

      // Occupancy rate
      if (target.occupancyRate) {
        fillTextField(form, `Occupancy ${num}`, target.occupancyRate.toString());
      }
    }

    // Site Factors
    fillTextField(form, 'History of Failures', assessment.siteFactors.historyOfFailures);
    fillTextField(form, 'Prevailing Wind Direction', assessment.siteFactors.prevailingWindDirection);

    // Topography
    if (assessment.siteFactors.topography.slopePercent) {
      fillTextField(form, 'Slope', assessment.siteFactors.topography.slopePercent.toString());
    }
    fillTextField(form, 'Aspect', assessment.siteFactors.topography.aspect);

    // Site Changes description
    fillTextField(form, 'Site Changes Describe', assessment.siteFactors.siteChanges.describe);

    // Soil Conditions
    if (assessment.siteFactors.soilConditions.pavementOverRootsPercent) {
      fillTextField(
        form,
        'Pavement Over Roots',
        assessment.siteFactors.soilConditions.pavementOverRootsPercent.toString()
      );
    }
    fillTextField(form, 'Soil Conditions Describe', assessment.siteFactors.soilConditions.describe);

    // Weather
    fillTextField(form, 'Weather Describe', assessment.siteFactors.commonWeather.describe);

    // Tree Health
    if (assessment.treeHealth.vigor) {
      fillTextField(form, 'Vigor', LABELS.vigor[assessment.treeHealth.vigor]);
    }
    if (assessment.treeHealth.foliage.normalPercent) {
      fillTextField(form, 'Normal', assessment.treeHealth.foliage.normalPercent.toString());
    }
    if (assessment.treeHealth.foliage.chloroticPercent) {
      fillTextField(form, 'Chlorotic', assessment.treeHealth.foliage.chloroticPercent.toString());
    }
    if (assessment.treeHealth.foliage.necroticPercent) {
      fillTextField(form, 'Necrotic', assessment.treeHealth.foliage.necroticPercent.toString());
    }
    fillTextField(form, 'Pests Biotic', assessment.treeHealth.pestsBiotic);
    fillTextField(form, 'Abiotic', assessment.treeHealth.abiotic);
    fillTextField(form, 'Species Failure Profile', assessment.treeHealth.speciesFailureProfile.describe);

    // Load Factors
    if (assessment.loadFactors.windExposure) {
      fillTextField(form, 'Wind Exposure', LABELS.windExposure[assessment.loadFactors.windExposure]);
    }
    fillTextField(form, 'Wind Funneling', assessment.loadFactors.windFunneling);
    if (assessment.loadFactors.relativeCrownSize) {
      fillTextField(form, 'Relative Crown Size', LABELS.crownSize[assessment.loadFactors.relativeCrownSize]);
    }
    if (assessment.loadFactors.crownDensity) {
      fillTextField(form, 'Crown Density', LABELS.density[assessment.loadFactors.crownDensity]);
    }
    if (assessment.loadFactors.interiorBranches) {
      fillTextField(form, 'Interior Branches', LABELS.interiorBranches[assessment.loadFactors.interiorBranches]);
    }
    fillTextField(form, 'Vines Mistletoe Moss', assessment.loadFactors.vinesMistletoeMoss);
    fillTextField(form, 'Recent Expected Change', assessment.loadFactors.recentOrExpectedChangeInLoadFactors);

    // Crown and Branches
    if (assessment.crownAndBranches.lcrPercent) {
      fillTextField(form, 'LCR', assessment.crownAndBranches.lcrPercent.toString());
    }
    if (assessment.crownAndBranches.deadTwigsBranches.percentOverall) {
      fillTextField(
        form,
        'Dead Twigs Percent',
        assessment.crownAndBranches.deadTwigsBranches.percentOverall.toString()
      );
    }
    fillTextField(form, 'Dead Twigs Max Dia', assessment.crownAndBranches.deadTwigsBranches.maxDia);
    if (assessment.crownAndBranches.brokenHangers.number) {
      fillTextField(form, 'Hangers Number', assessment.crownAndBranches.brokenHangers.number.toString());
    }
    fillTextField(form, 'Hangers Max Dia', assessment.crownAndBranches.brokenHangers.maxDia);
    fillTextField(form, 'Pruning Other', assessment.crownAndBranches.pruningHistory.other);
    fillTextField(form, 'Cracks Describe', assessment.crownAndBranches.cracks.describe);
    fillTextField(form, 'Codominant Describe', assessment.crownAndBranches.codominant.describe);
    fillTextField(form, 'Weak Attachments Describe', assessment.crownAndBranches.weakAttachments.describe);
    if (assessment.crownAndBranches.cavityNestHole.percentCirc) {
      fillTextField(form, 'Cavity Percent', assessment.crownAndBranches.cavityNestHole.percentCirc.toString());
    }
    fillTextField(form, 'Previous Failures Describe', assessment.crownAndBranches.previousBranchFailures.describe);
    fillTextField(form, 'Heartwood Decay Describe', assessment.crownAndBranches.heartwoodDecay.describe);
    fillTextField(form, 'Response Growth Crown', assessment.crownAndBranches.responseGrowth);
    fillTextField(form, 'Conditions Crown', assessment.crownAndBranches.conditionsOfConcern);

    // Branch Failure Assessment
    for (let i = 0; i < assessment.crownAndBranches.failureAssessments.length; i++) {
      const fa = assessment.crownAndBranches.failureAssessments[i];
      const num = i + 1;
      fillTextField(form, `Branch Part Size ${num}`, fa.partSize);
      fillTextField(form, `Branch Fall Distance ${num}`, fa.fallDistance);
      if (fa.loadOnDefect) {
        fillTextField(form, `Branch Load ${num}`, LABELS.loadOnDefect[fa.loadOnDefect]);
      }
      if (fa.likelihoodOfFailure) {
        fillTextField(form, `Branch LOF ${num}`, LABELS.likelihoodOfFailure[fa.likelihoodOfFailure]);
      }
    }

    // Trunk
    if (assessment.trunk.cavityNestHole.percentCirc) {
      fillTextField(form, 'Trunk Cavity Percent', assessment.trunk.cavityNestHole.percentCirc.toString());
    }
    fillTextField(form, 'Trunk Cavity Depth', assessment.trunk.cavityNestHole.depth);
    if (assessment.trunk.lean.degrees) {
      fillTextField(form, 'Lean Degrees', assessment.trunk.lean.degrees.toString());
    }
    fillTextField(form, 'Lean Corrected', assessment.trunk.lean.corrected);
    fillTextField(form, 'Response Growth Trunk', assessment.trunk.responseGrowth);
    fillTextField(form, 'Conditions Trunk', assessment.trunk.conditionsOfConcern);
    fillTextField(form, 'Trunk Part Size', assessment.trunk.partSize);
    fillTextField(form, 'Trunk Fall Distance', assessment.trunk.fallDistance);
    if (assessment.trunk.loadOnDefect) {
      fillTextField(form, 'Trunk Load', LABELS.loadOnDefect[assessment.trunk.loadOnDefect]);
    }
    if (assessment.trunk.likelihoodOfFailure) {
      fillTextField(form, 'Trunk LOF', LABELS.likelihoodOfFailure[assessment.trunk.likelihoodOfFailure]);
    }

    // Roots
    fillTextField(form, 'Collar Depth', assessment.rootsAndRootCollar.depth);
    if (assessment.rootsAndRootCollar.cavity.percentCirc) {
      fillTextField(form, 'Root Cavity Percent', assessment.rootsAndRootCollar.cavity.percentCirc.toString());
    }
    fillTextField(form, 'Cut Roots Distance', assessment.rootsAndRootCollar.cutDamagedRoots.distanceFromTrunk);
    fillTextField(form, 'Response Growth Roots', assessment.rootsAndRootCollar.responseGrowth);
    fillTextField(form, 'Conditions Roots', assessment.rootsAndRootCollar.conditionsOfConcern);
    fillTextField(form, 'Roots Part Size', assessment.rootsAndRootCollar.partSize);
    fillTextField(form, 'Roots Fall Distance', assessment.rootsAndRootCollar.fallDistance);
    if (assessment.rootsAndRootCollar.loadOnDefect) {
      fillTextField(form, 'Roots Load', LABELS.loadOnDefect[assessment.rootsAndRootCollar.loadOnDefect]);
    }
    if (assessment.rootsAndRootCollar.likelihoodOfFailure) {
      fillTextField(form, 'Roots LOF', LABELS.likelihoodOfFailure[assessment.rootsAndRootCollar.likelihoodOfFailure]);
    }

    // Risk Categorization Rows (Page 2)
    for (let i = 0; i < assessment.riskRows.length && i < 4; i++) {
      const row = assessment.riskRows[i];
      const num = i + 1;
      fillTextField(form, `Risk Target ${num}`, row.target);
      if (row.treePart) {
        fillTextField(form, `Risk Part ${num}`, LABELS.treePart[row.treePart]);
      }
      fillTextField(form, `Risk Conditions ${num}`, row.conditionsOfConcern);
      if (row.likelihoodOfFailure) {
        fillTextField(form, `Risk LOF ${num}`, LABELS.likelihoodOfFailure[row.likelihoodOfFailure]);
      }
      if (row.likelihoodOfImpact) {
        fillTextField(form, `Risk LOI ${num}`, LABELS.likelihoodOfImpact[row.likelihoodOfImpact]);
      }
      if (row.failureAndImpact) {
        fillTextField(form, `Risk FI ${num}`, LABELS.failureAndImpact[row.failureAndImpact]);
      }
      if (row.consequences) {
        fillTextField(form, `Risk Consequences ${num}`, LABELS.consequences[row.consequences]);
      }
      if (row.riskRating) {
        fillTextField(form, `Risk Rating ${num}`, LABELS.riskRating[row.riskRating]);
      }
    }

    // Notes
    fillTextField(form, 'Notes', assessment.notes);

    // Mitigation Options
    for (let i = 0; i < assessment.mitigationOptions.length && i < 4; i++) {
      const option = assessment.mitigationOptions[i];
      const num = i + 1;
      fillTextField(form, `Mitigation ${num}`, option.description);
      if (option.residualRisk) {
        fillTextField(form, `Residual Risk ${num}`, option.residualRisk);
      }
    }

    // Overall Ratings
    if (assessment.overallTreeRiskRating) {
      fillTextField(form, 'Overall Risk Rating', LABELS.riskRating[assessment.overallTreeRiskRating]);
    }
    if (assessment.overallResidualRisk) {
      fillTextField(form, 'Overall Residual Risk', assessment.overallResidualRisk);
    }
    fillTextField(form, 'Recommended Inspection', assessment.recommendedInspectionInterval);
    fillTextField(form, 'Data Status', assessment.dataStatus);
    fillTextField(form, 'Advanced Assessment', assessment.advancedAssessmentTypeReason);
    fillTextField(form, 'Limitations Describe', assessment.inspectionLimitations.describe);

  } catch {
    // Continue even if some fields fail - the PDF will be partially filled
  }

  // Flatten the form so fields can't be edited
  form.flatten();

  // Return the PDF bytes
  return pdfDoc.save();
}

/**
 * Helper to safely fill a text field
 */
function fillTextField(form: ReturnType<PDFDocument['getForm']>, fieldName: string, value: string) {
  try {
    const field = form.getTextField(fieldName);
    if (field && value) {
      field.setText(value);
    }
  } catch {
    // Field not found - this is expected since field names may vary
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
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612; // Letter size
  const pageHeight = 792;
  const margin = 50;
  const lineHeight = 14;
  let y = pageHeight - margin;

  function addPage() {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    return page;
  }

  function drawText(
    page: ReturnType<typeof pdfDoc.addPage>,
    text: string,
    options: { bold?: boolean; size?: number; indent?: number } = {}
  ) {
    const size = options.size || 10;
    const x = margin + (options.indent || 0);
    const usedFont = options.bold ? boldFont : font;

    if (y < margin + lineHeight) {
      page = addPage();
    }

    page.drawText(text, {
      x,
      y,
      size,
      font: usedFont,
      color: rgb(0, 0, 0),
    });

    y -= lineHeight * (size / 10);
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

  // Start building the report
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
    assessment.overallTreeRiskRating
      ? LABELS.riskRating[assessment.overallTreeRiskRating].toUpperCase()
      : 'Not calculated'
  );
  page = drawField(
    page,
    'Overall Residual Risk',
    assessment.overallResidualRisk || 'Not specified'
  );
  page = drawField(page, 'Recommended Inspection Interval', assessment.recommendedInspectionInterval);

  // Risk Rows
  if (assessment.riskRows.length > 0) {
    page = drawSection(page, 'Risk Categorization');
    for (const row of assessment.riskRows) {
      const rating = row.riskRating ? LABELS.riskRating[row.riskRating] : '-';
      page = drawField(
        page,
        `${row.target || 'Target'} - ${row.treePart ? LABELS.treePart[row.treePart] : 'Part'}`,
        `${row.conditionsOfConcern || '-'} | Risk: ${rating}`
      );
    }
  }

  // Mitigation
  if (assessment.mitigationOptions.length > 0) {
    page = drawSection(page, 'Mitigation Options');
    for (const option of assessment.mitigationOptions) {
      page = drawField(
        page,
        `Option ${option.optionNumber}`,
        `${option.description || '-'} | Residual Risk: ${option.residualRisk || '-'}`
      );
    }
  }

  // Notes
  if (assessment.notes) {
    page = drawSection(page, 'Notes');
    page = drawText(page, assessment.notes);
  }

  // Data Status
  page = drawSection(page, 'Assessment Status');
  page = drawField(page, 'Data Status', assessment.dataStatus);
  page = drawField(page, 'Advanced Assessment Needed', assessment.advancedAssessmentNeeded ? 'Yes' : 'No');
  if (assessment.advancedAssessmentNeeded) {
    page = drawField(page, 'Type/Reason', assessment.advancedAssessmentTypeReason);
  }

  // Inspection Limitations
  const limitations = [];
  if (assessment.inspectionLimitations.none) limitations.push('None');
  if (assessment.inspectionLimitations.visibility) limitations.push('Visibility');
  if (assessment.inspectionLimitations.access) limitations.push('Access');
  if (assessment.inspectionLimitations.vines) limitations.push('Vines');
  if (assessment.inspectionLimitations.rootCollarBuried) limitations.push('Root Collar Buried');
  page = drawField(page, 'Inspection Limitations', limitations.join(', ') || 'None');
  if (assessment.inspectionLimitations.describe) {
    page = drawField(page, 'Limitations Details', assessment.inspectionLimitations.describe);
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

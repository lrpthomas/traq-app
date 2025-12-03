import type { FieldHelp } from '@/types/traq';

/**
 * Tooltip and help content for all TRAQ form fields
 * Based on ISA Basic Tree Risk Assessment Form Instructions (2017)
 */

export const FIELD_HELP: Record<string, FieldHelp> = {
  // ============ Header Section ============
  'header.client': {
    title: 'Client',
    description: 'Name of the person or entity who hired you to perform the assessment. Typically, this is the tree risk manager.',
  },
  'header.date': {
    title: 'Date',
    description: 'Date of the site visit/tree inspection when data is collected.',
  },
  'header.time': {
    title: 'Time',
    description: 'Time of the assessment. Weather and lighting conditions can affect observations.',
  },
  'header.addressTreeLocation': {
    title: 'Address/Tree Location',
    description: 'The physical address, GPS coordinates, or other location description of the tree and/or the location of the tree on the property.',
    examples: ['411 Pine Street, Oakville. Large tree left side of driveway', 'Backyard', 'Between street and sidewalk'],
  },
  'header.treeNo': {
    title: 'Tree #',
    description: 'If the tree has an inventory tag with a descriptor (usually a number), it should be entered here. If a group of trees without tags are assessed, they may be assigned a sequence number.',
  },
  'header.treeSpecies': {
    title: 'Tree Species',
    description: 'The common and/or scientific name of the tree; cultivar, if known.',
    examples: ['Red Oak', 'Quercus rubra', 'Autumn Blaze Maple'],
  },
  'header.dbh': {
    title: 'DBH',
    description: 'Trunk diameter at breast height measured in inches or centimeters. In the United States, this is 4.5 ft (1.37 m) above ground; IUFRO standard is 1.3 m. The height can be adapted based on tree form or site conditions (low branches, swelling, lean, slope).',
    examples: ['24 in', '60 cm'],
  },
  'header.height': {
    title: 'Height',
    description: 'Total tree height, visually estimated or measured. If measured, the tool used should be recorded in Tools Used.',
    examples: ['50 ft', '15 m'],
  },
  'header.crownSpreadDia': {
    title: 'Crown Spread Diameter',
    description: 'Average diameter of the crown (drip line). Measure the widest and narrowest spread and average them.',
    examples: ['40 ft', '12 m'],
  },
  'header.assessors': {
    title: 'Assessor(s)',
    description: 'Your name and the names of anyone working with you as a tree risk assessor.',
  },
  'header.toolsUsed': {
    title: 'Tools Used',
    description: 'List of tools used in the assessment. If no tools were used, write "none" or leave blank.',
    examples: ['Mallet, binoculars, diameter tape', 'None'],
  },
  'header.timeFrame': {
    title: 'Time Frame',
    description: 'The period for which an assessment is defined, typically between one and five years.',
    examples: ['1 year', '3 years', '5 years'],
  },

  // ============ Target Assessment ============
  'targets.targetDescription': {
    title: 'Target Description',
    description: 'A brief description of the target such as "people near the tree," "house," "children in a play area," or "cars on a high-traffic street." Entries such as "street" or "sidewalk" are not specific enough.',
    examples: ['People near the tree', 'House', 'Children in play area', 'Cars on high-traffic street'],
  },
  'targets.targetProtection': {
    title: 'Target Protection',
    description: 'If there is anything that will protect the target from damage if a tree part fails, list it here.',
    examples: ['Lower branches', 'Adjacent trees', 'House overhang', 'Car shelter'],
  },
  'targets.targetZone.withinDripLine': {
    title: 'Drip Line',
    description: 'Target is underneath the crown of the tree.',
  },
  'targets.targetZone.within1xHt': {
    title: '1 × Ht',
    description: 'Target is within striking distance if the trunk or root system of the tree fails (one times the tree height).',
  },
  'targets.targetZone.within1_5xHt': {
    title: '1.5 × Ht',
    description: 'Target is within striking distance if the trunk or root system fails and there are dead or brittle branches that could shatter and fly from the failed tree (up to 1.5 times tree height).',
  },
  'targets.occupancyRate': {
    title: 'Occupancy Rate',
    description: 'An estimated amount of time the target is within the target zone during the specified time frame.',
    examples: [
      '1 - Rare: Target zone not commonly used by people or other targets',
      '2 - Occasional: Target zone occupied infrequently or irregularly',
      '3 - Frequent: Target zone occupied for a large portion of the day or week',
      '4 - Constant: A target is present at nearly all times, 24/7',
    ],
  },
  'targets.practicalToMoveTarget': {
    title: 'Practical to Move Target?',
    description: 'Can the target be relocated to reduce risk? For example, moving picnic tables or rerouting foot traffic.',
  },
  'targets.restrictionPractical': {
    title: 'Restriction Practical?',
    description: 'Is it practical to restrict access to the target zone? For example, fencing off an area.',
  },

  // ============ Site Factors ============
  'siteFactors.historyOfFailures': {
    title: 'History of Failures',
    description: 'List site factors affecting wind load, including site elevation, slope, aspect (compass direction of slope), and hilltop locations. History of failures visible at the site can be included here.',
  },
  'siteFactors.topography.flat': {
    title: 'Flat',
    description: 'The site is relatively flat with no significant slope.',
  },
  'siteFactors.topography.slopePercent': {
    title: 'Slope %',
    description: 'The percentage of slope at the site.',
  },
  'siteFactors.topography.aspect': {
    title: 'Aspect',
    description: 'The compass direction the slope faces (N, NE, E, SE, S, SW, W, NW).',
  },
  'siteFactors.siteChanges.none': {
    title: 'None',
    description: 'No evidence of recent site changes.',
  },
  'siteFactors.siteChanges.gradeChange': {
    title: 'Grade Change',
    description: 'Soil was added or removed from the site.',
  },
  'siteFactors.siteChanges.siteClearing': {
    title: 'Site Clearing',
    description: 'Adjacent trees, which may have blocked the wind, have recently been removed or significantly reduced.',
  },
  'siteFactors.siteChanges.changedSoilHydrology': {
    title: 'Changed Soil Hydrology',
    description: 'Changes have been made that affect water flow in or out of the site.',
  },
  'siteFactors.siteChanges.rootCuts': {
    title: 'Root Cuts',
    description: 'Evidence of root cutting such as a trench or soil cut near the tree.',
  },
  'siteFactors.soilConditions.limitedVolume': {
    title: 'Limited Volume',
    description: 'Soil volume available for root development is limited by infrastructure, high water table, rocks, or other cause.',
  },
  'siteFactors.soilConditions.saturated': {
    title: 'Saturated',
    description: 'Soil is often wet indicating possible soil depth limitations for root growth, root decay, and lack of soil strength.',
  },
  'siteFactors.soilConditions.shallow': {
    title: 'Shallow',
    description: 'Shallow soil depth limiting root development.',
  },
  'siteFactors.soilConditions.compacted': {
    title: 'Compacted',
    description: 'Soil is compressed by traffic or equipment, limiting root growth and water infiltration.',
  },
  'siteFactors.soilConditions.pavementOverRootsPercent': {
    title: 'Pavement Over Roots %',
    description: 'Percentage of the root zone covered by pavement or other infrastructure.',
  },

  // ============ Tree Health and Species Profile ============
  'treeHealth.vigor': {
    title: 'Vigor',
    description: 'Overall health and growth rate of the tree based on foliage condition, twig growth, and general vitality.',
    examples: ['Low: Poor growth, declining', 'Normal: Average for the species', 'High: Vigorous growth'],
  },
  'treeHealth.foliage.noneSeasonal': {
    title: 'None (Seasonal)',
    description: 'A deciduous tree that has dropped its leaves in the dormant season.',
  },
  'treeHealth.foliage.noneDead': {
    title: 'None (Dead)',
    description: 'A tree that has dropped its leaves because it is dead.',
  },
  'treeHealth.foliage.normalPercent': {
    title: 'Normal %',
    description: 'Percentage of foliage that is a normal color for the species in the area.',
  },
  'treeHealth.foliage.chloroticPercent': {
    title: 'Chlorotic %',
    description: 'Percentage of foliage that is yellowish green to yellow.',
  },
  'treeHealth.foliage.necroticPercent': {
    title: 'Necrotic %',
    description: 'Percentage of dead foliage in the crown.',
  },
  'treeHealth.pestsBiotic': {
    title: 'Pests/Biotic',
    description: 'Pest or disease issues affecting the tree.',
    examples: ['Emerald ash borer', 'Oak wilt', 'Dutch elm disease'],
  },
  'treeHealth.abiotic': {
    title: 'Abiotic',
    description: 'Non-living factors affecting tree health.',
    examples: ['Drought stress', 'Salt damage', 'Lightning damage', 'Construction damage'],
  },
  'treeHealth.speciesFailureProfile': {
    title: 'Species Failure Profile',
    description: 'Known failure patterns for this tree species. Some species are prone to branch, trunk, or root failures.',
    examples: ['Silver maple: weak wood, prone to branch failure', 'Bradford pear: prone to trunk splitting'],
  },

  // ============ Load Factors ============
  'loadFactors.windExposure': {
    title: 'Wind Exposure',
    description: 'How exposed the tree crown is to wind.',
    examples: [
      'Protected: Least exposure, protected by trees or structures',
      'Partial: Some wind exposure, partially protected',
      'Full: Maximum exposure to wind',
    ],
  },
  'loadFactors.windFunneling': {
    title: 'Wind Funneling',
    description: 'Wind may be "funneled" or "tunneled" by buildings, canyons, or large stands of trees toward this tree so there will be a greater wind load. This may include trees at the corners of buildings.',
  },
  'loadFactors.relativeCrownSize': {
    title: 'Relative Crown Size',
    description: 'Comparison of the tree\'s crown size to the trunk diameter. Classify as small, medium, or large.',
  },
  'loadFactors.crownDensity': {
    title: 'Crown Density',
    description: 'The relative wind and light transparency of the crown.',
    examples: [
      'Sparse: Allows a large degree of wind and light penetration',
      'Normal: Moderate wind and light penetration',
      'Dense: Does not allow much light or wind penetration',
    ],
  },
  'loadFactors.interiorBranches': {
    title: 'Interior Branches',
    description: 'Amount of interior branching within the crown.',
  },
  'loadFactors.vinesMistletoeMoss': {
    title: 'Vines/Mistletoe/Moss',
    description: 'Mark if vines, mistletoe, or moss are present at levels where they would be expected to significantly increase load or wind resistance.',
  },
  'loadFactors.recentOrExpectedChangeInLoadFactors': {
    title: 'Recent or Expected Change in Load Factors',
    description: 'Recent (last few years) or planned (next few years) changes at the site that may significantly affect the load on this tree.',
    examples: ['Removing nearby trees', 'New construction exposing tree to wind'],
  },

  // ============ Crown and Branches ============
  'crownAndBranches.unbalancedCrown': {
    title: 'Unbalanced Crown',
    description: 'Mark if branches and foliage in the crown are not uniformly distributed, mostly on one side of the tree.',
  },
  'crownAndBranches.lcrPercent': {
    title: 'LCR %',
    description: 'Live Crown Ratio - the ratio of the height of the live crown to the height of the entire tree. Can be calculated [LCR = (crown height/tree height) × 100] or visually estimated.',
  },
  'crownAndBranches.deadTwigsBranches': {
    title: 'Dead Twigs/Branches',
    description: 'Mark if there are dead twigs or branches in the crown. Record the percentage of total branches that are dead and the maximum diameter of dead branches.',
  },
  'crownAndBranches.brokenHangers': {
    title: 'Broken/Hangers',
    description: 'Broken or cut branches remaining in the crown. Record the number and the maximum diameter.',
  },
  'crownAndBranches.overExtendedBranches': {
    title: 'Over-extended Branches',
    description: 'Branches that extend beyond the tree\'s crown or that are excessively long with poor taper.',
  },
  'crownAndBranches.pruningHistory': {
    title: 'Pruning History',
    description: 'Evidence of previous pruning on the tree.',
  },
  'crownAndBranches.pruningHistory.topped': {
    title: 'Topped',
    description: 'Inappropriate pruning technique used to reduce tree size; characterized by internodal cuts.',
  },
  'crownAndBranches.pruningHistory.thinned': {
    title: 'Thinned',
    description: 'Live, interior branches were pruned to reduce crown density.',
  },
  'crownAndBranches.pruningHistory.lionTailed': {
    title: 'Lion-tailed',
    description: 'Inappropriate pruning practice removing an excessive number of inner and/or lower lateral branches.',
  },
  'crownAndBranches.pruningHistory.raised': {
    title: 'Raised',
    description: 'Removal of lower branches to provide clearance.',
  },
  'crownAndBranches.cracks': {
    title: 'Cracks',
    description: 'Separation in the wood in either a longitudinal (radial, in the plane of ray cells) or transverse (across the stem) direction.',
  },
  'crownAndBranches.codominant': {
    title: 'Codominant',
    description: 'Branches that are codominant or have a basal diameter similar to attached stems or branches.',
  },
  'crownAndBranches.includedBark': {
    title: 'Included Bark',
    description: 'Bark that is embedded in a union between codominant stems or branches, weakening the attachment.',
  },
  'crownAndBranches.weakAttachments': {
    title: 'Weak Attachments',
    description: 'Branches that have included bark or splits at or below the union.',
  },
  'crownAndBranches.cavityNestHole': {
    title: 'Cavity/Nest Hole',
    description: 'Opening from the outside of the branch into the heartwood area from decay or animal damage. Record the percentage of circumference affected.',
  },
  'crownAndBranches.previousBranchFailures': {
    title: 'Previous Branch Failures',
    description: 'Evidence of previous branch failures. Check "Similar branches present" if there are other branches that have similar characteristics and may be more likely to fail.',
  },
  'crownAndBranches.sapwoodDamageDecay': {
    title: 'Sapwood Damage/Decay',
    description: 'Evidence of decay or damage to the sapwood.',
  },
  'crownAndBranches.conks': {
    title: 'Conks',
    description: 'Fungal fruiting structures (mushrooms, brackets) that are definite indicators of decay.',
  },
  'crownAndBranches.heartwoodDecay': {
    title: 'Heartwood Decay',
    description: 'Evidence of internal decay in the heartwood.',
  },
  'crownAndBranches.responseGrowth': {
    title: 'Response Growth',
    description: 'Reaction wood, wound wood, or additional wood grown to increase the structural strength of the branch near a defect or condition of concern.',
  },
  'crownAndBranches.conditionsOfConcern': {
    title: 'Condition(s) of Concern',
    description: 'A short description of the most likely cause for a branch failure.',
    examples: ['Dead branch', 'Codominant branch', 'Decayed branch', 'Overextended branch with excessive load'],
  },
  'crownAndBranches.loadOnDefect': {
    title: 'Load on Defect',
    description: 'The load on the branch that is expected to fail relative to the size of the branch.',
    examples: [
      'N/A: Not applicable',
      'Minor: Little load, such as a dead branch with no leaves',
      'Moderate: Some load from leaves, twigs, or other branches',
      'Significant: Large branch with many leaves, twigs, branches, or fully exposed to wind/weather',
    ],
  },
  'crownAndBranches.likelihoodOfFailure': {
    title: 'Likelihood of Failure',
    description: 'Categorize the likelihood that this part will fail within the specified time frame.',
    examples: [
      'Improbable: Failure is not expected',
      'Possible: Failure could occur but is not likely',
      'Probable: Failure is likely to occur',
      'Imminent: Failure is expected very soon',
    ],
  },

  // ============ Trunk ============
  'trunk.codominantStems': {
    title: 'Codominant Stems',
    description: 'Two or more stems of similar diameter originating from the same union.',
  },
  'trunk.cavityNestHole': {
    title: 'Cavity/Nest Hole',
    description: 'Wood may be missing due to decay, wildlife damage, termites, or other causes. Record the percentage of trunk circumference affected and depth.',
  },
  'trunk.poorTaper': {
    title: 'Poor Taper',
    description: 'The diameter of the trunk does not change much along its length.',
  },
  'trunk.lean': {
    title: 'Lean',
    description: 'Angle of the trunk measured from vertical. Record the degree of lean. "Corrected" means the tree has corrected the lean with new growth.',
  },
  'trunk.sapOoze': {
    title: 'Sap Ooze',
    description: 'Liquid seeping out of the bark, often associated with cracks or other wounds.',
  },

  // ============ Roots and Root Collar ============
  'rootsAndRootCollar.collarBuriedNotVisible': {
    title: 'Collar Buried/Not Visible',
    description: 'The root collar is not visible. If practical, determine and record the depth from the soil line to the top of the buttress roots.',
  },
  'rootsAndRootCollar.stemGirdling': {
    title: 'Stem Girdling',
    description: 'Restriction to growth of the trunk or buttress roots from mechanical damage, straps, ropes, or roots.',
  },
  'rootsAndRootCollar.cutDamagedRoots': {
    title: 'Cut/Damaged Roots',
    description: 'Evidence of root cutting such as a trench or soil cut. Estimate and record the distance from the trunk to the cut.',
  },
  'rootsAndRootCollar.rootPlateLifting': {
    title: 'Root Plate Lifting',
    description: 'Soil cracking or lifting indicates the tree has been moving excessively, usually in high winds.',
  },
  'rootsAndRootCollar.soilWeakness': {
    title: 'Soil Weakness',
    description: 'Condition of the soil that may affect the likelihood of failure, such as saturation or limited volume.',
  },

  // ============ Risk Categorization ============
  'riskRows.likelihoodOfImpact': {
    title: 'Likelihood of Impact',
    description: 'If the tree part were to fail, the likelihood of striking the target.',
    examples: [
      'Very low: Target rarely in strike zone',
      'Low: Target occasionally in strike zone',
      'Medium: Target frequently in strike zone',
      'High: Target constantly in strike zone',
    ],
  },
  'riskRows.consequences': {
    title: 'Consequences',
    description: 'If the tree part were to fail and strike the target, the anticipated consequences.',
    examples: [
      'Negligible: Very minor damage, no injury',
      'Minor: Small property damage, minor injury',
      'Significant: Moderate damage, serious injury possible',
      'Severe: Major damage, death, or serious injuries possible',
    ],
  },

  // ============ Mitigation ============
  'mitigationOptions.description': {
    title: 'Mitigation',
    description: 'List options to mitigate tree risk. More than one risk can be mitigated on each line.',
    examples: [
      'Prune to remove dead branches throughout the crown',
      'Reduce the length of the overextended branch by one-third',
      'Install cable support system',
      'Remove tree',
    ],
  },
  'mitigationOptions.residualRisk': {
    title: 'Residual Risk',
    description: 'The risk remaining after the mitigation. Calculated using the same procedure as the initial risk calculation. "None" should only be applied if the tree is recommended for complete removal.',
  },

  // ============ Data Status ============
  'dataStatus': {
    title: 'Data Status',
    description: 'Indicate whether sufficient information was collected to make a reasoned assessment and mitigation recommendation.',
    examples: [
      'Final: Assessor collected enough information for a reasoned assessment',
      'Preliminary: Additional information should be collected',
    ],
  },
  'advancedAssessmentNeeded': {
    title: 'Advanced Assessment Needed',
    description: 'If the information was insufficient to make a reasoned assessment, indicate the type of advanced assessment recommended or the reason for that determination.',
    examples: ['Resistograph testing', 'Aerial inspection', 'Root excavation', 'Sonic tomography'],
  },

  // ============ Inspection Limitations ============
  'inspectionLimitations.none': {
    title: 'None',
    description: 'There were no unusual obstructions to tree inspection and assessment.',
  },
  'inspectionLimitations.visibility': {
    title: 'Visibility',
    description: 'Not all parts of the tree were visible during the assessment. This includes limitations due to fog, snow, ice, rain, vegetation, infrastructure, or other factors.',
  },
  'inspectionLimitations.access': {
    title: 'Access',
    description: 'Not all parts of the tree were available for inspection. This includes limitations to property access, slopes, fences, or other factors.',
  },
  'inspectionLimitations.vines': {
    title: 'Vines',
    description: 'Vegetation, such as vines, covers the soil, root collar, trunk, or branches so those parts could not be inspected.',
  },
  'inspectionLimitations.rootCollarBuried': {
    title: 'Root Collar Buried',
    description: 'The root collar area could not be inspected. This includes soil, mulch, pavement, decks, turf, artificial turf, and other structures that obscure the lower portion of the trunk and buttress roots.',
  },

  // ============ Recommended Inspection Interval ============
  'recommendedInspectionInterval': {
    title: 'Recommended Inspection Interval',
    description: 'Recommended time interval until the reassessment should take place or the reassessment frequency.',
    examples: ['1 year', '6 months', '3 years'],
  },
};

/**
 * Get help content for a field by path
 */
export function getFieldHelp(fieldPath: string): FieldHelp | null {
  return FIELD_HELP[fieldPath] || null;
}

/**
 * Get all field paths that have help content
 */
export function getAllFieldPaths(): string[] {
  return Object.keys(FIELD_HELP);
}

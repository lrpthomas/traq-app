/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * Generated from: src/data/tree-species.csv
 * Run: npm run generate:types
 */

export interface TreeSpecies {
  scientificName: string;
  commonName: string;
  family: TreeFamily;
  riskFactors: string;
}

export type TreeFamily =
  | 'Altingiaceae'
  | 'Betulaceae'
  | 'Cannabaceae'
  | 'Cornaceae'
  | 'Cupressaceae'
  | 'Fabaceae'
  | 'Fagaceae'
  | 'Ginkgoaceae'
  | 'Juglandaceae'
  | 'Lauraceae'
  | 'Magnoliaceae'
  | 'Malvaceae'
  | 'Nyssaceae'
  | 'Oleaceae'
  | 'Pinaceae'
  | 'Platanaceae'
  | 'Rosaceae'
  | 'Salicaceae'
  | 'Sapindaceae'
  | 'Simaroubaceae'
  | 'Ulmaceae';

export const TREE_FAMILIES: TreeFamily[] = [
  'Altingiaceae',
  'Betulaceae',
  'Cannabaceae',
  'Cornaceae',
  'Cupressaceae',
  'Fabaceae',
  'Fagaceae',
  'Ginkgoaceae',
  'Juglandaceae',
  'Lauraceae',
  'Magnoliaceae',
  'Malvaceae',
  'Nyssaceae',
  'Oleaceae',
  'Pinaceae',
  'Platanaceae',
  'Rosaceae',
  'Salicaceae',
  'Sapindaceae',
  'Simaroubaceae',
  'Ulmaceae',
] as const;

export const TREE_SPECIES: TreeSpecies[] = [
  {
    scientificName: 'Quercus rubra',
    commonName: 'Red Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Bacterial leaf scorch; oak wilt susceptible',
  },
  {
    scientificName: 'Quercus alba',
    commonName: 'White Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; susceptible to oak wilt',
  },
  {
    scientificName: 'Quercus palustris',
    commonName: 'Pin Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Iron chlorosis in alkaline soils; weak wood',
  },
  {
    scientificName: 'Acer saccharum',
    commonName: 'Sugar Maple',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Sensitive to salt and compaction',
  },
  {
    scientificName: 'Acer rubrum',
    commonName: 'Red Maple',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Included bark common; sensitive to construction',
  },
  {
    scientificName: 'Acer platanoides',
    commonName: 'Norway Maple',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Surface roots; girdling roots common',
  },
  {
    scientificName: 'Acer saccharinum',
    commonName: 'Silver Maple',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Weak wood; prone to splitting',
  },
  {
    scientificName: 'Ulmus americana',
    commonName: 'American Elm',
    family: 'Ulmaceae' as TreeFamily,
    riskFactors: 'Dutch elm disease; elm leaf beetle',
  },
  {
    scientificName: 'Fraxinus americana',
    commonName: 'White Ash',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Emerald ash borer',
  },
  {
    scientificName: 'Fraxinus pennsylvanica',
    commonName: 'Green Ash',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Emerald ash borer',
  },
  {
    scientificName: 'Tilia americana',
    commonName: 'American Linden',
    family: 'Malvaceae' as TreeFamily,
    riskFactors: 'Included bark; Japanese beetles',
  },
  {
    scientificName: 'Platanus occidentalis',
    commonName: 'American Sycamore',
    family: 'Platanaceae' as TreeFamily,
    riskFactors: 'Anthracnose; large branches',
  },
  {
    scientificName: 'Platanus × acerifolia',
    commonName: 'London Plane',
    family: 'Platanaceae' as TreeFamily,
    riskFactors: 'Anthracnose; massive crown',
  },
  {
    scientificName: 'Gleditsia triacanthos',
    commonName: 'Honey Locust',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Webworm; plant bug; generally sturdy',
  },
  {
    scientificName: 'Prunus serotina',
    commonName: 'Black Cherry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Black knot; tent caterpillars',
  },
  {
    scientificName: 'Betula papyrifera',
    commonName: 'Paper Birch',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Bronze birch borer; short-lived',
  },
  {
    scientificName: 'Betula nigra',
    commonName: 'River Birch',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Better adapted to heat; multi-stemmed',
  },
  {
    scientificName: 'Fagus grandifolia',
    commonName: 'American Beech',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Beech bark disease; thin bark easily damaged',
  },
  {
    scientificName: 'Fagus sylvatica',
    commonName: 'European Beech',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Beech bark disease; surface roots',
  },
  {
    scientificName: 'Liquidambar styraciflua',
    commonName: 'Sweetgum',
    family: 'Altingiaceae' as TreeFamily,
    riskFactors: 'Fruit litter; included bark possible',
  },
  {
    scientificName: 'Liriodendron tulipifera',
    commonName: 'Tulip Tree',
    family: 'Magnoliaceae' as TreeFamily,
    riskFactors: 'Aphids; fast growth; weak wood when young',
  },
  {
    scientificName: 'Pinus strobus',
    commonName: 'Eastern White Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'White pine blister rust; weevil',
  },
  {
    scientificName: 'Pinus nigra',
    commonName: 'Austrian Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Diplodia tip blight; pine wilt',
  },
  {
    scientificName: 'Picea abies',
    commonName: 'Norway Spruce',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Spider mites; cytospora canker',
  },
  {
    scientificName: 'Picea pungens',
    commonName: 'Colorado Blue Spruce',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Cytospora canker; rhizosphaera needle cast',
  },
  {
    scientificName: 'Tsuga canadensis',
    commonName: 'Eastern Hemlock',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Hemlock woolly adelgid',
  },
  {
    scientificName: 'Thuja occidentalis',
    commonName: 'Northern White Cedar',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Bagworm; deer browse',
  },
  {
    scientificName: 'Juniperus virginiana',
    commonName: 'Eastern Red Cedar',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Cedar apple rust',
  },
  {
    scientificName: 'Magnolia grandiflora',
    commonName: 'Southern Magnolia',
    family: 'Magnoliaceae' as TreeFamily,
    riskFactors: 'Scale insects; generally sturdy',
  },
  {
    scientificName: 'Cornus florida',
    commonName: 'Flowering Dogwood',
    family: 'Cornaceae' as TreeFamily,
    riskFactors: 'Dogwood anthracnose; borers',
  },
  {
    scientificName: 'Malus species',
    commonName: 'Crabapple',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; apple scab; cedar apple rust',
  },
  {
    scientificName: 'Pyrus calleryana',
    commonName: 'Callery Pear',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Weak branch structure; splits easily',
  },
  {
    scientificName: 'Cercis canadensis',
    commonName: 'Eastern Redbud',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Verticillium wilt; short-lived',
  },
  {
    scientificName: 'Ginkgo biloba',
    commonName: 'Ginkgo',
    family: 'Ginkgoaceae' as TreeFamily,
    riskFactors: 'Few problems; very resilient',
  },
  {
    scientificName: 'Carpinus betulus',
    commonName: 'European Hornbeam',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Few problems; sturdy',
  },
  {
    scientificName: 'Ostrya virginiana',
    commonName: 'American Hophornbeam',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Few problems; slow growing',
  },
  {
    scientificName: 'Nyssa sylvatica',
    commonName: 'Black Tupelo',
    family: 'Nyssaceae' as TreeFamily,
    riskFactors: 'Few problems; excellent fall color',
  },
  {
    scientificName: 'Sassafras albidum',
    commonName: 'Sassafras',
    family: 'Lauraceae' as TreeFamily,
    riskFactors: 'Root suckers; laurel wilt in SE',
  },
  {
    scientificName: 'Carya ovata',
    commonName: 'Shagbark Hickory',
    family: 'Juglandaceae' as TreeFamily,
    riskFactors: 'Hickory bark beetle; large nuts',
  },
  {
    scientificName: 'Juglans nigra',
    commonName: 'Black Walnut',
    family: 'Juglandaceae' as TreeFamily,
    riskFactors: 'Thousand cankers disease; allelopathic',
  },
  {
    scientificName: 'Celtis occidentalis',
    commonName: 'Common Hackberry',
    family: 'Cannabaceae' as TreeFamily,
    riskFactors: 'Witches broom; nipple gall; sturdy',
  },
  {
    scientificName: 'Zelkova serrata',
    commonName: 'Japanese Zelkova',
    family: 'Ulmaceae' as TreeFamily,
    riskFactors: 'Elm substitute; generally sturdy',
  },
  {
    scientificName: 'Metasequoia glyptostroboides',
    commonName: 'Dawn Redwood',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Few problems; fast growing',
  },
  {
    scientificName: 'Taxodium distichum',
    commonName: 'Bald Cypress',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Few problems; knees in wet sites',
  },
  {
    scientificName: 'Salix babylonica',
    commonName: 'Weeping Willow',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Very weak wood; aggressive roots',
  },
  {
    scientificName: 'Populus deltoides',
    commonName: 'Eastern Cottonwood',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Weak wood; massive size; surface roots',
  },
  {
    scientificName: 'Populus tremuloides',
    commonName: 'Quaking Aspen',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Borers; cankers; short-lived',
  },
  {
    scientificName: 'Robinia pseudoacacia',
    commonName: 'Black Locust',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Locust borer; brittle wood',
  },
  {
    scientificName: 'Ailanthus altissima',
    commonName: 'Tree of Heaven',
    family: 'Simaroubaceae' as TreeFamily,
    riskFactors: 'Invasive; weak wood; spotted lanternfly host',
  },
];

/**
 * Get species by scientific name (case-insensitive)
 */
export function getSpeciesByScientificName(name: string): TreeSpecies | undefined {
  return TREE_SPECIES.find(
    s => s.scientificName.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get species by common name (case-insensitive, partial match)
 */
export function searchSpeciesByCommonName(query: string): TreeSpecies[] {
  const lowerQuery = query.toLowerCase();
  return TREE_SPECIES.filter(
    s => s.commonName.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all species in a family
 */
export function getSpeciesByFamily(family: TreeFamily): TreeSpecies[] {
  return TREE_SPECIES.filter(s => s.family === family);
}

/**
 * Total number of species in the database
 */
export const SPECIES_COUNT = 49;

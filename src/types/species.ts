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
  | 'Aquifoliaceae'
  | 'Araucariaceae'
  | 'Arecaceae'
  | 'Betulaceae'
  | 'Bignoniaceae'
  | 'Cannabaceae'
  | 'Cercidiphyllaceae'
  | 'Cornaceae'
  | 'Cupressaceae'
  | 'Ebenaceae'
  | 'Ericaceae'
  | 'Eucommiaceae'
  | 'Fabaceae'
  | 'Fagaceae'
  | 'Ginkgoaceae'
  | 'Hamamelidaceae'
  | 'Juglandaceae'
  | 'Lauraceae'
  | 'Lythraceae'
  | 'Magnoliaceae'
  | 'Malvaceae'
  | 'Moraceae'
  | 'Myrtaceae'
  | 'Nyssaceae'
  | 'Oleaceae'
  | 'Paulowniaceae'
  | 'Pinaceae'
  | 'Platanaceae'
  | 'Podocarpaceae'
  | 'Rhamnaceae'
  | 'Rosaceae'
  | 'Rutaceae'
  | 'Salicaceae'
  | 'Sapindaceae'
  | 'Sciadopityaceae'
  | 'Simaroubaceae'
  | 'Styracaceae'
  | 'Taxaceae'
  | 'Theaceae'
  | 'Ulmaceae';

export const TREE_FAMILIES: TreeFamily[] = [
  'Altingiaceae',
  'Aquifoliaceae',
  'Araucariaceae',
  'Arecaceae',
  'Betulaceae',
  'Bignoniaceae',
  'Cannabaceae',
  'Cercidiphyllaceae',
  'Cornaceae',
  'Cupressaceae',
  'Ebenaceae',
  'Ericaceae',
  'Eucommiaceae',
  'Fabaceae',
  'Fagaceae',
  'Ginkgoaceae',
  'Hamamelidaceae',
  'Juglandaceae',
  'Lauraceae',
  'Lythraceae',
  'Magnoliaceae',
  'Malvaceae',
  'Moraceae',
  'Myrtaceae',
  'Nyssaceae',
  'Oleaceae',
  'Paulowniaceae',
  'Pinaceae',
  'Platanaceae',
  'Podocarpaceae',
  'Rhamnaceae',
  'Rosaceae',
  'Rutaceae',
  'Salicaceae',
  'Sapindaceae',
  'Sciadopityaceae',
  'Simaroubaceae',
  'Styracaceae',
  'Taxaceae',
  'Theaceae',
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
  {
    scientificName: 'Quercus macrocarpa',
    commonName: 'Bur Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; drought tolerant',
  },
  {
    scientificName: 'Quercus coccinea',
    commonName: 'Scarlet Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Oak wilt susceptible; good fall color',
  },
  {
    scientificName: 'Quercus velutina',
    commonName: 'Black Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Oak wilt susceptible; brittle branches',
  },
  {
    scientificName: 'Quercus phellos',
    commonName: 'Willow Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Fast growing; iron chlorosis possible',
  },
  {
    scientificName: 'Quercus virginiana',
    commonName: 'Live Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Massive spread; generally very sturdy',
  },
  {
    scientificName: 'Quercus agrifolia',
    commonName: 'Coast Live Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Sudden oak death in CA; generally sturdy',
  },
  {
    scientificName: 'Quercus lobata',
    commonName: 'Valley Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Drought stress; oak pit scale',
  },
  {
    scientificName: 'Acer negundo',
    commonName: 'Boxelder',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Weak wood; boxelder bugs; short-lived',
  },
  {
    scientificName: 'Acer palmatum',
    commonName: 'Japanese Maple',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Verticillium wilt; sun scald',
  },
  {
    scientificName: 'Acer griseum',
    commonName: 'Paperbark Maple',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Few problems; ornamental bark',
  },
  {
    scientificName: 'Ulmus parvifolia',
    commonName: 'Chinese Elm',
    family: 'Ulmaceae' as TreeFamily,
    riskFactors: 'DED resistant; elm leaf beetle',
  },
  {
    scientificName: 'Ulmus pumila',
    commonName: 'Siberian Elm',
    family: 'Ulmaceae' as TreeFamily,
    riskFactors: 'Weak wood; aggressive roots; short-lived',
  },
  {
    scientificName: 'Fraxinus excelsior',
    commonName: 'European Ash',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Ash dieback; emerald ash borer',
  },
  {
    scientificName: 'Fraxinus velutina',
    commonName: 'Arizona Ash',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Emerald ash borer; mistletoe host',
  },
  {
    scientificName: 'Tilia cordata',
    commonName: 'Littleleaf Linden',
    family: 'Malvaceae' as TreeFamily,
    riskFactors: 'Japanese beetles; aphids; included bark',
  },
  {
    scientificName: 'Tilia tomentosa',
    commonName: 'Silver Linden',
    family: 'Malvaceae' as TreeFamily,
    riskFactors: 'Toxic to bees; generally sturdy',
  },
  {
    scientificName: 'Betula pendula',
    commonName: 'European White Birch',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Bronze birch borer; short-lived in heat',
  },
  {
    scientificName: 'Betula alleghaniensis',
    commonName: 'Yellow Birch',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Bronze birch borer; prefers cool sites',
  },
  {
    scientificName: 'Pinus ponderosa',
    commonName: 'Ponderosa Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Bark beetles; drought tolerant',
  },
  {
    scientificName: 'Pinus sylvestris',
    commonName: 'Scots Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Pine wilt; diplodia; poor form',
  },
  {
    scientificName: 'Pinus taeda',
    commonName: 'Loblolly Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Southern pine beetle; ice damage',
  },
  {
    scientificName: 'Pinus echinata',
    commonName: 'Shortleaf Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Southern pine beetle; littleleaf disease',
  },
  {
    scientificName: 'Pinus palustris',
    commonName: 'Longleaf Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; fire adapted',
  },
  {
    scientificName: 'Picea glauca',
    commonName: 'White Spruce',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Spider mites; spruce budworm',
  },
  {
    scientificName: 'Abies concolor',
    commonName: 'White Fir',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; balsam woolly adelgid',
  },
  {
    scientificName: 'Abies balsamea',
    commonName: 'Balsam Fir',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Balsam woolly adelgid; short-lived',
  },
  {
    scientificName: 'Pseudotsuga menziesii',
    commonName: 'Douglas Fir',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Swiss needle cast; root rot',
  },
  {
    scientificName: 'Larix decidua',
    commonName: 'European Larch',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Larch casebearer; deciduous conifer',
  },
  {
    scientificName: 'Cedrus deodara',
    commonName: 'Deodar Cedar',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Root rot; generally sturdy',
  },
  {
    scientificName: 'Cedrus atlantica',
    commonName: 'Atlas Cedar',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; drought tolerant once established',
  },
  {
    scientificName: 'Sequoia sempervirens',
    commonName: 'Coast Redwood',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Generally very sturdy; massive size',
  },
  {
    scientificName: 'Sequoiadendron giganteum',
    commonName: 'Giant Sequoia',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Generally very sturdy; massive size',
  },
  {
    scientificName: 'Cryptomeria japonica',
    commonName: 'Japanese Cedar',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; winter bronzing',
  },
  {
    scientificName: 'Chamaecyparis lawsoniana',
    commonName: 'Port Orford Cedar',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Root rot (Phytophthora)',
  },
  {
    scientificName: 'Chamaecyparis obtusa',
    commonName: 'Hinoki Cypress',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; spider mites',
  },
  {
    scientificName: 'Cupressus sempervirens',
    commonName: 'Italian Cypress',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Cypress canker; spider mites',
  },
  {
    scientificName: 'Magnolia stellata',
    commonName: 'Star Magnolia',
    family: 'Magnoliaceae' as TreeFamily,
    riskFactors: 'Scale insects; frost damage to flowers',
  },
  {
    scientificName: 'Magnolia × soulangeana',
    commonName: 'Saucer Magnolia',
    family: 'Magnoliaceae' as TreeFamily,
    riskFactors: 'Scale insects; frost damage to flowers',
  },
  {
    scientificName: 'Magnolia virginiana',
    commonName: 'Sweetbay Magnolia',
    family: 'Magnoliaceae' as TreeFamily,
    riskFactors: 'Few problems; generally sturdy',
  },
  {
    scientificName: 'Cornus kousa',
    commonName: 'Kousa Dogwood',
    family: 'Cornaceae' as TreeFamily,
    riskFactors: 'More disease resistant than florida',
  },
  {
    scientificName: 'Cornus mas',
    commonName: 'Cornelian Cherry',
    family: 'Cornaceae' as TreeFamily,
    riskFactors: 'Few problems; very sturdy',
  },
  {
    scientificName: 'Prunus avium',
    commonName: 'Sweet Cherry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Bacterial canker; borers',
  },
  {
    scientificName: 'Prunus cerasifera',
    commonName: 'Cherry Plum',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Black knot; borers',
  },
  {
    scientificName: 'Prunus × yedoensis',
    commonName: 'Yoshino Cherry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Bacterial canker; borers; short-lived',
  },
  {
    scientificName: 'Prunus subhirtella',
    commonName: 'Higan Cherry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Borers; generally moderate lifespan',
  },
  {
    scientificName: 'Crataegus species',
    commonName: 'Hawthorn',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; cedar hawthorn rust; thorns',
  },
  {
    scientificName: 'Sorbus aucuparia',
    commonName: 'European Mountain Ash',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; borers; sun scald',
  },
  {
    scientificName: 'Amelanchier species',
    commonName: 'Serviceberry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; rust; generally sturdy',
  },
  {
    scientificName: 'Koelreuteria paniculata',
    commonName: 'Golden Rain Tree',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; boxelder bugs',
  },
  {
    scientificName: 'Aesculus hippocastanum',
    commonName: 'Horse Chestnut',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Leaf blotch; bleeding canker',
  },
  {
    scientificName: 'Aesculus × carnea',
    commonName: 'Red Horse Chestnut',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Leaf blotch; generally moderate',
  },
  {
    scientificName: 'Aesculus glabra',
    commonName: 'Ohio Buckeye',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Leaf scorch; leaf blotch',
  },
  {
    scientificName: 'Aesculus pavia',
    commonName: 'Red Buckeye',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; summer dormancy',
  },
  {
    scientificName: 'Castanea dentata',
    commonName: 'American Chestnut',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Chestnut blight (nearly extinct)',
  },
  {
    scientificName: 'Castanea mollissima',
    commonName: 'Chinese Chestnut',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Blight resistant; generally sturdy',
  },
  {
    scientificName: 'Morus alba',
    commonName: 'White Mulberry',
    family: 'Moraceae' as TreeFamily,
    riskFactors: 'Bacterial leaf scorch; weak wood',
  },
  {
    scientificName: 'Morus rubra',
    commonName: 'Red Mulberry',
    family: 'Moraceae' as TreeFamily,
    riskFactors: 'Bacterial leaf scorch; generally sturdier',
  },
  {
    scientificName: 'Maclura pomifera',
    commonName: 'Osage Orange',
    family: 'Moraceae' as TreeFamily,
    riskFactors: 'Thorns; generally very sturdy; large fruit',
  },
  {
    scientificName: 'Catalpa speciosa',
    commonName: 'Northern Catalpa',
    family: 'Bignoniaceae' as TreeFamily,
    riskFactors: 'Catalpa sphinx; verticillium wilt',
  },
  {
    scientificName: 'Catalpa bignonioides',
    commonName: 'Southern Catalpa',
    family: 'Bignoniaceae' as TreeFamily,
    riskFactors: 'Catalpa sphinx; verticillium wilt',
  },
  {
    scientificName: 'Paulownia tomentosa',
    commonName: 'Empress Tree',
    family: 'Paulowniaceae' as TreeFamily,
    riskFactors: 'Invasive; weak wood; fast growing',
  },
  {
    scientificName: 'Diospyros virginiana',
    commonName: 'American Persimmon',
    family: 'Ebenaceae' as TreeFamily,
    riskFactors: 'Few problems; generally sturdy',
  },
  {
    scientificName: 'Oxydendrum arboreum',
    commonName: 'Sourwood',
    family: 'Ericaceae' as TreeFamily,
    riskFactors: 'Few problems; excellent fall color',
  },
  {
    scientificName: 'Halesia tetraptera',
    commonName: 'Carolina Silverbell',
    family: 'Styracaceae' as TreeFamily,
    riskFactors: 'Few problems; ornamental flowers',
  },
  {
    scientificName: 'Chionanthus virginicus',
    commonName: 'White Fringetree',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Emerald ash borer (Oleaceae family)',
  },
  {
    scientificName: 'Syringa reticulata',
    commonName: 'Japanese Tree Lilac',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Bacterial blight; borers',
  },
  {
    scientificName: 'Lagerstroemia indica',
    commonName: 'Crape Myrtle',
    family: 'Lythraceae' as TreeFamily,
    riskFactors: 'Powdery mildew; aphids; generally sturdy',
  },
  {
    scientificName: 'Albizia julibrissin',
    commonName: 'Mimosa Tree',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Mimosa wilt; weak wood; invasive',
  },
  {
    scientificName: 'Gymnocladus dioicus',
    commonName: 'Kentucky Coffeetree',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Few problems; generally very sturdy',
  },
  {
    scientificName: 'Cladrastis kentukea',
    commonName: 'Yellowwood',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Weak branch attachments; generally sturdy',
  },
  {
    scientificName: 'Sophora japonica',
    commonName: 'Japanese Pagodatree',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; twig blight',
  },
  {
    scientificName: 'Cercidiphyllum japonicum',
    commonName: 'Katsura Tree',
    family: 'Cercidiphyllaceae' as TreeFamily,
    riskFactors: 'Few problems; drought sensitive',
  },
  {
    scientificName: 'Parrotia persica',
    commonName: 'Persian Ironwood',
    family: 'Hamamelidaceae' as TreeFamily,
    riskFactors: 'Few problems; excellent fall color',
  },
  {
    scientificName: 'Styrax japonicus',
    commonName: 'Japanese Snowbell',
    family: 'Styracaceae' as TreeFamily,
    riskFactors: 'Few problems; ornamental',
  },
  {
    scientificName: 'Stewartia pseudocamellia',
    commonName: 'Japanese Stewartia',
    family: 'Theaceae' as TreeFamily,
    riskFactors: 'Few problems; ornamental bark',
  },
  {
    scientificName: 'Franklinia alatamaha',
    commonName: 'Franklin Tree',
    family: 'Theaceae' as TreeFamily,
    riskFactors: 'Root rot (Phytophthora); rare',
  },
  {
    scientificName: 'Eucommia ulmoides',
    commonName: 'Hardy Rubber Tree',
    family: 'Eucommiaceae' as TreeFamily,
    riskFactors: 'Few problems; very sturdy',
  },
  {
    scientificName: 'Phellodendron amurense',
    commonName: 'Amur Cork Tree',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Invasive in some areas; generally sturdy',
  },
  {
    scientificName: 'Tetradium daniellii',
    commonName: 'Bee Bee Tree',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Few problems; bee attractant',
  },
  {
    scientificName: 'Hovenia dulcis',
    commonName: 'Japanese Raisin Tree',
    family: 'Rhamnaceae' as TreeFamily,
    riskFactors: 'Few problems; potentially invasive',
  },
  {
    scientificName: 'Idesia polycarpa',
    commonName: 'Igiri Tree',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Few problems; ornamental fruit',
  },
  {
    scientificName: 'Davidia involucrata',
    commonName: 'Dove Tree',
    family: 'Nyssaceae' as TreeFamily,
    riskFactors: 'Few problems; slow to flower',
  },
  {
    scientificName: 'Araucaria araucana',
    commonName: 'Monkey Puzzle Tree',
    family: 'Araucariaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; unique form',
  },
  {
    scientificName: 'Sciadopitys verticillata',
    commonName: 'Japanese Umbrella Pine',
    family: 'Sciadopityaceae' as TreeFamily,
    riskFactors: 'Few problems; slow growing',
  },
  {
    scientificName: 'Podocarpus macrophyllus',
    commonName: 'Yew Pine',
    family: 'Podocarpaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; scale insects',
  },
  {
    scientificName: 'Taxus baccata',
    commonName: 'English Yew',
    family: 'Taxaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; toxic; phytophthora',
  },
  {
    scientificName: 'Taxus cuspidata',
    commonName: 'Japanese Yew',
    family: 'Taxaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; toxic; winter damage',
  },
  {
    scientificName: 'Cephalotaxus harringtonia',
    commonName: 'Japanese Plum Yew',
    family: 'Taxaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; deer resistant',
  },
  {
    scientificName: 'Ilex opaca',
    commonName: 'American Holly',
    family: 'Aquifoliaceae' as TreeFamily,
    riskFactors: 'Leaf miners; scale; holly leaf spot',
  },
  {
    scientificName: 'Ilex × attenuata',
    commonName: 'Foster Holly',
    family: 'Aquifoliaceae' as TreeFamily,
    riskFactors: 'Scale; leaf miners; generally sturdy',
  },
  {
    scientificName: 'Ilex aquifolium',
    commonName: 'English Holly',
    family: 'Aquifoliaceae' as TreeFamily,
    riskFactors: 'Leaf miners; scale',
  },
  {
    scientificName: 'Eucalyptus species',
    commonName: 'Eucalyptus',
    family: 'Myrtaceae' as TreeFamily,
    riskFactors: 'Branch drop; lerp psyllid; fire hazard',
  },
  {
    scientificName: 'Acacia species',
    commonName: 'Acacia',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Short-lived; weak wood; thorns on some',
  },
  {
    scientificName: 'Phoenix canariensis',
    commonName: 'Canary Island Date Palm',
    family: 'Arecaceae' as TreeFamily,
    riskFactors: 'Fusarium wilt; giant palm borer',
  },
  {
    scientificName: 'Washingtonia robusta',
    commonName: 'Mexican Fan Palm',
    family: 'Arecaceae' as TreeFamily,
    riskFactors: 'Pink rot; giant palm borer',
  },
  {
    scientificName: 'Sabal palmetto',
    commonName: 'Cabbage Palm',
    family: 'Arecaceae' as TreeFamily,
    riskFactors: 'Ganoderma butt rot; generally sturdy',
  },
  {
    scientificName: 'Quercus suber',
    commonName: 'Cork Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; fire resistant bark',
  },
  {
    scientificName: 'Platanus racemosa',
    commonName: 'California Sycamore',
    family: 'Platanaceae' as TreeFamily,
    riskFactors: 'Anthracnose; powdery mildew',
  },
  {
    scientificName: 'Umbellularia californica',
    commonName: 'California Bay Laurel',
    family: 'Lauraceae' as TreeFamily,
    riskFactors: 'Sudden oak death vector; aromatic',
  },
  {
    scientificName: 'Arbutus menziesii',
    commonName: 'Pacific Madrone',
    family: 'Ericaceae' as TreeFamily,
    riskFactors: 'Leaf blight; root rot; peeling bark',
  },
  {
    scientificName: 'Lithocarpus densiflorus',
    commonName: 'Tanoak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Sudden oak death susceptible',
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
export const SPECIES_COUNT = 150;

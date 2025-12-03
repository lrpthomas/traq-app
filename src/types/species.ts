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
  | 'Actinidiaceae'
  | 'Adoxaceae'
  | 'Altingiaceae'
  | 'Anacardiaceae'
  | 'Annonaceae'
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
  | 'Elaeagnaceae'
  | 'Ericaceae'
  | 'Eucommiaceae'
  | 'Fabaceae'
  | 'Fagaceae'
  | 'Ginkgoaceae'
  | 'Grossulariaceae'
  | 'Hamamelidaceae'
  | 'Juglandaceae'
  | 'Lauraceae'
  | 'Lecythidaceae'
  | 'Lythraceae'
  | 'Magnoliaceae'
  | 'Malvaceae'
  | 'Moraceae'
  | 'Musaceae'
  | 'Myrtaceae'
  | 'Nyssaceae'
  | 'Oleaceae'
  | 'Paulowniaceae'
  | 'Pinaceae'
  | 'Platanaceae'
  | 'Podocarpaceae'
  | 'Proteaceae'
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
  | 'Ulmaceae'
  | 'Vitaceae';

export const TREE_FAMILIES: TreeFamily[] = [
  'Actinidiaceae',
  'Adoxaceae',
  'Altingiaceae',
  'Anacardiaceae',
  'Annonaceae',
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
  'Elaeagnaceae',
  'Ericaceae',
  'Eucommiaceae',
  'Fabaceae',
  'Fagaceae',
  'Ginkgoaceae',
  'Grossulariaceae',
  'Hamamelidaceae',
  'Juglandaceae',
  'Lauraceae',
  'Lecythidaceae',
  'Lythraceae',
  'Magnoliaceae',
  'Malvaceae',
  'Moraceae',
  'Musaceae',
  'Myrtaceae',
  'Nyssaceae',
  'Oleaceae',
  'Paulowniaceae',
  'Pinaceae',
  'Platanaceae',
  'Podocarpaceae',
  'Proteaceae',
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
  'Vitaceae',
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
  {
    scientificName: 'Quercus douglasii',
    commonName: 'Blue Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Drought tolerant; endemic to CA foothills',
  },
  {
    scientificName: 'Quercus kelloggii',
    commonName: 'California Black Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Oak wilt susceptible; fire adapted',
  },
  {
    scientificName: 'Quercus wislizeni',
    commonName: 'Interior Live Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Sudden oak death susceptible; drought tolerant',
  },
  {
    scientificName: 'Quercus chrysolepis',
    commonName: 'Canyon Live Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; massive spread possible',
  },
  {
    scientificName: 'Quercus garryana',
    commonName: 'Oregon White Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; gall wasps',
  },
  {
    scientificName: 'Quercus engelmannii',
    commonName: 'Engelmann Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Endangered; drought tolerant; endemic to SoCal',
  },
  {
    scientificName: 'Quercus tomentella',
    commonName: 'Island Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Rare; endemic to Channel Islands',
  },
  {
    scientificName: 'Aesculus californica',
    commonName: 'California Buckeye',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Summer deciduous; toxic seeds; drought adapted',
  },
  {
    scientificName: 'Acer macrophyllum',
    commonName: 'Bigleaf Maple',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Massive leaves; tarspot; generally sturdy',
  },
  {
    scientificName: 'Alnus rhombifolia',
    commonName: 'White Alder',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Riparian; tent caterpillars; nitrogen fixing',
  },
  {
    scientificName: 'Alnus rubra',
    commonName: 'Red Alder',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Short-lived; nitrogen fixing; rapid growth',
  },
  {
    scientificName: 'Populus fremontii',
    commonName: 'Fremont Cottonwood',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Weak wood; massive size; riparian',
  },
  {
    scientificName: 'Populus trichocarpa',
    commonName: 'Black Cottonwood',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Weak wood; very fast growing; riparian',
  },
  {
    scientificName: 'Salix laevigata',
    commonName: 'Red Willow',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Riparian; weak wood; fast growing',
  },
  {
    scientificName: 'Salix lasiolepis',
    commonName: 'Arroyo Willow',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Multi-stemmed; riparian; weak wood',
  },
  {
    scientificName: 'Salix gooddingii',
    commonName: 'Goodding\'s Willow',
    family: 'Salicaceae' as TreeFamily,
    riskFactors: 'Riparian; weak wood; desert Southwest',
  },
  {
    scientificName: 'Fraxinus latifolia',
    commonName: 'Oregon Ash',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Anthracnose; emerald ash borer threat',
  },
  {
    scientificName: 'Fraxinus dipetala',
    commonName: 'California Ash',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Small tree; drought deciduous; foothill species',
  },
  {
    scientificName: 'Cercis occidentalis',
    commonName: 'Western Redbud',
    family: 'Fabaceae' as TreeFamily,
    riskFactors: 'Verticillium wilt; generally sturdy; drought tolerant',
  },
  {
    scientificName: 'Cornus nuttallii',
    commonName: 'Pacific Dogwood',
    family: 'Cornaceae' as TreeFamily,
    riskFactors: 'Dogwood anthracnose; understory tree',
  },
  {
    scientificName: 'Prunus ilicifolia',
    commonName: 'Hollyleaf Cherry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; drought tolerant; native',
  },
  {
    scientificName: 'Prunus virginiana var. demissa',
    commonName: 'Western Chokecherry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Tent caterpillars; suckering habit',
  },
  {
    scientificName: 'Heteromeles arbutifolia',
    commonName: 'Toyon',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire adapted; generally sturdy; CA native',
  },
  {
    scientificName: 'Lyonothamnus floribundus',
    commonName: 'Catalina Ironwood',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Endemic to Channel Islands; rare',
  },
  {
    scientificName: 'Juglans californica',
    commonName: 'Southern California Black Walnut',
    family: 'Juglandaceae' as TreeFamily,
    riskFactors: 'Thousand cankers disease; endangered',
  },
  {
    scientificName: 'Juglans hindsii',
    commonName: 'Northern California Black Walnut',
    family: 'Juglandaceae' as TreeFamily,
    riskFactors: 'Thousand cankers disease; limited range',
  },
  {
    scientificName: 'Washingtonia filifera',
    commonName: 'California Fan Palm',
    family: 'Arecaceae' as TreeFamily,
    riskFactors: 'Giant palm borer; only native CA palm',
  },
  {
    scientificName: 'Pinus coulteri',
    commonName: 'Coulter Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Massive heavy cones; bark beetles; fire adapted',
  },
  {
    scientificName: 'Pinus sabiniana',
    commonName: 'Gray Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Sparse crown; bark beetles; foothill native',
  },
  {
    scientificName: 'Pinus jeffreyi',
    commonName: 'Jeffrey Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Bark beetles; similar to ponderosa; montane',
  },
  {
    scientificName: 'Pinus lambertiana',
    commonName: 'Sugar Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'White pine blister rust; massive cones; largest pine',
  },
  {
    scientificName: 'Pinus contorta',
    commonName: 'Lodgepole Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Mountain pine beetle; fire adapted; thin bark',
  },
  {
    scientificName: 'Pinus radiata',
    commonName: 'Monterey Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Pitch canker; limited native range; widely planted',
  },
  {
    scientificName: 'Pinus torreyana',
    commonName: 'Torrey Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Rarest US pine; bark beetles; coastal San Diego',
  },
  {
    scientificName: 'Pinus monticola',
    commonName: 'Western White Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'White pine blister rust; high elevation',
  },
  {
    scientificName: 'Pinus attenuata',
    commonName: 'Knobcone Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Fire adapted; serotinous cones; short-lived',
  },
  {
    scientificName: 'Pinus muricata',
    commonName: 'Bishop Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Pitch canker; limited coastal range',
  },
  {
    scientificName: 'Abies magnifica',
    commonName: 'Red Fir',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Fir engraver beetle; high elevation CA/OR',
  },
  {
    scientificName: 'Abies bracteata',
    commonName: 'Santa Lucia Fir',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Rarest US fir; endemic to Santa Lucia Mtns',
  },
  {
    scientificName: 'Picea breweriana',
    commonName: 'Brewer Spruce',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Rare; weeping habit; Klamath Mountains',
  },
  {
    scientificName: 'Calocedrus decurrens',
    commonName: 'Incense Cedar',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; incense cedar rust',
  },
  {
    scientificName: 'Cupressus macrocarpa',
    commonName: 'Monterey Cypress',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Coryneum canker; limited native range; iconic',
  },
  {
    scientificName: 'Cupressus goveniana',
    commonName: 'Gowen Cypress',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Rare; endemic to Monterey area',
  },
  {
    scientificName: 'Cupressus sargentii',
    commonName: 'Sargent Cypress',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Serpentine endemic; generally sturdy',
  },
  {
    scientificName: 'Cupressus bakeri',
    commonName: 'Baker Cypress',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Fire adapted; rare; northern CA',
  },
  {
    scientificName: 'Juniperus californica',
    commonName: 'California Juniper',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Drought tolerant; generally sturdy; desert edges',
  },
  {
    scientificName: 'Juniperus occidentalis',
    commonName: 'Western Juniper',
    family: 'Cupressaceae' as TreeFamily,
    riskFactors: 'Very long-lived; drought tolerant; high desert',
  },
  {
    scientificName: 'Torreya californica',
    commonName: 'California Nutmeg',
    family: 'Taxaceae' as TreeFamily,
    riskFactors: 'Rare; Torreya canker; shade tolerant',
  },
  {
    scientificName: 'Pseudotsuga macrocarpa',
    commonName: 'Bigcone Douglas Fir',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Fire adapted; endemic to SoCal mountains',
  },
  {
    scientificName: 'Notholithocarpus densiflorus',
    commonName: 'Tanoak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Sudden oak death; acorn producer',
  },
  {
    scientificName: 'Chrysolepis chrysophylla',
    commonName: 'Giant Chinquapin',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Generally sturdy; fire adapted; understory',
  },
  {
    scientificName: 'Quercus durata',
    commonName: 'Leather Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Serpentine endemic; shrubby to small tree',
  },
  {
    scientificName: 'Quercus sadleriana',
    commonName: 'Deer Oak',
    family: 'Fagaceae' as TreeFamily,
    riskFactors: 'Rare; Klamath Mtns endemic; understory shrub-tree',
  },
  {
    scientificName: 'Pinus balfouriana',
    commonName: 'Foxtail Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Ancient trees; high elevation; generally sturdy',
  },
  {
    scientificName: 'Pinus longaeva',
    commonName: 'Bristlecone Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Oldest known trees; high elevation; very slow growing',
  },
  {
    scientificName: 'Pinus flexilis',
    commonName: 'Limber Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'White pine blister rust; high elevation',
  },
  {
    scientificName: 'Pinus albicaulis',
    commonName: 'Whitebark Pine',
    family: 'Pinaceae' as TreeFamily,
    riskFactors: 'Endangered; blister rust; mountain pine beetle',
  },
  {
    scientificName: 'Prunus persica',
    commonName: 'Peach',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Peach leaf curl; borers; brown rot; short-lived',
  },
  {
    scientificName: 'Prunus persica var. nucipersica',
    commonName: 'Nectarine',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Peach leaf curl; borers; brown rot; short-lived',
  },
  {
    scientificName: 'Prunus armeniaca',
    commonName: 'Apricot',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Bacterial canker; brown rot; Eutypa dieback',
  },
  {
    scientificName: 'Prunus domestica',
    commonName: 'European Plum',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Black knot; brown rot; plum curculio',
  },
  {
    scientificName: 'Prunus salicina',
    commonName: 'Japanese Plum',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Bacterial canker; brown rot; less hardy',
  },
  {
    scientificName: 'Prunus dulcis',
    commonName: 'Almond',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Shot hole; brown rot; hull rot; navel orangeworm',
  },
  {
    scientificName: 'Prunus cerasus',
    commonName: 'Sour Cherry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Bacterial canker; cherry leaf spot; borers',
  },
  {
    scientificName: 'Malus domestica',
    commonName: 'Apple',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; apple scab; codling moth; cedar apple rust',
  },
  {
    scientificName: 'Pyrus communis',
    commonName: 'European Pear',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; pear psylla; pear decline',
  },
  {
    scientificName: 'Pyrus pyrifolia',
    commonName: 'Asian Pear',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight resistant; pear psylla; less cold hardy',
  },
  {
    scientificName: 'Cydonia oblonga',
    commonName: 'Quince',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; quince rust; generally sturdy',
  },
  {
    scientificName: 'Eriobotrya japonica',
    commonName: 'Loquat',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; generally sturdy; frost sensitive fruit',
  },
  {
    scientificName: 'Citrus × sinensis',
    commonName: 'Sweet Orange',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); citrus canker; frost sensitive',
  },
  {
    scientificName: 'Citrus × limon',
    commonName: 'Lemon',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); very frost sensitive; thorny',
  },
  {
    scientificName: 'Citrus × paradisi',
    commonName: 'Grapefruit',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); frost sensitive; large tree',
  },
  {
    scientificName: 'Citrus reticulata',
    commonName: 'Mandarin',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); alternaria rot; generally smaller',
  },
  {
    scientificName: 'Citrus × latifolia',
    commonName: 'Persian Lime',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); very frost sensitive; thornless',
  },
  {
    scientificName: 'Citrus maxima',
    commonName: 'Pomelo',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); frost sensitive; very large fruit',
  },
  {
    scientificName: 'Citrus × aurantium',
    commonName: 'Sour Orange',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus tristeza virus; used as rootstock; thorny',
  },
  {
    scientificName: 'Citrus × limon \'Meyer\'',
    commonName: 'Meyer Lemon',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); more cold hardy; dwarf habit',
  },
  {
    scientificName: 'Citrus × tangelo',
    commonName: 'Tangelo',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Citrus greening (HLB); hybrid vigor; frost sensitive',
  },
  {
    scientificName: 'Fortunella species',
    commonName: 'Kumquat',
    family: 'Rutaceae' as TreeFamily,
    riskFactors: 'Generally hardier citrus; few problems; small tree',
  },
  {
    scientificName: 'Persea americana',
    commonName: 'Avocado',
    family: 'Lauraceae' as TreeFamily,
    riskFactors: 'Phytophthora root rot; laurel wilt; frost sensitive',
  },
  {
    scientificName: 'Olea europaea',
    commonName: 'Olive',
    family: 'Oleaceae' as TreeFamily,
    riskFactors: 'Olive knot; verticillium wilt; peacock spot',
  },
  {
    scientificName: 'Ficus carica',
    commonName: 'Common Fig',
    family: 'Moraceae' as TreeFamily,
    riskFactors: 'Fig rust; root knot nematode; mosaic virus',
  },
  {
    scientificName: 'Punica granatum',
    commonName: 'Pomegranate',
    family: 'Lythraceae' as TreeFamily,
    riskFactors: 'Few problems; drought tolerant; fruit splitting',
  },
  {
    scientificName: 'Morus nigra',
    commonName: 'Black Mulberry',
    family: 'Moraceae' as TreeFamily,
    riskFactors: 'Bacterial leaf scorch; popcorn disease; staining fruit',
  },
  {
    scientificName: 'Ziziphus jujuba',
    commonName: 'Jujube',
    family: 'Rhamnaceae' as TreeFamily,
    riskFactors: 'Few problems; very drought tolerant; thorny',
  },
  {
    scientificName: 'Diospyros kaki',
    commonName: 'Japanese Persimmon',
    family: 'Ebenaceae' as TreeFamily,
    riskFactors: 'Anthracnose; few problems; astringent varieties',
  },
  {
    scientificName: 'Feijoa sellowiana',
    commonName: 'Pineapple Guava',
    family: 'Myrtaceae' as TreeFamily,
    riskFactors: 'Few problems; frost tolerant; edible flowers',
  },
  {
    scientificName: 'Psidium guajava',
    commonName: 'Common Guava',
    family: 'Myrtaceae' as TreeFamily,
    riskFactors: 'Guava rust; fruit flies; frost sensitive',
  },
  {
    scientificName: 'Mangifera indica',
    commonName: 'Mango',
    family: 'Anacardiaceae' as TreeFamily,
    riskFactors: 'Anthracnose; powdery mildew; very frost sensitive',
  },
  {
    scientificName: 'Litchi chinensis',
    commonName: 'Lychee',
    family: 'Sapindaceae' as TreeFamily,
    riskFactors: 'Few problems; very frost sensitive; slow growing',
  },
  {
    scientificName: 'Annona cherimola',
    commonName: 'Cherimoya',
    family: 'Annonaceae' as TreeFamily,
    riskFactors: 'Few problems; frost sensitive; hand pollination needed',
  },
  {
    scientificName: 'Asimina triloba',
    commonName: 'Pawpaw',
    family: 'Annonaceae' as TreeFamily,
    riskFactors: 'Few problems; native to E. US; shade tolerant',
  },
  {
    scientificName: 'Musa × paradisiaca',
    commonName: 'Banana',
    family: 'Musaceae' as TreeFamily,
    riskFactors: 'Panama disease; black sigatoka; frost kills leaves',
  },
  {
    scientificName: 'Corylus avellana',
    commonName: 'European Hazelnut',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Eastern filbert blight; big bud mite',
  },
  {
    scientificName: 'Corylus americana',
    commonName: 'American Hazelnut',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Eastern filbert blight resistant; shrubby',
  },
  {
    scientificName: 'Corylus colurna',
    commonName: 'Turkish Hazelnut',
    family: 'Betulaceae' as TreeFamily,
    riskFactors: 'Few problems; excellent street tree; blight resistant',
  },
  {
    scientificName: 'Pistacia vera',
    commonName: 'Pistachio',
    family: 'Anacardiaceae' as TreeFamily,
    riskFactors: 'Verticillium wilt; alternaria; Botryosphaeria',
  },
  {
    scientificName: 'Carya illinoinensis',
    commonName: 'Pecan',
    family: 'Juglandaceae' as TreeFamily,
    riskFactors: 'Pecan scab; hickory shuckworm; zinc deficiency',
  },
  {
    scientificName: 'Macadamia integrifolia',
    commonName: 'Macadamia',
    family: 'Proteaceae' as TreeFamily,
    riskFactors: 'Phytophthora; macadamia felted coccid; frost sensitive',
  },
  {
    scientificName: 'Bertholletia excelsa',
    commonName: 'Brazil Nut',
    family: 'Lecythidaceae' as TreeFamily,
    riskFactors: 'Requires rainforest; not cultivated; wild harvest only',
  },
  {
    scientificName: 'Anacardium occidentale',
    commonName: 'Cashew',
    family: 'Anacardiaceae' as TreeFamily,
    riskFactors: 'Anthracnose; dieback; tropical only; caustic shell',
  },
  {
    scientificName: 'Juglans regia',
    commonName: 'English Walnut',
    family: 'Juglandaceae' as TreeFamily,
    riskFactors: 'Walnut blight; thousand cankers disease; codling moth',
  },
  {
    scientificName: 'Prunus armeniaca × Prunus',
    commonName: 'Pluot/Aprium',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Brown rot; bacterial canker; hybrid vigor',
  },
  {
    scientificName: 'Actinidia deliciosa',
    commonName: 'Kiwifruit',
    family: 'Actinidiaceae' as TreeFamily,
    riskFactors: 'Bacterial canker; Phytophthora; dioecious',
  },
  {
    scientificName: 'Actinidia arguta',
    commonName: 'Hardy Kiwi',
    family: 'Actinidiaceae' as TreeFamily,
    riskFactors: 'Few problems; very cold hardy; smaller fruit',
  },
  {
    scientificName: 'Vaccinium corymbosum',
    commonName: 'Highbush Blueberry',
    family: 'Ericaceae' as TreeFamily,
    riskFactors: 'Mummy berry; stem canker; acidic soil required',
  },
  {
    scientificName: 'Rubus species',
    commonName: 'Blackberry/Raspberry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Orange rust; anthracnose; cane borers',
  },
  {
    scientificName: 'Vitis vinifera',
    commonName: 'Wine Grape',
    family: 'Vitaceae' as TreeFamily,
    riskFactors: 'Powdery mildew; phylloxera; Pierce\'s disease',
  },
  {
    scientificName: 'Vitis labrusca',
    commonName: 'Concord Grape',
    family: 'Vitaceae' as TreeFamily,
    riskFactors: 'Downy mildew; black rot; more cold hardy',
  },
  {
    scientificName: 'Sambucus nigra',
    commonName: 'European Elderberry',
    family: 'Adoxaceae' as TreeFamily,
    riskFactors: 'Few problems; suckering; toxic when raw',
  },
  {
    scientificName: 'Ribes species',
    commonName: 'Currant/Gooseberry',
    family: 'Grossulariaceae' as TreeFamily,
    riskFactors: 'White pine blister rust host; powdery mildew',
  },
  {
    scientificName: 'Hippophae rhamnoides',
    commonName: 'Sea Buckthorn',
    family: 'Elaeagnaceae' as TreeFamily,
    riskFactors: 'Few problems; nitrogen fixing; thorny',
  },
  {
    scientificName: 'Elaeagnus umbellata',
    commonName: 'Autumn Olive',
    family: 'Elaeagnaceae' as TreeFamily,
    riskFactors: 'Invasive in E. US; nitrogen fixing; edible fruit',
  },
  {
    scientificName: 'Aronia melanocarpa',
    commonName: 'Black Chokeberry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Few problems; very cold hardy; antioxidant fruit',
  },
  {
    scientificName: 'Amelanchier alnifolia',
    commonName: 'Saskatoon Serviceberry',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; rust; edible fruit; native',
  },
  {
    scientificName: 'Crataegus pinnatifida',
    commonName: 'Chinese Hawthorn',
    family: 'Rosaceae' as TreeFamily,
    riskFactors: 'Fire blight; cedar hawthorn rust; edible fruit',
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
export const SPECIES_COUNT = 266;

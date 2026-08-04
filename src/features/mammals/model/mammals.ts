import informationPreview from '@/assets/parks/kruger/information-preview.webp'
import mammalsPreview from '@/assets/parks/kruger/mammals-preview.webp'
import mapPreview from '@/assets/parks/kruger/map-preview.webp'
import sightingsPreview from '@/assets/parks/kruger/sightings-preview.webp'
import { getMammalPrimaryImage } from '@/assets/mammals/mammalPrimaryImages'

import type { Mammal, MammalProfile } from './mammal'

type MammalSummary = Omit<Mammal, 'imageAlt' | 'imageFallback' | 'profile'>

const mammalSummaries: readonly MammalSummary[] = [
  { aliases: ['lion'], categories: ['big-five', 'predators'], commonName: 'African Lion', id: 'african-lion', image: mammalsPreview, scientificName: 'Panthera leo' },
  { aliases: ['savanna elephant', 'elephant'], categories: ['big-five'], commonName: 'African Elephant', id: 'african-elephant', image: mammalsPreview, scientificName: 'Loxodonta africana' },
  { aliases: ['cape buffalo', 'buffalo'], categories: ['big-five'], commonName: 'African Buffalo', id: 'african-buffalo', image: informationPreview, scientificName: 'Syncerus caffer' },
  { aliases: ['black rhino', 'hook-lipped rhinoceros'], categories: ['big-five'], commonName: 'Black Rhinoceros', id: 'black-rhinoceros', image: informationPreview, scientificName: 'Diceros bicornis' },
  { aliases: ['baboon'], categories: ['primates'], commonName: 'Chacma Baboon', id: 'chacma-baboon', image: mammalsPreview, scientificName: 'Papio ursinus' },
  { aliases: ['cheetah'], categories: ['predators'], commonName: 'Cheetah', id: 'cheetah', image: sightingsPreview, scientificName: 'Acinonyx jubatus' },
  { aliases: ['kudu'], categories: ['antelopes'], commonName: 'Greater Kudu', id: 'greater-kudu', image: informationPreview, scientificName: 'Tragelaphus strepsiceros' },
  { aliases: ['giraffe'], categories: [], commonName: 'Giraffe', id: 'giraffe', image: mammalsPreview, scientificName: 'Giraffa camelopardalis' },
  { aliases: ['ratel'], categories: ['predators', 'small-mammals'], commonName: 'Honey Badger', id: 'honey-badger', image: sightingsPreview, scientificName: 'Mellivora capensis' },
  { aliases: ['impala'], categories: ['antelopes'], commonName: 'Impala', id: 'impala', image: informationPreview, scientificName: 'Aepyceros melampus' },
  { aliases: ['leopard'], categories: ['big-five', 'predators'], commonName: 'Leopard', id: 'leopard', image: sightingsPreview, scientificName: 'Panthera pardus' },
  { aliases: ['nyala'], categories: ['antelopes'], commonName: 'Nyala', id: 'nyala', image: informationPreview, scientificName: 'Tragelaphus angasii' },
  { aliases: ['cape porcupine'], categories: ['small-mammals'], commonName: 'Porcupine', id: 'porcupine', image: mapPreview, scientificName: 'Hystrix africaeaustralis' },
  { aliases: ['bushbuck'], categories: ['antelopes'], commonName: 'Southern Bushbuck', id: 'southern-bushbuck', image: informationPreview, scientificName: 'Tragelaphus sylvaticus' },
  { aliases: ['hyena', 'hyaena'], categories: ['predators'], commonName: 'Spotted Hyena', id: 'spotted-hyena', image: sightingsPreview, scientificName: 'Crocuta crocuta' },
  { aliases: ['steenbuck'], categories: ['antelopes'], commonName: 'Steenbok', id: 'steenbok', image: informationPreview, scientificName: 'Raphicerus campestris' },
  { aliases: ['monkey', 'vervet'], categories: ['primates'], commonName: 'Vervet Monkey', id: 'vervet-monkey', image: mammalsPreview, scientificName: 'Chlorocebus pygerythrus' },
  { aliases: ['warthog'], categories: [], commonName: 'Warthog', id: 'warthog', image: mapPreview, scientificName: 'Phacochoerus africanus' },
  { aliases: ['waterbuck'], categories: ['antelopes'], commonName: 'Waterbuck', id: 'waterbuck', image: informationPreview, scientificName: 'Kobus ellipsiprymnus' },
  { aliases: ['painted wolf', 'painted dog', 'wild dog'], categories: ['predators'], commonName: 'African Wild Dog', id: 'african-wild-dog', image: sightingsPreview, scientificName: 'Lycaon pictus' },
  { aliases: ['white rhino', 'square-lipped rhinoceros'], categories: ['big-five'], commonName: 'White Rhinoceros', id: 'white-rhinoceros', image: informationPreview, scientificName: 'Ceratotherium simum' },
  { aliases: ['plains zebra', 'zebra'], categories: [], commonName: 'Zebra', id: 'zebra', image: mapPreview, scientificName: 'Equus quagga' },
] as const

const profiles: Readonly<Record<string, MammalProfile>> = {
  'african-lion': profile('A powerful social cat and one of Kruger’s most recognisable predators.', ['Broad head and tawny coat', 'Adult males often have a mane'], 'Savanna, woodland and river corridors.', 'Most active from dusk to dawn.', 'Mainly medium and large herbivores.', 'Prides of related females, cubs and coalition males.', 'Vulnerable', ['A lion’s roar can carry for several kilometres.'], true, 3),
  'african-elephant': profile('The world’s largest land mammal and an influential landscape engineer.', ['Large ears and long trunk', 'Tusks in many adults'], 'Woodland, savanna and areas near water.', 'Travels widely to feed, drink and socialise.', 'Grass, leaves, bark, fruit and roots.', 'Matriarchal family herds; bulls may travel alone.', 'Endangered', ['Elephants communicate using very low-frequency calls.'], true, 5),
  'african-buffalo': profile('A formidable herd animal commonly seen near grazing and water.', ['Heavy horns with a broad boss', 'Dark, powerful body'], 'Grassland, woodland and riverine areas.', 'Grazes in cooler hours and rests during heat.', 'Primarily grasses.', 'Large mixed herds and smaller bachelor groups.', 'Near Threatened', ['Herd members may collectively defend calves.'], false, 0),
  'black-rhinoceros': profile('A scarce browser with a hooked upper lip suited to shrubs.', ['Hooked upper lip', 'Two horns and compact build'], 'Dense bush, thickets and dry woodland.', 'Often solitary and alert, especially around scent marks.', 'Leaves, shoots and woody plants.', 'Mostly solitary outside mother-calf pairs.', 'Critically Endangered', ['The hooked lip helps pull leaves from thorny plants.'], false, 0),
  'chacma-baboon': profile('An intelligent, adaptable primate often encountered in large troops.', ['Long dog-like muzzle', 'Grey-brown coat and bare face'], 'Woodland, rocky hills and river corridors.', 'Forages by day and sleeps in trees or on cliffs.', 'Fruit, seeds, roots, insects and small animals.', 'Complex multi-male, multi-female troops.', 'Least Concern', ['Troops use many calls and social gestures.'], true, 2),
  cheetah: profile('A streamlined daytime hunter built for short bursts of exceptional speed.', ['Black tear marks', 'Slender body with solid spots'], 'Open savanna and lightly wooded grassland.', 'Usually hunts by sight during daylight.', 'Mostly small and medium antelope.', 'Females are solitary; males may form coalitions.', 'Vulnerable', ['Its tail helps balance during rapid turns.'], false, 0),
  'greater-kudu': profile('A tall woodland antelope known for elegant stripes and spiral horns.', ['White vertical body stripes', 'Males carry long spiral horns'], 'Woodland, thickets and broken bushveld.', 'Secretive browser, active in cooler periods.', 'Leaves, shoots, pods and fruit.', 'Small female groups; mature bulls often separate.', 'Least Concern', ['Its large ears help detect faint sounds.'], true, 1),
  giraffe: profile('Kruger’s tallest browser, easily recognised above the woodland canopy.', ['Very long neck and legs', 'Irregular brown coat patches'], 'Savanna and open woodland with browse trees.', 'Feeds for much of the day and moves calmly between trees.', 'Leaves and shoots, especially acacia relatives.', 'Loose, changing groups without fixed membership.', 'Vulnerable', ['A giraffe’s tongue is adapted for browsing thorny branches.'], true, 4),
  'honey-badger': profile('A compact, tenacious forager with a broad appetite.', ['Black underside with pale mantle', 'Low, powerful body'], 'Woodland, savanna and scrub.', 'Mostly solitary and often active after dark.', 'Insects, reptiles, rodents, fruit and carrion.', 'Usually solitary outside breeding encounters.', 'Least Concern', ['Strong claws make it an effective digger.'], false, 0),
  impala: profile('A graceful and abundant antelope of woodland edges.', ['Reddish coat and black rump markings', 'Lyre-shaped horns on males'], 'Open woodland near grass and water.', 'Active in daylight, with seasonal breeding behaviour.', 'Both grasses and browse.', 'Female herds, bachelor groups and territorial males.', 'Least Concern', ['Impalas can make long, high evasive leaps.'], true, 7),
  leopard: profile('A secretive, powerful cat that often rests or stores prey in trees.', ['Rosette-patterned coat', 'Long tail and muscular build'], 'Woodland, rocky ground and riverine vegetation.', 'Solitary, territorial and mainly nocturnal.', 'Antelope, small mammals and opportunistic prey.', 'Solitary except mothers with cubs.', 'Vulnerable', ['Individuals can be identified by their rosette patterns.'], true, 1),
  nyala: profile('A shy woodland antelope with strong differences between males and females.', ['Males are dark with spiral horns', 'Both sexes have pale vertical stripes'], 'Dense woodland and riverine thickets.', 'Browses quietly near cover.', 'Leaves, twigs, fruit and some grass.', 'Small loose groups; older bulls may be solitary.', 'Least Concern', ['Males raise a mane during displays.'], false, 0),
  porcupine: profile('Africa’s largest rodent, protected by striking black-and-white quills.', ['Long banded quills', 'Heavy, rounded body'], 'Woodland, rocky country and burrow-rich terrain.', 'Nocturnal and usually shelters by day.', 'Roots, bulbs, bark and fallen plant material.', 'Pairs or small family groups.', 'Least Concern', ['Quills are defensive hairs and cannot be shot.'], false, 0),
  'southern-bushbuck': profile('A cautious antelope closely associated with dense cover.', ['White spots and markings', 'Short spiral horns on males'], 'Riverine forest, thickets and woodland edges.', 'Secretive and often solitary.', 'Leaves, shoots, herbs and fallen fruit.', 'Mostly solitary.', 'Least Concern', ['Bushbuck often freeze in cover before moving away.'], false, 0),
  'spotted-hyena': profile('A highly social hunter and scavenger with a powerful bite.', ['Sloping back and rounded ears', 'Spotted sandy coat'], 'Savanna, woodland and open bushveld.', 'Active mainly at night but may travel by day.', 'Hunted prey, carrion and almost all animal remains.', 'Female-led clans.', 'Least Concern', ['Its calls help clan members coordinate over distance.'], true, 2),
  steenbok: profile('A small, solitary antelope that relies on camouflage and cover.', ['Large ears and reddish coat', 'Straight short horns on males'], 'Open woodland and grassland with scattered cover.', 'Often crouches low before sprinting away.', 'Browse, shoots, fruit and selected grasses.', 'Usually solitary or in dispersed pairs.', 'Least Concern', ['Steenbok may scrape soil over dung to hide it.'], false, 0),
  'vervet-monkey': profile('A lively tree-using primate common around rivers and woodland.', ['Black face framed by pale fur', 'Long tail and grey coat'], 'Riverine woodland and savanna near water.', 'Diurnal, social and frequently uses trees for safety.', 'Fruit, leaves, seeds, insects and small prey.', 'Multi-male, multi-female troops.', 'Least Concern', ['Different alarm calls can signal different threats.'], true, 3),
  warthog: profile('A sturdy grazer often seen kneeling to feed on short grass.', ['Facial warts and curved tusks', 'Sparse mane and upright tail when running'], 'Open savanna and woodland clearings.', 'Active by day and shelters in burrows.', 'Grass, roots and occasional other foods.', 'Female sounders with young; males often solitary.', 'Least Concern', ['Warthogs commonly enter burrows backwards for defence.'], true, 4),
  waterbuck: profile('A large antelope usually found within reach of permanent water.', ['Shaggy grey-brown coat', 'White ring around the rump'], 'River systems, floodplains and nearby woodland.', 'Grazes and rests near water and cover.', 'Mainly grasses.', 'Female groups, territorial males and bachelors.', 'Least Concern', ['Its distinctive rump ring is visible from behind.'], false, 0),
  'african-wild-dog': profile('An endangered pack hunter with a unique painted coat.', ['Large rounded ears', 'Irregular black, tan and white pattern'], 'Open woodland and savanna across large ranges.', 'Cooperative, energetic and strongly social.', 'Mostly medium-sized antelope.', 'Close-knit breeding packs.', 'Endangered', ['Every individual has a unique coat pattern.'], false, 0),
  'white-rhinoceros': profile('A broad-mouthed grazer and the larger of Africa’s two rhino species.', ['Wide square lip', 'Large body and pronounced shoulder hump'], 'Grassland and open savanna near water.', 'Grazes in cooler hours and rests during heat.', 'Short grasses.', 'Females may form small groups; bulls are territorial.', 'Near Threatened', ['“White” likely derives from a word describing its wide lip.'], true, 1),
  zebra: profile('A social grazer whose stripes make every individual recognisable.', ['Bold black-and-white stripes', 'Upright mane'], 'Grassland and open woodland.', 'Grazes and travels between pasture and water.', 'Mostly grasses.', 'Stable harems and bachelor groups.', 'Near Threatened', ['Stripe patterns are unique to each zebra.'], true, 6),
}

function profile(introduction: string, identificationFeatures: readonly string[], habitat: string, behaviour: string, diet: string, groupStructure: string, conservationStatus: string, interestingFacts: readonly string[], seen: boolean, sightingsCount: number): MammalProfile {
  return { behaviour, conservationStatus, demoProgress: { seen, sightingsCount }, diet, groupStructure, habitat, identificationFeatures, interestingFacts, introduction }
}

function createSpeciesPlaceholder(commonName: string): string {
  const label = commonName.toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#F6F3EC"/><circle cx="600" cy="390" r="190" fill="#1E3328"/><circle cx="505" cy="285" r="54" fill="#B78C45"/><circle cx="695" cy="285" r="54" fill="#B78C45"/><circle cx="430" cy="380" r="48" fill="#B78C45"/><circle cx="770" cy="380" r="48" fill="#B78C45"/><ellipse cx="600" cy="470" rx="130" ry="110" fill="#B78C45"/><text x="600" y="720" text-anchor="middle" fill="#1E3328" font-family="Georgia,serif" font-size="48" letter-spacing="3">${label}</text><text x="600" y="775" text-anchor="middle" fill="#1E3328" opacity=".66" font-family="Arial,sans-serif" font-size="25">ANIMAVIDI SPECIES PLACEHOLDER</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const mammals: readonly Mammal[] = mammalSummaries.map((mammal) => {
  const speciesPlaceholder = createSpeciesPlaceholder(mammal.commonName)
  const primaryImage = getMammalPrimaryImage(mammal.id)
  return {
    ...mammal,
    image: primaryImage ?? speciesPlaceholder,
    imageAlt: `${mammal.commonName} in Kruger National Park`,
    imageFallback: primaryImage ?? speciesPlaceholder,
    profile: profiles[mammal.id],
  }
})

export function findMammal(id: string): Mammal | undefined {
  return mammals.find((mammal) => mammal.id === id)
}

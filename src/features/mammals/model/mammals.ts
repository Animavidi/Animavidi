import { getMammalPrimaryImage } from '@/assets/mammals/mammalPrimaryImages'
import { krugerMammalChecklist } from '@/features/mammals/data/krugerMammalChecklist'

import type { Mammal, MammalCategory, MammalProfile } from './mammal'

type ExistingMammalSummary = Pick<Mammal, 'aliases' | 'categories' | 'commonName' | 'id'>

const existingMammalSummaries: readonly ExistingMammalSummary[] = [
  { aliases: ['lion'], categories: ['big-five', 'predators'], commonName: 'African Lion', id: 'african-lion' },
  { aliases: ['savanna elephant', 'elephant'], categories: ['big-five'], commonName: 'African Elephant', id: 'african-elephant' },
  { aliases: ['cape buffalo', 'buffalo'], categories: ['big-five'], commonName: 'African Buffalo', id: 'african-buffalo' },
  { aliases: ['black rhino', 'hook-lipped rhinoceros'], categories: ['big-five'], commonName: 'Black Rhinoceros', id: 'black-rhinoceros' },
  { aliases: ['baboon'], categories: ['primates'], commonName: 'Chacma Baboon', id: 'chacma-baboon' },
  { aliases: ['cheetah'], categories: ['predators'], commonName: 'Cheetah', id: 'cheetah' },
  { aliases: ['kudu'], categories: ['antelopes'], commonName: 'Greater Kudu', id: 'greater-kudu' },
  { aliases: ['giraffe'], categories: [], commonName: 'Giraffe', id: 'giraffe' },
  { aliases: ['ratel'], categories: ['predators', 'small-mammals'], commonName: 'Honey Badger', id: 'honey-badger' },
  { aliases: ['impala'], categories: ['antelopes'], commonName: 'Impala', id: 'impala' },
  { aliases: ['leopard'], categories: ['big-five', 'predators'], commonName: 'Leopard', id: 'leopard' },
  { aliases: ['nyala'], categories: ['antelopes'], commonName: 'Nyala', id: 'nyala' },
  { aliases: ['cape porcupine'], categories: ['small-mammals'], commonName: 'Porcupine', id: 'porcupine' },
  { aliases: ['bushbuck'], categories: ['antelopes'], commonName: 'Southern Bushbuck', id: 'southern-bushbuck' },
  { aliases: ['hyena', 'hyaena'], categories: ['predators'], commonName: 'Spotted Hyena', id: 'spotted-hyena' },
  { aliases: ['steenbuck'], categories: ['antelopes'], commonName: 'Steenbok', id: 'steenbok' },
  { aliases: ['monkey', 'vervet'], categories: ['primates'], commonName: 'Vervet Monkey', id: 'vervet-monkey' },
  { aliases: ['warthog'], categories: [], commonName: 'Warthog', id: 'warthog' },
  { aliases: ['waterbuck'], categories: ['antelopes'], commonName: 'Waterbuck', id: 'waterbuck' },
  { aliases: ['painted wolf', 'painted dog', 'wild dog'], categories: ['predators'], commonName: 'African Wild Dog', id: 'african-wild-dog' },
  { aliases: ['white rhino', 'square-lipped rhinoceros'], categories: ['big-five'], commonName: 'White Rhinoceros', id: 'white-rhinoceros' },
  { aliases: ['plains zebra', 'zebra'], categories: [], commonName: 'Zebra', id: 'zebra' },
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

const missingPhotoFallback = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F6F3EC"/><stop offset="1" stop-color="#E7E0D2"/></linearGradient><radialGradient id="light" cx="72%" cy="18%" r="72%"><stop stop-color="#B78C45" stop-opacity=".16"/><stop offset="1" stop-color="#1E3328" stop-opacity="0"/></radialGradient><pattern id="grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="#1E3328" opacity=".045"/><circle cx="13" cy="11" r=".55" fill="#B78C45" opacity=".06"/></pattern></defs><rect width="1200" height="900" fill="url(#paper)"/><rect width="1200" height="900" fill="url(#light)"/><rect width="1200" height="900" fill="url(#grain)"/><path d="M0 690C210 625 360 718 555 661c238-69 390-12 645 65v174H0Z" fill="#1E3328" opacity=".055"/><path d="M0 756c245-55 421 30 633-15 222-47 374 6 567 59v100H0Z" fill="#B78C45" opacity=".07"/></svg>')}`

function stableId(name: string): string {
  return name.normalize('NFKD').replace(/[’']/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLocaleLowerCase()
}

function categoriesFor(name: string, section: Mammal['overviewSection']): readonly MammalCategory[] {
  const normalized = name.toLocaleLowerCase()
  const categories: MammalCategory[] = section === 'small-mammals' ? ['small-mammals'] : []
  if (/buffalo|elephant$|leopard|lion$|rhinoceros/.test(normalized)) categories.push('big-five')
  if (/antelope|bushbuck|duiker|eland|grysbok|impala|klipspringer|kudu|nyala|oribi|reedbuck|rhebok|steenbok|suni|tsessebe|waterbuck/.test(normalized)) categories.push('antelopes')
  if (/baboon|bushbaby|monkey/.test(normalized)) categories.push('primates')
  if (/caracal|cheetah|civet|fox|genet|hyena|jackal|leopard|lion|mongoose|serval|wild cat|wild dog/.test(normalized)) categories.push('predators')
  return categories
}

function minimalProfile(commonName: string): MammalProfile {
  return profile(
    `${commonName} is included in the official SANParks Kruger mammal checklist. A fuller editorial profile will be added after content review.`,
    [],
    '',
    '',
    '',
    '',
    '',
    [],
    false,
    0,
  )
}

export const mammals: readonly Mammal[] = krugerMammalChecklist.map((entry) => {
  const id = entry.existingId ?? stableId(entry.officialName)
  const existing = existingMammalSummaries.find((mammal) => mammal.id === id)
  const commonName = entry.displayName ?? existing?.commonName ?? entry.officialName
  const primaryImage = getMammalPrimaryImage(id)
  return {
    aliases: [...new Set([...(existing?.aliases ?? []), ...(entry.aliases ?? []), entry.officialName, ...(existing ? [existing.commonName] : [])])],
    categories: existing?.categories ?? categoriesFor(commonName, entry.section),
    commonName,
    id,
    image: primaryImage ?? missingPhotoFallback,
    imageAlt: `${commonName} in Kruger National Park`,
    imageFallback: primaryImage ?? missingPhotoFallback,
    officialCommonName: entry.officialName,
    overviewSection: entry.section,
    profile: profiles[id] ?? minimalProfile(commonName),
    scientificName: entry.scientificName,
    smallMammalGroup: entry.smallMammalGroup,
    sortName: entry.sortName ?? commonName,
  }
})

export function findMammal(id: string): Mammal | undefined {
  return mammals.find((mammal) => mammal.id === id)
}

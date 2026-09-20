import type { L, MasterId } from './site';
import { NAILS_ONLINE_BOOKING } from './site';

export const STAGES = { INTRO: 0, MENU: 1, SERVICE_DETAIL: 2, ABOUT: 3, VIDEO: 4 };

export type CategoryId = 'cosmetics' | 'devices' | 'lashes' | 'nails';

export const CATEGORIES: { id: CategoryId; title: L<string> }[] = [
  { id: 'cosmetics', title: { cs: 'Kosmetika', en: 'Facial care' } },
  { id: 'devices', title: { cs: 'Přístrojová péče', en: 'Device treatments' } },
  { id: 'lashes', title: { cs: 'Řasy a obočí', en: 'Lashes & brows' } },
  { id: 'nails', title: { cs: 'Manikúra a pedikúra', en: 'Manicure & pedicure' } },
];

export interface PriceRow {
  label: L<string>;
  price: string;
}
export interface PriceGroup {
  title?: L<string>;
  rows: PriceRow[];
}

export interface Service {
  id: string;
  category: CategoryId;
  master: MasterId;
  shortTitle: L<string>;
  title: L<string>;
  subtitle: L<string>;
  desc: L<string>;
  includes?: L<string[]>;
  extras?: L<string[]>;
  priceGroups?: PriceGroup[];
  price: string; // hlavní cena, např. "1 600 Kč"
  priceFrom?: boolean; // "od"
  time?: string;
  bookingUrl?: string;
}

const HAND_WRAP = { cs: 'Zábal na ruce', en: 'Hand wrap' };
const LYMPH = { cs: 'Přístrojová lymfodrenáž', en: 'Device lymphatic drainage' };
const FACIAL_EXTRAS: L<string[]> = {
  cs: [HAND_WRAP.cs, LYMPH.cs],
  en: [HAND_WRAP.en, LYMPH.en],
};

export const SERVICES: Service[] = [
  // ───────────── KOSMETIKA (Veronika) ─────────────
  {
    id: 'lifting',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Lifting obličeje', en: 'Face lifting' },
    title: { cs: 'Lifting obličeje a dekoltu', en: 'Face & décolleté lifting' },
    subtitle: { cs: 'Kosmetika', en: 'Facial care' },
    desc: {
      cs: 'Komplexní ošetření obličeje a dekoltu s lymfomasáží skleněnou baňkou, čištěním pleti, peelingem a závěrečnou masáží.',
      en: 'A complete facial and décolleté treatment with lymph massage using a small glass cup, skin cleansing, peeling and a finishing massage.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti, úprava obočí', 'Změkčující gel', 'Lymfomasáž pomocí malé skleněné baňky', 'Čištění pleti (ultrazvuková špachtle/ruční)', 'Peeling, ozonizér', 'Zapracování séra pomocí ultrazvukové sondy', 'Maska, (LED Therapy)', 'Celková masáž (dekolt, krk a obličej)', 'Závěrečný krém'],
      en: ['Makeup removal, skin toning, eyebrow shaping', 'Softening gel', 'Lymph massage with a small glass cup', 'Skin cleansing (ultrasonic spatula / manual)', 'Peeling, ozonizer', 'Serum infusion with an ultrasonic probe', 'Mask, (LED therapy)', 'Full massage (décolleté, neck and face)', 'Finishing cream'],
    },
    extras: FACIAL_EXTRAS,
    price: '1 600 Kč',
    time: '90 min',
  },
  {
    id: 'lifting-electroporation',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Lifting + elektroporace', en: 'Lifting + electroporation' },
    title: { cs: 'Lifting obličeje a dekoltu (neinvazivní mezoterapie – elektroporace)', en: 'Face & décolleté lifting (non-invasive mesotherapy – electroporation)' },
    subtitle: { cs: 'Neinvazivní mezoterapie', en: 'Non-invasive mesotherapy' },
    desc: {
      cs: 'Lifting obličeje a dekoltu, při kterém se sérum zapracovává pomocí elektroporace – neinvazivní mezoterapie bez jehel.',
      en: 'A face and décolleté lifting in which the serum is infused by electroporation – needle-free, non-invasive mesotherapy.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti, úprava obočí', 'Změkčující gel', 'Lymfomasáž pomocí malé skleněné baňky', 'Čištění pleti (ultrazvuková špachtle/ruční)', '(Peeling), (ozonizér)', 'Zapracování séra pomocí elektroporace', 'Maska, (LED Therapy)', 'Celková masáž (dekolt, krk a obličej)', 'Závěrečný krém'],
      en: ['Makeup removal, skin toning, eyebrow shaping', 'Softening gel', 'Lymph massage with a small glass cup', 'Skin cleansing (ultrasonic spatula / manual)', '(Peeling), (ozonizer)', 'Serum infusion by electroporation', 'Mask, (LED therapy)', 'Full massage (décolleté, neck and face)', 'Finishing cream'],
    },
    extras: FACIAL_EXTRAS,
    price: '1 800 Kč',
    time: '90 min',
  },
  {
    id: 'biodynamic',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Biodynamická kosmetika', en: 'Biodynamic cosmetics' },
    title: { cs: 'Biodynamická kosmetika', en: 'Biodynamic cosmetics' },
    subtitle: { cs: 'Kosmetika', en: 'Facial care' },
    desc: {
      cs: 'Biodynamické kosmetické ošetření s peelingem, čištěním pleti, masáží rukou a masáží obličeje a dekoltu.',
      en: 'A biodynamic facial with peeling, skin cleansing, a hand massage and a face and décolleté massage.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti, peeling', 'Masáž rukou', 'Čištění pleti', '(Barvení obočí a řas, depilace horní ret)', 'Zapracování séra – oční', 'Maska', 'Masáž obličeje a dekoltu', 'Závěrečný krém'],
      en: ['Makeup removal, skin toning, peeling', 'Hand massage', 'Skin cleansing', '(Eyebrow and lash tinting, upper lip waxing)', 'Eye serum infusion', 'Mask', 'Face and décolleté massage', 'Finishing cream'],
    },
    extras: {
      cs: ['Masáž nohou ke kosmetickému ošetření (+ cca 30 minut) … 200 Kč', 'Přístrojová lymfodrenáž (lze jen k základnímu ošetření) … 450 Kč'],
      en: ['Foot massage added to the treatment (+ approx. 30 minutes) … 200 CZK', 'Device lymphatic drainage (only with the basic treatment) … 450 CZK'],
    },
    price: '1 700 Kč',
    time: '90 min',
  },
  {
    id: 'carboxytherapy',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Karboxyterapie', en: 'Carboxytherapy' },
    title: { cs: 'Karboxyterapie (bezjehličková / neinvazivní)', en: 'Carboxytherapy (needle-free / non-invasive)' },
    subtitle: { cs: 'Bezjehličková', en: 'Needle-free' },
    desc: {
      cs: 'Bezjehličková karboxyterapie pečlivě čistí, vyživuje pokožku a stimuluje její regeneraci.',
      en: 'Needle-free carboxytherapy carefully cleanses, nourishes the skin and stimulates its regeneration.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti, úprava obočí', 'Změkčující gel', 'Lymfomasáž pomocí malé skleněné baňky', 'Čištění pleti (ultrazvuková špachtle/ruční)', 'Ozonizér', 'Bezjehličková karboxyterapie', 'Zapracování séra pomocí ultrazvukové sondy', '(Maska)', 'Relaxační masáž (dekolt, krk a obličej)', 'Závěrečný krém, SPF krém'],
      en: ['Makeup removal, skin toning, eyebrow shaping', 'Softening gel', 'Lymph massage with a small glass cup', 'Skin cleansing (ultrasonic spatula / manual)', 'Ozonizer', 'Needle-free carboxytherapy', 'Serum infusion with an ultrasonic probe', '(Mask)', 'Relaxing massage (décolleté, neck and face)', 'Finishing cream, SPF cream'],
    },
    extras: FACIAL_EXTRAS,
    price: '1 800 Kč',
    time: '90 min',
  },
  {
    id: 'hydrolifting',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Hydrolifting', en: 'Hydrolifting' },
    title: { cs: 'Hydrolifting', en: 'Hydrolifting' },
    subtitle: { cs: 'Čištění a hydratace', en: 'Cleansing & hydration' },
    desc: {
      cs: 'Velmi šetrné hloubkové čištění pleti a intenzivní hydratace.',
      en: 'Very gentle deep cleansing of the skin and intensive hydration.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti, úprava obočí', 'Čištění pleti (ultrazvuková špachtle/ruční)', 'Hydrolifting', 'Ozonizér', 'Zapracování séra pomocí ultrazvukové sondy', '(Maska)', 'Celková masáž (dekolt, krk a obličej)', 'Závěrečný krém, SPF krém'],
      en: ['Makeup removal, skin toning, eyebrow shaping', 'Skin cleansing (ultrasonic spatula / manual)', 'Hydrolifting', 'Ozonizer', 'Serum infusion with an ultrasonic probe', '(Mask)', 'Full massage (décolleté, neck and face)', 'Finishing cream, SPF cream'],
    },
    extras: FACIAL_EXTRAS,
    price: '1 600 Kč',
    time: '90 min',
  },
  {
    id: 'microdermabrasion',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Mikrodermabraze', en: 'Microdermabrasion' },
    title: { cs: 'Diamantová mikrodermabraze', en: 'Diamond microdermabrasion' },
    subtitle: { cs: 'Vyhlazení pleti', en: 'Skin smoothing' },
    desc: {
      cs: 'Peeling pomocí diamantové dermabraze – vyhlazení a omlazení pleti, redukuje vrásky a hloubkově čistí pleť.',
      en: 'Peeling by diamond dermabrasion – smooths and rejuvenates the skin, reduces wrinkles and cleanses deeply.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti, úprava obočí', 'Čištění pleti (ultrazvuková špachtle/ruční)', 'Peeling pomocí diamantové dermabraze', 'Ozonizér', 'Zapracování séra pomocí ultrazvukové sondy', 'Maska', 'Závěrečný krém, SPF krém'],
      en: ['Makeup removal, skin toning, eyebrow shaping', 'Skin cleansing (ultrasonic spatula / manual)', 'Peeling by diamond dermabrasion', 'Ozonizer', 'Serum infusion with an ultrasonic probe', 'Mask', 'Finishing cream, SPF cream'],
    },
    extras: FACIAL_EXTRAS,
    price: '1 600 Kč',
    time: '90 min',
  },
  {
    id: 'dermapen',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Dermapen', en: 'Dermapen' },
    title: { cs: 'Mezoterapie – Dermapen', en: 'Mesotherapy – Dermapen' },
    subtitle: { cs: 'Omlazení pleti', en: 'Skin rejuvenation' },
    desc: {
      cs: 'Zapracování séra Dermapenem omlazuje pokožku, vypíná vrásky, sjednocuje tón pleti, hydratuje pokožku a vyhlazuje jizvičky.',
      en: 'Infusing the serum with the Dermapen rejuvenates the skin, tightens wrinkles, evens out skin tone, hydrates and smooths small scars.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti, dezinfekce pleti', 'Emulze na znecitlivění pokožky (působí 15–20 minut)', 'Zapracování séra Dermapenem', 'Zklidňující maska', 'Závěrečný krém'],
      en: ['Makeup removal, skin toning, skin disinfection', 'Numbing emulsion (works for 15–20 minutes)', 'Serum infusion with the Dermapen', 'Soothing mask', 'Finishing cream'],
    },
    extras: { cs: [HAND_WRAP.cs], en: [HAND_WRAP.en] },
    priceGroups: [
      {
        rows: [
          { label: { cs: 'Obličej (60 minut)', en: 'Face (60 minutes)' }, price: '2 300 Kč' },
          { label: { cs: 'Obličej, krk a dekolt (60 minut)', en: 'Face, neck and décolleté (60 minutes)' }, price: '2 900 Kč' },
        ],
      },
    ],
    price: '2 300 Kč',
    priceFrom: true,
    time: '60 min',
  },
  {
    id: 'chemical-peel',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Chemický peeling', en: 'Chemical peel' },
    title: { cs: 'Chemický peeling', en: 'Chemical peel' },
    subtitle: { cs: 'Peeling', en: 'Peeling' },
    desc: {
      cs: 'Chemický peeling s přípravou pleti (Pre-Peel), neutralizací a zapracováním ampule séra.',
      en: 'A chemical peel with skin preparation (Pre-Peel), neutralisation and an infused serum ampoule.',
    },
    includes: {
      cs: ['Odlíčení', 'Pre-Peel (příprava pleti pro peeling)', 'Chemický peeling', 'Neutralizace pleti', 'Zapracování ampule séra (pomocí ultrazvukové sondy / elektroporace)', 'Maska, thermogel', 'Závěrečný krém, SPF krém'],
      en: ['Makeup removal', 'Pre-Peel (skin preparation for the peel)', 'Chemical peel', 'Skin neutralisation', 'Serum ampoule infusion (ultrasonic probe / electroporation)', 'Mask, thermogel', 'Finishing cream, SPF cream'],
    },
    extras: { cs: [HAND_WRAP.cs], en: [HAND_WRAP.en] },
    price: '1 900 Kč',
    time: '60 min',
  },
  {
    id: 'problem-skin',
    category: 'cosmetics',
    master: 'veronika',
    shortTitle: { cs: 'Problematická pleť', en: 'Problem & acne skin' },
    title: { cs: 'Kosmetika problematické a aknózní pleti', en: 'Care for problem and acne-prone skin' },
    subtitle: { cs: 'Specializace', en: 'Specialty' },
    desc: {
      cs: 'Veškerá používaná kosmetika je vhodná na problematickou a aknózní pleť.',
      en: 'All the cosmetics used are suitable for problem and acne-prone skin.',
    },
    includes: {
      cs: ['Odlíčení, tonizace pleti', '(Peeling)', 'Změkčující gel', 'Ruční čištění pleti', '(Ozonizér)', 'Sérum', 'Maska, (LED Therapy)', 'Závěrečný krém'],
      en: ['Makeup removal, skin toning', '(Peeling)', 'Softening gel', 'Manual skin cleansing', '(Ozonizer)', 'Serum', 'Mask, (LED therapy)', 'Finishing cream'],
    },
    extras: FACIAL_EXTRAS,
    price: '1 400 Kč',
    time: '90 min',
  },

  // ───────────── PŘÍSTROJOVÁ PÉČE (Veronika) ─────────────
  {
    id: 'lymph-drainage',
    category: 'devices',
    master: 'veronika',
    shortTitle: { cs: 'Lymfodrenáž', en: 'Lymphatic drainage' },
    title: { cs: 'Přístrojová lymfodrenáž (lymfatické nohavice)', en: 'Device lymphatic drainage (lymphatic boots)' },
    subtitle: { cs: 'Detoxikace', en: 'Detox' },
    desc: {
      cs: 'Uvolnění mízních uzlin a přístrojová lymfodrenáž – uvolňuje namožené svaly a detoxikuje.',
      en: 'Release of the lymph nodes and device lymphatic drainage – relaxes strained muscles and detoxifies.',
    },
    includes: {
      cs: ['Uvolnění mízních uzlin', 'Přístrojová lymfodrenáž'],
      en: ['Release of the lymph nodes', 'Device lymphatic drainage'],
    },
    extras: {
      cs: ['Celková masáž – dekolt, krk a obličej', HAND_WRAP.cs],
      en: ['Full massage – décolleté, neck and face', HAND_WRAP.en],
    },
    priceGroups: [
      {
        rows: [
          { label: { cs: '1 procedura (45 minut)', en: '1 session (45 minutes)' }, price: '700 Kč' },
          { label: { cs: '5 procedur (á 640 Kč)', en: '5 sessions (640 CZK each)' }, price: '3 200 Kč' },
          { label: { cs: '10 procedur (á 600 Kč)', en: '10 sessions (600 CZK each)' }, price: '6 000 Kč' },
        ],
      },
    ],
    price: '700 Kč',
    time: '45 min',
  },
  {
    id: 'emszero',
    category: 'devices',
    master: 'veronika',
    shortTitle: { cs: 'EMSzero', en: 'EMSzero' },
    title: { cs: 'EMSzero', en: 'EMSzero' },
    subtitle: { cs: 'Posílení svalů a zpevnění postavy', en: 'Muscle strengthening & body contouring' },
    desc: {
      cs: 'EMS Zero je inovativní neinvazivní metoda pro posílení svalů a zpevnění postavy pomocí pokročilé elektromagnetické stimulace (HI-EMT). Při ošetření dochází k intenzivním svalovým kontrakcím, rychlejším a silnějším než při běžném cvičení. To vede k budování svalů, zpevnění kontur těla a redukci přebytečného tuku. Ošetření je bezbolestné, nevyžaduje rekonvalescenci a je ideální jako doplněk ke zdravému životnímu stylu.',
      en: 'EMS Zero is an innovative non-invasive method for strengthening muscles and firming the figure using advanced electromagnetic stimulation (HI-EMT). The treatment causes intense muscle contractions, faster and stronger than regular exercise. This helps build muscle, firm body contours and reduce excess fat. The treatment is painless, needs no recovery time and is an ideal complement to a healthy lifestyle.',
    },
    extras: FACIAL_EXTRAS,
    priceGroups: [
      {
        rows: [
          { label: { cs: '1 zvolená partie (30 minut)', en: '1 chosen area (30 minutes)' }, price: '700 Kč' },
          { label: { cs: '2 zvolené partie (30 minut)', en: '2 chosen areas (30 minutes)' }, price: '1 100 Kč' },
          { label: { cs: 'Balíček 5 procedur + 2 zdarma', en: 'Package of 5 sessions + 2 free' }, price: '5 500 Kč' },
          { label: { cs: 'Posílení pánevního dna (30 minut)', en: 'Pelvic floor strengthening (30 minutes)' }, price: '600 Kč' },
        ],
      },
    ],
    price: '700 Kč',
    priceFrom: true,
    time: '30 min',
  },

  // ───────────── ŘASY A OBOČÍ (Veronika) ─────────────
  {
    id: 'lash-lifting',
    category: 'lashes',
    master: 'veronika',
    shortTitle: { cs: 'Lash lifting řas', en: 'Lash lifting' },
    title: { cs: 'Lash lifting řas', en: 'Lash lifting' },
    subtitle: { cs: 'Natočení a barvení řas', en: 'Lash curl & tint' },
    desc: {
      cs: 'Lash lifting řas (natočení řas) včetně barvení řas. Pracujeme se značkou Elleebana.',
      en: 'Lash lifting (curling of the lashes) including lash tinting. We work with the Elleebana brand.',
    },
    price: '1 200 Kč',
  },
  {
    id: 'brows-lashes',
    category: 'lashes',
    master: 'veronika',
    shortTitle: { cs: 'Obočí a řasy', en: 'Brows & lashes' },
    title: { cs: 'Obočí, řasy a depilace', en: 'Brows, lashes & waxing' },
    subtitle: { cs: 'Samostatné procedury', en: 'Stand-alone treatments' },
    desc: {
      cs: 'Úprava a barvení obočí, barvení řas a depilace/epilace horního rtu – samostatně nebo jako doplněk ke kosmetickému ošetření.',
      en: 'Eyebrow shaping and tinting, lash tinting and upper lip hair removal – on their own or as an add-on to a facial.',
    },
    priceGroups: [
      {
        title: { cs: 'Samostatné procedury', en: 'Stand-alone treatments' },
        rows: [
          { label: { cs: 'Obočí – úprava + barvení', en: 'Eyebrows – shaping + tint' }, price: '300 Kč' },
          { label: { cs: 'Řasy – barvení', en: 'Lashes – tint' }, price: '250 Kč' },
          { label: { cs: 'Obočí (úprava + barvení) + řasy (barvení)', en: 'Eyebrows (shaping + tint) + lashes (tint)' }, price: '500 Kč' },
          { label: { cs: 'Depilace/epilace horní ret', en: 'Upper lip hair removal' }, price: 'od 150 Kč' },
        ],
      },
      {
        title: { cs: 'Procedury ke kosmetice', en: 'Add-ons to a facial' },
        rows: [
          { label: { cs: 'Barvení obočí', en: 'Eyebrow tint' }, price: '120 Kč' },
          { label: { cs: 'Barvení řas', en: 'Lash tint' }, price: '120 Kč' },
          { label: { cs: 'Depilace/epilace horní ret', en: 'Upper lip hair removal' }, price: 'od 120 Kč' },
          { label: { cs: 'Vypichování milií', en: 'Milia removal' }, price: '100 Kč' },
        ],
      },
    ],
    price: '120 Kč',
    priceFrom: true,
  },

  // ───────────── MANIKÚRA A PEDIKÚRA (Notika, Lucie) ─────────────
  {
    id: 'manicure',
    category: 'nails',
    master: 'notika',
    shortTitle: { cs: 'Manikúra', en: 'Manicure' },
    title: { cs: 'Kombinovaná manikúra – dámská i pánská', en: 'Combined manicure – women & men' },
    subtitle: { cs: 'Paní Notika', en: 'With Notika' },
    desc: {
      cs: 'Kombinovaná manikúra, gel lak a doplnění nehtů. Cena designu závisí na složitosti a počtu zdobených nehtů.',
      en: 'Combined manicure, gel polish and nail refills. The price of nail art depends on its complexity and the number of decorated nails.',
    },
    priceGroups: [
      {
        rows: [
          { label: { cs: 'Kombinovaná manikúra', en: 'Combined manicure' }, price: '600 Kč' },
          { label: { cs: 'Kombinovaná manikúra + odstranění', en: 'Combined manicure + removal' }, price: '700 Kč' },
          { label: { cs: 'Pánská manikúra', en: 'Men’s manicure' }, price: '700 Kč' },
          { label: { cs: 'Manikúra + gel lak', en: 'Manicure + gel polish' }, price: '900 Kč' },
          { label: { cs: 'Doplnění nehtů + gel lak', en: 'Nail refill + gel polish' }, price: '1 100 Kč' },
          { label: { cs: 'Oprava 1 nehtu', en: 'Repair of 1 nail' }, price: '50 Kč' },
          { label: { cs: '1 umělý nehet', en: '1 artificial nail' }, price: '70 Kč' },
        ],
      },
      {
        title: { cs: 'Design', en: 'Nail art' },
        rows: [
          { label: { cs: 'Jednoduchý design (1 nehet)', en: 'Simple design (1 nail)' }, price: '25 Kč' },
          { label: { cs: 'Složitý design (1 nehet)', en: 'Complex design (1 nail)' }, price: '50 Kč' },
          { label: { cs: 'Kočičí oko', en: 'Cat eye' }, price: '70 Kč' },
          { label: { cs: 'Perleťový efekt', en: 'Pearl effect' }, price: '100 Kč' },
          { label: { cs: 'Francouzská manikúra', en: 'French manicure' }, price: '150 Kč' },
        ],
      },
    ],
    price: '600 Kč',
    priceFrom: true,
    bookingUrl: NAILS_ONLINE_BOOKING,
  },
  {
    id: 'pedicure',
    category: 'nails',
    master: 'notika',
    shortTitle: { cs: 'Pedikúra', en: 'Pedicure' },
    title: { cs: 'Kombinovaná pedikúra – dámská i pánská', en: 'Combined pedicure – women & men' },
    subtitle: { cs: 'Paní Notika', en: 'With Notika' },
    desc: {
      cs: 'Kombinovaná pedikúra bez lakování nebo s gel lakem – pro ženy i muže.',
      en: 'Combined pedicure with or without gel polish – for women and men.',
    },
    priceGroups: [
      {
        rows: [
          { label: { cs: 'Pedikúra bez gel laku', en: 'Pedicure without gel polish' }, price: '800 Kč' },
          { label: { cs: 'Pedikúra (jen prsty) + gel lak', en: 'Pedicure (toes only) + gel polish' }, price: '800 Kč' },
          { label: { cs: 'Pedikúra + gel lak', en: 'Pedicure + gel polish' }, price: '1 050 Kč' },
          { label: { cs: 'Pánská pedikúra', en: 'Men’s pedicure' }, price: '900 Kč' },
        ],
      },
    ],
    price: '800 Kč',
    priceFrom: true,
    bookingUrl: NAILS_ONLINE_BOOKING,
  },
  {
    id: 'nail-spa',
    category: 'nails',
    master: 'notika',
    shortTitle: { cs: 'Posílení nehtů & SPA', en: 'Nail strengthening & SPA' },
    title: { cs: 'Posílení nehtů a SPA péče', en: 'Nail strengthening & SPA care' },
    subtitle: { cs: 'Doplňkové služby', en: 'Add-on services' },
    desc: {
      cs: 'Posílení nehtů a SPA péče o ruce a nohy – dámská i pánská. Lze přidat k manikúře nebo pedikúře.',
      en: 'Nail strengthening and SPA care for hands and feet – for women and men. Can be added to a manicure or pedicure.',
    },
    priceGroups: [
      {
        rows: [
          { label: { cs: 'P-shine', en: 'P-shine' }, price: '150 Kč' },
          { label: { cs: 'IBX systém', en: 'IBX system' }, price: '150 Kč' },
          { label: { cs: 'Parafín na ruce', en: 'Paraffin for hands' }, price: '150 Kč' },
          { label: { cs: 'Parafín na nohy', en: 'Paraffin for feet' }, price: '150 Kč' },
          { label: { cs: 'Masážní svíčka', en: 'Massage candle' }, price: '100 Kč' },
        ],
      },
    ],
    price: '100 Kč',
    priceFrom: true,
    bookingUrl: NAILS_ONLINE_BOOKING,
  },
  {
    id: 'wet-pedicure',
    category: 'nails',
    master: 'lucie',
    shortTitle: { cs: 'Mokrá pedikúra', en: 'Wet pedicure' },
    title: { cs: 'Mokrá zdravotní pedikúra', en: 'Wet (medical) pedicure' },
    subtitle: { cs: 'Paní Lucie · jen čtvrtek', en: 'With Lucie · Thursdays only' },
    desc: {
      cs: 'Mokrá zdravotní pedikúra pro ženy i muže. Provádí paní Lucie, pouze ve čtvrtek.',
      en: 'Wet medical pedicure for women and men, performed by Lucie on Thursdays only.',
    },
    includes: {
      cs: ['Mokrá pedikúra (skalpel)', '(Odstranění kuřího oka)', 'Peeling', 'Masáž nohou', 'Lakování nehtů'],
      en: ['Wet pedicure (scalpel)', '(Corn removal)', 'Peeling', 'Foot massage', 'Nail polish'],
    },
    price: '790 Kč',
    time: '60 min',
  },
];

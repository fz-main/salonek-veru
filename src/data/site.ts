export type Lang = 'cs' | 'en';
export type L<T> = Record<Lang, T>;

const IMG = `${import.meta.env.BASE_URL}images`; // фото лежат в public/images

export const SITE = {
  name: 'Salonek Veru',
  website: 'https://www.salonekveru.cz',
  address: {
    cs: 'Dělnická 6, 170 00 Praha 7 – Holešovice',
    en: 'Dělnická 6, 170 00 Prague 7 – Holešovice',
  } as L<string>,
  email: 'veronika.pavelka@seznam.cz',
  facebook: 'https://www.facebook.com/profile.php?id=100092093316300',
  instagram: 'https://www.instagram.com/salonekveru/',
  mapUrl: 'https://mapy.cz/s/gevatenuza',
  googleReviewsUrl:
    'https://www.google.com/maps/search/?api=1&query=Salonek+Veru+D%C4%9Blnick%C3%A1+6+Praha+7',
  privacyUrl: 'https://www.salonekveru.cz/kontakt/zasady-ochrany-osobnich-udaju/',
  rating: 5.0,
  reviewsCount: 25,
  images: {
    hero: `${IMG}/salon.jpg`,
    about: `${IMG}/salon.jpg`, // фото от клиента, лежат в public/images
    gallery: [
      { src: `${IMG}/salon.jpg`, alt: { cs: 'Interiér salonu', en: 'Salon interior' } },
      { src: `${IMG}/gallery-room-wide.jpg`, alt: { cs: 'Prostory salonu', en: 'The salon' } },
      { src: `${IMG}/gallery-waiting.jpg`, alt: { cs: 'Recepce a místo k sezení', en: 'Reception and seating area' } },
      { src: `${IMG}/gallery-nail-station.jpg`, alt: { cs: 'Místo pro manikúru', en: 'Nail station' } },
      { src: `${IMG}/gallery-nail-station-2.jpg`, alt: { cs: 'Místo pro manikúru', en: 'Nail station' } },
      { src: `${IMG}/gallery-treatment-room.jpg`, alt: { cs: 'Kosmetická kabinka', en: 'Treatment room' } },
      { src: `${IMG}/gallery-nails-pink.jpg`, alt: { cs: 'Manikúra', en: 'Manicure' } },
      { src: `${IMG}/gallery-nails-towel.jpg`, alt: { cs: 'Manikúra', en: 'Manicure' } },
      { src: `${IMG}/gallery-manicure-work.jpg`, alt: { cs: 'Manikúra v salonu', en: 'Manicure at the salon' } },
      { src: `${IMG}/gallery-nails-color.jpg`, alt: { cs: 'Barevná manikúra', en: 'Colourful manicure' } },
    ] as { src: string; alt: L<string> }[],
  },
};

export type MasterId = 'veronika' | 'notika' | 'lucie';

export interface Master {
  id: MasterId;
  name: string;
  role: L<string>;
  phone: string; // pro zobrazení
  tel: string; // pro tel:
  note?: L<string>;
}

export const MASTERS: Record<MasterId, Master> = {
  veronika: {
    id: 'veronika',
    name: 'Veronika',
    role: {
      cs: 'Kosmetika, lash lifting řas, lymfatické nohavice, biodynamická kosmetika, EMSzero',
      en: 'Cosmetic treatments, lash lifting, lymphatic drainage boots, biodynamic cosmetics, EMSzero',
    },
    phone: '605 008 500',
    tel: '+420605008500',
  },
  notika: {
    id: 'notika',
    name: 'Notika',
    role: { cs: 'Kombinovaná pedikúra a manikúra', en: 'Combined pedicure and manicure' },
    phone: '775 619 214',
    tel: '+420775619214',
  },
  lucie: {
    id: 'lucie',
    name: 'Lucie',
    role: { cs: 'Mokrá pedikúra (zdravotní)', en: 'Wet (medical) pedicure' },
    phone: '723 610 017',
    tel: '+420723610017',
    note: { cs: 'jen čtvrtek', en: 'Thursdays only' },
  },
};

export const NAILS_ONLINE_BOOKING = 'https://nails59.reservio.com/services';

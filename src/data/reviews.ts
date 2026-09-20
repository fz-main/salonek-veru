import type { L } from './site';

// Recenze z Google Maps (Salonek Veru, 5,0 ★). Původní text bývá česky; druhý jazyk je překlad.
export interface Review {
  name: string;
  topic: L<string>;
  text: L<string>;
}

const COSM = { cs: 'Kosmetika', en: 'Cosmetic treatment' };
const NAILS = { cs: 'Manikúra', en: 'Manicure' };
const SALON = { cs: 'Salon', en: 'The salon' };

export const REVIEWS: Review[] = [
  {
    name: 'Hana Hofman',
    topic: COSM,
    text: {
      cs: 'Paní Veronika je člověk na správném místě. Chodím k ní na kosmetiku už více, než rok a nemám jedinou výtku. Veronika je empatická, příjemná a svému oboru rozumí. … Prostředí salonu je TOP, je úplně nový, voňavý, čistý a klidný. DOPORUČUJI VŠEM.',
      en: 'Veronika is the right person in the right place. I have been coming to her for skincare for over a year and have not a single complaint. She is empathetic, pleasant and knows her craft. … The salon is top-notch – brand new, fragrant, clean and calm. I recommend it to everyone.',
    },
  },
  {
    name: 'Tereza Štrosová',
    topic: COSM,
    text: {
      cs: 'Moc doporučuji! Paní Veronika má zlaté ruce, ale hlavně rozumí tomu co dělá. Ošetření navrhne dle typu a stavu pleti a případně i doporučí vhodnou kosmetiku na doma. Byla jsem v sedmém nebi!',
      en: 'Highly recommended! Veronika has golden hands, and above all she knows what she is doing. She proposes the treatment according to your skin type and condition and, if needed, recommends suitable home skincare. I was in seventh heaven!',
    },
  },
  {
    name: 'Martin Mach',
    topic: COSM,
    text: {
      cs: 'K Verče chodím pravidelně a vždy odcházím spokojen, ještě nikdy jsem neměl obličej tak čistý a hydratovaný. Ráda mi vysvětlila, jak mám svou pokožku pečovat, i když jsem v kosmetice velice neznalý. … Prostředí je velice klidné a cením čistotu celého salónu. Člověk krásně zrelaxuje!',
      en: 'I go to Verka regularly and always leave satisfied – my face has never been so clean and hydrated. She gladly explained how to care for my skin even though I know very little about cosmetics. … The place is very calm and I appreciate how clean the whole salon is. You can truly relax!',
    },
  },
  {
    name: 'Oldriska',
    topic: COSM,
    text: {
      cs: 'Skvělé kosmetické ošetření od slečny Veroniky, spousta dobrých rad a ještě i soupis doporučených přípravků a postupu do emailu. Navíc oceňuji, že kosmetika je netestovaná na zvířatech. … Doporučuji!',
      en: 'A great facial from Veronika, lots of good advice and even a list of recommended products and routine sent by e-mail. I also appreciate that the cosmetics are not tested on animals. … Recommended!',
    },
  },
  {
    name: 'Ester Tomkova',
    topic: COSM,
    text: {
      cs: 'Salon Veru mi doporučila známá a jsem za to moc vděčná. … Paní je velmi sympatická, pracovitá, profesionální, ví, co dělá, a neustále se vzdělává, aby držela krok s novinkami. Hned jsem ji doporučila kolegyni – i ta byla nadšená. Už nechodím nikam jinam.',
      en: 'A friend recommended Salon Veru and I am very grateful. … She is very likeable, hard-working, professional, knows what she is doing and keeps learning to keep up with new trends. I immediately recommended her to a colleague, who was delighted too. I do not go anywhere else any more.',
    },
  },
  {
    name: 'Zuzana Mullerova',
    topic: COSM,
    text: {
      cs: 'Dnešní kosmetické ošetření paní Veronikou byl úžasný relax, perfektně se postarala o mou pleť s nedokonalostmi a závěrečná masáž byla TOP. … Velmi jsem si to užila, určitě se vrátím a doporučím známým.',
      en: 'Today’s treatment with Veronika was an amazing relaxation, she took perfect care of my imperfect skin and the final massage was top. … I enjoyed it very much, I will definitely come back and recommend it to friends.',
    },
  },
  {
    name: 'Helen',
    topic: COSM,
    text: {
      cs: 'Byla jsem na ošetření pleti u Veroniky a bylo to naprosto úžasné! Veronika je velmi jemná, pozitivní a profesionální. V salonu je čisto a klidně. Má velký výběr kosmetiky a použila to, co se hodí pro můj typ pleti. Dříve jsem měla hodně bílých hlaviček, ale po ošetření všechny zmizely. Vřele doporučuji toto místo!',
      en: 'I went for the skin care given by Veronika and it was absolutely amazing! Veronika is very gentle, with positive energy and professional. The environment is very clean and relaxing. She has a lot of products and applied what was suitable to my skin type. I had a lot of white heads before but after the process it was all gone. I highly recommend this place!',
    },
  },
  {
    name: 'Pavla Littomericka',
    topic: SALON,
    text: {
      cs: 'Mohu jen doporučit! Člověk odchází odpočatý a krásný :) Profi přístup. Přesně to, co jsem hledala. Příjemné prostředí, skvělá nabídka služeb. Budu se vracet pravidelně.',
      en: 'I can only recommend it! You leave rested and beautiful :) Professional approach. Exactly what I was looking for. Pleasant environment, great range of services. I will keep coming back.',
    },
  },
  {
    name: 'Marija Brumlich',
    topic: NAILS,
    text: {
      cs: 'Nejlepší manikúra v Praze, paní Notika je neuvěřitelně šikovná, pečlivá. Vřele doporučuji.',
      en: 'The best manicure in Prague – Notika is incredibly skilled and meticulous. Highly recommended.',
    },
  },
  {
    name: 'Jean Stelmakh',
    topic: NAILS,
    text: {
      cs: 'Notika je skvělá specialistka! Prostě jednička! Udělala mi ten nejhezčí nude, co jsem kdy měla. Nehty vypadají strašně elegantně a čistě. Moc doporučuji!',
      en: 'Notika is a great specialist – simply number one! She did the most beautiful nude nails I have ever had. My nails look extremely elegant and clean. Highly recommended!',
    },
  },
  {
    name: 'Lenka Svobodová',
    topic: NAILS,
    text: {
      cs: 'Nejlepší manikúra! Manikérka paní Notika.',
      en: 'The best manicure! Manicurist Notika.',
    },
  },
  {
    name: 'Hanna Jarova',
    topic: NAILS,
    text: {
      cs: 'Dokonalé nehty! Pokud chcete manikúru, tak jedině u Notiky!',
      en: 'The best nails! If you want a manicure, then only with a specialist Notika!',
    },
  },
];

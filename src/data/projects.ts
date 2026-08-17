export type Project = {
  slug: string;
  name: string;
  location: string;
  city: string;
  startingPrice: number;
  unitTypes: string[];
  gallery: string[];
  availability: string;
  paymentPlan: { label: string; value: string }[];
  offer: string;
  description: string;
  mapLocation: string;
  brochure: string;
  highlight: string;
  handover: string;
};

export const projects: Project[] = [
  {
    slug: 'la-colina-sheikh-zayed',
    name: 'La Colina',
    location: 'Sheikh Zayed City',
    city: 'Sheikh Zayed',
    startingPrice: 7371000,
    unitTypes: ['1-bed apartment', '2-bed apartment', '3-bed apartment'],
    gallery: [
      'https://images.pexels.com/photos/7031603/pexels-photo-7031603.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/7031608/pexels-photo-7031608.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/7031612/pexels-photo-7031612.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/7031624/pexels-photo-7031624.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: 'Limited units available',
    paymentPlan: [{ label: 'Initial deposit', value: '0%' }, { label: 'Spread over', value: '10 years' }, { label: 'Handover', value: '2026' }],
    offer: 'Zero down payment for a limited time',
    description: 'An ultra-low density luxury compound where only 18% of the land is constructed. Featuring artificial lakes, jogging tracks, and upper-level properties equipped with sky terraces and private Jacuzzis.',
    mapLocation: 'Sheikh Zayed City, Giza Governorate, Egypt',
    brochure: 'la-colina-brochure.pdf',
    highlight: 'Extreme privacy and luxury in the heart of Zayed',
    handover: '2026',
  },
  {
    slug: 'la-colina-east-new-cairo',
    name: 'La Colina East',
    location: 'View Zone, Beit Al-Watan • New Cairo',
    city: 'New Cairo',
    startingPrice: 3500000,
    unitTypes: ['Studio', '1-bed apartment', '3-bed apartment', 'Townhouse', 'Duplex'],
    gallery: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1022936/pexels-photo-1022936.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: 'Phase 1 selling now',
    paymentPlan: [{ label: 'Initial deposit', value: '10%' }, { label: 'Spread over', value: '15 years' }, { label: 'Handover', value: '2027' }],
    offer: 'Up to 15 years installment plan',
    description: 'Replicating the successful Zayed model in the east. Engineered for massive demographic capture, catering to young professionals, newly formed families, and large multi-generational households with seamless access to New Cairo’s vital centers.',
    mapLocation: 'New Cairo, Cairo Governorate, Egypt',
    brochure: 'la-colina-east-brochure.pdf',
    highlight: 'Accessible premium living in Eastern Cairo',
    handover: '2027',
  },
  {
    slug: 'win-plaza-hadayek-october',
    name: 'Win Plaza',
    location: 'Tourist Walkway • Hadayek October',
    city: '6th of October',
    startingPrice: 3600000,
    unitTypes: ['Commercial', 'Administrative', 'Medical'],
    gallery: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: 'Final finishing phase',
    paymentPlan: [{ label: 'Initial deposit', value: '15%' }, { label: 'Spread over', value: '7 years' }, { label: 'Handover', value: 'H1 2026' }],
    offer: 'Prime location facing high-speed rail',
    description: 'A 17,700 sqm commercial mega-complex featuring a food court, cinema complex, and a sky gym. Positioned strategically to capture massive transit demographics.',
    mapLocation: 'Hadayek October, Giza Governorate, Egypt',
    brochure: 'win-plaza-brochure.pdf',
    highlight: 'Commercial yield engine on the Tourist Walkway',
    handover: 'H1 2026',
  },
  {
    slug: 'park-yard-1',
    name: 'Park Yard 1',
    location: 'Al-Hossary Square • 6th of October',
    city: '6th of October',
    startingPrice: 2800000,
    unitTypes: ['Commercial', 'Administrative', 'Medical'],
    gallery: [
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: 'Handover commenced',
    paymentPlan: [{ label: 'Initial deposit', value: '20%' }, { label: 'Spread over', value: '5 years' }, { label: 'Handover', value: 'Ready to Move' }],
    offer: 'Immediate handover available',
    description: 'Placed near major universities and Al-Safwa Hospital, guaranteeing massive student and medical footfall. Shops are delivered core-and-shell; clinics fully finished with AC.',
    mapLocation: '6th of October City, Giza Governorate, Egypt',
    brochure: 'park-yard-1-brochure.pdf',
    highlight: 'High-density commercial hub in Al-Hossary',
    handover: 'Ready to Move',
  },
  {
    slug: 'point-9-mall',
    name: 'Point 9 Mall',
    location: 'Downtown District • New Administrative Capital',
    city: 'New Administrative Capital',
    startingPrice: 1850000,
    unitTypes: ['Commercial', 'Administrative', 'Medical'],
    gallery: [
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: 'Construction advanced',
    paymentPlan: [{ label: 'Initial deposit', value: '0%' }, { label: 'Spread over', value: '15 years' }, { label: 'Handover', value: '2025' }],
    offer: '0% down over 15 years',
    description: 'Capital Hills’ entry point into the NAC institutional ecosystem. A modern structure comprising 8 upper floors, with administrative and medical units delivered fully finished.',
    mapLocation: 'New Administrative Capital, Cairo Governorate, Egypt',
    brochure: 'point-9-mall-brochure.pdf',
    highlight: 'Zero down payment in the Downtown District',
    handover: '2025',
  },
  {
    slug: 'park-point-mall',
    name: 'Park Point Mall',
    location: 'MU5/14 District • New Administrative Capital',
    city: 'New Administrative Capital',
    startingPrice: 1620000,
    unitTypes: ['Commercial', 'Administrative', 'Serviced Residential'],
    gallery: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: 'Selling fast',
    paymentPlan: [{ label: 'Initial deposit', value: '0%' }, { label: 'Spread over', value: '15 years' }, { label: 'Handover', value: 'End of 2026' }],
    offer: 'Highly accessible entry prices',
    description: 'An expansive G+14 structural design that aggressively targets micro-investors with unit sizes starting as small as 10 sqm. Perfect for securing prime, inflation-hedging assets.',
    mapLocation: 'New Administrative Capital, Cairo Governorate, Egypt',
    brochure: 'park-point-mall-brochure.pdf',
    highlight: 'Accessible commercial real estate ownership',
    handover: 'End of 2026',
  }
];

export const formatPrice = (value: number) =>
  `EGP ${new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 }).format(value)}`;

export const getProject = (slug?: string) => projects.find((project) => project.slug === slug);
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
    slug: 'capital-hills-new-cairo',
    name: 'Capital Hills New Cairo',
    location: 'Mostakbal City • East Cairo',
    city: 'Cairo',
    startingPrice: 2850000,
    unitTypes: ['2-bed apartment', '3-bed apartment', '4-bed duplex'],
    gallery: [
      'https://images.pexels.com/photos/7031603/pexels-photo-7031603.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/7031608/pexels-photo-7031608.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/7031612/pexels-photo-7031612.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/7031624/pexels-photo-7031624.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: '8 homes remaining',
    paymentPlan: [{ label: 'Initial deposit', value: '20%' }, { label: 'Spread over', value: '8 years' }, { label: 'Handover', value: 'Q4 2027' }],
    offer: 'Clubhouse membership included for your first year',
    description: 'A practical gated community for families who want more room to breathe, with schools, shops and the New Capital road within easy reach.',
    mapLocation: 'Mostakbal City, New Cairo, Cairo Governorate, Egypt',
    brochure: 'capital-hills-new-cairo-brochure.pdf',
    highlight: 'Room to grow, close to the New Capital',
    handover: 'Q4 2027',
  },
  {
    slug: 'hillside-october',
    name: 'Hillside October',
    location: 'Garden City • 6th of October',
    city: 'Giza',
    startingPrice: 3100000,
    unitTypes: ['2-bed apartment', '3-bed townhouse', '4-bed townhouse'],
    gallery: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1022936/pexels-photo-1022936.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: '14 homes remaining',
    paymentPlan: [{ label: 'Initial deposit', value: '10%' }, { label: 'Spread over', value: '7 years' }, { label: 'Handover', value: 'Q2 2027' }],
    offer: 'Free fitted kitchen on selected 3-bed homes',
    description: 'Sunlit homes with useful layouts, a central green and quick access to schools, work and the October–Zayed road.',
    mapLocation: '6th of October City, Giza Governorate, Egypt',
    brochure: 'hillside-october-brochure.pdf',
    highlight: 'The everyday, made easier',
    handover: 'Q2 2027',
  },
  {
    slug: 'marina-court-ain-sokhna',
    name: 'Marina Court Ain Sokhna',
    location: 'Al Ain Al Sokhna • Red Sea coast',
    city: 'Ain Sokhna',
    startingPrice: 4750000,
    unitTypes: ['1-bed chalet', '2-bed chalet', '3-bed chalet'],
    gallery: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    availability: '5 homes remaining',
    paymentPlan: [{ label: 'Initial deposit', value: '15%' }, { label: 'Spread over', value: '6 years' }, { label: 'Handover', value: 'Q3 2026' }],
    offer: 'Summer furnishing package on selected chalets',
    description: 'A low-rise seaside community for weekends and long stays, with a swimmable beach, shaded walks and the Red Sea close to your door.',
    mapLocation: 'Ain Sokhna, Suez Governorate, Egypt',
    brochure: 'marina-court-ain-sokhna-brochure.pdf',
    highlight: 'A calmer side of the Red Sea',
    handover: 'Q3 2026',
  },
];

export const formatPrice = (value: number) =>
  `EGP ${new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 }).format(value)}`;

export const getProject = (slug?: string) => projects.find((project) => project.slug === slug);
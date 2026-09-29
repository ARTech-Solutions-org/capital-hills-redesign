import { useMemo, useRef, useState, useEffect } from 'react';
import {
  ArrowRight, CalendarDays, ChevronLeft, ChevronRight,
  MessageCircle, Phone, MapPin, Sparkles, X
} from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useContactInfo, ProjectCard, Shell, downloadBrochure } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem, CountUp } from '@/components/animations';

const reviews = [
  { quote: 'The team answered every question without making us feel rushed. We visited on Saturday and knew exactly what our next step was.', name: 'Mona & Karim', detail: 'Homeowners, Capital Hills New Cairo' },
  { quote: 'I was buying for my parents, so clarity mattered. The payment schedule and walkthrough made the decision straightforward.', name: 'Hany M.', detail: 'Buyer, Hillside October' },
  { quote: 'What stood out was the follow-through. Someone picked up every time I called and explained the small details.', name: 'Nour A.', detail: 'Homeowner, Marina Court Ain Sokhna' },
];

const heroImages = [
  'https://images.pexels.com/photos/7031603/pexels-photo-7031603.jpeg?auto=compress&cs=tinysrgb&w=1000',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=700',
];

// removed tickerItems from here

export default function Home() {
  const contactInfo = useContactInfo();
  const { content, projects } = useData();
  const tickerItems = projects.flatMap((p) => [`${p.name} â€” ${p.city}`, 'Â·']);
  const [review, setReview] = useState(0);
  const activeReviews = useMemo(() => {
    try {
      if (content['home_reviews_list']) {
        let parsed = JSON.parse(content['home_reviews_list']);
        return parsed.filter((r: any) => !r.hide);
      }
      return reviews;
    } catch(e) {
      return reviews;
    }
  }, [content['home_reviews_list']]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<{src: string, alt: string, desc: string} | null>(null);

  // Auto-rotate reviews
  useEffect(() => {
    if (!autoPlay || activeReviews.length === 0) return;
    const t = setInterval(() => setReview((r) => (r + 1) % activeReviews.length), 5000);
    return () => clearInterval(t);
  }, [autoPlay]);

  return (
    <Shell>
      <main>
        {/* â”€â”€ HERO: Dark Immersive â”€â”€ */}
        <section className="relative min-h-[100dvh] overflow-hidden bg-[#250f12] text-[#f5f2e9] flex flex-col justify-center px-6 py-28 md:py-32 md:pl-[max(40px,calc((100vw-1220px)/2+40px))]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={(content.hasOwnProperty('home_hero_bg') ? content['home_hero_bg'] : "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=2000")}
              alt="Capital Hills Building"
              className="h-full w-full object-cover opacity-60 mix-blend-luminosity"
            />
            {/* Dark Maroon overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#250f12]/95 via-[#421319]/80 to-[#250f12]/40" />
            
            {/* Watermark Logo (Emblem without wordmark) */}
            <div className="absolute right-[-10%] top-[20%] w-[800px] opacity-[0.035] pointer-events-none">
              <img src="/capital-hills-icon-light.png" alt="" className="w-full h-auto" />
            </div>
            {/* Thin circle lines */}
            <div className="absolute right-[10%] top-[-10%] w-[600px] h-[600px] rounded-full border border-[#f5f2e9]/5 pointer-events-none" />
            <div className="absolute left-[5%] bottom-[-20%] w-[400px] h-[400px] rounded-full border border-[#f5f2e9]/5 pointer-events-none" />
          </div>

          <div className="relative z-10 w-full max-w-2xl">
            <FadeIn>
              <p className="font-mono text-[9px] uppercase tracking-[.25em] text-[#947e82] mb-6">
                Homes worth coming home to
              </p>
              <h1 className="text-[clamp(3.2rem,8.5vw,6.5rem)] leading-[1.05] text-[#f5f2e9]">
                {/* Line 1: Invest With — Poppins bold */}
                {(content.hasOwnProperty('hero_title') ? content['hero_title'] : 'Invest With') && (
                  <span
                    className="block font-bold tracking-[-0.03em]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {content.hasOwnProperty('hero_title') ? content['hero_title'] : 'Invest With'}
                  </span>
                )}
                {/* Line 2: Trust — Poppins bold */}
                {(content.hasOwnProperty('hero_title_2') ? content['hero_title_2'] : 'Trust') && (
                  <span
                    className="block font-bold tracking-[-0.03em]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {content.hasOwnProperty('hero_title_2') ? content['hero_title_2'] : 'Trust'}
                  </span>
                )}
                {/* Line 3: Grow With — Luxury Serif, Italic, Transparent */}
                {((content.hasOwnProperty('hero_title_3') ? content['hero_title_3'] : 'Grow') ||
                  (content.hasOwnProperty('hero_title_4') ? content['hero_title_4'] : 'With')) && (
                  <span
                    className="block tracking-[0.01em]"
                    style={{
                      opacity: 0.55,
                      color: '#f5f2e9',
                      fontFamily: "'Times New Roman Custom', 'Times New Roman', serif",
                      fontStyle: 'italic',
                      fontWeight: 400,
                    }}
                  >
                    {content.hasOwnProperty('hero_title_3') ? content['hero_title_3'] : 'Grow'}
                    {((content.hasOwnProperty('hero_title_3') ? content['hero_title_3'] : 'Grow') &&
                      (content.hasOwnProperty('hero_title_4') ? content['hero_title_4'] : 'With')) ? ' ' : ''}
                    {content.hasOwnProperty('hero_title_4') ? content['hero_title_4'] : 'With'}
                  </span>
                )}
                {/* Line 4: Community — Poppins bold */}
                {(content.hasOwnProperty('hero_title_5') ? content['hero_title_5'] : 'Community') && (
                  <span
                    className="block font-bold tracking-[-0.03em]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {content.hasOwnProperty('hero_title_5') ? content['hero_title_5'] : 'Community'}
                  </span>
                )}
              </h1>
              {(content.hasOwnProperty('hero_subtitle') ? content['hero_subtitle'] : 'Thoughtfully planned communities. A better tomorrow.') && (
                <p className="mt-8 max-w-md text-base leading-7 text-[#f5f2e9]/70 font-sans">
                  {content.hasOwnProperty('hero_subtitle') ? content['hero_subtitle'] : 'Thoughtfully planned communities. A better tomorrow.'}
                </p>
              )}


            </FadeIn>
          </div>
          
          {/* Bottom left corner text */}
          <div className="absolute bottom-8 left-6 md:left-[max(40px,calc((100vw-1220px)/2+40px))] z-10">
            <p className="font-mono text-[8px] uppercase tracking-[.25em] text-[#947e82]/80 leading-relaxed">
              Planning<br/>The Future
            </p>
          </div>
          
          {/* Bottom right corner text */}
          <div className="absolute bottom-8 right-6 md:right-[max(40px,calc((100vw-1220px)/2+40px))] z-10 text-right">
            <p className="font-mono text-[8px] uppercase tracking-[.25em] text-[#947e82]/80 leading-relaxed">
              Cairo - Egypt<br/>Since 2017
            </p>
          </div>
        </section>

        {/* â”€â”€ STATS BAND â”€â”€ */}
        <section className="bg-[#421319] py-16">
          <div className="container-shell">
            <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: parseInt(content['stat_1_val']) || 18, suffix: (content.hasOwnProperty('stat_1_suf') ? content['stat_1_suf'] : ''), label: (content.hasOwnProperty('stat_1_lbl') ? content['stat_1_lbl'] : 'Key projects delivered') },
                { value: parseInt(content['stat_2_val'] as any) || 4, suffix: (content.hasOwnProperty('stat_2_suf') ? content['stat_2_suf'] : ''), label: (content.hasOwnProperty('stat_2_lbl') ? content['stat_2_lbl'] : 'Prime Egyptian cities') },
                { value: parseInt(content['stat_3_val'] as any) || 2017, suffix: (content.hasOwnProperty('stat_3_suf') ? content['stat_3_suf'] : ''), label: (content.hasOwnProperty('stat_3_lbl') ? content['stat_3_lbl'] : 'Year established') },
                { value: parseInt(content['stat_4_val'] as any) || 15, suffix: (content.hasOwnProperty('stat_4_suf') ? content['stat_4_suf'] : ' yrs'), label: (content.hasOwnProperty('stat_4_lbl') ? content['stat_4_lbl'] : 'Max instalment plan') },
              ].map(({ value, suffix, label }) => (
                <StaggerItem key={label} className="border-l border-[#f5f2e9]/15 pl-6 first:border-0 first:pl-0 md:first:border-l md:first:pl-6">
                  <CountUp target={value} suffix={suffix} className="font-display text-4xl text-[#f5f2e9] md:text-5xl" />
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[.18em] text-[#947e82]">{label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* â”€â”€ TICKER + About us â”€â”€ */}
        <section className="bg-[#947e82] py-20 md:py-28 overflow-hidden">
          <div className="container-shell mb-12">
            <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-center">
              <FadeIn>
                <p className="eyebrow">{(content.hasOwnProperty('home_why_eyebrow') ? content['home_why_eyebrow'] : 'Why Capital Hills')}</p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-[#421319] md:text-5xl">
                  {(content.hasOwnProperty('home_why_title_1') ? content['home_why_title_1'] : 'Invest With')}<br /><span className="italic">{(content.hasOwnProperty('home_why_title_2') ? content['home_why_title_2'] : 'Trust.')}</span>
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#493337]">
                  {(content.hasOwnProperty('home_why_desc') ? content['home_why_desc'] : 'We believe real estate is more than a property. It is a decision about your future, your family, your business, and your investment.')}
                </p>
                <Link href="/about-us" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#421319]" data-testid="link-home-why-us">
                  Learn more about us <ArrowRight size={15} />
                </Link>
              </FadeIn>
              {/* Values as horizontal numbered list */}
              <StaggerContainer className="space-y-0 divide-y divide-[#947e82]">
                {(() => {
                  let items = [];
                  try { items = content['home_why_list'] ? JSON.parse(content['home_why_list']) : []; } catch(e){}
                  if (items.length === 0) items = [
                    { n: '01', title: 'Trusted Relationships', copy: 'Creating spaces where people can live, work, grow, and connect.' },
                    { n: '02', title: '18 Key Projects', copy: 'Serving residential, commercial & mixed-use across Egypt.' },
                    { n: '03', title: 'Established Partners', copy: 'Working with brands across industries to deliver lasting value.' },
                    { n: '04', title: 'People at the Heart', copy: 'A collaborative team committed to making a meaningful impact.' }
                  ];
                  return items;
                })().map(({ n, title, copy }: { n: string; title: string; copy: string }, index: number) => (
                  <StaggerItem key={n || index} className="flex items-start gap-5 py-5">
                    <span className="shrink-0 font-mono text-[10px] tracking-[.2em] text-[#421319]/50 pt-1">{n || String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-display text-xl text-[#421319]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#421319]/70">{copy}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
          {/* Ticker marquee */}
          <div className="relative overflow-hidden border-y border-[#947e82] py-4">
            <div className="ticker-track">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className={`shrink-0 px-5 font-mono text-[10px] uppercase tracking-[.2em] ${item === 'Â·' ? 'text-[#947e82]' : 'text-[#947e82]'}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* â”€â”€ TESTIMONIALS: Full-width centered â”€â”€ */}
        {activeReviews.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f5f2e9]">
          <div className="container-shell max-w-3xl text-center">
            <FadeIn>
              {/* Large decorative quote */}
              <p className="font-display text-[120px] leading-none text-[#947e82]/25 select-none">"</p>
              <blockquote
                className="font-display text-2xl leading-snug text-[#421319] md:text-3xl -mt-8"
              >
                {activeReviews[review]?.quote}
              </blockquote>
              <div className="mt-8">
                <p className="text-sm font-bold text-[#421319]">{activeReviews[review]?.name}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[.18em] text-[#947e82]">{activeReviews[review]?.detail}</p>
              </div>
              {/* Dots */}
              <div className="mt-8 flex items-center justify-center gap-2">
                {activeReviews.map((_: unknown, i: number) => (
                  <button
                    key={i}
                    onClick={() => { setReview(i); setAutoPlay(false); }}
                    aria-label={`Review ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === review ? 'w-6 bg-[#947e82]' : 'w-2 bg-[#947e82]'}`}
                    data-testid={`button-review-dot-${i}`}
                  />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
        )}

        {/* â”€â”€ PARTNERSHIPS & PARTNERS â”€â”€ */}
        <section className="bg-[#421319] py-20 text-[#f5f2e9] md:py-32 overflow-hidden relative">
          <div className="absolute inset-0 z-0">
             <div className="absolute right-[-10%] top-[0%] w-[500px] h-[500px] rounded-full border border-[#f5f2e9]/5 pointer-events-none" />
             <div className="absolute left-[5%] bottom-[-20%] w-[300px] h-[300px] rounded-full border border-[#f5f2e9]/5 pointer-events-none" />
          </div>
          <div className="container-shell relative z-10">
            <FadeIn>
              <h2 className="font-display text-4xl leading-tight md:text-5xl text-center mb-6">
                Our Success<br /><span className="italic text-[#947e82]">Partners.</span>
              </h2>
              <p className="text-center text-sm text-[#f5f2e9]/50 mb-16 font-mono tracking-widest uppercase text-[10px]">Trusted by leading names across Egypt</p>
            </FadeIn>

            {/* Logo wall */}
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 md:grid-cols-6 lg:grid-cols-8">
                {(() => { let partnersList = []; try { partnersList = content['home_partners_list'] ? JSON.parse(content['home_partners_list']) : []; } catch (e) { partnersList = []; } return partnersList; })().map((partner: any) => (
                  <button
                    key={partner.alt}
                    onClick={() => setSelectedPartner(partner)}
                    className="flex items-center justify-center rounded-xl bg-[#f5f2e9]/5 border border-[#f5f2e9]/8 p-3 aspect-[3/2] hover:bg-[#f5f2e9]/10 transition cursor-pointer group"
                    aria-label={`View details for ${partner.alt}`}
                  >
                    <img
                      src={partner.src}
                      alt={partner.alt}
                      className="max-h-16 max-w-full w-auto object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition duration-300 transform group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* â”€â”€ CTA SPLIT â”€â”€ */}
        <section className="md:grid md:grid-cols-2 md:min-h-[480px]">
          {/* Left: image */}
          <div className="relative min-h-[260px] overflow-hidden">
            <img
              src={(content.hasOwnProperty('home_cta_bg') ? content['home_cta_bg'] : "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1000")}
              alt="Capital Hills home"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#421319]/30" />
          </div>
          {/* Right: CTA */}
          <div className="flex flex-col justify-center bg-[#947e82] px-8 py-16 md:px-16">
            <FadeIn>
              <p className="eyebrow">{(content.hasOwnProperty('home_cta_eyebrow') ? content['home_cta_eyebrow'] : 'One good conversation')}</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[#421319] md:text-5xl">
                {(content.hasOwnProperty('home_cta_title') ? content['home_cta_title'] : "Let's find the place that makes sense for you.")}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-[#493337]">
                {(content.hasOwnProperty('home_cta_desc') ? content['home_cta_desc'] : 'Tell us your city, your range, and what you need. We will come back with useful options, not a sales pitch.')}
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#421319] px-6 py-3.5 text-sm font-bold text-[#f5f2e9] transition hover:bg-[#421319]"
                data-testid="link-contact-cta"
              >
                Start a conversation <ArrowRight size={15} />
              </Link>
            </FadeIn>
          </div>
        </section>
      {/* â”€â”€ CHAIRMAN'S MESSAGE â”€â”€ */}
        <section className="relative bg-[#231f20] overflow-hidden">

          {/* â”€â”€ Decorative geometry layer â”€â”€ */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
            {/* Massive faint ring top-right */}
            <div className="absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full border border-[#947e82]/10" />
            <div className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full border border-[#947e82]/8" />
            {/* Accent line bottom-left */}
            <div className="absolute bottom-0 left-0 w-[2px] h-[60%] bg-gradient-to-t from-[#947e82]/40 to-transparent" />
            {/* Horizontal rule mid */}
            <div className="absolute top-[48%] left-0 right-0 h-[1px] bg-[#947e82]/[0.07]" />
          </div>

          <div className="container-shell relative z-10 py-24 md:py-36">
            {/* â”€â”€ Top eyebrow â”€â”€ */}
            <FadeIn>
              <div className="flex items-center gap-6 mb-16">
                <div className="w-10 h-[2px] bg-[#947e82]" />
                <p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#947e82]">Chairman's Message</p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-12 gap-12 md:gap-0 items-start">

              {/* â”€â”€ LEFT: Photo column â”€â”€ */}
              <FadeIn delay={0.1} className="md:col-span-5 md:sticky md:top-28 self-start">
                <div className="relative">
                  {/* Accent border frame â€” offset behind photo */}
                  <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#947e82]/30 rounded-xl" />
                  {/* Photo */}
                  <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                    <img
                      src={(content.hasOwnProperty('home_chairman_img') ? content['home_chairman_img'] : "/chairman.png")}
                      alt="Eng. Mohamed Salah Abdel Qader â€” Chairman"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    {/* Subtle brand tint at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#421319]/60 to-transparent" />
                    {/* Name badge pinned bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-6">
                      <p className="font-display text-2xl text-[#f5f2e9] leading-tight">{(content.hasOwnProperty('chairman_name_1') ? content['chairman_name_1'] : 'Eng. Mohamed Salah')}<br />{(content.hasOwnProperty('chairman_name_2') ? content['chairman_name_2'] : 'Abdel Qader')}</p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[.2em] text-[#947e82]">{(content.hasOwnProperty('chairman_title') ? content['chairman_title'] : 'Chairman â€” Capital Hills Developments')}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* â”€â”€ RIGHT: Quote + body â”€â”€ */}
              <div className="md:col-span-7 md:pl-16 flex flex-col gap-10">
                {/* Pull-quote â€” the most visually impactful element */}
                <FadeIn delay={0.2}>
                  <div className="relative">
                    <span aria-hidden="true" className="absolute -top-6 -left-2 font-display text-[120px] leading-none text-[#947e82]/20 select-none">"</span>
                    <p className="relative font-display text-3xl md:text-4xl leading-[1.2] text-[#f5f2e9] tracking-tight pt-4">
                      {(content.hasOwnProperty('chairman_quote') ? content['chairman_quote'] : 'Trust is more than a promise. It is the foundation of everything we build.')}
                    </p>
                  </div>
                </FadeIn>

                {/* Divider */}
                <FadeIn delay={0.25}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[2px] bg-[#947e82]" />
                    <div className="flex-1 h-[1px] bg-[#947e82]/20" />
                  </div>
                </FadeIn>

                {/* Body paragraphs */}
                <FadeIn delay={0.3}>
                  <div className="space-y-5 text-[15px] leading-8 text-[#f5f2e9]/65 font-sans">
                    <p>{(content.hasOwnProperty('chairman_p1') ? content['chairman_p1'] : 'At Capital Hills Developments, we believe real estate development is about more than building. It is about shaping communities, creating lasting value, and building trust that stands the test of time.')}</p>
                    <p>{(content.hasOwnProperty('chairman_p2') ? content['chairman_p2'] : "For the past 10 years, we have been building our presence in the real estate sector, guided by a commitment to developing destinations that meet our customers' evolving needs â€” combining thoughtful planning, quality, and strategic locations with a long-term perspective.")}</p>
                    <p>{(content.hasOwnProperty('chairman_p3') ? content['chairman_p3'] : 'We recognize that every project represents an important decision for our customers â€” whether they are choosing a home, growing a business, or making an investment. This responsibility guides our approach and reinforces our commitment to delivering value at every stage of the journey.')}</p>
                    <p>{(content.hasOwnProperty('chairman_p4') ? content['chairman_p4'] : 'As we continue to grow, we remain focused on building strong relationships with our customers, partners, and communities, while fostering an environment where our people can grow, contribute, and succeed.')}</p>
                  </div>
                </FadeIn>

                {/* Stats strip */}
                <FadeIn delay={0.35}>
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#947e82]/20">
                    {(() => {
                      let items = [];
                      try { items = content['chairman_stats_list'] ? JSON.parse(content['chairman_stats_list']) : []; } catch(e){}
                      if (items.length === 0) items = [
                        { num: '10+', label: 'Years of trust' },
                        { num: '11', label: 'Landmark projects' },
                        { num: '100B+', label: 'EGP investments' }
                      ];
                      return items;
                    })().map(({ num, label }: { num: string; label: string }) => (
                      <div key={label}>
                        <p className="font-display text-3xl text-[#947e82]">{num}</p>
                        <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[#f5f2e9]/40">{label}</p>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>

        
      </main>

      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartner(null)}
              className="absolute inset-0 bg-[#250f12]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#421319] shadow-2xl"
            >
              {/* Decorative accent */}
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#250f12]/40 to-transparent pointer-events-none" />
              
              <div className="relative p-6 md:p-12">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="absolute right-4 top-4 md:right-6 md:top-6 rounded-full p-2 text-[#f5f2e9]/50 transition hover:bg-[#250f12]/50 hover:text-[#f5f2e9]"
                >
                  <X size={20} />
                </button>
                
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#947e82] mb-8 md:mb-10">
                  Partnership Profile
                </p>
                
                <div className="grid gap-8 md:gap-10 md:grid-cols-[1.2fr_2fr] md:items-center">
                  {/* Left: Huge Logo */}
                  <div className="flex h-20 md:h-40 items-center justify-start border-b border-[#f5f2e9]/10 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                    <img
                      src={selectedPartner.src}
                      alt={selectedPartner.alt}
                      className="max-h-full max-w-full object-contain filter brightness-0 invert"
                    />
                  </div>
                  
                  {/* Right: Content */}
                  <div>
                    <h3 className="mb-3 md:mb-4 font-display text-2xl md:text-4xl text-[#f5f2e9]">{selectedPartner.alt}</h3>
                    <p className="text-xs md:text-base leading-relaxed text-[#f5f2e9]/70">{selectedPartner.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
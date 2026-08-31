import { useMemo, useRef, useState, useEffect } from 'react';
import {
  ArrowRight, CalendarDays, ChevronLeft, ChevronRight,
  MessageCircle, Phone, MapPin, Sparkles
} from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { projects, formatPrice } from '@/data/projects';
import { CONTACT, ProjectCard, Shell, downloadBrochure } from '@/components/site';
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

const tickerItems = projects.flatMap((p) => [`${p.name} — ${p.city}`, '·']);

export default function Home() {
  const [review, setReview] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-rotate reviews
  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => setReview((r) => (r + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [autoPlay]);

  return (
    <Shell>
      <main>
        {/* ── HERO: Dark Immersive ── */}
        <section className="relative min-h-[100dvh] overflow-hidden bg-[#240d10] text-[#f7f5ec] flex flex-col justify-center px-6 py-28 md:py-32 md:pl-[max(40px,calc((100vw-1220px)/2+40px))]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=2000"
              alt="Capital Hills Building"
              className="h-full w-full object-cover opacity-60 mix-blend-luminosity"
            />
            {/* Dark Maroon overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#240d10]/95 via-[#421318]/80 to-[#240d10]/40" />
            
            {/* Watermark Logo */}
            <div className="absolute right-[-10%] top-[20%] w-[800px] opacity-[0.03] pointer-events-none">
              <img src="/capital-hills-logo.png" alt="" className="w-full h-auto brightness-0 invert" />
            </div>
            {/* Thin circle lines */}
            <div className="absolute right-[10%] top-[-10%] w-[600px] h-[600px] rounded-full border border-[#f7f5ec]/5 pointer-events-none" />
            <div className="absolute left-[5%] bottom-[-20%] w-[400px] h-[400px] rounded-full border border-[#f7f5ec]/5 pointer-events-none" />
          </div>

          <div className="relative z-10 w-full max-w-2xl">
            <FadeIn>
              <p className="font-mono text-[9px] uppercase tracking-[.25em] text-[#c49743] mb-6">
                Homes worth coming home to
              </p>
              <h1 className="font-display text-[clamp(4rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] text-[#f7f5ec]">
                A clearer path<br />
                to <span className="italic text-[#c49743]">your place.</span>
              </h1>
              <p className="mt-8 max-w-md text-base leading-7 text-[#e2cbbd]">
                Thoughtfully planned communities. A better tomorrow.
              </p>


            </FadeIn>
          </div>
          
          {/* Bottom left corner text */}
          <div className="absolute bottom-8 left-6 md:left-[max(40px,calc((100vw-1220px)/2+40px))] z-10">
            <p className="font-mono text-[8px] uppercase tracking-[.25em] text-[#c49743]/80 leading-relaxed">
              Planning<br/>The Future
            </p>
          </div>
          
          {/* Bottom right corner text */}
          <div className="absolute bottom-8 right-6 md:right-[max(40px,calc((100vw-1220px)/2+40px))] z-10 text-right">
            <p className="font-mono text-[8px] uppercase tracking-[.25em] text-[#c49743]/80 leading-relaxed">
              Cairo - Egypt<br/>Since 2017
            </p>
          </div>
        </section>

        {/* ── STATS BAND ── */}
        <section className="bg-[#4a1e2c] py-16">
          <div className="container-shell">
            <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: 18, suffix: '', label: 'Key projects delivered' },
                { value: 4, suffix: '', label: 'Prime Egyptian cities' },
                { value: 2017, suffix: '', label: 'Year established' },
                { value: 15, suffix: ' yrs', label: 'Max instalment plan' },
              ].map(({ value, suffix, label }) => (
                <StaggerItem key={label} className="border-l border-[#f6f0e4]/15 pl-6 first:border-0 first:pl-0 md:first:border-l md:first:pl-6">
                  <CountUp target={value} suffix={suffix} className="font-display text-4xl text-[#d9ad51] md:text-5xl" />
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[.18em] text-[#c4a98a]">{label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── TICKER + WHY US ── */}
        <section className="bg-[#eadbc4] py-20 md:py-28 overflow-hidden">
          <div className="container-shell mb-12">
            <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-center">
              <FadeIn>
                <p className="eyebrow">Why Capital Hills</p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-[#4a1e2c] md:text-5xl">
                  Invest With<br /><span className="italic">Trust.</span>
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#735e57]">
                  We believe real estate is more than a property. It is a decision about your future, your family, your business, and your investment.
                </p>
                <Link href="/why-us" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#9b702c]" data-testid="link-home-why-us">
                  Learn more about us <ArrowRight size={15} />
                </Link>
              </FadeIn>
              {/* Values as horizontal numbered list */}
              <StaggerContainer className="space-y-0 divide-y divide-[#cdb590]">
                {[
                  { n: '01', title: 'Trusted Relationships', copy: 'Creating spaces where people can live, work, grow, and connect.' },
                  { n: '02', title: '18 Key Projects', copy: 'Serving residential, commercial & mixed-use across Egypt.' },
                  { n: '03', title: 'Established Partners', copy: 'Working with brands across industries to deliver lasting value.' },
                  { n: '04', title: 'People at the Heart', copy: 'A collaborative team committed to making a meaningful impact.' },
                ].map(({ n, title, copy }) => (
                  <StaggerItem key={n} className="flex items-start gap-5 py-5">
                    <span className="shrink-0 font-mono text-[10px] tracking-[.2em] text-[#c49743] pt-1">{n}</span>
                    <div>
                      <h3 className="font-display text-xl text-[#4a1e2c]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#735e57]">{copy}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
          {/* Ticker marquee */}
          <div className="relative overflow-hidden border-y border-[#cdb590] py-4">
            <div className="ticker-track">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className={`shrink-0 px-5 font-mono text-[10px] uppercase tracking-[.2em] ${item === '·' ? 'text-[#c49743]' : 'text-[#9b702c]'}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS: Full-width centered ── */}
        <section className="py-20 md:py-28 bg-[#f6f0e4]">
          <div className="container-shell max-w-3xl text-center">
            <FadeIn>
              {/* Large decorative quote */}
              <p className="font-display text-[120px] leading-none text-[#c49743]/25 select-none">"</p>
              <blockquote
                className="font-display text-2xl leading-snug text-[#4a1e2c] md:text-3xl -mt-8"
              >
                {reviews[review].quote}
              </blockquote>
              <div className="mt-8">
                <p className="text-sm font-bold text-[#4a1e2c]">{reviews[review].name}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[.18em] text-[#9b702c]">{reviews[review].detail}</p>
              </div>
              {/* Dots */}
              <div className="mt-8 flex items-center justify-center gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setReview(i); setAutoPlay(false); }}
                    aria-label={`Review ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === review ? 'w-6 bg-[#c49743]' : 'w-2 bg-[#cdb590]'}`}
                    data-testid={`button-review-dot-${i}`}
                  />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── OFFERS ── */}
        <section className="bg-[#4a1e2c] py-20 text-[#fff7e9] md:py-24">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <FadeIn>
                <p className="eyebrow">For a limited time</p>
                <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                  A little more room<br /><span className="italic text-[#d9ad51]">to make your move.</span>
                </h2>
              </FadeIn>
              <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-[#d9ad51]" data-testid="link-offers-contact">
                Ask about an offer <ArrowRight size={15} />
              </Link>
            </div>
            <StaggerContainer className="mt-10 grid gap-px bg-[#f6f0e4]/10 md:grid-cols-3">
              {projects.map((project, index) => (
                <StaggerItem key={project.slug} className="bg-[#4a1e2c] p-6 md:p-8">
                  <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#c9a36a]">{project.name}</p>
                  <p className="mt-1 text-xs text-[#dbbfaa]">{project.city}</p>
                  <h3 className="mt-10 font-display text-2xl leading-tight">{project.offer}</h3>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#d9ad51]"
                    data-testid={`link-offer-${index}`}
                  >
                    View project <ArrowRight size={13} />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── CTA SPLIT ── */}
        <section className="md:grid md:grid-cols-2 md:min-h-[480px]">
          {/* Left: image */}
          <div className="relative min-h-[260px] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Capital Hills home"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#4a1e2c]/30" />
          </div>
          {/* Right: CTA */}
          <div className="flex flex-col justify-center bg-[#eadbc4] px-8 py-16 md:px-16">
            <FadeIn>
              <p className="eyebrow">One good conversation</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[#4a1e2c] md:text-5xl">
                Let's find the place that makes sense for you.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-[#735e57]">
                Tell us your city, your range, and what you need. We will come back with useful options, not a sales pitch.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4a1e2c] px-6 py-3.5 text-sm font-bold text-[#f6f0e4] transition hover:bg-[#3c1d2a]"
                data-testid="link-contact-cta"
              >
                Start a conversation <ArrowRight size={15} />
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>
    </Shell>
  );
}
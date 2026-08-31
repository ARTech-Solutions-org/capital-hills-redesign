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
  const [cityFilter, setCityFilter] = useState('all');
  const [review, setReview] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const filtered = useMemo(
    () => projects.filter((p) => cityFilter === 'all' || p.city === cityFilter),
    [cityFilter]
  );

  // Auto-rotate reviews
  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => setReview((r) => (r + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [autoPlay]);

  const cities = ['all', ...Array.from(new Set(projects.map((p) => p.city)))];

  return (
    <Shell>
      <main>
        {/* ── HERO: Cream split-screen ── */}
        <section className="relative min-h-[100dvh] overflow-hidden bg-[#f6f0e4] pt-28 md:pt-0 md:flex md:items-stretch">
          {/* Left column */}
          <div className="relative z-10 flex flex-col justify-center px-6 py-16 md:w-[55%] md:py-0 md:pl-[max(40px,calc((100vw-1220px)/2+40px))] md:pr-16">
            <FadeIn>
              <p className="eyebrow">Homes worth coming home to</p>
              <h1 className="mt-6 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[.95] tracking-[-0.02em] text-[#4a1e2c]">
                A clear path<br />
                to <span className="italic text-[#c49743]">your place.</span>
              </h1>
              <p className="mt-7 max-w-md text-base leading-7 text-[#735e57]">
                Thoughtfully planned homes, clear payment plans, and a real person ready to help you take the next step in Egypt.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={CONTACT.tel}
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#4a1e2c] px-6 py-3 text-sm font-bold text-[#f6f0e4] transition hover:bg-[#3c1d2a]"
                  data-testid="link-hero-call"
                >
                  <Phone size={14} /> Call now
                </a>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-[#4a1e2c]/25 px-6 py-3 text-sm font-bold text-[#4a1e2c] transition hover:bg-[#4a1e2c]/08"
                  data-testid="link-hero-whatsapp"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#c49743] px-7 py-3.5 text-sm font-bold text-[#3c1d2a] shadow-[0_4px_20px_rgba(196,151,67,.35)] transition hover:bg-[#d9ad51]"
                  data-testid="link-hero-book-viewing"
                >
                  Book a Viewing <CalendarDays size={15} />
                </Link>
              </div>
            </FadeIn>

            {/* Stat */}
            <FadeIn delay={0.3} className="mt-14 flex items-center gap-8 border-t border-[#4a1e2c]/12 pt-8">
              <div>
                <p className="font-display text-4xl text-[#4a1e2c]">18</p>
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#9b702c]">Key Projects</p>
              </div>
              <div className="h-10 w-px bg-[#4a1e2c]/15" />
              <div>
                <p className="font-display text-4xl text-[#4a1e2c]">4</p>
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#9b702c]">Prime Cities</p>
              </div>
              <div className="h-10 w-px bg-[#4a1e2c]/15" />
              <div>
                <p className="font-display text-4xl text-[#4a1e2c]">2017</p>
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#9b702c]">Est.</p>
              </div>
            </FadeIn>
          </div>

          {/* Right column — stacked image collage */}
          <div className="relative hidden md:flex md:w-[45%] md:items-stretch">
            <div className="absolute inset-0 bg-[#eadbc4]" />
            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 0.7, 0.25, 1] }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[0]}
                alt="Capital Hills development"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#f6f0e4]/30" />
            </motion.div>
            {/* Small floating image 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 0.7, 0.25, 1] }}
              className="absolute bottom-16 left-[-60px] z-10 h-44 w-64 overflow-hidden rounded-lg shadow-[0_20px_60px_rgba(26,13,27,.3)]"
            >
              <img src={heroImages[1]} alt="" className="h-full w-full object-cover" />
            </motion.div>
            {/* Small floating image 2 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 0.7, 0.25, 1] }}
              className="absolute right-8 top-[15%] z-10 h-36 w-52 overflow-hidden rounded-lg shadow-[0_20px_60px_rgba(26,13,27,.25)]"
            >
              <img src={heroImages[2]} alt="" className="h-full w-full object-cover" />
            </motion.div>
          </div>
        </section>

        {/* ── PROJECTS: Horizontal filmstrip ── */}
        <section id="projects" className="scroll-mt-24 py-20 md:py-28">
          <div className="container-shell">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <FadeIn>
                <p className="eyebrow">Find your footing</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-[#4a1e2c] md:text-5xl">
                  Projects built<br />for real life.
                </h2>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="flex flex-wrap gap-2">
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCityFilter(c)}
                      className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[.15em] transition ${
                        cityFilter === c
                          ? 'bg-[#4a1e2c] text-[#f6f0e4]'
                          : 'border border-[#4a1e2c]/20 text-[#735e57] hover:border-[#4a1e2c]/50 hover:text-[#4a1e2c]'
                      }`}
                    >
                      {c === 'all' ? 'All cities' : c}
                    </button>
                  ))}
                </div>
              </FadeIn>
            </div>

            {filtered.length > 0 ? (
              <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-3">
                {filtered.map((project, index) => (
                  <StaggerItem
                    key={project.slug}
                    className={index === 0 && filtered.length > 1 ? 'md:col-span-2' : ''}
                  >
                    <ProjectCard project={project} featured={index === 0 && filtered.length > 1} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-[#d9c5a5] p-12 text-center">
                <p className="font-display text-2xl text-[#4a1e2c]">Nothing in that city yet.</p>
                <p className="mt-2 text-sm text-[#735e57]">Try another city or talk to our team.</p>
                <button
                  onClick={() => setCityFilter('all')}
                  className="mt-5 rounded-full bg-[#4a1e2c] px-5 py-2.5 text-sm font-bold text-[#fff8ea]"
                  data-testid="button-reset-search"
                >
                  Show all projects
                </button>
              </div>
            )}
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
              src="https://images.pexels.com/photos/7031612/pexels-photo-7031612.jpeg?auto=compress&cs=tinysrgb&w=1000"
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
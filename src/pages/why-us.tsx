import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Shell } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

const values = [
  {
    n: '01',
    title: 'Trusted Relationships',
    copy: 'We focus on building trusted relationships with our customers, partners, and communities — creating spaces where people can live, work, grow, and connect.',
    img: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    n: '02',
    title: '18 Key Projects',
    copy: 'Our portfolio spans New Cairo, Sheikh Zayed, October, and the New Administrative Capital, serving different needs across residential, commercial, and mixed-use developments.',
    img: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    n: '03',
    title: 'Established Partners',
    copy: 'We work with established brands and partners across different industries, strengthening the communities and destinations we create to deliver lasting value.',
    img: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    n: '04',
    title: 'Our People at the Heart',
    copy: 'We believe in creating a collaborative and supportive work environment where our teams can grow, contribute, and make a meaningful impact on our vision.',
    img: 'https://images.pexels.com/photos/7031608/pexels-photo-7031608.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function WhyUs() {
  return (
    <Shell>
      <main>
        {/* ── HERO: Horizontal split ── */}
        <section className="min-h-[100dvh] md:grid md:grid-cols-[1fr_1fr]">
          {/* Left — text on dark */}
          <div className="flex flex-col justify-end bg-[#4a1e2c] px-8 py-20 pt-36 text-[#fff7e9] md:px-16 md:pt-20">
            <FadeIn>
              <p className="eyebrow">Capital Hills Developments</p>
              <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-[clamp(3rem,5vw,4.5rem)]">
                Invest With Trust.<br />
                <span className="italic text-[#d9ad51]">Grow With Community.</span>
              </h1>
              <p className="mt-7 max-w-md text-base leading-7 text-[#e2cbbd]">
                Established in 2017, we have built a growing portfolio of residential, commercial, and mixed-use developments across key destinations in Egypt. We believe real estate is more than a property—it is a decision about your future.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/#projects" className="inline-flex items-center gap-2 rounded-full bg-[#c49743] px-6 py-3 text-sm font-bold text-[#3c1d2a] transition hover:bg-[#d9ad51]">
                  View projects <ArrowRight size={15} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#f6f0e4]/25 px-6 py-3 text-sm font-bold text-[#f6f0e4] transition hover:bg-white/10">
                  Contact us
                </Link>
              </div>
            </FadeIn>
          </div>
          {/* Right — image */}
          <div className="relative min-h-[40vh] overflow-hidden md:min-h-0">
            <img
              src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Elegant architecture"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </section>

        {/* ── VALUES: Numbered alternating ── */}
        <section className="py-20 md:py-32">
          <div className="container-shell">
            <FadeIn className="mb-16 text-center">
              <p className="eyebrow">Our approach</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[#4a1e2c] md:text-5xl">
                What matters most.
              </h2>
              <p className="mt-4 mx-auto max-w-xl text-sm leading-7 text-[#735e57]">
                From East to West, our projects are designed around what matters most to our customers: strategic locations, quality, thoughtful design, and long-term investment value.
              </p>
            </FadeIn>

            <div className="space-y-0 divide-y divide-[#e5d4b9]">
              {values.map(({ n, title, copy, img }, i) => (
                <div key={n} className={`grid gap-0 md:grid-cols-2 ${i % 2 !== 0 ? 'md:direction-rtl' : ''}`}>
                  {/* Text */}
                  <FadeIn
                    delay={0.1}
                    className={`flex flex-col justify-center p-8 md:p-16 ${i % 2 !== 0 ? 'md:order-2' : ''}`}
                  >
                    <span className="font-mono text-[10px] tracking-[.25em] text-[#c49743]">{n}</span>
                    <h3 className="mt-3 font-display text-3xl text-[#4a1e2c] md:text-4xl">{title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#735e57] max-w-md">{copy}</p>
                  </FadeIn>
                  {/* Image */}
                  <div className={`relative min-h-[260px] overflow-hidden ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                    <img
                      src={img}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className={`absolute inset-0 ${i % 2 !== 0 ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-[#4a1e2c]/10 to-transparent`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#eadbc4] py-24">
          <FadeIn className="container-shell text-center max-w-2xl mx-auto">
            <p className="eyebrow">Ready to see what we've built?</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[#3c1d2a] md:text-5xl">
              Browse our latest projects.
            </h2>
            <p className="mt-5 text-sm leading-6 text-[#4a1e2c]/70">
              Browse our latest projects or reach out directly to a specialist who can guide you to the right fit.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/#projects" className="inline-flex items-center gap-2 rounded-full bg-[#4a1e2c] px-7 py-3.5 text-sm font-bold text-[#fff7e9] transition hover:bg-[#3c1d2a]">
                View projects <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#4a1e2c]/30 px-7 py-3.5 text-sm font-bold text-[#4a1e2c] transition hover:bg-[#4a1e2c]/08">
                Contact us
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>
    </Shell>
  );
}

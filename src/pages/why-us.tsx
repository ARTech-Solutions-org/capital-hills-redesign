import { ArrowRight, BadgeCheck, CalendarDays, CircleCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { SectionHeading, Shell } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function WhyUs() {
  return (
    <Shell>
      <main>
        <section className="relative min-h-[600px] bg-[#3d0f14] pt-28 text-[#fff7e9] md:min-h-[650px]">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="Elegant building architecture" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(61,15,20,0.8)_0%,rgba(61,15,20,0.95)_100%)]" />
          <div className="container-shell relative flex h-full min-h-[450px] flex-col justify-end pb-24 md:pb-32">
            <FadeIn className="max-w-3xl">
              <p className="eyebrow">Capital Hills Developments</p>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-[-.02em] md:text-7xl">
                Invest With Trust..<br /><span className="text-[#d9ad51]">Grow With Community.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-[#ead9cc]">
                Established in 2017, we have built a growing portfolio of residential, commercial, and mixed-use developments across key destinations in Egypt. We believe real estate is more than a property—it is a decision about your future.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="bg-[#fff9ef] py-20 md:py-32">
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeading 
                eyebrow="Our approach" 
                title="What matters most." 
                copy="From East to West, our projects are designed around what matters most to our customers: strategic locations, quality, thoughtful design, and long-term investment value."
                centered
              />
            </div>

            <StaggerContainer className="mt-20 grid gap-8 md:grid-cols-2 lg:gap-12">
              <StaggerItem className="group rounded-3xl border border-[#ead8ba] bg-[#fffdf8] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition-colors group-hover:bg-[#56293a] group-hover:text-[#d9ad51]">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#56293a]">Trusted relationships</h3>
                <p className="mt-4 text-sm leading-7 text-[#735e57]">
                  We focus on building trusted relationships with our customers, partners, and communities — creating spaces where people can live, work, grow, and connect.
                </p>
              </StaggerItem>

              <StaggerItem className="group rounded-3xl border border-[#ead8ba] bg-[#fffdf8] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition-colors group-hover:bg-[#56293a] group-hover:text-[#d9ad51]">
                  <BadgeCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#56293a]">18 key projects</h3>
                <p className="mt-4 text-sm leading-7 text-[#735e57]">
                  Our portfolio spans across New Cairo, Sheikh Zayed, October, and the New Administrative Capital, serving different needs across residential, commercial, and mixed-use developments.
                </p>
              </StaggerItem>

              <StaggerItem className="group rounded-3xl border border-[#ead8ba] bg-[#fffdf8] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition-colors group-hover:bg-[#56293a] group-hover:text-[#d9ad51]">
                  <CalendarDays size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#56293a]">Established partners</h3>
                <p className="mt-4 text-sm leading-7 text-[#735e57]">
                  We work with established brands and partners across different industries, strengthening the communities and destinations we create to deliver lasting value.
                </p>
              </StaggerItem>

              <StaggerItem className="group rounded-3xl bg-[#56293a] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#3c1d2a] text-[#d9ad51]">
                  <CircleCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#fff7e9]">Our people at the heart</h3>
                <p className="mt-4 text-sm leading-7 text-[#e2cbbd]">
                  We believe in creating a collaborative and supportive work environment where our teams can grow, contribute, and make a meaningful impact on our vision.
                </p>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        <section className="bg-[#eadbc4] py-20 md:py-32">
          <FadeIn className="container-shell text-center">
            <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight text-[#3c1d2a] md:text-5xl">
              Ready to see what we've built?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[#56293a]/80">
              Browse our latest projects or reach out directly to a specialist who can guide you to the right fit.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/#projects" className="inline-flex items-center gap-2 rounded-full bg-[#56293a] px-6 py-3.5 text-sm font-bold text-[#fff7e9]">
                View projects <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#56293a]/30 bg-transparent px-6 py-3.5 text-sm font-bold text-[#56293a]">
                Contact us
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>
    </Shell>
  );
}

import { ArrowRight, BadgeCheck, CalendarDays, CircleCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { SectionHeading, Shell } from '@/components/site';

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
            <div className="fade-up max-w-3xl">
              <p className="eyebrow">Why Capital Hills</p>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-[-.02em] md:text-7xl">
                The calm is in <span className="text-[#d9ad51]">the details.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-[#ead9cc]">
                Buying a home is a monumental decision. We believe the process shouldn't be chaotic. Our job is to make the information around it feel simple, honest, and distinctly human.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fff9ef] py-20 md:py-32">
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeading 
                eyebrow="Our approach" 
                title="A fundamentally different experience." 
                copy="We've taken everything that makes home-buying stressful and replaced it with clarity and respect for your time."
                centered
              />
            </div>

            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:gap-12">
              <div className="group rounded-3xl border border-[#ead8ba] bg-[#fffdf8] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition-colors group-hover:bg-[#56293a] group-hover:text-[#d9ad51]">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#56293a]">Sound foundations</h3>
                <p className="mt-4 text-sm leading-7 text-[#735e57]">
                  Before we even talk about layouts and finishes, we ensure the absolute basics are flawless. Clear titles, trusted legal partners, and practical structural planning that guarantees a home you can actually live in for generations.
                </p>
              </div>

              <div className="group rounded-3xl border border-[#ead8ba] bg-[#fffdf8] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition-colors group-hover:bg-[#56293a] group-hover:text-[#d9ad51]">
                  <BadgeCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#56293a]">Straight answers</h3>
                <p className="mt-4 text-sm leading-7 text-[#735e57]">
                  No hidden fees, no complex financial jargon, and no mystery listings. You get transparent pricing from day one and a payment plan explained in plain language, so you know exactly what to expect.
                </p>
              </div>

              <div className="group rounded-3xl border border-[#ead8ba] bg-[#fffdf8] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition-colors group-hover:bg-[#56293a] group-hover:text-[#d9ad51]">
                  <CalendarDays size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#56293a]">You set the pace</h3>
                <p className="mt-4 text-sm leading-7 text-[#735e57]">
                  We don't do pressure tactics. Book a visit, take your time walking through the details, ask as many questions as you need, and decide only when you feel completely ready to make your move.
                </p>
              </div>

              <div className="group rounded-3xl bg-[#56293a] p-8 transition-shadow hover:shadow-xl md:p-12">
                <div className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#3c1d2a] text-[#d9ad51]">
                  <CircleCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl text-[#fff7e9]">A team that stays close</h3>
                <p className="mt-4 text-sm leading-7 text-[#e2cbbd]">
                  From the very first phone call to the day you receive your keys, you won't be passed around between departments. There is always a dedicated person who knows your name and your file, ready to help.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eadbc4] py-20 md:py-32">
          <div className="container-shell text-center">
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
          </div>
        </section>
      </main>
    </Shell>
  );
}

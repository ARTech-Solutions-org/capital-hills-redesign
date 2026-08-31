import { type FormEvent, useState } from 'react';
import { ArrowRight, Check, Mail, MapPin, MessageCircle, Phone, Clock, Send } from 'lucide-react';
import { Link } from 'wouter';
import { CONTACT, Shell } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

const offices = [
  { label: 'Main HQ', address: 'Down Town, Bldg S1 A\nNew Cairo' },
  { label: 'West Arkan HQ', address: 'Arkan Plaza, Bldg 10\nSheikh Zayed' },
  { label: 'West Galleria HQ', address: 'Galleria 40, North Tower\nSheikh Zayed' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <Shell>
      <main className="min-h-[100dvh] md:grid md:grid-cols-[420px_1fr] lg:grid-cols-[480px_1fr]">
        {/* ── Left sticky panel ── */}
        <aside className="bg-[#4a1e2c] text-[#f7eede] md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <div className="flex flex-col justify-between p-8 pt-28 md:h-full md:p-12 md:pt-32">
            <div>
              <FadeIn>
                <p className="eyebrow">A real person is close by</p>
                <h1 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
                  Let's make the<br />
                  <span className="italic text-[#d9ad51]">next step feel simple.</span>
                </h1>
                <p className="mt-6 text-sm leading-7 text-[#e2cbbd]">
                  Call, message, or book a quiet walk-through. Tell us what you are considering and we will bring useful answers.
                </p>
              </FadeIn>

              {/* Contact options */}
              <StaggerContainer className="mt-10 space-y-3">
                <StaggerItem>
                  <a
                    href={CONTACT.tel}
                    className="flex items-center gap-4 rounded-xl bg-[#c49743] px-5 py-4 text-[#3c1d2a] transition hover:bg-[#d9ad51]"
                    data-testid="contact-call-card"
                  >
                    <Phone size={18} strokeWidth={1.8} className="shrink-0" />
                    <div>
                      <strong className="block text-sm font-bold">Call us</strong>
                      <span className="text-xs opacity-75">{CONTACT.phone}</span>
                    </div>
                    <ArrowRight size={15} className="ml-auto opacity-60" />
                  </a>
                </StaggerItem>
                <StaggerItem>
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-[#f6f0e4]/15 px-5 py-4 transition hover:bg-white/08"
                    data-testid="contact-whatsapp-card"
                  >
                    <MessageCircle size={18} strokeWidth={1.8} className="shrink-0 text-[#d9ad51]" />
                    <div>
                      <strong className="block text-sm font-bold">WhatsApp</strong>
                      <span className="text-xs text-[#dfc9be]">Chat with our team</span>
                    </div>
                    <ArrowRight size={15} className="ml-auto opacity-40" />
                  </a>
                </StaggerItem>
                <StaggerItem>
                  <a
                    href={CONTACT.email}
                    className="flex items-center gap-4 rounded-xl border border-[#f6f0e4]/15 px-5 py-4 transition hover:bg-white/08"
                    data-testid="contact-email-card"
                  >
                    <Mail size={18} strokeWidth={1.8} className="shrink-0 text-[#d9ad51]" />
                    <div>
                      <strong className="block text-sm font-bold">Email</strong>
                      <span className="text-xs text-[#dfc9be]">hello@capitalhillsdevelopments.eg</span>
                    </div>
                    <ArrowRight size={15} className="ml-auto opacity-40" />
                  </a>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Office info */}
            <div className="mt-12 border-t border-white/15 pt-8">
              <p className="eyebrow mb-5">Our offices</p>
              <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-1">
                {offices.map(({ label, address }) => (
                  <div key={label}>
                    <p className="text-xs font-bold text-[#d9ad51]">{label}</p>
                    <p className="mt-1 whitespace-pre-line text-xs leading-5 text-[#c4a98a]">{address}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-[#c4a98a]">
                <Clock size={13} className="text-[#d9ad51]" />
                Sat – Thu, 10:00am – 6:00pm
              </div>
            </div>
          </div>
        </aside>

        {/* ── Right: Form ── */}
        <div className="bg-[#f6f0e4] px-8 py-16 md:px-16 md:py-24">
          <FadeIn className="mx-auto max-w-xl">
            <p className="eyebrow">Have a quick question?</p>
            <h2 className="mt-4 font-display text-3xl text-[#4a1e2c] md:text-4xl">We can start there.</h2>
            <p className="mt-3 text-sm leading-6 text-[#735e57]">
              No forms that go into a black hole. Leave your number and a sentence, and a member of our team will call.
            </p>

            {sent ? (
              <div className="mt-10 rounded-2xl bg-[#eadbc4] p-8" data-testid="status-question-success">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#c49743]">
                  <Check className="text-[#3c1d2a]" size={22} />
                </div>
                <h3 className="mt-5 font-display text-2xl text-[#4a1e2c]">Message received.</h3>
                <p className="mt-2 text-sm leading-5 text-[#735e57]">We will be in touch with a clear answer soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block font-mono text-[9px] uppercase tracking-[.2em] text-[#735e57]">Name</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b702c]"
                    placeholder="Your name"
                    data-testid="input-question-name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[9px] uppercase tracking-[.2em] text-[#735e57]">Mobile or email</span>
                  <input
                    required
                    name="contact"
                    autoComplete="email tel"
                    className="w-full rounded-xl border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b702c]"
                    placeholder="How should we reach you?"
                    data-testid="input-question-contact"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[9px] uppercase tracking-[.2em] text-[#735e57]">What can we help with?</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full resize-none rounded-xl border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3.5 text-sm outline-none transition focus:border-[#9b702c]"
                    placeholder="I would like to understand..."
                    data-testid="textarea-question"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#4a1e2c] px-7 py-3.5 text-sm font-bold text-[#f6f0e4] transition hover:bg-[#3c1d2a]"
                  data-testid="button-submit-question"
                >
                  <Send size={14} /> Send inquiry
                </button>
              </form>
            )}

            {/* Map section below form */}
            <div className="mt-16 border-t border-[#e5d4b9] pt-12">
              <p className="eyebrow mb-6">Find us</p>
              <div className="overflow-hidden rounded-2xl border border-[#e5d4b9]">
                <iframe
                  title="Capital Hills Developments office location"
                  src="https://www.google.com/maps?q=New+Cairo,+Cairo+Governorate,+Egypt&output=embed"
                  className="h-64 w-full border-0 grayscale-[.15]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex items-center justify-between bg-[#fffaf1] px-4 py-3">
                  <p className="flex items-center gap-2 text-sm text-[#4a1e2c]">
                    <MapPin size={14} className="text-[#9b702c]" /> New Cairo, Cairo Governorate
                  </p>
                  <Link href="/#projects" className="text-xs font-bold text-[#9b702c]" data-testid="link-contact-projects">
                    Browse projects →
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </Shell>
  );
}
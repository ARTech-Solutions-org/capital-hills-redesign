import { type FormEvent, useState } from 'react';
import { ArrowRight, Check, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { Link } from 'wouter';
import { CONTACT, SectionHeading, Shell } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <Shell>
      <main>
        <section className="bg-[#3d0f14] pb-20 pt-28 text-[#fff8ea] md:pb-28 md:pt-36">
          <div className="container-shell grid gap-12 md:grid-cols-[.9fr_1.1fr] md:items-end">
            <FadeIn>
              <p className="eyebrow">A real person is close by</p>
              <h1 className="mt-4 font-display text-5xl leading-[.98] md:text-7xl">Let’s make the next step feel simple.</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#dfc9be]">
                Call, message, or book a quiet walk-through. Tell us what you are considering and we will bring useful answers for your next move in Egypt.
              </p>
            </FadeIn>
            <StaggerContainer className="grid gap-3 sm:grid-cols-3">
              <StaggerItem>
                <a href={CONTACT.tel} className="block h-full rounded-md bg-[#c49743] p-5 text-[#3c1d2a]" data-testid="contact-call-card">
                  <Phone size={20} strokeWidth={1.8} />
                  <strong className="mt-8 block text-sm">Call us</strong>
                  <span className="mt-1 block text-xs">{CONTACT.phone}</span>
                </a>
              </StaggerItem>
              <StaggerItem>
                <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="block h-full rounded-md border border-[#ead8ba]/30 p-5" data-testid="contact-whatsapp-card">
                  <MessageCircle size={20} strokeWidth={1.8} className="text-[#d9ad51]" />
                  <strong className="mt-8 block text-sm">WhatsApp</strong>
                  <span className="mt-1 block text-xs text-[#dfc9be]">Chat with our team</span>
                </a>
              </StaggerItem>
              <StaggerItem>
                <a href={CONTACT.email} className="block h-full rounded-md border border-[#ead8ba]/30 p-5" data-testid="contact-email-card">
                  <Mail size={20} strokeWidth={1.8} className="text-[#d9ad51]" />
                  <strong className="mt-8 block text-sm">Email</strong>
                  <span className="mt-1 block text-xs text-[#dfc9be]">hello@capitalhillsdevelopments.eg</span>
                </a>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        <section className="container-shell py-16 md:py-24">
          <FadeIn className="mx-auto max-w-2xl rounded-2xl bg-[#eadbc4] p-7 md:p-9">
            <SectionHeading eyebrow="Have a quick question?" title="We can start there." copy="No forms that go into a black hole. Leave your number and a sentence, and a member of our team will call." />
            {sent ? (
              <div className="mt-10 rounded-xl bg-[#f5ead9] p-5" data-testid="status-question-success">
                <Check className="text-[#9b702c]" size={24} />
                <p className="mt-3 text-sm font-bold text-[#56293a]">Message received.</p>
                <p className="mt-1 text-xs leading-5 text-[#735e57]">We will be in touch with a clear answer soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-[#56293a]">Name</span>
                  <input required name="name" autoComplete="name" className="w-full rounded-md border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" placeholder="Your name" data-testid="input-question-name" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-[#56293a]">Mobile or email</span>
                  <input required name="contact" autoComplete="email tel" className="w-full rounded-md border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" placeholder="How should we reach you?" data-testid="input-question-contact" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-[#56293a]">What can we help with?</span>
                  <textarea required name="message" rows={4} className="w-full resize-none rounded-md border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" placeholder="I would like to understand..." data-testid="textarea-question" />
                </label>
                <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-[#c49743] px-5 py-3 text-sm font-bold text-[#3c1d2a]" data-testid="button-submit-question">
                  <Send size={15} /> Send inquiry
                </button>
              </form>
            )}
          </FadeIn>
        </section>

        <section className="border-t border-[#e5d4b9] py-16">
          <StaggerContainer className="container-shell grid gap-8 md:grid-cols-3">
            <StaggerItem>
              <p className="eyebrow">Cairo office</p>
              <p className="mt-3 text-sm leading-6 text-[#735e57]">Building 12, South 90 Street<br />New Cairo, Cairo</p>
            </StaggerItem>
            <StaggerItem>
              <p className="eyebrow">Hours</p>
              <p className="mt-3 text-sm leading-6 text-[#735e57]">Saturday – Thursday<br />10:00am – 6:00pm</p>
            </StaggerItem>
            <StaggerItem>
              <p className="eyebrow">Prefer a message?</p>
              <Link href="/#projects" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#9b702c]" data-testid="link-contact-projects">Browse projects <ArrowRight size={14} /></Link>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </main>
    </Shell>
  );
}
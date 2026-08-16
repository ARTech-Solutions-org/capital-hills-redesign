import { type FormEvent, useState } from 'react';
import { ArrowRight, CalendarDays, Check, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { Link } from 'wouter';
import { projects } from '@/data/projects';
import { CONTACT, SectionHeading, Shell } from '@/components/site';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [visitSent, setVisitSent] = useState(false);
  const [selected, setSelected] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>, kind: 'visit' | 'question') => {
    event.preventDefault();
    kind === 'visit' ? setVisitSent(true) : setSent(true);
  };

  return (
    <Shell>
      <main>
        <section className="bg-[#3d0f14] pb-20 pt-28 text-[#fff8ea] md:pb-28 md:pt-36">
          <div className="container-shell grid gap-12 md:grid-cols-[.9fr_1.1fr] md:items-end">
            <div>
              <p className="eyebrow">A real person is close by</p>
              <h1 className="mt-4 font-display text-5xl leading-[.98] md:text-7xl">Let’s make the next step feel simple.</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#dfc9be]">
                Call, message, or book a quiet walk-through. Tell us what you are considering and we will bring useful answers for your next move in Egypt.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <a href={CONTACT.tel} className="rounded-md bg-[#c49743] p-5 text-[#3c1d2a]" data-testid="contact-call-card">
                <Phone size={20} strokeWidth={1.8} />
                <strong className="mt-8 block text-sm">Call us</strong>
                <span className="mt-1 block text-xs">{CONTACT.phone}</span>
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="rounded-md border border-[#ead8ba]/30 p-5" data-testid="contact-whatsapp-card">
                <MessageCircle size={20} strokeWidth={1.8} className="text-[#d9ad51]" />
                <strong className="mt-8 block text-sm">WhatsApp</strong>
                <span className="mt-1 block text-xs text-[#dfc9be]">Chat with our team</span>
              </a>
              <a href={CONTACT.email} className="rounded-md border border-[#ead8ba]/30 p-5" data-testid="contact-email-card">
                <Mail size={20} strokeWidth={1.8} className="text-[#d9ad51]" />
                <strong className="mt-8 block text-sm">Email</strong>
                <span className="mt-1 block text-xs text-[#dfc9be]">hello@capitalhillsdevelopments.eg</span>
              </a>
            </div>
          </div>
        </section>

        <section className="container-shell grid gap-10 py-16 md:grid-cols-[1fr_1fr] md:py-24">
          <div>
            <SectionHeading
              eyebrow="Book a private visit"
              title="See a home in your own time."
              copy="Choose a day that works and tell us what you would like to see. We will confirm the time by phone."
            />
            {visitSent ? (
              <div className="mt-10 rounded-2xl bg-[#eadbc4] p-7" data-testid="status-visit-success">
                <Check className="text-[#9b702c]" size={26} />
                <h3 className="mt-4 font-display text-2xl text-[#56293a]">Your visit request is with us.</h3>
                <p className="mt-2 text-sm leading-6 text-[#735e57]">A Capital Hills representative will call shortly to confirm the details.</p>
              </div>
            ) : (
              <form onSubmit={(event) => submit(event, 'visit')} className="mt-8 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-[#56293a]">Your name</span>
                  <input required name="name" autoComplete="name" className="w-full rounded-md border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" placeholder="e.g. Mariam Hassan" data-testid="input-visit-name" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#56293a]">Phone number</span>
                    <input required type="tel" name="phone" autoComplete="tel" className="w-full rounded-md border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" placeholder="+20..." data-testid="input-visit-phone" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#56293a]">Preferred date</span>
                    <input required type="date" name="date" min={new Date().toISOString().slice(0, 10)} className="w-full rounded-md border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" data-testid="input-visit-date" />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-[#56293a]">Project to see</span>
                  <select value={selected} onChange={(event) => setSelected(event.target.value)} required className="w-full rounded-md border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" data-testid="select-visit-project">
                    <option value="">Choose a project</option>
                    {projects.map((project) => <option key={project.slug} value={project.slug}>{project.name}</option>)}
                  </select>
                </label>
                <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-[#56293a] px-5 py-3 text-sm font-bold text-[#fff8ea]" data-testid="button-submit-visit">
                  <CalendarDays size={15} /> Request a visit
                </button>
              </form>
            )}
          </div>

          <div className="rounded-2xl bg-[#eadbc4] p-7 md:p-9">
            <SectionHeading eyebrow="Have a quick question?" title="We can start there." copy="No forms that go into a black hole. Leave your number and a sentence, and a member of our team will call." />
            {sent ? (
              <div className="mt-10 rounded-xl bg-[#f5ead9] p-5" data-testid="status-question-success">
                <Check className="text-[#9b702c]" size={24} />
                <p className="mt-3 text-sm font-bold text-[#56293a]">Message received.</p>
                <p className="mt-1 text-xs leading-5 text-[#735e57]">We will be in touch with a clear answer soon.</p>
              </div>
            ) : (
              <form onSubmit={(event) => submit(event, 'question')} className="mt-8 space-y-4">
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
          </div>
        </section>

        <section className="border-t border-[#e5d4b9] py-16">
          <div className="container-shell grid gap-8 md:grid-cols-3">
            <div>
              <p className="eyebrow">Cairo office</p>
              <p className="mt-3 text-sm leading-6 text-[#735e57]">Building 12, South 90 Street<br />New Cairo, Cairo</p>
            </div>
            <div>
              <p className="eyebrow">Hours</p>
              <p className="mt-3 text-sm leading-6 text-[#735e57]">Saturday – Thursday<br />10:00am – 6:00pm</p>
            </div>
            <div>
              <p className="eyebrow">Prefer a message?</p>
              <Link href="/#projects" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#9b702c]" data-testid="link-contact-projects">Browse projects <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}
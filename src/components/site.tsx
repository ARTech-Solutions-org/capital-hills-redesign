import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowRight, CalendarDays, Check, CircleUserRound,
  Facebook, Heart, Instagram, Mail, Menu, MessageCircle,
  Phone, Send, X, Download, MapPin
} from 'lucide-react';
import { type Project, formatPrice } from '@/data/projects';
import { FadeIn } from '@/components/animations';

export const CONTACT = {
  phone: '+20 100 555 0190',
  tel: 'tel:+201005550190',
  whatsapp: 'https://wa.me/201005550190?text=Hello%20Capital%20Hills%2C%20I%27d%20like%20to%20ask%20about%20a%20project.',
  email: 'mailto:hello@capitalhillsdevelopments.eg?subject=Capital%20Hills%20enquiry',
  sms: 'sms:+201005550190',
};

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="focus-ring block shrink-0" data-testid="link-logo">
      <img
        src="/capital-hills-logo.png"
        alt="Capital Hills Developments"
        className={`h-9 w-auto object-contain transition-all ${light ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const nav = [['Projects', '/#projects'], ['Why us', '/why-us'], ['Contact', '/contact']];
  const lightPage = location === '/' || location === '/contact' || location === '/why-us';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-6">
      <div
        className={`nav-pill mx-auto flex max-w-5xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ${
          scrolled
            ? 'bg-[#3c1d2a]/90 shadow-[0_8px_40px_rgba(60,29,42,.28)]'
            : lightPage
            ? 'bg-[#3c1d2a]/60'
            : 'bg-[#f6f0e4]/80 shadow-[0_2px_20px_rgba(75,30,44,.07)]'
        }`}
      >
        <Logo light={scrolled || lightPage} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`focus-ring rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                scrolled || lightPage
                  ? 'text-[#f7eede]/75 hover:bg-white/10 hover:text-[#d9ad51]'
                  : 'text-[#4a1e2c]/70 hover:bg-[#4a1e2c]/08 hover:text-[#4a1e2c]'
              }`}
              data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CONTACT.tel}
            className={`focus-ring hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition md:flex ${
              scrolled || lightPage
                ? 'bg-[#c49743] text-[#3c1d2a] hover:bg-[#d9ad51]'
                : 'bg-[#4a1e2c] text-[#fff8ea] hover:bg-[#3c1d2a]'
            }`}
            data-testid="link-header-call"
          >
            <Phone size={13} /> Talk to us
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`focus-ring grid h-9 w-9 place-items-center rounded-full transition md:hidden ${
              scrolled || lightPage
                ? 'text-[#f7eede] hover:bg-white/10'
                : 'text-[#4a1e2c] hover:bg-[#4a1e2c]/10'
            }`}
            aria-label="Open menu"
            data-testid="button-open-menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-[#ead8ba]/30 bg-[#3c1d2a] shadow-xl md:hidden">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/10 px-5 py-4 text-sm font-semibold text-[#f7eede] last:border-0"
              data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}
            >
              {label}
            </Link>
          ))}
          <a
            href={CONTACT.tel}
            className="flex items-center gap-2 px-5 py-4 text-sm font-bold text-[#d9ad51]"
            data-testid="link-mobile-call"
          >
            <Phone size={14} /> {CONTACT.phone}
          </a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#26131b] py-10 text-[#f7eede]">
      <div className="container-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Logo light />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#c4a98a]">
          <Link href="/#projects" className="hover:text-[#d9ad51] transition" data-testid="link-footer-projects">Projects</Link>
          <Link href="/why-us" className="hover:text-[#d9ad51] transition" data-testid="link-footer-why">Why us</Link>
          <Link href="/contact" className="hover:text-[#d9ad51] transition" data-testid="link-footer-contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-[#c4a98a] transition hover:border-[#d9ad51] hover:text-[#d9ad51]" data-testid="link-footer-instagram"><Instagram size={14} /></a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-[#c4a98a] transition hover:border-[#d9ad51] hover:text-[#d9ad51]" data-testid="link-footer-facebook"><Facebook size={14} /></a>
        </div>
      </div>
      <div className="container-shell mt-8 border-t border-white/10 pt-6 flex flex-col gap-1 md:flex-row md:justify-between text-xs text-[#7a5c50]">
        <span>© 2026 Capital Hills Developments</span>
        <span>NAC · Sheikh Zayed · 6th of October · New Cairo</span>
      </div>
    </footer>
  );
}

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const [saved, setSaved] = useState(() => localStorage.getItem('capital-hills-favourites')?.includes(project.slug) ?? false);

  const toggleSave = (event: React.MouseEvent) => {
    event.preventDefault();
    const current = JSON.parse(localStorage.getItem('capital-hills-favourites') || '[]') as string[];
    const next = current.includes(project.slug) ? current.filter((item) => item !== project.slug) : [...current, project.slug];
    localStorage.setItem('capital-hills-favourites', JSON.stringify(next));
    setSaved(next.includes(project.slug));
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden bg-[#eadbc4] transition duration-400 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(74,30,44,.15)] ${featured ? 'md:col-span-2' : ''}`}
      style={{ borderRadius: 2 }}
      data-testid={`card-project-${project.slug}`}
    >
      <Link href={`/projects/${project.slug}`} className="block relative overflow-hidden" aria-label={`View ${project.name}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-[340px] md:h-[460px]' : 'h-[260px] md:h-[320px]'}`}>
          <img
            src={project.gallery[0]}
            alt={`${project.name} exterior`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#26131b]/80 via-[#26131b]/20 to-transparent" />
          {/* City badge */}
          <span className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[.2em] text-[#f6f0e4]/80">
            {project.city}
          </span>
          {/* Save */}
          <button
            onClick={toggleSave}
            aria-label={saved ? 'Remove from saved' : 'Save project'}
            className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#f6f0e4]/20 text-white backdrop-blur-sm transition hover:bg-[#f6f0e4]/40"
            data-testid={`button-save-${project.slug}`}
          >
            <Heart size={14} fill={saved ? '#d9ad51' : 'none'} className={saved ? 'text-[#d9ad51]' : ''} />
          </button>
          {/* Bottom text always visible */}
          <div className="absolute bottom-0 inset-x-0 p-5">
            <p className="text-xs text-[#e2cbbd]">{project.location}</p>
            <h3 className="mt-1 font-display text-2xl leading-tight text-white">{project.name}</h3>
          </div>
          {/* Hover reveal panel */}
          <div className="project-card-reveal absolute bottom-0 inset-x-0 bg-[#4a1e2c] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#c9a36a]">From</p>
                <p className="mt-1 font-display text-xl text-[#f6f0e4]">{formatPrice(project.startingPrice)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#c9a36a]">Handover</p>
                <p className="mt-1 text-sm font-bold text-[#f6f0e4]">{project.handover}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex-1 text-center rounded-sm bg-[#c49743] py-2 text-xs font-bold text-[#3c1d2a]">View project →</span>
            </div>
          </div>
        </div>
      </Link>
      {/* Footer strip */}
      <div className="flex items-center justify-between border-t border-[#cdb590]/50 bg-[#f5ead9] px-4 py-3">
        <span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#9b702c]">{project.availability}</span>
        <div className="flex gap-1.5">
          <a href={CONTACT.tel} aria-label="Call" className="grid h-7 w-7 place-items-center rounded-full bg-[#eadbc4] text-[#9b702c] transition hover:bg-[#4a1e2c] hover:text-[#d9ad51]"><Phone size={12} /></a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-7 w-7 place-items-center rounded-full bg-[#eadbc4] text-[#9b702c] transition hover:bg-[#4a1e2c] hover:text-[#d9ad51]"><MessageCircle size={12} /></a>
        </div>
      </div>
    </article>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <Header />
      {children}
      <Footer />
      <FloatingActions />
    </div>
  );
}

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [notice, setNotice] = useState('');
  const actions = [
    { label: 'Call', icon: Phone, href: CONTACT.tel },
    { label: 'WhatsApp', icon: MessageCircle, href: CONTACT.whatsapp },
    { label: 'Email', icon: Mail, href: CONTACT.email },
    { label: 'SMS', icon: Send, href: CONTACT.sms },
  ];
  const isHandset = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (open) return;
    const interval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % actions.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [open, actions.length]);

  const activate = (label: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if ((label === 'Call' || label === 'SMS') && !isHandset) {
      event.preventDefault();
      setNotice(`${label} is ready on mobile at ${CONTACT.phone}.`);
      window.setTimeout(() => setNotice(''), 2600);
    }
  };

  const ActiveIcon = actions[activeIconIndex].icon;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {notice && (
        <div role="status" className="absolute bottom-[74px] right-[74px] w-fit whitespace-nowrap rounded-lg bg-[#3c1d2a] px-3 py-2 text-[11px] font-semibold text-[#fff8ea] shadow-lg">
          {notice}
        </div>
      )}
      <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}>
        {actions.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            onClick={(event) => activate(label, event)}
            target={label === 'WhatsApp' || label === 'Email' ? '_blank' : undefined}
            rel="noreferrer"
            className="group flex items-center gap-3"
            aria-label={`${label} Capital Hills`}
            data-testid={`floating-${label.toLowerCase()}`}
          >
            <span className="rounded-lg bg-[#3c1d2a] px-3 py-1.5 text-xs font-bold text-[#fff8ea] shadow-lg transition group-hover:bg-[#d9ad51] group-hover:text-[#3c1d2a]">
              {label}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#3c1d2a] text-[#d9ad51] shadow-lg transition group-hover:bg-[#d9ad51] group-hover:text-[#3c1d2a]">
              <Icon size={19} strokeWidth={1.8} />
            </span>
          </a>
        ))}
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="focus-ring relative grid h-13 w-13 place-items-center rounded-full bg-[#d9ad51] text-[#3c1d2a] shadow-[0_8px_30px_rgba(196,151,67,.45)] transition-all hover:scale-105 active:scale-95"
        aria-label="Toggle contact options"
      >
        {open ? (
          <X size={22} className="animate-in spin-in-90 zoom-in-75 duration-250" />
        ) : (
          <ActiveIcon size={22} className="absolute animate-in fade-in zoom-in-75 duration-250" key={activeIconIndex} />
        )}
      </button>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState('');
  const prompts = ['What can I buy under EGP 3m?', 'Can I inspect this weekend?', 'Send me the New Cairo brochure'];
  return (
    <div className="fixed bottom-[82px] right-4 z-40 md:bottom-20 md:right-6">
      {open && (
        <div className="mb-3 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[#e1cda9] bg-[#fffaf1] shadow-[0_18px_50px_rgba(60,29,42,.18)]">
          <div className="bg-[#4a1e2c] p-4 text-[#fbf3e6]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleUserRound size={22} className="text-[#d9ad51]" />
                <div>
                  <strong className="block text-sm">Capital Hills desk</strong>
                  <span className="text-[11px] text-[#dfc9be]">Usually replies in 5 minutes</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#dfc9be]" aria-label="Close chat" data-testid="button-close-chat">
                <X size={17} />
              </button>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-xl rounded-tl-sm bg-[#f0e4d2] p-3 text-xs leading-5 text-[#4a1e2c]">
              Hello. I can help you find a project, understand a payment plan, or arrange a visit.
            </div>
            {sent && <div className="ml-6 rounded-xl rounded-tr-sm bg-[#4a1e2c] p-3 text-xs leading-5 text-[#fff7e9]">{sent}</div>}
            <div className="space-y-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setSent(`"${prompt}" — thanks. A representative will follow up shortly.`)}
                  className="block w-full rounded-lg border border-[#decbaa] px-3 py-2 text-left text-xs font-semibold text-[#4a1e2c] transition hover:border-[#9b702c] hover:bg-[#f8eddd]"
                  data-testid={`chat-prompt-${prompt.slice(0, 4).replace(' ', '-')}`}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <Link href="/contact" className="block pt-1 text-center text-xs font-bold text-[#9b702c]" data-testid="link-chat-contact">
              Prefer to talk to someone? →
            </Link>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="focus-ring flex items-center gap-2 rounded-full bg-[#c49743] px-4 py-3 text-xs font-bold text-[#3c1d2a] shadow-lg transition hover:bg-[#d9ad51]" data-testid="button-open-chat">
        <MessageCircle size={17} /> {open ? 'Close desk' : 'Chat with us'}
      </button>
    </div>
  );
}

export function BookVisitModal({ isOpen, onClose, projectName }: { isOpen: boolean; onClose: () => void; projectName: string }) {
  const [visitSent, setVisitSent] = useState(false);

  if (!isOpen) return null;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisitSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#3c1d2a]/90 p-5 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#eadbc4] p-7 md:p-9 shadow-2xl my-8">
        <button onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-lg bg-[#fff8ea] text-[#4a1e2c] transition-colors hover:bg-[#4a1e2c] hover:text-[#fff8ea]" aria-label="Close modal">
          <X size={18} />
        </button>
        <h2 className="font-display text-3xl text-[#4a1e2c]">Book a private visit</h2>
        <p className="mt-2 text-sm leading-6 text-[#735e57]">See {projectName} in your own time.</p>
        {visitSent ? (
          <div className="mt-8 rounded-xl bg-[#f5ead9] p-7" data-testid="status-visit-success">
            <Check className="text-[#9b702c]" size={26} />
            <h3 className="mt-4 font-display text-2xl text-[#4a1e2c]">Your visit request is with us.</h3>
            <p className="mt-2 text-sm leading-6 text-[#735e57]">A Capital Hills representative will call shortly to confirm the details.</p>
            <button onClick={onClose} className="mt-6 w-full rounded-lg bg-[#4a1e2c] py-3 text-sm font-bold text-[#fff8ea]">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#4a1e2c]">Your name</span>
              <input required name="name" autoComplete="name" className="w-full rounded-lg border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" placeholder="e.g. Mariam Hassan" data-testid="input-visit-name" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#4a1e2c]">Phone number</span>
                <input required type="tel" name="phone" autoComplete="tel" className="w-full rounded-lg border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" placeholder="+20..." data-testid="input-visit-phone" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#4a1e2c]">Preferred date</span>
                <input required type="date" name="date" min={new Date().toISOString().slice(0, 10)} className="w-full rounded-lg border border-[#ddc8a8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#9b702c]" data-testid="input-visit-date" />
              </label>
            </div>
            <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4a1e2c] px-5 py-3 text-sm font-bold text-[#fff8ea]" data-testid="button-submit-visit">
              <CalendarDays size={15} /> Request a visit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function pdfEscape(value: string) {
  return value.replace(/([\\\(\)])/g, '\\$1');
}

export function downloadBrochure(project: Project) {
  const lines = [
    'Capital Hills Developments',
    project.name,
    '',
    project.description,
    '',
    `Starting from ${formatPrice(project.startingPrice)}`,
    `Location: ${project.mapLocation}`,
    `Available: ${project.availability}`,
    '',
    'Payment plan',
    ...project.paymentPlan.map((item) => `${item.label}: ${item.value}`),
    '',
    `Offer: ${project.offer}`,
    '',
    `Contact: ${CONTACT.phone}`,
  ];
  const stream = ['BT', '/F1 20 Tf', '72 760 Td', ...lines.flatMap((line, index) => [index === 0 ? `(${pdfEscape(line)}) Tj` : `0 -24 Td (${pdfEscape(line)}) Tj`]), 'ET'].join('\n');
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = project.brochure;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
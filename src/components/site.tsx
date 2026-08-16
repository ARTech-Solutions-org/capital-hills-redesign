import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, CircleUserRound, Facebook, Heart, Instagram, Mail, Menu, MessageCircle, Phone, Send, X } from 'lucide-react';
import { type Project, formatPrice } from '@/data/projects';

export const CONTACT = {
  phone: '+20 100 555 0190',
  tel: 'tel:+201005550190',
  whatsapp: 'https://wa.me/201005550190?text=Hello%20Capital%20Hills%2C%20I%27d%20like%20to%20ask%20about%20a%20project.',
  email: 'mailto:hello@capitalhillsdevelopments.eg?subject=Capital%20Hills%20enquiry',
  sms: 'sms:+201005550190',
};

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`focus-ring flex items-center gap-2.5 ${light ? 'text-[#fbf3e6]' : 'text-[#56293a]'}`} data-testid="link-logo">
      <span className={`grid h-9 w-9 place-items-center rounded-full border ${light ? 'border-[#d9ad51]' : 'border-[#b88a36]'}`}>
        <span className="font-display text-xl leading-none text-[#c89b43]">C</span>
      </span>
      <span className="leading-none">
        <strong className="block text-[13px] font-bold tracking-[.08em]">CAPITAL HILLS</strong>
        <small className={`block pt-1 text-[8px] tracking-[.22em] ${light ? 'text-[#d9ad51]' : 'text-[#9c6f2b]'}`}>DEVELOPMENTS</small>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [['Projects', '/#projects'], ['Why us', '/why-us'], ['Contact', '/contact']];
  const darkHeader = location === '/' || location === '/contact' || location === '/why-us';
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-shell flex h-[76px] items-center justify-between">
        <Logo light={darkHeader} />
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map(([label, href]) => (
            <Link 
              key={href} 
              href={href} 
              className={`focus-ring text-[13px] font-semibold transition ${
                darkHeader ? 'text-[#f7eede]/80 hover:text-[#d9ad51]' : 'text-[#56293a]/80 hover:text-[#9b702c]'
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
            className={`focus-ring hidden items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold md:flex ${
              darkHeader ? 'border-[#e8cf9f]/40 text-[#fbf3e6]' : 'border-[#56293a]/30 text-[#56293a]'
            }`} 
            data-testid="link-header-call"
          >
            <Phone size={14} /> Talk to us
          </a>
          <button 
            onClick={() => setOpen(!open)} 
            className={`focus-ring grid h-10 w-10 place-items-center rounded-full border md:hidden ${
              darkHeader ? 'border-[#e8cf9f]/40 text-[#fbf3e6]' : 'border-[#56293a]/30 text-[#56293a]'
            }`} 
            aria-label="Open menu" 
            data-testid="button-open-menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {open && <div className="mx-3 rounded-2xl border border-[#ead8ba] bg-[#fbf3e6] p-4 shadow-xl md:hidden">
        {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-[#e6d7c0] px-3 py-3 text-sm font-semibold text-[#56293a]" data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}>{label}</Link>)}
        <a href={CONTACT.tel} className="flex items-center gap-2 px-3 pt-3 text-sm font-semibold text-[#56293a]" data-testid="link-mobile-call"><Phone size={15} /> Call a representative</a>
      </div>}
    </header>
  );
}

export function Footer() {
  return <footer className="bg-[#3c1d2a] pb-24 pt-14 text-[#f7eede] md:pb-12">
    <div className="container-shell grid gap-12 md:grid-cols-[1.4fr_.8fr_.8fr_1.2fr]">
      <div><Logo light /><p className="mt-5 max-w-xs text-sm leading-6 text-[#dbbfaa]">Homes with sound thinking behind them. For the way Egyptians actually live.</p><div className="mt-6 flex gap-3"><a href="https://instagram.com" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-[#b88a36]/50 text-[#d9ad51]" data-testid="link-footer-instagram"><Instagram size={15} /></a><a href="https://facebook.com" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-[#b88a36]/50 text-[#d9ad51]" data-testid="link-footer-facebook"><Facebook size={15} /></a></div></div>
      <div><p className="eyebrow mb-4">Explore</p><div className="space-y-3 text-sm text-[#dbbfaa]"><Link href="/#projects" data-testid="link-footer-projects">Our projects</Link><Link href="/why-us" className="block" data-testid="link-footer-why">Why Capital Hills</Link><Link href="/contact" className="block" data-testid="link-footer-contact">Contact us</Link></div></div>
      <div><p className="eyebrow mb-4">Visit</p><p className="text-sm leading-6 text-[#dbbfaa]">Building 12, South 90 Street<br />New Cairo, Cairo</p><p className="mt-3 text-sm text-[#dbbfaa]">Sat – Thu, 10am – 6pm</p></div>
      <div><p className="eyebrow mb-4">Need a second opinion?</p><p className="text-sm leading-6 text-[#dbbfaa]">Tell us what you are looking for. A real person will call with a clear answer.</p><a href={CONTACT.tel} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d9ad51]" data-testid="link-footer-phone"><Phone size={14} /> {CONTACT.phone}</a></div>
    </div>
    <div className="container-shell mt-12 border-t border-[#f7eede]/15 pt-5 text-xs text-[#b99582]">© 2026 Capital Hills Developments <span className="float-right">Built for better decisions.</span></div>
  </footer>;
}

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [notice, setNotice] = useState('');
  const actions = [{ label: 'Call', icon: Phone, href: CONTACT.tel }, { label: 'WhatsApp', icon: MessageCircle, href: CONTACT.whatsapp }, { label: 'Email', icon: Mail, href: CONTACT.email }, { label: 'SMS', icon: Send, href: CONTACT.sms }];
  const isHandset = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (open) return;
    const interval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % actions.length);
    }, 2000);
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
        <div role="status" className="absolute bottom-[70px] right-[70px] w-fit whitespace-nowrap rounded-md bg-[#3c1d2a] px-3 py-2 text-[11px] font-semibold text-[#fff8ea] shadow-lg">
          {notice}
        </div>
      )}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
        }`}
      >
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
            <span className="rounded-md bg-[#3c1d2a] px-3 py-1.5 text-xs font-bold text-[#fff8ea] shadow-lg transition-colors group-hover:bg-[#d9ad51] group-hover:text-[#3c1d2a]">
              {label}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#3c1d2a] text-[#d9ad51] shadow-lg transition-colors group-hover:bg-[#d9ad51] group-hover:text-[#3c1d2a]">
              <Icon size={20} strokeWidth={1.8} />
            </span>
          </a>
        ))}
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="focus-ring relative grid h-14 w-14 place-items-center rounded-full bg-[#d9ad51] text-[#3c1d2a] shadow-[0_12px_34px_rgba(61,15,20,.3)] transition-all hover:scale-105 active:scale-95"
        aria-label="Toggle contact options"
      >
        {open ? (
          <X size={24} className="animate-in spin-in-90 zoom-in-75 duration-300" />
        ) : (
          <ActiveIcon size={24} className="absolute animate-in fade-in zoom-in-75 duration-300" key={activeIconIndex} />
        )}
      </button>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState('');
  const prompts = ['What can I buy under EGP 3m?', 'Can I inspect this weekend?', 'Send me the New Cairo brochure'];
  return <div className="fixed bottom-[82px] right-4 z-40 md:bottom-20 md:right-6">
    {open && <div className="mb-3 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[#e1cda9] bg-[#fffaf1] shadow-[0_18px_50px_rgba(60,29,42,.18)]">
      <div className="bg-[#56293a] p-4 text-[#fbf3e6]"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><CircleUserRound size={22} className="text-[#d9ad51]" /><div><strong className="block text-sm">Capital Hills desk</strong><span className="text-[11px] text-[#dfc9be]">Usually replies in 5 minutes</span></div></div><button onClick={() => setOpen(false)} className="text-[#dfc9be]" aria-label="Close chat" data-testid="button-close-chat"><X size={17} /></button></div></div>
       <div className="space-y-3 p-4"><div className="rounded-xl rounded-tl-sm bg-[#f0e4d2] p-3 text-xs leading-5 text-[#56293a]">Hello. I can help you find a project, understand a payment plan, or arrange a visit.</div>{sent && <div className="ml-6 rounded-xl rounded-tr-sm bg-[#56293a] p-3 text-xs leading-5 text-[#fff7e9]">{sent}</div>}<div className="space-y-2">{prompts.map((prompt) => <button key={prompt} onClick={() => setSent(`“${prompt}” — thanks. A representative will follow up shortly.`)} className="block w-full rounded-lg border border-[#decbaa] px-3 py-2 text-left text-xs font-semibold text-[#56293a] transition hover:border-[#9b702c] hover:bg-[#f8eddd]" data-testid={`chat-prompt-${prompt.slice(0, 4).replace(' ', '-')}`}>{prompt}</button>)}</div><Link href="/contact" className="block pt-1 text-center text-xs font-bold text-[#9b702c]" data-testid="link-chat-contact">Prefer to talk to someone? →</Link></div>
    </div>}
    <button onClick={() => setOpen(!open)} className="focus-ring flex items-center gap-2 rounded-full bg-[#c49743] px-4 py-3 text-xs font-bold text-[#3c1d2a] shadow-lg transition hover:bg-[#d9ad51]" data-testid="button-open-chat"><MessageCircle size={17} /> {open ? 'Close desk' : 'Chat with us'}</button>
  </div>;
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
  return <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#e5d4b9] bg-[#fffaf1] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(61,15,20,.12)] ${featured ? 'md:col-span-2' : ''}`} data-testid={`card-project-${project.slug}`}>
    <Link href={`/projects/${project.slug}`} className="block relative" aria-label={`View ${project.name}`}>
      <div className={`relative overflow-hidden ${featured ? 'h-72 md:h-[390px]' : 'h-60'}`}><img src={project.gallery[0]} alt={`${project.name} exterior`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-gradient-to-t from-[#3c1d2a]/75 via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-[#fff8ea]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#56293a]">{project.city}</span><div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#fff8ea]"><div><p className="text-xs text-[#ecd9c2]">{project.location}</p><h3 className="mt-1 font-display text-2xl">{project.name}</h3></div><ArrowRight size={20} className="mb-1 transition group-hover:translate-x-1" /></div></div>
      <div className="grid grid-cols-2 gap-4 p-4"><div><p className="text-[10px] uppercase tracking-[.12em] text-[#8d756c]">From</p><p className="mt-1 text-sm font-bold text-[#56293a]">{formatPrice(project.startingPrice)}</p></div><div className="text-right"><p className="text-[10px] uppercase tracking-[.12em] text-[#8d756c]">Availability</p><p className="mt-1 text-sm font-bold text-[#56293a]">{project.availability}</p></div></div>
    </Link>
    <div className="mt-auto flex items-center justify-between border-t border-[#e5d4b9] px-4 py-3">
      <Link href={`/projects/${project.slug}`} className="text-[11px] font-bold uppercase tracking-[.13em] text-[#9b702c] transition hover:text-[#56293a]">View details</Link>
      <div className="flex gap-2">
        <a href={CONTACT.tel} aria-label="Call" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition hover:bg-[#56293a] hover:text-[#d9ad51]"><Phone size={14} /></a>
        <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4e8d6] text-[#9b702c] transition hover:bg-[#56293a] hover:text-[#d9ad51]"><MessageCircle size={14} /></a>
      </div>
    </div>
    <button onClick={toggleSave} aria-label={saved ? 'Remove from saved projects' : 'Save project'} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#fff8ea]/90 text-[#56293a] shadow-sm" data-testid={`button-save-${project.slug}`}><Heart size={16} fill={saved ? '#9b702c' : 'none'} className={saved ? 'text-[#9b702c]' : ''} /></button>
  </article>;
}

export function SectionHeading({ eyebrow, title, copy, light = false, centered = false }: { eyebrow: string; title: string; copy?: string; light?: boolean; centered?: boolean }) {
  return <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''} ${light ? 'text-[#fff7e9]' : 'text-[#56293a]'}`}><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">{title}</h2>{copy && <p className={`mt-4 max-w-lg text-sm leading-6 ${centered ? 'mx-auto' : ''} ${light ? 'text-[#dfc9be]' : 'text-[#735e57]'}`}>{copy}</p>}</div>;
}

export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="site-shell grain"><Header />{children}<Footer /><FloatingActions /></div>;
}

function pdfEscape(value: string) {
  return value.replace(/([\\()])/g, '\\$1');
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
  const stream = [
    'BT',
    '/F1 20 Tf',
    '72 760 Td',
    ...lines.flatMap((line, index) => [
      index === 0 ? `(${pdfEscape(line)}) Tj` : `0 -24 Td (${pdfEscape(line)}) Tj`,
    ]),
    'ET',
  ].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = project.brochure;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
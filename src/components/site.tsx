import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowRight, CalendarDays, Check, CircleUserRound,
  Facebook, Heart, Instagram, Mail, Menu, MessageCircle,
  Phone, Send, X, Download, MapPin
} from 'lucide-react';
import { type Project } from '@/data/projects';
import { FadeIn } from '@/components/animations';
import { useData } from '@/context/DataContext';

export function useContactInfo() {
  const { content } = useData();
  const phone = (content.hasOwnProperty('contact_phone') ? content['contact_phone'] : '16794');
  return {
    phone,
    tel: `tel:${phone}`,
    whatsapp: (content.hasOwnProperty('contact_whatsapp') ? content['contact_whatsapp'] : 'https://wa.me/201005550190?text=Hello%20Capital%20Hills'),
    email: content['contact_email'] ? `mailto:${content['contact_email']}` : 'mailto:hello@capitalhillsdevelopments.eg',
    sms: `sms:${phone}`,
    address: (content.hasOwnProperty('contact_address') ? content['contact_address'] : 'HQ: Galleria 40, Zayed | Downtown, New Cairo\nSales & Customer Service: Arkan Plaza, Zayed'),
    facebook: (content.hasOwnProperty('global_facebook_url') ? content['global_facebook_url'] : '#'),
    instagram: (content.hasOwnProperty('global_instagram_url') ? content['global_instagram_url'] : '#')
  };
}

export function PhoneNumber() {
  const { phone } = useContactInfo();
  if (phone === '16794') {
    return (
      <span className="whitespace-nowrap inline-flex items-baseline font-display tracking-tight">
        <span>16</span>
        <span className="text-[1.3em] font-medium leading-[0] mx-[1px] -translate-y-[2px]">7</span>
        <span>94</span>
      </span>
    );
  }
  return <span className="whitespace-nowrap inline-flex items-baseline font-display tracking-tight">{phone}</span>;
}

/**
 * Samples the average luminance of an image (0 = pure black, 1 = pure white).
 * `region` controls which slice of the image to sample:
 *   'bottom' → where the project name text overlays
 *   'top'    → where the city badge lives
 * Falls back to 'dark' (white text) on CORS or load errors.
 */
function useImageLuminance(src: string, region: 'top' | 'bottom' = 'bottom'): 'dark' | 'light' {
  const [tone, setTone] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    // Try anonymous CORS — Pexels and most CDNs allow it.
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const W = 80, H = 80;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Sample bottom 40 % or top 20 % of the image depending on region
        const [sy, sh] =
          region === 'bottom'
            ? [img.naturalHeight * 0.6, img.naturalHeight * 0.4]
            : [0, img.naturalHeight * 0.25];

        ctx.drawImage(img, 0, sy, img.naturalWidth, sh, 0, 0, W, H);
        const { data } = ctx.getImageData(0, 0, W, H);

        let total = 0;
        const pixels = W * H;
        for (let i = 0; i < data.length; i += 4) {
          // Perceived luminance (ITU-R BT.601)
          total += (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
        }
        // avg is 0-255; threshold at 128
        setTone(total / pixels < 128 ? 'dark' : 'light');
      } catch {
        setTone('dark'); // canvas blocked (CORS) → safe fallback
      }
    };

    img.onerror = () => setTone('dark');
    img.src = src.startsWith('http') ? src + (src.includes('?') ? '&' : '?') + 'c=1' : src;
  }, [src, region]);

  return tone;
}

export function Logo({
  light = false,
  variant = 'full',
  className = '',
}: {
  light?: boolean;
  variant?: 'full' | 'icon';
  className?: string;
}) {
  const { content } = useData();
  const fullSrc = light
    ? (content.hasOwnProperty('global_logo_full_light') ? content['global_logo_full_light'] : '/capital-hills-logo-full-light.png')
    : (content.hasOwnProperty('global_logo_full_maroon') ? content['global_logo_full_maroon'] : '/capital-hills-logo-full-maroon.png');
  const iconSrc = light
    ? (content.hasOwnProperty('global_logo_icon_light') ? content['global_logo_icon_light'] : '/capital-hills-icon-light.png')
    : (content.hasOwnProperty('global_logo_icon_maroon') ? content['global_logo_icon_maroon'] : '/capital-hills-icon-maroon.png');

  const src = variant === 'icon' ? iconSrc : fullSrc;
  const defaultClass =
    variant === 'icon'
      ? 'h-9 w-auto object-contain transition-all'
      : 'h-8 md:h-9 w-auto object-contain transition-all';

  return (
    <Link href="/" className="focus-ring block shrink-0" data-testid="link-logo">
      <img
        src={src}
        alt="Capital Hills Developments"
        className={className || defaultClass}
      />
    </Link>
  );
}

export function Header() {
  const { content } = useData();
  const contact = useContactInfo();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const nav = [['Home', '/'], ['Projects', '/projects'], ['About us', '/about-us'], ['Contact', '/contact']];
  const lightPage = location === '/' || location === '/contact' || location === '/about-us' || location === '/projects';

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
            ? 'bg-[#421319]/90 shadow-[0_8px_40px_rgba(60,29,42,.28)]'
            : lightPage
            ? 'bg-[#421319]/60'
            : 'bg-[#f5f2e9]/80 shadow-[0_2px_20px_rgba(75,30,44,.07)]'
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
                  ? 'text-[#f5f2e9]/75 hover:bg-white/10 hover:text-[#947e82]'
                  : 'text-[#421319]/70 hover:bg-[#421319]/08 hover:text-[#421319]'
              }`}
              data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={contact.tel}
            className={`focus-ring hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition md:flex ${
              scrolled || lightPage
                ? 'bg-[#947e82] text-[#421319] hover:bg-[#947e82]'
                : 'bg-[#421319] text-[#f5f2e9] hover:bg-[#421319]'
            }`}
            data-testid="link-header-call"
          >
            <Phone size={13} /> {(content.hasOwnProperty('global_header_talk') ? content['global_header_talk'] : 'Talk to us')}
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`focus-ring grid h-9 w-9 place-items-center rounded-full transition md:hidden ${
              scrolled || lightPage
                ? 'text-[#f5f2e9] hover:bg-white/10'
                : 'text-[#421319] hover:bg-[#421319]/10'
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
        <div className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-[#947e82]/30 bg-[#421319] shadow-xl md:hidden">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/10 px-5 py-4 text-sm font-semibold text-[#f5f2e9] last:border-0"
              data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}
            >
              {label}
            </Link>
          ))}
          <a
            href={contact.tel}
            className="flex items-center gap-2 px-5 py-4 text-sm font-bold text-[#947e82]"
            data-testid="link-mobile-call"
          >
            <Phone size={14} /> <PhoneNumber />
          </a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const contact = useContactInfo();
  const { content } = useData();
  const footerText = (content.hasOwnProperty('global_footer_text') ? content['global_footer_text'] : "Building communities that inspire. From prime commercial spaces to elegant residential developments, we deliver quality, trust, and lasting value.");
  return (
    <footer className="bg-[#421319] pb-24 pt-16 text-[#f5f2e9] md:pb-12">
      <div className="container-shell grid gap-12 md:grid-cols-[1.4fr_.8fr_.8fr_1.2fr]">
        <div>
          <Logo light variant="full" className="h-10 md:h-12 w-auto object-contain" />
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#947e82]">
            {footerText}
          </p>
          <div className="mt-6 flex gap-3">
            <a href={contact.instagram} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-[#250f12] text-white transition-colors hover:bg-[#493337]" data-testid="link-footer-instagram">
              <Instagram size={16} />
            </a>
            <a href={contact.facebook} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-[#250f12] text-white transition-colors hover:bg-[#493337]" data-testid="link-footer-facebook">
              <Facebook size={16} />
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-white mb-5">{(content.hasOwnProperty('global_footer_explore') ? content['global_footer_explore'] : 'Explore')}</p>
          <div className="space-y-3 text-sm text-[#947e82]">
            <Link href="/projects" className="block transition-colors hover:text-white" data-testid="link-footer-projects">Our projects</Link>
            <Link href="/about-us" className="block transition-colors hover:text-white" data-testid="link-footer-why">About Capital Hills</Link>
            <Link href="/contact" className="block transition-colors hover:text-white" data-testid="link-footer-contact">Contact us</Link>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-white mb-5">{(content.hasOwnProperty('global_footer_visit') ? content['global_footer_visit'] : 'Visit')}</p>
          <div className="space-y-4 text-sm leading-5 text-[#947e82]">
            <div className="whitespace-pre-line leading-relaxed">{contact.address}</div>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-white mb-5">{(content.hasOwnProperty('global_footer_need') ? content['global_footer_need'] : 'Need a second opinion?')}</p>
          <p className="text-sm leading-6 text-[#947e82]">{(content.hasOwnProperty('global_footer_need_desc') ? content['global_footer_need_desc'] : 'Tell us what you are looking for. A real person will call with a clear answer.')}</p>
          <a href={contact.tel} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5f2e9] px-5 py-3 text-sm font-bold text-[#231f20] transition-colors hover:bg-white" data-testid="link-footer-phone">
            <Phone size={14} /> <PhoneNumber />
          </a>
        </div>
      </div>
      <div className="container-shell mt-16 flex flex-col items-center justify-between border-t border-[#493337] pt-6 text-xs text-[#947e82] md:flex-row">
        <p>{(content.hasOwnProperty('global_footer_copy') ? content['global_footer_copy'] : '© 2026 Capital Hills Developments')}</p>
        <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
          <span>Powered by</span>
          <img src="/powered-by.png" alt="Powered by" className="h-6 w-auto object-contain" />
        </div>
        <p className="mt-2 md:mt-0">{(content.hasOwnProperty('global_footer_slogan') ? content['global_footer_slogan'] : 'Built for better decisions.')}</p>
      </div>
    </footer>
  );
}

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const contact = useContactInfo();
  const [saved, setSaved] = useState(() => localStorage.getItem('capital-hills-favourites')?.includes(project.slug) ?? false);

  // Analyse image brightness — pick text colour that guarantees contrast
  const bottomTone = useImageLuminance(project.gallery[0], 'bottom'); // for name overlay
  const topTone    = useImageLuminance(project.gallery[0], 'top');    // for city badge

  const bottomText = bottomTone === 'dark' ? 'text-[#f5f2e9]' : 'text-[#231f20]';
  const topText    = topTone    === 'dark' ? 'text-[#f5f2e9]' : 'text-[#231f20]';
  // Semi-transparent bg pill behind city so it's always readable regardless of tone
  const topBg      = topTone    === 'dark' ? 'bg-[#000]/25' : 'bg-[#fff]/40';

  const toggleSave = (event: React.MouseEvent) => {
    event.preventDefault();
    const current = JSON.parse(localStorage.getItem('capital-hills-favourites') || '[]') as string[];
    const next = current.includes(project.slug) ? current.filter((item) => item !== project.slug) : [...current, project.slug];
    localStorage.setItem('capital-hills-favourites', JSON.stringify(next));
    setSaved(next.includes(project.slug));
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden bg-[#947e82] transition duration-400 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(74,30,44,.15)] ${featured ? 'md:col-span-2' : ''}`}
      style={{ borderRadius: 16 }}
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
          {/* City badge — colour auto-set by top-region luminance */}
          <span className={`absolute left-3 top-3 md:left-4 md:top-4 ${topBg} backdrop-blur-md rounded-full px-3 py-1 md:px-4 md:py-1.5 font-mono text-[9px] md:text-[11px] font-bold uppercase tracking-widest ${topText}`}>
            {project.city}
          </span>
          {/* Save */}
          <button
            onClick={toggleSave}
            aria-label={saved ? 'Remove from saved' : 'Save project'}
            className="absolute right-3 top-3 md:right-4 md:top-4 z-10 grid h-8 w-8 md:h-10 md:w-10 place-items-center rounded-full bg-[#f5f2e9]/20 text-white backdrop-blur-sm transition hover:bg-[#f5f2e9]/40"
            data-testid={`button-save-${project.slug}`}
          >
            <Heart size={16} fill={saved ? '#947e82' : 'none'} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${saved ? 'text-[#947e82]' : ''}`} />
          </button>
          {/* Adaptive gradient — always toward the bottom text, using the image's own tone */}
          <div className={`absolute inset-x-0 bottom-0 h-3/5 ${
            bottomTone === 'dark'
              ? 'bg-gradient-to-t from-[#231f20]/90 to-transparent'
              : 'bg-gradient-to-t from-[#f5f2e9]/90 to-transparent'
          }`} />
          {/* Bottom text — colour auto-set by bottom-region luminance */}
          <div className={`absolute bottom-0 inset-x-0 p-5 md:p-6 ${bottomText}`}>
            <p className="text-xs md:text-sm font-semibold line-clamp-1 opacity-90 drop-shadow-md">{project.location}</p>
            <h3 className="mt-1 md:mt-2 font-display text-3xl md:text-4xl leading-tight drop-shadow-lg">{project.name}</h3>
          </div>
          {/* Hover reveal panel */}
          <div className="project-card-reveal absolute bottom-0 inset-x-0 bg-[#421319] px-5 py-4">
            <div className="flex items-center justify-between">
              {project.projectSpace && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-accent">Space</p>
                  <p className="mt-1 font-display text-xl text-[#f5f2e9]">{project.projectSpace}</p>
                </div>
              )}
              {project.delivery && (
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-accent">Delivery</p>
                  <p className="mt-1 text-sm font-bold text-[#f5f2e9]">{project.delivery}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex-1 text-center rounded-sm bg-[#947e82] py-2 text-xs font-bold text-[#421319]">View project →</span>
            </div>
          </div>
        </div>
      </Link>
      {/* Footer strip */}
      <div className="flex items-center justify-between border-t border-[#947e82]/50 bg-[#f5f2e9] px-4 py-3 md:px-5 md:py-4">
        <span className="font-mono text-[9px] md:text-[11px] font-bold uppercase tracking-[.2em] text-[#947e82] truncate max-w-[140px] md:max-w-[200px]">{project.product.split('(')[0]}</span>
        <div className="flex gap-2">
          <a href={contact.tel} aria-label="Call" className="grid h-8 w-8 md:h-9 md:w-9 place-items-center rounded-full bg-[#947e82] text-[#250f12] transition hover:bg-[#421319] hover:text-[#947e82]"><Phone size={14} className="w-3 md:w-3.5" /></a>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-8 w-8 md:h-9 md:w-9 place-items-center rounded-full bg-[#947e82] text-[#250f12] transition hover:bg-[#421319] hover:text-[#947e82]"><MessageCircle size={14} className="w-3 md:w-3.5" /></a>
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
  const contact = useContactInfo();
  const [open, setOpen] = useState(false);
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [notice, setNotice] = useState('');
  const actions = [
    { label: 'Call', icon: Phone, href: contact.tel },
    { label: 'WhatsApp', icon: MessageCircle, href: contact.whatsapp },
    { label: 'Email', icon: Mail, href: contact.email },
    { label: 'Direct Message', icon: Send, href: '/contact' },
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
      setNotice(`${label} is ready on mobile at ${contact.phone}.`);
      window.setTimeout(() => setNotice(''), 2600);
    }
  };

  const ActiveIcon = actions[activeIconIndex].icon;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {notice && (
        <div role="status" className="absolute bottom-[74px] right-[74px] w-fit whitespace-nowrap rounded-lg bg-[#421319] px-3 py-2 text-[11px] font-semibold text-[#f5f2e9] shadow-lg">
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
            <span className="rounded-lg bg-[#421319] px-3 py-1.5 text-xs font-bold text-[#f5f2e9] shadow-lg transition group-hover:bg-[#947e82] group-hover:text-[#421319]">
              {label}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#421319] text-[#947e82] shadow-lg transition group-hover:bg-[#947e82] group-hover:text-[#421319]">
              <Icon size={19} strokeWidth={1.8} />
            </span>
          </a>
        ))}
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="focus-ring relative grid h-13 w-13 place-items-center rounded-full bg-[#947e82] text-[#421319] shadow-[0_8px_30px_rgba(196,151,67,.45)] transition-all hover:scale-105 active:scale-95"
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
        <div className="mb-3 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[#947e82] bg-[#f5f2e9] shadow-[0_18px_50px_rgba(60,29,42,.18)]">
          <div className="bg-[#421319] p-4 text-[#f5f2e9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleUserRound size={22} className="text-[#947e82]" />
                <div>
                  <strong className="block text-sm">Capital Hills desk</strong>
                  <span className="text-[11px] text-[#f5f2e9]/50">Usually replies in 5 minutes</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#f5f2e9]/60 hover:text-[#f5f2e9] transition" aria-label="Close chat" data-testid="button-close-chat">
                <X size={17} />
              </button>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-xl rounded-tl-sm bg-[#f5f2e9] p-3 text-xs leading-5 text-[#421319]">
              Hello. I can help you find a project, understand a payment plan, or arrange a visit.
            </div>
            {sent && <div className="ml-6 rounded-xl rounded-tr-sm bg-[#421319] p-3 text-xs leading-5 text-[#f5f2e9]">{sent}</div>}
            <div className="space-y-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setSent(`"${prompt}" — thanks. A representative will follow up shortly.`)}
                  className="block w-full rounded-lg border border-[#947e82] px-3 py-2 text-left text-xs font-semibold text-[#421319] transition hover:border-[#947e82] hover:bg-[#f5f2e9]"
                  data-testid={`chat-prompt-${prompt.slice(0, 4).replace(' ', '-')}`}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <Link href="/contact" className="block pt-1 text-center text-xs font-bold text-[#947e82]" data-testid="link-chat-contact">
              Prefer to talk to someone? →
            </Link>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="focus-ring flex items-center gap-2 rounded-full bg-[#947e82] px-4 py-3 text-xs font-bold text-[#421319] shadow-lg transition hover:bg-[#947e82]" data-testid="button-open-chat">
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#421319]/90 p-5 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#947e82] p-7 md:p-9 shadow-2xl my-8">
        <button onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-lg bg-[#f5f2e9] text-[#421319] transition-colors hover:bg-[#421319] hover:text-[#f5f2e9]" aria-label="Close modal">
          <X size={18} />
        </button>
        <div className="flex items-center gap-2.5 mb-2">
          <img src="/capital-hills-icon-maroon.png" alt="" className="h-7 w-auto object-contain" />
          <span className="font-mono text-[9px] uppercase tracking-[.25em] text-[#947e82]">Capital Hills</span>
        </div>
        <h2 className="font-display text-3xl text-[#421319]">Book a private visit</h2>
        <p className="mt-2 text-sm leading-6 text-[#493337]">See {projectName} in your own time.</p>
        {visitSent ? (
          <div className="mt-8 rounded-xl bg-[#f5f2e9] p-7" data-testid="status-visit-success">
            <Check className="text-[#947e82]" size={26} />
            <h3 className="mt-4 font-display text-2xl text-[#421319]">Your visit request is with us.</h3>
            <p className="mt-2 text-sm leading-6 text-[#493337]">A Capital Hills representative will call shortly to confirm the details.</p>
            <button onClick={onClose} className="mt-6 w-full rounded-lg bg-[#421319] py-3 text-sm font-bold text-[#f5f2e9]">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#421319]">Your name</span>
              <input required name="name" autoComplete="name" className="w-full rounded-lg border border-[#947e82] bg-[#f5f2e9] px-4 py-3 text-sm outline-none focus:border-[#947e82]" placeholder="e.g. Mariam Hassan" data-testid="input-visit-name" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#421319]">Phone number</span>
                <input required type="tel" name="phone" autoComplete="tel" className="w-full rounded-lg border border-[#947e82] bg-[#f5f2e9] px-4 py-3 text-sm outline-none focus:border-[#947e82]" placeholder="+20..." data-testid="input-visit-phone" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#421319]">Preferred date</span>
                <input required type="date" name="date" min={new Date().toISOString().slice(0, 10)} className="w-full rounded-lg border border-[#947e82] bg-[#f5f2e9] px-4 py-3 text-sm outline-none focus:border-[#947e82]" data-testid="input-visit-date" />
              </label>
            </div>
            <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#421319] px-5 py-3 text-sm font-bold text-[#f5f2e9]" data-testid="button-submit-visit">
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

export function downloadBrochure(project: Project, phone: string = '16794') {
  const lines = [
    'Capital Hills Developments',
    project.name,
    '',
    project.description || '',
    '',
    `Space: ${project.projectSpace || 'N/A'}`,
    `Location: ${project.location}`,
    `Product: ${project.product}`,
    '',
    'Details',
    `Delivery: ${project.delivery || 'N/A'}`,
    '',
    `Contact: ${phone}`,
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
  anchor.download = `${project.slug}-brochure.pdf`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

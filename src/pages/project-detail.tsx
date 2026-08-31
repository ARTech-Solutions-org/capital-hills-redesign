import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Download, Heart, MapPin, MessageCircle, Share2, X } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { formatPrice, getProject, projects } from '@/data/projects';
import { CONTACT, ProjectCard, Shell, downloadBrochure, BookVisitModal } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = getProject(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [deposit, setDeposit] = useState(30);
  const [term, setTerm] = useState(12);
  const [shareMessage, setShareMessage] = useState('');
  const [compare, setCompare] = useState(projects.find((item) => item.slug !== slug)?.slug || projects[0].slug);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  useEffect(() => {
    if (!project) return;
    const current = JSON.parse(localStorage.getItem('capital-hills-favourites') || '[]') as string[];
    setSaved(current.includes(project.slug));
    setActiveImage(0);
    setQrFailed(false);
    setBookModalOpen(false);
  }, [project]);

  if (!project) {
    return (
      <Shell>
        <main className="container-shell flex min-h-[70dvh] items-center justify-center py-32">
          <div className="text-center">
            <p className="eyebrow">Project not found</p>
            <h1 className="mt-3 font-display text-4xl text-[#4a1e2c]">That home has moved on.</h1>
            <Link href="/#projects" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4a1e2c] px-5 py-3 text-sm font-bold text-[#fff8ea]" data-testid="link-not-found-projects">
              See all projects <ArrowRight size={15} />
            </Link>
          </div>
        </main>
      </Shell>
    );
  }

  const comparison = projects.find((item) => item.slug === compare) || projects.find((item) => item.slug !== project.slug) || projects[0];
  const monthly = Math.round((project.startingPrice * (1 - deposit / 100)) / term);
  const whatsappUrl = `https://wa.me/201005550190?text=${encodeURIComponent(`Hello Capital Hills, I am interested in ${project.name}.`)}`;

  const saveProject = () => {
    const current = JSON.parse(localStorage.getItem('capital-hills-favourites') || '[]') as string[];
    const next = current.includes(project.slug) ? current.filter((item) => item !== project.slug) : [...current, project.slug];
    localStorage.setItem('capital-hills-favourites', JSON.stringify(next));
    setSaved(next.includes(project.slug));
  };

  const shareProject = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: project.name, text: `Take a look at ${project.name} by Capital Hills.`, url });
        setShareMessage('Project shared');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareMessage('Link copied');
      } else {
        setShareMessage('Copy the page link from your browser to share');
      }
    } catch {
      setShareMessage('Share cancelled');
    }
    window.setTimeout(() => setShareMessage(''), 2400);
  };

  return (
    <Shell>
      <main className="pt-20 md:pt-24">
        {/* ── Breadcrumb ── */}
        <div className="container-shell py-5">
          <Link href="/#projects" className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.2em] text-[#9b702c]" data-testid="link-back-projects">
            <ArrowLeft size={12} /> All projects
          </Link>
        </div>

        {/* ── Main Layout: Article + Sticky Sidebar ── */}
        <div className="container-shell grid gap-10 pb-16 md:grid-cols-[1fr_380px] md:items-start">
          {/* ── LEFT: Article content ── */}
          <article>
            {/* Gallery */}
            <FadeIn>
              <div className="relative overflow-hidden rounded-2xl bg-[#eadbc4]" style={{ aspectRatio: '16/10' }}>
                <img
                  src={project.gallery[activeImage]}
                  alt={`${project.name} view ${activeImage + 1}`}
                  className="h-full w-full cursor-zoom-in object-cover transition duration-500"
                  onClick={() => setGalleryOpen(true)}
                  data-testid="img-project-hero"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#26131b]/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.15em] text-[#f6f0e4] backdrop-blur-sm">
                    {activeImage + 1} / {project.gallery.length}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveImage((activeImage - 1 + project.gallery.length) % project.gallery.length)} className="grid h-9 w-9 place-items-center rounded-full bg-[#26131b]/70 text-white backdrop-blur-sm" aria-label="Previous project image" data-testid="button-project-previous-image">
                      <ChevronLeft size={17} />
                    </button>
                    <button onClick={() => setActiveImage((activeImage + 1) % project.gallery.length)} className="grid h-9 w-9 place-items-center rounded-full bg-[#26131b]/70 text-white backdrop-blur-sm" aria-label="Next project image" data-testid="button-project-next-image">
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Project gallery thumbnails">
                {project.gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={`h-16 overflow-hidden rounded-lg border-2 transition ${activeImage === index ? 'border-[#9b702c]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    aria-label={`View project image ${index + 1}`}
                    data-testid={`button-gallery-thumbnail-${index}`}
                  >
                    <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Project heading (mobile only — sidebar shows on desktop) */}
            <div className="mt-8 md:hidden">
              <p className="eyebrow">Now welcoming reservations</p>
              <h1 className="mt-3 font-display text-4xl text-[#4a1e2c]">{project.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-[#735e57]">
                <MapPin size={13} className="text-[#9b702c]" /> {project.location}
              </p>
            </div>

            {/* Description */}
            <FadeIn delay={0.1} className="mt-10 border-t border-[#e5d4b9] pt-10">
              <p className="eyebrow">The essentials</p>
              <h2 className="mt-3 font-display text-3xl text-[#4a1e2c]">{project.highlight}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#735e57]">
                {project.description} Every home is delivered with a careful eye for light, storage, flow and the small rituals of daily life.
              </p>
              {/* Unit types */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#e5d4b9] py-6 sm:grid-cols-3">
                {project.unitTypes.map((unit) => (
                  <div key={unit}>
                    <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#967b70]">Available</p>
                    <p className="mt-1.5 text-sm font-bold text-[#4a1e2c]">{unit}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Payment plan */}
            <FadeIn delay={0.15} className="mt-10 rounded-2xl bg-[#eadbc4] p-6 md:p-8">
              <p className="eyebrow">Payment plan</p>
              <div className="mt-6 space-y-4">
                {project.paymentPlan.map((item, index) => (
                  <div key={item.label} className="flex items-end justify-between border-b border-[#cdb590] pb-4 last:border-0">
                    <span className="text-sm text-[#735e57]">{index + 1}. {item.label}</span>
                    <strong className="font-display text-2xl text-[#4a1e2c]">{item.value}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-[#f5ead9] p-4">
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#967b70]">Current offer</p>
                <p className="mt-1 text-sm font-bold text-[#4a1e2c]">{project.offer}</p>
              </div>
            </FadeIn>

            {/* Calculator */}
            <FadeIn delay={0.1} className="mt-10 border-t border-[#e5d4b9] pt-10">
              <p className="eyebrow">Plan it comfortably</p>
              <h3 className="mt-3 font-display text-2xl text-[#4a1e2c]">See what your monthly plan could look like.</h3>
              <p className="mt-2 text-sm text-[#735e57]">A quick guide, not a loan quote. We will confirm the full schedule with you.</p>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <label className="block">
                    <div className="flex justify-between text-sm font-bold text-[#4a1e2c]"><span>Initial deposit</span><span>{deposit}%</span></div>
                    <input type="range" min="10" max="50" step="5" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="mt-3 w-full accent-[#4a1e2c]" data-testid="input-calculator-deposit" />
                    <div className="mt-1 flex justify-between font-mono text-[9px] text-[#967b70]"><span>10%</span><span>50%</span></div>
                  </label>
                  <label className="block">
                    <div className="flex justify-between text-sm font-bold text-[#4a1e2c]"><span>Payment period</span><span>{term} months</span></div>
                    <input type="range" min="6" max="24" step="6" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="mt-3 w-full accent-[#4a1e2c]" data-testid="input-calculator-term" />
                    <div className="mt-1 flex justify-between font-mono text-[9px] text-[#967b70]"><span>6 months</span><span>24 months</span></div>
                  </label>
                </div>
                <div className="flex flex-col justify-between rounded-2xl bg-[#4a1e2c] p-6 text-[#fff8ea]">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#d9ad51]">Your estimate</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-[#dfc9be]">Deposit today</p>
                        <p className="mt-1 font-display text-2xl">{formatPrice(project.startingPrice * deposit / 100)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#dfc9be]">Then about</p>
                        <p className="mt-1 font-display text-2xl">{formatPrice(monthly)}<span className="font-sans text-[10px] text-[#dfc9be]"> / mo</span></p>
                      </div>
                    </div>
                  </div>
                  <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#c49743] px-4 py-2.5 text-sm font-bold text-[#3c1d2a]" data-testid="link-calculator-contact">
                    Talk through this plan <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Map + WhatsApp */}
            <FadeIn delay={0.1} className="mt-10 grid gap-6 border-t border-[#e5d4b9] pt-10 md:grid-cols-2">
              <div>
                <p className="eyebrow">On the map</p>
                <h3 className="mt-3 font-display text-2xl text-[#4a1e2c]">Come and see the exact place.</h3>
                <div className="mt-5 overflow-hidden rounded-2xl border border-[#e5d4b9]">
                  <iframe
                    title={`Google Map showing ${project.mapLocation}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(project.mapLocation)}&output=embed`}
                    className="h-56 w-full border-0 grayscale-[.15]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    data-testid="iframe-project-map"
                  />
                  <div className="flex items-center justify-between bg-[#fffaf1] px-4 py-3">
                    <p className="flex items-center gap-2 text-xs text-[#4a1e2c]"><MapPin size={12} className="text-[#9b702c]" />{project.mapLocation}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.mapLocation)}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#9b702c]" data-testid="link-open-map">Open ↗</a>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#e5d4b9] p-6">
                <p className="eyebrow">Have questions?</p>
                <h3 className="mt-3 font-display text-2xl text-[#4a1e2c]">Ask us on WhatsApp.</h3>
                <p className="mt-2 text-xs leading-5 text-[#735e57]">Scan to start a conversation about {project.name}.</p>
                <div className="mt-5 flex items-center gap-4">
                  {qrFailed
                    ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="grid h-28 w-28 place-items-center rounded-lg border border-[#e5d4b9] bg-[#f5ead9] p-3 text-center text-xs font-bold text-[#4a1e2c]" data-testid="qr-fallback">Open WhatsApp<br />to enquire</a>
                    : <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(whatsappUrl)}`} alt={`QR code to message Capital Hills about ${project.name}`} className="h-28 w-28 rounded-lg border border-[#e5d4b9] p-2" loading="lazy" onError={() => setQrFailed(true)} data-testid="img-whatsapp-qr" />
                  }
                  <div>
                    <p className="text-sm font-bold text-[#4a1e2c]">{CONTACT.phone}</p>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#9b702c]" data-testid="link-project-whatsapp">
                      <MessageCircle size={13} /> Open WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Compare */}
            <FadeIn delay={0.1} className="mt-10 rounded-2xl bg-[#eadbc4] p-6 border-t border-[#e5d4b9] md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow">Compare before you decide</p>
                  <h3 className="mt-2 font-display text-2xl text-[#4a1e2c]">A second option, side by side.</h3>
                </div>
                <select value={compare} onChange={(e) => setCompare(e.target.value)} aria-label="Choose a project to compare" className="rounded-lg border border-[#cdb590] bg-[#f8eddd] px-4 py-2.5 text-sm font-bold text-[#4a1e2c] outline-none" data-testid="select-compare-project">
                  {projects.filter((item) => item.slug !== project.slug).map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
                </select>
              </div>
              <div className="mt-6 grid overflow-hidden rounded-xl border border-[#cdb590] bg-[#f5ead9] md:grid-cols-2">
                <div className="grid grid-cols-2 border-b border-[#cdb590] md:border-b-0 md:border-r">
                  <div className="p-5"><p className="eyebrow text-[8px]">This project</p><h4 className="mt-2 font-display text-xl text-[#4a1e2c]">{project.name}</h4></div>
                  <div className="border-l border-[#cdb590] p-5"><p className="eyebrow text-[8px]">From</p><p className="mt-2 font-display text-xl text-[#4a1e2c]">{formatPrice(project.startingPrice)}</p></div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-5"><p className="eyebrow text-[8px]">Compare with</p><h4 className="mt-2 font-display text-xl text-[#4a1e2c]">{comparison.name}</h4></div>
                  <div className="border-l border-[#cdb590] p-5"><p className="eyebrow text-[8px]">From</p><p className="mt-2 font-display text-xl text-[#4a1e2c]">{formatPrice(comparison.startingPrice)}</p></div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-xs text-[#735e57] md:grid-cols-3">
                <p><strong className="text-[#4a1e2c]">Location:</strong> {project.city} vs {comparison.city}</p>
                <p><strong className="text-[#4a1e2c]">Availability:</strong> {project.availability} vs {comparison.availability}</p>
                <p><strong className="text-[#4a1e2c]">Handover:</strong> {project.handover} vs {comparison.handover}</p>
              </div>
            </FadeIn>

            {/* Related */}
            <section className="mt-16 border-t border-[#e5d4b9] pt-12">
              <p className="eyebrow">Keep looking</p>
              <h3 className="mt-3 font-display text-2xl text-[#4a1e2c]">There may be another good fit.</h3>
              <StaggerContainer className="mt-6 grid gap-5 md:grid-cols-2">
                {projects.filter((item) => item.slug !== project.slug).slice(0, 2).map((item) => (
                  <StaggerItem key={item.slug}><ProjectCard project={item} /></StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </article>

          {/* ── RIGHT: Sticky sidebar ── */}
          <aside className="hidden md:block">
            <div className="sticky top-28 rounded-2xl bg-[#4a1e2c] p-7 text-[#fff8ea]">
              <p className="eyebrow">Now welcoming reservations</p>
              <h1 className="mt-4 font-display text-4xl leading-tight">{project.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-[#dfc9be]">
                <MapPin size={13} className="text-[#d9ad51]" /> {project.location}
              </p>
              <p className="mt-5 text-sm leading-6 text-[#dfc9be]">{project.description}</p>
              <div className="mt-8 border-t border-[#f7eede]/20 pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#d9ad51]">Starting from</p>
                <p className="mt-2 font-display text-3xl">{formatPrice(project.startingPrice)}</p>
                <p className="mt-1.5 text-xs text-[#dfc9be]">{project.availability} · Handover {project.handover}</p>
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setBookModalOpen(true)} className="flex-1 rounded-lg bg-[#c49743] py-3 text-sm font-bold text-[#3c1d2a] transition hover:bg-[#d9ad51]" data-testid="button-book-visit">
                  Book a visit
                </button>
                <button onClick={saveProject} className="grid h-11 w-11 place-items-center rounded-lg border border-[#ead8ba]/40 transition hover:bg-white/10" aria-label={saved ? 'Remove saved project' : 'Save project'} data-testid="button-project-save">
                  <Heart size={17} fill={saved ? '#d9ad51' : 'none'} className={saved ? 'text-[#d9ad51]' : ''} />
                </button>
                <button onClick={shareProject} className="grid h-11 w-11 place-items-center rounded-lg border border-[#ead8ba]/40 transition hover:bg-white/10" aria-label="Share project" data-testid="button-project-share">
                  <Share2 size={16} />
                </button>
              </div>
              {shareMessage && <p role="status" className="mt-3 text-center text-xs text-[#d9ad51]" data-testid="status-share">{shareMessage}</p>}
              <button onClick={() => downloadBrochure(project)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#ead8ba]/40 py-2.5 text-xs font-bold text-[#f6f0e4] transition hover:bg-white/10" data-testid="button-download-brochure">
                <Download size={13} /> Download PDF brochure
              </button>
            </div>
          </aside>
        </div>
      </main>

      <BookVisitModal isOpen={bookModalOpen} onClose={() => setBookModalOpen(false)} projectName={project.name} />
      {galleryOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#3c1d2a]/95 p-5" role="dialog" aria-modal="true" aria-label={`${project.name} photo gallery`}>
          <button onClick={() => setGalleryOpen(false)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-lg bg-[#fff8ea] text-[#4a1e2c]" aria-label="Close gallery" data-testid="button-close-gallery">
            <X size={18} />
          </button>
          <img src={project.gallery[activeImage]} alt={`${project.name} enlarged`} className="max-h-[85vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </Shell>
  );
}
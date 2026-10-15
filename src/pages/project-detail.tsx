import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Download, Heart, MapPin, MessageCircle, Share2, X } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { getProject, projects } from '@/data/projects';
import { useContactInfo, ProjectCard, Shell, downloadBrochure, BookVisitModal, PhoneNumber } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useData } from '@/context/DataContext';

export default function ProjectDetail() {
  const contactInfo = useContactInfo();
  const { projects, t } = useData();

  const { slug } = useParams<{ slug: string }>();
  const project = projects.find(p => p.slug === slug) || getProject(slug);

  if (!project) {
    return <Shell><div className="pt-32 pb-32 text-center font-display text-2xl text-[#421319]">Project not found</div></Shell>;
  }
  const [saved, setSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [shareMessage, setShareMessage] = useState('');
  const [compare, setCompare] = useState(() => projects.find((item) => item.slug !== slug)?.slug || projects[0]?.slug || '');
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === 'ArrowRight') {
        setActiveImage((prev) => (prev + 1) % project.gallery.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImage((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
      } else if (e.key === 'Escape' && galleryOpen) {
        setGalleryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, galleryOpen]);

  if (!project) {
    return (
      <Shell>
        <main className="container-shell flex min-h-[70dvh] items-center justify-center py-32">
          <div className="text-center">
            <p className="eyebrow">Project not found</p>
            <h1 className="mt-3 font-display text-4xl text-[#421319]">That home has moved on.</h1>
            <Link href="/projects" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#421319] px-5 py-3 text-sm font-bold text-[#f5f2e9]" data-testid="link-not-found-projects">
              See all projects <ArrowRight size={15} />
            </Link>
          </div>
        </main>
      </Shell>
    );
  }

  const comparison = projects.find((item) => item.slug === compare) || projects.find((item) => item.slug !== project.slug) || projects[0] || project;
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
          <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.2em] text-[#947e82]" data-testid="link-back-projects">
            <ArrowLeft size={12} /> {t('All projects', 'جميع المشروعات')}
          </Link>
        </div>

        {/* ── Main Layout: Article + Sticky Sidebar ── */}
        <div className="container-shell grid gap-10 pb-16 md:grid-cols-[1fr_380px] md:items-start">
          {/* ── LEFT: Article content ── */}
          <article>
            {/* Gallery */}
            <FadeIn>
              <div className="relative overflow-hidden rounded-2xl bg-[#947e82]" style={{ aspectRatio: '16/10' }}>
                <img
                  src={project.gallery[activeImage]}
                  alt={`${project.name} view ${activeImage + 1}`}
                  className="h-full w-full cursor-zoom-in object-cover transition duration-500"
                  onClick={() => setGalleryOpen(true)}
                  data-testid="img-project-hero"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between pointer-events-none">
                  <span className="rounded-full bg-[#250f12]/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.15em] text-[#f5f2e9] backdrop-blur-sm pointer-events-auto">
                    {activeImage + 1} / {project.gallery.length}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage - 1 + project.gallery.length) % project.gallery.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-[#250f12]/50 text-white backdrop-blur-sm transition hover:bg-[#250f12]/80"
                  aria-label="Previous project image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage + 1) % project.gallery.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-[#250f12]/50 text-white backdrop-blur-sm transition hover:bg-[#250f12]/80"
                  aria-label="Next project image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              {/* Thumbnails */}
              <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Project gallery thumbnails">
                {project.gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={`h-16 overflow-hidden rounded-lg border-2 transition ${activeImage === index ? 'border-[#947e82]' : 'border-transparent opacity-60 hover:opacity-100'}`}
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
              <p className="eyebrow">{t('Now welcoming reservations', 'متاح الآن للحجز والاستعلام')}</p>
              <h1 className="mt-3 font-display text-4xl text-[#421319]">{project.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-[#493337]">
                <MapPin size={13} className="text-[#947e82]" /> {project.location}
              </p>
            </div>

            {/* Description */}
            <FadeIn delay={0.1} className="mt-10 border-t border-[#947e82] pt-10">
              <p className="eyebrow">{t('The essentials', 'المواصفات الأساسية')}</p>
              <h2 className="mt-3 font-display text-3xl text-[#421319]">{project.product.split('(')[0]}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#493337]">
                {project.location} {project.description && project.description}
              </p>
              {project.extraDetails && Object.keys(project.extraDetails).length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#947e82] py-6 sm:grid-cols-3">
                  {Object.entries(project.extraDetails).map(([key, value]) => (
                    <div key={key}>
                      <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#493337]">{key}</p>
                      <p className="mt-1.5 text-sm font-bold text-[#421319]">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </FadeIn>

            {/* Project Details */}
            <FadeIn delay={0.15} className="mt-10 rounded-2xl bg-[#947e82] p-6 md:p-8">
              <p className="eyebrow">{t('Project Details', 'تفاصيل المشروع')}</p>
              <div className="mt-6 space-y-4">
                {project.projectSpace && (
                  <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between border-b border-[#947e82] pb-4 md:gap-4">
                    <span className="text-sm text-[#421319]/70 shrink-0">{t('Space', 'المساحة')}</span>
                    <strong className="font-display text-xl text-[#421319] text-left md:text-right">{project.projectSpace}</strong>
                  </div>
                )}
                {project.construction && (
                  <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between border-b border-[#947e82] pb-4 md:gap-4">
                    <span className="text-sm text-[#421319]/70 shrink-0">{t('Construction', 'نسبة الإنشاءات')}</span>
                    <strong className="font-display text-xl text-[#421319] text-left md:text-right">{project.construction}</strong>
                  </div>
                )}
                {project.product && (
                  <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between border-b border-[#947e82] pb-4 md:gap-4">
                    <span className="text-sm text-[#421319]/70 shrink-0">{t('Product', 'نوع العقار')}</span>
                    <strong className="font-display text-xl text-[#421319] text-left md:text-right">{project.product.split('(')[0]}</strong>
                  </div>
                )}
                {project.finishing && (
                  <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between border-b border-[#947e82] pb-4 md:gap-4">
                    <span className="text-sm text-[#421319]/70 shrink-0">{t('Finishing', 'التشطيب')}</span>
                    <strong className="font-display text-xl text-[#421319] text-left md:text-right">{project.finishing.split(',')[0]}</strong>
                  </div>
                )}
              </div>
              {project.delivery && (
                <div className="mt-5 rounded-xl bg-[#f5f2e9] p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#421319]/60">{t('Delivery', 'موعد الاستلام')}</p>
                  <p className="mt-1 text-sm font-bold text-[#421319]">{project.delivery}</p>
                </div>
              )}
            </FadeIn>

            {/* Map + WhatsApp */}
            <FadeIn delay={0.1} className="mt-10 grid gap-6 border-t border-[#947e82] pt-10 md:grid-cols-2">
              <div>
                <p className="eyebrow">{t('On the map', 'الموقع الجغرافي')}</p>
                <h3 className="mt-3 font-display text-2xl text-[#421319]">{t('Come and see the exact place.', 'تعرّف على موقع المشروع بدقة على الخريطة.')}</h3>
                <div className="mt-5 overflow-hidden rounded-2xl border border-[#947e82]">
                  <iframe
                    title={`Google Map showing ${project.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${project.name}, ${project.city}`)}&output=embed`}
                    className="h-56 w-full border-0 grayscale-[.15]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    data-testid="iframe-project-map"
                  />
                  <div className="flex items-center justify-between bg-[#f5f2e9] px-4 py-3">
                    <p className="flex items-center gap-2 text-xs text-[#421319]"><MapPin size={12} className="text-[#947e82]" />{project.city}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.name}, ${project.city}`)}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#947e82]" data-testid="link-open-map">{t('Open ↗', 'فتح الخريطة ↗')}</a>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#947e82] p-6">
                <p className="eyebrow">{t('Have questions?', 'هل لديك استفسار؟')}</p>
                <h3 className="mt-3 font-display text-2xl text-[#421319]">{t('Ask us on WhatsApp.', 'تواصل معنا مباشرة عبر واتساب.')}</h3>
                <p className="mt-2 text-xs leading-5 text-[#493337]/80">{t('Scan to start a conversation about', 'امسح الرمز لبدء محادثة فورية حول')} {project.name}.</p>
                <div className="mt-5 flex items-center gap-4">
                  {qrFailed
                    ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="grid h-28 w-28 place-items-center rounded-lg border border-[#947e82] bg-[#f5f2e9] p-3 text-center text-xs font-bold text-[#421319]" data-testid="qr-fallback">{t('Open WhatsApp to enquire', 'فتح واتساب للاستفسار')}</a>
                    : <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(whatsappUrl)}`} alt={`QR code to message Capital Hills about ${project.name}`} className="h-28 w-28 rounded-lg border border-[#947e82] p-2" loading="lazy" onError={() => setQrFailed(true)} data-testid="img-whatsapp-qr" />
                  }
                  <div>
                    <p className="text-sm font-bold text-[#421319]"><PhoneNumber /></p>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#947e82]" data-testid="link-project-whatsapp">
                      <MessageCircle size={13} /> {t('Open WhatsApp', 'تواصل عبر واتساب')}
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Compare */}
            <FadeIn delay={0.1} className="mt-10 rounded-2xl bg-[#947e82] p-6 border-t border-[#947e82] md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow">{t('Compare before you decide', 'قارن قبل اتخاذ القرار')}</p>
                  <h3 className="mt-2 font-display text-2xl text-[#421319]">{t('A second option, side by side.', 'مقارنة مباشرة بين مشروعين جنباً إلى جنب.')}</h3>
                </div>
                <select value={compare} onChange={(e) => setCompare(e.target.value)} aria-label="Choose a project to compare" className="rounded-lg border border-[#947e82] bg-[#f5f2e9] px-4 py-2.5 text-sm font-bold text-[#421319] outline-none" data-testid="select-compare-project">
                  {projects.filter((item) => item.slug !== project.slug).map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
                </select>
              </div>
              <div className="mt-6 grid overflow-hidden rounded-xl border border-[#947e82] bg-[#f5f2e9] md:grid-cols-2">
                <div className="grid grid-cols-2 border-b border-[#947e82] md:border-b-0 md:border-r">
                  <div className="p-5"><p className="eyebrow text-[8px]">{t('This project', 'هذا المشروع')}</p><h4 className="mt-2 font-display text-xl text-[#421319]">{project.name}</h4></div>
                  <div className="border-l border-[#947e82] p-5"><p className="eyebrow text-[8px]">{t('Space', 'المساحة')}</p><p className="mt-2 font-display text-xl text-[#421319]">{project.projectSpace ?? '—'}</p></div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-5"><p className="eyebrow text-[8px]">{t('Compare with', 'المشروع المقارن')}</p><h4 className="mt-2 font-display text-xl text-[#421319]">{comparison.name}</h4></div>
                  <div className="border-l border-[#947e82] p-5"><p className="eyebrow text-[8px]">{t('Space', 'المساحة')}</p><p className="mt-2 font-display text-xl text-[#421319]">{comparison.projectSpace ?? '—'}</p></div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-xs text-[#493337] md:grid-cols-3">
                <p><strong className="text-[#421319]">{t('Location:', 'المدينة:')}</strong> {project.city} {t('vs', 'مقابل')} {comparison.city}</p>
                <p><strong className="text-[#421319]">{t('Product:', 'نوع العقار:')}</strong> {project.product.split('(')[0]} {t('vs', 'مقابل')} {comparison.product.split('(')[0]}</p>
                {(project.delivery || comparison.delivery) && (
                  <p><strong className="text-[#421319]">{t('Delivery:', 'الاستلام:')}</strong> {project.delivery ?? '—'} {t('vs', 'مقابل')} {comparison.delivery ?? '—'}</p>
                )}
              </div>
            </FadeIn>

            {/* Related */}
            <section className="mt-16 border-t border-[#947e82] pt-12">
              <p className="eyebrow">{t('Keep looking', 'اكتشف المزيد')}</p>
              <h3 className="mt-3 font-display text-2xl text-[#421319]">{t('There may be another good fit.', 'مشروعات أخرى متميزة قد تهمك.')}</h3>
              <StaggerContainer className="mt-6 grid gap-5 md:grid-cols-2">
                {projects.filter((item) => item.slug !== project.slug).slice(0, 2).map((item) => (
                  <StaggerItem key={item.slug}><ProjectCard project={item} /></StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </article>

          {/* ── RIGHT: Sticky sidebar ── */}
          <aside className="hidden md:block">
            <div className="sticky top-28 rounded-2xl bg-[#421319] p-7 text-[#f5f2e9]">
              <p className="eyebrow text-[#947e82]">{t('Now welcoming reservations', 'متاح الآن للحجز والاستعلام')}</p>
              <h1 className="mt-4 font-display text-4xl leading-tight text-[#f5f2e9]">{project.name}</h1>
              <p className="mt-3 flex items-start gap-2 text-sm text-[#f5f2e9]/60 leading-5">
                <MapPin size={13} className="text-[#947e82] mt-0.5 shrink-0" /> {project.location}
              </p>
              {project.description && (
                <p className="mt-5 text-sm leading-6 text-[#f5f2e9]/60">{project.description}</p>
              )}
              <div className="mt-8 border-t border-[#f5f2e9]/10 pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#947e82]">{t('Space', 'المساحة')}</p>
                <p className="mt-2 font-display text-2xl text-[#f5f2e9]">{project.projectSpace}</p>
                <p className="mt-1.5 text-xs text-[#f5f2e9]/50">{project.product.split('(')[0]}{project.delivery ? ` · ${t('Delivery', 'الاستلام')} ${project.delivery}` : ''}</p>
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setBookModalOpen(true)} className="flex-1 rounded-lg bg-[#947e82] py-3 text-sm font-bold text-[#231f20] transition hover:opacity-90" data-testid="button-book-visit">
                  {t('Book a visit', 'احجز زيارة')}
                </button>
                <button onClick={saveProject} className="grid h-11 w-11 place-items-center rounded-lg border border-[#f5f2e9]/20 text-[#f5f2e9] transition hover:bg-white/10" aria-label={saved ? 'Remove saved project' : 'Save project'} data-testid="button-project-save">
                  <Heart size={17} fill={saved ? '#947e82' : 'none'} className={saved ? 'text-[#947e82]' : 'text-[#f5f2e9]'} />
                </button>
                <button onClick={shareProject} className="grid h-11 w-11 place-items-center rounded-lg border border-[#f5f2e9]/20 text-[#f5f2e9] transition hover:bg-white/10" aria-label="Share project" data-testid="button-project-share">
                  <Share2 size={16} />
                </button>
              </div>
              {shareMessage && <p role="status" className="mt-3 text-center text-xs text-[#947e82]" data-testid="status-share">{shareMessage}</p>}
              <button onClick={() => downloadBrochure(project)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#f5f2e9]/20 py-2.5 text-xs font-bold text-[#f5f2e9] transition hover:bg-white/10" data-testid="button-download-brochure">
                <Download size={13} /> {t('Download PDF brochure', 'تحميل بروشور المشروع PDF')}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <BookVisitModal isOpen={bookModalOpen} onClose={() => setBookModalOpen(false)} projectName={project.name} />
      {galleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#421319]/95 p-5" role="dialog" aria-modal="true" aria-label={`${project.name} photo gallery`}>
          <button onClick={() => setGalleryOpen(false)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-lg bg-[#f5f2e9] text-[#421319]" aria-label="Close gallery" data-testid="button-close-gallery">
            <X size={18} />
          </button>
          <button onClick={() => setActiveImage((activeImage - 1 + project.gallery.length) % project.gallery.length)} className="absolute left-5 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-[#f5f2e9]/10 text-white transition hover:bg-[#f5f2e9]/20" aria-label="Previous image">
            <ChevronLeft size={24} />
          </button>
          <img src={project.gallery[activeImage]} alt={`${project.name} enlarged`} className="max-h-[85vh] max-w-full rounded-xl object-contain" />
          <button onClick={() => setActiveImage((activeImage + 1) % project.gallery.length)} className="absolute right-5 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-[#f5f2e9]/10 text-white transition hover:bg-[#f5f2e9]/20" aria-label="Next image">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </Shell>
  );
}

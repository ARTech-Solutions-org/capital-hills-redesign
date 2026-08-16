import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Download, Heart, MapPin, MessageCircle, Share2, X } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { formatPrice, getProject, projects } from '@/data/projects';
import { CONTACT, ProjectCard, SectionHeading, Shell, downloadBrochure } from '@/components/site';

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

  useEffect(() => {
    if (!project) return;
    const current = JSON.parse(localStorage.getItem('capital-hills-favourites') || '[]') as string[];
    setSaved(current.includes(project.slug));
    setActiveImage(0);
    setQrFailed(false);
  }, [project]);

  if (!project) {
    return (
      <Shell>
        <main className="container-shell flex min-h-[70dvh] items-center justify-center py-32">
          <div className="text-center">
            <p className="eyebrow">Project not found</p>
            <h1 className="mt-3 font-display text-4xl text-[#56293a]">That home has moved on.</h1>
            <Link href="/#projects" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#56293a] px-5 py-3 text-sm font-bold text-[#fff8ea]" data-testid="link-not-found-projects">See all projects <ArrowRight size={15} /></Link>
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
      <main className="pt-[76px]">
        <div className="container-shell py-5">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-xs font-bold text-[#8e6c3a]" data-testid="link-back-projects"><ArrowLeft size={14} /> All projects</Link>
        </div>

        <section className="container-shell grid gap-5 pb-12 md:grid-cols-[1.35fr_.65fr]">
          <div>
            <div className="relative h-[390px] overflow-hidden rounded-2xl bg-[#eadbc4] md:h-[570px]">
              <img src={project.gallery[activeImage]} alt={`${project.name} view ${activeImage + 1}`} className="h-full w-full cursor-zoom-in object-cover" onClick={() => setGalleryOpen(true)} data-testid="img-project-hero" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <span className="rounded-full bg-[#fff8ea]/90 px-3 py-1.5 text-xs font-bold text-[#56293a]">{activeImage + 1} / {project.gallery.length}</span>
                <div className="flex gap-2">
                  <button onClick={() => setActiveImage((activeImage - 1 + project.gallery.length) % project.gallery.length)} className="grid h-9 w-9 place-items-center rounded-full bg-[#fff8ea]/90 text-[#56293a]" aria-label="Previous project image" data-testid="button-project-previous-image"><ChevronLeft size={17} /></button>
                  <button onClick={() => setActiveImage((activeImage + 1) % project.gallery.length)} className="grid h-9 w-9 place-items-center rounded-full bg-[#fff8ea]/90 text-[#56293a]" aria-label="Next project image" data-testid="button-project-next-image"><ChevronRight size={17} /></button>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Project gallery thumbnails">
              {project.gallery.map((image, index) => (
                <button key={image} onClick={() => setActiveImage(index)} className={`h-16 overflow-hidden rounded-md border-2 ${activeImage === index ? 'border-[#9b702c]' : 'border-transparent opacity-65 hover:opacity-100'}`} aria-label={`View project image ${index + 1}`} data-testid={`button-gallery-thumbnail-${index}`}>
                  <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-[#56293a] p-7 text-[#fff8ea] md:p-9">
            <div>
              <p className="eyebrow">Now welcoming reservations</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.02]">{project.name}</h1>
              <p className="mt-4 flex items-center gap-2 text-sm text-[#dfc9be]"><MapPin size={15} className="text-[#d9ad51]" /> {project.location}</p>
              <p className="mt-8 text-sm leading-6 text-[#dfc9be]">{project.description}</p>
            </div>
            <div className="mt-12 border-t border-[#f7eede]/20 pt-5">
              <p className="text-xs uppercase tracking-[.12em] text-[#d9ad51]">Starting from</p>
              <p className="mt-1 font-display text-3xl">{formatPrice(project.startingPrice)}</p>
              <p className="mt-2 text-xs text-[#dfc9be]">{project.availability} · Handover {project.handover}</p>
              <div className="mt-6 flex gap-2">
                <Link href="/contact" className="flex-1 rounded-md bg-[#c49743] px-4 py-3 text-center text-sm font-bold text-[#3c1d2a]" data-testid="link-project-inquire">Ask about this home</Link>
                <button onClick={saveProject} className="grid h-11 w-11 place-items-center rounded-md border border-[#ead8ba]/40" aria-label={saved ? 'Remove saved project' : 'Save project'} data-testid="button-project-save"><Heart size={18} fill={saved ? '#d9ad51' : 'none'} className={saved ? 'text-[#d9ad51]' : ''} /></button>
                <button onClick={shareProject} className="grid h-11 w-11 place-items-center rounded-md border border-[#ead8ba]/40" aria-label="Share project" data-testid="button-project-share"><Share2 size={17} /></button>
              </div>
              {shareMessage && <p role="status" className="mt-3 text-center text-xs text-[#d9ad51]" data-testid="status-share">{shareMessage}</p>}
            </div>
          </div>
        </section>

        <section className="container-shell grid gap-12 border-t border-[#e5d4b9] py-16 md:grid-cols-[1.15fr_.85fr] md:py-24">
          <div>
            <SectionHeading eyebrow="The essentials" title={project.highlight} copy="The things you will want to know before you book a viewing." />
            <div className="mt-8 grid grid-cols-2 gap-5 border-y border-[#e5d4b9] py-6 md:grid-cols-3">
              {project.unitTypes.map((unit) => <div key={unit}><p className="text-[10px] uppercase tracking-[.12em] text-[#967b70]">Available</p><p className="mt-2 text-sm font-bold text-[#56293a]">{unit}</p></div>)}
            </div>
            <div className="mt-8"><h3 className="font-display text-2xl text-[#56293a]">A plan that gives you room</h3><p className="mt-3 max-w-xl text-sm leading-7 text-[#735e57]">{project.description} Every home is delivered with a careful eye for light, storage, flow and the small rituals of daily life.</p></div>
          </div>
          <div className="rounded-2xl bg-[#eadbc4] p-6">
            <p className="eyebrow">Payment plan</p>
            <div className="mt-7 space-y-5">{project.paymentPlan.map((item, index) => <div key={item.label} className="flex items-end justify-between border-b border-[#cdb590] pb-4 last:border-0"><span className="text-sm text-[#735e57]">{index + 1}. {item.label}</span><strong className="font-display text-2xl text-[#56293a]">{item.value}</strong></div>)}</div>
            <div className="mt-5 rounded-xl bg-[#f5ead9] p-4"><p className="text-xs text-[#735e57]">Current offer</p><p className="mt-1 text-sm font-bold text-[#56293a]">{project.offer}</p></div>
            <button onClick={() => downloadBrochure(project)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-[#ad8340] py-3 text-sm font-bold text-[#56293a]" data-testid="button-download-brochure"><Download size={15} /> Download PDF brochure</button>
          </div>
        </section>

        <section className="bg-[#f1e6d6] py-16 md:py-24">
          <div className="container-shell grid gap-10 md:grid-cols-[.9fr_1.1fr]">
            <div>
              <SectionHeading eyebrow="Plan it comfortably" title="See what your monthly plan could look like." copy="A quick guide, not a loan quote. We will confirm the full schedule with you." />
              <div className="mt-8 space-y-7">
                <label className="block"><div className="flex justify-between text-sm font-bold text-[#56293a]"><span>Initial deposit</span><span>{deposit}%</span></div><input type="range" min="10" max="50" step="5" value={deposit} onChange={(event) => setDeposit(Number(event.target.value))} className="mt-3 w-full accent-[#56293a]" data-testid="input-calculator-deposit" /><div className="mt-1 flex justify-between text-[10px] text-[#967b70]"><span>10%</span><span>50%</span></div></label>
                <label className="block"><div className="flex justify-between text-sm font-bold text-[#56293a]"><span>Payment period</span><span>{term} months</span></div><input type="range" min="6" max="24" step="6" value={term} onChange={(event) => setTerm(Number(event.target.value))} className="mt-3 w-full accent-[#56293a]" data-testid="input-calculator-term" /><div className="mt-1 flex justify-between text-[10px] text-[#967b70]"><span>6 months</span><span>24 months</span></div></label>
              </div>
            </div>
            <div className="rounded-2xl bg-[#56293a] p-7 text-[#fff8ea] md:p-10">
              <p className="text-xs uppercase tracking-[.13em] text-[#d9ad51]">Your estimate</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2"><div><p className="text-xs text-[#dfc9be]">Deposit today</p><p className="mt-2 font-display text-3xl">{formatPrice(project.startingPrice * deposit / 100)}</p></div><div><p className="text-xs text-[#dfc9be]">Then about</p><p className="mt-2 font-display text-3xl">{formatPrice(monthly)}<span className="font-sans text-xs text-[#dfc9be]"> / month</span></p></div></div>
              <div className="mt-10 border-t border-[#f7eede]/20 pt-5 text-sm text-[#dfc9be]"><p className="flex items-center gap-2"><Check size={15} className="text-[#d9ad51]" /> No hidden calculator fees</p><p className="mt-3 flex items-center gap-2"><Check size={15} className="text-[#d9ad51]" /> A representative will confirm your plan</p></div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#c49743] px-5 py-3 text-sm font-bold text-[#3c1d2a]" data-testid="link-calculator-contact">Talk through this plan <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>

        <section className="container-shell py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeading eyebrow="On the map" title="Come and see the exact place." copy="The pin is precise. We would rather you visit the street, see the approach and ask every question in person." />
              <div className="mt-8 overflow-hidden rounded-2xl border border-[#e5d4b9] bg-[#eadbc4]">
                <iframe title={`Google Map showing ${project.mapLocation}`} src={`https://www.google.com/maps?q=${encodeURIComponent(project.mapLocation)}&output=embed`} className="h-[280px] w-full border-0 grayscale-[.2]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" data-testid="iframe-project-map" />
                <div className="flex items-center justify-between p-4"><p className="flex items-center gap-2 text-sm font-bold text-[#56293a]"><MapPin size={15} className="text-[#9b702c]" /> {project.mapLocation}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.mapLocation)}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#9b702c]" data-testid="link-open-map">Open map ↗</a></div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#e5d4b9] p-6 md:p-8">
              <p className="eyebrow">Bring someone along</p><h3 className="mt-4 font-display text-3xl text-[#56293a]">Share this home with your family.</h3><p className="mt-3 text-sm leading-6 text-[#735e57]">Scan to start a WhatsApp conversation about {project.name}.</p>
              <div className="mt-8 flex items-center gap-5">
                {qrFailed ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="grid h-32 w-32 place-items-center border border-[#e5d4b9] bg-[#f5ead9] p-3 text-center text-xs font-bold text-[#56293a]" data-testid="qr-fallback">Open WhatsApp<br />to enquire</a> : <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(whatsappUrl)}`} alt={`QR code to message Capital Hills about ${project.name}`} className="h-32 w-32 rounded-md border border-[#e5d4b9] p-2" loading="lazy" onError={() => setQrFailed(true)} data-testid="img-whatsapp-qr" />}
                <div><p className="text-sm font-bold text-[#56293a]">{CONTACT.phone}</p><p className="mt-1 text-xs leading-5 text-[#735e57]">Or use the WhatsApp button on this page. A member of our team will reply.</p><a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#9b702c]" data-testid="link-project-whatsapp"><MessageCircle size={14} /> Open WhatsApp</a></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eadbc4] py-16 md:py-24">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="Compare before you decide" title="A second option, side by side." copy="Select another Capital Hills project to see the differences at a glance." /><select value={compare} onChange={(event) => setCompare(event.target.value)} aria-label="Choose a project to compare" className="rounded-md border border-[#cdb590] bg-[#f8eddd] px-4 py-3 text-sm font-bold text-[#56293a] outline-none" data-testid="select-compare-project">{projects.filter((item) => item.slug !== project.slug).map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></div>
            <div className="mt-8 grid overflow-hidden rounded-2xl border border-[#cdb590] bg-[#f5ead9] md:grid-cols-[1fr_1fr]"><div className="grid grid-cols-[1fr_1fr] border-b border-[#cdb590] md:border-b-0 md:border-r"><div className="p-5"><p className="eyebrow">This project</p><h3 className="mt-3 font-display text-2xl text-[#56293a]">{project.name}</h3></div><div className="border-l border-[#cdb590] p-5"><p className="eyebrow">Starting from</p><p className="mt-4 font-display text-2xl text-[#56293a]">{formatPrice(project.startingPrice)}</p></div></div><div className="grid grid-cols-[1fr_1fr]"><div className="p-5"><p className="eyebrow">Compare with</p><h3 className="mt-3 font-display text-2xl text-[#56293a]">{comparison.name}</h3></div><div className="border-l border-[#cdb590] p-5"><p className="eyebrow">Starting from</p><p className="mt-4 font-display text-2xl text-[#56293a]">{formatPrice(comparison.startingPrice)}</p></div></div></div>
            <div className="mt-4 grid gap-3 text-sm text-[#735e57] md:grid-cols-3"><p><strong className="text-[#56293a]">Location:</strong> {project.city} vs {comparison.city}</p><p><strong className="text-[#56293a]">Homes left:</strong> {project.availability} vs {comparison.availability}</p><p><strong className="text-[#56293a]">Handover:</strong> {project.handover} vs {comparison.handover}</p></div>
          </div>
        </section>

        <section className="container-shell py-16 md:py-24"><SectionHeading eyebrow="Keep looking" title="There may be another good fit." /><div className="mt-8 grid gap-5 md:grid-cols-2">{projects.filter((item) => item.slug !== project.slug).slice(0, 2).map((item) => <ProjectCard key={item.slug} project={item} />)}</div></section>
      </main>
      {galleryOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#3c1d2a]/90 p-5" role="dialog" aria-modal="true" aria-label={`${project.name} photo gallery`}><button onClick={() => setGalleryOpen(false)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-md bg-[#fff8ea] text-[#56293a]" aria-label="Close gallery" data-testid="button-close-gallery"><X size={18} /></button><img src={project.gallery[activeImage]} alt={`${project.name} enlarged`} className="max-h-[85vh] max-w-full rounded-xl object-contain" /></div>}
    </Shell>
  );
}
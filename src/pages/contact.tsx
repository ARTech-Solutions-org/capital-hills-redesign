import { type FormEvent, useState } from 'react';
import { ArrowRight, Check, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { Link } from 'wouter';
import { useContactInfo, Shell, PhoneNumber } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useData } from '@/context/DataContext';

export default function Contact() {
  const contactInfo = useContactInfo();
  const { content, t } = useData();
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };
    try {
      const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const API_URL = isDev ? 'http://localhost:3001/api' : '/api';
      await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setSent(true);
    } catch (e) {
      alert("Failed to send message, please try again.");
    }
  };

  return (
    <Shell>
      <main className="min-h-[100dvh] md:grid md:grid-cols-[420px_1fr] lg:grid-cols-[480px_1fr]">
        {/* ── Left sticky panel ── */}
        <aside className="relative overflow-hidden bg-[#421319] text-[#f5f2e9] md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          {/* Watermark Logo (Emblem without wordmark) */}
          <div className="absolute right-[-15%] bottom-[5%] w-[450px] opacity-[0.035] pointer-events-none">
            <img src="/capital-hills-icon-light.png" alt="" className="w-full h-auto" />
          </div>
          <div className="relative z-10 flex flex-col justify-between p-8 pt-28 md:h-full md:p-12 md:pt-32">
            <div>
              <FadeIn>
                <p className="eyebrow">{content['contact_eyebrow'] || 'A real person is close by'}</p>
                <h1 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
                  {content['contact_title_1'] || "Let's make the"}<br />
                  <span className="italic text-[#947e82]">{content['contact_title_2'] || 'next step feel simple.'}</span>
                </h1>
                <p className="mt-6 text-sm leading-7 text-[#f5f2e9]/60">
                  {content['contact_desc'] || 'Call, message, or book a quiet walk-through. Tell us what you are considering and we will bring useful answers.'}
                </p>
              </FadeIn>

              {/* Contact options */}
              <StaggerContainer className="mt-10 space-y-3">
                <StaggerItem>
                  <a
                    href={content['contact_phone'] ? `tel:${content['contact_phone']}` : contactInfo.tel}
                    className="flex items-center gap-4 rounded-xl bg-[#947e82] px-5 py-4 text-[#421319] transition hover:bg-[#947e82]"
                    data-testid="contact-call-card"
                  >
                    <Phone size={18} strokeWidth={1.8} className="shrink-0" />
                    <div>
                      <strong className="block text-sm font-bold">{content['contact_call_label'] || 'Call us'}</strong>
                      <span className="text-xs opacity-75">
                        {content['contact_phone'] ? (
                          <span dir="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
                            {content['contact_phone']}
                          </span>
                        ) : (
                          <PhoneNumber />
                        )}
                      </span>
                    </div>
                    <ArrowRight size={15} className="ml-auto opacity-60 rtl:rotate-180" />
                  </a>
                </StaggerItem>
                <StaggerItem>
                  <a
                    href={content['contact_whatsapp'] || contactInfo.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-[#f5f2e9]/15 px-5 py-4 transition hover:bg-white/08"
                    data-testid="contact-whatsapp-card"
                  >
                    <MessageCircle size={18} strokeWidth={1.8} className="shrink-0 text-[#947e82]" />
                    <div>
                      <strong className="block text-sm font-bold">{content['contact_whatsapp_label'] || 'WhatsApp'}</strong>
                      <span className="text-xs text-[#f5f2e9]/55">{content['contact_whatsapp_desc'] || 'Chat with our team'}</span>
                    </div>
                    <ArrowRight size={15} className="ml-auto opacity-40 rtl:rotate-180" />
                  </a>
                </StaggerItem>
                <StaggerItem>
                  <a
                    href={content['contact_email'] ? `mailto:${content['contact_email']}` : contactInfo.email}
                    className="flex items-center gap-4 rounded-xl border border-[#f5f2e9]/15 px-5 py-4 transition hover:bg-white/08"
                    data-testid="contact-email-card"
                  >
                    <Mail size={18} strokeWidth={1.8} className="shrink-0 text-[#947e82]" />
                    <div>
                      <strong className="block text-sm font-bold">{content['contact_email_label'] || 'Email'}</strong>
                      <span className="text-xs text-[#f5f2e9]/55">{content['contact_email'] || 'hello@capitalhillsdevelopments.eg'}</span>
                    </div>
                    <ArrowRight size={15} className="ml-auto opacity-40 rtl:rotate-180" />
                  </a>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </aside>

        {/* ── Right: Form ── */}
        <div className="bg-[#f5f2e9] px-8 py-16 md:px-16 md:py-24">
          <FadeIn className="mx-auto max-w-xl">
            <p className="eyebrow">{content['contact_form_eyebrow'] || 'Have a quick question?'}</p>
            <h2 className="mt-4 font-display text-3xl text-[#421319] md:text-4xl">{content['contact_form_title'] || 'We can start there.'}</h2>
            <p className="mt-3 text-sm leading-6 text-[#493337]">
              {content['contact_form_desc'] || 'No forms that go into a black hole. Leave your number and a sentence, and a member of our team will call.'}
            </p>

            {sent ? (
              <div className="mt-10 rounded-2xl bg-[#947e82] p-8" data-testid="status-question-success">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#947e82]">
                  <Check className="text-[#421319]" size={22} />
                </div>
                <h3 className="mt-5 font-display text-2xl text-[#421319]">{t('Message received.', 'تم استلام رسالتك بنجاح.')}</h3>
                <p className="mt-2 text-sm leading-5 text-[#493337]">{t('We will be in touch with a clear answer soon.', 'سنتواصل معك في أقرب وقت بتفاصيل وافية.')}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block font-mono text-[9px] uppercase tracking-[.2em] text-[#493337]">{t('Name', 'الاسم بالكامل')}</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#947e82] bg-[#f5f2e9] px-4 py-3.5 text-sm outline-none transition focus:border-[#947e82]"
                    placeholder={t('Your name', 'اكتب اسمك بالكامل')}
                    data-testid="input-question-name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[9px] uppercase tracking-[.2em] text-[#493337]">{t('Mobile Number', 'رقم الهاتف / الموبايل')}</span>
                  <input
                    required
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-[#947e82] bg-[#f5f2e9] px-4 py-3.5 text-sm outline-none transition focus:border-[#947e82]"
                    placeholder={t('Your mobile number', 'رقم هاتفك للتواصل')}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[9px] uppercase tracking-[.2em] text-[#493337]">{t('Email Address', 'البريد الإلكتروني')}</span>
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#947e82] bg-[#f5f2e9] px-4 py-3.5 text-sm outline-none transition focus:border-[#947e82]"
                    placeholder={t('Your email address', 'بريدك الإلكتروني')}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[9px] uppercase tracking-[.2em] text-[#493337]">{t('What can we help with?', 'كيف يمكننا مساعدتك؟')}</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full resize-none rounded-xl border border-[#947e82] bg-[#f5f2e9] px-4 py-3.5 text-sm outline-none transition focus:border-[#947e82]"
                    placeholder={t('I would like to understand...', 'أود الاستفسار بخصوص...')}
                    data-testid="textarea-question"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#421319] px-7 py-3.5 text-sm font-bold text-[#f5f2e9] transition hover:bg-[#421319]"
                  data-testid="button-submit-question"
                >
                  <Send size={14} /> {t('Send inquiry', 'إرسال الاستفسار')}
                </button>
              </form>
            )}

            {/* Map section below form */}
            <div className="mt-16 border-t border-[#947e82] pt-12">
              <p className="eyebrow mb-6">{t('Find us', 'مقرنا الرئيسي')}</p>
              <div className="overflow-hidden rounded-2xl border border-[#947e82]">
                <iframe
                  title="Capital Hills Developments HQ"
                  src={content['contact_map_url'] || "https://www.google.com/maps?q=Galleria+40,+Sheikh+Zayed,+Egypt&output=embed"}
                  className="h-64 w-full border-0 grayscale-[.15]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex items-center justify-between bg-[#f5f2e9] px-4 py-3">
                  <p className="flex items-center gap-4 text-sm text-[#421319]">
                    <MapPin size={14} className="text-[#947e82] shrink-0" /> <span className="whitespace-pre-line font-medium leading-relaxed">{contactInfo.address}</span>
                  </p>
                  <Link href="/projects" className="text-xs font-bold text-[#947e82]" data-testid="link-contact-projects">
                    {t('Browse projects →', 'تصفح المشروعات ←')}
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

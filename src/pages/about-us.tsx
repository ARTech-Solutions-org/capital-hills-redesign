import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Shell } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useData } from '@/context/DataContext';

const defaultCoreValues = [
  {
    title: 'CUSTOMER FOCUS',
    titleAr: 'التركيز على العميل',
    copy: 'Placing our clients interests at the center of every decision and action.',
    copyAr: 'وضع مصالح وتطلعات عملائنا في صميم كل قرار وإجراء نتخذه.'
  },
  {
    title: 'TRANSPARENCY',
    titleAr: 'الشفافية المطلقة',
    copy: 'Building long-term trust through clarity, integrity and open communication.',
    copyAr: 'بناء ثقة طويلة الأمد قائمة على الصدق والنزاهة والتواصل المستمر والواضح.'
  },
  {
    title: 'COMMITMENT',
    titleAr: 'الالتزام الصارم',
    copy: 'Honoring our promises with consistency, reliability and excellence in execution time.',
    copyAr: 'الوفاء بوعودنا بثبات ودقة متناهية وتميز مشهود في مواعيد التنفيذ والتسليم.'
  },
  {
    title: 'INNOVATION',
    titleAr: 'الابتكار المستمر',
    copy: 'Leveraging modern solutions and creative thinking to elevate living, working and investment experiences.',
    copyAr: 'تبني الحلول الهندسية المتطورة والفكر الإبداعي للارتقاء بتجارب المعيشة والعمل والاستثمار.'
  },
  {
    title: 'DIVERSITY',
    titleAr: 'التنوع والشمولية',
    copy: 'Fostering inclusive communities that embrace different needs, preferences and lifestyles.',
    copyAr: 'تأسيس مجتمعات نابضة تحتضن مختلف الاحتياجات والتفضيلات وأنماط الحياة العصرية.'
  },
];

const defaultCategories = [
  {
    key: 'LIVING',
    title: 'LIVING',
    titleAr: 'السكن',
    subtitle: 'Residential Developments',
    subtitleAr: 'المشروعات السكنية',
    desc: 'Lifestyle driven communities thoughtfully designed to blend comfort, beauty and convenience.',
    descAr: 'مجتمعات ترتقي بأسلوب الحياة صُممت بعناية لتجمع بين الراحة والجمال والخصوصية والهدوء.'
  },
  {
    key: 'WORKING',
    title: 'WORKING',
    titleAr: 'الأعمال',
    subtitle: 'Commercial Developments',
    subtitleAr: 'المشروعات التجارية والإدارية',
    desc: 'Strategic business destinations offering prime visibility, seamless accessibility and long-term value.',
    descAr: 'وجهات أعمال استراتيجية توفر أعلى درجات الظهور وسهولة الوصول وقيمة استثمارية متصاعدة.'
  },
  {
    key: 'TOGETHER',
    title: 'TOGETHER',
    titleAr: 'مجتمعات متكاملة',
    subtitle: 'Mixed-Use Projects',
    subtitleAr: 'المشروعات متعددة الاستخدامات',
    desc: 'Integrated destinations that combine retail, offices, medical facilities and leisure spaces to create dynamic hubs of modern living and working.',
    descAr: 'وجهات متكاملة تجمع بين المحلات التجارية والمكاتب والعيادات الطبية والأنشطة الترفيهية لتشكل مراكز نابضة بالحياة العصرية.'
  }
];

export default function AboutUs() {
  const { content, t, lang } = useData();

  return (
    <Shell>
      <main>
        {/* ── Slide 1: WHAT DEFINES US ── */}
        <section className="relative flex flex-col justify-end overflow-hidden bg-[#250f12] px-8 py-20 pt-36 text-[#f5f2e9] md:px-16 md:pt-32 min-h-[90vh]">
          <div className="absolute inset-0 z-0">
            <img
              src={content['aboutus_hero_bg'] || content['AboutUs_hero_bg'] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=2000"}
              alt={content['aboutus_hero_title'] || content['AboutUs_hero_title'] || t('WHAT DEFINES US', 'ما يميّزنا')}
              className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#250f12] via-[#250f12]/80 to-transparent" />
            
            {/* Circular cut-out with emblem */}
            <div className="absolute right-[-10%] top-[20%] w-[800px] opacity-[0.05] pointer-events-none">
              <img src="/capital-hills-icon-light.png" alt="" className="w-full h-auto" />
            </div>
          </div>
          <FadeIn className="relative z-10 max-w-3xl">
            <h1 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-[clamp(3rem,5vw,4.5rem)] text-[#f5f2e9]">
              {content['aboutus_hero_title'] || content['AboutUs_hero_title'] || t('WHAT DEFINES US', 'ما يميّزنا')}
            </h1>
            <p className="mt-7 text-base leading-7 text-[#f5f2e9]/80 font-sans">
              {content['aboutus_hero_desc_1'] || content['AboutUs_hero_desc_1'] || t(
                "Since 2017, we have been shaping Cairo's landscape by connecting East and West through developments that merge modern architecture with practical functionality and a clear understanding of our clients' aspirations. Every project we deliver is guided by a commitment to long-term value, serving as an investment for our clients while enriching the wider community.",
                "منذ عام 2017، نسهم في تشكيل ملامح القاهرة بربط شرقها بغربها عبر مشاريع تطويرية تدمج بين الهندسة المعمارية الحديثة والوظيفة العملية والفهم العميق لتطلعات عملائنا. كل مشروع نطلقه يقوده التزام راسخ بالقيمة طويلة المدى، ليكون استثماراً ناجحاً لعملائنا ورافداً غنياً للمجتمع بأكمله."
              )}
            </p>
            <p className="mt-5 text-base leading-7 text-[#f5f2e9]/80 font-sans">
              {content['aboutus_hero_desc_2'] || content['AboutUs_hero_desc_2'] || t(
                "From dynamic commercial hubs that drive business growth to lifestyle-focused residential spaces that elevate everyday living, our portfolio reflects a vision of progress, innovation, and sustainability. At Capital Hills Developments, we don't just build for today — we build for generations to come.",
                "من مراكز تجارية نابضة تدفع عجلة نمو الأعمال إلى مساحات سكنية راقية ترتقي بنمط الحياة اليومي، تعكس محفظتنا رؤية واضحة للتقدم والابتكار والاستدامة. في كابيتال هيلز للتطوير العقاري، نحن لا نبني لليوم فقط — بل نبني لأجيال المستقبل."
              )}
            </p>
          </FadeIn>
        </section>

        {/* ── Slide 2: CORE VALUES ── */}
        <section className="py-20 md:py-32 bg-[#421319] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] bg-white rounded-full blur-[100px]" />
          </div>
          <div className="container-shell relative z-10">
            <FadeIn>
              <h2 className="font-display text-3xl md:text-4xl text-[#f5f2e9] mb-12 border-b border-[#f5f2e9]/20 pb-4">
                {content['aboutus_core_title'] || content['AboutUs_core_title'] || t('CORE VALUES', 'قيمنا الجوهرية')}
              </h2>
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {(() => {
                  let list: any[] = [];
                  try {
                    const raw = content['aboutus_core_list'] || content['AboutUs_core_list'];
                    if (raw) list = JSON.parse(raw);
                  } catch (e) {}

                  if (!list || list.length === 0) {
                    list = defaultCoreValues.map(v => ({
                      title: lang === 'ar' ? v.titleAr : v.title,
                      copy: lang === 'ar' ? v.copyAr : v.copy
                    }));
                  }
                  return list;
                })().map((v: any, i: number) => {
                  const match = defaultCoreValues.find(
                    d => d.title.toLowerCase() === (v.title || '').trim().toLowerCase() || d.titleAr === (v.title || '').trim()
                  );
                  const displayTitle = lang === 'ar' ? (v.titleAr || (match ? match.titleAr : v.title)) : (v.title || (match ? match.title : ''));
                  const displayCopy = lang === 'ar' ? (v.copyAr || (match ? match.copyAr : v.copy)) : (v.copy || (match ? match.copy : ''));

                  return (
                    <StaggerItem key={v.title || i}>
                      <h3 className="font-sans font-bold text-lg text-[#947e82] mb-3">{displayTitle}</h3>
                      <p className="text-sm leading-6 text-[#f5f2e9]/80 font-sans">{displayCopy}</p>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </FadeIn>
          </div>
        </section>

        {/* ── Slide 3 & 4: THIS IS OURS ── */}
        <section className="py-24 md:py-40 bg-[#f5f2e9] relative">
          <div className="container-shell">
            <FadeIn className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl text-[#421319]">
                <span className="block font-sans font-medium">
                  {content['aboutus_story_title_1'] || content['AboutUs_story_title_1'] || t('Every Story', 'لكل قصة')}
                </span>
                <span className="block font-display italic text-[#947e82] text-3xl mt-2 mb-2">
                  {content['aboutus_story_title_2'] || content['AboutUs_story_title_2'] || t('has', 'لها')}
                </span>
                <span className="block font-mono">
                  {content['aboutus_story_title_3'] || content['AboutUs_story_title_3'] || t('A Start.', 'بداية.')}
                </span>
              </h2>
            </FadeIn>

            <FadeIn>
              <h2 className="font-sans text-5xl md:text-7xl font-light tracking-tighter text-[#421319] opacity-20 mb-8 uppercase">
                {content['aboutus_story_eyebrow'] || content['AboutUs_story_eyebrow'] || t('THIS IS OURS', 'هذه حكايتنا')}
              </h2>
              <div className="max-w-4xl border-l-2 border-[#947e82] pl-8 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-8">
                <p className="font-sans font-bold text-lg md:text-xl text-[#421319] mb-8 font-display">
                  {content['aboutus_story_highlight'] || content['AboutUs_story_highlight'] || t('WITH TOTAL INVESTMENTS EXCEEDING EGP 100 BILLION', 'بإجمالي استثمارات يتجاوز 100 مليار جنيه مصري')}
                </p>
                <div className="space-y-6 text-[#493337] text-base md:text-lg leading-relaxed font-sans">
                  <p>
                    {content['aboutus_story_p1'] || content['AboutUs_story_p1'] || t(
                      'Long before Capital Hills was established, the foundations were already in place.',
                      'قبل تأسيس كابيتال هيلز بوقت طويل، كانت الأسس والقواعد الصلبة قد شُيّدت بالفعل على أرض الواقع.'
                    )}
                  </p>
                  <p>
                    {content['aboutus_story_p2'] || content['AboutUs_story_p2'] || t(
                      'Since 2017, the company delivered standalone buildings across Hadayek October and 6th of October, focused on solid construction and reliable execution.',
                      'منذ عام 2017، قدمت الشركة مباني مستقلة في حدائق أكتوبر ومدينة 6 أكتوبر، مع التركيز التام على متانة البناء والمصداقية ودقة التنفيذ.'
                    )}
                  </p>
                  <p>
                    {content['aboutus_story_p3'] || content['AboutUs_story_p3'] || t(
                      'In 2020, this experience evolved into Capital Hills Developments, marking the shift from individual projects to large-scale, mixed-use destinations. Today, Capital Hills continues to build integrated developments that support modern living, business growth, and long-term value.',
                      'في عام 2020، تبلورت هذه الخبرات المتراكمة لتنطلق كابيتال هيلز للتطوير العقاري، مؤذنة بالتحول من المشروعات الفردية إلى وجهات كبرى متعددة الاستخدامات. واليوم تواصل كابيتال هيلز بناء مجتمعات تدعم الحياة العصرية، وتدفع نمو الأعمال، وتضمن قيمة ممتدة عبر الزمن.'
                    )}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Slide 5 & 6: MISSION & VISION ── */}
        <section className="grid md:grid-cols-2 min-h-[60vh]">
          {/* Mission */}
          <div className="bg-[#421319] p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
            <FadeIn className="relative z-10">
              <h2 className="font-display text-4xl text-[#947e82] mb-6">
                {content['aboutus_mission_title'] || content['AboutUs_mission_title'] || t('The Path We Build', 'مسارنا الذي نشيّده')}
              </h2>
              <p className="text-lg leading-relaxed text-[#f5f2e9] font-sans">
                {content['aboutus_mission_desc'] || content['AboutUs_mission_desc'] || t(
                  'We build integrated communities and deliver real, measurable returns on every investment on time, every time, with a personal relationship behind every deal.',
                  'نبني مجتمعات متكاملة ونحقق عوائد استثمارية حقيقية وملموسة في مواعيدها المحددة بكل دقة، مع الحفاظ على علاقة إنسانية ومهنية وراء كل صفقة.'
                )}
              </p>
              <p className="mt-12 font-mono text-xs uppercase tracking-widest text-[#f5f2e9]/50 text-center">
                {content['aboutus_slogan'] || content['AboutUs_slogan'] || t('Invest With Trust / Grow With Community', 'استثمر بثقة / انمو مع المجتمع')}
              </p>
            </FadeIn>
          </div>

          {/* Vision */}
          <div className="bg-[#f5f2e9] p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
            <FadeIn className="relative z-10">
              <h2 className="font-display text-4xl text-[#421319] mb-6">
                {content['aboutus_vision_title'] || content['AboutUs_vision_title'] || t('The World We See', 'رؤيتنا للعالم')}
              </h2>
              <p className="text-lg leading-relaxed text-[#493337] font-sans">
                {content['aboutus_vision_desc'] || content['AboutUs_vision_desc'] || t(
                  'To be a trusted real estate partner, creating communities and investment opportunities that deliver lasting value.',
                  'أن نكون الشريك العقاري الأكثر موثوقية، عبر تأسيس مجتمعات متناغمة وخلق فرص استثمارية توفر قيمة دائمة.'
                )}
              </p>
              <p className="mt-12 font-mono text-xs uppercase tracking-widest text-[#493337]/50 text-center">
                {content['aboutus_slogan'] || content['AboutUs_slogan'] || t('Invest With Trust / Grow With Community', 'استثمر بثقة / انمو مع المجتمع')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ── Slide 7: LIVING / WORKING / TOGETHER ── */}
        <section className="py-24 bg-[#493337]">
          <div className="container-shell">
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {(() => {
                  let list: any[] = [];
                  try {
                    const raw = content['aboutus_categories_list'] || content['AboutUs_categories_list'];
                    if (raw) list = JSON.parse(raw);
                  } catch (e) {}

                  if (!list || list.length === 0) {
                    list = defaultCategories.map(c => ({
                      title: lang === 'ar' ? c.titleAr : c.title,
                      subtitle: lang === 'ar' ? c.subtitleAr : c.subtitle,
                      desc: lang === 'ar' ? c.descAr : c.desc,
                    }));
                  }
                  return list;
                })().map((cat: any, i: number) => {
                  const match = defaultCategories.find(
                    c => c.key.toLowerCase() === (cat.title || '').trim().toLowerCase() ||
                         c.titleAr === (cat.title || '').trim() ||
                         c.title.toLowerCase() === (cat.title || '').trim().toLowerCase()
                  );
                  const displayTitle = lang === 'ar' ? (cat.titleAr || (match ? match.titleAr : cat.title)) : (cat.title || (match ? match.title : ''));
                  const displaySubtitle = lang === 'ar' ? (cat.subtitleAr || (match ? match.subtitleAr : cat.subtitle)) : (cat.subtitle || (match ? match.subtitle : ''));
                  const displayDesc = lang === 'ar' ? (cat.descAr || (match ? match.descAr : cat.desc)) : (cat.desc || (match ? match.desc : ''));

                  return (
                    <div
                      key={i}
                      className={`bg-[#f5f2e9] p-8 rounded-xl shadow-xl transform ${
                        i === 0
                          ? 'md:-translate-y-8'
                          : i === 1
                          ? 'md:translate-y-8'
                          : 'md:col-span-2 md:w-2/3 md:mx-auto md:translate-y-4'
                      }`}
                    >
                      <h3 className="font-display text-3xl text-[#421319] mb-2">{displayTitle}</h3>
                      <p className="font-mono text-xs text-[#947e82] mb-4 uppercase tracking-widest">{displaySubtitle}</p>
                      <p className="text-[#493337] font-sans leading-relaxed">{displayDesc}</p>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#947e82] py-24">
          <FadeIn className="container-shell text-center max-w-2xl mx-auto">
            <p className="eyebrow text-[#421319]">
              {content['aboutus_cta_eyebrow'] || content['AboutUs_cta_eyebrow'] || t("Ready to see what we've built?", "جاهز لتكتشف ما شيدناه؟")}
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[#421319] md:text-5xl">
              {content['aboutus_cta_title'] || content['AboutUs_cta_title'] || t("Browse our latest projects.", "استعرض أحدث مشروعاتنا.")}
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-[#421319] px-7 py-3.5 text-sm font-bold text-[#f5f2e9] transition hover:bg-[#250f12]"
              >
                {t('View projects', 'عرض المشروعات')} <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-[#421319]/30 px-7 py-3.5 text-sm font-bold text-[#421319] transition hover:bg-[#421319]/10"
              >
                {t('Contact us', 'اتصل بنا')}
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>
    </Shell>
  );
}

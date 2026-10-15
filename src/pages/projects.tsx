import { useMemo, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { projects } from '@/data/projects';
import { ProjectCard, Shell } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useData } from '@/context/DataContext';

export default function Projects() {
  const { projects: allProjects, t } = useData();

  const [cityFilter, setCityFilter] = useState('all');

  const filtered = useMemo(
    () => allProjects.filter((p) => cityFilter === 'all' || p.city === cityFilter),
    [cityFilter, allProjects]
  );

  const cities = ['all', ...Array.from(new Set(allProjects.map((p) => p.city)))];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Shell>
      <main className="min-h-screen bg-[#f5f2e9] pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <FadeIn>
              <p className="eyebrow">{t('Find your footing', 'اختر وجهتك المثالية')}</p>
              <h1 className="mt-3 font-display text-4xl leading-tight text-[#421319] md:text-6xl">
                {t('Projects built', 'مشروعات صُممت')}<br />{t('for real life.', 'لحياة حقيقية متكاملة.')}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="flex flex-wrap gap-2">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCityFilter(c)}
                    className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[.15em] transition ${
                      cityFilter === c
                        ? 'bg-[#421319] text-[#f5f2e9]'
                        : 'border border-[#421319]/20 text-[#493337] hover:border-[#421319]/50 hover:text-[#421319]'
                    }`}
                  >
                    {c === 'all' ? t('All cities', 'جميع المدن') : c}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>

          {filtered.length > 0 ? (
            <StaggerContainer key={cityFilter} className="mt-12 grid gap-6 md:grid-cols-3">
              {filtered.map((project, index) => (
                <StaggerItem
                  key={project.slug}
                  className={index === 0 && filtered.length > 1 && cityFilter === 'all' ? 'md:col-span-2' : ''}
                >
                  <ProjectCard project={project} featured={index === 0 && filtered.length > 1 && cityFilter === 'all'} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-[#947e82] p-12 text-center">
              <p className="font-display text-2xl text-[#421319]">{t('Nothing in that city yet.', 'لا توجد مشروعات في هذه المدينة حالياً.')}</p>
              <p className="mt-2 text-sm text-[#493337]">{t('Try another city or talk to our team.', 'جرّب اختيار مدينة أخرى أو تواصل مع فريقنا المبيعات.')}</p>
              <button
                onClick={() => setCityFilter('all')}
                className="mt-5 rounded-full bg-[#421319] px-5 py-2.5 text-sm font-bold text-[#f5f2e9]"
                data-testid="button-reset-search"
              >
                {t('Show all projects', 'عرض جميع المشروعات')}
              </button>
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}

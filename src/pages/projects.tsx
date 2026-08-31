import { useMemo, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { projects } from '@/data/projects';
import { ProjectCard, Shell } from '@/components/site';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function Projects() {
  const [cityFilter, setCityFilter] = useState('all');

  const filtered = useMemo(
    () => projects.filter((p) => cityFilter === 'all' || p.city === cityFilter),
    [cityFilter]
  );

  const cities = ['all', ...Array.from(new Set(projects.map((p) => p.city)))];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Shell>
      <main className="min-h-screen bg-[#f7f5ec] pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <FadeIn>
              <p className="eyebrow">Find your footing</p>
              <h1 className="mt-3 font-display text-4xl leading-tight text-[#4a1e2c] md:text-6xl">
                Projects built<br />for real life.
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
                        ? 'bg-[#4a1e2c] text-[#f7f5ec]'
                        : 'border border-[#4a1e2c]/20 text-[#735e57] hover:border-[#4a1e2c]/50 hover:text-[#4a1e2c]'
                    }`}
                  >
                    {c === 'all' ? 'All cities' : c}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>

          {filtered.length > 0 ? (
            <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-3">
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
            <div className="mt-12 rounded-2xl border border-dashed border-[#d9c5a5] p-12 text-center">
              <p className="font-display text-2xl text-[#4a1e2c]">Nothing in that city yet.</p>
              <p className="mt-2 text-sm text-[#735e57]">Try another city or talk to our team.</p>
              <button
                onClick={() => setCityFilter('all')}
                className="mt-5 rounded-full bg-[#4a1e2c] px-5 py-2.5 text-sm font-bold text-[#f7f5ec]"
                data-testid="button-reset-search"
              >
                Show all projects
              </button>
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'wouter';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Project } from '@/data/projects';
import { ArrowUpRight } from 'lucide-react';

interface HeroOrbitProps {
  projects: Project[];
  interactive?: boolean;
  className?: string;
  isPreview?: boolean;
}

// Convert any logo to cream version if available, or rely on CSS filter
export function getOrbitLogoUrl(project: Project): string {
  if (project.logo) {
    if (project.logo.includes('-cream.png')) return project.logo;
    // If it's a standard /project-logos/slug.png, try the cream variant
    if (project.logo.startsWith('/project-logos/')) {
      const baseName = project.logo.replace('/project-logos/', '').replace('.png', '');
      return `/project-logos/${baseName}-cream.png`;
    }
    return project.logo;
  }
  return `/project-logos/${project.slug}-cream.png`;
}

export function HeroOrbit({ projects, interactive = true, className = '', isPreview = false }: HeroOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  // Filter projects configured to show in Hero
  const activeProjects = useMemo(() => {
    return projects.filter(p => p.showInHero !== false && (p.logo || p.slug));
  }, [projects]);

  // Group by ring (1: Inner, 2: Middle, 3: Outer)
  const ring1Projects = useMemo(() => activeProjects.filter(p => (Number(p.orbitRing) || 2) === 1), [activeProjects]);
  const ring2Projects = useMemo(() => activeProjects.filter(p => (Number(p.orbitRing) || 2) === 2), [activeProjects]);
  const ring3Projects = useMemo(() => activeProjects.filter(p => (Number(p.orbitRing) || 2) === 3), [activeProjects]);

  // Parallax mouse effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isPreview) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(deltaX * 14);
    mouseY.set(deltaY * 10);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredProject(null);
  };

  // Dimensions based on mode
  const size = isPreview ? 460 : 900;
  const center = size / 2;

  // Radii for the 3 orbital rings
  const r1 = isPreview ? 80 : 180;
  const r2 = isPreview ? 140 : 300;
  const r3 = isPreview ? 200 : 420;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex items-center justify-center overflow-visible ${className}`}
      style={{
        width: isPreview ? '100%' : '100%',
        maxWidth: isPreview ? '480px' : '900px',
        height: isPreview ? '460px' : '900px',
      }}
    >
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="relative w-full h-full flex items-center justify-center pointer-events-auto"
      >


        {/* Minimal Central Architectural Origin Point (Monogram) */}
        <div className="absolute z-20 flex items-center justify-center pointer-events-none">
          <img 
            src="/capital-hills-icon-light.png" 
            alt="Monogram" 
            className={`${isPreview ? 'w-16' : 'w-48'} opacity-20 object-contain`}
          />
        </div>

        {/* ─── RING 1: INNER ORBIT ─── */}
        <OrbitRing
          radius={r1}
          projects={ring1Projects}
          duration={isPreview ? 80 : 120}
          direction="counter-clockwise"
          isPreview={isPreview}
          onHover={setHoveredProject}
        />

        {/* ─── RING 2: MIDDLE ORBIT ─── */}
        <OrbitRing
          radius={r2}
          projects={ring2Projects}
          duration={isPreview ? 100 : 150}
          direction="clockwise"
          isPreview={isPreview}
          onHover={setHoveredProject}
        />

        {/* ─── RING 3: OUTER ORBIT ─── */}
        <OrbitRing
          radius={r3}
          projects={ring3Projects}
          duration={isPreview ? 120 : 190}
          direction="counter-clockwise"
          isPreview={isPreview}
          onHover={setHoveredProject}
        />

        {/* Minimal active tooltip / status card on logo hover */}
        {hoveredProject && !isPreview && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300">
            <div className="bg-[#200c0f]/95 backdrop-blur-md border border-[#f5f2e9]/20 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5f2e9]/80 animate-pulse" />
              <div className="text-left">
                <p className="text-xs font-bold tracking-wider uppercase text-[#f5f2e9] font-display">
                  {hoveredProject.name}
                </p>
                <p className="text-[10px] text-[#f5f2e9]/60 tracking-wider uppercase">
                  {hoveredProject.city} &bull; {hoveredProject.product}
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#f5f2e9]/70 ml-1" />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface OrbitRingProps {
  radius: number;
  projects: Project[];
  duration: number;
  direction: 'clockwise' | 'counter-clockwise';
  isPreview?: boolean;
  onHover: (p: Project | null) => void;
}

function OrbitRing({ radius, projects, duration, direction, isPreview = false, onHover }: OrbitRingProps) {
  const diameter = radius * 2;
  const isClockwise = direction === 'clockwise';
  const animName = isClockwise ? 'spinClockwise' : 'spinCounterClockwise';
  const counterAnimName = isClockwise ? 'spinCounterClockwise' : 'spinClockwise';

  return (
    <div
      className="absolute rounded-full border border-[#f5f2e9]/[0.09] pointer-events-none flex items-center justify-center"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
      }}
    >
      {/* Rotating orbit track */}
      <div
        className="relative w-full h-full rounded-full"
        style={{
          animation: `${animName} ${duration}s linear infinite`,
        }}
      >
        {projects.map((project, idx) => {
          // Angle in degrees from project.orbitPosition or evenly distributed
          const angleDeg = project.orbitPosition !== undefined && project.orbitPosition !== null
            ? Number(project.orbitPosition)
            : (360 / Math.max(1, projects.length)) * idx;

          const angleRad = (angleDeg * Math.PI) / 180;
          // Calculate x, y relative to center (radius, radius)
          const x = radius + radius * Math.cos(angleRad);
          const y = radius + radius * Math.sin(angleRad);

          const opacityVal = Number(project.orbitOpacity) || 0.85;
          const creamLogo = getOrbitLogoUrl(project);

          const Content = (
            <div
              onMouseEnter={() => onHover(project)}
              onMouseLeave={() => onHover(null)}
              className="group cursor-pointer p-2 transition-all duration-300 transform hover:scale-110 pointer-events-auto"
              style={{
                opacity: opacityVal,
              }}
            >
              {/* Logo container with counter-rotation so logo stays perfectly upright */}
              <div
                style={{
                  animation: `${counterAnimName} ${duration}s linear infinite`,
                }}
                className="flex items-center justify-center transition-all duration-300 group-hover:opacity-100"
              >
                <img
                  src={creamLogo}
                  alt={project.name}
                  onError={(e) => {
                    // Fallback to standard logo if cream variant fails to load
                    const target = e.currentTarget;
                    if (!target.src.includes(project.logo || '')) {
                      target.src = project.logo || `/project-logos/${project.slug}.png`;
                      target.style.filter = 'brightness(0) invert(95%) sepia(10%) saturate(150%) hue-rotate(350deg)';
                    }
                  }}
                  className={`object-contain transition-all duration-300 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(245,242,233,0.15)] ${
                    isPreview
                      ? 'max-h-6 max-w-[85px]'
                      : 'max-h-8 md:max-h-10 max-w-[110px] md:max-w-[145px]'
                  }`}
                  style={{
                    // Additional safety filter ensuring off-white tone
                    filter: creamLogo.includes('-cream')
                      ? 'none'
                      : 'brightness(0) invert(95%) sepia(10%) saturate(150%) hue-rotate(350deg)',
                  }}
                />
              </div>
            </div>
          );

          return (
            <div
              key={project.id || project.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {isPreview ? (
                Content
              ) : (
                <Link href={`/projects/${project.slug}`}>
                  {Content}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

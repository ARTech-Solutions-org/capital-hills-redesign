import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'wouter';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Project } from '@/data/projects';
import { ArrowUpRight } from 'lucide-react';

interface HeroOrbitProps {
  projects: Project[];
  interactive?: boolean;
  className?: string;
  isPreview?: boolean;
}

// Convert any logo to cream version if available
export function getOrbitLogoUrl(project: Project): string {
  if (project.logo) {
    if (project.logo.includes('-cream.png')) return project.logo;

    if (project.logo.startsWith('/project-logos/')) {
      const baseName = project.logo
        .replace('/project-logos/', '')
        .replace('.png', '');

      return `/project-logos/${baseName}-cream.png`;
    }

    return project.logo;
  }

  return `/project-logos/${project.slug}-cream.png`;
}

export function HeroOrbit({
  projects,
  interactive = true,
  className = '',
  isPreview = false,
}: HeroOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredProject, setHoveredProject] =
    useState<Project | null>(null);

  // Only show projects enabled for the Hero
  const activeProjects = useMemo(() => {
    return projects.filter(
      (p) => p.showInHero !== false && (p.logo || p.slug)
    );
  }, [projects]);

  // Group projects by orbit ring
  const ring1Projects = useMemo(
    () =>
      activeProjects.filter(
        (p) => (Number(p.orbitRing) || 2) === 1
      ),
    [activeProjects]
  );

  const ring2Projects = useMemo(
    () =>
      activeProjects.filter(
        (p) => (Number(p.orbitRing) || 2) === 2
      ),
    [activeProjects]
  );



  // Subtle mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = {
    damping: 30,
    stiffness: 90,
  };

  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!interactive || isPreview) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX =
      (e.clientX - centerX) / (rect.width / 2);

    const deltaY =
      (e.clientY - centerY) / (rect.height / 2);

    // Keep movement extremely subtle
    mouseX.set(deltaX * 8);
    mouseY.set(deltaY * 6);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredProject(null);
  };

  // Dimensions
  const size = isPreview ? 460 : 800;
  const center = size / 2;

  // Orbit radii
  const r1 = isPreview ? 80 : 220;
  const r2 = isPreview ? 140 : 370;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex items-center justify-center overflow-visible ${className}`}
      style={{
        width: '100%',
        maxWidth: isPreview ? '480px' : '800px',
        height: isPreview ? '460px' : '800px',
        WebkitMaskImage: isPreview ? undefined : 'linear-gradient(to bottom, transparent 0%, transparent 12%, black 28%, black 100%)',
        maskImage: isPreview ? undefined : 'linear-gradient(to bottom, transparent 0%, transparent 12%, black 28%, black 100%)',
      }}
    >
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="relative w-full h-full flex items-center justify-center pointer-events-auto"
      >

        {/* =====================================================
            CENTER CONTENT
            Monogram when idle
            Project information when hovering
        ====================================================== */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            z-30
            flex
            items-center
            justify-center
            pointer-events-none
          "
        >
          <AnimatePresence mode="wait">

            {!hoveredProject ? (
              <motion.div
                key="monogram"
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 0.2,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.35,
                  ease: 'easeOut',
                }}
                className="flex items-center justify-center"
              >
                <img
                  src="/capital-hills-icon-light.png"
                  alt="Capital Hills"
                  className={
                    isPreview
                      ? 'w-16 object-contain'
                      : 'w-32 md:w-40 object-contain'
                  }
                />
              </motion.div>
            ) : (
              <motion.div
                key={hoveredProject.id || hoveredProject.slug}
                initial={{
                  opacity: 0,
                  y: 8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="
                  min-w-[190px]
                  md:min-w-[230px]
                  px-6
                  py-5
                  text-center
                  rounded-2xl
                  border
                  border-[#f5f2e9]/10
                  bg-[#200c0f]/85
                  backdrop-blur-sm
                "
              >
                {/* Project Name */}
                <p
                  className="
                    text-sm
                    md:text-base
                    font-medium
                    tracking-[0.12em]
                    uppercase
                    text-[#f5f2e9]
                    font-display
                  "
                >
                  {hoveredProject.name}
                </p>

                {/* Divider */}
                <div
                  className="
                    mx-auto
                    my-3
                    w-8
                    h-px
                    bg-[#f5f2e9]/20
                  "
                />

                {/* Location / Type */}
                <p
                  className="
                    text-[9px]
                    md:text-[10px]
                    tracking-[0.18em]
                    uppercase
                    text-[#f5f2e9]/55
                  "
                >
                  {hoveredProject.city}
                  {hoveredProject.city &&
                    hoveredProject.product &&
                    ' • '}
                  {hoveredProject.product}
                </p>

                {/* View Project */}
                {!isPreview && (
                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-[9px]
                      tracking-[0.15em]
                      uppercase
                      text-[#f5f2e9]/65
                    "
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* =====================================================
            INNER ORBIT
        ====================================================== */}

        <OrbitRing
          radius={r1}
          projects={ring1Projects}
          duration={isPreview ? 90 : 130}
          direction="counter-clockwise"
          isPreview={isPreview}
          onHover={setHoveredProject}
        />

        {/* =====================================================
            MIDDLE ORBIT
        ====================================================== */}

        <OrbitRing
          radius={r2}
          projects={ring2Projects}
          duration={isPreview ? 110 : 160}
          direction="clockwise"
          isPreview={isPreview}
          onHover={setHoveredProject}
        />



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

function OrbitRing({
  radius,
  projects,
  duration,
  direction,
  isPreview = false,
  onHover,
}: OrbitRingProps) {
  const diameter = radius * 2;

  const isClockwise = direction === 'clockwise';

  const animName = isClockwise
    ? 'spinClockwise'
    : 'spinCounterClockwise';

  const counterAnimName = isClockwise
    ? 'spinCounterClockwise'
    : 'spinClockwise';

  return (
    <div
      className="
        absolute
        rounded-full
        pointer-events-none
        flex
        items-center
        justify-center
      "
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        border:
          '1px solid rgba(245,242,233,0.07)',
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

          const angleDeg =
            project.orbitPosition !== undefined &&
            project.orbitPosition !== null
              ? Number(project.orbitPosition)
              : (360 / Math.max(1, projects.length)) * idx;

          const angleRad =
            (angleDeg * Math.PI) / 180;

          const x =
            radius +
            radius * Math.cos(angleRad);

          const y =
            radius +
            radius * Math.sin(angleRad);

          const opacityVal =
            Number(project.orbitOpacity) || 0.78;

          const creamLogo =
            getOrbitLogoUrl(project);

          const Content = (
            <div
              onMouseEnter={() =>
                onHover(project)
              }
              onMouseLeave={() =>
                onHover(null)
              }
              className="
                group
                cursor-pointer
                p-3
                transition-all
                duration-500
                pointer-events-auto
              "
              style={{
                opacity: opacityVal,
              }}
            >

              {/* Keep logo upright */}
              <div
                style={{
                  animation: `${counterAnimName} ${duration}s linear infinite`,
                }}
                className="
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-500
                  group-hover:scale-[1.06]
                  group-hover:opacity-100
                "
              >
                <img
                  src={creamLogo}
                  alt={project.name}
                  onError={(e) => {
                    const target =
                      e.currentTarget;

                    if (
                      !target.src.includes(
                        project.logo || ''
                      )
                    ) {
                      target.src =
                        project.logo ||
                        `/project-logos/${project.slug}.png`;

                      target.style.filter =
                        'brightness(0) invert(95%) sepia(10%) saturate(150%) hue-rotate(350deg)';
                    }
                  }}
                  className={`
                    object-contain
                    transition-all
                    duration-500
                    ${
                      isPreview
                        ? 'max-h-6 max-w-[85px]'
                        : 'max-h-8 md:max-h-10 max-w-[110px] md:max-w-[145px]'
                    }
                  `}
                  style={{
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
              className="
                absolute
                -translate-x-1/2
                -translate-y-1/2
              "
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {isPreview ? (
                Content
              ) : (
                <Link
                  href={`/projects/${project.slug}`}
                >
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

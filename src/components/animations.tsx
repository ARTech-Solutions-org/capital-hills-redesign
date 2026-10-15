import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

export function PageTransition({ children, keyProp }: { children: ReactNode; keyProp: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'none';
}) {
  const variants = {
    up: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
    none: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  };
  const { initial, animate } = variants[direction];
  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 0.7, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.7, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  target,
  suffix = '',
  className = '',
}: {
  target: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<number>(() => (typeof target === 'number' && !isNaN(target) ? target : 0));
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (typeof target === 'number' && !isNaN(target)) {
      setDisplayValue(target);
    }
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof target !== 'number' || isNaN(target)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          const start = 0;
          const end = target;
          const duration = 1200;
          const startTime = performance.now();

          const update = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(start + (end - start) * easeOut);
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setDisplayValue(end);
            }
          };

          requestAnimationFrame(update);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString('en-US')}{suffix}
    </span>
  );
}

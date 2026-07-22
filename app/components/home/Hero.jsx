import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef} from 'react';
import {heroTitle, EASE_PREMIUM} from '~/lib/motion';

/**
 * Full-viewport cinematic hero.
 * @param {{
 *   eyebrow?: string;
 *   titlePrimary?: string;
 *   titleOutline?: string;
 *   imageSrc?: string;
 *   imageAlt?: string;
 * }}
 */
export function Hero({
  eyebrow = 'DROP_01 / SOVEREIGN SERIES',
  titlePrimary = 'IMPETUS',
  titleOutline = 'REX',
  imageSrc = '/images/hero-editorial.png',
  imageAlt = 'IMPETUS REX',
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  return (
    <section
      ref={ref}
      className="home-hero relative h-screen w-full overflow-hidden bg-black"
      aria-label="Hero"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : {y, opacity}}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/55" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 pt-28 sm:px-10 md:px-14 md:pb-16 lg:px-20 lg:pb-20">
        <motion.p
          className="mb-4 font-mono text-[11px] tracking-[0.28em] uppercase md:mb-5 md:text-xs"
          style={{color: 'var(--ir-blue)'}}
          initial={reduce ? false : {opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1, delay: 0.15, ease: EASE_PREMIUM}}
        >
          {eyebrow}
        </motion.p>

        <h1
          className="home-hero__title leading-[0.8] tracking-[-0.045em] text-white uppercase"
          style={{fontFamily: 'var(--ir-display)'}}
        >
          <motion.span
            className="block"
            custom={0}
            variants={heroTitle}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            {titlePrimary}
          </motion.span>
          <motion.span
            className="home-hero__outline block"
            custom={1}
            variants={heroTitle}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            {titleOutline}
          </motion.span>
        </h1>

        <motion.div
          className="home-hero__scroll mt-12 flex items-center gap-3 md:mt-16"
          initial={reduce ? false : {opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1, delay: 1.1, ease: EASE_PREMIUM}}
        >
          <motion.span
            className="inline-block text-white"
            animate={reduce ? undefined : {y: [0, 6, 0]}}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          >
            ↓
          </motion.span>
          <span className="font-mono text-[10px] tracking-[0.28em] text-white/80 uppercase md:text-xs">
            SCROLL TO ENTER
          </span>
        </motion.div>
      </div>
    </section>
  );
}

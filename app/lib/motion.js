/** Shared Framer Motion presets — slow, editorial, never abrupt. */

export const EASE_PREMIUM = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: {opacity: 0, y: 36},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 1.1, ease: EASE_PREMIUM},
  },
};

export const fadeIn = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 1.2, ease: EASE_PREMIUM},
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem = {
  hidden: {opacity: 0, y: 48},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 1, ease: EASE_PREMIUM},
  },
};

export const heroTitle = {
  hidden: {opacity: 0, y: 40},
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {duration: 1.25, delay: 0.25 + i * 0.12, ease: EASE_PREMIUM},
  }),
};

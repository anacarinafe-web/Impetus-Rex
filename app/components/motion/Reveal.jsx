import {motion, useReducedMotion} from 'framer-motion';
import {fadeUp} from '~/lib/motion';

/**
 * Scroll-triggered reveal. Respects prefers-reduced-motion.
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 *   delay?: number;
 *   once?: boolean;
 *   amount?: number;
 * }}
 */
export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.2,
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{once, amount}}
      transition={{delay}}
    >
      {children}
    </motion.div>
  );
}

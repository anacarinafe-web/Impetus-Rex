import {motion, useReducedMotion} from 'framer-motion';
import {staggerContainer, staggerItem} from '~/lib/motion';

/**
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 * }}
 */
export function Stagger({children, className}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, amount: 0.15}}
    >
      {children}
    </motion.div>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 * }}
 */
export function StaggerItem({children, className}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

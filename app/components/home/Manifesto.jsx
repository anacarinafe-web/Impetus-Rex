import {Reveal} from '~/components/motion/Reveal';

/**
 * Editorial manifesto block.
 * @param {{
 *   label?: string;
 *   lines?: string[];
 *   accent?: string;
 * }}
 */
export function Manifesto({
  label = '03 / MANIFESTO',
  lines = [
    "WE DON'T FOLLOW TRENDS.",
    'WE BUILD UNIFORMS',
    'FOR THE NEXT ERA.',
  ],
  accent = 'Sovereignty is not given — it is worn.',
}) {
  return (
    <section
      className="home-manifesto bg-black px-6 py-32 text-white sm:px-10 md:px-14 md:py-40 lg:px-20 lg:py-48"
      aria-labelledby="manifesto-heading"
    >
      <Reveal>
        <p
          id="manifesto-heading"
          className="mb-12 font-mono text-[11px] tracking-[0.28em] uppercase md:mb-16 md:text-xs"
          style={{color: 'var(--ir-blue)'}}
        >
          {label}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div
          className="max-w-5xl"
          style={{
            fontFamily: 'var(--ir-display)',
            fontSize: 'clamp(2rem, 6.5vw, 4.75rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          {lines.map((line) => (
            <p key={line} className="text-white uppercase">
              {line}
            </p>
          ))}
          <p className="mt-6 uppercase md:mt-8" style={{color: 'var(--ir-blue)'}}>
            {accent}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

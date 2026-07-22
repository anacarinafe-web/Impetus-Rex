import {Await, NavLink} from 'react-router';
import {Suspense} from 'react';
import {Reveal} from '~/components/motion/Reveal';

/**
 * Global brand footer — newsletter + social + legal.
 * @param {{
 *   footer?: Promise<import('storefrontapi.generated').FooterQuery | null>;
 * }}
 */
export function SiteFooter({footer}) {
  return (
    <footer
      className="home-site-footer text-black"
      style={{backgroundColor: '#F5F5F5'}}
    >
      <div className="grid grid-cols-1 gap-16 px-6 py-24 sm:px-10 md:grid-cols-12 md:gap-12 md:px-14 md:py-32 lg:px-20 lg:py-40">
        <Reveal className="md:col-span-6 lg:col-span-5">
          <h2
            className="leading-none tracking-[-0.03em] uppercase"
            style={{
              fontFamily: 'var(--ir-display)',
              fontSize: 'clamp(2.5rem, 7vw, 4.75rem)',
            }}
          >
            JOIN THE
            <br />
            KINGDOM.
          </h2>
          <p
            className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-600 md:mt-8 md:text-base"
            style={{fontFamily: 'var(--ir-sans)'}}
          >
            Early access to drops. No noise. Only signal. Sovereignty delivered.
          </p>
        </Reveal>

        <Reveal
          className="flex flex-col justify-end md:col-span-6 lg:col-span-7"
          delay={0.1}
        >
          <form
            className="w-full max-w-none"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="sr-only" htmlFor="kingdom-email">
              Email
            </label>
            <div className="flex items-end gap-3 border-b border-black pb-3">
              <input
                id="kingdom-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ENTER YOUR SIGNAL"
                className="kingdom-input min-w-0 flex-1 bg-transparent py-2 text-xs tracking-[0.2em] text-black uppercase outline-none placeholder:text-zinc-400 md:text-sm"
                style={{fontFamily: 'var(--ir-sans)'}}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-11 w-11 shrink-0 items-center justify-center text-white transition duration-300 hover:opacity-80"
                style={{backgroundColor: 'var(--ir-blue)'}}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </button>
            </div>
          </form>

          <nav
            className="mt-16 flex flex-wrap gap-x-10 gap-y-4 md:mt-20"
            aria-label="Social"
          >
            <FooterLink href="https://instagram.com" label="Instagram" />
            <FooterLink href="https://tiktok.com" label="TikTok" />
            <FooterLink href="mailto:hello@impetusrex.com" label="Contact" />
          </nav>
        </Reveal>
      </div>

      <div className="flex flex-col gap-8 border-t border-zinc-300 px-6 py-10 sm:px-10 md:px-14 lg:px-20">
        {footer ? (
          <Suspense fallback={null}>
            <Await resolve={footer}>
              {(footerData) =>
                footerData?.menu?.items?.length ? (
                  <nav
                    className="flex flex-wrap gap-x-8 gap-y-3"
                    aria-label="Legal"
                  >
                    {footerData.menu.items.map((item) => {
                      if (!item.url) return null;
                      const url = item.url.includes('myshopify.com')
                        ? new URL(item.url).pathname
                        : item.url;
                      return (
                        <NavLink
                          key={item.id}
                          to={url.startsWith('/') ? url : '/'}
                          className="font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase transition hover:text-black"
                          end
                        >
                          {item.title}
                        </NavLink>
                      );
                    })}
                  </nav>
                ) : null
              }
            </Await>
          </Suspense>
        ) : null}

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-impetus-rex-black.png"
              alt=""
              width={48}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <p
              className="text-sm tracking-[0.1em] text-black uppercase md:text-base"
              style={{fontFamily: 'var(--ir-sans)'}}
            >
              <span className="font-bold">IMPETUS</span>{' '}
              <span
                className="text-transparent"
                style={{WebkitTextStroke: '1px #000'}}
              >
                REX
              </span>
            </p>
          </div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase md:text-xs">
            © 2026 IMPETUS REX. SOVEREIGNTY BY DESIGN.
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * @param {{href: string; label: string}}
 */
function FooterLink({href, label}) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className="font-mono text-[11px] tracking-[0.22em] text-zinc-600 uppercase transition duration-300 hover:text-black md:text-xs"
      {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
    >
      {label}
    </a>
  );
}

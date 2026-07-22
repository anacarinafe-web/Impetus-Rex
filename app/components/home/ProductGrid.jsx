import {Await, Link} from 'react-router';
import {Suspense, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Stagger, StaggerItem} from '~/components/motion/Stagger';
import {Reveal} from '~/components/motion/Reveal';

/**
 * Editorial product grid — no cards, large imagery, premium hover.
 * @param {{
 *   products: Promise<import('storefrontapi.generated').RecommendedProductsQuery | null>;
 * }}
 */
export function ProductGrid({products}) {
  return (
    <section
      className="home-pieces bg-black px-6 py-24 text-white sm:px-10 md:px-14 md:py-32 lg:px-20 lg:py-40"
      aria-labelledby="the-pieces"
    >
      <Reveal>
        <div className="mb-16 flex items-end justify-between gap-6 border-b border-white/10 pb-8 md:mb-24 md:pb-10">
          <h2
            id="the-pieces"
            className="leading-none tracking-[-0.035em] uppercase"
            style={{
              fontFamily: 'var(--ir-display)',
              fontSize: 'clamp(2.75rem, 9vw, 5.75rem)',
            }}
          >
            THE PIECES.
          </h2>
          <Suspense
            fallback={
              <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-600">
                — UNITS
              </span>
            }
          >
            <Await resolve={products}>
              {(response) => (
                <span className="shrink-0 pb-1 font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase md:text-xs">
                  {response?.products?.nodes?.length ?? 0} UNITS
                </span>
              )}
            </Await>
          </Suspense>
        </div>
      </Reveal>

      <Suspense
        fallback={
          <div className="py-32 text-center font-mono text-xs tracking-widest text-zinc-600 uppercase">
            Loading archive…
          </div>
        }
      >
        <Await resolve={products}>
          {(response) => {
            const nodes = response?.products?.nodes ?? [];
            if (!nodes.length) {
              return (
                <p className="font-mono text-sm text-zinc-500">
                  No products available.
                </p>
              );
            }

            const [featured, second, third, ...rest] = nodes;

            return (
              <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
                <Stagger className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12 lg:gap-16">
                  <StaggerItem className="md:col-span-7">
                    <EditorialProduct
                      product={featured}
                      size="xl"
                      loading="eager"
                    />
                  </StaggerItem>
                  <StaggerItem className="grid grid-cols-1 gap-16 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:gap-12 lg:gap-16">
                    {second ? (
                      <EditorialProduct
                        product={second}
                        size="lg"
                        loading="eager"
                      />
                    ) : null}
                    {third ? (
                      <EditorialProduct
                        product={third}
                        size="lg"
                        loading="lazy"
                      />
                    ) : null}
                  </StaggerItem>
                </Stagger>

                {rest.length > 0 ? (
                  <Stagger className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20">
                    {rest.map((product, i) => (
                      <StaggerItem key={product.id}>
                        <EditorialProduct
                          product={product}
                          size="lg"
                          loading={i < 1 ? 'eager' : 'lazy'}
                        />
                      </StaggerItem>
                    ))}
                  </Stagger>
                ) : null}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}

/**
 * @param {{
 *   product: {
 *     id: string;
 *     title: string;
 *     handle: string;
 *     productType?: string | null;
 *     featuredImage?: any;
 *     images?: {nodes: any[]};
 *     priceRange: {minVariantPrice: any};
 *   };
 *   loading?: 'eager' | 'lazy';
 *   size?: 'lg' | 'xl';
 * }}
 */
export function EditorialProduct({product, loading = 'lazy', size = 'lg'}) {
  const variantUrl = useVariantUrl(product.handle);
  const primary = product.featuredImage;
  const secondary =
    product.images?.nodes?.find((img) => img?.id !== primary?.id) ||
    product.images?.nodes?.[1] ||
    null;
  const [hovered, setHovered] = useState(false);
  const showSecondary = Boolean(secondary && hovered);

  return (
    <Link
      className="editorial-product group block"
      prefetch="intent"
      to={variantUrl}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div
        className={`editorial-product__media relative overflow-hidden bg-zinc-950 ${
          size === 'xl'
            ? 'aspect-[4/5] md:min-h-[70vh] md:aspect-[5/6]'
            : 'aspect-[3/4]'
        }`}
      >
        <span className="absolute top-4 left-4 z-20 font-mono text-[10px] tracking-[0.22em] text-white/90 uppercase md:text-xs">
          DROP_01
        </span>

        {primary ? (
          <>
            <Image
              alt={primary.altText || product.title}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                showSecondary
                  ? 'scale-105 opacity-0'
                  : 'scale-100 opacity-100 group-hover:scale-[1.04]'
              }`}
              data={primary}
              loading={loading}
              sizes={
                size === 'xl'
                  ? '(min-width: 48em) 58vw, 100vw'
                  : '(min-width: 48em) 32vw, 100vw'
              }
            />
            {secondary ? (
              <Image
                alt={secondary.altText || product.title}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                  showSecondary
                    ? 'scale-100 opacity-100'
                    : 'scale-105 opacity-0'
                }`}
                data={secondary}
                loading="lazy"
                sizes={
                  size === 'xl'
                    ? '(min-width: 48em) 58vw, 100vw'
                    : '(min-width: 48em) 32vw, 100vw'
                }
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-zinc-600">
            NO IMAGE
          </div>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6 md:mt-6">
        <div className="min-w-0">
          <h3
            className="text-sm tracking-[0.06em] text-white uppercase md:text-base"
            style={{fontFamily: 'var(--ir-sans)'}}
          >
            {product.title}
          </h3>
          {product.productType ? (
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase md:text-xs">
              {product.productType}
            </p>
          ) : null}
        </div>
        <p
          className={`shrink-0 text-right text-sm transition-all duration-500 ease-out md:text-base ${
            hovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-1 opacity-40 md:opacity-0'
          } group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:opacity-100`}
          style={{fontFamily: 'var(--ir-sans)', color: 'var(--ir-blue)'}}
        >
          <Money data={product.priceRange.minVariantPrice} />
        </p>
      </div>
    </Link>
  );
}

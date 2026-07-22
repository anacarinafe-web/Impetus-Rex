import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * Editorial product tile used across collections / search.
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      className="product-item group"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="product-item__media">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="3/4"
            className="product-item__image"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 33vw, 100vw"
          />
        ) : (
          <div className="product-item__placeholder">NO IMAGE</div>
        )}
      </div>
      <div className="product-item__meta">
        <h3 className="product-item__title">{product.title}</h3>
        <p className="product-item__price">
          <Money data={product.priceRange.minVariantPrice} />
        </p>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */

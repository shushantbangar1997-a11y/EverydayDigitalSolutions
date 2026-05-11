import type { ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * Renders a `<picture>` with a WebP `<source>` (auto-derived from the
 * raster `src` extension) and a fallback `<img>` for older browsers.
 *
 * Pair with `build-scripts/optimize-images.mjs`, which emits a `.webp`
 * sibling for every `.png` / `.jpg` in `public/`.
 *
 * Usage:
 *   <OptimizedImage src="/photos/founder.png" alt="..." className="..." />
 */
export function OptimizedImage({ src, alt, ...rest }: OptimizedImageProps) {
  const webp = src.replace(/\.(png|jpe?g)$/i, ".webp");
  const isRaster = webp !== src;
  if (!isRaster) {
    return <img src={src} alt={alt} {...rest} />;
  }
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
}

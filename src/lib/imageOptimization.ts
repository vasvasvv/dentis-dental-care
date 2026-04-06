type ImageOptimizationOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

/**
 * Builds a Cloudflare image transformation URL for a local or absolute asset path.
 */
export function generateImageUrl(path: string, options: ImageOptimizationOptions = {}) {
  const url = new URL(path, "https://dentis.kr.ua");

  if (options.width) {
    url.searchParams.set("w", String(options.width));
  }

  if (options.height) {
    url.searchParams.set("h", String(options.height));
  }

  if (options.quality) {
    url.searchParams.set("q", String(options.quality));
  }

  return url.pathname + url.search;
}

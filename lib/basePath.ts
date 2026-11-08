export const NEXT_PUBLIC_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : '/sony-xm6-site';

export const basePath = NEXT_PUBLIC_BASE_PATH.replace(/\/$/, '');

/**
 * Returns the URL with basePath prepended (if configured).
 * Works for both static GitHub Pages deployment (/sony-xm6-site)
 * and local development with an empty basePath.
 */
export function getAssetPath(path: string): string {
  if (basePath && path.startsWith(basePath)) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}

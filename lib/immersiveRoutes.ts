/** Routes that render their own chrome — global Navbar/Footer hide on these. */
export const IMMERSIVE_PREFIXES = [
  '/experiments',
  '/landing-preview',
  '/projects/smart-reading',
] as const;

export function isImmersiveRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return IMMERSIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

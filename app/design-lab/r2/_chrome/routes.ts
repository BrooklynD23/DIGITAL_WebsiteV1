// Round-2 page map, shared by both worlds. Pages link within their own world.
export type World = 'signal' | 'apple';
export type PageId = 'home' | 'sidekick' | 'shades' | 'brain';

export const PAGES: ReadonlyArray<{ readonly id: PageId; readonly label: string; readonly channel?: string }> = [
  { id: 'home', label: 'DIGITAL' },
  { id: 'sidekick', label: 'SIDEKICK', channel: 'CH1' },
  { id: 'shades', label: 'SHADES', channel: 'CH2' },
  { id: 'brain', label: 'BRAIN', channel: 'CH3' },
];

export function href(world: World, page: PageId): string {
  return page === 'home' ? `/design-lab/r2/${world}/` : `/design-lab/r2/${world}/${page}/`;
}

// Barrel for the shared r2 chrome. Owners: W1-HOME, W3a (SYS). API: WorldNav { world, current, sticky?, join? },
// WorldFooter { world }, LocalNav { title, titleHref, links, cta?, utility?, tone? }, JoinChapter { world, … },
// CLUB / BACKER_PATHS (club facts from lib/data), PAGES / href / World / PageId.
export { WorldNav } from './WorldNav';
export { WorldFooter } from './WorldFooter';
export { LocalNav, LOCAL_CTA } from './LocalNav';
export { JoinChapter } from './JoinChapter';
export type { JoinChapterProps, JoinAction } from './JoinChapter';
export { CLUB, BACKER_PATHS } from './club';
export type { BackerPath } from './club';
export type { LocalNavProps } from './LocalNav';
export { PAGES, href } from './routes';
export type { World, PageId } from './routes';

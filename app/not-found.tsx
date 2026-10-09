import Link from 'next/link';
import { SystemScreen, systemScreen as c } from './(apple)/_chrome/SystemScreen';
import { PAGES, href } from './(apple)/_chrome/routes';
import s from './(apple)/_chrome/site-page.module.css';
import { SYSTEM } from './(apple)/_content/system';

const BUILDS = PAGES.filter((p) => p.id !== 'home');

export default function NotFound() {
  const { notFound, home } = SYSTEM;
  return (
    <SystemScreen>
      <h1 className={s.heroTitle}>{notFound.title}</h1>
      <p className={s.heroLead}>{notFound.body}</p>
      <ul className={c.actions} aria-label={notFound.buildsLabel}>
        <li>
          <Link href={home.href} className={s.button}>{home.label}</Link>
        </li>
        {BUILDS.map((p) => (
          <li key={p.id}>
            <Link href={href('apple', p.id)} className={s.textLink}>{p.label}</Link>
          </li>
        ))}
      </ul>
    </SystemScreen>
  );
}

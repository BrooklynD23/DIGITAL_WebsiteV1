import type { Metadata } from 'next';
import { SitePage } from '../_chrome';
import s from '../_chrome/site-page.module.css';
import { CONTACT } from '../_content/contact';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = { title: CONTACT.meta.title, description: CONTACT.meta.description };

/** Contact: one black surface. The headline, the form, then the direct routes as quiet fact rows. */
export default function ContactPage() {
  const { hero, form, direct } = CONTACT;
  return (
    <SitePage>
      <section className={s.hero} data-tone="dark" aria-labelledby="contact-title">
        <h1 id="contact-title" className={s.heroTitle}>{hero.title}</h1>
        <p className={s.heroLead}>{hero.lead}</p>
      </section>

      <section className={`${s.section} ${s.flush}`} data-tone="dark" aria-label={form.label}>
        <div className={s.narrow}>
          <ContactForm />
        </div>
      </section>

      <section className={`${s.section} ${s.flush}`} data-tone="dark" aria-labelledby="contact-direct">
        <div className={s.narrow}>
          <h2 id="contact-direct" className={s.h2}>{direct.title}</h2>
          <dl className={s.facts}>
            {direct.rows.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>
                  {r.href ? (
                    <a href={r.href} {...(r.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </SitePage>
  );
}

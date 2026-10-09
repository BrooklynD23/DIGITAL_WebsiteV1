'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { contactTopicOptions, resolveContactTopic, type ContactTopicValue } from '@/lib/data/contactTopics';
import { siteConfig } from '@/lib/data/siteConfig';
import s from '../_chrome/site-page.module.css';
import { CONTACT } from '../_content/contact';
import { CLUB } from '../_chrome/club';

/**
 * The Formspree endpoint ships as a placeholder until a real form ID is provisioned. Submitting against it
 * would 404 and read as a network error, so the form says so instead. Tracked in docs/PRE-LAUNCH.md.
 */
const isFormspreeConfigured = !siteConfig.formspreeEndpoint.includes('YOUR_FORM_ID');
const EMAIL = siteConfig.contact.email;
const FIELDS = ['topic', 'name', 'email', 'message'] as const;
type FieldName = (typeof FIELDS)[number];
type Errors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';

const fieldId = (name: FieldName): string => (name === 'topic' ? `contact-topic-${contactTopicOptions[0].value}` : `contact-${name}`);

function validate(data: FormData): Errors {
  const t = CONTACT.form.errors;
  const text = (k: string): string => String(data.get(k) ?? '').trim();
  const errors: Errors = {};
  if (!text('topic')) errors.topic = t.topic;
  if (!text('name')) errors.name = t.name;
  if (!text('email')) errors.email = t.email;
  else if (!/^\S+@\S+\.\S+$/.test(text('email'))) errors.email = t.emailInvalid;
  if (!text('message')) errors.message = t.message;
  return errors;
}

export function ContactForm() {
  const { form, topics } = CONTACT;
  const [topic, setTopic] = useState<ContactTopicValue | ''>('');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  // Server HTML keeps native validation (no JS); once hydrated the form validates itself.
  const [hydrated, setHydrated] = useState(false);
  const sentRef = useRef<HTMLHeadingElement>(null);
  const refocus = useRef(false);

  // Deep links like /contact?type=sponsor preselect the topic. Read in an effect (not useSearchParams) so the
  // page prerenders its full markup into the static export.
  useEffect(() => {
    setHydrated(true);
    const fromUrl = resolveContactTopic(new URLSearchParams(window.location.search).get('type'));
    if (fromUrl) setTopic((prev) => prev || fromUrl);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      // The form is gone and the page is shorter: bring the result to the middle, clear of the sticky bar.
      sentRef.current?.focus({ preventScroll: true });
      sentRef.current?.scrollIntoView({ block: 'center' });
    }
    if (status === 'idle' && refocus.current) {
      refocus.current = false;
      document.getElementById(fieldId('topic'))?.focus();
    }
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormspreeConfigured) {
      setStatus('unconfigured');
      return;
    }
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    const first = FIELDS.find((f) => found[f]);
    if (first) {
      document.getElementById(fieldId(first))?.focus();
      return;
    }
    // Honeypot: a filled trap is a bot. Report success and send nothing.
    const { _gotcha: trap, ...body } = Object.fromEntries(data);
    setStatus('submitting');
    try {
      const ok = trap
        ? true
        : (
            await fetch(siteConfig.formspreeEndpoint, {
              method: 'POST',
              body: JSON.stringify(body),
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            })
          ).ok;
      if (ok) setTopic('');
      setStatus(ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const invalid = (name: FieldName) =>
    errors[name] ? ({ 'aria-invalid': true, 'aria-describedby': `contact-${name}-error` } as const) : {};
  const errorText = (name: FieldName) =>
    errors[name] ? <p id={`contact-${name}-error`} className={s.error}>{errors[name]}</p> : null;

  const copy = topic ? topics[topic] : null;
  const extra = copy?.extra;
  const busy = status === 'submitting';

  return (
    <>
      {/* One live region for the result; it is in the DOM before the message arrives. */}
      <div role="status">
        {status === 'success' ? (
          <div className={s.form}>
            <h2 ref={sentRef} tabIndex={-1} className={s.h2} style={{ outline: 'none' }}>{form.success.title}</h2>
            <p className={s.lead} style={{ marginTop: 0 }}>{form.success.body}</p>
            <button
              type="button"
              className={s.buttonQuiet}
              onClick={() => {
                refocus.current = true;
                setStatus('idle');
              }}
            >
              {form.success.again}
            </button>
          </div>
        ) : null}
      </div>

      {status === 'success' ? null : (
        <form
          className={s.form}
          action={siteConfig.formspreeEndpoint}
          method="POST"
          noValidate={hydrated}
          onSubmit={handleSubmit}
          onChange={(e) => {
            const name = (e.target as HTMLInputElement).name as FieldName;
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
          }}
        >
          <fieldset className={s.choices} role="radiogroup" aria-labelledby="contact-topic-legend" aria-required="true" {...invalid('topic')}>
            <legend id="contact-topic-legend" className={s.legend}>{form.topic}</legend>
            <div className={s.choiceList}>
              {contactTopicOptions.map((o) => (
                <label key={o.value} className={s.choice}>
                  <input
                    id={`contact-topic-${o.value}`}
                    type="radio"
                    name="topic"
                    value={o.value}
                    required
                    checked={topic === o.value}
                    onChange={() => setTopic(o.value)}
                  />
                  <span>{topics[o.value].label}</span>
                </label>
              ))}
            </div>
            {errorText('topic')}
          </fieldset>

          <div className={s.fieldPair}>
            <div className={s.field}>
              <label htmlFor="contact-name" className={s.label}>{form.name}</label>
              <input id="contact-name" name="name" type="text" required autoComplete="name" className={s.control} {...invalid('name')} />
              {errorText('name')}
            </div>
            <div className={s.field}>
              <label htmlFor="contact-email" className={s.label}>{form.email}</label>
              <input id="contact-email" name="email" type="email" required autoComplete="email" inputMode="email" className={s.control} {...invalid('email')} />
              {errorText('email')}
            </div>
          </div>

          {extra ? (
            <div className={s.field} key={extra.name}>
              <label htmlFor={`contact-${extra.name}`} className={s.label}>
                {extra.label} <span className={s.optional}>{form.optional}</span>
              </label>
              {extra.options ? (
                <select id={`contact-${extra.name}`} name={extra.name} className={s.control} defaultValue="">
                  <option value="">{form.none}</option>
                  {extra.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input id={`contact-${extra.name}`} name={extra.name} type="text" autoComplete={extra.autoComplete} className={s.control} />
              )}
            </div>
          ) : null}

          <div className={s.field}>
            <label htmlFor="contact-message" className={s.label}>{copy?.message ?? topics.general.message}</label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              className={s.control}
              {...invalid('message')}
              aria-describedby={[errors.message ? 'contact-message-error' : '', copy?.hint ? 'contact-message-hint' : ''].filter(Boolean).join(' ') || undefined}
            />
            {copy?.hint ? <p id="contact-message-hint" className={s.hint}>{copy.hint}</p> : null}
            {errorText('message')}
          </div>

          {/* Honeypot: Formspree drops any submission with _gotcha filled; people never see or reach it. */}
          <div className={s.trap} aria-hidden="true">
            <label htmlFor="contact-gotcha">Leave this empty</label>
            <input id="contact-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'error' || status === 'unconfigured' ? (
            <p role="alert" className={s.notice} data-kind="error">
              {status === 'error' ? form.failed : form.unconfigured}{' '}
              {EMAIL ? (
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              ) : (
                <a href={CLUB.discord} target="_blank" rel="noopener noreferrer">{form.fallbackLink}</a>
              )}
              .
            </p>
          ) : null}

          <button type="submit" className={s.button} disabled={busy} aria-busy={busy || undefined}>
            {busy ? form.submitting : form.submit}
          </button>
        </form>
      )}
    </>
  );
}

/**
 * Contact page copy (Apple world). Topic values and the ?type= mapping stay in lib/data/contactTopics.ts;
 * this file only adds what the page shows for each one. Facts come from lib/data/siteConfig.ts and _chrome/club.ts.
 * No reply-time promise, no names, no partners: nothing in the data files backs one.
 */
import type { ContactTopicValue } from '@/lib/data/contactTopics';
import { siteConfig } from '@/lib/data/siteConfig';
import { CLUB, LINKS } from '../_chrome/club';
import { PAGES } from '../_chrome/routes';

export interface ContactTopicCopy {
  /** Short pill label. The submitted value is the key from contactTopics.ts. */
  readonly label: string;
  /** Label of the message field for this topic. */
  readonly message: string;
  readonly hint?: string;
  /** The one extra field this topic needs, if any. Always optional. */
  readonly extra?: { readonly name: string; readonly label: string; readonly options?: readonly string[]; readonly autoComplete?: string };
}

const BUILDS = PAGES.filter((p) => p.id !== 'home').map((p) => p.label);

export const CONTACT = {
  meta: {
    title: 'Contact · DIGITAL',
    description: 'Write to DIGITAL at Cal Poly Pomona: ask a question, join a build, or sponsor one.',
  },
  hero: {
    title: 'Tell us what you want to build.',
    lead: 'Pick a topic and write a few lines.',
  },
  form: {
    label: 'Message form',
    topic: 'What is this about?',
    name: 'Name',
    email: 'Email',
    optional: '(optional)',
    none: 'Not sure yet',
    submit: 'Send message',
    submitting: 'Sending…',
    errors: {
      name: 'Enter your name.',
      email: 'Enter your email.',
      emailInvalid: 'Enter a valid email address.',
      topic: 'Pick a topic.',
      message: 'Write a short message.',
    },
    /** Each is followed by a link: the email when one exists, otherwise the Discord server. */
    failed: 'That did not send. Try again, or write to us on',
    unconfigured: 'This form is not connected yet. Write to us on',
    fallbackLink: 'Discord',
    success: { title: 'Message sent.', body: 'Thanks for writing.', again: 'Send another message' },
  },
  topics: {
    general: { label: 'A question', message: 'Your question' },
    join: { label: 'Joining', message: 'What do you want to work on?', hint: CLUB.noExperience },
    project: {
      label: 'A build',
      message: 'Your message',
      extra: { name: 'build', label: 'Which build?', options: BUILDS },
    },
    sponsorship: {
      label: 'Sponsoring',
      message: 'What do you have in mind?',
      extra: { name: 'organization', label: 'Organization', autoComplete: 'organization' },
    },
  } satisfies Record<ContactTopicValue, ContactTopicCopy> as Record<ContactTopicValue, ContactTopicCopy>,
  direct: {
    title: 'Or reach us directly.',
    rows: [
      { label: 'Discord', value: 'Join the club server', href: CLUB.discord },
      { label: 'BRAIN Discord', value: 'Join the BRAIN server', href: LINKS.brainDiscord },
      ...(siteConfig.contact.email ? [{ label: 'Email', value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` }] : []),
      { label: 'Build night', value: `${CLUB.when} · ${CLUB.where}, ${siteConfig.contact.campus}` },
      { label: 'GitHub', value: 'SIDEKICK repository', href: LINKS.github },
      { label: 'LinkedIn', value: 'DIGITAL on LinkedIn', href: LINKS.linkedin },
      { label: 'Instagram', value: '@digital.cpp', href: LINKS.instagram },
    ] as ReadonlyArray<{ readonly label: string; readonly value: string; readonly href?: string }>,
  },
} as const;

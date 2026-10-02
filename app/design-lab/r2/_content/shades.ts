/**
 * SHADES page content, shared by both round-2 worlds (/design-lab/r2/signal/shades, /design-lab/r2/apple/shades).
 * Owner: W1-SHADES. Same facts, two compositions.
 *
 * Sources: design-lab/round2/research/notion-directives.md (Notion SHADES pages, all tagged [confirm]),
 * lib/data/projects.ts + lib/data/experiments/glasses.ts (RSVP method, reader sets WPM, FPGA, Verilog, Embedded C,
 * optics, mentor), PRODUCT.md (build night). No medical or efficacy claims. No personal names except the mentor.
 * Unconfirmed component choices (FPGA part, display panel, optics type) are not named.
 */
import { siteConfig } from '@/lib/data/siteConfig';

export interface ConfirmText {
  readonly text: string;
  /** Notion-sourced or unverified: the page shows a [confirm] tag. */
  readonly confirm?: boolean;
}

export interface LightStage {
  readonly id: 'text' | 'timing' | 'control' | 'display' | 'optics' | 'eye';
  readonly name: string;
  /** Signal list line (one sentence). */
  readonly line: string;
  /** Apple pinned-chapter caption (one line, ≤12 words). */
  readonly caption: string;
  readonly confirm: boolean;
}

export interface Phase {
  readonly n: number;
  readonly name: string;
}

export interface Role {
  readonly id: string;
  readonly name: string;
  readonly line: string;
}

export interface Highlight {
  readonly id: 'timing' | 'pace' | 'type' | 'link' | 'optics';
  readonly title: string;
  readonly caption: string;
  readonly confirm: boolean;
}

export const SHADES = {
  name: 'SHADES',
  channel: 'CH2',
  expansion: 'Smart Headset for Adaptive Dyslexia Enhancement System',
  formerly: 'Formerly Smart Reading',
  status: { text: 'Planning', confirm: true } as ConfirmText,
  meta: {
    title: 'SHADES · DIGITAL design lab',
    description: 'RSVP reading glasses in development at DIGITAL, Cal Poly Pomona: one word at a time, at one fixed point, at your pace.',
  },

  /** Apple local product nav. */
  nav: {
    links: [
      { href: '#reader', label: 'Try it' },
      { href: '#light-path', label: 'Light path' },
      { href: '#roadmap', label: 'Roadmap' },
    ],
    cta: 'Join the build',
  },
  labels: { is: 'Is', isNot: 'Is not', prevHighlight: 'Previous highlight', nextHighlight: 'Next highlight', phase: 'Phase' },

  hero: {
    headline: 'Read without the chase.',
    lead: 'Glasses that show one word at a time, at one fixed point, at the pace you set.',
    action: 'Try the reader',
    glassesLabel: 'Line drawing of the SHADES glasses, front view, with one word shown inside the right lens. Illustrative.',
  },

  problem: {
    headline: 'Your eyes jump.',
    lead: 'Along a line, your eyes jump from word to word, stop, and sometimes jump back to find their place.',
    /** The line of text the illustrative scanpath runs over. */
    line: ['Along', 'a', 'line,', 'your', 'eyes', 'jump,', 'stop,', 'then', 'jump.'],
    /** Shown inside the figure (its accessible name already starts with "Illustrative"). */
    figureNote: 'Illustrative, not recorded data',
    /** Short line for the pinned (quiet) viewport. */
    pinLead: 'Word to word, stop, and back again.',
    figureLabel:
      'Illustrative scanpath, not recorded data: fixation dots over each word of a line, joined by jumps, with one jump backwards. A trace below plots eye position stepping across the line.',
    traceAxis: 'eye position, x',
    timeAxis: 'time',
  },

  method: {
    headline: 'SHADES holds still.',
    appleHeadline: 'One word. One point.',
    lead: 'RSVP shows one word at a time at a fixed point. The words move. Your eyes stay.',
    term: 'RSVP: rapid serial visual presentation',
    /** The one word left at the fixation point when the scanpath collapses. */
    oneWord: 'still.',
    pinLead: 'One word at a time, at one point.',
    appleLead: 'the words move, your eyes stay.',
    abbr: 'RSVP',
    abbrTitle: 'rapid serial visual presentation',
    figureLabel: 'Illustrative scanpath, collapsed: every fixation lands on one point, where one word appears.',
    fixateLabel: 'Scattered dots converge on a single fixation point, where one word appears. Illustrative.',
  },

  reader: {
    headline: 'Set the pace. Press Read.',
    lead: 'Nothing plays until you press Read.',
    words: [
      'The', 'words', 'arrive', 'one', 'at', 'a', 'time,', 'right', 'where', 'you', 'look.',
      'Your', 'eyes', 'hold', 'still.',
      'The', 'sentence', 'comes', 'to', 'you,', 'at', 'the', 'pace', 'you', 'choose.',
    ],
    wpm: { min: 100, max: 600, step: 25, initial: 250 },
    label: 'RSVP reader demo',
    textLabel: 'Text in this demo',
    controls: { read: 'Read', pause: 'Pause', resume: 'Resume', again: 'Read again', next: 'Next word', back: 'Previous word', restart: 'Restart', speed: 'Speed' },
    unit: 'wpm',
    reducedNote: 'Reduced motion is on, so the reader steps one word at a time.',
  },

  spacing: {
    label: 'More spacing',
    standard: 'Standard',
    more: 'More',
    note: 'Text on this page uses Atkinson Hyperlegible Next. More spacing widens letters, words and lines.',
  },

  lightPath: {
    headline: 'Follow the light.',
    lead: 'Six stages, from a text file on a laptop to the point where you look.',
    /** Shown inside the figure (its accessible name starts with "Diagram"). */
    note: 'Diagram, not a render [confirm]',
    figureLabel:
      'Diagram, not a render, of the SHADES light path in six stages: text source, word timing on an FPGA, control, display, optics, and the eye’s fixation point. Parts are not chosen yet.',
    stages: [
      {
        id: 'text',
        name: 'Text source',
        line: 'Prepared text comes from a laptop over one wired link, USB or UART.',
        caption: 'Prepared text leaves a laptop over one wire.',
        confirm: true,
      },
      {
        id: 'timing',
        name: 'Word timing',
        line: 'An FPGA holds each word for its slot in time and draws it in one fixed region.',
        caption: 'An FPGA gives each word its slot.',
        confirm: true,
      },
      {
        id: 'control',
        name: 'Control',
        line: 'An external controller holds compute and power, with pause, resume, speed and rewind.',
        caption: 'You pause, resume, speed up or rewind.',
        confirm: true,
      },
      {
        id: 'display',
        name: 'Display',
        line: 'A small display shows the word. Early phases test on a 640 × 480 monitor first.',
        caption: 'A small display shows one word.',
        confirm: true,
      },
      {
        id: 'optics',
        name: 'Optics',
        line: 'Optics carry the display to one eye at a fixed focus.',
        caption: 'Optics carry it to one eye.',
        confirm: true,
      },
      {
        id: 'eye',
        name: 'Fixation point',
        line: 'The word lands where you are already looking. Your eyes do not travel.',
        caption: 'The word lands where you already look.',
        confirm: false,
      },
    ] as ReadonlyArray<LightStage>,
  },

  tracks: {
    headline: 'Two tracks. One build.',
    items: [
      { id: 'engineering', name: 'Engineering', line: 'Build the RSVP heads-up display: word timing, control, display and optics.' },
      { id: 'research', name: 'Medical research', line: 'Study how dyslexic readers respond to RSVP, with no outcome promised in advance.' },
    ],
    boundary: {
      is: 'A research platform.',
      isNot: 'Not a medical device, and not a treatment.',
      line: 'SHADES claims no effect on dyslexia or on reading outcomes.',
    },
    confirm: true,
  },

  scope: {
    headline: 'The first build, honestly.',
    inLabel: 'In the first build',
    outLabel: 'Not in it',
    in: [
      'Prepared text over one wired link',
      'A limited English character set',
      'Pause, resume, speed and rewind',
      'One eye, fixed focus',
      'An external controller for compute and power',
    ],
    out: ['Wireless', 'Camera or text recognition', 'AI pacing', 'Eye tracking', 'Standalone use', 'Medical claims'],
    confirm: true,
  },

  roadmap: {
    headline: 'Seven phases.',
    lead: 'From a blinking FPGA to a wearable prototype.',
    note: 'Current phase not yet confirmed.',
    phases: [
      { n: 1, name: 'Basic FPGA operation' },
      { n: 2, name: 'Video output' },
      { n: 3, name: 'Text display' },
      { n: 4, name: 'Text input' },
      { n: 5, name: 'RSVP operation' },
      { n: 6, name: 'Full integration' },
      { n: 7, name: 'Wearable prototype' },
    ] as ReadonlyArray<Phase>,
    /** Notion does not state the current phase; leave null until the club confirms one. */
    current: null as number | null,
    confirm: true,
  },

  highlights: {
    headline: 'Take a closer look.',
    items: [
      { id: 'timing', title: 'FPGA timing', caption: 'An FPGA gives every word its own time slot.', confirm: true },
      { id: 'pace', title: 'Your pace', caption: 'Set the words per minute. Pause or rewind anytime.', confirm: false },
      { id: 'type', title: 'Readable page', caption: 'Set in Atkinson Hyperlegible Next, with a wider-spacing setting.', confirm: false },
      { id: 'optics', title: 'One eye', caption: 'One word, shown to one eye, at a fixed focus.', confirm: true },
    ] as ReadonlyArray<Highlight>,
  },

  join: {
    headline: 'Pick your seat.',
    lead: 'SHADES needs five kinds of builders.',
    roles: [
      { id: 'fpga', name: 'Engineering', line: 'FPGA timing and video output.' },
      { id: 'firmware', name: 'Firmware', line: 'Embedded C for control.' },
      { id: 'optics', name: 'Optics', line: 'Lenses and a frame that fits.' },
      { id: 'design', name: 'Design', line: 'How a reader sets the pace.' },
      { id: 'research', name: 'Research', line: 'The medical-research track.' },
    ] as ReadonlyArray<Role>,
    mentor: 'Mentored by Dr. Mohamed El Hadedy.',
    night: { label: 'Build night', when: siteConfig.contact.meetingTime.replace(' @ ', ', '), where: siteConfig.contact.location },
    discord: { label: 'Ask on Discord', href: siteConfig.community.discord },
    action: 'Come to build night',
  },

  confirmTag: '[confirm]',
} as const;

export type ShadesContent = typeof SHADES;

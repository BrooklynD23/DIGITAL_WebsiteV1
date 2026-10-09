/**
 * SHADES page content, shared by both round-2 worlds (now live at /projects/shades; the Signal world is archived).
 * Owner: W1-SHADES. Same facts, two compositions.
 *
 * Sources: design-lab/round2/research/notion-directives.md and design-lab/shades-concept/research/notion/SUMMARY.md
 * (Notion SHADES pages, re-read 2026-10-09, all tagged [confirm]),
 * lib/data/projects.ts + lib/data/experiments/glasses.ts (RSVP method, reader sets WPM, FPGA, Verilog, Embedded C,
 * optics, mentor), PRODUCT.md (build night). No medical or efficacy claims. No personal names except the mentor.
 * Unconfirmed component choices (FPGA part, display panel, optics type) are not named.
 */
import { CLUB } from '../_chrome/club';

export interface ConfirmText {
  readonly text: string;
  /** Notion-sourced or unverified: the page shows a [confirm] tag. */
  readonly confirm?: boolean;
}

export interface LightStage {
  readonly id: 'text' | 'timing' | 'control' | 'display' | 'optics' | 'eye';
  readonly name: string;
  /** Signal list line (one sentence). */
  /** One-line caption (≤8 words), both worlds. */
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
  /** The permanent boundary. Shown beside the full name in both heroes and in the tracks chapter. */
  boundaryShort: 'A research platform. Not a medical device.',
  meta: {
    title: 'SHADES · DIGITAL',
    description: 'RSVP reading glasses, a concept in planning at DIGITAL, Cal Poly Pomona: one word at a time, at one fixed point, at your pace.',
  },

  /** Apple local product nav. */
  nav: {
    links: [
      { href: '#reader', label: 'Try it' },
      { href: '#light-path', label: 'Light path' },
      { href: '#roadmap', label: 'Roadmap' },
    ],
  },
  labels: { is: 'Is', isNot: 'Is not', never: 'Never', phase: 'Phase', keys: 'K play or pause · ← → step', seatSuffix: 'Ask about this seat' },

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
    pinLead: 'Word to word, and back.',
    figureLabel:
      'Illustrative scanpath, not recorded data: fixation dots over each word of a line, joined by jumps, with one jump backwards. A trace below plots eye position stepping across the line.',
    traceAxis: 'eye position, x',
    timeAxis: 'time',
  },

  method: {
    headline: 'SHADES holds still.',
    appleHeadline: 'One word. One point.',
    lead: 'RSVP shows one word at a time at a fixed point. The words move. Your eyes can stay.',
    /** The one word left at the fixation point when the scanpath collapses. */
    oneWord: 'still.',
    pinLead: 'One word, one point.',
    appleLead: 'The words move. Your eyes can stay.',
    figureLabel: 'Illustrative scanpath, collapsed: every fixation lands on one point, where one word appears.',
    fixateLabel: 'Scattered dots converge on a single fixation point, where one word appears. Illustrative.',
  },

  reader: {
    headline: 'Set the pace. Press Read.',
    lead: 'Nothing plays until you do. The method is RSVP, rapid serial visual presentation.',
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
    reducedNote: 'Reduced motion is on, so the reader steps one word at a time and speed does not apply.',
  },

  spacing: {
    label: 'Spacing',
    standard: 'standard',
    more: 'more',
  },

  lightPath: {
    headline: 'Follow the light.',
    lead: 'Six stages, from a text file on a laptop to the point where you look.',
    /** Shown inside the figure (its accessible name starts with "Diagram"). */
    note: 'Diagram, not a render',
    /** Signal pinned band: one caption line under the strip. */
    pinNote: 'Diagram, not a render.',
    figureLabel:
      'Diagram, not a render, of the SHADES light path in six stages: text source, control, word timing on an FPGA, display, optics, and the eye’s fixation point. Parts are not chosen yet and are unconfirmed by the club.',
    stages: [
      {
        id: 'text',
        name: 'Text source',
        caption: 'Prepared text leaves a laptop over one wire.',
        confirm: true,
      },
      {
        id: 'control',
        name: 'Control',
        caption: 'You pause, resume, speed up or rewind.',
        confirm: true,
      },
      {
        id: 'timing',
        name: 'Word timing',
        caption: 'An FPGA gives each word its slot.',
        confirm: true,
      },
      {
        id: 'display',
        name: 'Display',
        caption: 'A small display shows one word.',
        confirm: true,
      },
      {
        id: 'optics',
        name: 'Optics',
        caption: 'Optics carry it to one eye.',
        confirm: true,
      },
      {
        id: 'eye',
        name: 'Fixation point',
        caption: 'The word lands where you already look.',
        confirm: false,
      },
    ] as ReadonlyArray<LightStage>,
  },

  tracks: {
    headline: 'Two tracks. One build.',
    items: [
      { id: 'engineering', name: 'Engineering', line: 'Build the RSVP heads-up display: control, word timing, display and optics.' },
      { id: 'research', name: 'Medical research', line: 'Ask whether RSVP changes comprehension, reading speed, retention or comfort for readers with dyslexia. No outcome promised in advance.' },
    ],
    boundary: {
      is: 'A research platform.',
      isNot: 'Not a medical device, and not a treatment.',
      never: 'Medical claims, now or later.',
      line: 'SHADES claims no effect on dyslexia or on reading outcomes.',
    },
    confirm: true,
  },

  scope: {
    headline: 'What the first build covers.',
    inLabel: 'In the first build',
    outLabel: 'Not in it',
    in: [
      'Prepared text over one wired link',
      'Words or short phrases in one fixed spot',
      'A limited English character set',
      'Pause, resume, speed and rewind, from a dial and buttons',
      'One eye, fixed focus, see-through',
      'A pocket-sized controller for compute and power, on one cable to the glasses',
    ],
    out: ['Wireless', 'Camera or text recognition', 'AI pacing', 'Eye tracking', 'Standalone use'],
    confirm: true,
  },

  roadmap: {
    headline: 'Seven phases.',
    lead: 'The FPGA team’s plan, from basic FPGA operation to a wearable prototype.',
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
    headline: 'The details.',
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
      { id: 'fpga', name: 'SoC and FPGA', line: 'Word timing, text rendering and video output.' },
      { id: 'pcb', name: 'Hardware (PCB)', line: 'Circuit boards for power, controls and the display.' },
      { id: 'mech', name: 'Mechanical', line: 'The frame, the optics mounts and the controller case.' },
      { id: 'product', name: 'Product development', line: 'Requirements, scope and how a reader sets the pace.' },
      { id: 'research', name: 'Research', line: 'The medical-research track.' },
    ] as ReadonlyArray<Role>,
    mentor: 'Mentored by Dr. Mohamed El Hadedy.',
    discord: { label: 'Ask on Discord', href: CLUB.discord },
    /** Primary join action (production route with the build-night details). */
    action: { label: 'Come to build night', href: '/get-involved/' },
  },

  confirmTag: '[confirm]',
} as const;

export type ShadesContent = typeof SHADES;

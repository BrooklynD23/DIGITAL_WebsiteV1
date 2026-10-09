/**
 * Type-lab pairings. Each pairing names its source, license and the design
 * direction it is being auditioned for. Display tuning (weight / tracking /
 * leading / case / width) is part of the pairing: a face is judged as set, not
 * at defaults.
 */

export interface FaceSpec {
  readonly name: string;
  readonly stack: string;
  readonly source: 'Google Fonts' | 'Fontshare' | 'Fontesk' | 'Fontjoy';
  readonly license: string;
}

export interface Pairing {
  readonly id: string;
  readonly label: string;
  readonly direction: string;
  readonly display: FaceSpec;
  readonly body: FaceSpec;
  readonly mono: FaceSpec;
  readonly tune: {
    readonly weight: number;
    readonly tracking: string;
    readonly leading: number;
    readonly upper?: boolean;
    readonly italicSecondLine?: boolean;
    readonly variation?: string;
    readonly scale?: number;
  };
}

const OFL = 'SIL OFL 1.1';
const FFL = 'ITF Free Font License (free commercial, no redistribution)';

const g = (name: string, v: string): FaceSpec => ({ name, stack: `var(${v}), system-ui, sans-serif`, source: 'Google Fonts', license: OFL });
const fs = (name: string): FaceSpec => ({ name, stack: `'${name}', system-ui, sans-serif`, source: 'Fontshare', license: FFL });

const plexMono = g('IBM Plex Mono', '--tl-plex-mono');
const jetbrains = g('JetBrains Mono', '--tl-jetbrains');
const departure: FaceSpec = { name: 'Departure Mono', stack: 'var(--tl-departure), monospace', source: 'Fontesk', license: OFL };

export const PAIRINGS: readonly Pairing[] = [
  {
    id: 'p0',
    label: 'Baseline — current production stack',
    direction: 'Control (lib/fonts.ts landing stack)',
    display: g('Newsreader', '--tl-newsreader'),
    body: g('IBM Plex Sans', '--tl-plex-sans'),
    mono: plexMono,
    tune: { weight: 500, tracking: '-0.01em', leading: 1.08, italicSecondLine: true },
  },
  {
    id: 'p1',
    label: 'Zodiak / Switzer / JetBrains Mono',
    direction: 'A Editorial / Studio',
    display: fs('Zodiak'),
    body: fs('Switzer'),
    mono: jetbrains,
    tune: { weight: 400, tracking: '-0.025em', leading: 1.0 },
  },
  {
    id: 'p2',
    label: 'Instrument Serif / Instrument Sans / Spline Sans Mono',
    direction: 'A Editorial (alt) · E Startup accent',
    display: { ...g('Instrument Serif', '--tl-instrument-serif'), source: 'Fontesk', license: `${OFL} (also on Google Fonts)` },
    body: g('Instrument Sans', '--tl-instrument-sans'),
    mono: g('Spline Sans Mono', '--tl-spline-mono'),
    tune: { weight: 400, tracking: '-0.02em', leading: 0.98, italicSecondLine: true, scale: 1.12 },
  },
  {
    id: 'p3',
    label: 'IBM Plex Sans Condensed / Plex Sans / Plex Mono',
    direction: 'B Engineering / System',
    display: g('IBM Plex Sans Condensed', '--tl-plex-cond'),
    body: g('IBM Plex Sans', '--tl-plex-sans'),
    mono: plexMono,
    tune: { weight: 600, tracking: '0.01em', leading: 0.98, upper: true, scale: 0.92 },
  },
  {
    id: 'p4',
    label: 'Archivo (wdth 125) / Archivo / JetBrains Mono',
    direction: 'B Engineering (alt) · E Startup',
    display: g('Archivo Expanded', '--tl-archivo'),
    body: g('Archivo', '--tl-archivo'),
    mono: jetbrains,
    tune: { weight: 700, tracking: '-0.03em', leading: 0.98, variation: "'wdth' 125", scale: 0.86 },
  },
  {
    id: 'p5',
    label: 'Clash Display / General Sans / Martian Mono',
    direction: 'C Creative Technology',
    display: fs('Clash Display'),
    body: fs('General Sans'),
    mono: g('Martian Mono', '--tl-martian'),
    tune: { weight: 600, tracking: '-0.01em', leading: 0.95 },
  },
  {
    id: 'p6',
    label: 'Fraunces (SOFT 100) / Figtree / IBM Plex Mono',
    direction: 'D Human / Community',
    display: g('Fraunces', '--tl-fraunces'),
    body: g('Figtree', '--tl-figtree'),
    mono: plexMono,
    tune: { weight: 500, tracking: '-0.02em', leading: 1.02, variation: "'SOFT' 100, 'WONK' 1, 'opsz' 144", italicSecondLine: true },
  },
  {
    id: 'p7',
    label: 'Cabinet Grotesk / Satoshi / JetBrains Mono',
    direction: 'E Startup / Product Studio',
    display: fs('Cabinet Grotesk'),
    body: fs('Satoshi'),
    mono: jetbrains,
    tune: { weight: 800, tracking: '-0.035em', leading: 0.96 },
  },
  {
    id: 'p8',
    label: 'Bricolage Grotesque (opsz 96, wdth 75) / Departure Mono',
    direction: 'F Radical',
    display: { ...g('Bricolage Grotesque', '--tl-bricolage'), source: 'Fontesk', license: `${OFL} (also on Google Fonts)` },
    body: g('Bricolage Grotesque (text)', '--tl-bricolage'),
    mono: departure,
    tune: { weight: 800, tracking: '-0.005em', leading: 0.92, variation: "'opsz' 96, 'wdth' 75", scale: 1.1 },
  },
  {
    id: 'p9',
    label: 'Tanker / Switzer / Departure Mono',
    direction: 'F Radical (alt) · C poster moments',
    display: fs('Tanker'),
    body: fs('Switzer'),
    mono: departure,
    tune: { weight: 400, tracking: '0em', leading: 0.92, upper: true, scale: 0.95 },
  },
  {
    id: 'p10',
    label: 'Fontjoy output — Arimo / Fira Sans Condensed / Martel',
    direction: 'Control: Fontjoy generator (run #10 of 13, 2026-10-02)',
    display: { ...g('Arimo', '--tl-arimo'), source: 'Fontjoy' },
    body: { ...g('Fira Sans Condensed', '--tl-fira-cond'), source: 'Fontjoy' },
    mono: { name: 'Martel (accent slot — Fontjoy has no mono)', stack: 'var(--tl-martel), serif', source: 'Fontjoy', license: OFL },
    tune: { weight: 700, tracking: '-0.01em', leading: 1.05 },
  },
];

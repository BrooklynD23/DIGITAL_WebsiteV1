/**
 * <SidekickStack>: the five SIDEKICK modules as one iso stack, top (01) → back (05), inside a never-started
 * phone shell (dashed, struck). Server-safe markup, hook-free. Static pose = fully open (no-JS, reduced motion, SSR);
 * a scroll driver (applyStackFrame) collapses and re-opens it. Real boards come from the club's KiCad files as
 * per-layer static SVGs (BoardLayers): no board geometry in the HTML or the client bundle.
 * `labels` draws E's locked name list beside the object: number, name, a dotted leader to the tier and an empty
 * (dashed) seat ring, because every seat is open. Labels are annotations of the figure (role="img").
 */
import type { CSSProperties } from 'react';
import { BoardLayers } from '../_system/boards/BoardLayers';
import { enclosure, modules } from '../_content/sidekick';
import { TIERS, STACK_W, STACK_H, ART_CX, LABEL_X, isoWidth, isoHeight, openCentre } from './geometry';
import { ComputeModule, EmptySeat, PhoneShell, PlannedModules, SensorModule } from './IsoModules';
import s from './stack.module.css';

export interface SidekickStackProps {
  readonly label: string;
  /** Draw the empty fingerprint seat used by the swap beat. */
  readonly seat?: boolean;
  /** The locked name list beside the stack. */
  readonly labels?: boolean;
  /** One annotation line under the art (e.g. "Every seat open."). Part of the figure; say it in `label` too. */
  readonly note?: string;
  /** Legend line at the top of the label column (e.g. which tiers are real files). Part of the figure. */
  readonly legend?: string;
  readonly className?: string;
}

const vars = (o: Record<string, string | number>): CSSProperties => o as CSSProperties;
const pct = (v: number): string => `${v.toFixed(3)}%`;

export function SidekickStack({ label, seat = false, labels = true, note, legend, className }: SidekickStackProps) {
  return (
    <div
      className={className ? `${s.stack} ${className}` : s.stack}
      role="img"
      aria-label={label}
      data-stack
      data-labels={labels ? '' : undefined}
      style={vars({ aspectRatio: `${STACK_W} / ${STACK_H}` })}
    >
      {TIERS.map((t) => {
        const mod = t.slot >= 0 && t.slot < modules.length ? modules[t.slot] : null;
        const pw = isoWidth(t.w, t.h);
        const ph = isoHeight(t.w, t.h);
        const pad = 0.04 * Math.max(t.w, t.h);
        const left = ART_CX - pw / 2;
        // Right corner of the iso footprint, in tier-box percentages: where the leader starts.
        const cornerX = ((pw - pad) / pw) * 100;
        const cornerY = ((0.5 * t.w + pad) / ph) * 100;
        const labelLeft = ((LABEL_X - left) / pw) * 100;
        const name = mod ? mod.name : t.id === 'shell-front' ? enclosure.name : null;
        const art = mod?.board ? (
          <BoardLayers board={mod.board} stableFrame={false} gap={t.subGap} label="" className={s.board} />
        ) : t.id === 'sensor' ? (
          <SensorModule w={t.w} h={t.h} />
        ) : t.id === 'compute' ? (
          <ComputeModule w={t.w} h={t.h} />
        ) : t.id === 'planned' ? (
          <PlannedModules w={t.w} h={t.h} />
        ) : (
          <PhoneShell w={t.w} h={t.h} side={t.id === 'shell-front' ? 'front' : 'back'} />
        );
        return (
          <div
            key={t.id}
            className={s.tier}
            data-tier={t.id}
            data-slot={t.slot}
            data-kind={mod ? (mod.board ? 'board' : mod.state) : 'shell'}
            aria-hidden="true"
            style={vars({
              left: pct((ART_CX / STACK_W) * 100),
              top: pct((openCentre(t.slot) / STACK_H) * 100),
              width: pct((pw / STACK_W) * 100),
              zIndex: 10 - t.slot,
            })}
          >
            <div className={s.art}>
              {seat && t.id === 'fingerprint' ? (
                <span className={s.seat}>
                  <EmptySeat w={t.w} h={t.h} />
                </span>
              ) : null}
              <div className={s.slide}>{art}</div>
            </div>
            {labels && name ? (
              <>
                <span className={s.leader} style={vars({ left: pct(cornerX), top: pct(cornerY), width: pct(labelLeft - cornerX) })} />
                <span className={s.name} style={vars({ left: pct(labelLeft), top: pct(cornerY) })}>
                  {mod ? (
                    <>
                      <span className={s.ring} />
                      <span className={s.num}>{String(mod.n).padStart(2, '0')}</span>
                      {mod.name}
                    </>
                  ) : (
                    <>
                      <span className={s.struckName}>{name}</span>
                      <span className={s.num}>{enclosure.word.toLowerCase()}</span>
                    </>
                  )}
                </span>
              </>
            ) : null}
          </div>
        );
      })}
      {legend ? (
        <span className={s.legend} aria-hidden="true" style={vars({ left: pct((LABEL_X / STACK_W) * 100) })}>
          {legend}
        </span>
      ) : null}
      {note ? (
        <span className={s.note} aria-hidden="true" style={vars({ left: pct((LABEL_X / STACK_W) * 100) })}>
          <span className={s.ring} />
          {note}
        </span>
      ) : null}
    </div>
  );
}

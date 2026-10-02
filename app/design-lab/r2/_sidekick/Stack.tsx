/**
 * <SidekickStack>: the five SIDEKICK modules as one iso stack, top (01) → back (05).
 * Server-safe markup. Static pose = fully open (no-JS, reduced motion, SSR); useStackDrive collapses and
 * re-opens it from scroll. Real boards come from the club's KiCad geometry via BoardSvg.
 */
import type { CSSProperties } from 'react';
import { BoardSvg, getBoard } from '../_system/boards';
import { modules } from '../_content/sidekick';
import { TIERS, STACK_W, STACK_H, isoWidth, isoHeight, openCentre } from './geometry';
import { ComputeModule, EmptySeat, PlannedModules, SensorModule } from './IsoModules';
import s from './stack.module.css';

export interface SidekickStackProps {
  readonly label: string;
  /** Draw the empty fingerprint seat used by the swap beat. */
  readonly seat?: boolean;
  /** Small mono tier numbers at the right edge. */
  readonly tags?: boolean;
  readonly className?: string;
}

const vars = (o: Record<string, string | number>): CSSProperties => o as CSSProperties;

export function SidekickStack({ label, seat = false, tags = true, className }: SidekickStackProps) {
  const last = TIERS.length - 1;
  return (
    <div
      className={className ? `${s.stack} ${className}` : s.stack}
      role="img"
      aria-label={label}
      data-stack
      style={vars({ aspectRatio: `${STACK_W} / ${STACK_H}` })}
    >
      {TIERS.map((t, i) => {
        const mod = modules[i];
        const pw = isoWidth(t.w, t.h);
        const ph = isoHeight(t.w, t.h);
        return (
          <div
            key={t.id}
            className={s.tier}
            data-tier={t.id}
            data-i={i}
            data-kind={mod.board ? 'board' : mod.state}
            aria-hidden="true"
            style={vars({
              '--cy': `${((openCentre(i) / STACK_H) * 100).toFixed(3)}%`,
              width: `${((pw / STACK_W) * 100).toFixed(3)}%`,
              '--ar': `${pw.toFixed(2)} / ${ph.toFixed(2)}`,
              '--g': t.subGap,
              zIndex: last - i + 1,
            })}
          >
            {seat && t.id === 'fingerprint' ? (
              <span className={s.seat}>
                <EmptySeat w={t.w} h={t.h} />
              </span>
            ) : null}
            <div className={s.slide}>
              {mod.board ? (
                <BoardSvg board={getBoard(mod.board)} iso stableFrame={false} className={s.board} />
              ) : t.id === 'sensor' ? (
                <SensorModule w={t.w} h={t.h} />
              ) : t.id === 'compute' ? (
                <ComputeModule w={t.w} h={t.h} />
              ) : (
                <PlannedModules w={t.w} h={t.h} />
              )}
            </div>
            {tags ? (
              <span className={s.tag} style={vars({ left: `${(50 + ((STACK_W * 0.5) / pw) * 100).toFixed(2)}%` })}>
                {String(mod.n).padStart(2, '0')}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

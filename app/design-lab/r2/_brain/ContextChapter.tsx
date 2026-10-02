'use client';

/**
 * The page's one scrubbed beat (ch4): a tall host whose scroll progress fills the context window.
 * Server text arrives as children; the host ref drives <ContextDemo>. Reduced motion: the pin collapses
 * (world CSS) and the window shows its rest pose, 95% full.
 */
import { useRef, type ReactNode } from 'react';
import { ContextDemo } from './DemosB';
import type { World } from './DemoShell';

export function ContextChapter({
  world,
  id,
  className,
  stickyClassName,
  textClassName,
  stageClassName,
  tone,
  labelledBy,
  children,
}: {
  readonly world: World;
  readonly id: string;
  readonly className: string;
  readonly stickyClassName: string;
  readonly textClassName: string;
  readonly stageClassName: string;
  readonly tone?: 'dark';
  readonly labelledBy: string;
  readonly children: ReactNode;
}) {
  const host = useRef<HTMLElement>(null);
  return (
    <section ref={host} id={id} className={className} data-tone={tone} aria-labelledby={labelledBy}>
      <div className={stickyClassName}>
        <div className={textClassName}>{children}</div>
        <div className={stageClassName}>
          <ContextDemo world={world} host={host} />
        </div>
      </div>
    </section>
  );
}

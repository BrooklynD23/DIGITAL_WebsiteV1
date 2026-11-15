'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconBox,
  IconBulb,
  IconClock,
  IconCompass,
  IconCpu,
  IconCpu2,
  IconDeviceMobileVibration,
  IconFingerprint,
  IconSun,
  IconTemperature,
  type Icon,
} from '@tabler/icons-react';
import { reel, subsystems } from '../../_content/sidekick';
import s from './reel.module.css';

/** One Tabler line icon per subsystem (same set as the footer socials, DESIGN §13.3). */
const ICONS: Record<(typeof subsystems.items)[number]['id'], Icon> = {
  'fpga-mainboard': IconCpu,
  'stm32-controller': IconCpu2,
  imu: IconCompass,
  'ambient-light-sensor': IconSun,
  'real-time-clock': IconClock,
  flashlight: IconBulb,
  haptics: IconDeviceMobileVibration,
  'fingerprint-sensor': IconFingerprint,
  'heat-sensor': IconTemperature,
  'mechanical-thermal': IconBox,
};

function Tiles({ copy }: { readonly copy?: boolean }) {
  return (
    <ul className={s.tiles} aria-hidden={copy || undefined}>
      {subsystems.items.map((x) => {
        const I = ICONS[x.id];
        return (
          <li key={x.id} className={s.tile}>
            <I size={32} stroke={1.25} aria-hidden="true" />
            <span className={s.name}>{x.name}</span>
            {x.part ? <span className={s.part}>{x.part}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * SIDEKICK join visual: the ten subsystems drift past on a CSS loop (the list is printed twice, the track slides by
 * half). It stops on hover, on Pause, off screen and in a hidden tab. #subsystems already lists the same ten, so the
 * tiles are hidden from screen readers and the reel is one labelled group with its Pause control.
 * Reduced motion: one static wrapped list, no Pause.
 */
export function SubsystemReel() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    const onVis = () => setTabHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const stopped = paused || !onScreen || tabHidden;

  return (
    <div className={s.group} role="group" aria-label={subsystems.headline}>
      <div ref={ref} className={s.reel} data-stopped={stopped || undefined}>
        <div className={s.track} aria-hidden="true">
          <Tiles />
          <Tiles copy />
        </div>
      </div>
      <button
        type="button"
        className={s.pause}
        aria-pressed={paused}
        aria-label={paused ? reel.playName : reel.pauseName}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? reel.play : reel.pause}
      </button>
    </div>
  );
}

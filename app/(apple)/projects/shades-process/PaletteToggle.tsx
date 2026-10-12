'use client';

/** MOCKUP review control: swaps the sketch palette on #sk-palette (server markup defaults to B). Not remembered. */
import { useState } from 'react';
import { palettes } from '../../_content/shades-process';
import k from './process.module.css';

export function PaletteToggle() {
  const [on, setOn] = useState('b');
  const pick = (id: string) => {
    setOn(id);
    document.getElementById('sk-palette')?.setAttribute('data-palette', id);
  };
  return (
    <div className={k.palette} role="group" aria-label={palettes.label.text}>
      <span className={k.paletteLabel}>{palettes.label.text}</span>
      {palettes.options.map((o) => (
        <button key={o.id} type="button" className={k.paletteBtn} aria-pressed={on === o.id} title={o.name.text} onClick={() => pick(o.id)}>
          <span aria-hidden="true">{o.id.toUpperCase()}</span>
          <span className="sr-only">{o.name.text}</span>
        </button>
      ))}
    </div>
  );
}

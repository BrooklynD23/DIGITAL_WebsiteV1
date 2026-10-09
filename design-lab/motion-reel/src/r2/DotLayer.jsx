import { useC } from './tokens.js';

const DASH = { solid: undefined, dashed: [4, 3], dotted: [1, 3] };

/**
 * Draws one dot-engine Frame inside an SVG, same mapping as DotGlyph/paintFrame
 * ((v * 0.92 + 1) * size / 2), centred on (cx, cy). `k` scales radii, strokes and dashes
 * (engine radii are px for the engine size; k = drawSize / engineSize).
 */
export function DotLayer({ f, cx, cy, size, k = 1, ink: inkProp, trigger: triggerProp, opacity = 1, stroke = 1.25 }) {
  const C = useC();
  const ink = inkProp ?? C.ink;
  const trigger = triggerProp ?? C.trigger;
  const ox = cx - size / 2;
  const oy = cy - size / 2;
  const px = (v) => ((v * 0.92 + 1) * size) / 2;
  const sw = stroke * k;
  return (
    <g opacity={opacity}>
      <g fill="none" stroke={ink} strokeWidth={sw} strokeLinecap="round">
        {f.lines.map((l, i) => (
          <line
            key={i}
            x1={ox + px(l.x1)}
            y1={oy + px(l.y1)}
            x2={ox + px(l.x2)}
            y2={oy + px(l.y2)}
            strokeOpacity={l.a}
            strokeDasharray={DASH[l.form] ? DASH[l.form].map((d) => d * k).join(' ') : undefined}
          />
        ))}
      </g>
      {f.dots.map((d, i) =>
        d.kind === 'hollow' ? (
          <circle
            key={i}
            cx={ox + px(d.x)}
            cy={oy + px(d.y)}
            r={d.r * k}
            fill="none"
            stroke={ink}
            strokeOpacity={d.a}
            strokeWidth={sw * 0.8}
            strokeDasharray={`${2 * k} ${1.5 * k}`}
          />
        ) : (
          <circle
            key={i}
            cx={ox + px(d.x)}
            cy={oy + px(d.y)}
            r={d.r * k}
            fill={d.kind === 'anchor' ? trigger : ink}
            fillOpacity={d.kind === 'anchor' ? 1 : d.a}
          />
        ),
      )}
    </g>
  );
}

/** Full-frame SVG on the clip ground. */
export function Stage({ width, height, children }) {
  const C = useC();
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, background: C.ground }}>
      {children}
    </svg>
  );
}

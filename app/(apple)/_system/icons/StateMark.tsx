/**
 * <StateMark> — Signal Capture's status-by-line-form. Colour never carries state.
 *   live    solid full-height pulse
 *   pending dashed pulse
 *   stale   half-height pulse
 *   paused  pulse struck through
 * Always pair with a visible word (the mark is aria-hidden unless `label` is given).
 */
import './icons.css';

export type ChannelState = 'live' | 'pending' | 'stale' | 'paused';

const PULSE = 'M2 16h5V8h7v8h8';
const HALF = 'M2 16h5v-4h7v4h8';

export function StateMark({
  state,
  size = 24,
  label,
  className,
}: {
  readonly state: ChannelState;
  readonly size?: number;
  readonly label?: string;
  readonly className?: string;
}) {
  const u = size / 24;
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      focusable="false"
      className={className ? `r2g r2g-state ${className}` : 'r2g r2g-state'}
      data-channel-state={state}
      style={{ ['--u' as string]: String(u) }}
      {...a11y}
    >
      <path
        className="r2g-hair"
        d="M2 20h20"
        style={{ opacity: 0.3 }}
      />
      <path
        className="r2g-line"
        d={state === 'stale' ? HALF : PULSE}
        style={{
          strokeDasharray: state === 'pending' ? `${4 * u}px ${3 * u}px` : 'none',
          opacity: state === 'paused' ? 0.55 : 1,
        }}
      />
      {state === 'paused' ? <path className="r2g-line" d="M4 21L20 3" style={{ strokeDasharray: 'none' }} /> : null}
    </svg>
  );
}

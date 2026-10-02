import { buildSignalChain, type ChainStageInput } from './schematic';
import s from './b.module.css';

interface Props {
  readonly stages: readonly ChainStageInput[];
  readonly titleId: string;
  readonly paceLabel: string;
}

/** Fig. 2 — DG-002 signal chain. Same generator, horizontal ≥ 900px, vertical below. */
export function SignalChain({ stages, titleId, paceLabel }: Props) {
  return (
    <>
      <ChainSvg stages={stages} titleId={titleId} paceLabel={paceLabel} vertical={false} width={720} className={s.chainWide} />
      <ChainSvg stages={stages} titleId={titleId} paceLabel={paceLabel} vertical width={320} className={s.chainCompact} />
    </>
  );
}

function ChainSvg({
  stages,
  titleId,
  paceLabel,
  vertical,
  width,
  className,
}: Props & { readonly vertical: boolean; readonly width: number; readonly className: string }) {
  const chain = buildSignalChain(stages, { vertical, width, feedbackTo: 1 });
  const descId = `${titleId}-${vertical ? 'v' : 'h'}-desc`;
  return (
    <svg
      className={`${s.chain} ${className}`}
      viewBox={`-2 -2 ${chain.width + (vertical ? 4 : 4)} ${chain.height + 4}`}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <desc id={descId}>
        {chain.stages.map((st) => `${st.label}: ${st.detail}`).join(', then ')}. The reader feeds back to {chain.stages[1]?.label}: {paceLabel.toLowerCase()}.
      </desc>
      <defs>
        <marker id={`arrow-${vertical ? 'v' : 'h'}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className={s.arrowHead} />
        </marker>
      </defs>
      {chain.links.map((d) => (
        <path key={d} d={d} className={s.chainLink} markerEnd={`url(#arrow-${vertical ? 'v' : 'h'})`} />
      ))}
      {chain.feedback && (
        <g>
          <path d={chain.feedback.d} className={s.feedback} markerEnd={`url(#arrow-${vertical ? 'v' : 'h'})`} />
          <text
            x={chain.feedback.labelX}
            y={chain.feedback.labelY}
            textAnchor={vertical ? 'start' : 'middle'}
            className={s.feedbackText}
            fontSize={10.5}
            transform={vertical ? `rotate(90 ${chain.feedback.labelX} ${chain.feedback.labelY})` : undefined}
          >
            {`PACE · ${paceLabel.toUpperCase()}`}
          </text>
        </g>
      )}
      {chain.stages.map((st) => (
        <g key={st.key}>
          <rect x={st.x} y={st.y} width={st.w} height={st.h} className={st.key === 'fpga' ? s.blockInk : s.block} />
          <text x={st.x + 8} y={st.y + 15} className={st.key === 'fpga' ? s.refInv : s.ref} fontSize={10}>
            {st.ref}
          </text>
          <text x={st.x + 8} y={st.y + (vertical ? 33 : 36)} className={st.key === 'fpga' ? s.chainLabelInv : s.chainLabel} fontSize={vertical ? 14 : 15}>
            {st.label.toUpperCase()}
          </text>
          <text
            x={vertical ? st.x + st.w - 8 : st.x + 8}
            y={vertical ? st.y + 33 : st.y + 54}
            textAnchor={vertical ? 'end' : 'start'}
            className={st.key === 'fpga' ? s.chainDetailInv : s.chainDetail}
            fontSize={10}
          >
            {st.detail}
          </text>
        </g>
      ))}
    </svg>
  );
}

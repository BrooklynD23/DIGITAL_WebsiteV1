import { STAGE_ORDER } from '../../_hero/contract';
import { PhoneArtwork } from '../../_hero/PhoneArtwork';

// Dev review page: the four poses of the one phone, static, no JS.
export default function HeroStillsPage() {
  return (
    <main style={{ background: '#000', color: '#f5f5f7', minHeight: '100vh', overflowX: 'hidden' }}>
      {STAGE_ORDER.map((stage) => (
        <section key={stage} style={{ position: 'relative', borderBottom: '1px solid rgba(245,245,247,0.12)' }}>
          <p
            style={{
              position: 'absolute',
              top: 12,
              left: 16,
              margin: 0,
              font: '11px/1 ui-monospace, monospace',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}
          >
            {stage}
          </p>
          <PhoneArtwork stage={stage} />
        </section>
      ))}
    </main>
  );
}

'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type KeyboardCoordinateGetter,
} from '@dnd-kit/core';
import { motion } from 'motion/react';
import { ALL_SEATS, RECORDS, type BuildRecord, type PhoneLayerId, type Seat } from './content';
import { PixelPhone } from './PixelArt';
import { Rsvp } from './Rsvp';
import { NameTag } from './NameTag';
import { PixelIcon } from './icons';
import { useSign } from './SignProvider';
import styles from './f.module.css';

const TAG_ID = 'name-tag';
const SEAT_ORDER = ALL_SEATS.map((s) => s.id);
const seatById = (id: string | number | undefined | null): Seat | undefined =>
  id == null ? undefined : ALL_SEATS.find((s) => s.id === String(id));
const seatLabel = (s: Seat) => `${s.title}, ${s.projectCode} ${s.projectTitle}`;

/** Arrow keys jump seat to seat in reading order instead of nudging 25px. */
const seatToSeat: KeyboardCoordinateGetter = (event, { context }) => {
  const forward = event.code === 'ArrowRight' || event.code === 'ArrowDown';
  const back = event.code === 'ArrowLeft' || event.code === 'ArrowUp';
  if (!forward && !back) return undefined;
  event.preventDefault();
  const { collisionRect, droppableRects, over } = context;
  if (!collisionRect) return undefined;
  const ids = SEAT_ORDER.filter((id) => droppableRects.has(id));
  if (ids.length === 0) return undefined;
  const current = over ? ids.indexOf(String(over.id)) : -1;
  const next =
    current === -1 ? (forward ? 0 : ids.length - 1) : (current + (forward ? 1 : -1) + ids.length) % ids.length;
  const rect = droppableRects.get(ids[next]);
  if (!rect) return undefined;
  return {
    x: rect.left + (rect.width - collisionRect.width) / 2,
    y: rect.top + (rect.height - collisionRect.height) / 2,
  };
};

/** Pointer: drop where the pointer is. Keyboard (no pointer): nearest seat centre. */
const collision: CollisionDetection = (args) =>
  args.pointerCoordinates ? pointerWithin(args) : closestCenter(args);

const announcements: Announcements = {
  onDragStart: () => 'Picked up your name tag.',
  onDragOver: ({ over }) => {
    const s = seatById(over?.id);
    return s ? `Over ${seatLabel(s)}.` : 'Not over a seat.';
  },
  onDragEnd: ({ over }) => {
    const s = seatById(over?.id);
    return s ? `Name tag placed on ${seatLabel(s)}. Your sheet below is filled in.` : 'Name tag put back.';
  },
  onDragCancel: () => 'Cancelled. The name tag is back where it was.',
};

const instructions = {
  draggable:
    'To pick up your name tag, press Space or Enter. Use the arrow keys to move from seat to seat. Press Space or Enter to place it, or Escape to cancel. Every seat also has its own button.',
};

function DraggableTag({ size }: { readonly size: 'tray' | 'slot' }) {
  const { name } = useSign();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: TAG_ID });
  return (
    <NameTag
      ref={setNodeRef}
      size={size}
      ghost={isDragging}
      className={styles.tagHandle}
      {...attributes}
      {...listeners}
      aria-label={`Your name tag${name.trim() ? `: ${name.trim()}` : ''}. Draggable.`}
    />
  );
}

interface SeatSlotProps {
  readonly seat: Seat;
  readonly showLine: boolean;
  readonly onPeek: (seat: Seat | null) => void;
}

function SeatSlot({ seat, showLine, onPeek }: SeatSlotProps) {
  const { seatId, placeTag, ready, name } = useSign();
  const { setNodeRef, isOver } = useDroppable({ id: seat.id });
  const mine = seatId === seat.id;
  const who = name.trim() || 'my name';
  return (
    <li
      ref={setNodeRef}
      className={styles.seat}
      data-over={isOver ? '' : undefined}
      data-mine={mine ? '' : undefined}
      onMouseEnter={() => onPeek(seat)}
      onMouseLeave={() => onPeek(null)}
      onFocus={() => onPeek(seat)}
      onBlur={() => onPeek(null)}
    >
      <span className={styles.seatTitle}>{seat.title}</span>
      {showLine && <span className={styles.seatLine}>{seat.line}</span>}
      <div className={styles.seatFoot}>
      <span className={styles.seatSign}>
        <span className={styles.mono}>Built by</span>
        {mine ? (
          <motion.span
            className={styles.seatTag}
            initial={{ scale: 1.25, opacity: 0, rotate: -4 }}
            animate={{ scale: 1, opacity: 1, rotate: -1.5 }}
            transition={{ type: 'spring', stiffness: 520, damping: 26 }}
          >
            <DraggableTag size="slot" />
          </motion.span>
        ) : (
          <span className={styles.blank} aria-label="unsigned">
            ______
          </span>
        )}
      </span>
      {ready ? (
        mine ? (
          <button type="button" className={styles.seatBtn} onClick={() => placeTag(null)}>
            <PixelIcon name="close" />
            <span>
              Take it back<span className={styles.srOnly}> from {seatLabel(seat)}</span>
            </span>
          </button>
        ) : (
          <button type="button" className={styles.seatBtn} onClick={() => placeTag(seat.id)}>
            <PixelIcon name="arrow-right" />
            <span>
              Put {who} here<span className={styles.srOnly}>: {seatLabel(seat)}</span>
            </span>
          </button>
        )
      ) : (
        <a className={styles.seatBtn} href="/contact/?type=project-team">
          Ask about this seat<span className={styles.srOnly}>: {seatLabel(seat)}</span>
        </a>
      )}
      </div>
    </li>
  );
}

function Plate({ label }: { readonly label: string }) {
  return (
    <div className={styles.plate} role="img" aria-label={`Photo placeholder: ${label}`}>
      <span className={styles.mono}>[ {label} ]</span>
      <span className={styles.mono}>[placeholder]</span>
    </div>
  );
}

function Figure({ record, highlight }: { readonly record: BuildRecord; readonly highlight: readonly PhoneLayerId[] }) {
  if (record.id === 'dg-001') {
    return (
      <div className={styles.figure}>
        <PixelPhone className={styles.phoneArt} highlight={highlight} />
        <p className={styles.figCaption}>
          <span className={styles.mono}>Fig. 1</span> Seven layers. Hover a seat to see what it touches.
        </p>
        {record.plate && <Plate label={record.plate} />}
      </div>
    );
  }
  if (record.id === 'dg-002') {
    return (
      <div className={styles.figure}>
        <Rsvp />
        {record.plate && <Plate label={record.plate} />}
      </div>
    );
  }
  if (record.id === 'vs') {
    return (
      <p className={styles.ledgerFig} aria-label="Scope becomes a budget, a sponsor brief, then a pitch.">
        <span>scope</span>
        <PixelIcon name="arrow-right" />
        <span>budget</span>
        <PixelIcon name="arrow-right" />
        <span>brief</span>
        <PixelIcon name="arrow-right" />
        <span>pitch</span>
      </p>
    );
  }
  return (
    <p className={styles.ghostCode} aria-hidden="true">
      {record.code}
    </p>
  );
}

function RecordSheet({
  record,
  highlight,
  onPeek,
}: {
  readonly record: BuildRecord;
  readonly highlight: readonly PhoneLayerId[];
  readonly onPeek: (seat: Seat | null) => void;
}) {
  const headingId = useId();
  return (
    <article className={styles.record} data-record={record.id} data-kind={record.kind} aria-labelledby={headingId}>
      <header className={styles.recordHead}>
        <span className={styles.recordCode}>{record.code}</span>
        <span className={styles.mono}>{record.kind === 'program' ? 'Program' : record.kind === 'open' ? 'Open record' : 'Build'}</span>
      </header>
      <h3 id={headingId} className={styles.recordTitle}>
        {record.title}
      </h3>
      <p className={styles.recordProblem}>{record.problem}</p>
      <p className={styles.recordLine}>{record.line}</p>
      <Figure record={record} highlight={highlight} />
      <dl className={styles.fields}>
        {record.fields.map((f) => (
          <div key={f.k} className={styles.field}>
            <dt className={styles.mono}>{f.k}</dt>
            <dd>
              {f.v}
              {f.flag && <span className={styles.flag}> [{f.flag}]</span>}
            </dd>
          </div>
        ))}
      </dl>
      <h4 className={styles.seatsHead}>
        <span className={styles.mono}>Put a name on</span>
      </h4>
      <ul className={styles.seats} data-count={record.seats.length}>
        {record.seats.map((s) => (
          <SeatSlot key={s.id} seat={s} showLine={record.id !== 'dg-002'} onPeek={onPeek} />
        ))}
      </ul>
      {record.href && (
        <a className={styles.recordLink} href={record.href}>
          <span>{record.hrefLabel}</span>
          <PixelIcon name="arrow-right" />
        </a>
      )}
    </article>
  );
}

function ListView() {
  const { seatId, placeTag, name } = useSign();
  return (
    <div className={styles.listWrap}>
      <table className={styles.list}>
        <caption className={styles.srOnly}>Every seat on the bench, as a list</caption>
        <thead>
          <tr>
            <th scope="col">Record</th>
            <th scope="col">Seat</th>
            <th scope="col">Built by</th>
            <th scope="col">
              <span className={styles.srOnly}>Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ALL_SEATS.map((s) => {
            const mine = seatId === s.id;
            return (
              <tr key={s.id} data-mine={mine ? '' : undefined}>
                <td>
                  <span className={styles.mono}>{s.projectCode}</span> {s.projectTitle}
                </td>
                <th scope="row">{s.title}</th>
                <td>{mine ? name.trim() || 'you' : '______'}</td>
                <td>
                  <button type="button" className={styles.seatBtn} onClick={() => placeTag(mine ? null : s.id)}>
                    {mine ? 'Take it back' : 'Put my name here'}
                    <span className={styles.srOnly}>: {seatLabel(s)}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Tray({ view, setView }: { readonly view: 'bench' | 'list'; readonly setView: (v: 'bench' | 'list') => void }) {
  const { seat, placeTag, ready } = useSign();
  if (!ready) {
    return (
      <div className={styles.tray}>
        <p className={styles.trayText}>
          Each seat below is a part of a real build. <a href="#thursday">Ask about one on Thursday.</a>
        </p>
      </div>
    );
  }
  return (
    <div className={styles.tray}>
      <div className={styles.traySlot}>{seat ? <span className={styles.trayEmpty} aria-hidden="true" /> : <DraggableTag size="tray" />}</div>
      <p className={styles.trayText} aria-live="polite">
        {seat ? (
          <>
            Your tag is on <strong>{seat.projectCode} · {seat.title}</strong>.{' '}
            <a href="#sheet">Read your sheet</a> or{' '}
            <button type="button" className={styles.inlineBtn} onClick={() => placeTag(null)}>
              take it back
            </button>
            .
          </>
        ) : (
          <>
            <span className={`${styles.trayLead} ${styles.finePointer}`}>Drag your tag onto a part you&rsquo;d own.</span>
            <span className={`${styles.trayLead} ${styles.coarsePointer}`}>Tap a seat&rsquo;s button, or drag your tag.</span>{' '}
            <span className={styles.trayHint}>Or press a seat&rsquo;s button. Keyboard: focus the tag, Space, arrows, Space.</span>
          </>
        )}
      </p>
      <div className={styles.viewToggle} role="group" aria-label="Bench view">
        <button type="button" aria-pressed={view === 'bench'} onClick={() => setView('bench')}>
          <PixelIcon name="drag-and-drop" />
          <span>Bench</span>
        </button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
          <PixelIcon name="list" />
          <span>List</span>
        </button>
      </div>
    </div>
  );
}

export function Bench({ children }: { readonly children: ReactNode }) {
  const { placeTag, seat } = useSign();
  const [view, setView] = useState<'bench' | 'list'>('bench');
  const [peek, setPeek] = useState<Seat | null>(null);
  const [overSeat, setOverSeat] = useState<Seat | null>(null);
  const [dragging, setDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: seatToSeat }),
  );

  const highlight = useMemo<readonly PhoneLayerId[]>(
    () => (overSeat ?? peek ?? seat)?.layers ?? [],
    [overSeat, peek, seat],
  );

  const onDragOver = (e: DragOverEvent) => setOverSeat(seatById(e.over?.id) ?? null);
  const onDragEnd = (e: DragEndEvent) => {
    setDragging(false);
    setOverSeat(null);
    const s = seatById(e.over?.id);
    if (s) placeTag(s.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      onDragStart={() => setDragging(true)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        setDragging(false);
        setOverSeat(null);
      }}
      accessibility={{ announcements, screenReaderInstructions: instructions }}
    >
      {children}
      <Tray view={view} setView={setView} />
      {view === 'bench' ? (
        <div className={styles.records} data-dragging={dragging ? '' : undefined}>
          {RECORDS.map((r) => (
            <RecordSheet key={r.id} record={r} highlight={r.id === 'dg-001' ? highlight : []} onPeek={setPeek} />
          ))}
        </div>
      ) : (
        <ListView />
      )}
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' }}>
        {dragging ? <NameTag size="tray" lifted /> : null}
      </DragOverlay>
    </DndContext>
  );
}

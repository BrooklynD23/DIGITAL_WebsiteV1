// Single source of truth for the reel timeline (frames @ 30 fps). Mirrors the timing
// table in design-lab/concepts/motion-reel.md. v2: scene 01 trimmed by 22 frames, end
// card holds longer, the BUILT BY line collapses into the opening dot (seamless loop).

export const DURATION = 465; // 15.5 s

export const SCENES = Object.freeze([
  { id: 'open', from: 0, to: 28, chapter: '01  BUILD NIGHT' },
  { id: 'work', from: 28, to: 138, chapter: '02  THE WORK' },
  { id: 'own', from: 138, to: 250, chapter: '03  OWNERSHIP' },
  { id: 'rsvp', from: 250, to: 332, chapter: '04  ONE WORD AT A TIME' },
  { id: 'thesis', from: 332, to: 380, chapter: '05  THE STANDARD' },
  { id: 'sign', from: 380, to: DURATION, chapter: '06  SIGN IT' },
]);

export const T = Object.freeze({
  // 01 build night: the dot is already present at frame 0 (it is the loop seam)
  captionType: [6, 22],
  captionOut: [26, 32],
  // 02 the work
  ringIn: 28, // + i * ringStagger
  ringStagger: 4,
  flatStart: 80,
  flatFrames: 34,
  highlight: [128, 136],
  workExit: [138, 154],
  // 03 ownership (enters only after 02 has fully left)
  ownMeta: [154, 168],
  ownTitle: [156, 176],
  track: [156, 180],
  stations: [174, 192, 210, 228],
  ownExit: [250, 260],
  // 04 RSVP
  rsvpIn: [256, 270],
  rsvpWord0: 272,
  rsvpWordFrames: 8, // 225 wpm on screen; the device lets the reader set the pace
  rsvpExit: [330, 340],
  // 05 thesis
  thesisLine1: 334,
  thesisLine2: 340,
  // 06 sign-off
  builtBy: [382, 394],
  signLine: [384, 404],
  details: 390, // + i * 4, 14-frame ramp each
  cursorOn: 400,
  // loop seam
  seamFade: [448, 458], // everything except the signature line fades
  seamCollapse: [448, 458], // line shrinks to a 24px dot at its centre
  seamTravel: [452, DURATION - 1], // dot travels to frame centre = frame 0 hub
  poster: 430,
});

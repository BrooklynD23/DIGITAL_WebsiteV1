# dnd kit (https://dndkit.com; next.dndkit.com 301 -> dndkit.com)
Category: drag-and-drop toolkit (interaction). Screenshot: design-lab/references/dnd-kit/desktop.png (page screenshot step timed out after tokens extracted; no mobile/scroll shots - recorded honestly).
Docs chrome: Inter 700 30px, primary #596dff, JetBrains Mono, white bg. Docs now lead with the new "@dnd-kit/react" and list the old API under "Legacy".
## Two packages (npm view / bundlephobia)
| pkg | version | peers | gzip |
| @dnd-kit/core (+sortable 10.0.0) | 6.3.1 | react >=16.8 | core 14.2 KB, sortable 3.7 KB |
| @dnd-kit/react (new) | 0.5.0 (latest; 0.5.1 beta tag exists) | react ^18 \|\| ^19 | ~33 KB (pulls @dnd-kit/dom, abstract) |
=> BOTH work on React 18 / Next 14. @dnd-kit/react is pre-1.0 (0.x) so API may shift; @dnd-kit/core is stable but legacy. Quickstart (new): `useDraggable({id})` / `useDroppable({id})` return `ref`; wrap in `DragDropProvider` with `onDragEnd`; `@dnd-kit/helpers` for sortable. Client-only components; static export OK. Built-in keyboard + screen-reader announcements (accessibility win) - not tested here.
## Fit
Real DIGITAL uses: sortable/filterable project board, "build your team" discipline picker, drag-to-assemble phone parts toy, kanban-style "how teams work" illustration. Must have non-drag alternative (buttons/keyboard) and touch-action care on mobile. Don't add DnD just as flourish.
Steal: (1) interaction that demonstrates "how a team assembles a product"; (2) keyboard-accessible sort; (3) drag overlay with physical shadow/snap.
Avoid: drag gimmicks hiding core content; relying on pointer-only; adopting 0.x API for a long-lived site without pinning.
Direction fit: C Creative Technology, E Startup/Product Studio (workflow demo), D (team-building toy), F. Weak for A.

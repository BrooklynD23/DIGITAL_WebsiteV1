import { control } from '../../_content/shades-control';

/**
 * The typeset page: the site's own sentences, set live. The scanpath line, then the reader text, read as one
 * paragraph: "Along a line, your eyes jump, stop, then jump. The words arrive one at a time, right where you look.
 * Your eyes hold still. The sentence comes to you, at the pace you choose."
 */
export const WORDS: readonly string[] = [...control.lineText, ...control.pageWords];

/** The held word ("still."): its first occurrence, inside "Your eyes hold still." */
export const FOCUS = WORDS.indexOf(control.heldWord);

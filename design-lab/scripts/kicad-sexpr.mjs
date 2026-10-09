// Minimal S-expression reader for KiCad 9 files (.kicad_pcb / .kicad_sch).
// A node is an array: [head, ...items]; atoms are strings (numbers stay strings until read with num()).

export function parseSexpr(src) {
  let i = 0;
  const n = src.length;
  const stack = [];
  let root = null;
  while (i < n) {
    const c = src[i];
    if (c === '(') {
      const node = [];
      if (stack.length) stack[stack.length - 1].push(node);
      else root = node;
      stack.push(node);
      i += 1;
    } else if (c === ')') {
      stack.pop();
      i += 1;
    } else if (c === '"') {
      let j = i + 1;
      let out = '';
      while (j < n && src[j] !== '"') {
        if (src[j] === '\\' && j + 1 < n) {
          out += src[j + 1];
          j += 2;
        } else {
          out += src[j];
          j += 1;
        }
      }
      stack[stack.length - 1].push(out);
      i = j + 1;
    } else if (c === ' ' || c === '\n' || c === '\r' || c === '\t') {
      i += 1;
    } else {
      let j = i;
      while (j < n && !' \n\r\t()"'.includes(src[j])) j += 1;
      stack[stack.length - 1].push(src.slice(i, j));
      i = j;
    }
  }
  if (!root) throw new Error('kicad-sexpr: no root expression');
  return root;
}

export const isNode = (x) => Array.isArray(x);
export const head = (node) => (isNode(node) ? node[0] : undefined);
export const kids = (node, name) => node.filter((x) => isNode(x) && x[0] === name);
export const kid = (node, name) => node.find((x) => isNode(x) && x[0] === name);
export const num = (x) => Number.parseFloat(x);

/** Value of a child like (layer "F.Cu") → "F.Cu". */
export const val = (node, name) => {
  const k = kid(node, name);
  return k ? k[1] : undefined;
};

/** Point from (start x y) / (at x y [rot]) / (xy x y). */
export const pt = (node, name) => {
  const k = name ? kid(node, name) : node;
  return k ? [num(k[1]), num(k[2])] : undefined;
};

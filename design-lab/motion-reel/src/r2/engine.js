// The live pages' dot engine, imported by relative path so clips and pages share one motion language.
// Pure TS modules; Remotion's esbuild loader strips the types.
export { frame, restFrame, baseRadius } from '../../../../app/design-lab/r2/_system/dots/engine';
export {
  TAU, clamp, lerp, seg, easeInOut, easeOut, easeIn, easeOutBack, hash, shash, fibDir, project, shade, shapePoint,
} from '../../../../app/design-lab/r2/_system/dots/math';
export { latticeDisc, coreOrb } from '../../../../app/design-lab/r2/_system/dots/verbs-build';
export { getBoard } from '../../../../app/design-lab/r2/_system/boards/index';

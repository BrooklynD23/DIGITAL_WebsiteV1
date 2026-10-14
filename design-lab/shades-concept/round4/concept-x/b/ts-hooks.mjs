/* Lets plain node import the app's TS modules: Node's built-in type stripping, plus extensionless `.ts` resolution.
   node --import ./ts-hooks.mjs audit.mjs --audit */
import { registerHooks } from 'node:module';

registerHooks({
  resolve(spec, ctx, next) {
    try {
      return next(spec, ctx);
    } catch (e) {
      if (!spec.startsWith('.') || /\.[cm]?[jt]sx?$/.test(spec)) throw e;
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        try {
          return next(spec + ext, ctx);
        } catch {}
      }
      throw e;
    }
  },
});

import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

// Same scope as the old `next lint` (app/, lib/); archive/ is not built.
export default defineConfig([
  globalIgnores(['archive/**']),
  ...nextCoreWebVitals,
  {
    // ponytail: React Compiler rules new in eslint-config-next 16 (react-hooks 7); off because the compiler is not enabled.
    // 20 hits in shared stage code (locked SIDEKICK/BRAIN depend on it). Turn on with `reactCompiler: true`.
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
    },
  },
]);

# Known Issues & Troubleshooting

This document covers common issues encountered during development and their solutions.

---

## 1. ESLint Version Mismatch

### Symptoms
```
npm warn peer eslint@">=9.0.0" from eslint-config-next@16.1.1
npm warn Conflicting peer dependency: eslint@9.39.2
```

### Cause
Running `npm audit fix --force` can upgrade `eslint-config-next` to a version incompatible with the current ESLint version.

- `eslint-config-next@16.x` requires `eslint@>=9.0.0`
- `eslint-config-next@14.x` works with `eslint@8.x`

### Solution
Keep `eslint-config-next` version aligned with your Next.js version:

```json
{
  "devDependencies": {
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

Then reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prevention
Avoid using `npm audit fix --force`. Instead:
1. Run `npm audit` to see vulnerabilities
2. Manually update packages that are safe to upgrade
3. For breaking changes, evaluate if the upgrade is necessary

---

## 2. White Page / 404 Errors in Dev Mode

### Symptoms
- Browser shows white page
- Console shows: `GET http://localhost:3000/ 404 (Not Found)`
- Terminal shows: `Ready in XXXms` but pages don't load

### Cause
`next.config.js` has `output: 'export'` which disables the dev server and is only for static builds.

### Solution
Make the export conditional on production:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use 'export' for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

---

## 3. Missing Error Boundary Components

### Symptoms
```
missing required error components, refreshing...
```

### Cause
Next.js App Router requires `error.tsx` and `global-error.tsx` files in the `app/` directory.

### Solution
Create these files:

**`app/error.tsx`**
```tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <button onClick={() => reset()}>Try again</button>
      </div>
    </div>
  )
}
```

**`app/global-error.tsx`**
```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

---

## 4. SWC/Lockfile Patching Errors

### Symptoms
```
Found lockfile missing swc dependencies, patching...
Failed to patch lockfile, please try uninstalling and reinstalling next
TypeError: Cannot read properties of undefined (reading 'os')
```

### Cause
The lockfile is out of sync with the SWC binaries needed for your platform.

### Solution
Clean reinstall:

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
```

**WSL/Linux/Mac:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Note
If you see file lock errors on Windows, close VS Code and any terminals before running the commands.

---

## 5. 'next' is not recognized as a command

### Symptoms
```
'next' is not recognized as an internal or external command
```

### Cause
- `node_modules` not installed in current environment
- Installed in WSL but running from Windows PowerShell (or vice versa)

### Solution
Run `npm install` from the same terminal environment where you run `npm run dev`.

---

## General Tips

1. **Keep dependencies aligned**: Match `eslint-config-next` version with your Next.js version
2. **Don't use --force blindly**: `npm audit fix --force` can introduce breaking changes
3. **Clean install when stuck**: When facing mysterious issues, a clean reinstall often helps
4. **Check next.config.js**: Many build/dev issues stem from configuration
5. **Separate environments**: If using WSL, run all npm commands from WSL consistently

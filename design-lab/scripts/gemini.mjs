// Gemini helper for the design lab. Reads GEMINI_API_KEY from the worktree .env.local; never prints it.
//
// Critique media (screenshots, frames, screen recordings) with a vision/video model:
//   node design-lab/scripts/gemini.mjs critique "<prompt>" <file...> [--model=gemini-pro-latest] [--out=path.md]
// Generate one image (labeled placeholder art / textures only; never fake people presented as members):
//   node design-lab/scripts/gemini.mjs image "<prompt>" <out.png> [--model=gemini-3.1-flash-image]
// Plain text call (smoke test):
//   node design-lab/scripts/gemini.mjs text "<prompt>"
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://generativelanguage.googleapis.com';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const INLINE_LIMIT = 18 * 1024 * 1024;
const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
};

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envFile = join(ROOT, '.env.local');
  if (existsSync(envFile)) {
    const line = readFileSync(envFile, 'utf8').split('\n').find((l) => l.startsWith('GEMINI_API_KEY='));
    if (line) return line.slice('GEMINI_API_KEY='.length).trim();
  }
  throw new Error('GEMINI_API_KEY not found (expected in worktree .env.local)');
}

const key = loadKey();
const headers = { 'x-goog-api-key': key };

async function uploadLarge(path, mime) {
  const size = statSync(path).size;
  const start = await fetch(`${API}/upload/v1beta/files`, {
    method: 'POST',
    headers: {
      ...headers,
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String(size),
      'X-Goog-Upload-Header-Content-Type': mime,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { display_name: path.split('/').pop() } }),
  });
  const url = start.headers.get('x-goog-upload-url');
  if (!url) throw new Error(`upload start failed: HTTP ${start.status}`);
  const done = await fetch(url, {
    method: 'POST',
    headers: { 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize' },
    body: readFileSync(path),
  });
  let file = (await done.json()).file;
  // Videos need server-side processing before they can be referenced.
  while (file.state === 'PROCESSING') {
    await new Promise((r) => setTimeout(r, 3000));
    file = await (await fetch(`${API}/v1beta/${file.name}`, { headers })).json();
  }
  if (file.state !== 'ACTIVE') throw new Error(`file ${path} ended in state ${file.state}`);
  return { file_data: { mime_type: mime, file_uri: file.uri } };
}

async function mediaPart(path) {
  const mime = MIME[extname(path).toLowerCase()];
  if (!mime) throw new Error(`unsupported file type: ${path}`);
  if (statSync(path).size > INLINE_LIMIT) return uploadLarge(path, mime);
  return { inline_data: { mime_type: mime, data: readFileSync(path).toString('base64') } };
}

async function generate(model, parts, extra = {}) {
  const res = await fetch(`${API}/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts }], ...extra }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`${model}: ${json.error.status} ${json.error.message}`);
  return json.candidates?.[0]?.content?.parts ?? [];
}

const [mode, prompt, ...rest] = process.argv.slice(2);
const flag = (name, fallback) => rest.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const files = rest.filter((a) => !a.startsWith('--'));

if (mode === 'text') {
  const parts = await generate(flag('model', 'gemini-flash-latest'), [{ text: prompt }]);
  console.log(parts.map((p) => p.text ?? '').join(''));
} else if (mode === 'critique') {
  if (!files.length) throw new Error('critique needs at least one media file');
  const media = await Promise.all(files.map(mediaPart));
  const parts = await generate(flag('model', 'gemini-pro-latest'), [...media, { text: prompt }]);
  const text = parts.map((p) => p.text ?? '').join('');
  const out = flag('out');
  if (out) { writeFileSync(out, text); console.log(`saved ${out}`); } else console.log(text);
} else if (mode === 'image') {
  const [outPath] = files;
  if (!outPath) throw new Error('image needs an output path');
  const parts = await generate(flag('model', 'gemini-3.1-flash-image'), [{ text: prompt }], {
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  });
  const img = parts.find((p) => p.inlineData || p.inline_data);
  if (!img) throw new Error('model returned no image');
  writeFileSync(outPath, Buffer.from((img.inlineData ?? img.inline_data).data, 'base64'));
  console.log(`saved ${outPath}`);
} else {
  console.log('usage: gemini.mjs <text|critique|image> "<prompt>" [files...] [--model=..] [--out=..]');
  process.exit(1);
}

#!/usr/bin/env node
/**
 * Validates vercel.json against Vercel's allowed top-level keys.
 * Fails CI if unknown keys (e.g. _comment) would block deployment.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ALLOWED_TOP_LEVEL_KEYS = new Set([
  '$schema',
  'buildCommand',
  'cleanUrls',
  'crons',
  'env',
  'framework',
  'functions',
  'git',
  'headers',
  'ignoreCommand',
  'images',
  'installCommand',
  'outputDirectory',
  'public',
  'redirects',
  'regions',
  'rewrites',
  'routes',
  'trailingSlash',
  'version',
]);

const path = resolve(process.cwd(), 'vercel.json');
let config;

try {
  config = JSON.parse(readFileSync(path, 'utf8'));
} catch (err) {
  console.error(`vercel.json: failed to parse — ${err.message}`);
  process.exit(1);
}

const keys = Object.keys(config);
const invalid = keys.filter((key) => !ALLOWED_TOP_LEVEL_KEYS.has(key));

if (invalid.length > 0) {
  console.error(
    `vercel.json: disallowed top-level key(s): ${invalid.join(', ')}`,
  );
  console.error('Move documentation to docs/PRE-LAUNCH.md or docs/DEPLOYMENT.md.');
  process.exit(1);
}

if (!config.$schema) {
  console.error('vercel.json: missing $schema');
  process.exit(1);
}

if (!config.git?.deploymentEnabled?.deployment) {
  console.error('vercel.json: git.deploymentEnabled.deployment must be true');
  process.exit(1);
}

console.log('vercel.json: schema guard passed');

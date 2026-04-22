/**
 * Analytics Event Catalog Checker
 *
 * Ensures every trackEvent() call in src/ uses a name documented in docs/ANALYTICS.md.
 * Also warns (without failing) if a documented event is never fired.
 *
 * Usage: npm run check:analytics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ANALYTICS_MD = path.join(__dirname, '../docs/ANALYTICS.md');
const SRC_DIR = path.join(__dirname, '../src');

// ANSI colors
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

function log(color, msg) {
  process.stdout.write(`${colors[color]}${msg}${colors.reset}\n`);
}

// ---------------------------------------------------------------------------
// 1. Parse documented event names from ANALYTICS.md
// ---------------------------------------------------------------------------
function parseDocumentedEvents(mdPath) {
  const content = fs.readFileSync(mdPath, 'utf8');
  const events = new Set();
  // Match backtick-quoted names in the first column of the event table
  // Lines like: | `order_cta_click` | ...
  const rowRe = /^\|\s*`([a-z_]+)`\s*\|/gm;
  let m;
  while ((m = rowRe.exec(content)) !== null) {
    events.add(m[1]);
  }
  return events;
}

// ---------------------------------------------------------------------------
// 2. Collect all JS/JSX source files recursively (skip __tests__ dirs)
// ---------------------------------------------------------------------------
function collectFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip test directories — test files may use dummy event names
      if (entry.name === '__tests__' || entry.name === 'test') continue;
      collectFiles(full, results);
    } else if (/\.(js|jsx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Strip JS comments from source so we don't match event names in comments
// ---------------------------------------------------------------------------
function stripComments(src) {
  // Remove block comments (/** ... */ and /* ... */)
  let out = src.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove line comments (// ...)
  out = out.replace(/\/\/.*/g, '');
  return out;
}

// ---------------------------------------------------------------------------
// 3. Extract event names fired in a file
// NOTE:
// This script does NOT detect dynamically constructed event names.
// All analytics events must use string literals.
// Using variables for event names will bypass this check.
// ---------------------------------------------------------------------------
function extractFiredEvents(fileContent) {
  const fired = [];

  // Pattern A: trackEvent('event_name', ...) or trackEvent("event_name", ...)
  const directRe = /trackEvent\(\s*['"]([a-z_]+)['"]/g;
  let m;
  while ((m = directRe.exec(fileContent)) !== null) {
    fired.push(m[1]);
  }

  // Pattern B: analyticsEvent={{ event: 'event_name', ... }} (object prop form)
  const objectPropRe = /analyticsEvent=\{\{?\s*event:\s*['"]([a-z_]+)['"]/g;
  while ((m = objectPropRe.exec(fileContent)) !== null) {
    fired.push(m[1]);
  }

  // Pattern C: analyticsEvent="event_name" (bare string prop — should be gone, but handle it)
  const stringPropRe = /analyticsEvent="([a-z_]+)"/g;
  while ((m = stringPropRe.exec(fileContent)) !== null) {
    fired.push(m[1]);
  }

  return fired;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  log('cyan', '\nAnalytics Event Catalog Check\n' + '='.repeat(40));

  if (!fs.existsSync(ANALYTICS_MD)) {
    log('red', `ERROR: ${ANALYTICS_MD} not found.`);
    process.exit(1);
  }

  const documented = parseDocumentedEvents(ANALYTICS_MD);
  log('cyan', `Documented events (${documented.size}): ${[...documented].join(', ')}`);

  const files = collectFiles(SRC_DIR);
  log('cyan', `Scanning ${files.length} source files in ${SRC_DIR}…\n`);

  const violations = []; // { file, event }
  const firedAll = new Set();

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const content = stripComments(raw);
    const fired = extractFiredEvents(content);
    for (const ev of fired) {
      firedAll.add(ev);
      if (!documented.has(ev)) {
        violations.push({ file: path.relative(path.join(__dirname, '..'), filePath), event: ev });
      }
    }
  }

  // Report violations (hard failures)
  if (violations.length > 0) {
    log('red', `${colors.bold}FAIL — undocumented event names found:${colors.reset}`);
    for (const { file, event } of violations) {
      log('red', `  • "${event}" in ${file}`);
    }
    log('red', '\nAdd these event names to docs/ANALYTICS.md before committing.\n');
    process.exit(1);
  }

  log('green', 'All fired event names are documented.\n');

  // Reverse-check: documented events not fired anywhere (warnings only)
  const neverFired = [...documented].filter((ev) => !firedAll.has(ev));
  if (neverFired.length > 0) {
    log('yellow', `WARN — documented events never fired in src/:`);
    for (const ev of neverFired) {
      log('yellow', `  • "${ev}"`);
    }
    log('yellow', '');
  }

  log('green', 'check:analytics passed.\n');
  process.exit(0);
}

main();

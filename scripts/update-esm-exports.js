#!/usr/bin/env node

/**
 * Update PIE element package.json exports to add opt-in ESM subpaths.
 *
 * Keeps existing exports unchanged (non-disruptive), and adds:
 * - ./esm -> ./esm/element.js
 * - ./configure/esm -> ./esm/configure.js (if configure/src/index.js exists)
 * - ./controller/esm -> ./esm/controller.js (if controller/src/index.js exists)
 * - ./print/esm -> ./esm/print.js (if src/print.js exists)
 *
 * Blacklisted packages are skipped (they won't have ESM builds).
 */

/* eslint-disable no-console */
const { readdirSync } = require('fs');
const { pathExistsSync, readJsonSync, writeJsonSync } = require('fs-extra');
const { join, resolve } = require('path');

const root = resolve(__dirname, '..');
const packagesDir = join(root, 'packages');

const blacklist = new Set([
  'calculator',
  'hotspot',
  'math-inline',
  'math-templated',
  'protractor',
  'ruler',
  'select-text',
]);

const isElementPkg = (pkgDir) => pathExistsSync(join(pkgDir, 'src', 'index.js'));

function ensureExports(pkgDir, pkgJson) {
  if (!pkgJson.exports || typeof pkgJson.exports !== 'object') {
    return { changed: false, reason: 'no exports object' };
  }

  const exportsObj = { ...pkgJson.exports };
  let changed = false;

  // Always add opt-in element ESM export
  if (!exportsObj['./esm']) {
    exportsObj['./esm'] = './esm/element.js';
    changed = true;
  }

  if (pathExistsSync(join(pkgDir, 'configure', 'src', 'index.js'))) {
    if (!exportsObj['./configure/esm']) {
      exportsObj['./configure/esm'] = './esm/configure.js';
      changed = true;
    }
  }

  if (pathExistsSync(join(pkgDir, 'controller', 'src', 'index.js'))) {
    if (!exportsObj['./controller/esm']) {
      exportsObj['./controller/esm'] = './esm/controller.js';
      changed = true;
    }
  }

  if (pathExistsSync(join(pkgDir, 'src', 'print.js'))) {
    if (!exportsObj['./print/esm']) {
      exportsObj['./print/esm'] = './esm/print.js';
      changed = true;
    }
  }

  if (!changed) return { changed: false, reason: 'already up to date' };

  pkgJson.exports = exportsObj;
  return { changed: true };
}

async function main() {
  const dirs = readdirSync(packagesDir);
  const changed = [];
  const skipped = [];

  for (const dir of dirs) {
    if (blacklist.has(dir)) {
      skipped.push({ dir, reason: 'blacklisted' });
      continue;
    }
    const pkgDir = join(packagesDir, dir);
    const pkgPath = join(pkgDir, 'package.json');
    if (!pathExistsSync(pkgPath)) continue;

    const pkgJson = readJsonSync(pkgPath);
    if (pkgJson.private) continue;
    if (!isElementPkg(pkgDir)) continue;

    const r = ensureExports(pkgDir, pkgJson);
    if (r.changed) {
      writeJsonSync(pkgPath, pkgJson, { spaces: 2 });
      changed.push(dir);
    } else {
      skipped.push({ dir, reason: r.reason });
    }
  }

  console.log(`Updated exports in ${changed.length} packages.`);
  if (skipped.length) {
    console.log(`Skipped ${skipped.length} packages.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



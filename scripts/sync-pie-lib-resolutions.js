#!/usr/bin/env node
/**
 * Sync the root package.json `resolutions` block with the @pie-lib/* versions
 * declared across the workspace packages.
 *
 * Run automatically after `npm-check-updates` bumps every package's @pie-lib/*
 * deps (see the `update-pie-lib` / `update-pie-lib-next` npm scripts). It:
 *   1. Collects the version each @pie-lib/* package uses across packages/*.
 *   2. Fails (exit 1) if any @pie-lib/* package is declared at more than one
 *      version, since that defeats deduping under yarn/Bun.
 *   3. Rewrites the @pie-lib/* entries in root `resolutions`:
 *        - direct deps  -> the exact version used in the workspace
 *        - transitive-only deps already in resolutions but not declared in any
 *          package (e.g. editable-html, math-evaluator, plot, scoring-config,
 *          style-utils, math-rendering-accessible) -> latest published version.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const packagesDir = path.join(root, 'packages');
const subDirs = ['', 'configure', 'controller', 'print'];

const stripRange = (v) => v.replace(/^[\^~]/, '');

const collectDeclared = () => {
  const declared = {};
  for (const dir of fs.readdirSync(packagesDir)) {
    for (const sub of subDirs) {
      const pkgPath = path.join(packagesDir, dir, sub, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      let pkg;
      try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      } catch (e) {
        console.error(`[sync-resolutions] could not parse ${pkgPath}: ${e.message}`);
        process.exit(1);
      }
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
      };
      for (const [name, ver] of Object.entries(deps)) {
        if (!name.startsWith('@pie-lib/')) continue;
        (declared[name] = declared[name] || new Set()).add(stripRange(ver));
      }
    }
  }
  return declared;
};

const declared = collectDeclared();

const mismatches = Object.entries(declared).filter(([, versions]) => versions.size > 1);
if (mismatches.length) {
  console.error('[sync-resolutions] pie-lib version mismatch across packages:');
  for (const [name, versions] of mismatches) {
    console.error(`  ${name}: ${[...versions].sort().join(', ')}`);
  }
  console.error('[sync-resolutions] resolve these before syncing resolutions.');
  process.exit(1);
}

const rootPkgPath = path.join(root, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const resolutions = rootPkg.resolutions || {};

const changes = [];
for (const key of Object.keys(resolutions)) {
  if (!key.startsWith('@pie-lib/')) continue;

  let next;
  if (declared[key]) {
    next = [...declared[key]][0];
  } else {
    try {
      next = execSync(`npm view ${key} version`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) {
      console.warn(`[sync-resolutions] could not fetch latest for ${key}; leaving as-is`);
      continue;
    }
  }

  if (next && next !== resolutions[key]) {
    changes.push(`  ${key}: ${resolutions[key]} -> ${next}`);
    resolutions[key] = next;
  }
}

if (!changes.length) {
  console.log('[sync-resolutions] resolutions already in sync; no changes.');
  process.exit(0);
}

rootPkg.resolutions = resolutions;
fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
console.log('[sync-resolutions] updated @pie-lib/* resolutions:');
console.log(changes.join('\n'));

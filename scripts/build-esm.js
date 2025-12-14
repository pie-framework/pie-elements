#!/usr/bin/env node

/**
 * Build ESM bundles for PIE element packages.
 *
 * Output per package:
 * - esm/element.js
 * - esm/configure.js (if configure/src/index.js exists)
 * - esm/controller.js (if controller/src/index.js exists)
 * - esm/print.js (if src/print.js exists)
 * - esm/package.json with { "type": "module" }
 *
 * This is intentionally independent of existing build outputs (lib/, dist/, module/).
 */

/* eslint-disable no-console */
const { rollup } = require('rollup');
const {
  readdirSync,
  pathExistsSync,
  mkdirSync,
  readJsonSync,
  writeJsonSync,
} = require('fs-extra');
const { resolve, join } = require('path');
const createConfig = require('../rollup.config.js').default;

const packagesDir = resolve(__dirname, '../packages');

// Blacklist packages with legacy CommonJS source or known ESM incompatibilities (PD-5245).
const BLACKLIST = new Set([
  'calculator',
  'hotspot',
  'math-inline',
  'math-templated',
  'protractor',
  'ruler',
  'select-text',
]);

function listPackages() {
  return readdirSync(packagesDir).filter((dir) => {
    const pkgPath = join(packagesDir, dir, 'package.json');
    if (!pathExistsSync(pkgPath)) return false;
    const pkg = readJsonSync(pkgPath);
    if (pkg.private) return false;
    if (BLACKLIST.has(dir)) return false;
    return true;
  });
}

async function buildEntry(pkgDir, entryRel, outRel) {
  const input = join(pkgDir, entryRel);
  if (!pathExistsSync(input)) return null;

  const esmDir = join(pkgDir, 'esm');
  mkdirSync(esmDir, { recursive: true });

  const esmPkgJson = join(esmDir, 'package.json');
  if (!pathExistsSync(esmPkgJson)) {
    writeJsonSync(esmPkgJson, { type: 'module' }, { spaces: 2 });
  }

  const outputFile = join(esmDir, outRel);
  const config = createConfig(input, outputFile);

  try {
    const bundle = await rollup(config);
    await bundle.write(config.output);
    await bundle.close();
    return outRel;
  } catch (e) {
    console.error(`  ❌ failed: ${entryRel} -> ${outRel}: ${e.message}`);
    return null;
  }
}

async function buildPackage(pkgName) {
  const pkgDir = join(packagesDir, pkgName);
  const pkg = readJsonSync(join(pkgDir, 'package.json'));

  console.log(`📦 ${pkg.name}`);

  const built = [];

  const element = await buildEntry(pkgDir, 'src/index.js', 'element.js');
  if (element) built.push(element);

  const configure = await buildEntry(
    pkgDir,
    'configure/src/index.js',
    'configure.js'
  );
  if (configure) built.push(configure);

  const controller = await buildEntry(
    pkgDir,
    'controller/src/index.js',
    'controller.js'
  );
  if (controller) built.push(controller);

  const print = await buildEntry(pkgDir, 'src/print.js', 'print.js');
  if (print) built.push(print);

  if (built.length) {
    console.log(`  ✅ built: ${built.join(', ')}`);
  } else {
    console.log('  ⏭️  no ESM entries found');
  }
}

async function main() {
  const start = Date.now();
  const pkgs = listPackages();

  console.log(`Building ESM for ${pkgs.length} packages...`);
  if (BLACKLIST.size) {
    console.log(`Blacklist: ${[...BLACKLIST].join(', ')}`);
  }
  console.log();

  for (const p of pkgs) {
    // eslint-disable-next-line no-await-in-loop
    await buildPackage(p);
    console.log();
  }

  const dur = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`Done in ${dur}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



/**
 * Minimal ESM integrity check for pie-elements.
 *
 * For element bundles we avoid executing them in Node (they may touch DOM globals).
 * Instead we verify:
 * - expected esm/* artifacts exist (for non-blacklisted packages with source entrypoints)
 * - the files are non-empty and look like ESM output
 */

import { readdirSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
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

const isDir = async (p) => {
  try {
    const s = await stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
};

const isFile = async (p) => {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
};

async function assertLooksReasonable(filePath) {
  const content = await readFile(filePath, 'utf8');
  if (content.trim().length < 50) return 'too small';
  // Rollup ESM bundles generally contain at least one `export` or `import`.
  if (!content.includes('export ') && !content.includes('import ')) return 'not obviously ESM';
  return null;
}

async function main() {
  const pkgs = readdirSync(packagesDir).filter((p) => !blacklist.has(p));
  const failures = [];

  for (const p of pkgs) {
    const pkgDir = join(packagesDir, p);
    // eslint-disable-next-line no-await-in-loop
    if (!(await isDir(pkgDir))) continue;

    const srcIndex = join(pkgDir, 'src', 'index.js');
    // eslint-disable-next-line no-await-in-loop
    if (!(await isFile(srcIndex))) continue; // skip non-element folders

    const esmDir = join(pkgDir, 'esm');
    const element = join(esmDir, 'element.js');

    // eslint-disable-next-line no-await-in-loop
    if (!(await isFile(element))) {
      failures.push(`${p}: missing esm/element.js`);
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const reason = await assertLooksReasonable(element);
    if (reason) failures.push(`${p}: esm/element.js ${reason}`);
  }

  if (failures.length) {
    console.error(`ESM integrity failures (${failures.length}):`);
    for (const f of failures) console.error(`- ${f}`);
    process.exit(1);
  }

  console.log(`ESM integrity OK (${pkgs.length} packages scanned, blacklist: ${[...blacklist].join(', ')})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



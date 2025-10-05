#!/usr/bin/env node

/**
 * Build ESM bundles for all PIE elements
 * 
 * Creates parallel ESM build track in esm/ directory:
 * - element.js (main question UI)
 * - configure.js (authoring UI)
 * - controller.js (server-side logic)
 * - print.js (print view)
 */

const { rollup } = require('rollup');
const { readdirSync, pathExistsSync, mkdirSync, readJsonSync, writeJsonSync } = require('fs-extra');
const { resolve, join } = require('path');
const createConfig = require('../rollup.config.js').default;

const packagesDir = resolve(__dirname, '../packages');

// Blacklist packages with CommonJS source code (matching PSLB config)
// Packages that can't be built as ESM due to CommonJS source or other issues
const BLACKLIST = [
  'demo',           // Not a publishable package
  'pie-toolbox',    // Internal tooling
];

const packages = readdirSync(packagesDir).filter(dir => {
  const pkgPath = join(packagesDir, dir, 'package.json');
  if (!pathExistsSync(pkgPath)) return false;
  const pkg = readJsonSync(pkgPath);
  if (pkg.private) return false; // Skip private packages
  if (BLACKLIST.includes(dir)) {
    console.log(`⏭️  Skipping ${dir} (blacklisted - CommonJS source)`);
    return false;
  }
  return true;
});

console.log(`🔨 Building ESM bundles for ${packages.length} packages...\n`);

async function buildEntry(pkgDir, entry, outputName) {
  const input = join(pkgDir, entry);
  if (!pathExistsSync(input)) {
    return null;
  }

  const esmDir = join(pkgDir, 'esm');
  mkdirSync(esmDir, { recursive: true });
  
  const output = join(esmDir, outputName);
  
  try {
    const config = createConfig(input, output);
    const bundle = await rollup(config);
    await bundle.write(config.output);
    await bundle.close();
    return outputName;
  } catch (error) {
    console.error(`  ❌ Failed to build ${outputName}:`, error.message);
    return null;
  }
}

async function buildPackage(pkgName) {
  const pkgDir = join(packagesDir, pkgName);
  const pkg = readJsonSync(join(pkgDir, 'package.json'));
  
  console.log(`📦 ${pkg.name}`);
  
  const built = [];
  
  // Build main element
  const element = await buildEntry(pkgDir, 'src/index.js', 'element.js');
  if (element) built.push(element);
  
  // Build configure (authoring UI)
  const configure = await buildEntry(pkgDir, 'configure/src/index.js', 'configure.js');
  if (configure) built.push(configure);
  
  // Build controller (server-side)
  const controller = await buildEntry(pkgDir, 'controller/src/index.js', 'controller.js');
  if (controller) built.push(controller);
  
  // Build print view
  const print = await buildEntry(pkgDir, 'src/print.js', 'print.js');
  if (print) built.push(print);
  
  if (built.length > 0) {
    console.log(`  ✅ Built: ${built.join(', ')}`);
  } else {
    console.log(`  ⏭️  No ESM entries found`);
  }
  
  console.log();
}

/**
 * Update package.json exports (run once during setup)
 * 
 * Note: The exports field should be committed to git and not updated
 * on every build. Only run this if you need to regenerate exports.
 * 
 * To regenerate all exports, uncomment the call in buildPackage()
 */
function updatePackageExports(pkgDir, builtEntries) {
  const pkgPath = join(pkgDir, 'package.json');
  const pkg = readJsonSync(pkgPath);
  
  const exports = {};
  
  // Main entry (element.js)
  if (builtEntries.includes('element.js')) {
    exports['.'] = {
      import: './esm/element.js',
      require: './lib/index.js',
      default: './esm/element.js',
    };
  }
  
  // Configure (authoring UI)
  if (builtEntries.includes('configure.js')) {
    exports['./configure'] = {
      import: './esm/configure.js',
      require: './configure/lib/index.js',
      default: './esm/configure.js',
    };
  }
  
  // Controller (server-side)
  if (builtEntries.includes('controller.js')) {
    exports['./controller'] = {
      import: './esm/controller.js',
      require: './controller/lib/index.js',
      default: './esm/controller.js',
    };
  }
  
  // Print view
  if (builtEntries.includes('print.js')) {
    exports['./print'] = {
      import: './esm/print.js',
      require: './lib/print.js',
      default: './esm/print.js',
    };
  }
  
  pkg.exports = exports;
  writeJsonSync(pkgPath, pkg, { spaces: 2 });
  console.log(`  📝 Updated exports (${Object.keys(exports).length} entries)`);
}

async function main() {
  const startTime = Date.now();
  
  for (const pkg of packages) {
    await buildPackage(pkg);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✨ ESM build complete in ${duration}s`);
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});


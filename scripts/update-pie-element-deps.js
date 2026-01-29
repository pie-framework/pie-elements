#!/usr/bin/env node
/**
 * Script to update @pie-element dependencies across all packages after publishing
 * 
 * Usage:
 *   node scripts/update-pie-element-deps.js @pie-element/package-name 12.0.0-beta.1
 * 
 * This will find all packages that depend on the specified package and update
 * their version to the new version provided.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const packageName = args._[0];
const newVersion = args._[1];

if (!packageName || !newVersion) {
  console.error('Usage: node scripts/update-pie-element-deps.js <package-name> <new-version>');
  console.error('Example: node scripts/update-pie-element-deps.js @pie-element/categorize 12.0.0-beta.1');
  process.exit(1);
}

if (!packageName.startsWith('@pie-element/')) {
  console.error('Error: Package name must start with @pie-element/');
  process.exit(1);
}

console.log(`Updating dependencies for ${packageName} to version ${newVersion}...\n`);

// Find all package.json files
const packagesDir = path.resolve(__dirname, '../packages');
const rootPackageJson = path.resolve(__dirname, '../package.json');

function findPackageJsonFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and other non-package directories
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        files.push(...findPackageJsonFiles(fullPath));
      }
    } else if (entry.name === 'package.json') {
      files.push(fullPath);
    }
  }
  
  return files;
}

const packageJsonFiles = [
  rootPackageJson,
  ...findPackageJsonFiles(packagesDir)
];

let updatedCount = 0;
const updatedFiles = [];

// Process each package.json
for (const filePath of packageJsonFiles) {
  try {
    const pkg = fs.readJsonSync(filePath);
    let updated = false;
    
    // Check dependencies
    if (pkg.dependencies && pkg.dependencies[packageName]) {
      const oldVersion = pkg.dependencies[packageName];
      if (oldVersion !== newVersion) {
        console.log(`  ${path.relative(process.cwd(), filePath)}: dependencies.${packageName}`);
        console.log(`    ${oldVersion} -> ${newVersion}`);
        pkg.dependencies[packageName] = newVersion;
        updated = true;
      }
    }
    
    // Check devDependencies
    if (pkg.devDependencies && pkg.devDependencies[packageName]) {
      const oldVersion = pkg.devDependencies[packageName];
      if (oldVersion !== newVersion) {
        console.log(`  ${path.relative(process.cwd(), filePath)}: devDependencies.${packageName}`);
        console.log(`    ${oldVersion} -> ${newVersion}`);
        pkg.devDependencies[packageName] = newVersion;
        updated = true;
      }
    }
    
    // Check resolutions (in root package.json)
    if (pkg.resolutions && pkg.resolutions[packageName]) {
      const oldVersion = pkg.resolutions[packageName];
      if (oldVersion !== newVersion) {
        console.log(`  ${path.relative(process.cwd(), filePath)}: resolutions.${packageName}`);
        console.log(`    ${oldVersion} -> ${newVersion}`);
        pkg.resolutions[packageName] = newVersion;
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeJsonSync(filePath, pkg, { spaces: 2 });
      updatedFiles.push(filePath);
      updatedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

if (updatedCount === 0) {
  console.log(`\nNo packages found that depend on ${packageName}`);
} else {
  console.log(`\n✓ Updated ${updatedCount} file(s):`);
  updatedFiles.forEach(file => {
    console.log(`  - ${path.relative(process.cwd(), file)}`);
  });
  console.log(`\nNext steps:`);
  console.log(`  1. Run: yarn install`);
  console.log(`  2. Test your changes`);
  console.log(`  3. Commit the updated package.json files`);
}

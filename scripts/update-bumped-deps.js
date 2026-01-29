#!/usr/bin/env node
/**
 * Update dependencies for packages that were bumped
 */

const fs = require('fs-extra');
const path = require('path');

const versionMap = {
  '@pie-element/boilerplate-item-type': '6.0.0-beta.1',
  '@pie-element/calculator': '8.0.0-beta.1',
  '@pie-element/categorize': '12.0.0-beta.1',
  '@pie-element/charting': '11.0.0-beta.1',
  '@pie-element/complex-rubric': '6.0.0-beta.2',
  '@pie-element/drag-in-the-blank': '9.0.0-beta.1',
  '@pie-element/drawing-response': '11.0.0-beta.1',
  '@pie-element/ebsr': '13.0.0-beta.1',
  '@pie-element/explicit-constructed-response': '10.0.0-beta.1',
  '@pie-element/extended-text-entry': '14.0.0-beta.1',
  '@pie-element/fraction-model': '5.0.0-beta.1',
  '@pie-element/graphing-solution-set': '5.0.0-beta.1',
  '@pie-element/graphing': '9.0.0-beta.1',
  '@pie-element/hotspot': '10.0.0-beta.1',
  '@pie-element/image-cloze-association': '9.0.0-beta.1',
  '@pie-element/inline-dropdown': '9.0.0-beta.1',
  '@pie-element/likert': '3.0.0-beta.1',
  '@pie-element/match-list': '6.0.0-beta.1',
  '@pie-element/match': '11.0.0-beta.1',
  '@pie-element/math-inline': '11.0.0-beta.1',
  '@pie-element/math-templated': '6.0.0-beta.1',
  '@pie-element/matrix': '3.0.0-beta.1',
  '@pie-element/multi-trait-rubric': '7.0.0-beta.1',
  '@pie-element/multiple-choice': '12.0.0-beta.1',
  '@pie-element/number-line': '12.0.0-beta.1',
  '@pie-element/passage': '6.0.0-beta.1',
  '@pie-element/placement-ordering': '13.0.0-beta.1',
  '@pie-element/protractor': '7.0.0-beta.1',
  '@pie-element/rubric': '7.0.0-beta.1',
  '@pie-element/ruler': '9.0.0-beta.1',
  '@pie-element/select-text': '12.0.0-beta.1',
};

function findPackageJsonFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        files.push(...findPackageJsonFiles(fullPath));
      }
    } else if (entry.name === 'package.json') {
      files.push(fullPath);
    }
  }
  
  return files;
}

const packagesDir = path.resolve(__dirname, '../packages');
const packageJsonFiles = findPackageJsonFiles(packagesDir);

let updatedCount = 0;
const updatedFiles = [];

console.log('Checking dependencies...\n');

for (const filePath of packageJsonFiles) {
  try {
    const pkg = fs.readJsonSync(filePath);
    let updated = false;
    
    // Skip if this is one of the packages being bumped (don't update self)
    if (pkg.name && versionMap[pkg.name]) {
      continue;
    }
    
    // Check dependencies
    if (pkg.dependencies) {
      for (const [depName, newVersion] of Object.entries(versionMap)) {
        if (pkg.dependencies[depName]) {
          const oldVersion = pkg.dependencies[depName];
          // Update if version doesn't match (allowing for ^ prefix)
          const normalizedOld = oldVersion.replace(/^[\^~]/, '');
          const normalizedNew = newVersion;
          
          if (normalizedOld !== normalizedNew && !normalizedOld.startsWith(normalizedNew)) {
            const prefix = oldVersion.match(/^[\^~]/)?.[0] || '';
            const updatedVersion = prefix + newVersion;
            
            console.log(`  ${path.relative(process.cwd(), filePath)}: dependencies.${depName}`);
            console.log(`    ${oldVersion} -> ${updatedVersion}`);
            pkg.dependencies[depName] = updatedVersion;
            updated = true;
          }
        }
      }
    }
    
    // Check devDependencies
    if (pkg.devDependencies) {
      for (const [depName, newVersion] of Object.entries(versionMap)) {
        if (pkg.devDependencies[depName]) {
          const oldVersion = pkg.devDependencies[depName];
          const normalizedOld = oldVersion.replace(/^[\^~]/, '');
          const normalizedNew = newVersion;
          
          if (normalizedOld !== normalizedNew && !normalizedOld.startsWith(normalizedNew)) {
            const prefix = oldVersion.match(/^[\^~]/)?.[0] || '';
            const updatedVersion = prefix + newVersion;
            
            console.log(`  ${path.relative(process.cwd(), filePath)}: devDependencies.${depName}`);
            console.log(`    ${oldVersion} -> ${updatedVersion}`);
            pkg.devDependencies[depName] = updatedVersion;
            updated = true;
          }
        }
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
  console.log('✓ All dependencies are already up to date!');
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

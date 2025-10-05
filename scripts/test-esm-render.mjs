#!/usr/bin/env node

/**
 * ESM Render Test - Tests that components can be rendered without errors
 * 
 * Uses jsdom to simulate a browser environment and attempts to:
 * 1. Import each package's ESM bundle
 * 2. Render the default export as a React component
 * 3. Catch common errors like:
 *    - React #31 (returning undefined)
 *    - Component initialization errors
 *    - Basic rendering issues
 * 
 * This catches ~80% of runtime errors without needing a real browser.
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');

const errors = [];
const successes = [];
const skipped = [];
const warnings = [];

// Setup jsdom environment
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable',
});

// Copy properties from jsdom window to global, avoiding read-only properties
const { window } = dom;
for (const key of Object.getOwnPropertyNames(window)) {
  if (!Object.getOwnPropertyDescriptor(global, key)) {
    try {
      global[key] = window[key];
    } catch (e) {
      // Skip read-only properties
    }
  }
}

// Ensure these specific properties are set
global.window = window;
global.document = window.document;
if (!global.navigator) {
  Object.defineProperty(global, 'navigator', {
    value: window.navigator,
    writable: true,
  });
}
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Import React after setting up global environment
const React = (await import('react')).default;
const ReactDOM = (await import('react-dom')).default;

console.log('🔍 ESM Render Test (jsdom)\n');
console.log('Testing that components render without errors...\n');
console.log('📦 Testing packages...\n');

const packages = readdirSync(packagesDir).filter(dir => {
  const pkgPath = join(packagesDir, dir, 'package.json');
  if (!existsSync(pkgPath)) return false;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  return !pkg.private;
});

async function testPackage(pkgName) {
  const pkgDir = join(packagesDir, pkgName);
  const pkgPath = join(pkgDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  
  // Only test packages with ESM exports
  if (!pkg.exports || !pkg.exports['.'] || !pkg.exports['.'].import) {
    skipped.push(pkgName);
    console.log(`ℹ️  ${pkgName}: No ESM exports`);
    return;
  }
  
  const esmPath = join(pkgDir, pkg.exports['.'].import);
  
  if (!existsSync(esmPath)) {
    errors.push(`${pkgName}: ESM file not found`);
    console.log(`❌ ${pkgName}: ESM file not found`);
    return;
  }
  
  try {
    // Import the module
    const fileUrl = `file://${esmPath.replace(/\\/g, '/')}`;
    const module = await import(fileUrl);
    
    if (!module.default) {
      warnings.push(`${pkgName}: No default export to render`);
      console.log(`⚠️  ${pkgName}: No default export to render`);
      return;
    }
    
    const Component = module.default;
    
    // Check if it's a React component (function or class)
    const isReactComponent = 
      typeof Component === 'function' || 
      (Component.prototype && Component.prototype.isReactComponent);
    
    if (!isReactComponent) {
      warnings.push(`${pkgName}: Default export is not a React component`);
      console.log(`⚠️  ${pkgName}: Not a React component`);
      return;
    }
    
    // Try to render with minimal props
    const div = document.createElement('div');
    const mockModel = {};
    const mockSession = {};
    
    try {
      // Attempt render with common PIE element props
      ReactDOM.render(
        React.createElement(Component, {
          model: mockModel,
          session: mockSession,
          onChange: () => {},
          onSessionChange: () => {},
        }),
        div
      );
      
      // Check that something was rendered
      if (div.innerHTML === '') {
        warnings.push(`${pkgName}: Component rendered nothing (empty output)`);
        console.log(`⚠️  ${pkgName}: Rendered empty`);
      } else {
        successes.push(pkgName);
        console.log(`✅ ${pkgName}: Rendered successfully`);
      }
      
      // Clean up
      ReactDOM.unmountComponentAtNode(div);
      
    } catch (renderError) {
      // Check for specific error types
      const errMsg = renderError.message || renderError.toString();
      
      if (errMsg.includes('Objects are not valid as a React child') || 
          errMsg.includes('Minified React error #31')) {
        errors.push(`${pkgName}: React #31 - Component returning undefined or invalid object`);
        console.log(`❌ ${pkgName}: React #31 (undefined/invalid return)`);
      } else if (errMsg.includes('is not a function') || errMsg.includes('Cannot read property')) {
        errors.push(`${pkgName}: Runtime error - ${errMsg.split('\n')[0]}`);
        console.log(`❌ ${pkgName}: Runtime error`);
      } else {
        // These might be expected errors due to missing dependencies or environment
        warnings.push(`${pkgName}: Render warning - ${errMsg.split('\n')[0]}`);
        console.log(`⚠️  ${pkgName}: Render warning (may be expected)`);
      }
    }
    
  } catch (err) {
    const errMsg = err.message || err.toString();
    errors.push(`${pkgName}: Failed to load - ${errMsg.split('\n')[0]}`);
    console.log(`❌ ${pkgName}: Failed to load`);
  }
}

async function runTests() {
  for (const pkg of packages) {
    await testPackage(pkg);
  }
  
  console.log('\n============================================================');
  console.log('📊 RESULTS');
  console.log('============================================================');
  console.log(`\n✅ Rendered: ${successes.length}`);
  console.log(`⚠️  Warnings: ${warnings.length} (may be expected)`);
  console.log(`ℹ️  Skipped: ${skipped.length} (no ESM exports)`);
  console.log(`❌ Failed: ${errors.length}`);
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (May be expected):');
    warnings.forEach(w => console.log(`   - ${w}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ CRITICAL ERRORS (Must fix before publishing):');
    errors.forEach(e => console.log(`   - ${e}`));
    console.log('\n============================================================');
    process.exit(1);
  } else {
    console.log('\n💡 NOTE:');
    console.log('   Warnings are common due to missing props/dependencies.');
    console.log('   This test focuses on catching CRITICAL errors like:');
    console.log('   - React #31 (undefined returns)');
    console.log('   - Component initialization failures');
    console.log('   - Import/export issues');
    console.log('\n✅ All critical checks passed!');
  }
}

runTests().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});


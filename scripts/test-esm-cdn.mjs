#!/usr/bin/env node

/**
 * Automated ESM CDN Availability Test
 * 
 * Tests that published ESM bundles are accessible via esm.sh and cdn.jsdelivr.net
 * This can be run as part of CI/CD to verify published packages work.
 * 
 * Run: node scripts/test-esm-cdn.mjs [version]
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');

// Parse command line args
const testVersion = process.argv[2] || 'latest';

// CDNs to test
const CDNS = [
  { name: 'esm.sh', url: 'https://esm.sh' },
  { name: 'jsdelivr', url: 'https://cdn.jsdelivr.net/npm' },
];

// Key packages to test (especially the ones we fixed)
const TEST_PACKAGES = [
  'hotspot',
  'math-inline',
  'math-templated',
  'multiple-choice',
  'passage',
  'categorize',
];

console.log('🌐 ESM CDN Availability Test\n');
console.log(`📦 Testing version: ${testVersion}`);
console.log('');

const results = {
  passed: 0,
  failed: 0,
  details: [],
};

async function testPackage(cdn, packageName) {
  const pkgName = `@pie-element/${packageName}`;
  const url = testVersion === 'latest' 
    ? `${cdn.url}/${pkgName}/esm/element.js`
    : `${cdn.url}/${pkgName}@${testVersion}/esm/element.js`;
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (response.ok) {
      console.log(`   ✅ ${packageName} - Available (${response.status})`);
      results.passed++;
      results.details.push({
        package: packageName,
        cdn: cdn.name,
        status: 'success',
        code: response.status,
      });
      return true;
    } else {
      console.log(`   ❌ ${packageName} - Failed (${response.status})`);
      results.failed++;
      results.details.push({
        package: packageName,
        cdn: cdn.name,
        status: 'failed',
        code: response.status,
      });
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`   ⏱️  ${packageName} - Timeout`);
    } else {
      console.log(`   ❌ ${packageName} - Error: ${error.message}`);
    }
    results.failed++;
    results.details.push({
      package: packageName,
      cdn: cdn.name,
      status: 'error',
      error: error.message,
    });
    return false;
  }
}

async function runTests() {
  for (const cdn of CDNS) {
    console.log(`\n📡 Testing ${cdn.name} (${cdn.url})`);
    console.log('─'.repeat(60));
    
    for (const packageName of TEST_PACKAGES) {
      await testPackage(cdn, packageName);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 FINAL RESULTS');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('');
  
  if (results.failed === 0) {
    console.log('🎉 All tests passed! ESM bundles are accessible via CDN.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check the details above.');
    console.log('');
    console.log('💡 If testing unpublished packages:');
    console.log('   • Publish the packages first');
    console.log('   • Wait a few minutes for CDN propagation');
    console.log('   • Run this test again');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});


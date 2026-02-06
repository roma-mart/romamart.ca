#!/usr/bin/env node

/**
 * Ensure deployment only happens from main branch
 * Prevents accidental production deploys from feature branches
 */

import { execSync } from 'child_process';

try {
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

  if (branch !== 'main') {
    console.error('\n❌ ERROR: Production deployment can only happen from the main branch.');
    console.error(`   Current branch: ${branch}`);
    console.error('\n💡 To deploy to production:');
    console.error('   1. Merge your changes to main');
    console.error('   2. Switch to main: git checkout main');
    console.error('   3. Run: npm run deploy\n');
    process.exit(1);
  }

  console.log('✅ On main branch, proceeding with production deployment...\n');
} catch (error) {
  console.error('❌ Error checking git branch:', error.message);
  process.exit(1);
}

#!/usr/bin/env node

/**
 * Dark Mode Compatibility Checker
 * 
 * Scans all JSX files for hardcoded Tailwind gray classes that break dark mode.
 * Run this before commits to catch violations.
 * 
 * Usage:
 *   node scripts/check-dark-mode.js
 * 
 * Exit codes:
 *   0 - No issues found
 *   1 - Hardcoded gray classes detected
 * 
 * @since December 1, 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns to detect
const VIOLATIONS = [
  {
    pattern: /className="[^"]*text-gray-[0-9]/g,
    message: 'Hardcoded Tailwind gray text class',
    fix: 'Use var(--color-text) or var(--color-text-muted)',
  },
  {
    pattern: /className="[^"]*bg-gray-[0-9]/g,
    message: 'Hardcoded Tailwind gray background class',
    fix: 'Use var(--color-bg) or var(--color-surface)',
  },
  {
    pattern: /className="[^"]*border-gray-[0-9]/g,
    message: 'Hardcoded Tailwind gray border class',
    fix: 'Use var(--color-border)',
  },
];

// Colors that should be avoided in className
const PROBLEMATIC_CLASSES = [
  'text-gray-400',
  'text-gray-500',
  'text-gray-600',
  'bg-gray-100',
  'bg-gray-200',
  'bg-gray-300',
  'border-gray-300',
  'border-gray-400',
];

// Directories to scan
const SRC_DIR = path.join(__dirname, '../src');

/**
 * Recursively get all .jsx files in a directory
 */
function getJsxFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      getJsxFiles(fullPath, files);
    } else if (entry.isFile() && /\.(jsx|js)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Check a file for violations
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  const violations = [];
  
  // Check each pattern
  for (const { pattern, message, fix } of VIOLATIONS) {
    const matches = content.matchAll(pattern);
    
    for (const match of matches) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const line = content.split('\n')[lineNumber - 1];
      
      // Skip false positives
      const isFalsePositive = 
        // JSDoc comment examples
        line.trim().startsWith('*') ||
        line.trim().startsWith('//') ||
        // Intentional high-contrast text on colored backgrounds
        // text-gray-900 (near-black) on bg-yellow-500 = good contrast
        (match[0].includes('text-gray-9') && (line.includes('bg-yellow') || line.includes('bg-blue') || line.includes('bg-green'))) ||
        // text-gray-200/300 (light) on dark branded backgrounds is OK
        ((match[0].includes('text-gray-200') || match[0].includes('text-gray-300')) && line.includes('text-lg mb-6'));
      
      if (!isFalsePositive) {
        violations.push({
          file: relativePath,
          line: lineNumber,
          match: match[0],
          message,
          fix,
        });
      }
    }
  }
  
  return violations;
}

/**
 * Format violation output
 */
function formatViolation(violation) {
  return [
    `\n❌ ${violation.file}:${violation.line}`,
    `   Found: ${violation.match}`,
    `   Issue: ${violation.message}`,
    `   Fix: ${violation.fix}`,
  ].join('\n');
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning for dark mode compatibility issues...\n');
  
  const files = getJsxFiles(SRC_DIR);
  let totalViolations = 0;
  const violationsByFile = {};
  
  console.log(`Checking ${files.length} files in ${path.relative(process.cwd(), SRC_DIR)}/\n`);
  
  for (const file of files) {
    const violations = checkFile(file);
    
    if (violations.length > 0) {
      totalViolations += violations.length;
      violationsByFile[file] = violations;
    }
  }
  
  // Report results
  if (totalViolations === 0) {
    console.log('✅ No dark mode compatibility issues found!\n');
    console.log('All components use CSS variables correctly.\n');
    return 0;
  }
  
  console.log(`\n⚠️  Found ${totalViolations} violation(s) in ${Object.keys(violationsByFile).length} file(s):\n`);
  
  for (const [file, violations] of Object.entries(violationsByFile)) {
    violations.forEach(v => console.log(formatViolation(v)));
  }
  
  console.log('\n📖 Migration Guide:\n');
  console.log('  Import theme utilities:');
  console.log('    import { useThemeColors } from \'../utils/theme\';\n');
  console.log('  Use in component:');
  console.log('    const colors = useThemeColors();');
  console.log('    <p style={colors.textMuted}>Text</p>\n');
  console.log('  Or use CSS variables directly:');
  console.log('    <p style={{ color: \'var(--color-text-muted)\' }}>Text</p>\n');
  console.log('  See src/utils/theme.js for full documentation.\n');
  
  return 1;
}

// Run and exit with appropriate code
const exitCode = main();
process.exit(exitCode);

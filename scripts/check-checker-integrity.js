/**
 * Meta-Checker: Validates the Quality System Itself
 * Ensures checkers don't conflict and align with unified dev ethos
 * 
 * Philosophy: "The watchers must be watched"
 * 
 * Run: npm run check:integrity
 * 
 * @since December 1, 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const issues = [];

/**
 * Core Dev Ethos (from user)
 */
const DEV_ETHOS = {
  principles: [
    'Systems over spot fixes',
    'Universal standards enforcement',
    'Front-end and back-end quality',
    'Fluid, automated development',
    'Brand consistency throughout',
    'Accessibility for all users',
    'Dark mode compatibility',
    'Performance optimization',
    'Security by default',
  ],
  
  brandGuidelines: {
    colors: {
      navy: '#020178',
      yellow: '#E4B340',
      darkGrey: '#242424',
      black: '#151515',
      white: '#FFFFFF',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
  },
};

/**
 * Check 1: Rule Conflicts
 * Ensure checkers don't contradict each other
 */
function checkRuleConflicts() {
  console.log(`${colors.blue}🔍 Checking for rule conflicts...${colors.reset}`);
  
  const checkQuality = fs.readFileSync(path.join(__dirname, 'check-quality.js'), 'utf8');
  
  // Test 1: Dark mode checks should be comprehensive
  const hasDarkModePatterns = checkQuality.includes('text-gray-') && 
                              checkQuality.includes('bg-gray-') && 
                              checkQuality.includes('border-gray-');
  
  if (!hasDarkModePatterns) {
    issues.push({
      severity: 'CRITICAL',
      checker: 'check-quality.js',
      issue: 'Missing comprehensive dark mode pattern detection',
      impact: 'Dark mode violations may slip through',
      fix: 'Ensure all gray class patterns are checked (text/bg/border)',
    });
  }
  
  // Test 2: Exception logic should be present
  const hasExceptionLogic = checkQuality.includes('isFalsePositive') || 
                           checkQuality.includes('bg-yellow');
  
  if (!hasExceptionLogic) {
    issues.push({
      severity: 'MEDIUM',
      checker: 'Exception Lists',
      issue: 'check-quality.js missing false positive filtering',
      impact: 'Valid high-contrast patterns may be flagged',
      fix: 'Add exception logic for intentional patterns (text-gray-900 on bg-yellow)',
    });
  }
  
  // Test 3: Should skip documentation files (theme.js)
  const qualitySkips = checkQuality.includes('utils/theme.js');
  
  if (!qualitySkips) {
    issues.push({
      severity: 'HIGH',
      checker: 'File Exclusions',
      issue: 'Checker may scan documentation examples as violations',
      impact: 'False positives from theme.js documentation',
      fix: 'Skip utils/theme.js and other doc files',
    });
  }
  
  // Test 4: All 9 dimensions should be present
  const dimensions = [
    'ACCESSIBILITY',
    'DARK_MODE',
    'PERFORMANCE',
    'SECURITY',
    'SEO',
    'CODE_QUALITY',
    'RESPONSIVE',
    'BROWSER_COMPAT',
    'BRAND_CONSISTENCY',
  ];
  
  const missingDimensions = dimensions.filter(dim => !checkQuality.includes(dim));
  
  if (missingDimensions.length > 0) {
    issues.push({
      severity: 'HIGH',
      checker: 'Quality Dimensions',
      issue: `Missing dimensions: ${missingDimensions.join(', ')}`,
      impact: 'Incomplete quality coverage',
      fix: 'Implement all 9 quality dimensions',
    });
  }
  
  console.log(`  ✅ Checked rule consistency`);
}

/**
 * Check 2: Brand Guideline Alignment
 * Ensure all checkers enforce the same brand standards
 */
function checkBrandAlignment() {
  console.log(`${colors.blue}🎨 Checking brand guideline alignment...${colors.reset}`);
  
  const checkQuality = fs.readFileSync(path.join(__dirname, 'check-quality.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf8');
  const themeJs = fs.readFileSync(path.join(__dirname, '../src/utils/theme.js'), 'utf8');
  
  // Test 1: All color definitions should match
  const brandColors = Object.values(DEV_ETHOS.brandGuidelines.colors);
  
  for (const color of brandColors) {
    const inQualityChecker = checkQuality.includes(color);
    const inApp = appJs.includes(color);
    
    if (!inQualityChecker && color !== DEV_ETHOS.brandGuidelines.colors.darkGrey) {
      issues.push({
        severity: 'MEDIUM',
        checker: 'Brand Consistency Checker',
        issue: `Brand color ${color} not validated in quality checker`,
        impact: 'Non-brand colors may slip through',
        fix: `Add ${color} to BRAND.colors in check-quality.js`,
      });
    }
  }
  
  // Test 2: Font specifications should be consistent
  const poppinsInChecker = checkQuality.includes('Poppins');
  const interInChecker = checkQuality.includes('Inter');
  const poppinsInApp = appJs.includes('Poppins');
  const interInApp = appJs.includes('Inter');
  
  if ((poppinsInApp && !poppinsInChecker) || (interInApp && !interInChecker)) {
    issues.push({
      severity: 'LOW',
      checker: 'Typography Validation',
      issue: 'Font usage in code not validated by checker',
      impact: 'Incorrect fonts may be used without detection',
      fix: 'Ensure brand consistency checker validates Poppins/Inter usage',
    });
  }
  
  // Test 3: CSS variables should be preferred over hardcoded values
  const cssVarPattern = /var\(--color-[a-z-]+\)/g;
  const hardcodedColorPattern = /#[0-9a-fA-F]{6}/g;
  
  const cssVarsInTheme = (themeJs.match(cssVarPattern) || []).length;
  const hardcodedInApp = (appJs.match(hardcodedColorPattern) || []).length;
  
  if (hardcodedInApp > cssVarsInTheme * 2) {
    issues.push({
      severity: 'INFO',
      checker: 'CSS Variable Usage',
      issue: 'High ratio of hardcoded colors vs CSS variables',
      impact: 'Dark mode may have inconsistencies',
      fix: 'Migrate more hardcoded colors to CSS variables',
    });
  }
  
  console.log(`  ✅ Checked brand guideline consistency`);
}

/**
 * Check 3: Dev Ethos Alignment
 * Ensure checkers embody our core principles
 */
function checkDevEthosAlignment() {
  console.log(`${colors.blue}🎯 Checking dev ethos alignment...${colors.reset}`);
  
  const checkQuality = fs.readFileSync(path.join(__dirname, 'check-quality.js'), 'utf8');
  const preCommitHook = fs.readFileSync(path.join(__dirname, '../.git/hooks/pre-commit'), 'utf8');
  
  // Principle 1: "Systems over spot fixes"
  // Checkers should validate patterns, not individual instances
  const hasSystematicChecks = checkQuality.includes('for (const file of files)');
  const hasSpotChecks = checkQuality.includes('specific file name');
  
  if (!hasSystematicChecks) {
    issues.push({
      severity: 'CRITICAL',
      checker: 'System Design',
      issue: 'Checker does not systematically validate all files',
      impact: 'Violates "systems over spot fixes" principle',
      fix: 'Refactor to check all files in src/ directory',
    });
  }
  
  // Principle 2: "Automated development"
  // Checkers should run automatically, not require manual intervention
  const hasAutomation = preCommitHook.includes('npm run') || preCommitHook.includes('node scripts');
  
  if (!hasAutomation) {
    issues.push({
      severity: 'HIGH',
      checker: 'Automation',
      issue: 'Quality checks not integrated into git hooks',
      impact: 'Developers must remember to run checks manually',
      fix: 'Ensure pre-commit and pre-push hooks call quality checkers',
    });
  }
  
  // Principle 3: "Universal standards"
  // All dimensions should be checked
  const dimensions = [
    'accessibility',
    'dark_mode',
    'performance',
    'security',
    'seo',
    'code_quality',
    'responsive',
    'browser_compat',
    'brand_consistency',
  ];
  
  const missingDimensions = dimensions.filter(dim => !checkQuality.includes(dim));
  
  if (missingDimensions.length > 0) {
    issues.push({
      severity: 'MEDIUM',
      checker: 'Coverage',
      issue: `Missing validation for: ${missingDimensions.join(', ')}`,
      impact: 'Incomplete quality enforcement',
      fix: 'Add checks for all quality dimensions',
    });
  }
  
  console.log(`  ✅ Checked dev ethos alignment`);
}

/**
 * Check 4: False Positive Prevention
 * Ensure checkers don't flag valid code
 */
function checkFalsePositives() {
  console.log(`${colors.blue}🎭 Checking false positive prevention...${colors.reset}`);
  
  const checkQuality = fs.readFileSync(path.join(__dirname, 'check-quality.js'), 'utf8');
  const checkDarkMode = fs.readFileSync(path.join(__dirname, 'check-dark-mode.js'), 'utf8');
  
  // Test 1: Intentional high-contrast combinations should be allowed
  const allowsIntentionalContrast = 
    checkQuality.includes('bg-yellow') && 
    checkDarkMode.includes('bg-yellow');
  
  if (!allowsIntentionalContrast) {
    issues.push({
      severity: 'HIGH',
      checker: 'False Positives',
      issue: 'Checkers may flag intentional high-contrast text (text-gray-900 on yellow)',
      impact: 'Developers forced to bypass valid accessibility patterns',
      fix: 'Add exception for text-gray-900 on bg-yellow-* (intentional contrast)',
    });
  }
  
  // Test 2: Documentation and examples should be skipped
  const skipsDocumentation = 
    checkQuality.includes('utils/theme.js') ||
    checkQuality.includes("startsWith('//')") ||
    checkQuality.includes("startsWith('*')");
  
  if (!skipsDocumentation) {
    issues.push({
      severity: 'MEDIUM',
      checker: 'Documentation Scanning',
      issue: 'Checkers may flag code examples in documentation',
      impact: 'False positives in theme.js and JSDoc comments',
      fix: 'Skip files with documentation/examples (utils/theme.js, comments)',
    });
  }
  
  // Test 3: Brand colors should not be flagged as "non-brand"
  const brandColorList = Object.values(DEV_ETHOS.brandGuidelines.colors)
    .map(c => c.toUpperCase());
  
  const hasBrandColorWhitelist = brandColorList.some(color => 
    checkQuality.includes(color)
  );
  
  if (!hasBrandColorWhitelist) {
    issues.push({
      severity: 'LOW',
      checker: 'Brand Color Detection',
      issue: 'Brand consistency checker may not recognize all approved colors',
      impact: 'Valid brand colors flagged as violations',
      fix: 'Ensure all brand colors in whitelist: Navy, Yellow, Dark Grey, Black, White',
    });
  }
  
  console.log(`  ✅ Checked false positive prevention`);
}

/**
 * Check 5: Severity Consistency
 * Ensure severity levels are logical and consistent
 */
function checkSeverityConsistency() {
  console.log(`${colors.blue}⚖️  Checking severity consistency...${colors.reset}`);
  
  const checkQuality = fs.readFileSync(path.join(__dirname, 'check-quality.js'), 'utf8');
  
  // Test 1: Security issues should always be CRITICAL or HIGH
  const securityChecks = checkQuality.match(/SEVERITY\.(CRITICAL|HIGH|MEDIUM|LOW|INFO).*security/gi) || [];
  const lowSeveritySecurity = securityChecks.some(check => 
    check.includes('MEDIUM') || check.includes('LOW') || check.includes('INFO')
  );
  
  if (lowSeveritySecurity) {
    issues.push({
      severity: 'HIGH',
      checker: 'Severity Assignment',
      issue: 'Security issues marked as MEDIUM, LOW, or INFO',
      impact: 'Critical security problems may be ignored',
      fix: 'All security issues should be CRITICAL or HIGH severity',
    });
  }
  
  // Test 2: Accessibility issues should be HIGH or MEDIUM
  const a11yChecks = checkQuality.match(/SEVERITY\.(CRITICAL|HIGH|MEDIUM|LOW|INFO).*accessibility/gi) || [];
  const lowSeverityA11y = a11yChecks.some(check => 
    check.includes('LOW') || check.includes('INFO')
  );
  
  if (lowSeverityA11y) {
    issues.push({
      severity: 'MEDIUM',
      checker: 'Severity Assignment',
      issue: 'Accessibility issues marked as LOW or INFO',
      impact: 'Important a11y problems may be deprioritized',
      fix: 'Accessibility violations should be at least MEDIUM severity',
    });
  }
  
  // Test 3: INFO should only be for truly informational items
  const infoChecks = checkQuality.match(/SEVERITY\.INFO[\s\S]{0,200}message:\s*['"]([^'"]+)['"]/g) || [];
  const actionableInfo = infoChecks.some(check => 
    check.includes('must') || check.includes('should') || check.includes('fix')
  );
  
  if (actionableInfo) {
    issues.push({
      severity: 'LOW',
      checker: 'Severity Assignment',
      issue: 'INFO severity used for actionable items',
      impact: 'Developers may ignore important improvements',
      fix: 'Use LOW for actionable items, INFO only for FYI messages',
    });
  }
  
  console.log(`  ✅ Checked severity consistency`);
}

/**
 * Check 6: Documentation Alignment
 * Ensure docs match actual checker behavior
 */
function checkDocumentationAlignment() {
  console.log(`${colors.blue}📚 Checking documentation alignment...${colors.reset}`);
  
  const qualitySystemMd = fs.existsSync(path.join(__dirname, '../QUALITY_SYSTEM.md')) ?
    fs.readFileSync(path.join(__dirname, '../QUALITY_SYSTEM.md'), 'utf8') : '';
  
  const darkModeSystemMd = fs.existsSync(path.join(__dirname, '../DARK_MODE_SYSTEM.md')) ?
    fs.readFileSync(path.join(__dirname, '../DARK_MODE_SYSTEM.md'), 'utf8') : '';
  
  const checkQuality = fs.readFileSync(path.join(__dirname, 'check-quality.js'), 'utf8');
  
  // Test 1: Documented checks should exist in code
  if (qualitySystemMd.includes('8 dimensions') && checkQuality.includes('9 dimensions')) {
    issues.push({
      severity: 'LOW',
      checker: 'Documentation',
      issue: 'QUALITY_SYSTEM.md says 8 dimensions, code has 9',
      impact: 'Documentation out of sync with implementation',
      fix: 'Update QUALITY_SYSTEM.md to reflect 9 dimensions (added brand_consistency)',
    });
  }
  
  // Test 2: CSS variable names in docs should match code
  if (darkModeSystemMd.includes('--color-') && !darkModeSystemMd.includes('--color-heading')) {
    issues.push({
      severity: 'INFO',
      checker: 'Documentation',
      issue: 'DARK_MODE_SYSTEM.md may be missing newer CSS variables',
      impact: 'Developers may not know about all available variables',
      fix: 'Ensure all CSS variables documented (check index.css vs docs)',
    });
  }
  
  // Test 3: Examples in docs should be valid
  const examplePattern = /```jsx([\s\S]*?)```/g;
  const examples = darkModeSystemMd.match(examplePattern) || [];
  
  for (const example of examples) {
    if (example.includes('text-gray-') && !example.includes('EXCEPTION') && !example.includes('❌')) {
      issues.push({
        severity: 'LOW',
        checker: 'Documentation Examples',
        issue: 'Documentation contains code that would fail quality checks',
        impact: 'Developers copy-paste examples that get flagged',
        fix: 'Update all examples to follow current standards',
      });
      break; // Only report once
    }
  }
  
  console.log(`  ✅ Checked documentation alignment`);
}

/**
 * Check 7: Performance of Checkers
 * Ensure checkers themselves are efficient
 */
function checkCheckerPerformance() {
  console.log(`${colors.blue}⚡ Checking checker performance...${colors.reset}`);
  
  const checkQuality = fs.readFileSync(path.join(__dirname, 'check-quality.js'), 'utf8');
  const checkDarkMode = fs.readFileSync(path.join(__dirname, 'check-dark-mode.js'), 'utf8');
  
  // Test 1: Checkers shouldn't re-read files unnecessarily
  const multipleReads = (checkQuality.match(/fs\.readFileSync/g) || []).length;
  const fileLoop = (checkQuality.match(/for \(const file of files\)/g) || []).length;
  
  if (multipleReads > fileLoop * 2) {
    issues.push({
      severity: 'MEDIUM',
      checker: 'Performance',
      issue: 'Checkers reading files multiple times',
      impact: 'Slow check execution on large codebases',
      fix: 'Cache file contents, read once per file',
    });
  }
  
  // Test 2: Regex should be compiled once, not in loops
  const regexInLoop = checkQuality.includes('for (') && checkQuality.includes('new RegExp(');
  
  if (regexInLoop) {
    issues.push({
      severity: 'LOW',
      checker: 'Performance',
      issue: 'Regular expressions compiled inside loops',
      impact: 'Unnecessary CPU usage during checks',
      fix: 'Define regex patterns outside loops, reuse compiled versions',
    });
  }
  
  // Test 3: Parallel checks should not block each other
  const hasAsyncChecks = checkQuality.includes('async function') || checkQuality.includes('await');
  const hasParallelExecution = checkQuality.includes('Promise.all');
  
  if (hasAsyncChecks && !hasParallelExecution) {
    issues.push({
      severity: 'INFO',
      checker: 'Performance',
      issue: 'Async checks not running in parallel',
      impact: 'Sequential execution slower than necessary',
      fix: 'Consider Promise.all() for independent checks',
    });
  }
  
  console.log(`  ✅ Checked checker performance`);
}

/**
 * Display Results
 */
function displayResults() {
  console.log(`\n${'='.repeat(80)}\n`);
  
  if (issues.length === 0) {
    console.log(`${colors.green}${colors.bold}✅ CHECKER INTEGRITY: PERFECT!${colors.reset}`);
    console.log(`${colors.green}All quality checkers are aligned and conflict-free.${colors.reset}\n`);
    return 0;
  }
  
  console.log(`${colors.bold}🔍 META-CHECKER REPORT${colors.reset}\n`);
  console.log(`Found ${colors.yellow}${issues.length}${colors.reset} integrity issue(s)\n`);
  
  // Group by severity
  const bySeverity = {
    CRITICAL: issues.filter(i => i.severity === 'CRITICAL'),
    HIGH: issues.filter(i => i.severity === 'HIGH'),
    MEDIUM: issues.filter(i => i.severity === 'MEDIUM'),
    LOW: issues.filter(i => i.severity === 'LOW'),
    INFO: issues.filter(i => i.severity === 'INFO'),
  };
  
  const severityColors = {
    CRITICAL: colors.red,
    HIGH: colors.yellow,
    MEDIUM: colors.cyan,
    LOW: colors.blue,
    INFO: colors.reset,
  };
  
  const severityIcons = {
    CRITICAL: '🔴',
    HIGH: '🟡',
    MEDIUM: '🟠',
    LOW: '🔵',
    INFO: 'ℹ️',
  };
  
  for (const [severity, items] of Object.entries(bySeverity)) {
    if (items.length === 0) continue;
    
    const color = severityColors[severity];
    const icon = severityIcons[severity];
    
    console.log(`${color}${colors.bold}${icon} ${severity} (${items.length})${colors.reset}`);
    console.log(`${'-'.repeat(80)}`);
    
    for (const item of items) {
      console.log(`\n  ${colors.bold}Checker:${colors.reset} ${item.checker}`);
      console.log(`  ${colors.bold}Issue:${colors.reset} ${item.issue}`);
      console.log(`  ${colors.bold}Impact:${colors.reset} ${item.impact}`);
      console.log(`  ${colors.bold}Fix:${colors.reset} ${item.fix}`);
    }
    
    console.log();
  }
  
  // Recommendations
  console.log(`${colors.bold}💡 RECOMMENDATIONS${colors.reset}\n`);
  
  const criticalCount = bySeverity.CRITICAL.length;
  const highCount = bySeverity.HIGH.length;
  
  if (criticalCount > 0) {
    console.log(`${colors.red}❌ ${criticalCount} CRITICAL integrity issue(s) - fix immediately${colors.reset}`);
    console.log(`   The quality system itself has fundamental problems.\n`);
  }
  
  if (highCount > 0) {
    console.log(`${colors.yellow}⚠️  ${highCount} HIGH priority issue(s) - address soon${colors.reset}`);
    console.log(`   Checkers may conflict or produce inconsistent results.\n`);
  }
  
  console.log(`${colors.bold}📚 PHILOSOPHY${colors.reset}`);
  console.log(`  "Who watches the watchers?"`);
  console.log(`  Quality systems must validate themselves to maintain integrity.`);
  console.log(`  Run this meta-checker after any updates to quality checkers.\n`);
  
  return criticalCount > 0 ? 1 : 0;
}

/**
 * Main Execution
 */
function main() {
  console.log(`${colors.bold}${colors.cyan}`);
  console.log(`╔════════════════════════════════════════════════════════════════════╗`);
  console.log(`║          🔍 META-CHECKER: QUALITY SYSTEM INTEGRITY                 ║`);
  console.log(`║          "Who watches the watchers?"                               ║`);
  console.log(`╚════════════════════════════════════════════════════════════════════╝`);
  console.log(`${colors.reset}\n`);
  
  try {
    checkRuleConflicts();
    checkBrandAlignment();
    checkDevEthosAlignment();
    checkFalsePositives();
    checkSeverityConsistency();
    checkDocumentationAlignment();
    checkCheckerPerformance();
    
    return displayResults();
  } catch (error) {
    console.error(`${colors.red}Meta-checker error:${colors.reset}`, error);
    return 1;
  }
}

// Run
const exitCode = main();
process.exit(exitCode);

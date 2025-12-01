/**
 * Universal Code Quality Checker
 * Comprehensive validation across all quality dimensions
 * 
 * Checks:
 * 1. Accessibility (WCAG 2.2 AA)
 * 2. Dark Mode Compatibility
 * 3. Performance (bundle size, lazy loading)
 * 4. Security (exposed secrets, XSS vulnerabilities)
 * 5. SEO (meta tags, structured data)
 * 6. Code Quality (console.logs, TODOs, deprecated APIs)
 * 7. Responsive Design (mobile breakpoints)
 * 8. Browser Compatibility
 * 
 * Usage: npm run check:quality
 * 
 * @since December 1, 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, '../src');
const PUBLIC_DIR = path.join(__dirname, '../public');

// ANSI colors for output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Quality check categories
const CHECKS = {
  ACCESSIBILITY: 'accessibility',
  DARK_MODE: 'dark_mode',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  SEO: 'seo',
  CODE_QUALITY: 'code_quality',
  RESPONSIVE: 'responsive',
  BROWSER_COMPAT: 'browser_compat',
  BRAND_CONSISTENCY: 'brand_consistency',
};

// Issue severity levels
const SEVERITY = {
  CRITICAL: 'CRITICAL',   // Blocks deployment
  HIGH: 'HIGH',           // Should fix before release
  MEDIUM: 'MEDIUM',       // Should fix soon
  LOW: 'LOW',            // Nice to have
  INFO: 'INFO',          // Informational only
};

const issues = {
  [SEVERITY.CRITICAL]: [],
  [SEVERITY.HIGH]: [],
  [SEVERITY.MEDIUM]: [],
  [SEVERITY.LOW]: [],
  [SEVERITY.INFO]: [],
};

/**
 * Get all files recursively
 */
function getAllFiles(dir, extensions = ['.js', '.jsx'], files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      getAllFiles(fullPath, extensions, files);
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Check 1: Accessibility Issues
 */
function checkAccessibility() {
  console.log(`${colors.blue}🔍 Checking accessibility...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Missing alt text on images
      if (/<img[^>]*src=/.test(line) && !/(alt=|aria-label)/.test(line)) {
        issues[SEVERITY.HIGH].push({
          category: CHECKS.ACCESSIBILITY,
          file: relativePath,
          line: lineNum,
          message: 'Image missing alt text or aria-label',
          code: line.trim().substring(0, 80),
          fix: 'Add alt="" for decorative images or descriptive alt text',
        });
      }
      
      // Buttons without aria-label when no text content
      if (/<button[^>]*>[\s]*<[^>]*\/>[\s]*<\/button>/.test(line) && !/aria-label/.test(line)) {
        issues[SEVERITY.HIGH].push({
          category: CHECKS.ACCESSIBILITY,
          file: relativePath,
          line: lineNum,
          message: 'Icon-only button missing aria-label',
          code: line.trim().substring(0, 80),
          fix: 'Add aria-label="Description" to button',
        });
      }
      
      // Links with only icon and no aria-label
      if (/<a[^>]*>[\s]*<[^>]*\/>[\s]*<\/a>/.test(line) && !/aria-label/.test(line)) {
        issues[SEVERITY.MEDIUM].push({
          category: CHECKS.ACCESSIBILITY,
          file: relativePath,
          line: lineNum,
          message: 'Icon-only link missing aria-label',
          code: line.trim().substring(0, 80),
          fix: 'Add aria-label or title attribute',
        });
      }
      
      // onClick without onKeyPress (keyboard accessibility)
      // Skip if it's on an anchor tag, button, or element with button role
      // Check surrounding lines for multiline JSX elements (look further back/forward)
      const prevLines = lines.slice(Math.max(0, idx - 10), idx).join(' ');
      const nextLines = lines.slice(idx + 1, Math.min(lines.length, idx + 10)).join(' ');
      const context = prevLines + line + nextLines;
      
      if (/onClick=/.test(line) && 
          !/onKeyDown|onKeyPress|onKeyUp/.test(context) && 
          !/role="button"/.test(context) &&
          !/<button[\s>]/.test(context) &&
          !/<a\s[^>]*href/.test(context) &&
          !/href=/.test(context)) {
        issues[SEVERITY.MEDIUM].push({
          category: CHECKS.ACCESSIBILITY,
          file: relativePath,
          line: lineNum,
          message: 'onClick handler without keyboard support',
          code: line.trim().substring(0, 80),
          fix: 'Add onKeyDown handler or use <button> element',
        });
      }
    });
  }
}

/**
 * Check 2: Dark Mode Compatibility
 * Comprehensive dark mode validation - replaces standalone check-dark-mode.js
 */
function checkDarkMode() {
  console.log(`${colors.blue}🌙 Checking dark mode compatibility...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  // Patterns to detect with specific severity
  const violations = [
    {
      pattern: /className="[^"]*text-gray-[0-9]/g,
      severity: SEVERITY.HIGH,
      message: 'Hardcoded Tailwind gray text class breaks dark mode',
      fix: 'Use var(--color-text) or var(--color-text-muted)',
    },
    {
      pattern: /className="[^"]*bg-gray-[0-9]/g,
      severity: SEVERITY.HIGH,
      message: 'Hardcoded Tailwind gray background class breaks dark mode',
      fix: 'Use var(--color-bg) or var(--color-surface)',
    },
    {
      pattern: /className="[^"]*border-gray-[0-9]/g,
      severity: SEVERITY.HIGH,
      message: 'Hardcoded Tailwind gray border class breaks dark mode',
      fix: 'Use var(--color-border)',
    },
  ];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    
    // Skip theme.js (has documentation examples)
    if (relativePath.includes('utils/theme.js')) continue;
    
    const lines = content.split('\n');
    
    // Check each violation pattern
    for (const { pattern, severity, message, fix } of violations) {
      const matches = content.matchAll(pattern);
      
      for (const match of matches) {
        const lineNum = content.substring(0, match.index).split('\n').length;
        const line = lines[lineNum - 1];
        
        // Skip false positives
        const isFalsePositive = 
          // JSDoc comment examples
          line.trim().startsWith('*') ||
          line.trim().startsWith('//') ||
          // Intentional high-contrast text on colored backgrounds
          // text-gray-900 (near-black) on bg-yellow-500 = 8.4:1 contrast (WCAG AAA)
          (match[0].includes('text-gray-9') && (
            line.includes('bg-yellow') || 
            line.includes('bg-blue') || 
            line.includes('bg-green')
          ));
        
        if (!isFalsePositive) {
          issues[severity].push({
            category: CHECKS.DARK_MODE,
            file: relativePath,
            line: lineNum,
            message: message,
            code: line.trim().substring(0, 80),
            fix: fix,
          });
        }
      }
    }
    
    // Also check for hardcoded hex colors (lower severity)
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Skip comments and index.css (CSS variable definitions)
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || relativePath.includes('index.css')) return;
      
      const hexColorMatch = line.match(/(?:color|backgroundColor):\s*['"]#[0-9a-fA-F]{3,6}['"]/);
      if (hexColorMatch && !line.includes('COLORS.') && !line.includes('BRAND_COLORS')) {
        // Extract the hex color
        const hexMatch = hexColorMatch[0].match(/#([0-9a-fA-F]{3,6})/);
        if (hexMatch) {
          const hex = hexMatch[0].toUpperCase();
          
          // Whitelist brand colors and semantic state colors
          const allowedColors = [
            '#020178', // Navy (brand)
            '#E4B340', // Yellow (brand)
            '#DC2626', '#FEE2E2', '#FEF2F2', '#991B1B', '#7F1D1D', '#F87171', '#FCA5A5', '#450A0A', // Red (error)
            '#78350F', '#FFFBEB', '#F59E0B', '#FCD34D', '#451A03', // Amber (warning)
            '#059669', '#ECFDF5', '#34D399', '#064E3B', // Emerald (success)
            '#FFF', '#FFFFFF', '#000', '#000000' // Black/white (rare but valid)
          ];
          
          const isAllowed = allowedColors.some(c => c.toUpperCase() === hex);
          
          if (!isAllowed) {
            issues[SEVERITY.LOW].push({
              category: CHECKS.DARK_MODE,
              file: relativePath,
              line: lineNum,
              message: 'Hardcoded hex color may not adapt to dark mode',
              code: line.trim().substring(0, 80),
              fix: 'Use CSS variables or BRAND_COLORS constant',
            });
          }
        }
      }
    });
  }
}

/**
 * Check 3: Performance Issues
 */
function checkPerformance() {
  console.log(`${colors.blue}⚡ Checking performance...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Large imports from libraries (not tree-shaken)
      if (/import\s+\*\s+as/.test(line) && !line.includes('React')) {
        issues[SEVERITY.LOW].push({
          category: CHECKS.PERFORMANCE,
          file: relativePath,
          line: lineNum,
          message: 'Wildcard import may increase bundle size',
          code: line.trim(),
          fix: 'Import only specific exports: import { x, y } from "library"',
        });
      }
      
      // Images without lazy loading
      if (/<img[^>]*src=/.test(line) && !/loading="lazy"|LazyImage/.test(line)) {
        issues[SEVERITY.LOW].push({
          category: CHECKS.PERFORMANCE,
          file: relativePath,
          line: lineNum,
          message: 'Image without lazy loading',
          code: line.trim().substring(0, 80),
          fix: 'Add loading="lazy" or use <LazyImage /> component',
        });
      }
      
      // Inline event handlers (recreated on every render)
      if (/(?:onClick|onChange|onSubmit)=\{(?:\(\)|function)/.test(line)) {
        issues[SEVERITY.INFO].push({
          category: CHECKS.PERFORMANCE,
          file: relativePath,
          line: lineNum,
          message: 'Inline function in event handler (minor perf impact)',
          code: line.trim().substring(0, 80),
          fix: 'Consider useCallback for frequently re-rendered components',
        });
      }
    });
  }
  
  // Check bundle size
  const distPath = path.join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    const jsFiles = getAllFiles(distPath, ['.js']);
    let totalSize = 0;
    
    for (const file of jsFiles) {
      const stats = fs.statSync(file);
      totalSize += stats.size;
    }
    
    const totalMB = (totalSize / 1024 / 1024).toFixed(2);
    
    if (totalSize > 500 * 1024) { // > 500KB
      issues[SEVERITY.INFO].push({
        category: CHECKS.PERFORMANCE,
        file: 'dist/',
        line: 0,
        message: `Total JS bundle size: ${totalMB}MB`,
        code: `Consider code splitting and tree shaking`,
        fix: 'Review bundle analyzer output',
      });
    }
  }
}

/**
 * Check 4: Security Issues
 */
function checkSecurity() {
  console.log(`${colors.blue}🔒 Checking security...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js', '.json']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Potential API keys or secrets
      const secretPatterns = [
        { pattern: /api[_-]?key[\s:=]["'](?!YOUR|REPLACE|XXX)[a-zA-Z0-9]{20,}/i, name: 'API Key' },
        { pattern: /secret[\s:=]["'][a-zA-Z0-9]{20,}/i, name: 'Secret' },
        { pattern: /password[\s:=]["'].+/i, name: 'Password' },
        { pattern: /token[\s:=]["'][a-zA-Z0-9]{20,}/i, name: 'Token' },
      ];
      
      for (const { pattern, name } of secretPatterns) {
        if (pattern.test(line) && !line.includes('placeholder') && !line.includes('example')) {
          issues[SEVERITY.CRITICAL].push({
            category: CHECKS.SECURITY,
            file: relativePath,
            line: lineNum,
            message: `Potential ${name} exposed in code`,
            code: '[REDACTED]',
            fix: 'Move to environment variables or server-side',
          });
        }
      }
      
      // dangerouslySetInnerHTML usage
      if (/dangerouslySetInnerHTML/.test(line)) {
        issues[SEVERITY.HIGH].push({
          category: CHECKS.SECURITY,
          file: relativePath,
          line: lineNum,
          message: 'Using dangerouslySetInnerHTML (XSS risk)',
          code: line.trim().substring(0, 80),
          fix: 'Ensure content is sanitized or use safe alternatives',
        });
      }
      
      // eval() usage
      if (/\beval\s*\(/.test(line)) {
        issues[SEVERITY.CRITICAL].push({
          category: CHECKS.SECURITY,
          file: relativePath,
          line: lineNum,
          message: 'eval() usage detected (major security risk)',
          code: line.trim().substring(0, 80),
          fix: 'Remove eval() and use safer alternatives',
        });
      }
      
      // External links without rel="noopener noreferrer"
      if (/<a[^>]*target="_blank"/.test(line) && !/rel="[^"]*noopener/.test(line)) {
        issues[SEVERITY.MEDIUM].push({
          category: CHECKS.SECURITY,
          file: relativePath,
          line: lineNum,
          message: 'External link missing rel="noopener noreferrer"',
          code: line.trim().substring(0, 80),
          fix: 'Add rel="noopener noreferrer" to prevent tabnabbing',
        });
      }
    });
  }
}

/**
 * Check 5: SEO Issues
 */
function checkSEO() {
  console.log(`${colors.blue}🔎 Checking SEO...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    
    // Check for Helmet usage in page components
    if (relativePath.includes('pages/') && relativePath.endsWith('.jsx')) {
      if (!/<Helmet>/.test(content) && !content.includes('react-helmet')) {
        issues[SEVERITY.MEDIUM].push({
          category: CHECKS.SEO,
          file: relativePath,
          line: 0,
          message: 'Page component missing <Helmet> for SEO meta tags',
          code: 'Add title, description, canonical tags',
          fix: 'Import and use react-helmet-async',
        });
      }
      
      // Check for meta description
      if (content.includes('<Helmet>') && !/<meta name="description"/.test(content)) {
        issues[SEVERITY.MEDIUM].push({
          category: CHECKS.SEO,
          file: relativePath,
          line: 0,
          message: 'Page missing meta description',
          code: 'SEO description is critical for search rankings',
          fix: 'Add <meta name="description" content="..." />',
        });
      }
      
      // Check for canonical URL
      if (content.includes('<Helmet>') && !/<link rel="canonical"/.test(content)) {
        issues[SEVERITY.LOW].push({
          category: CHECKS.SEO,
          file: relativePath,
          line: 0,
          message: 'Page missing canonical URL',
          code: 'Prevents duplicate content issues',
          fix: 'Add <link rel="canonical" href="..." />',
        });
      }
    }
  }
  
  // Check for sitemap and robots.txt
  if (!fs.existsSync(path.join(PUBLIC_DIR, 'sitemap.xml'))) {
    issues[SEVERITY.MEDIUM].push({
      category: CHECKS.SEO,
      file: 'public/',
      line: 0,
      message: 'sitemap.xml missing',
      code: 'Search engines use sitemaps for crawling',
      fix: 'Create public/sitemap.xml with all page URLs',
    });
  }
  
  if (!fs.existsSync(path.join(PUBLIC_DIR, 'robots.txt'))) {
    issues[SEVERITY.LOW].push({
      category: CHECKS.SEO,
      file: 'public/',
      line: 0,
      message: 'robots.txt missing',
      code: 'Controls search engine crawling',
      fix: 'Create public/robots.txt',
    });
  }
}

/**
 * Check 6: Code Quality Issues
 */
function checkCodeQuality() {
  console.log(`${colors.blue}📝 Checking code quality...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // console.log in production code (except service worker and scripts)
      // Skip if already wrapped in DEV check or is console.error/warn (intentional error handling)
      if (/console\.(log|warn|error)/.test(line) && 
          !relativePath.includes('sw.js') && 
          !relativePath.includes('scripts/') &&
          !relativePath.includes('hooks/')) {
        
        // Check if this line or previous lines show it's wrapped in DEV check
        const prevLines = lines.slice(Math.max(0, idx - 3), idx).join(' ');
        const isDEVWrapped = prevLines.includes('import.meta.env.DEV') || line.includes('import.meta.env.DEV');
        
        // Allow console.error and console.warn (error handling), skip console.log unless DEV-wrapped
        const isErrorHandling = /console\.(warn|error)/.test(line);
        
        if (!isDEVWrapped && !isErrorHandling) {
          issues[SEVERITY.LOW].push({
            category: CHECKS.CODE_QUALITY,
            file: relativePath,
            line: lineNum,
            message: 'console.log() statement in code',
            code: line.trim().substring(0, 80),
            fix: 'Remove or wrap in if (import.meta.env.DEV)',
          });
        }
      }
      
      // TODO/FIXME comments
      if (/\/\/\s*(TODO|FIXME|HACK|XXX|BUG)/.test(line)) {
        issues[SEVERITY.INFO].push({
          category: CHECKS.CODE_QUALITY,
          file: relativePath,
          line: lineNum,
          message: 'TODO/FIXME comment found',
          code: line.trim(),
          fix: 'Address or create issue tracker item',
        });
      }
      
      // Deprecated React patterns
      if (/componentWillMount|componentWillReceiveProps|componentWillUpdate/.test(line)) {
        issues[SEVERITY.HIGH].push({
          category: CHECKS.CODE_QUALITY,
          file: relativePath,
          line: lineNum,
          message: 'Deprecated React lifecycle method',
          code: line.trim().substring(0, 80),
          fix: 'Migrate to modern hooks (useEffect, etc.)',
        });
      }
      
      // Missing PropTypes (optional, for type safety)
      if (/^const \w+ = \([^)]*\) =>/.test(line) && !content.includes('PropTypes')) {
        // This is just info, not a violation
      }
    });
  }
}

/**
 * Check 7: Responsive Design Issues
 */
function checkResponsive() {
  console.log(`${colors.blue}📱 Checking responsive design...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Fixed widths without responsive alternatives
      if (/width:\s*['"]?\d{4,}px/.test(line) && !line.includes('max-width') && !line.includes('min-width')) {
        issues[SEVERITY.LOW].push({
          category: CHECKS.RESPONSIVE,
          file: relativePath,
          line: lineNum,
          message: 'Large fixed width without responsive alternative',
          code: line.trim().substring(0, 80),
          fix: 'Use max-width or Tailwind responsive classes',
        });
      }
      
      // Missing viewport meta in index.html
      if (relativePath.includes('index.html') && /<head>/.test(line)) {
        const fullContent = fs.readFileSync(file, 'utf8');
        if (!/<meta name="viewport"/.test(fullContent)) {
          issues[SEVERITY.HIGH].push({
            category: CHECKS.RESPONSIVE,
            file: relativePath,
            line: lineNum,
            message: 'Missing viewport meta tag',
            code: 'Required for mobile responsiveness',
            fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1" />',
          });
        }
      }
    });
  }
}

/**
 * Check 8: Brand Consistency
 */
function checkBrandConsistency() {
  console.log(`${colors.blue}🎨 Checking brand consistency...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  // Brand guidelines from attachments
  const BRAND = {
    colors: {
      navy: '#020178',
      yellow: '#E4B340',
      darkGrey: '#242424',
      black: '#151515',
      white: '#FFFFFF',
    },
    fonts: {
      heading: ['Poppins', 'font-coco'], // Poppins for headings
      body: ['Inter', 'font-inter'],    // Inter for body text
    },
  };
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Skip comments, theme.js (documentation), and index.css (CSS variable definitions)
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || 
          relativePath.includes('utils/theme.js') || relativePath.includes('index.css')) {
        return;
      }
      
      // Check for non-brand color hex codes
      const hexMatch = line.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g);
      if (hexMatch) {
        for (const hex of hexMatch) {
          const normalized = hex.toUpperCase();
          const isBrandColor = Object.values(BRAND.colors).map(c => c.toUpperCase()).includes(normalized);
          const isGradient = line.includes('gradient');
          const isOpacity = line.includes('rgba') || line.includes('opacity');
          
          // Semantic color patterns - functional colors for states (error, warning, success)
          const semanticColors = [
            '#DC2626', '#FEE2E2', '#FEF2F2', '#991B1B', '#7F1D1D', '#F87171', '#FCA5A5', '#450A0A', // Red spectrum (errors)
            '#78350F', '#FFFBEB', '#F59E0B', '#FCD34D', '#451A03', // Amber spectrum (warnings)
            '#059669', '#ECFDF5', '#34D399', '#064E3B', // Emerald spectrum (success)
            '#FFF', '#0B0B0B', '#F8F8F8', '#1A1A1A', '#E5E5E5', '#2A2A2A', '#151515', '#F4F4F4', '#5A5A5A', '#A8A8A8', // Infrastructure (grays, neutrals)
            '#ACC' // Accessibility anchor colors
          ];
          const isSemanticColor = semanticColors.some(c => c.toUpperCase() === normalized);
          
          // Check if line is defining or using a CSS variable (intentional color definition)
          const isCSSVarDefinition = line.includes('--color-') || line.includes('var(--color-');
          
          // Allow brand colors, semantic colors, gradients, opacity, and CSS variable usage
          if (!isBrandColor && !isSemanticColor && !isGradient && !isOpacity && !isCSSVarDefinition) {
            issues[SEVERITY.LOW].push({
              category: CHECKS.BRAND_CONSISTENCY,
              file: relativePath,
              line: lineNum,
              message: `Non-brand color ${hex} - should use Navy (#020178), Yellow (#E4B340), or CSS variables`,
              code: line.trim().substring(0, 80),
              fix: 'Use COLORS.navy, COLORS.yellow, or var(--color-*) variables',
            });
          }
        }
      }
      
      // Check for incorrect font usage
      // Headings (h1-h6) should use Poppins/font-coco
      if (/<h[1-6][^>]*>/.test(line)) {
        if (!line.includes('font-coco') && !line.includes('Poppins')) {
          // Only flag if explicitly using wrong font
          if (line.includes('font-inter') || line.includes('Inter')) {
            issues[SEVERITY.MEDIUM].push({
              category: CHECKS.BRAND_CONSISTENCY,
              file: relativePath,
              line: lineNum,
              message: 'Headings should use Poppins (font-coco), not Inter',
              code: line.trim().substring(0, 80),
              fix: 'Add className="font-coco" to heading elements',
            });
          }
        }
      }
      
      // Check for non-standard font families
      if (/fontFamily\s*:\s*['"][^'"]*['"]/.test(line)) {
        const fontMatch = line.match(/fontFamily\s*:\s*['"]([^'"]*)['"]/);
        if (fontMatch) {
          const font = fontMatch[1];
          if (!font.includes('Poppins') && !font.includes('Inter') && !font.includes('system')) {
            issues[SEVERITY.MEDIUM].push({
              category: CHECKS.BRAND_CONSISTENCY,
              file: relativePath,
              line: lineNum,
              message: `Non-brand font family: ${font}`,
              code: line.trim().substring(0, 80),
              fix: 'Use Poppins for headings or Inter for body text',
            });
          }
        }
      }
    });
  }
}

/**
 * Check 9: Browser Compatibility
 */
function checkBrowserCompat() {
  console.log(`${colors.blue}🌐 Checking browser compatibility...${colors.reset}`);
  const files = getAllFiles(SRC_DIR, ['.jsx', '.js']);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Modern JS features without fallbacks
      if (/\?\?/.test(line)) {
        issues[SEVERITY.INFO].push({
          category: CHECKS.BROWSER_COMPAT,
          file: relativePath,
          line: lineNum,
          message: 'Nullish coalescing (??) requires polyfill for IE11',
          code: line.trim().substring(0, 80),
          fix: 'Vite transpiles this automatically, but verify target browsers',
        });
      }
      
      // Optional chaining
      if (/\?\.[a-zA-Z_]/.test(line)) {
        issues[SEVERITY.INFO].push({
          category: CHECKS.BROWSER_COMPAT,
          file: relativePath,
          line: lineNum,
          message: 'Optional chaining (?.) requires polyfill for IE11',
          code: line.trim().substring(0, 80),
          fix: 'Vite transpiles this automatically, but verify target browsers',
        });
      }
    });
  }
}

/**
 * Format and display results
 */
function displayResults() {
  console.log(`\n${'='.repeat(80)}\n`);
  
  const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
  
  if (totalIssues === 0) {
    console.log(`${colors.green}${colors.bold}✅ ALL CHECKS PASSED!${colors.reset}`);
    console.log(`${colors.green}No quality issues found.${colors.reset}\n`);
    return 0;
  }
  
  console.log(`${colors.bold}📊 QUALITY REPORT${colors.reset}\n`);
  console.log(`Total Issues: ${colors.yellow}${totalIssues}${colors.reset}\n`);
  
  // Display by severity
  const severityColors = {
    [SEVERITY.CRITICAL]: colors.red,
    [SEVERITY.HIGH]: colors.yellow,
    [SEVERITY.MEDIUM]: colors.cyan,
    [SEVERITY.LOW]: colors.blue,
    [SEVERITY.INFO]: colors.reset,
  };
  
  const severityIcons = {
    [SEVERITY.CRITICAL]: '🔴',
    [SEVERITY.HIGH]: '🟡',
    [SEVERITY.MEDIUM]: '🟠',
    [SEVERITY.LOW]: '🔵',
    [SEVERITY.INFO]: 'ℹ️',
  };
  
  for (const severity of Object.keys(issues)) {
    if (issues[severity].length === 0) continue;
    
    const color = severityColors[severity];
    const icon = severityIcons[severity];
    
    console.log(`${color}${colors.bold}${icon} ${severity} (${issues[severity].length})${colors.reset}`);
    console.log(`${'-'.repeat(80)}`);
    
    // Group by category
    const byCategory = {};
    for (const issue of issues[severity]) {
      if (!byCategory[issue.category]) byCategory[issue.category] = [];
      byCategory[issue.category].push(issue);
    }
    
    for (const [category, categoryIssues] of Object.entries(byCategory)) {
      console.log(`\n  ${colors.bold}[${category.toUpperCase()}]${colors.reset}`);
      
      for (const issue of categoryIssues) {
        console.log(`  ${issue.file}:${issue.line > 0 ? issue.line : 'global'}`);
        console.log(`    ${colors.bold}Issue:${colors.reset} ${issue.message}`);
        if (issue.code) console.log(`    ${colors.bold}Code:${colors.reset} ${issue.code}`);
        console.log(`    ${colors.bold}Fix:${colors.reset} ${issue.fix}`);
        console.log();
      }
    }
  }
  
  // Summary by category
  console.log(`\n${colors.bold}📈 SUMMARY BY CATEGORY${colors.reset}\n`);
  const categoryCount = {};
  for (const severityIssues of Object.values(issues)) {
    for (const issue of severityIssues) {
      categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
    }
  }
  
  for (const [category, count] of Object.entries(categoryCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${category.padEnd(20)} ${count} issues`);
  }
  
  console.log(`\n${colors.bold}💡 RECOMMENDATIONS${colors.reset}\n`);
  
  const criticalCount = issues[SEVERITY.CRITICAL].length;
  const highCount = issues[SEVERITY.HIGH].length;
  
  if (criticalCount > 0) {
    console.log(`${colors.red}❌ ${criticalCount} CRITICAL issue(s) must be fixed before deployment${colors.reset}`);
    return 1;
  }
  
  if (highCount > 0) {
    console.log(`${colors.yellow}⚠️  ${highCount} HIGH priority issue(s) should be fixed soon${colors.reset}`);
  }
  
  console.log(`\n${colors.bold}📚 RESOURCES${colors.reset}`);
  console.log(`  • Accessibility: WCAG_CERTIFICATION.md`);
  console.log(`  • Dark Mode: DARK_MODE_SYSTEM.md`);
  console.log(`  • Performance: npm run build (check bundle size)`);
  console.log(`  • Security: OWASP Top 10 guidelines`);
  console.log(`  • Full Audit: COMPREHENSIVE_AUDIT_DEC2025.md\n`);
  
  return highCount > 0 ? 1 : 0;
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bold}${colors.cyan}`);
  console.log(`╔════════════════════════════════════════════════════════════════════╗`);
  console.log(`║          🔍 UNIVERSAL CODE QUALITY CHECKER                         ║`);
  console.log(`║          Comprehensive validation across 9 dimensions              ║`);
  console.log(`╚════════════════════════════════════════════════════════════════════╝`);
  console.log(`${colors.reset}\n`);
  
  try {
    checkAccessibility();
    checkDarkMode();
    checkPerformance();
    checkSecurity();
    checkSEO();
    checkCodeQuality();
    checkResponsive();
    checkBrandConsistency();
    checkBrowserCompat();
    
    return displayResults();
  } catch (error) {
    console.error(`${colors.red}Error during quality check:${colors.reset}`, error);
    return 1;
  }
}

// Run and exit
const exitCode = main();
process.exit(exitCode);

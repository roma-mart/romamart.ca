# Quality Checkers Architecture

> Meta-checker system and quality validation architecture

## Overview

Roma Mart uses a two-layer quality checking system:

1. **Universal Quality Checker** - Validates code against 9 dimensions
2. **Meta-Checker** - Validates the quality system itself

## Quality Checker

**File:** `scripts/check-quality.js`

### Dimensions

| Dimension | Description | Example Checks |
|-----------|-------------|----------------|
| Accessibility | WCAG compliance | Alt text, ARIA labels |
| Dark Mode | Theme compatibility | No hardcoded colors |
| Performance | Bundle optimization | Code splitting |
| Security | Vulnerability detection | No exposed secrets |
| SEO | Search optimization | Meta tags present |
| Code Quality | Best practices | No console.log |
| Responsive | Mobile support | Breakpoints |
| Browser | Compatibility | Modern APIs |
| Brand | Design consistency | Token usage |

### Architecture

```
check-quality.js
├── loadFiles()           # Scan source files
├── checkAccessibility()  # A11y validation
├── checkDarkMode()       # Theme checks
├── checkPerformance()    # Bundle analysis
├── checkSecurity()       # Secret scanning
├── checkSEO()            # Meta validation
├── checkCodeQuality()    # Best practices
├── checkResponsive()     # Breakpoints
├── checkBrowser()        # Compatibility
├── checkBrand()          # Token usage
└── generateReport()      # Output results
```

### Severity Levels

```javascript
const SEVERITY = {
  CRITICAL: 'CRITICAL',  // Blocks deployment
  HIGH: 'HIGH',          // Must fix before merge
  MEDIUM: 'MEDIUM',      // Should fix
  LOW: 'LOW',            // Consider fixing
  INFO: 'INFO',          // Informational
};
```

### Running

```bash
npm run check:quality
```

### Output

```
=== Roma Mart Quality Report ===

📊 Summary:
  CRITICAL: 0
  HIGH: 2
  MEDIUM: 5
  LOW: 3
  INFO: 8

🔍 Issues:

[HIGH] src/components/Card.jsx:15
  Missing alt text on image
  Fix: Add descriptive alt attribute

[MEDIUM] src/pages/About.jsx:42
  Missing meta description
  Fix: Add <meta name="description" />
```

## Meta-Checker

**File:** `scripts/check-checker-integrity.js`

### Purpose

Validates the quality checker itself:

- Rules don't conflict
- Aligned with development ethos
- No rule overlap
- Consistent severity assignment

### Checks

1. **Rule Consistency** - Same pattern = same severity
2. **Ethos Alignment** - Rules match principles
3. **No Conflicts** - Rules don't contradict
4. **Coverage** - All dimensions checked

### Running

```bash
npm run check:integrity
```

### Output

```
=== Meta-Checker Report ===

✅ All rules consistent
✅ Aligned with development ethos
✅ No conflicting rules
✅ Full dimension coverage

Integrity: PASS
```

## Integration

### Pre-Commit

```bash
npm run check:all
# Runs: lint + lint:css + check:quality
```

### CI/CD

GitHub Actions runs quality checks on:

- All pull requests to `main`
- All pushes to `main`

### Failure Handling

- CRITICAL/HIGH issues block merge
- MEDIUM issues generate warnings
- LOW/INFO are informational

## Extending

### Adding New Check

1. Create check function in `check-quality.js`
2. Add to dimension array
3. Define severity for findings
4. Add fix suggestions
5. Update meta-checker if needed

### Example Check

```javascript
function checkNewDimension(files) {
  const issues = [];
  
  for (const file of files) {
    if (hasIssue(file)) {
      issues.push({
        severity: SEVERITY.HIGH,
        file: file.path,
        line: file.lineNumber,
        message: 'Issue description',
        fix: 'How to fix',
      });
    }
  }
  
  return issues;
}
```

---

**Related:** [Quality System Guide](../guides/quality-system.md) | [Development Ethos](../../DEVELOPMENT_ETHOS.md)

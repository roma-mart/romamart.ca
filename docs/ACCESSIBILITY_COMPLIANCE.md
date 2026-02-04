# Accessibility Compliance Framework

**Target Standards:**
- ✅ **WCAG 2.2 AA** (Web Content Accessibility Guidelines – Latest Stable)
- ✅ **AODA** (Accessibility for Ontarians with Disabilities Act – Requires WCAG 2.0 AA minimum)
- ✅ **ISO/IEC 40500:2025** (International alignment with WCAG 2.2)
- ✅ **EN 301 549 (EAA)** (European Accessibility Act – Harmonizes with WCAG 2.1 AA + extensibility for WCAG 3.0)
- 🚀 **WCAG 3.0 Ready** (Future-proof with outcome-based principles)

---

## 1. WCAG 2.2 AA Compliance Checklist

### 1.1 Perceivable (Information & user interface must be perceivable)

#### **1.1.1 Text Alternatives (Level A)**
- [ ] All images have descriptive `alt` text (non-decorative)
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] Logos have meaningful `alt` text or linked label
- [ ] Icons have `aria-label` or `title` attribute
- [ ] Charts/infographics have text descriptions or long descriptions

**Status:** ⚠️ Needs Review
- Action: Audit `src/App.jsx` for image/icon elements lacking alt text

#### **1.1.2 Captions & Transcripts (Level A - Video/Audio)**
- [ ] Video has synchronized captions (SRT/WebVTT)
- [ ] Audio has transcript
- [ ] Live audio has real-time captions

**Status:** ✅ N/A (No video/audio on site currently)

#### **1.1.3 Audio Descriptions (Level A - Video)**
- [ ] Complex visual content has audio descriptions
- [ ] Option to toggle descriptions available

**Status:** ✅ N/A

#### **1.1.4 Sensory Characteristics (Level A)**
- [ ] Instructions don't rely solely on color, shape, size, or sound
- [ ] Color is never the only way to identify something

**Status:** ⚠️ Needs Review
- Action: Check if any instructions rely only on color (e.g., "click the yellow button")

#### **1.1.5 Images of Text (Level AA)**
- [ ] No images of text used (use real text instead)
- [ ] Exception: Logos and brand elements

**Status:** ✅ Compliant

---

### 1.2 Adaptable (Content must be adaptable to different presentations)

#### **1.2.1 Info and Relationships (Level A)**
- [ ] Meaningful sequence preserved when linearized (e.g., for screen readers)
- [ ] Relationships conveyed through markup, not just visual

**Status:** ⚠️ Needs Review
- Action: Verify semantic HTML structure (headings hierarchy, lists, etc.)

#### **1.2.2 Meaningful Sequence (Level A)**
- [ ] Content sequence is logical when read linearly
- [ ] Tab order follows visual order

**Status:** ⚠️ Needs Review

#### **1.2.3 Sensory Characteristics (Level A)**
- [ ] Instructions don't rely on shape, color, or spatial location alone

**Status:** ⚠️ Needs Review

#### **1.2.4 Orientation (Level AA - NEW in 2.1/2.2)**
- [ ] Content works in both portrait and landscape
- [ ] No orientation lock except where essential (e.g., piano app)

**Status:** ✅ Compliant (Responsive design)

#### **1.2.5 Identify Input Purpose (Level AA - NEW in 2.1/2.2)**
- [ ] Form inputs clearly labeled
- [ ] Input purpose is programmatically determined
- [ ] Autocomplete attribute used (e.g., `autocomplete="email"`)

**Status:** ⚠️ Needs Review
- Action: Check contact form inputs for proper labels and autocomplete

---

### 1.3 Distinguishable (Text & colors must be easy to see and hear)

#### **1.3.1 Use of Color (Level A)**
- [ ] Color is not the only way to convey information
- [ ] Must have an additional visual indicator (text, pattern, icon)

**Status:** ⚠️ Needs Review
- Action: Audit color-only indicators (e.g., status badges)

#### **1.3.2 Audio Control (Level A)**
- [ ] Audio doesn't auto-play
- [ ] If it does, there's a visible mute button

**Status:** ✅ N/A

#### **1.3.3 Contrast (Minimum) (Level AA)**
- [ ] Text: 4.5:1 contrast ratio (large text: 3:1)
- [ ] Graphical elements: 3:1 contrast ratio

**Status:** ⚠️ **CRITICAL** – Needs verification
- Action: Test contrast ratios for:
  - Navy (#020178) on white (#FFF) – likely FAILS (too dark)
  - Yellow (#E4B340) on white – likely FAILS (too light)
  - Text on backgrounds in dark mode
- Fix: Use accessibility color palette or add lighter/darker variants

#### **1.3.4 Contrast (Enhanced) (Level AAA)**
- [ ] Text: 7:1 contrast ratio (large text: 4.5:1)

**Status:** 🎯 Aspirational (AAA is optional but aligns with ISO 40500)

#### **1.3.5 Text Spacing (Level AA - NEW in 2.1/2.2)**
- [ ] No loss of content when text spacing is customized
- [ ] Line height: ≥ 1.5x font size
- [ ] Paragraph spacing: ≥ 2x font size
- [ ] Letter spacing: ≥ 0.12x font size
- [ ] Word spacing: ≥ 0.16x font size

**Status:** ⚠️ Needs Review
- Action: Verify CSS line-height and spacing values

#### **1.3.6 Target Size (Level AAA - Touch Targets, NEW in 2.5)**
- [ ] Interactive elements ≥ 44×44 CSS pixels (mobile)
- [ ] Minimum 24×24 px for non-identical targets

**Status:** ⚠️ Needs Review
- Action: Check button, link, and input sizes

#### **1.3.7 Visual Presentations (Level AAA)**
- [ ] Text blocks are not full-width (max ~80 chars per line)
- [ ] Line height ≥ 1.5
- [ ] No justified text (left-align or right-align preferred)
- [ ] Background colors don't interfere with readability

**Status:** ⚠️ Needs Review

---

### 1.4 Distinguishable (Continued)

#### **1.4.1 Resize Text (Level AA)**
- [ ] Text can be resized up to 200% without loss of function
- [ ] No horizontal scrolling at 200% zoom

**Status:** ⚠️ Needs Review
- Action: Test at 200% zoom in browser

#### **1.4.2 Reflow (Level AA - NEW in 2.1/2.2)**
- [ ] No horizontal scrolling required at 320px width (mobile)
- [ ] Content reflows to single column

**Status:** ✅ Likely compliant (responsive design)

#### **1.4.3 Non-Text Contrast (Level AA - NEW in 2.1/2.2)**
- [ ] UI components have 3:1 contrast ratio
- [ ] Graphical objects have 3:1 contrast ratio

**Status:** ⚠️ Needs Review

---

## 2. Operable (User interface must be operable)

#### **2.1.1 Keyboard (Level A)**
- [ ] All functionality available via keyboard
- [ ] No keyboard trap (focus can move away)
- [ ] No reliance on pointer

**Status:** ⚠️ Needs Review
- Action: Test tab navigation through entire site
- Check: Mobile menu, dropdown items, buttons

#### **2.1.2 Keyboard Focus Visible (Level AA)**
- [ ] Keyboard focus is visible (outline or highlight)
- [ ] Focus indicator has 3:1 contrast

**Status:** ⚠️ Needs Review
- Action: Add visible focus styles for `:focus` and `:focus-visible`

#### **2.1.3 No Keyboard Trap (Level A)**
- [ ] Focus can be moved away from any element
- [ ] Exception: Modal dialogs (must have escape key)

**Status:** ⚠️ Needs Review

#### **2.1.4 Character Key Shortcuts (Level A - NEW in 2.1/2.2)**
- [ ] If shortcut keys exist, user can disable/remap them
- [ ] Shortcuts don't conflict with browser/assistive tech

**Status:** ✅ N/A (No custom shortcuts)

#### **2.2.1 Timing Adjustable (Level A)**
- [ ] No content auto-advances faster than 3 seconds
- [ ] If present, user can pause, stop, or adjust

**Status:** ⚠️ Needs Review
- Action: Check if carousel/animations auto-play

#### **2.2.2 Pause, Stop, Hide (Level A)**
- [ ] Auto-playing content can be paused/stopped
- [ ] Blinking content stops after 5 seconds or user can pause

**Status:** ⚠️ Needs Review

#### **2.2.3 No Timing (Level AAA)**
- [ ] No time-dependent content

**Status:** 🎯 Aspirational

#### **2.2.4 Interruptions (Level AAA)**
- [ ] User can postpone urgent interruptions

**Status:** 🎯 Aspirational

#### **2.3.1 Three Flashes (Level A)**
- [ ] No content flashes more than 3 times per second
- [ ] Flash area < 25% of viewport or < 10° of visual field

**Status:** ✅ Compliant

#### **2.3.2 Three Flashes (Level AAA)**
- [ ] No flashing content at all (safer threshold)

**Status:** ✅ Compliant

#### **2.4.1 Bypass Blocks (Level A)**
- [ ] Skip navigation link present
- [ ] Allows jumping over repetitive content

**Status:** ❌ **MISSING** – Needs implementation
- Action: Add "Skip to main content" link at top of page

#### **2.4.2 Page Titled (Level A)**
- [ ] Page has descriptive title
- [ ] Title describes page purpose

**Status:** ⚠️ Needs Review
- Current: "roma-mart-site" (too generic)
- Fix: "Roma Mart Convenience – Groceries, Coffee & More in Sarnia, ON"

#### **2.4.3 Focus Order (Level A)**
- [ ] Focus order is logical and meaningful
- [ ] Tab order follows visual order

**Status:** ⚠️ Needs Review

#### **2.4.4 Link Purpose (Level A)**
- [ ] Link text describes destination or purpose
- [ ] Avoid "Click here" or "Read more" alone

**Status:** ⚠️ Needs Review

#### **2.4.5 Multiple Ways (Level AA)**
- [ ] More than one way to find a page (search, sitemap, nav, links)

**Status:** ⚠️ Needs Review

#### **2.4.6 Headings & Labels (Level AA)**
- [ ] Headings describe page sections
- [ ] Form labels describe input purpose

**Status:** ⚠️ Needs Review

#### **2.4.7 Focus Visible (Level AA)**
- [ ] Keyboard focus is always visible

**Status:** ❌ **CRITICAL** – Needs implementation
- Action: Add global focus styles in CSS

#### **2.5.1 Pointer Gestures (Level A - NEW in 2.1/2.2)**
- [ ] No path-dependent gestures (e.g., swipe to delete)
- [ ] Single-click alternative provided

**Status:** ⚠️ Needs Review

#### **2.5.2 Pointer Cancellation (Level A - NEW in 2.1/2.2)**
- [ ] Events trigger on pointer up, not down
- [ ] User can abort by moving pointer away

**Status:** ⚠️ Needs Review

#### **2.5.3 Label in Name (Level A - NEW in 2.1/2.2)**
- [ ] Visible label text matches/is included in accessible name
- [ ] Important for voice control users

**Status:** ⚠️ Needs Review

#### **2.5.4 Motion Actuation (Level A - NEW in 2.1/2.2)**
- [ ] Functionality not triggered by device motion alone
- [ ] Keyboard/button alternative available

**Status:** ✅ N/A (No motion-triggered functionality)

#### **2.5.5 Target Size (Level AAA - NEW in 2.5)**
- [ ] Interactive targets ≥ 44×44 CSS pixels (or equivalent area)

**Status:** ⚠️ Needs Review

#### **2.5.6 Concurrent Input Mechanisms (Level AAA)**
- [ ] Content doesn't restrict input modalities
- [ ] Works with keyboard, mouse, touch, voice, etc.

**Status:** ✅ Likely compliant

---

## 3. Understandable (Content must be understandable)

#### **3.1.1 Language of Page (Level A)**
- [ ] Page language specified in `<html lang="en">`
- [ ] Correct language code used

**Status:** ✅ Compliant
- Current: `lang="en"` ✓

#### **3.1.2 Language of Parts (Level AA)**
- [ ] Language changes marked up (e.g., `<span lang="fr">Bonjour</span>`)

**Status:** ✅ N/A (Single language)

#### **3.2.1 On Focus (Level A)**
- [ ] No unexpected context changes when element receives focus
- [ ] No auto-submission of forms

**Status:** ⚠️ Needs Review

#### **3.2.2 On Input (Level A)**
- [ ] No unexpected context changes when user provides input
- [ ] Form sections submit only on explicit user action

**Status:** ⚠️ Needs Review

#### **3.2.3 Consistent Navigation (Level AA)**
- [ ] Navigation is consistent across pages
- [ ] Repeated components appear in same order

**Status:** ✅ Likely compliant

#### **3.2.4 Consistent Identification (Level AA)**
- [ ] Components with same function are identified consistently

**Status:** ✅ Likely compliant

#### **3.3.1 Error Identification (Level A)**
- [ ] Form errors are identified and described
- [ ] Error location pointed out

**Status:** ⚠️ Needs Review
- Action: Check contact form error handling

#### **3.3.2 Labels or Instructions (Level A)**
- [ ] Form inputs have labels or clear instructions
- [ ] Required fields marked

**Status:** ⚠️ Needs Review

#### **3.3.3 Error Suggestion (Level AA)**
- [ ] Error suggestions provided automatically
- [ ] No suggestion if it would compromise security

**Status:** ⚠️ Needs Review

#### **3.3.4 Error Prevention (Level AA)**
- [ ] Forms allow review and confirmation
- [ ] Legal submissions can be reversed
- [ ] Data loss prevented

**Status:** ⚠️ Needs Review

#### **3.3.5 Help (Level AAA)**
- [ ] Contextual help available
- [ ] Clear instructions provided

**Status:** 🎯 Aspirational

#### **3.4.1 Reading Level (Level AAA)**
- [ ] Content below upper secondary level (Grade 9)
- [ ] Or simpler version provided

**Status:** ⚠️ Needs Review

#### **3.4.2 Pronunciation (Level AAA)**
- [ ] Words with ambiguous pronunciation have clarification

**Status:** 🎯 Aspirational

#### **3.4.3 Abbreviations (Level A - NEW in 2.2)**
- [ ] Abbreviations defined first use
- [ ] Or abbreviation expanded in `title` or using `<abbr>`

**Status:** ⚠️ Needs Review

---

## 4. Robust (Content must be robust & compatible)

#### **4.1.1 Parsing (Level A)**
- [ ] Valid HTML (no duplicate IDs, proper nesting)
- [ ] No malformed markup

**Status:** ⚠️ Needs Review
- Action: Run W3C HTML validator

#### **4.1.2 Name, Role, Value (Level A)**
- [ ] All UI components have accessible name, role, and state
- [ ] ARIA used correctly where native HTML insufficient

**Status:** ⚠️ Needs Review
- Action: Audit ARIA implementation and semantic HTML

#### **4.1.3 Status Messages (Level AA - NEW in 2.1/2.2)**
- [ ] Status messages announced to screen readers
- [ ] `role="status"` or `aria-live="polite"` used

**Status:** ⚠️ Needs Review

#### **4.1.4 Name, Role, Value for All Components (Level A - WCAG 3.0 Alignment)**
- [ ] All custom components expose name, role, state via accessibility tree

**Status:** ⚠️ Needs Review

---

## 5. Additional Compliance Standards

### EN 301 549 (EAA) - European Accessibility Act
- Aligns with WCAG 2.1 AA (currently; moving to WCAG 3.0)
- **Key additions for 2025+:**
  - ✅ WCAG 2.2 compliance
  - ✅ Keyboard navigation (Level A)
  - ✅ Focus visibility (Level AA)
  - ✅ Text alternatives (Level A)
  - ✅ Sufficient contrast (Level AA)
  - ✅ No seizure risk (WCAG 2.3)
  - ✅ Resizable text (Level AA)
  - ✅ Non-text contrast (Level AA)
  - ✅ Target size (Level AAA recommended)

### ISO/IEC 40500:2025
- **Alignment:** WCAG 2.2 AA minimum
- **Expected 2026 version:** Will reference WCAG 3.0 outcomes
- **Conformance levels:** A, AA, AAA
- **Target for Roma Mart:** AA minimum (AA+ aspirational for AAA features)

### AODA (Accessibility for Ontarians with Disabilities Act)
- **Requirement:** WCAG 2.0 AA compliance (we exceed with 2.2 AA)
- **Scope:** Websites, web applications, digital materials
- **Deadline:** Already in effect; ongoing compliance mandatory
- **Enforcement:** Customer complaints, accessibility audits, penalties up to $50,000

---

## 6. Implementation Roadmap

### Phase 1: Critical Issues (Fix Immediately)
- [ ] **Contrast Ratios:** Test and fix navy/yellow on white (likely need 2nd. palette)
- [ ] **Keyboard Navigation:** Add focus styles, test tab order
- [ ] **Skip Link:** Add "Skip to main content" link
- [ ] **Page Title:** Update to descriptive title
- [ ] **Form Labels:** Ensure all inputs have associated labels
- [ ] **Image Alt Text:** Audit all images for descriptive alt text
- [ ] **Semantic HTML:** Verify proper heading hierarchy, use `<nav>`, `<main>`, `<section>`, etc.

**Effort:** 2–4 hours
**Impact:** High – fixes majority of WCAG Level A failures

### Phase 2: Standard Compliance (Implement for AA)
- [ ] **Error Messages:** Add proper error identification & suggestions
- [ ] **Focus Indicators:** Ensure 3:1 contrast on focus outline
- [ ] **Non-Text Contrast:** Fix UI component contrast (3:1)
- [ ] **Reduced Motion:** Respect `prefers-reduced-motion` media query
- [ ] **Resizable Text:** Test at 200% zoom
- [ ] **Link Purpose:** Ensure all links have clear text/context
- [ ] **Multiple Navigation Methods:** Add sitemap or search
- [ ] **ARIA Implementation:** Add ARIA labels where semantic HTML insufficient

**Effort:** 4–6 hours
**Impact:** High – achieves WCAG 2.2 AA + ISO 40500 + AODA compliance

### Phase 3: Enhanced & Future-Ready (AAA + WCAG 3.0)
- [ ] **Enhanced Contrast:** Test for 7:1 ratios where possible
- [ ] **Target Size:** Ensure buttons/links ≥ 44×44 px
- [ ] **Color Palette Alternatives:** Provide dark mode, high-contrast mode
- [ ] **Animated Alternatives:** Provide pause/stop for animations
- [ ] **Status Messages:** Use `aria-live` for dynamic content updates
- [ ] **Help & Instructions:** Add contextual help for complex features
- [ ] **WCAG 3.0 Alignment:** Implement outcome-based checks (e.g., "Can the user perceive all content?")

**Effort:** 4–8 hours
**Impact:** Premium accessibility – exceeds legal requirements, sets industry standard

### Phase 4: Automation & Testing
- [ ] **ESLint Plugin (jsx-a11y):** Add to CI/CD
- [ ] **Automated Tests:** axe-core, pa11y, or similar in CI
- [ ] **Manual Audits:** Quarterly accessibility reviews
- [ ] **User Testing:** Test with actual assistive tech users
- [ ] **Compliance Monitoring:** Track WCAG 3.0 & future standards

**Effort:** 2–4 hours setup; ongoing maintenance
**Impact:** Sustained compliance, catch regressions early

---

## 7. File Structure for Compliance

```
roma-mart-site/
├── .eslintignore (add jsx-a11y rules)
├── .eslintrc.cjs (add jsx-a11y plugin)
├── ACCESSIBILITY_COMPLIANCE.md (this file)
├── ACCESSIBILITY_AUDIT.md (automated audit results)
├── WCAG_CERTIFICATION.md (compliance statement)
├── src/
│   ├── components/
│   │   ├── SkipLink.jsx (NEW: skip nav)
│   │   ├── FocusManagement.jsx (NEW: keyboard nav)
│   │   └── AccessibleForm.jsx (NEW: form with error handling)
│   ├── App.jsx (update with ARIA, semantic HTML)
│   ├── index.css (update focus styles, reduced-motion)
│   └── utils/
│       └── a11y.js (NEW: accessibility helpers)
└── ...
```

---

## 8. Testing Checklist

### Automated Testing
- [ ] **W3C HTML Validator:** https://validator.w3.org/
- [ ] **axe DevTools:** https://www.deque.com/axe/devtools/
- [ ] **WAVE (WebAIM):** https://wave.webaim.org/
- [ ] **Lighthouse:** Chrome DevTools → Lighthouse → Accessibility
- [ ] **Pa11y CLI:** `npx pa11y https://romamart.ca`
- [ ] **Color Contrast Analyzer:** https://www.tpgi.com/color-contrast-checker/

### Manual Testing
- [ ] **Keyboard Navigation:** Tab through entire site, no traps
- [ ] **Screen Reader:** NVDA (Windows), JAWS, or VoiceOver (Mac)
- [ ] **Zoom Testing:** 200% and 400% zoom
- [ ] **Color Blindness:** Simulate with browser extensions
- [ ] **Reduced Motion:** Enable in OS, verify animations pause
- [ ] **Touch Testing:** Mobile devices with screen reader enabled
- [ ] **Browser Testing:** Chrome, Firefox, Safari, Edge

---

## 9. Compliance Statements & Certifications

### WCAG 2.2 AA Conformance Statement (Template)
```
Roma Mart is committed to ensuring digital accessibility for people with disabilities. 
We strive to maintain and continually improve the accessibility of our website to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 AA level.

This website has been tested for compliance with:
- WCAG 2.2 Level AA
- Accessibility for Ontarians with Disabilities Act (AODA)
- ISO/IEC 40500:2025
- EU Accessibility Act (EN 301 549)

If you encounter any accessibility barriers or have feedback, please contact us at:
📧 accessibility@romamart.ca
📞 (382) 342-2000
```

### EN 301 549 EAA Compliance Badge
- Display on footer/about page when fully compliant
- Link to compliance statement

### ISO 40500:2025 / WCAG 3.0 Readiness
- Document progress toward WCAG 3.0 "Outcome" model
- Example: "✓ Perceivable: All content is perceivable to all users"

---

## 10. Recommended Tools & Resources

### ESLint Plugins
```bash
npm install --save-dev eslint-plugin-jsx-a11y
```
Update `.eslintrc.cjs`:
```javascript
module.exports = {
  extends: ['plugin:jsx-a11y/recommended'],
  rules: {
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/aria-role': 'error',
  }
};
```

### Monitoring & Compliance
- **Deque Axe:** https://www.deque.com/axe/
- **WebAIM:** https://webaim.org/
- **TPGI Color Contrast Analyzer:** https://www.tpgi.com/
- **NVDA Screen Reader:** https://www.nvaccess.org/
- **Jest + axe-core:** Automated testing

### Documentation & Learning
- **W3C WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **WCAG 3.0 Draft:** https://www.w3.org/WAI/WCAG3/
- **AODA Standards:** https://www.ontario.ca/laws/regulation/070191
- **EN 301 549:** https://www.etsi.org/deliver/etsi_en/301500_301599/301549/

---

## 11. Next Steps (Recommended Sequence)

1. **This Week:**
   - [ ] Run automated audits (Lighthouse, axe, WAVE)
   - [ ] Document all failures in `ACCESSIBILITY_AUDIT.md`
   - [ ] Test contrast ratios for brand colors

2. **Next 1-2 Weeks:**
   - [ ] Implement Phase 1 fixes (critical issues)
   - [ ] Add focus styles & keyboard navigation
   - [ ] Fix form labels & error handling
   - [ ] Add skip link

3. **Following 2 Weeks:**
   - [ ] Implement Phase 2 (AA compliance)
   - [ ] Add ARIA labels & semantic HTML
   - [ ] Respect `prefers-reduced-motion`

4. **Ongoing:**
   - [ ] Set up CI/CD with ESLint jsx-a11y plugin
   - [ ] Quarterly accessibility audits
   - [ ] Monitor WCAG 3.0 & ISO 40500:2026 updates

---

## 12. Success Metrics

- ✅ **WCAG 2.2 AA:** 0 failures, 0 warnings
- ✅ **Keyboard Navigation:** 100% of interactive elements accessible via keyboard
- ✅ **Contrast Ratios:** All text & UI components meet 4.5:1 (AA) or higher
- ✅ **Screen Reader:** All content perceivable via assistive tech
- ✅ **Zoom:** Content reflows correctly at 200%+ zoom
- ✅ **Automation:** ESLint jsx-a11y + axe-core in CI with 0 failures
- ✅ **Certification:** Display WCAG 2.2 AA + ISO 40500 + AODA compliance statements
- 🚀 **WCAG 3.0 Ready:** Outcome-based principles documented and ready for implementation

---

**Document Version:** 1.0  
**Last Updated:** November 30, 2025  
**Next Review:** December 15, 2025

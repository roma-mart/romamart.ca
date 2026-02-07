# Accessibility Compliance Framework

**Target Standards:**
- ✅ **WCAG 2.2 AA** (Web Content Accessibility Guidelines — Latest Stable)
- ✅ **AODA** (Accessibility for Ontarians with Disabilities Act — Requires WCAG 2.0 AA minimum)
- ✅ **ISO/IEC 40500** (International alignment with WCAG)
- ✅ **EN 301 549 (EAA)** (European Accessibility Act — Harmonizes with WCAG 2.1 AA)
- 🎯 **WCAG 3.0** (Monitoring draft standard for future adoption)

---

## 1. Perceivable

> Information and user interface components must be presentable to users in ways they can perceive.

### Guideline 1.1 — Text Alternatives

#### 1.1.1 Non-text Content (Level A)
- [ ] All images have descriptive `alt` text (non-decorative)
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] Icons have `aria-label` or `aria-hidden="true"` (decorative when paired with text)

**Status:** ⚠️ Partial
- Most images have correct alt text (hero sign, location thumbnails, team photos)
- Decorative pattern images correctly use `alt=""` + `aria-hidden="true"` (App.jsx:78)
- **Issue:** Some decorative Lucide icons next to text labels lack `aria-hidden="true"`:
  - ContactPage.jsx: MapPin (line 132), Phone (line 151), Mail (line 170), Clock (line 189)
  - LocationsPage.jsx: Building2 (line 166), MapPin (line 175), Phone (line 199)
  - AccessibilityPage.jsx: CheckCircle (line 68), Mail (line 128), Phone (line 133), MapPin (line 138)
  - App.jsx contact section: MapPin (line 471), Phone (line 487), Clock (line 506)
- **Issue:** App.jsx:241 — `alt="RoCafe"` on sticker image is non-descriptive

### Guideline 1.2 — Time-based Media

#### 1.2.1 Audio-only and Video-only (Level A)

**Status:** ✅ N/A — No audio/video content on site

### Guideline 1.3 — Adaptable

#### 1.3.1 Info and Relationships (Level A)
- [ ] Heading hierarchy is logical and sequential
- [ ] Lists use proper `<ul>`/`<ol>` markup
- [ ] Relationships conveyed through markup, not just visual

**Status:** ⚠️ Partial
- Every page has an `<h1>` element
- **Issue:** Heading levels skip in several places:
  - App.jsx lines 474, 490, 509: `<h4>` without parent `<h3>` in contact section
  - ContactPage.jsx lines 135, 155, 174, 193: `<h4>` without parent `<h3>`
  - ServicesPage.jsx line 144: `<h3>` used where `<h2>` expected
  - Footer.jsx lines 288, 323: heading hierarchy issues
- Semantic landmarks used: `<nav>`, `<main>`, page-level sections present

#### 1.3.2 Meaningful Sequence (Level A)
- [ ] Content sequence is logical when read linearly
- [ ] Tab order follows visual order

**Status:** ⚠️ Needs Manual Testing — DOM order appears logical; no CSS that reorders content detected

#### 1.3.3 Sensory Characteristics (Level A)
- [ ] Instructions don't rely solely on color, shape, size, or sound

**Status:** ✅ Compliant — No sensory-only instructions found in user-facing content

#### 1.3.4 Orientation (Level AA)
- [ ] Content works in both portrait and landscape

**Status:** ✅ Compliant — Responsive design via Tailwind, no orientation lock

#### 1.3.5 Identify Input Purpose (Level AA)
- [ ] Form inputs use `autocomplete` attribute where appropriate

**Status:** ❌ Fail
- **Issue:** All name/email/phone fields missing `autocomplete` attribute:
  - ContactPage.jsx lines 243, 259, 275 — need `autoComplete="name"`, `"email"`, `"tel"`
  - App.jsx lines 554, 570 — need `autoComplete="name"`, `"email"`

### Guideline 1.4 — Distinguishable

#### 1.4.1 Use of Color (Level A)
- [ ] Color is not the only way to convey information

**Status:** ⚠️ Needs Review — Form errors use red color but also have text messages and icons; likely compliant

#### 1.4.2 Audio Control (Level A)

**Status:** ✅ N/A — No audio auto-play

#### 1.4.3 Contrast (Minimum) (Level AA)
- [ ] Normal text: 4.5:1 contrast ratio
- [ ] Large text (18pt+): 3:1 contrast ratio
- [ ] UI components: 3:1 contrast ratio

**Status:** ⚠️ Partial — Needs Measurement
- ✅ Navy `#020178` on white `#fff`: ~13.8:1 — **Passes AAA**
- ✅ Dark text `#151515` on yellow `#E4B340`: ~8.5:1 — **Passes AAA**
- ✅ Muted text `#5a5a5a` on surface `#f8f8f8`: ~5.4:1 — **Passes AA**
- ❌ Yellow accent `#E4B340` on white `#fff`: ~1.9:1 — **Fails AA** (used in ServicesPage breadcrumb link)
- ✅ High-contrast mode (`prefers-contrast: high`) adjusts accent to `#B8860B` — mitigates for those users
- 🎯 Dark mode values need manual verification

#### 1.4.4 Resize Text (Level AA)
- [ ] Text can be resized up to 200% without loss of function

**Status:** ⚠️ Needs Manual Testing — Font sizes use `rem` units throughout (tokens.js), which is correct practice

#### 1.4.5 Images of Text (Level AA)
- [ ] No images of text used (except logos)

**Status:** ✅ Compliant — Only logo images and one photograph of a real-world sign

#### 1.4.10 Reflow (Level AA)
- [ ] No horizontal scrolling at 320px viewport width

**Status:** ⚠️ Needs Manual Testing — Responsive design with Tailwind breakpoints suggests compliance

#### 1.4.11 Non-text Contrast (Level AA)
- [ ] UI components and graphical objects have 3:1 contrast ratio

**Status:** ⚠️ Needs Manual Testing

#### 1.4.12 Text Spacing (Level AA)
- [ ] No loss of content when text spacing is customized

**Status:** ✅ Likely Compliant
- Line heights use relative unitless values (1.2–1.75 in tokens.js)
- Font sizes use `rem` units
- No fixed-height containers observed that would clip text

#### 1.4.13 Content on Hover or Focus (Level AA)
- [ ] Hoverable/focusable content can be dismissed, hovered, and persists

**Status:** ⚠️ Needs Review — Tooltips and hover effects exist (title attributes on social icons)

---

## 2. Operable

> User interface components and navigation must be operable.

### Guideline 2.1 — Keyboard Accessible

#### 2.1.1 Keyboard (Level A)
- [ ] All functionality available via keyboard
- [ ] Custom interactive elements have keyboard handlers

**Status:** ✅ Compliant
- All buttons use semantic `<button>` or `<a>` elements
- Custom interactive elements (StandardizedItem, CategoryAccordion) have `role="button"`, `tabIndex={0}`, keyboard handlers for Enter/Space
- Button component includes onKeyDown handlers for all variants

#### 2.1.2 No Keyboard Trap (Level A)
- [ ] Focus can be moved away from any element
- [ ] Modal dialogs have Escape key to close

**Status:** ✅ Compliant
- `useFocusTrap` hook (src/hooks/useFocusTrap.js) handles Escape key, Tab/Shift+Tab cycling, and focus restoration
- Used in Navbar mobile menu (line 117) and PWAInstallPrompt (line 180)

#### 2.1.4 Character Key Shortcuts (Level A)
- [ ] If shortcuts exist, user can disable/remap them

**Status:** ✅ N/A — No custom keyboard shortcuts

### Guideline 2.2 — Enough Time

#### 2.2.1 Timing Adjustable (Level A)
- [ ] No content auto-advances without pause control
- [ ] If present, user can pause, stop, or extend

**Status:** ❌ Fail
- **Issue:** AboutPage.jsx line 31: Hero carousel auto-advances every 5 seconds without pause/play control
- **Issue:** LocationImageCarousel.jsx line 40: Auto-rotates every 5 seconds with no pause control
- Manual prev/next buttons exist but no explicit pause button
- Global `prefers-reduced-motion` CSS stops animations but may not stop JS timers

#### 2.2.2 Pause, Stop, Hide (Level A)
- [ ] Auto-playing content can be paused/stopped

**Status:** ❌ Fail — Same carousel auto-play issues as 2.2.1

### Guideline 2.3 — Seizures and Physical Reactions

#### 2.3.1 Three Flashes or Below Threshold (Level A)
- [ ] No content flashes more than 3 times per second

**Status:** ✅ Compliant — No flashing content

### Guideline 2.4 — Navigable

#### 2.4.1 Bypass Blocks (Level A)
- [ ] Skip navigation link present

**Status:** ✅ Compliant
- Skip link at App.jsx:779: `<a href="#main-content" className="skip-link">Skip to main content</a>`
- Target `id="main-content"` exists at App.jsx:781
- CSS (index.css:93–110) hides by default, visible on focus

#### 2.4.2 Page Titled (Level A)
- [ ] Page has descriptive, unique title

**Status:** ⚠️ Partial
- Per-page titles set via react-helmet-async (e.g., "Contact Us | Roma Mart Convenience")
- Action: Verify default/fallback title in index.html is descriptive

#### 2.4.3 Focus Order (Level A)
- [ ] Tab order follows visual layout
- [ ] No `tabindex` values greater than 0

**Status:** ✅ Compliant — All tabindex values are 0 or -1; no positive values found

#### 2.4.4 Link Purpose (In Context) (Level A)
- [ ] Link text describes destination or purpose

**Status:** ⚠️ Partial
- Most links have descriptive text or aria-labels
- **Minor:** AccessibilityPage.jsx line 76: "Learn more" link — context available from card but link text alone is generic
- No instances of "click here" found

#### 2.4.5 Multiple Ways (Level AA)
- [ ] More than one way to find a page (nav, footer links, etc.)

**Status:** ✅ Compliant — Navigation in navbar + footer links + sitemap in footer

#### 2.4.6 Headings and Labels (Level AA)
- [ ] Headings describe page sections
- [ ] Form labels describe input purpose

**Status:** ✅ Compliant — Headings are descriptive, form labels clearly identify fields

#### 2.4.7 Focus Visible (Level AA)
- [ ] Keyboard focus indicator is always visible

**Status:** ✅ Compliant
- index.css:72–89: `:focus-visible` with 3px solid accent outline, 2px offset
- Fallback `:focus` style for older browsers
- Mouse-only focus correctly hidden via `:focus:not(:focus-visible)`
- Forced-colors mode support at index.css:154

#### 2.4.11 Focus Not Obscured (Minimum) (Level AA) — NEW in WCAG 2.2
- [ ] Focused element is not entirely hidden by other content

**Status:** ⚠️ Needs Manual Testing — No sticky footers or overlays detected that would obscure focus, but should test with sticky navbar

### Guideline 2.5 — Input Modalities

#### 2.5.1 Pointer Gestures (Level A)
- [ ] No path-dependent gestures (swipe, drag, etc.)

**Status:** ✅ Compliant — Carousels use button controls; no complex gestures

#### 2.5.2 Pointer Cancellation (Level A)
- [ ] Actions trigger on pointer up, not down

**Status:** ✅ Likely Compliant — Standard button/link behavior used throughout

#### 2.5.3 Label in Name (Level A)
- [ ] Visible label text matches accessible name

**Status:** ⚠️ Needs Review

#### 2.5.4 Motion Actuation (Level A)
- [ ] No device-motion-triggered features

**Status:** ✅ N/A — No motion-triggered functionality

#### 2.5.7 Dragging Movements (Level AA) — NEW in WCAG 2.2
- [ ] Dragging actions have non-dragging alternative

**Status:** ✅ N/A — No drag interactions

#### 2.5.8 Target Size (Minimum) (Level AA) — NEW in WCAG 2.2
- [ ] Touch targets at least 24×24 CSS pixels

**Status:** ✅ Compliant
- Button component enforces min 44×44px on all variants (Button.jsx:111, 124, 161)
- LocationButton: 44×44px, OrderCTA: 56×56px, Footer back-to-top: 44×44px
- **Minor:** Carousel indicator dots (AboutPage.jsx:229, LocationImageCarousel.jsx:89) are only 8px — but per WCAG 2.5.8 exception, adjacent targets with sufficient spacing between them may be smaller

---

## 3. Understandable

> Information and operation of user interface must be understandable.

### Guideline 3.1 — Readable

#### 3.1.1 Language of Page (Level A)
- [ ] `<html lang="en">` present

**Status:** ✅ Compliant — index.html:2 has `lang="en"`

#### 3.1.2 Language of Parts (Level AA)
- [ ] Sections in other languages marked with `lang` attribute

**Status:** ✅ N/A — Single-language site; borrowed terms (e.g., "Halal", "Zabiha") are commonly used in English

### Guideline 3.2 — Predictable

#### 3.2.1 On Focus (Level A)
- [ ] No context change triggered solely by focus

**Status:** ✅ Compliant — All onFocus handlers only modify visual styles (hover effects)

#### 3.2.2 On Input (Level A)
- [ ] No unexpected context changes on input

**Status:** ✅ Compliant — All onChange handlers update state only; no automatic navigation or submission

#### 3.2.3 Consistent Navigation (Level AA)
- [ ] Navigation order consistent across pages

**Status:** ✅ Compliant — Centralized nav config (src/config/navigation.js) used by Navbar/Footer

#### 3.2.4 Consistent Identification (Level AA)
- [ ] Same-function components identified consistently

**Status:** ✅ Compliant — Unified Button component; consistent labeling ("Order Now", "Get Directions")

#### 3.2.6 Consistent Help (Level A) — NEW in WCAG 2.2
- [ ] Help/contact mechanisms in consistent location across pages

**Status:** ✅ Compliant — Footer with contact info renders on all pages; Contact link in same navbar position

### Guideline 3.3 — Input Assistance

#### 3.3.1 Error Identification (Level A)
- [ ] Form errors identified and described in text
- [ ] Error location pointed out

**Status:** ✅ Compliant
- Both contact forms use `aria-invalid`, `aria-describedby`, inline error messages
- Error containers use `role="alert"` with `aria-live="assertive"`
- Specific error messages: "Name is required.", "Email is required.", "Message is required."

#### 3.3.2 Labels or Instructions (Level A)
- [ ] All form inputs have visible labels
- [ ] Required fields indicated

**Status:** ✅ Compliant
- All inputs have `<label htmlFor>` with matching `id`
- Required fields marked with asterisk (*) and HTML `required` attribute

#### 3.3.3 Error Suggestion (Level AA)
- [ ] Suggestions provided when errors are detected

**Status:** ⚠️ Partial
- Required-field errors are clear ("Name is required.")
- **Issue:** No custom email format validation — relies on browser `type="email"` validation only
- No suggestions like "Please enter a valid email address (e.g., name@example.com)"

#### 3.3.4 Error Prevention — Legal, Financial, Data (Level AA)
- [ ] User can review/correct before final submission

**Status:** ✅ N/A — Contact form only; no legal/financial transactions

#### 3.3.7 Redundant Entry (Level A) — NEW in WCAG 2.2
- [ ] Users not asked to re-enter previously provided information

**Status:** ✅ Compliant — Single-step contact forms; no multi-step flows requiring redundant entry

#### 3.3.8 Accessible Authentication (Minimum) (Level AA) — NEW in WCAG 2.2
- [ ] No cognitive function test required for authentication

**Status:** ✅ Pass (with note)
- hCaptcha used on contact form (ContactPage.jsx:299–309) — provides accessibility mode with audio challenges
- This is a contact form, not authentication — WCAG 2.2 allows CAPTCHA for security/bot-prevention
- Alternative contact methods (phone, email, in-person) available from same page

---

## 4. Robust

> Content must be robust enough to be interpreted reliably by assistive technologies.

### Guideline 4.1 — Compatible

#### 4.1.1 Parsing (Level A) — Obsolete in WCAG 2.2
- Always passes in WCAG 2.2 (deprecated criterion)
- No duplicate ID conflicts found between the two contact forms (App.jsx uses `contact-*` prefix)
- **Minor:** BrandPatternBackground.jsx:8 uses `id="rm-swoosh"` — ensure single instance per page

#### 4.1.2 Name, Role, Value (Level A)
- [ ] Custom components expose accessible name, role, state

**Status:** ⚠️ Partial
- ✅ Mobile menu: `role="dialog"`, `aria-modal="true"`, `aria-label` (Navbar.jsx:242–244)
- ✅ PWA prompt: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` (PWAInstallPrompt.jsx:190–193)
- ✅ StandardizedItem: `aria-expanded`, `role="button"`, keyboard handlers (BasicView.jsx:73–74, 150, 155)
- ✅ CategoryAccordion: `aria-expanded`, `aria-controls` (CategoryAccordionHeader.jsx:31–32)
- **Issue:** RoCafePage.jsx line 175: `aria-controls` references `category-panel-${category.id}` but the controlled panel at line 180 has no matching `id` — broken ARIA reference
- **Issue:** Footer.jsx line 394: `aria-describedby="footer-location-helper"` references non-existent element

#### 4.1.3 Status Messages (Level AA)
- [ ] Dynamic status changes announced to assistive tech

**Status:** ⚠️ Partial
- ✅ Contact form success: `role="status"` + `aria-live="polite"` (App.jsx:531, ContactPage.jsx:217)
- ✅ Contact form errors: `role="alert"` + `aria-live="assertive"` (App.jsx:536, ContactPage.jsx:229)
- ✅ Toast notifications: `role="alert"` + `aria-live="polite"` (Toast.jsx:56–57)
- ✅ Network status: `role="status"` + `aria-live="polite"` (NetworkStatus.jsx:35–36)
- **Issue:** Loading states not announced — LiveHoursDisplay.jsx:178–192 and App.jsx:208–212 lack `aria-live` on loading indicators

---

## 5. Additional Compliance Standards

### EN 301 549 (EAA) — European Accessibility Act
- Aligns with WCAG 2.1 AA (currently; moving to WCAG 2.2 alignment)
- Roma Mart targets WCAG 2.2 AA, which exceeds EN 301 549 minimum

### ISO/IEC 40500
- ISO/IEC 40500 is the ISO formalization of WCAG 2.0
- Alignment maintained through WCAG 2.2 AA conformance
- **Conformance levels:** A, AA, AAA
- **Target for Roma Mart:** AA

### AODA (Accessibility for Ontarians with Disabilities Act)
- **Requirement:** WCAG 2.0 AA compliance (we exceed with 2.2 AA target)
- **Scope:** Websites, web applications, digital materials
- **Deadline:** Already in effect; ongoing compliance mandatory
- **Enforcement:** Customer complaints, accessibility audits, penalties up to $50,000

---

## 6. Audit Results Summary

### Self-Audit: February 7, 2026

| Criterion | Level | Status | Action Required |
|-----------|-------|--------|-----------------|
| 1.1.1 Non-text Content | A | ⚠️ Partial | Add `aria-hidden="true"` to decorative icons |
| 1.3.1 Info and Relationships | A | ⚠️ Partial | Fix heading hierarchy skips (h2→h4) |
| 1.3.3 Sensory Characteristics | A | ✅ Pass | — |
| 1.3.4 Orientation | AA | ✅ Pass | — |
| 1.3.5 Identify Input Purpose | AA | ❌ Fail | Add `autocomplete` to name/email/phone fields |
| 1.4.1 Use of Color | A | ⚠️ Review | Verify errors not color-only |
| 1.4.3 Contrast (Minimum) | AA | ⚠️ Partial | Yellow `#E4B340` on white fails; other combos pass |
| 1.4.4 Resize Text | AA | ⚠️ Review | Manual 200% zoom test needed |
| 1.4.5 Images of Text | AA | ✅ Pass | — |
| 1.4.10 Reflow | AA | ⚠️ Review | Manual 320px test needed |
| 1.4.11 Non-text Contrast | AA | ⚠️ Review | Manual measurement needed |
| 1.4.12 Text Spacing | AA | ✅ Pass | Relative units used |
| 1.4.13 Content on Hover/Focus | AA | ⚠️ Review | Manual test needed |
| 2.1.1 Keyboard | A | ✅ Pass | — |
| 2.1.2 No Keyboard Trap | A | ✅ Pass | — |
| 2.1.4 Character Key Shortcuts | A | ✅ N/A | — |
| 2.2.1 Timing Adjustable | A | ❌ Fail | Add pause control to carousels |
| 2.2.2 Pause, Stop, Hide | A | ❌ Fail | Same as 2.2.1 |
| 2.3.1 Three Flashes | A | ✅ Pass | — |
| 2.4.1 Bypass Blocks | A | ✅ Pass | — |
| 2.4.2 Page Titled | A | ⚠️ Partial | Verify default title in index.html |
| 2.4.3 Focus Order | A | ✅ Pass | — |
| 2.4.4 Link Purpose (Context) | A | ⚠️ Minor | Some "Learn more" links lack full context |
| 2.4.5 Multiple Ways | AA | ✅ Pass | — |
| 2.4.6 Headings and Labels | AA | ✅ Pass | — |
| 2.4.7 Focus Visible | AA | ✅ Pass | — |
| 2.4.11 Focus Not Obscured | AA | ⚠️ Review | Manual test with sticky nav needed |
| 2.5.1 Pointer Gestures | A | ✅ Pass | — |
| 2.5.2 Pointer Cancellation | A | ✅ Pass | — |
| 2.5.3 Label in Name | A | ⚠️ Review | Manual test needed |
| 2.5.4 Motion Actuation | A | ✅ N/A | — |
| 2.5.7 Dragging Movements | AA | ✅ N/A | — |
| 2.5.8 Target Size (Minimum) | AA | ✅ Pass | 44px minimum enforced; carousel dots noted |
| 3.1.1 Language of Page | A | ✅ Pass | — |
| 3.1.2 Language of Parts | AA | ✅ N/A | — |
| 3.2.1 On Focus | A | ✅ Pass | — |
| 3.2.2 On Input | A | ✅ Pass | — |
| 3.2.3 Consistent Navigation | AA | ✅ Pass | — |
| 3.2.4 Consistent Identification | AA | ✅ Pass | — |
| 3.2.6 Consistent Help | A | ✅ Pass | — |
| 3.3.1 Error Identification | A | ✅ Pass | — |
| 3.3.2 Labels or Instructions | A | ✅ Pass | — |
| 3.3.3 Error Suggestion | AA | ⚠️ Partial | Add email format validation message |
| 3.3.4 Error Prevention | AA | ✅ N/A | — |
| 3.3.7 Redundant Entry | A | ✅ Pass | — |
| 3.3.8 Accessible Authentication | AA | ✅ Pass | hCaptcha with accessibility mode; alternative contact methods available |
| 4.1.2 Name, Role, Value | A | ⚠️ Partial | Fix broken `aria-controls` in RoCafePage, broken `aria-describedby` in Footer |
| 4.1.3 Status Messages | AA | ⚠️ Partial | Add `aria-live` to loading states |

### Counts
- ✅ **Pass / N/A:** 29
- ⚠️ **Partial / Needs Review:** 15
- ❌ **Fail:** 3

### Critical Fixes Required (for AA conformance)
1. **1.3.5:** Add `autocomplete` attributes to name, email, phone form fields
2. **2.2.1/2.2.2:** Add pause/play controls to auto-advancing carousels, or stop auto-play when `prefers-reduced-motion` is set
3. **4.1.2:** Fix broken `aria-controls` reference in RoCafePage accordion; fix broken `aria-describedby` in Footer

### High Priority Fixes
4. **1.1.1:** Add `aria-hidden="true"` to decorative Lucide icons across ContactPage, LocationsPage, AccessibilityPage, App.jsx
5. **1.3.1:** Fix heading hierarchy — change `<h4>` to `<h3>` in contact sections (App.jsx, ContactPage.jsx)
6. **1.4.3:** Address yellow accent text on white backgrounds (consider using `#B8860B` or `--color-on-accent` text for accent links)
7. **4.1.3:** Add `aria-live="polite"` to loading state containers

### Improvements
8. **3.3.3:** Add email format validation with descriptive error message
9. **2.4.4:** Add `aria-label` to generic "Learn more" links

---

## 7. Implementation Roadmap

### Phase 1: Critical Fixes (AA Blockers)
- [ ] Add `autoComplete="name"`, `"email"`, `"tel"` to form inputs (ContactPage.jsx, App.jsx)
- [ ] Add pause/play control or `prefers-reduced-motion` check to carousel auto-advance (AboutPage.jsx, LocationImageCarousel.jsx)
- [ ] Add `id={`category-panel-${category.id}`}` to accordion panel in RoCafePage.jsx
- [ ] Add or remove `aria-describedby` helper text element in Footer.jsx

### Phase 2: High Priority
- [x] **Skip Link:** Implemented in App.jsx
- [x] **Focus Visible:** `:focus-visible` styles in index.css
- [x] **Keyboard Navigation:** Focus traps on modal dialogs (useFocusTrap hook)
- [x] **Error Messages:** `aria-invalid`, `aria-describedby`, `aria-live` on contact forms
- [x] **ARIA Implementation:** Dialog roles, aria-modal on mobile nav and PWA prompt, aria-label on footer social icons
- [x] **Reduced Motion:** `prefers-reduced-motion` respected via CSS and Framer Motion `useReducedMotion()`
- [ ] Add `aria-hidden="true"` to decorative Lucide icons
- [ ] Fix heading hierarchy (h4 → h3 in contact sections)
- [ ] Fix yellow-on-white contrast for accent text links
- [ ] Add `aria-live="polite"` to loading state containers

### Phase 3: Manual Testing Required
- [ ] Contrast ratio verification with color contrast analyzer tool
- [ ] 200% zoom test across all pages
- [ ] 320px viewport width reflow test
- [ ] Screen reader testing (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Keyboard-only navigation end-to-end walkthrough
- [ ] Test with `prefers-reduced-motion` enabled — verify carousels stop

### Phase 4: Automation & Ongoing
- [ ] Set up ESLint jsx-a11y plugin in CI/CD
- [ ] Add axe-core or pa11y automated testing
- [ ] Quarterly accessibility audits
- [ ] Monitor WCAG 3.0 draft updates

---

## 8. File Structure

```
romamart.ca/
├── docs/
│   └── ACCESSIBILITY_COMPLIANCE.md (this file)
├── src/
│   ├── hooks/
│   │   └── useFocusTrap.js (focus trap for modal dialogs)
│   ├── components/
│   │   ├── Navbar.jsx (mobile nav: dialog role, focus trap, aria-modal)
│   │   ├── PWAInstallPrompt.jsx (PWA prompt: aria-modal, focus trap)
│   │   ├── Footer.jsx (social icons: aria-label)
│   │   ├── AccessibilityPage.jsx (public accessibility statement)
│   │   ├── Toast.jsx (role="alert", aria-live)
│   │   └── NetworkStatus.jsx (role="status", aria-live)
│   ├── pages/
│   │   └── ContactPage.jsx (form validation, aria-live, aria-invalid)
│   ├── App.jsx (skip link, contact form ARIA, semantic HTML)
│   └── index.css (focus styles, reduced-motion, high-contrast)
└── ...
```

---

## 9. Testing Checklist

### Automated Testing
- [ ] axe DevTools: https://www.deque.com/axe/devtools/
- [ ] WAVE (WebAIM): https://wave.webaim.org/
- [ ] Lighthouse: Chrome DevTools → Lighthouse → Accessibility
- [ ] Pa11y CLI: `npx pa11y https://romamart.ca`
- [ ] Color Contrast Analyzer: https://www.tpgi.com/color-contrast-checker/

### Manual Testing
- [ ] Keyboard Navigation: Tab through entire site, verify focus traps work
- [ ] Screen Reader: NVDA (Windows), JAWS, or VoiceOver (Mac)
- [ ] Zoom Testing: 200% and 400% zoom
- [ ] Reduced Motion: Enable in OS, verify carousels stop and animations pause
- [ ] Touch Testing: Mobile devices with screen reader enabled
- [ ] Browser Testing: Chrome, Firefox, Safari, Edge

---

## 10. Conformance Statement

### WCAG 2.2 AA Conformance Statement (Template)
```
Roma Mart is committed to ensuring digital accessibility for people with disabilities.
We strive to maintain and continually improve the accessibility of our website to conform
to the Web Content Accessibility Guidelines (WCAG) 2.2 AA level.

This website has been evaluated for conformance with:
- WCAG 2.2 Level AA
- Accessibility for Ontarians with Disabilities Act (AODA)
- ISO/IEC 40500 (International standardization of WCAG)
- EU Accessibility Act (EN 301 549)

Known limitations:
- Auto-advancing carousels on About page lack pause controls (fix in progress)
- Some color contrast ratios for accent color on light backgrounds need remediation

If you encounter any accessibility barriers or have feedback, please contact us at:
accessibility@romamart.ca
(382) 342-2000
```

---

## 11. Resources

### Standards
- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- WCAG 2.2 Understanding Docs: https://www.w3.org/WAI/WCAG22/Understanding/
- AODA Standards: https://www.ontario.ca/laws/regulation/070191
- EN 301 549: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/

### Tools
- Deque axe: https://www.deque.com/axe/
- WebAIM: https://webaim.org/
- TPGI Color Contrast Analyzer: https://www.tpgi.com/
- NVDA Screen Reader: https://www.nvaccess.org/

---

## 12. Success Metrics

- 🎯 **WCAG 2.2 AA:** Zero Level A and AA failures on automated audit — currently 3 failures, 15 needing review
- ✅ **Keyboard Navigation:** All interactive elements keyboard accessible, modal dialogs use focus traps
- 🎯 **Contrast Ratios:** All text meets 4.5:1 AA — yellow accent on white needs fix
- ✅ **Screen Reader:** Form errors announced via aria-live, social icons labeled, dialog roles set
- 🎯 **Zoom:** Content reflows at 200%+ — needs manual testing
- 🎯 **Automation:** ESLint jsx-a11y in CI — not yet set up
- ✅ **Conformance Statement:** WCAG 2.2 AA + ISO/IEC 40500 + AODA + EN 301 549 documented

---

**Document Version:** 2.0
**Last Updated:** February 7, 2026
**Audit Performed:** February 7, 2026 (code-level self-audit)
**Next Review:** May 2026

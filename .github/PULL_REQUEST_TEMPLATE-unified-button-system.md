## ✨ Unify Button System & Retheming (#22)

### Overview

This PR implements a unified Button component across all major CTAs and interactive elements, ensuring:
- Consistent animation, accessibility, and analytics
- Full design token and CSS variable compliance for retheming
- Refactoring of RoCafePage, LocationsPage, Toast, PWAInstallPrompt, ContactPage, and all legal/accessibility pages

### Linked Issue

Closes #22

---

### What’s Changed

- Replaced all native `<button>` and CTA `<a>` tags with the unified `Button` component
- Updated RoCafePage and LocationsPage category headers and CTAs to use correct Button variants (`navlink`, `nav`)
- Ensured all interactive elements use only design tokens/CSS variables for color and typography
- Fixed chevron alignment for category headers to match menu item headers
- **Note:** Location system buttons (e.g., NearestStoreButton, CopyButton) still exist on some pages. These should be removed from individual pages and added to the Footer, unified according to the new button logic, in a future update.

---

### Testing Checklist

- [ ] All CTAs and interactive elements use the unified Button
- [ ] Button animation and accessibility are consistent site-wide
- [ ] No hardcoded colors or legacy color aliases remain
- [ ] Chevron alignment matches menu item headers
- [ ] `npm run check:all` passes
- [ ] Manual test: light/dark mode, keyboard nav, responsive

---

### Screenshots / Recordings

<!-- Add before/after screenshots or screen recordings if possible -->

---

### Notes for Reviewers

- Please focus on visual consistency, accessibility, and retheming compliance
- Let me know if you spot any missed native buttons or color issues
- See note above regarding location system buttons

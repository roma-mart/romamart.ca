# Content Phase Plan - Roma Mart Website

**Structure:** Site-Wide → Page-Specific  
**Priority:** 🔴 Critical → 🟡 High → 🟢 Medium → ⚪ Low  
**Date:** December 1, 2025

---

## Executive Summary

The Roma Mart website is **technically complete** (98/100 health score). Only **content assets** are needed before launch:

**Content Categories:**
1. **Configuration Updates** (API keys, URLs) - 🔴 Critical
2. **Site-Wide Assets** (favicon, OG image, logo) - 🟡 High
3. **Page-Specific Images** (store photos, team, menu) - 🟢 Medium
4. **Text Content** (copy enrichment, menu data) - ⚪ Low

**Estimated Time to Complete:** 2-4 hours (content preparation) + 30 minutes (implementation)

---

## 🌐 SITE-WIDE CONTENT

### 1. Configuration Updates 🔴 CRITICAL

#### 1.1 Web3Forms API Key
**Current Status:** Placeholder `"YOUe4a0fd98-2ea3-4d6c-8449-346b6097c7dc"`  
**Location:** `src/App.jsx` line 84  
**Action Required:**
```js
// Before
web3FormsAccessKey: "YOUe4a0fd98-2ea3-4d6c-8449-346b6097c7dc"

// After
web3FormsAccessKey: "YOUR_REAL_KEY_HERE"
```

**How to Get:**
1. Visit https://web3forms.com
2. Sign up (free plan: 250 submissions/month)
3. Create new form
4. Copy Access Key
5. Replace in `src/App.jsx`

**Impact:** Without real key, contact form will fail  
**Time:** 5 minutes  
**Priority:** 🔴 CRITICAL

---

#### 1.2 Google Tag Manager Container ID
**Current Status:** Placeholder `GTM-XXXXXXX`  
**Location:** `index.html` line 42 (head section)  
**Action Required:**
```html
<!-- Before -->
<!-- Google Tag Manager -->
<!-- GTM-XXXXXXX -->

<!-- After -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
```

**How to Get:**
1. Go to https://tagmanager.google.com
2. Create account (if needed)
3. Create container: "Roma Mart Website" (Web)
4. Copy Container ID (GTM-XXXXXX format)
5. Replace placeholder in `index.html` (head + body)

**Impact:** No analytics/event tracking without real GTM  
**Time:** 10 minutes  
**Priority:** 🟡 HIGH (can launch without, but lose analytics)

---

#### 1.3 NRS Plus Online Ordering URL
**Current Status:** Placeholder `"https://nrsplus.com/orders/your-store-link"`  
**Location:** `src/App.jsx` line 35  
**Action Required:**
```js
// Before
onlineStoreUrl: "https://nrsplus.com/orders/your-store-link"

// After
onlineStoreUrl: "https://nrsplus.com/orders/romamart-sarnia" // Example
```

**How to Get:**
1. Contact NRS Plus support or account manager
2. Request dedicated online ordering URL
3. Test URL in browser (should show Roma Mart inventory)
4. Replace in `src/App.jsx`

**Impact:** "Order Now" button leads to generic NRS page  
**Time:** Depends on NRS Plus response (could be immediate)  
**Priority:** 🟡 HIGH (button still works, just not personalized)

---

#### 1.4 Social Media URLs (Verify)
**Current Status:** Placeholders in footer/contact  
**Location:** `src/components/Footer.jsx`, `src/pages/ContactPage.jsx`  
**Action Required:**
```js
// Verify these are correct:
facebook: "https://facebook.com/your-store-link"
instagram: "https://instagram.com/your-store-link"
tiktok: "https://tiktok.com/@your-store-link"
twitter: "https://twitter.com/your-store-link"
snapchat: "https://snapchat.com/add/your-store-link"
```

**How to Fix:**
1. Get actual social media profile URLs from client
2. Replace "your-store-link" with real usernames
3. Test each link in browser

**Impact:** Social media links lead to 404s  
**Time:** 5 minutes (once URLs provided)  
**Priority:** 🟢 MEDIUM (can hide social buttons if no presence)

---

### 2. Favicon & App Icons 🟡 HIGH

#### 2.1 Replace Vite.svg Favicon
**Current Status:** Default Vite logo at `/vite.svg`  
**Location:** `index.html` line 5  
**Action Required:**
```html
<!-- Before -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />

<!-- After -->
<link rel="icon" type="image/svg+xml" href="/icon-192.svg" />
```

**Assets Available:**
✅ `/public/icon-192.svg` (already exists)  
✅ `/public/icon-512.svg` (already exists)  
✅ `/public/icon-192-maskable.svg` (already exists)  
✅ `/public/icon-512-maskable.svg` (already exists)

**How to Fix:**
1. Update `<link rel="icon">` in `index.html`
2. Delete `/public/vite.svg` (no longer needed)

**Impact:** Browser tab shows Vite logo instead of Roma Mart  
**Time:** 2 minutes  
**Priority:** 🟡 HIGH (branding)

---

#### 2.2 Apple Touch Icon
**Current Status:** Not provided  
**Recommendation:** Add 180x180 PNG version of logo  
**Action Required:**
```html
<!-- Add to index.html <head> -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

**Assets Needed:**
- `/public/apple-touch-icon.png` (180x180 PNG)

**How to Create:**
1. Export logo as 180x180 PNG
2. Add padding (10% margin recommended)
3. Save as `/public/apple-touch-icon.png`

**Impact:** iOS home screen icon looks generic  
**Time:** 10 minutes  
**Priority:** 🟢 MEDIUM (only for iOS PWA users)

---

### 3. Social Media Image 🟡 HIGH

#### 3.1 Open Graph Image (og-image.png)
**Current Status:** Referenced but missing  
**Location:** `index.html` meta tags, `src/App.jsx` (dynamically updated per page)  
**Action Required:**
- Create `/public/og-image.png` (1200x630 pixels)

**Specifications:**
- **Dimensions:** 1200x630 px (Facebook/Twitter standard)
- **Format:** PNG or JPEG (PNG preferred for transparency)
- **File Size:** < 1 MB (< 500 KB ideal)
- **Safe Zone:** Keep text/logo within center 1200x540 px (edges may be cropped)

**Recommended Content:**
- **Background:** Store front photo or brand color gradient
- **Overlay:** Roma Mart logo (top center)
- **Text:** "Sarnia's Trusted Convenience Store & RoCafé"
- **Accent:** Halal badge, Bitcoin logo, RoCafé cup icon

**Template:**
```
┌─────────────────────────────────────────┐
│         ROMA MART [Logo]                │ ← 150px from top
│                                         │
│   [Store Front Photo or Navy Gradient] │
│                                         │
│   Sarnia's Trusted Convenience Store   │ ← Center
│        & RoCafé                         │
│                                         │
│   [Halal] [Bitcoin] [Café Icons]       │ ← 100px from bottom
└─────────────────────────────────────────┘
    1200 x 630 pixels
```

**Used On:**
- Facebook shares (News Feed, Timeline, Groups)
- Twitter/X cards (tweets with link)
- LinkedIn shares
- WhatsApp link previews
- Slack link unfurls
- Discord embeds

**How to Create:**
1. Use Canva, Figma, or Photoshop
2. Start with 1200x630 canvas
3. Add store photo or brand colors
4. Overlay logo + tagline
5. Export as PNG (high quality)
6. Save to `/public/og-image.png`
7. Test with https://www.opengraph.xyz/

**Impact:** Link shares on social media look generic/broken  
**Time:** 30 minutes (design + export)  
**Priority:** 🟡 HIGH (critical for social media marketing)

---

### 4. Logo Files 🟢 MEDIUM

#### 4.1 Logo PNG for JSON-LD
**Current Status:** Referenced in structured data but missing  
**Location:** `src/components/StructuredData.jsx` line 18  
**Action Required:**
- Create `/public/logo.png` (square, 512x512 recommended)

**Specifications:**
- **Dimensions:** 512x512 px (square)
- **Format:** PNG with transparency
- **Background:** Transparent or white
- **File Size:** < 100 KB

**Usage:**
- Google Knowledge Graph
- Rich Results (search snippets)
- Local Business schema

**How to Create:**
1. Export logo as 512x512 PNG
2. Ensure transparent background
3. Save to `/public/logo.png`

**Impact:** Google may not display logo in search results  
**Time:** 5 minutes  
**Priority:** 🟢 MEDIUM (SEO enhancement)

---

#### 4.2 Logo Variations (Optional)
**Recommended Formats:**
- `/public/logo.svg` (vector, scalable)
- `/public/logo-horizontal.png` (for email headers)
- `/public/logo-white.png` (for dark backgrounds)

**Priority:** ⚪ LOW (nice-to-have)

---

### 5. Brand Assets Inventory ✅

#### Current Assets (Already Implemented)
✅ **Colors:**
- Primary Navy: `#020178` (headings, CTAs)
- Accent Yellow: `#E4B340` (highlights, focus)
- White: `#FFFFFF` (backgrounds, text on dark)

✅ **Fonts:**
- Sans-serif stack (system fonts for performance)
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`

✅ **Icons:**
- Lucide React (services, UI)
- FontAwesome (social media)
- Note: Consider replacing FA with Lucide alternatives (see AUDIT)

✅ **PWA Icons:**
- `/icon-192.svg` (standard)
- `/icon-512.svg` (standard)
- `/icon-192-maskable.svg` (Android)
- `/icon-512-maskable.svg` (Android)

---

## 📄 PAGE-SPECIFIC CONTENT

### Page 1: Home (index) ✅

**Status:** COMPLETE - No content needed  
**Reason:** Home page uses dynamic content from services, rotating features

**Verified Content:**
- ✅ Hero section with "Fresh. Fast. Trusted." tagline
- ✅ Services grid (8 services with icons)
- ✅ Rotating features (Halal, Café, Bitcoin)
- ✅ Order CTA with haptic feedback
- ✅ Trustpilot widget (shows real reviews)

**No Actions Required** 🎉

---

### Page 2: Services ✅

**Status:** COMPLETE - No content needed  
**Reason:** All services documented with icons

**Verified Content:**
- ✅ 8 service cards (Groceries, Halal, RoCafé, ATM, Bitcoin, Tobacco, Lottery, Hot Food)
- ✅ Lucide React icons for each service
- ✅ Descriptions complete

**Optional Enhancement:**
- Add photos for each service (e.g., halal meat counter, RoCafé station, Bitcoin ATM)
- Priority: ⚪ LOW

---

### Page 3: RoCafé Menu 🟢 MEDIUM

**Current Status:** Placeholder menu data  
**Location:** `src/pages/RoCafePage.jsx` line 13-23  
**Action Required:**

#### 3.1 Menu Item Photos
**Current Placeholder:**
```js
{
  name: 'Espresso',
  description: 'Rich and bold espresso shot',
  price: '$3.99',
  calories: '5',
  sizes: ['Single', 'Double'],
  image: '/images/menu/espresso.jpg'  // ← Missing file
}
```

**Assets Needed:**
- `/public/images/menu/espresso.jpg`
- `/public/images/menu/latte.jpg`
- `/public/images/menu/cappuccino.jpg`
- `/public/images/menu/matcha.jpg`
- `/public/images/menu/bubble-tea.jpg`
- `/public/images/menu/smoothie.jpg`
- ... (one photo per menu item)

**Specifications:**
- **Dimensions:** 400x300 px (4:3 aspect ratio)
- **Format:** WebP (smaller) or JPEG (universal)
- **File Size:** < 50 KB per image (optimized)
- **Background:** Clean, white/neutral background
- **Lighting:** Natural, well-lit
- **Composition:** Drink centered, logo/branding visible

**How to Create:**
1. Photograph each drink with consistent lighting
2. Resize to 400x300 px
3. Optimize with TinyPNG or Squoosh
4. Save to `/public/images/menu/[drink-name].jpg`

**Stock Photo Alternative:**
- Use royalty-free images from:
  - Unsplash (https://unsplash.com/s/photos/coffee)
  - Pexels (https://www.pexels.com/search/cafe/)
  - Pixabay (https://pixabay.com/images/search/espresso/)
- Ensure commercial use allowed
- Resize and optimize before upload

**Impact:** Menu shows placeholder image  
**Time:** 2-4 hours (photography + editing) OR 30 minutes (stock photos)  
**Priority:** 🟢 MEDIUM (functional without images, but less engaging)

---

#### 3.2 Menu Data Expansion
**Current Status:** 1 placeholder item  
**Action Required:** Add full RoCafé menu  
**Location:** `src/pages/RoCafePage.jsx` `menuItems` array

**Template:**
```js
const menuItems = [
  // COFFEE
  {
    name: 'Espresso',
    description: 'Rich and bold espresso shot',
    price: '$3.99',
    calories: '5',
    sizes: ['Single', 'Double'],
    image: '/images/menu/espresso.jpg'
  },
  {
    name: 'Latte',
    description: 'Smooth espresso with steamed milk',
    price: '$4.99',
    calories: '150',
    sizes: ['Small', 'Medium', 'Large'],
    image: '/images/menu/latte.jpg'
  },
  // ... add 15-20 items total
];
```

**Menu Structure Recommendation:**
1. **Coffee** (5-7 items): Espresso, Latte, Cappuccino, Americano, Mocha, Macchiato
2. **Bubble Tea** (5-7 items): Classic Milk Tea, Taro, Matcha, Thai, Fruit Teas
3. **Specialty Drinks** (3-5 items): Matcha Latte, Chai Latte, Golden Milk
4. **Cold Drinks** (3-5 items): Iced Coffee, Cold Brew, Slushes, Smoothies
5. **Add-ons** (optional): Extra shot, syrups, toppings, milk alternatives

**Data Needed from Client:**
- Exact menu items offered
- Pricing for each size
- Calorie information (if available)
- Available sizes (Small/Medium/Large or Single/Double)
- Any seasonal/limited items

**Impact:** Menu shows only 1 placeholder item  
**Time:** 1-2 hours (data entry + review)  
**Priority:** 🟢 MEDIUM (can launch with limited menu, expand later)

---

### Page 4: Locations ✅

**Status:** COMPLETE - No content needed  
**Reason:** Store info, map, hours all configured

**Verified Content:**
- ✅ Address: 189-3 Wellington Street, Sarnia, ON N7T 1G6
- ✅ Phone: +1 (382) 342-2000
- ✅ Email: contact@romamart.ca
- ✅ Hours: Mon-Fri 7am-11pm, Sat-Sun 8am-11pm
- ✅ Google Maps embed (correct coordinates)
- ✅ Geolocation "Nearest Store" button

**Optional Enhancement:**
- Add store front photo (see "About" section below)
- Priority: ⚪ LOW (map already shows location)

---

### Page 5: About 🟡 HIGH

**Current Status:** Missing 4 images  
**Location:** `src/pages/AboutPage.jsx`  
**Action Required:**

#### 5.1 Store Front Photo
**Current Reference:** `/images/store-front.jpg`  
**Location:** Line 115, JSON-LD schema line 56  
**Usage:** 
- About page hero carousel
- Structured data (Google Business)
- og:image fallback

**Specifications:**
- **Dimensions:** 1200x800 px (landscape, 3:2 ratio)
- **Format:** WebP or JPEG
- **File Size:** < 200 KB
- **Composition:**
  - Full store exterior visible
  - Signage clear and readable
  - Daytime, good lighting
  - No people/cars blocking entrance (if possible)
- **Usage:** Hero section, search results, social shares

**Priority:** 🟡 HIGH (most visible brand image)

---

#### 5.2 Store Interior Photo
**Current Reference:** `/images/store-interior.jpg`  
**Location:** Line 116 (carousel item 2)  
**Usage:** About page carousel

**Specifications:**
- **Dimensions:** 1200x800 px (landscape)
- **Format:** WebP or JPEG
- **File Size:** < 200 KB
- **Composition:**
  - Wide shot showing aisles/shelves
  - Well-stocked, clean, organized
  - Good lighting (no harsh shadows)
  - RoCafé station visible (if possible)
  - Consider multiple angles, pick best

**Priority:** 🟡 HIGH (shows store environment)

---

#### 5.3 Team Photo (Group)
**Current Reference:** `/images/team.jpg`  
**Location:** Line 117 (carousel item 3)  
**Usage:** About page carousel

**Specifications:**
- **Dimensions:** 1200x800 px (landscape)
- **Format:** WebP or JPEG
- **File Size:** < 200 KB
- **Composition:**
  - Team members in store or at counter
  - Friendly, professional poses
  - Roma Mart uniforms/aprons (if applicable)
  - Alternative: Store activity (customers being served)

**Priority:** 🟢 MEDIUM (humanizes brand, but not critical)

---

#### 5.4 Owner/Manager Headshot
**Current Reference:** `/images/team/mohammed-khan.jpg`  
**Location:** Line 131 ("Meet the Team" section)  
**Usage:** About page team member card

**Specifications:**
- **Dimensions:** 400x400 px (square)
- **Format:** WebP or JPEG
- **File Size:** < 50 KB
- **Composition:**
  - Professional headshot
  - Neutral/store background
  - Shoulders and up
  - Smiling, approachable
  - Well-lit, high resolution

**Current Text:**
```js
<h3 className="font-semibold text-xl mb-1">Mohammed Khan</h3>
<p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>Store Manager</p>
<p className="text-sm" style={{ color: 'var(--color-text)' }}>
  "We're committed to serving our community with quality products and exceptional service."
</p>
```

**Priority:** 🟢 MEDIUM (adds personality, but not critical)

**Expansion Opportunity:**
- Add more team members to `/images/team/` directory
- Update array in `AboutPage.jsx` line 130
- Each needs 400x400 headshot + name + title + quote

---

#### 5.5 About Page Text Content (Optional)
**Current Status:** Generic placeholder text  
**Location:** Lines 52-75, 93-104  
**Action Required:** Replace with Roma Mart-specific copy

**Sections to Customize:**
1. **Mission Statement** (line 52-60)
   - Current: "Roma Mart is your trusted convenience store..."
   - Recommendation: Add unique value props (local, family-owned, community-focused)

2. **Values Section** (line 62-75)
   - Current: "Quality", "Service", "Community"
   - Keep structure, personalize descriptions

3. **History** (line 93-104)
   - Current: Generic founding story
   - Recommendation: Add real founding year, owner background, growth milestones

**Priority:** ⚪ LOW (current copy is professional, just generic)

---

### Page 6: Contact ✅

**Status:** COMPLETE - Pending Web3Forms key  
**Reason:** Form functional, all contact info present

**Verified Content:**
- ✅ Contact form (name, email, message)
- ✅ Background sync (queues when offline)
- ✅ Phone, email, address displayed
- ✅ Social media links (pending verification - see Site-Wide section)
- ✅ Google Maps embed

**Action Required:**
- ⚠️ Update Web3Forms API key (see Site-Wide section)

**No Additional Content Needed** 🎉

---

### Page 7: Accessibility Statement ✅

**Status:** COMPLETE - No content needed  
**Reason:** Legal/compliance page, fully documented

**Verified Content:**
- ✅ WCAG 2.2 AA commitment
- ✅ Accessibility features listed
- ✅ Contact info for accessibility concerns
- ✅ Feedback mechanism

**No Actions Required** 🎉

---

### Page 8: Privacy Policy ✅

**Status:** COMPLETE - Review recommended  
**Reason:** Legal page, may need lawyer review

**Verified Content:**
- ✅ Data collection disclosure
- ✅ Cookie usage
- ✅ Third-party services (GTM, Web3Forms)
- ✅ User rights (GDPR-compliant)
- ✅ Contact info

**Recommendation:**
- Have lawyer review before launch (standard practice)
- Update "Last Updated" date after any changes
- Priority: 🟡 HIGH (legal compliance)

---

### Page 9: Terms of Service ✅

**Status:** COMPLETE - Review recommended  
**Reason:** Legal page, may need lawyer review

**Verified Content:**
- ✅ Service terms
- ✅ Liability limitations
- ✅ Governing law (Ontario)
- ✅ Dispute resolution

**Recommendation:**
- Have lawyer review before launch (standard practice)
- Priority: 🟡 HIGH (legal compliance)

---

### Page 10: Cookie Policy ✅

**Status:** COMPLETE - No content needed  
**Reason:** Legal/compliance page, fully documented

**Verified Content:**
- ✅ Cookie types explained
- ✅ Third-party cookies disclosed
- ✅ User control instructions
- ✅ Contact info

**No Actions Required** 🎉

---

## 📊 CONTENT PRIORITY MATRIX

### 🔴 CRITICAL (Must have before launch)
1. **Web3Forms API Key** - Contact form broken without it
2. **GTM Container ID** - No analytics/tracking

**Time:** 15 minutes  
**Blocker:** Yes

---

### 🟡 HIGH (Should have for professional launch)
3. **NRS Plus URL** - Order button personalization
4. **Favicon Update** - Brand consistency in browser tabs
5. **OG Image (1200x630)** - Social media shares look professional
6. **Store Front Photo** - Hero image + SEO
7. **Store Interior Photo** - Shows environment
8. **Legal Review** - Privacy/Terms lawyer approval

**Time:** 2-3 hours (design + photography)  
**Blocker:** No (can launch without, but less polished)

---

### 🟢 MEDIUM (Nice to have, improves experience)
9. **Logo PNG (512x512)** - Google Knowledge Graph
10. **Team Photos** - Humanizes brand
11. **RoCafé Menu Photos** - Visual menu
12. **Menu Data Expansion** - Full café offerings
13. **Social Media URLs** - Verify real profiles

**Time:** 3-5 hours (menu + photography)  
**Blocker:** No (can add incrementally)

---

### ⚪ LOW (Optional enhancements)
14. **Apple Touch Icon** - iOS PWA users only
15. **Logo Variations** - Email, dark mode versions
16. **About Page Copy** - Personalize generic text
17. **Service Photos** - Individual service images
18. **Additional Team Members** - Expand team section

**Time:** 2-4 hours  
**Blocker:** No (post-launch improvements)

---

## 🛠️ IMPLEMENTATION GUIDE

### Phase 1: Configuration (Day 1 - 30 minutes)
**Goal:** Make site functional

**Checklist:**
- [ ] Get Web3Forms API key → update `src/App.jsx` line 84
- [ ] Get GTM container ID → update `index.html` lines 42 + 189
- [ ] Get NRS Plus URL → update `src/App.jsx` line 35
- [ ] Verify social media URLs → update `src/components/Footer.jsx`
- [ ] Update favicon → change `index.html` line 5 to `/icon-192.svg`
- [ ] Delete `/public/vite.svg`

**Commands:**
```powershell
# After editing files
cd z:\General\Website 2.0\roma-mart-site
npm run build
npm run deploy
```

**Result:** Site fully functional with real API keys

---

### Phase 2: Core Images (Day 1-2 - 2 hours)
**Goal:** Professional branding

**Checklist:**
- [ ] Design og-image.png (1200x630) → save to `/public/`
- [ ] Create logo.png (512x512) → save to `/public/`
- [ ] Photograph store front → resize to 1200x800 → save to `/public/images/`
- [ ] Photograph store interior → resize to 1200x800 → save to `/public/images/`
- [ ] Create apple-touch-icon.png (180x180) → save to `/public/`

**File Structure:**
```
public/
├── og-image.png (1200x630)
├── logo.png (512x512)
├── apple-touch-icon.png (180x180)
└── images/
    ├── store-front.jpg (1200x800)
    └── store-interior.jpg (1200x800)
```

**Commands:**
```powershell
# After adding images
npm run build
npm run deploy
```

**Result:** Professional appearance on social media and search

---

### Phase 3: About Page Content (Day 2-3 - 1 hour)
**Goal:** Complete About page

**Checklist:**
- [ ] Photograph team (group) → resize to 1200x800 → save to `/public/images/`
- [ ] Photograph owner headshot → resize to 400x400 → save to `/public/images/team/`
- [ ] (Optional) Update About page copy → edit `src/pages/AboutPage.jsx`

**File Structure:**
```
public/images/
├── team.jpg (1200x800)
└── team/
    └── mohammed-khan.jpg (400x400)
```

**Result:** Complete brand story with real people

---

### Phase 4: RoCafé Menu (Day 3-4 - 3 hours)
**Goal:** Full menu with photos

**Checklist:**
- [ ] Photograph all menu items (or source stock photos)
- [ ] Resize each to 400x300 → save to `/public/images/menu/`
- [ ] Get menu data from client (items, prices, descriptions)
- [ ] Update `src/pages/RoCafePage.jsx` `menuItems` array (line 13)

**File Structure:**
```
public/images/menu/
├── espresso.jpg (400x300)
├── latte.jpg (400x300)
├── cappuccino.jpg (400x300)
├── matcha.jpg (400x300)
├── bubble-tea.jpg (400x300)
└── ... (15-20 items total)
```

**Menu Data Template:**
```js
const menuItems = [
  {
    name: 'Espresso',
    description: 'Rich and bold espresso shot',
    price: '$3.99',
    calories: '5',
    sizes: ['Single', 'Double'],
    image: '/images/menu/espresso.jpg'
  },
  // Add 15-20 items total
];
```

**Result:** Complete visual menu for RoCafé

---

### Phase 5: Legal Review (Day 4-5 - External)
**Goal:** Legal compliance

**Checklist:**
- [ ] Send Privacy Policy to lawyer → `src/pages/PrivacyPage.jsx`
- [ ] Send Terms of Service to lawyer → `src/pages/TermsPage.jsx`
- [ ] Implement any recommended changes
- [ ] Update "Last Updated" dates

**Result:** Legal protection for business

---

### Phase 6: Testing & Launch (Day 5 - 30 minutes)
**Goal:** Verify everything works

**Checklist:**
- [ ] Test contact form (real submission with Web3Forms)
- [ ] Test PWA install (Chrome, Safari)
- [ ] Test all images load correctly
- [ ] Test social media share (og-image appears)
- [ ] Test structured data (Google Rich Results Test)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify all links work (social media, NRS Plus, phone, email)

**Tools:**
- https://web3forms.com (check submissions)
- https://www.opengraph.xyz/ (test OG image)
- https://search.google.com/test/rich-results (test schema)
- https://validator.w3.org/ (HTML validation)
- https://web.dev/measure/ (performance audit)

**Result:** Production-ready launch

---

## 📁 FILE STRUCTURE REFERENCE

### Required Files (Missing)
```
public/
├── og-image.png ← 1200x630 (social media) 🔴
├── logo.png ← 512x512 (SEO) 🟡
├── apple-touch-icon.png ← 180x180 (iOS) 🟢
└── images/
    ├── store-front.jpg ← 1200x800 (About) 🟡
    ├── store-interior.jpg ← 1200x800 (About) 🟡
    ├── team.jpg ← 1200x800 (About) 🟢
    ├── team/
    │   └── mohammed-khan.jpg ← 400x400 (About) 🟢
    └── menu/
        ├── espresso.jpg ← 400x300 (RoCafé) 🟢
        ├── latte.jpg ← 400x300 (RoCafé) 🟢
        └── ... (15-20 items)
```

### Existing Files (Already Present)
```
public/
├── icon-192.svg ✅
├── icon-512.svg ✅
├── icon-192-maskable.svg ✅
├── icon-512-maskable.svg ✅
├── sitemap.xml ✅
├── robots.txt ✅
└── vite.svg ⚠️ (delete after favicon update)
```

---

## 🎯 QUICK START CHECKLIST

### Minimum Viable Launch (30 minutes)
**For fully functional site (no images yet):**

- [ ] **Web3Forms API key** → `src/App.jsx:84`
- [ ] **GTM container ID** → `index.html:42,189`
- [ ] **Favicon update** → `index.html:5` (change to `/icon-192.svg`)
- [ ] **Build & deploy** → `npm run build && npm run deploy`

**Result:** ✅ Contact form works, analytics tracks, branded favicon

---

### Professional Launch (3-4 hours)
**For polished, complete site:**

- [ ] Complete Minimum Viable Launch (above)
- [ ] **OG image** (1200x630) → `/public/og-image.png`
- [ ] **Logo PNG** (512x512) → `/public/logo.png`
- [ ] **Store front photo** (1200x800) → `/public/images/store-front.jpg`
- [ ] **Store interior photo** (1200x800) → `/public/images/store-interior.jpg`
- [ ] **NRS Plus URL** → `src/App.jsx:35`
- [ ] **Social media URLs** → `src/components/Footer.jsx`
- [ ] **Build & deploy** → `npm run build && npm run deploy`

**Result:** ✅ Professional appearance, ready for marketing

---

### Full Feature Launch (1-2 weeks)
**For complete experience:**

- [ ] Complete Professional Launch (above)
- [ ] **Team photos** → `/public/images/team.jpg` + `/public/images/team/mohammed-khan.jpg`
- [ ] **RoCafé menu photos** (15-20 images) → `/public/images/menu/`
- [ ] **Menu data expansion** → `src/pages/RoCafePage.jsx:13`
- [ ] **Legal review** → Privacy Policy + Terms of Service
- [ ] **About page copy** → `src/pages/AboutPage.jsx` (optional)
- [ ] **Build & deploy** → `npm run build && npm run deploy`

**Result:** ✅ Complete, polished website with full menu

---

## 💡 CONTENT CREATION TIPS

### Photography Best Practices
1. **Lighting:** Natural daylight or soft artificial (avoid harsh shadows)
2. **Composition:** Rule of thirds, straight horizons, uncluttered backgrounds
3. **Resolution:** Shoot higher than needed (can downsize, can't upsize)
4. **Consistency:** Same lighting/style for all images (brand cohesion)
5. **Optimization:** Use TinyPNG or Squoosh.app to compress (50-70% reduction without visible quality loss)

### Image Optimization Tools
- **TinyPNG:** https://tinypng.com (PNG/JPEG compression)
- **Squoosh:** https://squoosh.app (WebP conversion)
- **Canva:** https://canva.com (og-image design)
- **Remove.bg:** https://remove.bg (background removal for logos)

### Stock Photo Sources (If Needed)
- **Unsplash:** https://unsplash.com (free, commercial use)
- **Pexels:** https://pexels.com (free, commercial use)
- **Pixabay:** https://pixabay.com (free, some restrictions)
- **Note:** Always check license, prefer real store photos for authenticity

### Menu Data Template
Use this for collecting info from client:
```
Menu Item Name: _________________
Category: Coffee / Bubble Tea / Specialty / Cold
Description (1-2 sentences): _________________
Price: $___.__
Calories (if known): ___
Available Sizes: Small / Medium / Large OR Single / Double
Special Notes: _________________
```

---

## 📞 EXTERNAL DEPENDENCIES

### Services to Set Up
1. **Web3Forms** - https://web3forms.com
   - Free plan: 250 submissions/month
   - Sign up → Create form → Copy Access Key
   - Time: 5 minutes

2. **Google Tag Manager** - https://tagmanager.google.com
   - Free (unlimited)
   - Create account → Create container → Copy GTM-XXXXXX
   - Time: 10 minutes

3. **NRS Plus** - Contact account manager
   - Request dedicated online ordering URL
   - May take 1-3 business days
   - Alternative: Use generic URL temporarily

4. **Lawyer (Optional)** - For legal page review
   - Privacy Policy review: $200-500
   - Terms of Service review: $200-500
   - Combined package: $400-800
   - Time: 3-5 business days

---

## 🚀 DEPLOYMENT AFTER CONTENT UPDATES

### Step 1: Add Files
```powershell
# Navigate to project
cd z:\General\Website 2.0\roma-mart-site

# Add new images/files to /public/ folder
# (use File Explorer or copy commands)
```

### Step 2: Update Code
```powershell
# Edit src/App.jsx for API keys/URLs
# Edit src/pages/RoCafePage.jsx for menu data
```

### Step 3: Build & Deploy
```powershell
# Build production bundle
npm run build

# Deploy to GitHub Pages
npm run deploy

# Or combined:
npm run build ; npm run deploy
```

### Step 4: Verify
```powershell
# Open in browser
start https://khanoflegend.github.io/romamart.ca/

# Check:
# - Contact form submits successfully
# - Images load correctly
# - OG image appears in social shares
# - PWA installs correctly
# - Menu displays all items
```

---

## 📋 FINAL PRE-LAUNCH CHECKLIST

### Configuration ✅
- [ ] Web3Forms API key updated
- [ ] GTM container ID added
- [ ] NRS Plus URL personalized
- [ ] Social media URLs verified
- [ ] Favicon updated to icon-192.svg
- [ ] All placeholder URLs replaced

### Images ✅
- [ ] og-image.png (1200x630) added
- [ ] logo.png (512x512) added
- [ ] apple-touch-icon.png (180x180) added
- [ ] store-front.jpg (1200x800) added
- [ ] store-interior.jpg (1200x800) added
- [ ] team.jpg (1200x800) added (optional)
- [ ] team/mohammed-khan.jpg (400x400) added (optional)
- [ ] menu/*.jpg (400x300 each) added (optional)

### Content ✅
- [ ] RoCafé menu data expanded (optional)
- [ ] About page copy personalized (optional)
- [ ] Legal pages reviewed by lawyer (recommended)

### Testing ✅
- [ ] Contact form submission tested
- [ ] PWA install tested (Chrome + Safari)
- [ ] All images load correctly
- [ ] Social media share tested (og-image appears)
- [ ] Structured data validated (Rich Results Test)
- [ ] Mobile responsiveness verified
- [ ] All links work (phone, email, social, maps, NRS)
- [ ] Accessibility tested (keyboard navigation, screen reader)

### Analytics ✅
- [ ] GTM container published
- [ ] Test events firing (page views, button clicks)
- [ ] Contact form submissions tracked
- [ ] PWA install events tracked

---

## 🎉 ESTIMATED TIMELINE

### Fast Track (Minimum Viable Launch)
**Day 1 - Morning (2 hours):**
- Get Web3Forms API key (5 min)
- Get GTM container ID (10 min)
- Update src/App.jsx (5 min)
- Update index.html (5 min)
- Design og-image.png in Canva (30 min)
- Create logo.png export (10 min)
- Build & deploy (5 min)
- Test contact form + PWA (10 min)

**Result:** Fully functional, professional site ready for soft launch

---

### Standard Track (Professional Launch)
**Day 1 - Morning (2 hours):**
- Complete Fast Track (above)

**Day 1 - Afternoon (2 hours):**
- Photograph store front + interior (30 min)
- Edit and resize photos (30 min)
- Get NRS Plus URL (may require follow-up)
- Verify social media URLs (10 min)
- Update code with URLs (10 min)
- Build & deploy (5 min)
- Test all images + links (15 min)

**Result:** Complete, polished site ready for public launch

---

### Full Track (Complete Experience)
**Week 1:**
- Days 1-2: Complete Standard Track
- Day 3: Photograph team + collect menu data
- Day 4: Photograph all menu items (or source stock)
- Day 5: Update menu data in code, build & deploy

**Week 2:**
- Legal review (send to lawyer)
- Implement legal changes (if any)
- Final testing across devices
- Public launch + marketing push

**Result:** Complete, feature-rich site with full menu and legal compliance

---

## 📊 BUDGET ESTIMATE

### Services (Recurring)
- **Web3Forms:** $0/month (Free plan)
- **Google Tag Manager:** $0/month (Free)
- **GitHub Pages Hosting:** $0/month (Free)
- **Total Recurring:** $0/month 🎉

### One-Time Costs (Optional)
- **Lawyer Review:** $400-800 (recommended)
- **Professional Photography:** $200-500 (if hiring photographer)
- **Stock Photos:** $0-200 (if not using real photos)
- **Graphic Design:** $0-300 (if hiring designer for og-image/logo)

### DIY Cost (No External Help)
- **Total:** $0 (client provides photos, uses Canva for graphics)

---

## 📞 SUPPORT CONTACTS

### Technical Support
- **GitHub Copilot:** Available in VS Code (ask questions anytime)
- **Web3Forms Support:** support@web3forms.com
- **GTM Documentation:** https://support.google.com/tagmanager

### Legal Support (Ontario)
- **Law Society of Ontario Referral:** https://lso.ca/public-resources/finding-a-lawyer-or-paralegal
- **LegalLine:** 1-855-255-7256 (free 30-min consultation)

### Image Editing Help
- **Canva Support:** https://help.canva.com
- **TinyPNG Support:** support@tinypng.com

---

## ✅ SUCCESS CRITERIA

### Launch Ready When:
1. ✅ Contact form submits successfully (Web3Forms key active)
2. ✅ Analytics tracking works (GTM container active)
3. ✅ All images load without 404 errors
4. ✅ Social media shares show og-image
5. ✅ PWA installs on Chrome + Safari
6. ✅ Mobile responsive on iOS + Android
7. ✅ All links work (phone, email, maps, social, NRS)
8. ✅ No console errors in browser DevTools
9. ✅ Structured data validates (Rich Results Test)
10. ✅ Accessibility passes (keyboard + screen reader)

### Metrics to Track Post-Launch:
- Contact form submission rate
- PWA install rate (via GTM)
- Time on site (via GA4)
- Bounce rate (via GA4)
- Social media referral traffic
- NRS Plus order conversions
- Google search impressions/clicks (Search Console)
- Page speed scores (PageSpeed Insights)

---

**Document Status:** Ready for Implementation  
**Last Updated:** December 1, 2025  
**Next Review:** After content addition  
**Questions?** Ask GitHub Copilot in VS Code!

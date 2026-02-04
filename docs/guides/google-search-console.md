# Google Search Console Setup & Optimization Guide

> **Purpose:** Set up and optimize Roma Mart's presence in Google Search Console  
> **Target Domain:** romamart.ca  
> **Status:** Setup Guide  
> **Last Updated:** December 2025

## 📋 Quick Reference

| Item | Value | Status |
|------|-------|--------|
| Domain | romamart.ca | Ready |
| Sitemap URL | `https://romamart.ca/sitemap.xml` | Ready |
| Robots.txt | `https://romamart.ca/robots.txt` | Ready |
| Structured Data | LocalBusiness Schema (10 services) | ✅ Implemented |
| Primary Language | English | Ready |
| Target Region | Canada (Sarnia, ON) | Ready |

---

## 🔧 Setup Steps

### Step 1: Verify Property Ownership

**Option A: HTML File Upload (Recommended)**

1. Go to [Google Search Console](https://search.google.com/search-console/about)
2. Click **"Add property"** → Select **"URL prefix"**
3. Enter: `https://romamart.ca`
4. Select **"HTML file"** verification method
5. Download the verification HTML file (e.g., `google1234567890abcdef.html`)
6. Upload to your web root: `/public/` directory
7. Verify file is accessible: `https://romamart.ca/google1234567890abcdef.html`
8. Return to GSC and click **"Verify"**

**Deployment:**

```bash
# File should be in public/ and deployed to web root
# No build configuration needed - Vite copies /public to root in dist/
```

**Option B: DNS Record (Alternative)**

1. Add DNS TXT record to your domain provider (Namecheap, GoDaddy, etc.)
2. Record: `google-site-verification=xxxxx`
3. Wait for DNS propagation (up to 48 hours)
4. Verify in GSC

**Option C: Google Analytics (If Implemented)**

- Link your GA4 property in GSC
- Auto-verified if you have analytics tracking enabled

### Step 2: Submit Sitemap

1. Go to **Sitemaps** section in GSC left sidebar
2. Click **"Add/test sitemap"**
3. Enter: `https://romamart.ca/sitemap.xml`
4. Click **"Submit"**
5. Verify status shows **"Success"** (check can take 24-48 hours)

**Current Sitemap Structure:**

```xml
<!-- https://romamart.ca/sitemap.xml -->
<urlset>
  <url>
    <loc>https://romamart.ca/</loc>
    <priority>1.0</priority>
    <lastmod>2025-12-03</lastmod>
  </url>
  <url>
    <loc>https://romamart.ca/locations</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://romamart.ca/rocafe</loc>
    <priority>0.8</priority>
  </url>
  <!-- ... more routes ... -->
</urlset>
```

### Step 3: Review Robots.txt

1. In GSC, go to **Settings** → **Crawlers**
2. Check **Robots.txt Tester**
3. Verify current robots.txt rules:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Crawl-delay: 1

Sitemap: https://romamart.ca/sitemap.xml
```

**Current Implementation:**

- ✅ Allows all public pages
- ✅ Disallows private routes
- ✅ Moderate crawl delay (1 sec) to prevent overload

### Step 4: Link Google Analytics

1. In GSC, go to **Settings** → **Google Analytics property**
2. Select your GA4 property from dropdown
3. Save connection
4. This enables enhanced reporting and data flow between platforms

---

## 📊 Monitoring & Optimization

### Performance Metrics (GSC Dashboard)

**Weekly Checklist:**

- [ ] Click-through rate (CTR) trend
- [ ] Average search position
- [ ] Total impressions
- [ ] Coverage status (errors/warnings)
- [ ] Mobile usability issues
- [ ] Security issues

**Key Metrics to Track:**

| Metric | Target | Action |
|--------|--------|--------|
| Impressions | > 1000/week | Optimize meta descriptions and titles |
| CTR | > 3% | Improve title/description relevance |
| Avg Position | < 10 (page 1) | Add content, build backlinks |
| Mobile Issues | 0 | Test all pages on mobile |

### Performance Reports

#### Coverage Report

- **Status:** How many pages are indexed
- **Check monthly:** Look for errors that prevent indexing
- **Fix crawl errors:** If "Not found (404)" appears, check page structure

#### Mobile Usability Report

- **Critical:** No mobile blocking resources
- **Check:** Test pages with Google Mobile-Friendly Test tool
- **Target:** Zero issues

**Current Status:**

- Homepage: ✅ Mobile-friendly
- Locations: ✅ Mobile-friendly
- RoCafe: ✅ Mobile-friendly
- All routes: ✅ Fully responsive with viewport meta tag

#### Core Web Vitals

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Monitor via:** GSC → Core Web Vitals report or Google PageSpeed Insights

#### Enhancements Report

- Rich results (structured data)
- Current: LocalBusiness schema indexed
- Opportunity: Add FAQ schema (when FAQ content added)

### Search Analytics Report

**Analyze & Act:**

1. **Top Queries:** Which searches bring traffic?
   - Look for branded searches ("Roma Mart Sarnia")
   - Look for location-based searches ("convenience store near me")
   - Look for product searches ("coffee Sarnia", "ATM locations")

2. **Low-Performing Queries:**
   - High impressions but low CTR? → Improve title/meta
   - High impressions but low position (>20)? → Create content targeting that keyword

3. **Traffic by Device:**
   - Mobile: Should be 40-60% of traffic
   - Desktop: Should be 40-60%
   - If heavily skewed → Investigate user experience on underperforming device

### Indexing Status

**Expected Results:**

- ✅ All public routes indexed (not /admin, /api)
- ✅ Homepage indexed as primary
- ✅ Service pages indexed for local searches
- ✅ RoCafe page indexed for menu searches

**If Pages Not Indexed:**

1. Check coverage report for reason
2. Common causes:
   - `noindex` meta tag present (check React Helmet)
   - Page behind authentication (verify public access)
   - Robots.txt blocking page (check rules)
   - Low quality/thin content (add more content)

---

## 🔍 Local SEO Optimization

### For Multi-Location Business

Roma Mart operates multiple locations. Optimize for local search:

#### Strategy 1: Single GMB Profile

- Use headquarters address (HQ)
- List all service types available at any location
- Locations page references all stores
- Schema markup includes all locations with coordinates

**Current Implementation:** ✅ Single LocalBusiness schema with address

#### Strategy 2: Multi-Location GMB

- Create separate GMB profile for EACH location
- Link all to website
- Each has own hours, phone, address
- Each gets own local landing page (future enhancement)

**Recommendation:** Start with Strategy 1, upgrade to Strategy 2 when:

- Each location has unique phone number
- Each location has independent hours
- Want to track local performance separately

#### Location Keywords

Target these searches in your content:

```
Primary:
- "convenience store Sarnia"
- "24-hour store Sarnia"
- "coffee Sarnia"
- "ATM near me Sarnia"
- "grocery store Sarnia"

Secondary:
- "convenience store Wellington Street Sarnia"
- "late night shopping Sarnia"
- "Roma Mart Sarnia"
- "bitcoin ATM Sarnia"
```

**Where to Use:**

- Page titles: Include location + service
- Meta descriptions: "Sarnia's 24-hour convenience store - coffee, groceries, ATM"
- Locations page content: Include neighborhood names, nearby landmarks
- Schema markup: Ensure `areaServed` and `geo` populated

### NAP Consistency (Name, Address, Phone)

**Critical for Local Rankings:**

Ensure consistency everywhere:

| Property | Value | Locations |
|----------|-------|-----------|
| Business Name | Roma Mart | GSC, GMB, Google Maps, local directories |
| Address | 3-189 Wellington Street, Sarnia, ON N7T 1G6 | Website, GMB, directory listings |
| Phone | From config/company_data.js | Website footer, GMB, directory listings |

**Audit Action Items:**

- [ ] Search for "Roma Mart Sarnia" on Google Maps → Verify business info
- [ ] Check local directories: Yellow Pages, Yelp, etc. → Update if inconsistent
- [ ] Verify phone number matches everywhere
- [ ] Check address formatting (street abbreviations, postal code format)

---

## 📈 Advanced Optimization

### Rich Result Optimization

**Current:** LocalBusiness schema (standard)

**Quick Wins - Add These:**

1. **FAQ Schema** (Low effort, high impact)
   - When: After creating FAQ content
   - Use case: FAQs appear as expandable results in search
   - Example: "Is Roma Mart open 24 hours?", "Where are you located?"
   - Implementation: Add `FAQPage` schema to `/faq` route

2. **BreadcrumbList Schema** (Already implemented)
   - Helps Google understand page hierarchy
   - Shows breadcrumbs in search results

3. **Product Schema** (If selling online)
   - For e-commerce integration
   - Mark availability, price, reviews

4. **Review Schema** (If Trustpilot reviews embedded)
   - Current: Trustpilot widget shows reviews
   - Future: Add structured `Review` schema to homepage
   - Helps aggregate ratings display in search results

### Link Building Strategy

**Low-Competition Keywords** (Local focus):

- Create content worth linking to (hours, locations, services guide)
- Contact local Sarnia media, bloggers
- Get listed in local business directories
- Reach out to related businesses for backlinks

**Content Ideas:**

- "24-Hour Convenience Stores in Sarnia" blog post
- "Best Coffee in Sarnia" guide (feature RoCafe)
- "Bitcoin ATM Locations in Ontario" (if applicable)
- "Sarnia Local Business Directory" feature

### Speed Optimization

**Current Status:** 0.57MB JS bundle (good)

**Monitor with:**

- Google PageSpeed Insights: `https://pagespeed.web.dev`
- Core Web Vitals report in GSC
- Lighthouse in DevTools

**Optimization Targets:**

- LCP < 2.5s (track via GSC Core Web Vitals)
- Images lazy-loaded (already implemented)
- Critical CSS inlined (already implemented)
- Code splitting active (Vite manual chunks configured)

### Content Strategy

**High-Value Content Topics:**

1. Service pages: Detail each offering (ATM, coffee, groceries)
2. Location guides: Parking, accessibility, hours per store
3. Blog posts: Local tips, seasonal content
4. FAQ section: Answer common customer questions

**Implementation Plan:**

1. Create FAQ page with structured data
2. Add service detail pages (beyond current)
3. Create local guides (directions, accessibility, parking)
4. Publish monthly blog posts on local topics

---

## 🚨 Common Issues & Solutions

### Issue: "Pages not indexed after weeks"

**Solutions:**

1. GSC Robots.txt Tester → Ensure page not blocked
2. GSC Coverage report → Check for specific error
3. Request indexing manually → GSC Inspect URL tool
4. Check for `noindex` meta tags in React Helmet
5. Verify page accessible without authentication

### Issue: "Low click-through rate on branded keywords"

**Solutions:**

1. Improve title: Include "24-hour", "Sarnia", key service
2. Improve meta description: Make compelling, include phone/location
3. Add Trustpilot review schema to show star rating in results
4. Optimize local business schema completeness

### Issue: "Mobile usability issues"

**Solutions:**

1. Run Google Mobile-Friendly Test
2. Check mobile spacing, font sizes
3. Ensure touch targets 48px minimum
4. Test on actual devices (not just browser emulation)

### Issue: "No "People Also Ask" results for our keywords"

**Solutions:**

1. Identify questions in queries report
2. Create dedicated FAQ content
3. Use natural language (questions, not just keywords)
4. Add FAQ schema markup

---

## 📋 Monthly GSC Maintenance Checklist

Every month:

- [ ] Review Coverage report → Fix any new errors
- [ ] Review Mobile Usability → Fix any new issues
- [ ] Check Search Analytics → Identify top queries, low performers
- [ ] Inspect top-performing URLs → Ensure properly indexed
- [ ] Review Core Web Vitals → Monitor performance trends
- [ ] Submit new pages to GSC manually if not auto-detected
- [ ] Monitor Security Issues section → Should be zero
- [ ] Check Enhancements report → Capitalize on rich results

---

## 🔗 Google Search Console URLs

- **Main Console:** <https://search.google.com/search-console/>
- **Roma Mart Property:** <https://search.google.com/search-console/u/0/property/https://romamart.ca/>
- **Coverage Report:** Search Console → Coverage (left sidebar)
- **Performance:** Search Console → Performance (left sidebar)
- **Mobile Usability:** Search Console → Mobile Usability (left sidebar)
- **Enhancements:** Search Console → Enhancements (left sidebar)

---

## 📚 Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Search Console Training](https://support.google.com/webmasters/answer/9128668)
- [Structured Data Validation](https://schema.org/validator/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Local SEO Guide](https://support.google.com/business/answer/45676)

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Property verified in GSC (HTML, DNS, or GA4 method)
- [ ] Sitemap submitted and showing "Success"
- [ ] Robots.txt reviewed and correct
- [ ] GA4 property linked (if using Analytics)
- [ ] First coverage data appearing (24-48 hours)
- [ ] No security issues reported
- [ ] Mobile usability issues addressed
- [ ] LocalBusiness schema validated
- [ ] Search Analytics showing impressions (within 2-7 days)

---

**Next Steps:**

1. Complete setup verification above
2. Monitor GSC daily for first week
3. Review Performance metrics weekly
4. Implement Content Strategy (FAQ, blog posts)
5. Connect to Google My Business (see separate guide)

---

**Maintained by:** Roma Mart Development Team  
**Last Updated:** December 2025  
**Status:** Ready for Implementation

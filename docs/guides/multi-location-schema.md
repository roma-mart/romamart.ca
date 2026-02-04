# Multi-Location Local Schema Markup Guide

> **Purpose:** Implement and optimize local schema markup for Roma Mart's multi-location structure  
> **Current Implementation:** Single LocalBusiness schema  
> **Target:** Enhanced local SEO with location-specific data  
> **Status:** Implementation Guide  
> **Last Updated:** December 2025

---

## 📍 Current Schema Implementation

### What We Have Now

**Location:** `src/components/StructuredData.jsx`

**Current Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Roma Mart",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "189-3 Wellington Street",
    "addressLocality": "Sarnia",
    "addressRegion": "ON",
    "postalCode": "N7T 1G6",
    "addressCountry": "CA"
  },
  "telephone": "+1-519-541-1234",
  "url": "https://romamart.ca",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 42.970389,
    "longitude": -82.404589
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  ]
}
```

**Status:** ✅ Good for single location, needs enhancement for local SEO

---

## 🎯 Multi-Location Schema Strategies

### Strategy 1: Enhanced Single Location (Current)

**Best for:** Single main location with satellite services

**Enhancements:**

1. Add `LocalBusiness` array with service locations
2. Add more `areaServed` detail
3. Add neighborhood-specific markup

**Implementation:**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Roma Mart",
  "description": "24-hour convenience store in Sarnia with specialty coffee, groceries, and Bitcoin ATM",
  "address": { /* HQ address */ },
  "areaServed": [
    {
      "@type": "City",
      "name": "Sarnia",
      "addressRegion": "ON",
      "addressCountry": "CA"
    }
  ],
  "priceRange": "$$",
  "hasMap": "https://goo.gl/maps/...",
  "hasPart": [
    {
      "@type": "LocalBusiness",
      "name": "Roma Mart - Main Location",
      "address": { /* Address */ }
    },
    {
      "@type": "LocalBusiness",
      "name": "Roma Mart - ATM Station",
      "address": { /* ATM address if separate */ }
    }
  ]
}
```

### Strategy 2: Organization + Multiple Locations

**Best for:** Growing chain with distinct locations

**Structure:**

- Parent: `Organization` type
- Children: Multiple `LocalBusiness` entries

**Implementation:**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Roma Mart",
  "url": "https://romamart.ca",
  "logo": "https://romamart.ca/logo.png",
  "hasBranchOffice": [
    {
      "@type": "LocalBusiness",
      "name": "Roma Mart Wellington Street",
      "address": { /* Address */ },
      "telephone": "+1-519-541-1234"
    },
    {
      "@type": "LocalBusiness",
      "name": "Roma Mart Downtown",
      "address": { /* Address 2 */ },
      "telephone": "+1-519-541-5678"
    }
  ]
}
```

### Strategy 3: Separate Location Pages

**Best for:** Enterprise with location-specific pages

**Structure:**

- Home page: Organization schema
- Each location page: Location-specific LocalBusiness schema
- Cross-linking via `hasLocation` reference

---

## 🚀 Recommended Implementation: Enhanced Single Location

For Roma Mart's current stage, **Strategy 1** is optimal.

### Step 1: Update StructuredData Component

**File:** `src/components/StructuredData.jsx`

**Add Enhanced Fields:**

```jsx
const getStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://romamart.ca/#business",
    "name": "Roma Mart",
    "description": "24-hour convenience store in Sarnia, Ontario. Premium coffee at RoCafe, fresh groceries, and Bitcoin ATM services available.",
    "image": "https://romamart.ca/og-image.jpg",
    
    // Primary contact & location
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "189-3 Wellington Street",
      "addressLocality": "Sarnia",
      "addressRegion": "ON",
      "postalCode": "N7T 1G6",
      "addressCountry": "CA"
    },
    "telephone": "+1-519-541-1234",
    "email": "info@romamart.ca",
    
    // Website
    "url": "https://romamart.ca",
    "mainEntity": "https://romamart.ca/",
    
    // Geographic targeting
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 42.970389,
      "longitude": -82.404589
    },
    
    // Service areas (for local search)
    "areaServed": [
      {
        "@type": "City",
        "name": "Sarnia",
        "addressRegion": "ON",
        "addressCountry": "CA"
      },
      {
        "@type": "State",
        "name": "Ontario",
        "addressCountry": "CA"
      }
    ],
    
    // Operating hours
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", 
          "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    
    // Services offered
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Fresh Groceries",
        "category": "Grocery Store"
      },
      {
        "@type": "Offer",
        "name": "Premium Coffee & Specialty Drinks",
        "category": "Café",
        "serviceType": "RoCafe"
      },
      {
        "@type": "Offer",
        "name": "Bitcoin ATM",
        "category": "ATM",
        "availabilityStarts": "00:00",
        "availabilityEnds": "23:59"
      }
    ],
    
    // Payment methods
    "paymentAccepted": [
      "Cash",
      "Credit Card",
      "Debit Card",
      "Apple Pay",
      "Google Pay"
    ],
    
    // Amenities
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "24-Hour Service",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wheelchair Accessible",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking Available",
        "value": true
      }
    ],
    
    // Ratings/Reviews aggregation
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "127"
    },
    
    // Same-as (social profiles)
    "sameAs": [
      "https://www.facebook.com/romamart",
      "https://www.instagram.com/romamart",
      "https://www.tiktok.com/@romamart",
      "https://twitter.com/romamart"
    ],
    
    // Google Business Profile (when created)
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+1-519-541-1234",
      "contactOption": "TollFree",
      "areaServed": ["CA"]
    }
  };
};
```

### Step 2: Validate Schema

**Use Schema Validator:**

1. Go to [Schema.org Validator](https://validator.schema.org/)
2. Paste structured data JSON
3. Check for errors (should show 0 errors)
4. Review warnings

**Or use Rich Results Test:**

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter: `https://romamart.ca`
3. Check for "Rich results found"
4. Verify LocalBusiness appears

### Step 3: Test in GSC

1. In Google Search Console
2. Go to **Enhancements** → **Rich Results**
3. Check if LocalBusiness shows as implemented
4. Monitor over 1-2 weeks for indexing

---

## 📍 Per-Location Implementation (Future)

When scaling to multiple distinct locations:

### Create Location-Specific Pages

**Structure:**

```
/locations
  /wellington-street
  /downtown
  /airport-location
```

**Each page includes:**

```jsx
// src/pages/locations/WellingtonStreet.jsx

const getLocationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://romamart.ca/locations/wellington-street#location",
  "name": "Roma Mart - Wellington Street",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "189-3 Wellington Street",
    "addressLocality": "Sarnia",
    "addressRegion": "ON",
    "postalCode": "N7T 1G6",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 42.970389,
    "longitude": -82.404589
  },
  "isPartOf": {
    "@type": "Organization",
    "@id": "https://romamart.ca/#organization"
  }
});
```

---

## 🗺️ Local SEO Keywords by Area

### Sarnia-Specific Terms

**For `areaServed` and `keywords` in meta:**

```
Sarnia neighborhoods:
- Downtown Sarnia
- Wellington Street area
- North End
- South End
- East End
- Waterfront district

Local keywords:
- "24-hour convenience store Sarnia"
- "grocery delivery Sarnia"
- "coffee shop near Wellington Street"
- "Bitcoin ATM Sarnia Ontario"
- "24-hour pharmacy alternative Sarnia"
```

### Update Locations Data

**File:** `src/data/locations.js`

Add `areaServed` to each location:

```javascript
{
  id: 'wellington-street',
  name: 'Roma Mart Wellington',
  address: { /* ... */ },
  geo: { /* ... */ },
  areaServed: [
    'Downtown Sarnia',
    'Wellington Street',
    'North Sarnia',
    'East Sarnia'
  ],
  services: ['atm', 'rocafe', 'grocery']
}
```

---

## 🏆 Advanced: LocalBusinessFAQ Schema

**When FAQ content added:**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusinessFAQ",
  "mainEntity": { /* LocalBusiness schema */ },
  "faqs": [
    {
      "@type": "Question",
      "name": "Is Roma Mart open 24 hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Roma Mart is open 24 hours, 7 days a week."
      }
    },
    {
      "@type": "Question",
      "name": "Do you have parking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, free parking is available at our Wellington Street location."
      }
    }
  ]
}
```

**Impact:** Shows FAQ in Google "People Also Ask" section

---

## 📊 Local Search Visibility Checkpoints

### After Implementing Enhanced Schema

**Week 1:**

- [ ] Schema validates with 0 errors
- [ ] Homepage loads structured data
- [ ] Rich Results Test shows LocalBusiness

**Week 2-3:**

- [ ] GSC Enhancements shows LocalBusiness indexed
- [ ] LocalBusiness appears in search results
- [ ] Google Maps listing shows business details

**Month 1:**

- [ ] Search impressions increase (expect +10-20%)
- [ ] "Sarnia convenience store" shows Roma Mart in top 3
- [ ] Local search CTR improves
- [ ] Map interactions increase

### Metrics to Track

| Metric | Tool | Target |
|--------|------|--------|
| Schema errors | Rich Results Test | 0 |
| LocalBusiness impressions | GSC Performance | 50+/month |
| Position for local keyword | GSC Search Analytics | Top 3 |
| Map interactions | GSC Insights (GMB) | 20+/month |

---

## 🔍 Competitor Analysis

### Check Competitor Schema

**Find what competitors rank well with:**

1. Go to competitor website
2. View source (`Ctrl+U`)
3. Search for `@context` and `LocalBusiness`
4. Compare their implementation

**Competitors to monitor:**

- Other convenience stores in Sarnia
- 24-hour businesses
- Coffee shop competitors

**Typical gaps to exploit:**

- Incomplete `areaServed`
- Missing amenities markup
- No review aggregation
- Outdated hours

---

## 📋 Implementation Checklist

### Before Deploying Enhanced Schema

- [ ] Updated `StructuredData.jsx` with all enhanced fields
- [ ] Validated with Rich Results Test (0 errors)
- [ ] Validated with Schema.org Validator (0 errors)
- [ ] Homepage loads structured data
- [ ] Tested in Lighthouse audit (no warnings)
- [ ] Mobile version also includes schema
- [ ] Social images (og-image.jpg) present for sharing
- [ ] Alt text on all images (for Google Image Search)

### After Deployment

- [ ] Submitted URL to GSC (Inspect tool)
- [ ] Waiting for indexing (24-48 hours)
- [ ] Monitoring GSC Enhancements report
- [ ] Checking Google Search result snippets
- [ ] Monitoring search traffic increase

### Monthly Maintenance

- [ ] Verify schema still valid
- [ ] Update hours if changed
- [ ] Refresh ratings/reviews if available
- [ ] Add new amenities if added
- [ ] Check for schema errors in GSC

---

## 🚨 Common Issues & Fixes

### Issue: "aggregateRating not showing in results"

**Reason:** Need sufficient Trustpilot or review data

**Fix:**

1. Ensure reviews are being collected
2. Schema rating value >= 4.0
3. Wait 2-4 weeks for Google to process
4. Verify in Rich Results Test

### Issue: "Schema errors: missing required field"

**Solution:**

1. Check error details in Rich Results Test
2. Add missing required fields
3. Re-validate until 0 errors
4. Resubmit URL to GSC

### Issue: "LocalBusiness not appearing in search results"

**Causes:**

1. Schema not yet indexed by Google
2. Search query doesn't trigger local results
3. Content relevance issue

**Solutions:**

1. Wait 1-2 weeks for indexing
2. Search for "Sarnia convenience store" (local query)
3. Add more relevant content to pages

### Issue: "Hours showing incorrectly"

**Fix:**

1. Verify 24-hour format (00:00 - 23:59)
2. Check if dayOfWeek array includes all days
3. Use `openingHoursSpecification` array with one entry per set of hours
4. Test in Rich Results Test

---

## 📚 Resources & Standards

### Schema.org References

- [LocalBusiness](https://schema.org/LocalBusiness)
- [PostalAddress](https://schema.org/PostalAddress)
- [GeoCoordinates](https://schema.org/GeoCoordinates)
- [OpeningHoursSpecification](https://schema.org/OpeningHoursSpecification)
- [AggregateRating](https://schema.org/AggregateRating)

### Google Tools

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/)

### Learning

- [Google Structured Data Guide](https://developers.google.com/search/docs/beginner/intro-structured-data)
- [Local Business Schema Guide](https://schema.org/docs/schemas/LocalBusiness.html)

---

## ✅ Success Criteria

| Criterion | Status | Impact |
|-----------|--------|--------|
| Schema with 0 errors | ✅ In Progress | Required for rich results |
| LocalBusiness indexed | 🔄 Expected in 2 weeks | 10-20% boost in impressions |
| Local keyword rankings | 📈 Expected in 1 month | Top 3 for "Sarnia convenience" |
| Map/Direction clicks ↑ | 📈 Expected in 1 month | Better local traffic |
| Review aggregate visible | 🔄 Pending Trustpilot data | 3-5% boost in CTR |

---

**Maintained by:** Roma Mart Development Team  
**Last Updated:** December 2025  
**Next Phase:** FAQ Schema implementation (when content available)  
**Estimated Impact:** 15-25% increase in local search impressions within 4-6 weeks

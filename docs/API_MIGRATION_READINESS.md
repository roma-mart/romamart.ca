# API Implementation Guide for Backend Team

**Created:** February 5, 2026
**Updated:** February 6, 2026
**Status:** Ready for Implementation

---

## Executive Summary

This document provides complete specifications for implementing three public API endpoints to power the Roma Mart 2.0 web application. The webapp currently uses static data with React Context providers that are ready to consume your APIs with automatic fallback to static data if APIs are unavailable.

**What You Need to Implement:**

1. **Services API** (`/api/public-services`) - 15 convenience store services with filtering
2. **Locations API** (`/api/public-locations`) - Multi-location store information with hours, coordinates, amenities
3. **Menu API Enhancement** - Add missing fields (calories, dietary info, featured flag) to existing endpoint

**What to Plan For (Future):**

1. **Company Data API** (`/api/public-company-data`) - Centralized business info (hours, contact, policies)
2. **Seasonal/Quick Theming Support** - Dynamic theme configuration (holidays, promotions, events)

**Webapp Architecture:**
- React Context providers fetch your APIs at app mount
- Static fallback if API unavailable (graceful degradation)
- Build-time prerendering fetches APIs to inject SEO schemas into static HTML
- All schemas (Product, Service, Location) depend on your API data

---

## Menu API Enhancement (Existing Endpoint)

**Current:** `https://romamart.netlify.app/api/public-menu`

**Status:** Already implemented, needs field additions

### Current Response (Working)
```json
{
  "success": true,
  "menu": [{
    "id": "espresso",
    "itemType": "menu",
    "name": "Espresso",
    "description": "Rich, bold espresso shot",
    "image": null,
    "badge": "bestseller",
    "sizes": [
      { "name": "Single", "price": 249 },
      { "name": "Double", "price": 349 }
    ],
    "defaultSize": 0,
    "category": "hot_beverages",
    "status": "available",
    "availableAt": ["loc-wellington-001"]
  }]
}
```

### Missing Fields (Add These)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `featured` | boolean | **YES** | Homepage featured items filter | `true` |
| `tagline` | string | No | Short marketing tagline | `"Bold and smooth"` |
| `prepTime` | string | No | Preparation time | `"3-5 min"` |
| `customizations` | array | No | Available customizations | `["Extra shot", "Oat milk", "Vanilla syrup"]` |
| `allergens` | array | No | Allergen warnings | `["dairy", "tree nuts"]` |
| `dietary` | array | No | Dietary suitability | `["vegetarian", "gluten-free"]` |
| `temperature` | array | No | Temperature options | `["hot", "iced"]` |
| `caffeineLevel` | string | No | Caffeine content | `"high"`, `"medium"`, `"low"`, `"none"` |
| `flavorProfile` | array | No | Flavor tags | `["sweet", "bitter", "creamy", "fruity"]` |
| `availability` | string | No | When available | `"store_hours"`, `"24_7"`, `"seasonal"` |

**Note on `category` field:** Already exists in current API. Verify values match the Complete Field Enumerations section (9 categories: hot-coffee, iced-coffee, tea, fresh-juice, smoothies, frappes, specialty, food, seasonal).

**Calories Field (CRITICAL for sizes):**
```json
"sizes": [
  {
    "name": "Small",
    "price": 249,         // Price in cents (existing)
    "calories": 120        // ADD THIS - nutritional info
  },
  {
    "name": "Medium",
    "price": 349,
    "calories": 180
  }
]
```

### Enhanced Response Example
```json
{
  "success": true,
  "menu": [{
    "id": "signature-bubble-tea",
    "itemType": "menu",
    "name": "Signature Bubble Tea",
    "tagline": "Classic tapioca pearls in premium tea",
    "description": "Our most popular drink featuring chewy tapioca pearls...",
    "image": null,
    "badge": "bestseller",
    "sizes": [
      { "name": "Regular", "price": 499, "calories": 320 },
      { "name": "Large", "price": 599, "calories": 450 }
    ],
    "defaultSize": 0,
    "category": "specialty",
    "customizations": ["Extra pearls", "Less sugar", "Oat milk", "Almond milk"],
    "allergens": ["dairy"],
    "dietary": ["vegetarian"],
    "prepTime": "3-5 min",
    "temperature": ["iced"],
    "caffeineLevel": "medium",
    "flavorProfile": ["sweet", "creamy", "chewy"],
    "status": "available",
    "availableAt": ["loc-wellington-001"],
    "availability": "store_hours",
    "featured": true
  }]
}
```

---

## Services API (New Endpoint)

**URL:** `https://romamart.netlify.app/api/public-services`

**Purpose:** Provide list of services offered (ATM, Bitcoin ATM, lottery, money orders, etc.)

**Note:** Currently 14 services in production. Spec designed to scale to additional services as business grows.

### Complete Field Specification

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `itemType` | string | **YES** | Always "service" | `"service"` |
| `id` | string | **YES** | Unique service ID (kebab-case) | `"atm"`, `"bitcoin-atm"`, `"lottery"` |
| `name` | string | **YES** | Service display name | `"ATM Services"` |
| `tagline` | string | No | Short marketing tagline | `"Cash when you need it"` |
| `description` | string | **YES** | Full service description | `"24/7 cash withdrawal services with low fees..."` |
| `icon` | string | No | Icon identifier | `"banknote"`, `"bitcoin"`, `"ticket"` |
| `category` | string | **YES** | Service category | `"financial"`, `"convenience"`, `"food_beverage"` |
| `availableAt` | array | **YES** | Location IDs where available | `["loc-wellington-001"]` |
| `availability` | string | **Recommended** | When available (see note below) | `"store_hours"`, `"24_7"`, `"seasonal"` |
| `features` | array | No | Service features | `["24/7 access", "Low fees", "Multiple currencies"]` |
| `badge` | string | No | Display badge | `"new"`, `"popular"`, `"limited"`, `null` |
| `ageRestricted` | boolean | **YES** | Age restriction (19+) | `true` for lottery/tobacco, `false` for ATM |
| `status` | string | **YES** | Service status | `"available"`, `"coming_soon"`, `"unavailable"` |
| `featured` | boolean | **YES** | Homepage featured filter | `true` (max 6 featured) |
| `partner` | object | No | Partner information | `{ "name": "Genesis Coin", "url": "...", "logo": "..." }` |
| `action` | object | No | Call-to-action | `{ "text": "Learn More", "url": "/services#atm" }` |

### Field Details

**`availability` field (Recommended):**
While technically optional, strongly recommended for proper schema generation. All 14 current services include this field. Used for:
- Schema.org Service hoursAvailable property
- Availability display logic
- User expectations about when service can be accessed

If omitted, service will still function but SEO schemas will be incomplete.

**category values:**
- `"financial"` - ATM, Bitcoin ATM, money orders
- `"food"` - RoCafé, halal meat, hot food, beverages
- `"retail"` - Perfumes, Canadian products, international products
- `"convenience"` - Printing, photocopying, faxing, phone top-up
- `"age_restricted"` - Lottery tickets, tobacco, vape products (requires ageRestricted: true)

**availability values:**
- `"store_hours"` - Available during regular store hours
- `"24_7"` - Available 24/7 (e.g., outdoor ATM)
- `"seasonal"` - Limited-time availability
- `"weekdays"` - Weekdays only

**status values:**
- `"available"` - Currently offered
- `"coming_soon"` - Launching soon
- `"unavailable"` - Temporarily unavailable (maintenance, out of stock)

**featured field:**
- Homepage displays max 6 featured services
- Sort by featured=true, then by category
- If more than 6 featured, webapp takes first 6

### Example Response
```json
{
  "success": true,
  "services": [
    {
      "itemType": "service",
      "id": "atm",
      "name": "ATM Services",
      "tagline": "Cash when you need it",
      "description": "Conveniently located ATM for 24/7 cash withdrawals. Low transaction fees and accepts all major bank cards.",
      "icon": "banknote",
      "category": "financial",
      "availableAt": ["loc-wellington-001"],
      "availability": "24_7",
      "features": [
        "24/7 access",
        "Multiple currencies",
        "Low transaction fees",
        "Receipt printing"
      ],
      "badge": null,
      "ageRestricted": false,
      "status": "available",
      "featured": true,
      "partner": null,
      "action": {
        "text": "Learn More",
        "url": "/services#atm"
      }
    },
    {
      "itemType": "service",
      "id": "bitcoin-atm",
      "name": "Bitcoin ATM",
      "tagline": "Buy Bitcoin with cash instantly",
      "description": "Genesis Coin Bitcoin ATM for instant cryptocurrency purchases using cash. Simple verification process.",
      "icon": "bitcoin",
      "category": "financial",
      "availableAt": ["loc-wellington-001"],
      "availability": "store_hours",
      "features": [
        "Instant Bitcoin purchases",
        "Cash payments accepted",
        "Simple ID verification",
        "QR code wallet support"
      ],
      "badge": "popular",
      "ageRestricted": true,
      "status": "available",
      "featured": true,
      "partner": {
        "name": "Genesis Coin",
        "url": "https://www.genesiscoin.com",
        "logo": "https://example.com/genesis-logo.png"
      },
      "action": {
        "text": "Get Started",
        "url": "/services#bitcoin-atm"
      }
    },
    {
      "itemType": "service",
      "id": "lottery",
      "name": "Lottery Tickets",
      "tagline": "Try your luck today",
      "description": "OLG authorized retailer offering Lotto Max, Lotto 6/49, Daily Grand, and instant scratch tickets.",
      "icon": "ticket",
      "category": "age_restricted",
      "availableAt": ["loc-wellington-001"],
      "availability": "store_hours",
      "features": [
        "Lotto Max & 6/49",
        "Daily Grand",
        "Instant scratch tickets",
        "Ticket validation"
      ],
      "badge": null,
      "ageRestricted": true,
      "status": "available",
      "featured": false,
      "partner": {
        "name": "OLG",
        "url": "https://www.olg.ca",
        "logo": null
      },
      "action": null
    }
  ]
}
```

---

## Locations API (New Endpoint)

**URL:** `https://romamart.netlify.app/api/public-locations`

**Purpose:** Provide multi-location store information with complete details (hours, coordinates, amenities, services)

### Complete Field Specification

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | **YES** | Unique location ID | `"loc-wellington-001"` |
| `type` | string | **YES** | Location type | `"convenience_store"`, `"warehouse"` |
| `name` | string | **YES** | Full location name | `"Roma Mart Convenience"` |
| `shortName` | string | No | Short display name | `"Roma Mart 001"` |
| `isPrimary` | boolean | **YES** | Primary/flagship location | `true` (only one should be true) |
| `status` | string | **YES** | Location status | `"open"`, `"temporarily_closed"`, `"coming_soon"` |
| `address` | object | **YES** | Complete address | See address structure below |
| `google` | object | **YES** | Google integration | See google structure below |
| `contact` | object | **YES** | Contact information | See contact structure below |
| `hours` | object | **YES** | Operating hours | See hours structure below |
| `services` | array | **YES** | Available service IDs | `["atm", "bitcoin-atm", "rocafe", "lottery"]` |
| `amenities` | array | **YES** | Location amenities | See amenities structure below |
| `images` | object | No | Location images | `{ "storefront": "url", "interior": "url" }` |
| `metadata` | object | No | Additional info | See metadata structure below |
| `serviceOverrides` | object | No | Service-specific overrides | `{}` (future use) |
| `menuOverrides` | object | No | Menu-specific overrides | `{}` (future use) |

### Nested Structure Details

**address object:**
```json
{
  "street": "3-189 Wellington Street",
  "city": "Sarnia",
  "province": "ON",
  "postalCode": "N7T 1G6",
  "country": "Canada",
  "formatted": "3-189 Wellington Street, Sarnia, ON N7T 1G6"
}
```

**google object (CRITICAL for maps, hours, ratings):**
```json
{
  "placeId": "ChIJCfo3t6SdJYgRIQVbpCppKmY",
  "mapLink": "https://maps.google.com/?q=42.970389,-82.404589",
  "embedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12...",
  "rating": 4.5,
  "reviewCount": 127,
  "coordinates": {
    "lat": 42.970389,
    "lng": -82.404589
  }
}
```

**contact object:**
```json
{
  "phone": "+1 (382) 342-2000",
  "email": "contact@romamart.ca",
  "whatsapp": "+13823422000"
}
```

**hours object (CRITICAL for SEO, business hours display):**
```json
{
  "timezone": "America/Toronto",
  "daily": {
    "Monday": "8:30 AM - 9:00 PM",
    "Tuesday": "8:30 AM - 9:00 PM",
    "Wednesday": "8:30 AM - 9:00 PM",
    "Thursday": "8:30 AM - 9:00 PM",
    "Friday": "3:00 PM - 9:00 PM",
    "Saturday": "8:30 AM - 9:00 PM",
    "Sunday": "8:30 AM - 9:00 PM"
  },
  "weekdays": "8:30 AM - 9:00 PM (Fri: 3:00 PM - 9:00 PM)",
  "weekends": "8:30 AM - 9:00 PM",
  "display": "Mon-Thu, Sat-Sun: 8:30 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM",
  "is24Hours": false,
  "isSeasonal": false,
  "exceptions": {
    "2026-12-25": "Closed",
    "2026-01-01": "10:00 AM - 6:00 PM"
  }
}
```

**amenities array (Google Business Profile compliant):**
```json
[
  { "name": "Free Wi-Fi", "value": true },
  { "name": "Wheelchair-accessible entrance", "value": true },
  { "name": "Wheelchair-accessible parking", "value": true },
  { "name": "Restroom", "value": true },
  { "name": "Parking", "value": true },
  { "name": "Debit cards", "value": true },
  { "name": "Credit cards", "value": true },
  { "name": "NFC mobile payments", "value": true }
]
```

**Standard Amenity Names (Google-Compliant):**
- "Free Wi-Fi"
- "Wheelchair-accessible entrance"
- "Wheelchair-accessible parking"
- "Restroom"
- "Parking"
- "Debit cards"
- "Credit cards"
- "NFC mobile payments"
- "Public transport nearby"
- "EV charging"

**metadata object:**
```json
{
  "openedDate": "2018-03-15",
  "squareFootage": 1200,
  "isHeadquarters": true,
  "acceptsCrypto": true,
  "languages": ["English", "French", "Arabic"],
  "employees": {
    "fullTime": 3,
    "partTime": 2
  }
}
```

### Example Response
```json
{
  "success": true,
  "locations": [
    {
      "id": "loc-wellington-001",
      "type": "convenience_store",
      "name": "Roma Mart Convenience",
      "shortName": "Roma Mart 001",
      "isPrimary": true,
      "status": "open",
      "address": {
        "street": "3-189 Wellington Street",
        "city": "Sarnia",
        "province": "ON",
        "postalCode": "N7T 1G6",
        "country": "Canada",
        "formatted": "3-189 Wellington Street, Sarnia, ON N7T 1G6"
      },
      "google": {
        "placeId": "ChIJCfo3t6SdJYgRIQVbpCppKmY",
        "mapLink": "https://maps.google.com/?q=42.970389,-82.404589",
        "embedUrl": "https://www.google.com/maps/embed?pb=...",
        "rating": 4.5,
        "reviewCount": 127,
        "coordinates": {
          "lat": 42.970389,
          "lng": -82.404589
        }
      },
      "contact": {
        "phone": "+1 (382) 342-2000",
        "email": "contact@romamart.ca",
        "whatsapp": "+13823422000"
      },
      "hours": {
        "timezone": "America/Toronto",
        "daily": {
          "Monday": "8:30 AM - 9:00 PM",
          "Tuesday": "8:30 AM - 9:00 PM",
          "Wednesday": "8:30 AM - 9:00 PM",
          "Thursday": "8:30 AM - 9:00 PM",
          "Friday": "3:00 PM - 9:00 PM",
          "Saturday": "8:30 AM - 9:00 PM",
          "Sunday": "8:30 AM - 9:00 PM"
        },
        "weekdays": "8:30 AM - 9:00 PM (Fri: 3:00 PM - 9:00 PM)",
        "weekends": "8:30 AM - 9:00 PM",
        "display": "Mon-Thu, Sat-Sun: 8:30 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM",
        "is24Hours": false,
        "isSeasonal": false,
        "exceptions": {
          "2026-12-25": "Closed",
          "2026-01-01": "10:00 AM - 6:00 PM"
        }
      },
      "services": [
        "atm",
        "bitcoin-atm",
        "rocafe",
        "lottery",
        "money-orders",
        "photocopying"
      ],
      "amenities": [
        { "name": "Free Wi-Fi", "value": true },
        { "name": "Wheelchair-accessible entrance", "value": true },
        { "name": "Wheelchair-accessible parking", "value": true },
        { "name": "Restroom", "value": true },
        { "name": "Parking", "value": true },
        { "name": "Debit cards", "value": true },
        { "name": "Credit cards", "value": true },
        { "name": "NFC mobile payments", "value": true }
      ],
      "images": {
        "storefront": null,
        "interior": null
      },
      "metadata": {
        "openedDate": "2018-03-15",
        "squareFootage": 1200,
        "isHeadquarters": true,
        "acceptsCrypto": true,
        "languages": ["English", "French", "Arabic"],
        "employees": {
          "fullTime": 3,
          "partTime": 2
        }
      },
      "serviceOverrides": {},
      "menuOverrides": {}
    }
  ]
}
```

---

## Future Planning

### Company Data API (Not Urgent - Plan Ahead)

**URL:** `https://romamart.netlify.app/api/public-company-data`

**Purpose:** Centralize all business-wide information (contact, hours, policies, social links, payment methods)

**Why Future:**
- Requires frontend refactoring (~10-12 hours to create CompanyDataContext and update 50+ files)
- Services and Locations APIs are higher priority (already 90% ready)
- Company data changes infrequently (less ROI than services/locations)

**When to Implement:**
- After Services and Locations APIs are stable for 1-2 months
- When business wants to update company info without code deployments
- Before multi-brand expansion (if Roma Mart launches second brand)

**What It Would Include:**
- Legal business info (GST number, NAICS code, legal name, DBA)
- Contact information (phone, email, contextual emails like privacy@, legal@)
- Social media links (Facebook, Instagram, TikTok, X, Snapchat)
- Payment methods accepted (cash, credit, debit, Bitcoin, etc.)
- Return policy configuration (days, conditions, fees)
- Default values (timezone, currency, age restriction, price range)
- PWA configuration (name, description, category, permissions)

**Reference:** See API Contract section below for complete structure.

### Seasonal/Quick Theming Support (Future Enhancement)

**Purpose:** Allow dynamic theme configuration for holidays, promotions, and events without code deploys.

**Use Cases:**
1. **Holiday Theming** - Christmas, Halloween, Canada Day colors/badges
2. **Promotional Events** - "Summer Sale 20% Off" banners, featured item badges
3. **Seasonal Menu Changes** - Winter hot beverages, summer cold drinks
4. **Store Events** - Grand opening countdown, anniversary promotions

**Proposed Implementation (When Ready):**

**Theme Configuration API:**
```json
{
  "success": true,
  "theme": {
    "id": "christmas-2026",
    "active": true,
    "startDate": "2026-12-01",
    "endDate": "2026-12-26",
    "name": "Christmas 2026",
    "colors": {
      "primary": "#d42426",
      "secondary": "#165b33",
      "accent": "#f4c542"
    },
    "badges": {
      "featured": "Holiday Special",
      "new": "New This Season"
    },
    "banners": [
      {
        "id": "homepage-hero",
        "text": "Holiday Hours: Dec 24 until 6 PM, Dec 25 Closed",
        "type": "info",
        "dismissible": true
      }
    ],
    "featuredOverrides": {
      "menu": ["hot-chocolate", "peppermint-latte", "gingerbread-latte"],
      "services": ["gift-cards", "money-orders"]
    }
  }
}
```

**Benefits:**
- Marketing team controls seasonal campaigns
- No developer involvement for theme changes
- A/B testing different themes
- Schedule themes in advance

**Timeline:** Implement after Services, Locations, Company Data APIs are stable (6-12 months out).

---

## Complete Field Enumerations

This section lists all valid values for enumerated fields across all APIs.

### Menu Item Fields

**category (Menu Items):**
```javascript
"hot-coffee"      // Hot coffee drinks
"iced-coffee"     // Iced coffee drinks
"tea"             // Tea varieties
"fresh-juice"     // Fresh juices and fruit drinks
"smoothies"       // Blended fruit smoothies
"frappes"         // Frozen blended drinks
"specialty"       // Specialty drinks (bubble tea, matcha, etc.)
"food"            // Food items
"seasonal"        // Limited-time seasonal items
```

**badge (Menu/Services):**
```javascript
null              // No badge
"bestseller"      // Best-selling item
"new"             // Newly added item
"halal"           // Halal certified
```

**status (Menu/Services):**
```javascript
"available"       // Currently available
"coming_soon"     // Launching soon
"unavailable"     // Temporarily unavailable (maintenance, out of stock)
```

**availability (Menu/Services):**
```javascript
"store_hours"     // Available during regular store hours
"24_7"            // Available 24/7 (e.g., outdoor ATM)
"seasonal"        // Limited-time/seasonal availability
"weekdays"        // Weekdays only
```

**caffeineLevel:**
```javascript
"none"            // Caffeine-free
"low"             // Low caffeine content
"medium"          // Medium caffeine content
"high"            // High caffeine content
```

**temperature:**
```javascript
["hot"]           // Hot drinks only
["iced"]          // Iced drinks only
["hot", "iced"]   // Available both ways
```

**allergens (examples - extensible):**
```javascript
[]                          // No allergens
["dairy"]                   // Contains dairy
["tree nuts"]               // Contains tree nuts
["soy"]                     // Contains soy
["gluten"]                  // Contains gluten
["eggs"]                    // Contains eggs
["dairy", "tree nuts"]      // Multiple allergens
```

**dietary (examples - extensible):**
```javascript
[]                // No special dietary tags
["vegan"]         // Suitable for vegans
["vegetarian"]    // Suitable for vegetarians
["gluten-free"]   // Gluten-free
["dairy-free"]    // Dairy-free
["halal"]         // Halal certified
```

**flavorProfile (examples - extensible):**
```javascript
["sweet", "creamy", "chewy"]        // Bubble tea
["bold", "smooth", "aromatic"]      // Coffee
["earthy", "creamy", "umami"]       // Matcha
["tropical", "sweet", "tangy"]      // Fruit drinks
["bitter", "fruity", "rich"]        // Additional options
```

### Service Fields

**category (Services):**
```javascript
"financial"       // ATM, Bitcoin ATM, money orders
"food"            // RoCafé, halal meat, hot food, beverages
"retail"          // Perfumes, Canadian products, international products
"convenience"     // Printing, photocopying, faxing, phone top-up
"age_restricted"  // Lottery tickets, tobacco, vape (requires ageRestricted: true)
```

### Location Fields

**type (Locations):**
```javascript
"convenience_store"   // Full-service Roma Mart location
"minimart"            // Unattended vending-based mini location
"vending_machine"     // Single vending machine
"atm_standalone"      // Standalone ATM location
"kiosk"               // Small retail kiosk
"popup"               // Temporary popup location
"coming_soon"         // Announced but not open yet
```

**status (Locations):**
```javascript
"open"                // Currently operating
"closed"              // Permanently closed
"coming_soon"         // Opening soon
"temporarily_closed"  // Temporarily closed (renovations, etc.)
```

**Standard Amenity Names:**
```javascript
"Free Wi-Fi"
"Wheelchair-accessible entrance"
"Wheelchair-accessible parking"
"Restroom"
"Parking"
"Debit cards"
"Credit cards"
"NFC mobile payments"
"Public transport nearby"
"EV charging"
```

---

## API Testing Checklist

Before marking APIs production-ready, test these scenarios:

### Services API Testing
- [ ] Returns all 14 services (current count)
- [ ] `featured: true` filters correctly (6 services for homepage)
- [ ] Categories match expected values (see Complete Field Enumerations section)
- [ ] `availableAt` array contains valid location IDs
- [ ] `ageRestricted: true` for lottery, tobacco services
- [ ] `status: "available"` only for currently offered services
- [ ] Partner objects include name, url when applicable
- [ ] Response validates against JSON schema
- [ ] Performance: Response time < 300ms
- [ ] Error handling: Returns 404 gracefully if no services

### Locations API Testing
- [ ] Returns all locations (currently 1, plan for growth)
- [ ] Only one location has `isPrimary: true`
- [ ] `google.coordinates` match actual location (lat/lng)
- [ ] `google.placeId` is valid Google Place ID
- [ ] `hours.daily` includes all 7 days (Monday-Sunday)
- [ ] `hours.exceptions` handles holidays correctly
- [ ] `services` array contains valid service IDs
- [ ] `amenities` use Google Business Profile standard names
- [ ] `status: "open"` only for currently operating locations
- [ ] Address fields match Google Maps
- [ ] Performance: Response time < 300ms
- [ ] Error handling: Returns 404 gracefully if no locations

### Menu API Enhancement Testing
- [ ] All menu items include `featured: true/false`
- [ ] `sizes` array includes `calories` field for each size
- [ ] `customizations` array populated where applicable
- [ ] `allergens` array uses standard allergen names
- [ ] `dietary` array includes diet tags (vegetarian, vegan, gluten-free)
- [ ] `temperature`, `caffeineLevel`, `flavorProfile` populated for beverages
- [ ] `prepTime` realistic (3-5 min, 5-10 min, 10-15 min)
- [ ] Price in cents (249 = $2.49)
- [ ] Backward compatibility maintained with existing fields
- [ ] Performance: Response time < 500ms (larger payload)

### Build-Time API Testing (Prerender)
- [ ] Prerender script successfully fetches all 3 APIs in parallel
- [ ] Graceful fallback if API returns 404 (returns empty array)
- [ ] Schemas injected into static HTML at build time
- [ ] Build succeeds even when APIs temporarily unavailable
- [ ] Build time increase < 5 seconds
- [ ] No build errors from malformed JSON
- [ ] Static HTML validates with Schema.org validator

---

## Error Handling Requirements

Your APIs should handle these scenarios gracefully:

### Standard Error Responses

**404 - Endpoint Not Ready:**
```json
{
  "success": false,
  "error": "Endpoint not yet implemented",
  "message": "Services API is coming soon"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to fetch services from database"
}
```

**Empty Results:**
```json
{
  "success": true,
  "services": []
}
```

### Webapp Behavior on Errors

- **404**: Logs warning, uses static fallback data
- **500**: Logs error, uses static fallback data
- **Timeout (>5s)**: Cancels request, uses static fallback
- **Empty array**: Uses static fallback if critical (menu, locations), shows empty state if optional

**Your APIs don't need to be perfect** - webapp designed for graceful degradation.

---

## Performance Requirements

- **Response Time:** < 500ms (p95)
- **Payload Size:** < 100KB per endpoint
- **Concurrent Requests:** Handle 10 requests/second
- **Availability:** 99.9% uptime target
- **Caching:** CDN caching allowed (5-minute TTL suggested)

**Optimization Tips:**
- Cache database queries (Redis)
- Index on commonly queried fields (status, featured, isPrimary)
- Paginate if menu grows beyond 100 items
- Compress responses (gzip)

---

## Deployment Strategy

### Phase 1: Services API (Week 1-2)
- Implement `/api/public-services` endpoint
- Populate database with 14 services
- Test with frontend staging environment
- Document any field discrepancies

### Phase 2: Locations API (Week 2-3)
- Implement `/api/public-locations` endpoint
- Populate database with location data
- Integrate Google Places API for ratings/coordinates
- Test multi-location scenarios

### Phase 3: Menu API Enhancement (Week 3-4)
- Add missing fields to existing endpoint
- Populate calories, dietary info, featured flags
- Test backward compatibility
- Monitor performance (larger payload)

### Phase 4: Stability Testing (Week 5-6)
- Run load tests (100+ concurrent users)
- Monitor error rates and response times
- Fix any performance bottlenecks
- Document API versioning strategy

### Phase 5: Production Rollout (Week 7+)
- Deploy to production
- Monitor for 1-2 weeks
- Frontend team removes static fallbacks once APIs stable for 1-2 months
- Document lessons learned

---

## Frontend Readiness (For Your Reference)

The frontend team has completed 100% of the work to consume your APIs. Context providers exist for all three endpoints with automatic fallback to static data. All components now use context providers - no static imports remain.

### What's Already Done

**MenuContext** (Reference Implementation - 100% Complete):
- Fetches from `https://romamart.netlify.app/api/public-menu`
- No static fallback (API-only, proven stable for 2+ months)
- Used on homepage and RoCafé page
- Build-time prerendering injects Product schemas into static HTML

**ServicesContext** (100% Complete):
- Fetches from `https://romamart.netlify.app/api/public-services`
- Static SERVICES fallback if API unavailable
- Used on homepage (featured services), services page, and StandardizedItem component
- All components migrated to use context (App.jsx, StandardizedItem.jsx)

**LocationsContext** (100% Complete):
- Fetches from `https://romamart.netlify.app/api/public-locations`
- Static LOCATIONS fallback if API unavailable
- Used on homepage, footer, locations page
- All components migrated to use context (App.jsx, Footer.jsx)

**Build-Time Prerendering:**
- All three APIs (Menu, Services, Locations) fetched in parallel during build
- Schemas injected into static HTML for SEO validators
- Graceful fallback if APIs unavailable at build time

---

## Company Data API Contract (Future Reference)

When ready to implement, here's the complete specification:

**URL:** `https://romamart.netlify.app/api/public-company-data`

```json
{
  "success": true,
  "companyData": {
    "legalName": "Roma Mart Corp.",
    "dba": "Roma Mart Convenience",
    "gstNumber": "780971768",
    "naicsCode": "4541",
    "naicsDescription": "Grocery Stores",
    "baseUrl": "https://romamart.ca",
    "logoUrl": "https://romamart.ca/logo.png",
    "onlineStoreUrl": "https://ordering.romamart.ca",
    "endpoints": {
      "returnPolicy": "/return-policy",
      "privacy": "/privacy",
      "services": "/services",
      "locations": "/locations",
      "menu": "/menu"
    },
    "defaults": {
      "productCategory": "Food & Beverage",
      "priceRange": "$$",
      "country": "CA",
      "currency": "CAD",
      "timezone": "America/Toronto",
      "ageRestriction": "19+"
    },
    "paymentMethods": [
      "Cash",
      "Credit Card",
      "Debit Card",
      "Interac",
      "Visa",
      "Mastercard",
      "American Express",
      "Bitcoin"
    ],
    "returnPolicy": {
      "merchantReturnDays": 1,
      "returnMethod": "https://schema.org/ReturnInStore",
      "returnFees": "https://schema.org/FreeReturn",
      "itemCondition": "https://schema.org/DamagedCondition",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow"
    },
    "socialLinks": {
      "facebook": "https://www.facebook.com/romamartca",
      "instagram": "https://www.instagram.com/romamartca/",
      "tiktok": "https://www.tiktok.com/@romamartca/",
      "snapchat": "https://www.snapchat.com/@romamartca/",
      "x": "https://www.x.com/romamartca/"
    },
    "address": {
      "street": "3-189 Wellington Street",
      "city": "Sarnia",
      "province": "ON",
      "postalCode": "N7T 1G6",
      "country": "Canada",
      "formatted": "3-189 Wellington Street, Sarnia, ON N7T 1G6"
    },
    "contact": {
      "phone": "+1 (382) 342-2000",
      "email": "contact@romamart.ca",
      "web3FormsAccessKey": "YOUR_KEY_HERE"
    },
    "contextualEmails": {
      "general": "contact@romamart.ca",
      "privacy": "privacy@romamart.ca",
      "accessibility": "accessibility@romamart.ca",
      "technology": "technology@romamart.ca",
      "legal": "legal@romamart.ca",
      "support": "support@romamart.ca"
    },
    "trustpilotReviewUrl": "https://www.trustpilot.com/review/romamart.ca",
    "pwa": {
      "webApplication": {
        "name": "Roma Mart Convenience",
        "url": "https://romamart.ca",
        "description": "Shop Roma Mart online for convenience store essentials...",
        "applicationCategory": "Shopping",
        "operatingSystem": "Any (Web Browser)",
        "offers": {
          "price": "0",
          "priceCurrency": "CAD"
        },
        "browserRequirements": "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
        "permissions": ["Location (optional, for nearest store)"]
      }
    }
  }
}
```

---

## Questions? Contact Frontend Team

**Implementation Questions:**
- Field types unclear? Ask for examples from static data files
- Schema requirements? See STRUCTURED_DATA_MASTER_PLAN.md
- Performance concerns? We can optimize frontend caching

**Testing Coordination:**
- Share staging API URLs for integration testing
- We'll validate against Schema.org validators
- Load testing can be coordinated

**Timeline:**
- No rush - implement when ready
- Webapp works fine with static data in the meantime
- Services and Locations are highest priority

---

## Success Criteria

APIs are production-ready when:

- [ ] All required fields populated
- [ ] Response times < 500ms (p95)
- [ ] Error handling tested (404, 500, empty, malformed)
- [ ] Data matches static file structure
- [ ] Schemas validate with Schema.org validator
- [ ] Load testing passes (10 requests/second)
- [ ] Documentation complete
- [ ] Frontend staging environment tested successfully
- [ ] Monitoring/alerting configured

Once deployed, frontend team will monitor API health for 1-2 months before removing static fallbacks.

---

**Last Updated:** February 6, 2026
**Document Owner:** Frontend Team
**API Owner:** Backend Team

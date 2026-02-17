/**
 * API Response Type Definitions
 * JSDoc types matching the verified backend API response shapes.
 * Reference file only — no runtime code.
 *
 * Backend: administrator-hub repository, monkey branch (Sprints 1-8)
 * All endpoints return { success: true, <data> } envelope.
 *
 * @since February 2026
 */

// ─── Menu API ────────────────────────────────────────────────────────

/**
 * @typedef {Object} ApiMenuSize
 * @property {string} name - Size label (e.g., "Medium", "Large")
 * @property {number} price - Price in cents (e.g., 449 = $4.49)
 * @property {number|null} calories - Per-size calorie count
 */

/**
 * @typedef {Object} ApiAddOn
 * @property {number} id - Add-on ID
 * @property {string} name - Display name (e.g., "Extra Shot")
 * @property {string|null} description - Description text
 * @property {number} price - Price in cents
 * @property {number|null} calories - Calorie count
 */

/**
 * @typedef {Object} ApiMenuItem
 * @property {string} id - Slug identifier (e.g., "cof-latte-001")
 * @property {'menu'} itemType - Always "menu"
 * @property {string} name
 * @property {string} slug - Same value as id
 * @property {string|null} tagline
 * @property {string|null} description
 * @property {string|null} image - CDN URL or null
 * @property {string|null} badge - "bestseller", "new", "halal", or null
 * @property {boolean} featured
 * @property {number|null} calories - Top-level calorie count
 * @property {string|null} prepTime - e.g., "3-5 min"
 * @property {string|null} caffeineLevel - e.g., "Medium", "High", "None"
 * @property {string} availability - "store_hours", "24_7", etc.
 * @property {string} status - "available" | "unavailable"
 * @property {string[]} customizations - Flat string array (e.g., ["Extra shot", "Oat milk"])
 * @property {string[]} allergens
 * @property {string[]} dietary
 * @property {string[]} temperature - e.g., ["Hot", "Iced"]
 * @property {string[]} flavorProfile - e.g., ["Smooth", "Creamy"]
 * @property {string|null} category - Raw category name (e.g., "Hot Coffee"), NOT snake_cased
 * @property {ApiMenuSize[]} sizes - Prices in cents
 * @property {number} defaultSize - Index into sizes array
 * @property {string[]} availableAt - Location slug strings
 * @property {ApiAddOn[]} addOns - Active add-ons with pricing
 */

// ─── Services API ────────────────────────────────────────────────────

/**
 * @typedef {Object} ApiServiceAction
 * @property {string} text - CTA button text
 * @property {string|null} url - Action URL
 */

/**
 * @typedef {Object} ApiServicePartner
 * @property {string} name - Partner name
 * @property {string|null} url - Partner URL
 * @property {string|null} logo - Partner logo URL
 */

/**
 * @typedef {Object} ApiService
 * @property {string} id - Slug identifier (e.g., "svc-atm-001")
 * @property {'service'} itemType - Always "service"
 * @property {string} name
 * @property {string} slug - Same value as id
 * @property {string|null} tagline
 * @property {string|null} description
 * @property {string|null} icon - Icon identifier (e.g., "banknote", "coffee")
 * @property {string|null} badge
 * @property {boolean} featured
 * @property {boolean} ageRestricted
 * @property {string[]} features
 * @property {string} availability - "store_hours", "24_7", "custom"
 * @property {string} status - "available" | "coming_soon"
 * @property {string|null} category - snake_cased (e.g., "financial_services")
 * @property {ApiServicePartner|null} partner
 * @property {ApiServiceAction|null} action
 * @property {string[]} availableAt - Location slug strings
 */

// ─── Locations API ───────────────────────────────────────────────────

/**
 * @typedef {Object} ApiLocationAddress
 * @property {string} street
 * @property {string} city
 * @property {string} province
 * @property {string} postalCode
 * @property {string} country
 * @property {string} formatted - Pre-computed formatted address
 */

/**
 * @typedef {Object} ApiLocationContact
 * @property {string} phone
 * @property {string} email
 * @property {string|null} whatsapp
 */

/**
 * @typedef {Object} ApiLocationGoogle
 * @property {string} placeId
 * @property {string} mapLink
 * @property {string} embedUrl
 * @property {{lat: number, lng: number}|null} coordinates
 */

/**
 * @typedef {Object} ApiLocationImages
 * @property {string|null} storefront
 * @property {string|null} interior
 */

/**
 * @typedef {Object} ApiLocationHoursException
 * @property {string} date - ISO date string (e.g., "2026-12-25")
 * @property {string} hours - "Closed" or time range like "8:30 AM - 6:00 PM"
 */

/**
 * @typedef {Object} ApiLocationHours
 * @property {string} timezone - e.g., "America/Toronto"
 * @property {Object.<string, string|null>} daily - Capitalized day keys (Monday, Tuesday, ...)
 * @property {string|null} weekdays - Summary for weekdays
 * @property {string|null} weekends - Summary for weekends
 * @property {string|null} display - Human-readable summary
 * @property {boolean} is24Hours
 * @property {boolean} isSeasonal
 * @property {ApiLocationHoursException[]} exceptions
 */

/**
 * @typedef {Object} ApiLocationAmenity
 * @property {string} name - Amenity name (Google Business Profile naming)
 * @property {boolean} value - Whether available
 */

/**
 * @typedef {Object} ApiLocationMetadata
 * @property {boolean} isHeadquarters
 * @property {boolean} acceptsCrypto
 * @property {string[]} languages
 * @property {number|null} employeeCount
 * @property {string|null} openedDate
 * @property {number|null} squareFootage
 */

/**
 * @typedef {Object} ApiLocation
 * @property {string} id - Slug identifier (e.g., "loc-wellington-001")
 * @property {string} name
 * @property {string} slug - Same value as id
 * @property {string} type - e.g., "convenience_store"
 * @property {string} status - "open", "closed", "coming_soon", "temporarily_closed"
 * @property {string|null} shortName
 * @property {boolean} isPrimary
 * @property {ApiLocationAddress} address
 * @property {ApiLocationContact} contact
 * @property {ApiLocationGoogle} google
 * @property {ApiLocationImages|null} images - API field (normalized to photos internally)
 * @property {ApiLocationHours|null} hours
 * @property {ApiLocationAmenity[]} amenities
 * @property {string[]} services - Service slug strings
 * @property {ApiLocationMetadata} metadata
 */

// ─── Company Data API ────────────────────────────────────────────────

/**
 * @typedef {Object} ApiCompanyDefaults
 * @property {string} productCategory
 * @property {string} priceRange
 * @property {string} country
 * @property {string} currency
 * @property {string} timezone
 * @property {string} ageRestriction
 */

/**
 * @typedef {Object} ApiCompanyReturnPolicy
 * @property {number} days
 * @property {string} method - Schema.org URL
 * @property {string} fees - Schema.org URL
 * @property {string} itemCondition - Schema.org URL
 * @property {string} category - Schema.org URL
 */

/**
 * @typedef {Object} ApiCompanySocialLinks
 * @property {string|null} facebook
 * @property {string|null} instagram
 * @property {string|null} tiktok
 * @property {string|null} snapchat
 * @property {string|null} x
 */

/**
 * @typedef {Object} ApiCompanyPwa
 * @property {string} name
 * @property {string} url
 * @property {string} description
 * @property {string} category
 * @property {string} os
 * @property {string} browserReqs
 * @property {string[]} permissions
 * @property {string} offerPrice
 * @property {string} offerCurrency
 */

/**
 * @typedef {Object} ApiCompanyData
 * @property {string} legalName
 * @property {string} dba
 * @property {string|null} gstNumber
 * @property {string|null} naicsCode
 * @property {string|null} naicsDescription
 * @property {string} baseUrl
 * @property {string|null} logoUrl
 * @property {string|null} onlineStoreUrl
 * @property {string|null} trustpilotReviewUrl
 * @property {ApiCompanyDefaults} defaults
 * @property {ApiCompanyReturnPolicy} returnPolicy
 * @property {ApiCompanySocialLinks} socialLinks
 * @property {{street: string, city: string, province: string, postalCode: string, country: string}} address
 * @property {{phone: string, email: string}} contact
 * @property {{general: string, privacy: string, accessibility: string, technology: string, legal: string, support: string}} contextualEmails
 * @property {{returnPolicy: string, privacy: string, services: string, locations: string, menu: string}} endpoints
 * @property {string[]} paymentMethods
 * @property {ApiCompanyPwa} pwa
 */

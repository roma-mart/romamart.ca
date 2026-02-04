# Manual Schema Validation (Phase 2)

**Date:** 2026-02-04  
**Scope:** Menu item Product schema builder (Phase 2, Week 1)

## How to Validate

1. Open Google Rich Results Test: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. Select **Code** input.
3. Paste the JSON-LD sample below.
4. Run the test and confirm no errors.

## Sample JSON-LD (Product)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Espresso",
  "description": "Single or double shot of our signature espresso",
  "keywords": [
    "coffee",
    "hot-drinks"
  ],
  "dietarySuitability": [
    "https://schema.org/VeganDiet",
    "https://schema.org/GlutenFreeDiet"
  ],
  "allergyWarning": [
    "dairy"
  ],
  "offers": {
    "@type": "Offer",
    "name": "Small",
    "price": "2.49",
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock"
  },
  "sku": "item-espresso",
  "url": "https://romamart.ca/rocafe"
}
```

## Notes

- Generated via buildMenuItemSchema() using fixture data.
- If validation fails, document the error here and file a follow-up task.

## Result

- Rich Results Test reported "No items detected." This is expected because Product schemas do not produce rich results in that tool by default. Schema is still valid for search engine understanding.

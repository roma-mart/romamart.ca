# Manual Schema Validation (Phase 2)

**Date:** 2026-02-04  
**Scope:** Menu item Product schema builder (Phase 2, Week 1)

## How to Validate

1. Open Google Rich Results Test: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. Select **Code** input.
3. Paste the JSON-LD sample below.
4. Run the test and confirm no errors.
5. Validate the same JSON-LD in the Schema.org validator: [https://validator.schema.org/](https://validator.schema.org/)

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

## ItemList Validation (Homepage + /rocafe)

- Homepage renders an ItemList of **featured** products only.
- /rocafe renders an ItemList of the **full** menu.
- Both ItemLists are built from API data (no static fallback for schemas).

If validating ItemList:

1. Inspect rendered HTML and copy the JSON-LD from `<script type="application/ld+json">`.
2. Validate the ItemList in the Schema.org validator.
3. Confirm `itemListElement[].item` entries are Product objects.

## Notes

- Generated via buildMenuItemSchema() using fixture data.
- If validation fails, document the error here and file a follow-up task.

## Result

- Rich Results Test reported "No items detected." Treat this as investigatory: Product rich results require specific fields. Validate with the Schema.org validator and revisit required fields if rich results are needed.

# Location Availability Mapping - Implementation Notes

## Problem
The RoCafeMenu was showing items as 'unavailable' even when the API indicated they were available at specific locations. This was caused by a mismatch between:
- API's `locations[].name` field (e.g., "Roma Mart 001")
- Internal location `shortName` field (e.g., "Roma Mart 001")

## Solution
Updated the availability checking logic to properly map between API location names and internal location shortNames.

### Changes Made

1. **Transform Function (`src/utils/excelMenuTransform.jsx`)**
   - Added preservation of `locations` array from API response
   - Added `status: 'available'` and `itemType: 'menu'` defaults for API items

2. **Availability Check (`src/utils/availability.js`)**
   - Updated `getMenuItemStatusAtLocation` to accept optional `menuItem` parameter
   - Added logic to check if `location.shortName` matches any `name` in `item.locations[]`
   - Handles both string arrays and object arrays with `name` property
   - Falls back to legacy `availableAt` check for static menu items

3. **Component Updates**
   - `StandardizedItem.jsx`: Pass item object to availability check
   - `RoCafePage.jsx`: Pass `itemType="menu"` prop to StandardizedItem

## API Structure Expected

```json
{
  "menu": [
    {
      "id": 1,
      "name": "Iced Latte",
      "categories": ["RoCafe Iced Coffee"],
      "sizes": [{ "name": "M", "price": 499 }],
      "locations": [
        { "name": "Roma Mart 001", "id": 1 },
        { "name": "Roma Mart 002", "id": 2 }
      ]
    }
  ]
}
```

## Testing
- Added 10 unit tests in `src/utils/__tests__/availability.test.js`
- Tests cover:
  - Location name mapping (objects and strings)
  - Unavailable items at specific locations
  - Location overrides
  - Legacy static menu fallback
  - Edge cases (empty arrays, missing items)

## Backward Compatibility
- Legacy static menu items continue to work using `availableAt` field
- Location overrides (`menuOverrides`) still take precedence
- No breaking changes to existing code

## Future Enhancements
- Could map by location.id instead of name for more robust matching
- Could support location aliases/alternative names
- Could add caching for performance optimization

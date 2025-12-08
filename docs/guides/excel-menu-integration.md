# Excel Menu Integration Guide

## Overview

The RoCafé menu system supports dynamic menu updates via Excel spreadsheet. This allows non-technical staff to update menu items, prices, and categories without code changes.

## Architecture

### Components

1. **Excel File**: `public/rocafe_menu.xlsx`
   - Stores menu items with fields: Name, size, cents, oc_page (category), etc.
   - Managed by operations staff
   - Must be placed in `public/` directory to be accessible

2. **Hook**: `src/hooks/useExcelMenu.js`
   - Fetches and parses Excel file using xlsx library
   - Returns: `{ menuItems, loading, error }`
   - Handles cleanup to prevent memory leaks

3. **Transformation Utilities**: `src/utils/excelMenuTransform.js`
   - `transformExcelToMenuItem()`: Converts Excel row to StandardizedItem format
   - `groupExcelItemsByCategory()`: Groups items by oc_page field
   - `mergeCategoriesWithFallback()`: Handles Excel vs static menu fallback
   - `EXCEL_CATEGORY_MAP`: Maps oc_page values to display metadata (icons, descriptions)

4. **Page Component**: `src/pages/RoCafePage.jsx`
   - Uses useExcelMenu hook to load data
   - Calls groupExcelItemsByCategory to organize items
   - Falls back to static menu if Excel fails or is empty
   - Renders using StandardizedItem component

### Data Flow

```
Excel File (public/rocafe_menu.xlsx)
  ↓
useExcelMenu hook (fetches + parses)
  ↓
Raw Excel data array
  ↓
transformExcelToMenuItem (converts to StandardizedItem format)
  ↓
groupExcelItemsByCategory (groups by oc_page)
  ↓
RoCafePage (renders with category expand/collapse)
  ↓
StandardizedItem components (display individual items)
```

## Excel File Structure

### Required Fields

- **Name**: Item name (e.g., "Espresso", "Latte")
- **size**: Size description (e.g., "1 ea", "12 oz")
- **cents**: Price in cents (e.g., 350 for $3.50)
- **oc_page**: Category name (must match EXCEL_CATEGORY_MAP keys)

### Supported Categories (oc_page values)

- `RoCafe Hot Coffee` → Hot Coffee
- `RoCafe Iced Coffee` → Iced Coffee
- `RoCafe Tea` → Tea & Matcha
- `RoCafe Fresh Juice` → Fresh Juice
- `RoCafe Smoothies` → Smoothies
- `RoCafe Frappe` → Frappés
- `RoCafe Food` → Food
- `RoCafe Ready2Eat` → Ready to Eat

### Optional Fields

- **Upc**: Product UPC code (used for unique ID)
- **oc_color**: Background color for item (hex code)
- **oc_key**: Short key for item
- **oc_relpos**: Relative position for sorting

### Example Row

```
Name: "Espresso"
size: "1 ea"
cents: 350
oc_page: "RoCafe Hot Coffee"
Upc: "176223301234"
```

This renders as:
- Item Name: "Espresso"
- Price: $3.50
- Category: Hot Coffee

## Adding/Updating Menu Items

### To Add a New Item

1. Open `public/rocafe_menu.xlsx`
2. Add a new row with required fields:
   - Name
   - size
   - cents
   - oc_page (must match existing category)
3. Save the file
4. Commit and push changes
5. Changes appear on next page load

### To Update Pricing

1. Open `public/rocafe_menu.xlsx`
2. Find the item row
3. Update the `cents` field (e.g., 350 for $3.50)
4. Save, commit, push
5. Price updates on next page load

### To Add a New Category

If you need a category not in EXCEL_CATEGORY_MAP:

1. Add items with new `oc_page` value in Excel
2. Update `src/utils/excelMenuTransform.js`:
   ```javascript
   export const EXCEL_CATEGORY_MAP = {
     // ... existing categories
     'RoCafe New Category': {
       icon: Coffee, // Choose appropriate icon
       name: 'New Category',
       description: 'Description of new category'
     }
   };
   ```
3. Commit code changes
4. New category appears automatically

**Note**: Unknown categories (not in EXCEL_CATEGORY_MAP) still work! They get a generic icon and description based on the oc_page value.

## Fallback Behavior

The system gracefully handles errors:

1. **Excel file missing**: Falls back to static menu in `src/data/rocafe-menu.js`
2. **Excel file corrupted**: Falls back to static menu
3. **Excel file empty**: Falls back to static menu
4. **Network error**: Falls back to static menu
5. **Unknown category**: Shows generic icon and description, doesn't break page

## Testing

### Unit Tests

Located in `src/utils/__tests__/excelMenuTransform.test.js`:

- Tests transformation of Excel data
- Tests category grouping
- Tests fallback logic
- Tests handling of unknown categories
- Tests edge cases (empty data, missing fields)

Run tests:
```bash
npm test src/utils/__tests__/excelMenuTransform.test.js
```

### Integration Testing

1. Update Excel file locally
2. Run dev server: `npm run dev`
3. Navigate to `/rocafe`
4. Verify:
   - Items display correctly
   - Prices match Excel
   - Categories group properly
   - Expand/collapse works
   - Unknown categories don't break

### Manual Testing Checklist

- [ ] Excel items load and display
- [ ] Categories match oc_page values
- [ ] Prices convert from cents to dollars correctly
- [ ] Items render with StandardizedItem component
- [ ] Expand/collapse functionality works
- [ ] Static menu fallback works (rename Excel file temporarily)
- [ ] Unknown category displays gracefully
- [ ] Stats section shows correct item count

## Performance Considerations

### Bundle Size

- Excel file adds ~29KB to bundle
- xlsx library adds to vendor bundle
- Consider lazy loading for large menus

### Load Time

- Excel file fetched on page load
- Consider caching strategy if file is large
- Service worker can cache Excel file

### Optimization Tips

1. Keep Excel file under 100KB
2. Remove unnecessary columns/sheets
3. Use xlsx utility for minimal imports
4. Consider server-side generation for very large menus

## Troubleshooting

### Excel file not loading

**Symptoms**: Static menu always displays

**Fixes**:
1. Check file location: Must be in `public/` directory
2. Check file name: Must match path in useExcelMenu call
3. Check console for errors
4. Verify xlsx library is installed: `npm list xlsx`

### Items not grouping correctly

**Symptoms**: All items in one category or wrong categories

**Fixes**:
1. Check oc_page values in Excel match EXCEL_CATEGORY_MAP keys exactly (case-sensitive)
2. Verify no extra spaces in oc_page values
3. Check Excel file structure matches expected format

### Prices displaying incorrectly

**Symptoms**: Prices too high/low or showing as NaN

**Fixes**:
1. Ensure cents field contains integers only (no decimals)
2. Check for non-numeric values in cents column
3. Verify Excel file format (not CSV with formatted currency)

### New category not appearing

**Symptoms**: Items missing from page

**Fixes**:
1. Add category to EXCEL_CATEGORY_MAP in excelMenuTransform.js
2. Or accept generic appearance for unknown category
3. Check oc_page spelling matches Excel exactly

## Future Enhancements

Possible improvements:

1. **Admin UI**: Web interface for Excel editing
2. **Real-time Updates**: Webhook on Excel changes
3. **Image Support**: Add image URLs in Excel
4. **Customizations**: Add customization options in Excel
5. **Multi-language**: Support multiple language columns
6. **Validation**: Server-side Excel validation before publishing
7. **Version History**: Track Excel file changes over time
8. **A/B Testing**: Support multiple menu versions

## References

- Hook: `src/hooks/useExcelMenu.js`
- Utilities: `src/utils/excelMenuTransform.js`
- Page: `src/pages/RoCafePage.jsx`
- Tests: `src/utils/__tests__/excelMenuTransform.test.js`
- Static Menu (fallback): `src/data/rocafe-menu.js`
- Component: `src/components/StandardizedItem.jsx`

## Related Documentation

- [RoCafé Menu Data Structure](../content/rocafe-menu.md)
- [StandardizedItem Component](../architecture/components.md#standardizeditem)
- [Quality System](../../QUALITY_SYSTEM.md)
- [Testing Guide](./testing.md)

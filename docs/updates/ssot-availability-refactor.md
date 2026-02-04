# SSOT Availability Refactor — Progress Log

**Date Started:** December 8, 2025

## Overview

This document tracks the migration to a single source of truth (SSOT) for service and menu item availability across Roma Mart 2.0. The goal is to ensure all availability logic is centralized, systematic, and ethos-compliant.

---

## Key Concepts

- **status:** Global business-level status for a service/menu item (`available`, `coming_soon`, `temporarily_closed`, `unavailable`).
- **availableAt:** Array of location IDs where the service is (or will be) available.
- **availability:** Time-based availability (e.g., `store_hours`, `24_7`, `custom`).
- **serviceOverrides:** (Optional) Per-location overrides for service status (e.g., status, availableAt, availability for a specific location).
- **menuOverrides:** (Optional) Per-location overrides for menu item status (e.g., status, availableAt, availability for a specific location).

- **featured:** Boolean field on services/menu items to indicate homepage/featured display. Replaces hardcoded ID lists.

---

## Migration Steps & Status

1. **Design SSOT data structure for services and menu items**
   - [x] Add `status` field to all services in `services.jsx`.
   - [x] Add `status` field to all menu items in `rocafe-menu.js`.
   - [x] Remove all legacy fields (`isAvailable`, `locationStatus`) from menu items for full normalization.
   - [x] Clarify roles of `status`, `availableAt`, and `availability` in code and docs.
   - [ ] Add `featured` boolean field to all featured services and menu items.
   - [ ] Remove hardcoded featured ID lists; update `ROCAFE_FEATURED` and `SERVICES_FEATURED` to filter by `featured`.
   - [ ] Document and standardize featured logic in code and docs.

2. **Refactor locations to reference services by ID only**
   - [ ] Ensure all locations use only service IDs in their `services` array.
   - [ ] Plan for optional `serviceOverrides` for per-location status.

3. **Update UI components to use centralized status**
   - [ ] Refactor all UI/service/menu components to use the new SSOT pattern and new featured logic.

4. **Remove legacy and duplicated status logic**
   - [ ] Clean up all code to remove legacy status fields, hardcoded featured ID lists, and checks.

5. **(Optional) Implement per-location service overrides**
   - [ ] Add and support `serviceOverrides` in locations if needed.

6. **Update documentation and code comments**
   - [ ] Document the new pattern and field meanings in architecture docs.

7. **Test and validate system-wide**
   - [ ] Test all pages/components for correct status display and logic.

---

## Notes & Decisions

- `status` is the global gate for a service/menu item. If not `available`, it is not shown anywhere, regardless of `availableAt`.
- `availableAt` is for location-specific display.
- `availability` is for time-based logic.
- Per-location overrides are only needed for exceptions.
- All legacy fields (`isAvailable`, `locationStatus`) have been removed from menu items. Only `status` is used for logic and display.

- Featured logic is now standardized: a `featured: true` field on each item, with all homepage/featured displays filtered by this field. No more hardcoded ID lists.

---

**Maintained by:** GitHub Copilot
**Last Updated:** December 8, 2025

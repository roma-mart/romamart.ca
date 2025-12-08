# Hooks

- Custom React hooks: service worker, browser features, location context, app badge.
- Keep side effects contained; return stable APIs.
- Document params/returns with JSDoc when non-trivial.

## `useAppBadge`

- **Purpose:** Infrastructure for the [App Icon Badging API](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Display_badge_on_app_icon)
- **Exports:** `{ setAppBadge, clearAppBadge, canBadge }`
- **Usage:**
	```js
	import { useAppBadge } from './useAppBadge';
	const { setAppBadge, clearAppBadge, canBadge } = useAppBadge();
	setAppBadge(3); // Sets badge to 3 if supported
	clearAppBadge(); // Clears badge if supported
	```
- **Status:** Infrastructure only (no-op on unsupported browsers)
# Analytics Event Schema

All events are dispatched via `trackEvent(name, params)` from `src/utils/analytics.js`, which pushes to `window.dataLayer` for GTM pickup.

## Events

| Event Name | Fired When | Params | GA4 Key Event |
|---|---|---|---|
| `page_view` | GTM auto-fires on every page | — | Yes |
| `order_cta_click` | Any Order Online / Order Now CTA is clicked | `cta_location`, `cta_text`, `item_price`? | Yes |
| `contact_form_submit` | Contact form submits successfully | `form_location` | Yes |
| `phone_click` | Any `tel:` link is clicked | `location_id`, `source` | Yes |
| `directions_click` | Any Google Maps / directions link is clicked | `location_id`, `source` | Yes |
| `visit_in_store_click` | Hero "Visit In Store" CTA clicked | `source` | No |
| `social_click` | Social media icon clicked in footer | `platform` | No |
| `pwa_install` | User accepts PWA install prompt | `engagement_score` | No |
| `pwa_install_dismissed` | User dismisses PWA install prompt | `engagement_score` | No |
| `web_vital` | Core Web Vital measured | `metric_name`, `metric_value`, `metric_rating`, `metric_id` | No |
| `error` | Unhandled JS error or ErrorBoundary catch | `error_message`, `error_source` | No |
| `share_click` | User shares page via Web Share API or clipboard fallback | `method`, `source` | No |
| `copy_click` | User copies text via CopyButton | `label`, `source` | No |
| `email_click` | Any `mailto:` link is clicked | `source` | No |

## Param Values

### `source` for `phone_click`
- `contact` — Contact page phone link
- `locations` — Locations page card phone link
- `mobile_sticky` — Floating MobileCallCTA button
- `home_contact` — Homepage contact section phone link

### `source` for `directions_click`
- `contact` — Contact page directions link
- `locations_address` — Locations page address "Get Directions"
- `locations_map_inline` — Locations page map panel "Open in Google Maps" text link (pre-load)
- `locations_map_button` — Locations page map panel "Open Map" button (non-preferred location)
- `locations_map_overlay` — Locations page "Open in Google Maps" button overlaid on loaded iframe
- `rocafe_page` — RoCafé page "Get Directions" CTA

### `method` for `share_click`
- `native` — Web Share API succeeded
- `clipboard` — Clipboard fallback (Web Share API unavailable or failed)

### `source` for `share_click`
- `homepage` — Hero section on Home page
- `about` — About page
- `accessibility` — Accessibility Statement page
- `contact` — Contact page
- `cookies` — Cookie Policy page
- `locations` — Locations page
- `privacy` — Privacy Policy page
- `return_policy` — Return Policy page
- `rocafe` — RoCafé Menu page
- `services` — Services page
- `terms` — Terms of Service page

### `source` for `email_click`
- `contact` — Contact page email link
- `accessibility` — Accessibility Statement page email link
- `cookies` — Cookie Policy page email link
- `privacy` — Privacy Policy page email link
- `terms` — Terms of Service page email link
- `return_policy` — Return Policy page email link
- `standardized_item` — Service item action button (mailto)

### `metric_name` for `web_vital`
CLS, INP, LCP, TTFB, FCP

## GTM Setup (container GTM-XXXXXXXX)

> **TODO (production cutover):** Replace `GTM-XXXXXXXX` above with the real GTM container ID before going live on the custom domain.

Each event above requires:
1. A **Custom Event trigger** matching `event equals <name>`
2. A **GA4 Event tag** with `eventName` set to the literal name
3. **dataLayer variable** for each param key used

See execution plan (Theme 1 GTM tasks) for step-by-step GTM configuration.

/**
 * Push an event to GTM's dataLayer.
 *
 * @param {string} name - Event name (e.g. 'phone_click'). Must not be overridden by params.
 * @param {Object} [params={}] - Additional event parameters. A `params.event` key is ignored.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;
  // Destructure to prevent a caller-supplied `params.event` from silently overwriting `name`.
  const { event: _ignored, ...safeParams } = params;
  if (import.meta.env.DEV && _ignored !== undefined) {
    console.warn(`[trackEvent] 'event' key in params is ignored; use the 'name' argument instead.`);
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...safeParams });
}

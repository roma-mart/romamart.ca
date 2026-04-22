import { describe, it, expect } from 'vitest';
import { SERVICES_PLAIN } from '../services-plain.js';
import { SERVICES } from '../services.jsx';

describe('services data parity', () => {
  it('SERVICES and SERVICES_PLAIN have the same count', () => {
    expect(SERVICES.length).toBe(SERVICES_PLAIN.length);
  });

  it('SERVICES IDs match SERVICES_PLAIN IDs in the same order', () => {
    const plainIds = SERVICES_PLAIN.map((s) => s.id);
    const uiIds = SERVICES.map((s) => s.id);
    expect(uiIds).toEqual(plainIds);
  });

  it('every SERVICES entry has an icon resolved from its iconKey', () => {
    for (const svc of SERVICES) {
      expect(svc.iconKey, `${svc.id} missing iconKey`).toBeTruthy();
      expect(svc.icon, `${svc.id} iconKey "${svc.iconKey}" has no ICON_MAP entry`).not.toBeNull();
    }
  });

  it('every SERVICES_PLAIN entry has an iconKey', () => {
    for (const svc of SERVICES_PLAIN) {
      expect(svc.iconKey, `${svc.id} missing iconKey in SERVICES_PLAIN`).toBeTruthy();
    }
  });

  it('SERVICES_PLAIN contains no JSX (icon field must be absent)', () => {
    for (const svc of SERVICES_PLAIN) {
      expect(svc).not.toHaveProperty('icon');
    }
  });
});

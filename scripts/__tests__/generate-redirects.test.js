import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

import fs from 'fs';
import { writeRedirects, REDIRECTS } from '../generate-redirects.js';

describe('writeRedirects', () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    vi.mocked(fs.readFileSync).mockReturnValue('');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('writes a stub for every redirect entry when no output files exist', () => {
    writeRedirects('/dist');
    expect(fs.writeFileSync).toHaveBeenCalledTimes(REDIRECTS.length);
  });

  it('skips an entry when the output file is a real prerendered page', () => {
    // All paths "exist" and contain real page content (no noindex,follow)
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      '<!doctype html><html><head><title>Real Page</title></head><body></body></html>'
    );

    writeRedirects('/dist');

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('overwrites an existing stub (file exists with noindex,follow)', () => {
    const existingStub = '<meta name="robots" content="noindex,follow">';
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(existingStub);

    writeRedirects('/dist');

    // All existing files are stubs → all get rewritten
    expect(fs.writeFileSync).toHaveBeenCalledTimes(REDIRECTS.length);
  });

  it('generated stub contains required noindex meta and meta refresh', () => {
    writeRedirects('/dist');

    const calls = vi.mocked(fs.writeFileSync).mock.calls;
    expect(calls.length).toBeGreaterThan(0);

    for (const [, content] of calls) {
      expect(content).toContain('<meta name="robots" content="noindex,follow">');
      expect(content).toMatch(/content="0; url=/);
    }
  });

  it('stub meta refresh target matches the redirect "to" path', () => {
    writeRedirects('/dist');

    const calls = vi.mocked(fs.writeFileSync).mock.calls;
    expect(calls.length).toBe(REDIRECTS.length);

    calls.forEach(([, content], index) => {
      const { to } = REDIRECTS[index];
      expect(content).toContain(`url=${to}`);
    });
  });
});

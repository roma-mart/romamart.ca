/**
 * IndexNow Notification Script
 *
 * Notifies Bing/Yandex of updated pages after deploy for fast indexing.
 * Called as a post-deploy CI step. Non-blocking: deploy succeeds even if
 * IndexNow API is unavailable.
 *
 * Routes derived from NAVIGATION_LINKS (SSOT) and base URL from COMPANY_DATA.
 * Protocol: https://www.indexnow.org/documentation
 */

import COMPANY_DATA from '../src/config/company_data.js';
import { NAVIGATION_LINKS } from '../src/config/navigation.js';

const INDEXNOW_KEY = '9d57194ca7f27ee205e1cf0f37f821f9';
const BASE_URL = COMPANY_DATA.baseUrl;
const HOST = new URL(BASE_URL).hostname;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const urls = NAVIGATION_LINKS.map((link) => (link.href === '/' ? `${BASE_URL}/` : `${BASE_URL}${link.href}`));

async function notifyIndexNow() {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  console.log(`IndexNow: notifying ${urls.length} URLs...`);

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  console.log(`IndexNow: ${response.status} ${response.statusText}`);

  if (response.status === 200 || response.status === 202) {
    console.log('IndexNow: URLs submitted successfully');
  } else if (response.status === 422) {
    console.warn('IndexNow: 422 — URL does not belong to host or key mismatch');
  } else if (response.status === 403) {
    console.warn('IndexNow: 403 — invalid key');
  } else {
    console.warn(`IndexNow: unexpected status ${response.status}`);
  }
}

notifyIndexNow().catch((err) => {
  console.warn('IndexNow notification failed (non-blocking):', err.message);
});

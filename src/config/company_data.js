// src/config/company_data.js
// Centralized company data for Roma Mart 2.0
// Single source of truth for brand info, social links, order platform, etc.

import { getOrderingUrl } from './ordering';

const COMPANY_DATA = {
  legalName: 'Roma Mart Corp.',
  dba: 'Roma Mart Convenience',
  gstNumber: '780971768',
  onlineStoreUrl: getOrderingUrl(),
  socialLinks: {
    facebook: 'https://www.facebook.com/romamartca',
    instagram: 'https://www.instagram.com/romamartca/',
    tiktok: 'https://www.tiktok.com/@romamartca/',
    snapchat: 'https://www.snapchat.com/@romamartca/',
    x: 'https://www.x.com/romamartca/'
  },
  contact: {
    phone: '+1-519-555-1234',
    email: 'info@romamart.ca',
    web3FormsAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_KEY'
  }
  // Add other brand data as needed
};

export default COMPANY_DATA;

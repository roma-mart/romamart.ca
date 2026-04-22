/**
 * Services UI Layer
 *
 * Derives all service data from services-plain.js (the SSOT) and adds Lucide icon components.
 * DO NOT add or edit service data here — edit src/data/services-plain.js instead.
 *
 * Adding a new service:
 *   1. Add the entry to services-plain.js with an `iconKey`.
 *   2. If the iconKey is new, add it to ICON_MAP below.
 *   That is all. This file needs no other changes.
 */

import {
  AlertCircle,
  Banknote,
  Bitcoin,
  Candy,
  Coffee,
  CreditCard,
  Globe,
  Package,
  Printer,
  Send,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  Ticket,
  UtensilsCrossed,
} from 'lucide-react';
import { SERVICES_PLAIN } from './services-plain.js';

// Maps iconKey strings (stored in services-plain.js) to rendered Lucide elements.
// Key names use snake_case to match the Lucide component name in lowercase.
const ICON_MAP = {
  alert_circle: <AlertCircle size={20} />,
  banknote: <Banknote size={20} />,
  bitcoin: <Bitcoin size={20} />,
  candy: <Candy size={20} />,
  coffee: <Coffee size={20} />,
  credit_card: <CreditCard size={20} />,
  globe: <Globe size={20} />,
  package: <Package size={20} />,
  printer: <Printer size={20} />,
  send: <Send size={20} />,
  shopping_bag: <ShoppingBag size={20} />,
  shopping_basket: <ShoppingBasket size={20} />,
  sparkles: <Sparkles size={20} />,
  ticket: <Ticket size={20} />,
  utensils_crossed: <UtensilsCrossed size={20} />,
};

// Service categories — convenience constants that match the category strings in services-plain.js.
export const SERVICE_CATEGORIES = {
  FINANCIAL: 'financial_services',
  FOOD: 'food',
  RETAIL: 'retail',
  CONVENIENCE: 'convenience',
  AGE_RESTRICTED: 'age_restricted',
};

// UI-ready services: plain data + resolved icon element.
export const SERVICES = SERVICES_PLAIN.map((svc) => ({
  ...svc,
  icon: ICON_MAP[svc.iconKey] ?? null,
}));

// SERVICES_PLAIN is intentionally NOT re-exported from here.
// Import it directly from './services-plain.js' to keep the dependency explicit
// and avoid triggering react-refresh/only-export-components on re-exports.

// === HELPER FUNCTIONS ===

export const getServiceById = (id) => SERVICES.find((s) => s.id === id) ?? null;

export const getServicesByCategory = (category) => SERVICES.filter((s) => s.category === category);

export const getServicesAtLocation = (locationId) => SERVICES.filter((s) => s.availableAt.includes(locationId));

export const getAgeRestrictedServices = () => SERVICES.filter((s) => s.ageRestricted);

export const getComingSoonServices = () => SERVICES.filter((s) => s.status === 'coming_soon');

export const getActiveServices = () => SERVICES.filter((s) => s.status !== 'coming_soon' && s.availableAt.length > 0);

export const isServiceAvailableAt = (serviceId, locationId) => {
  const service = getServiceById(serviceId);
  return service ? service.availableAt.includes(locationId) : false;
};

export const getServiceAvailabilityText = (service, locationStatus) => {
  if (service.status === 'coming_soon') return 'Coming Soon';
  if (service.availability === '24_7') return 'Available 24/7';
  if (service.availability === 'store_hours') {
    return locationStatus === 'open' ? 'Available Now' : 'Available During Store Hours';
  }
  return 'Available';
};

export const SERVICES_FEATURED = SERVICES.filter((service) => service.featured);

export default {
  SERVICES,
  SERVICES_FEATURED,
  SERVICE_CATEGORIES,
  getServiceById,
  getServicesByCategory,
  getServicesAtLocation,
  getAgeRestrictedServices,
  getComingSoonServices,
  getActiveServices,
  isServiceAvailableAt,
  getServiceAvailabilityText,
};

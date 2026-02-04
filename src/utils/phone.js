/**
 * Normalize phone number to E.164 format for tel: URI (RFC3966 compliant)
 * Removes spaces, parentheses, and dashes to create a clean tel: link format
 * @param {string} phone - Phone number in any format (e.g., "+1 (382) 342-2000")
 * @returns {string} Normalized phone in E.164 format (e.g., "+13823422000")
 */
export function normalizePhoneForTel(phone) {
  if (!phone) return '';
  return phone.replace(/[\s()-]/g, '');
}

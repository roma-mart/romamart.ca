/**
 * Mock Compliance API
 *
 * Simulates backend endpoints for independent frontend development.
 * Enforces RBAC, validates payloads, and simulates rate limiting
 * so the mock serves as an executable specification for the backend team.
 *
 * Activated automatically when VITE_API_URL is absent.
 *
 * @module services/mockApi
 */

// --- Test users ---
const TEST_USERS = [
  {
    id: 'emp-001',
    phone: '5191234567',
    pin: '1234',
    name: 'Test Staff',
    role: 'staff',
    locationId: 'loc-wellington-001',
  },
  {
    id: 'emp-002',
    phone: '5199876543',
    pin: '0000',
    name: 'Test Manager',
    role: 'manager',
    locationId: 'loc-wellington-001',
  },
];

// --- In-memory state ---
let sessions = {}; // sessionId -> { userId, createdAt }
let loginAttempts = {}; // phone -> { count, lockedUntil }

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// --- Helpers ---

function delay(min = 200, max = 500) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateSessionId() {
  return 'mock-session-' + crypto.randomUUID();
}

function generateAccessToken(user) {
  // Mock JWT-like token (not real JWT, just for mock purposes)
  return btoa(
    JSON.stringify({ sub: user.id, role: user.role, locationId: user.locationId, exp: Date.now() + 15 * 60 * 1000 })
  );
}

function parseAccessToken(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

function errorResponse(code, message, extra = {}) {
  return {
    success: false,
    error: { code, message, ...extra },
  };
}

function successResponse(data) {
  return { success: true, data };
}

// --- Current mock session (simulates httpOnly cookie) ---
let currentMockSession = null; // { sessionId, userId }

function getUserFromSession() {
  if (!currentMockSession) return null;
  const session = sessions[currentMockSession.sessionId];
  if (!session) return null;
  return TEST_USERS.find((u) => u.id === session.userId) || null;
}

function getUserFromToken(accessToken) {
  const parsed = parseAccessToken(accessToken);
  if (!parsed) return null;
  if (parsed.exp && parsed.exp < Date.now()) return null; // expired
  return TEST_USERS.find((u) => u.id === parsed.sub) || null;
}

// --- Rate limiting ---

function checkRateLimit(phone) {
  const attempts = loginAttempts[phone];
  if (!attempts) return { limited: false };

  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const retryAfter = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
    return { limited: true, retryAfter };
  }

  // Reset if lockout expired
  if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
    loginAttempts[phone] = { count: 0, lockedUntil: null };
    return { limited: false };
  }

  return { limited: false };
}

function recordLoginFailure(phone) {
  if (!loginAttempts[phone]) {
    loginAttempts[phone] = { count: 0, lockedUntil: null };
  }
  loginAttempts[phone].count++;
  if (loginAttempts[phone].count >= LOCKOUT_THRESHOLD) {
    loginAttempts[phone].lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
}

function recordLoginSuccess(phone) {
  loginAttempts[phone] = { count: 0, lockedUntil: null };
}

// --- RBAC check ---

const MANAGER_ONLY_ENDPOINTS = [
  { method: 'PATCH', pattern: /^\/alerts\/[^/]+\/resolve$/ },
  { method: 'POST', pattern: /^\/signoff$/ },
  { method: 'POST', pattern: /^\/employees$/ },
  { method: 'PATCH', pattern: /^\/employees\/[^/]+$/ },
];

function requiresManager(method, path) {
  return MANAGER_ONLY_ENDPOINTS.some((ep) => ep.method === method && ep.pattern.test(path));
}

// --- Endpoint handlers ---

async function handleLogin(body) {
  const { phone, pin } = body || {};

  // Validate payload
  if (!phone || !/^\d{10}$/.test(phone)) {
    return errorResponse('VALIDATION_ERROR', 'Phone must be 10 digits', { field: 'phone' });
  }
  if (!pin || !/^\d{4}$/.test(pin)) {
    return errorResponse('VALIDATION_ERROR', 'PIN must be 4 digits', { field: 'pin' });
  }

  // Check rate limit (HSC-05)
  const rateCheck = checkRateLimit(phone);
  if (rateCheck.limited) {
    return errorResponse('RATE_LIMITED', 'Too many login attempts. Please try again later.', {
      retryAfter: rateCheck.retryAfter,
    });
  }

  // Find user
  const user = TEST_USERS.find((u) => u.phone === phone && u.pin === pin);
  if (!user) {
    recordLoginFailure(phone);
    return errorResponse('INVALID_CREDENTIALS', 'Invalid phone or PIN');
  }

  recordLoginSuccess(phone);

  // Create session (simulates httpOnly cookie set by backend)
  const sessionId = generateSessionId();
  sessions[sessionId] = { userId: user.id, createdAt: Date.now() };
  currentMockSession = { sessionId, userId: user.id };

  const accessToken = generateAccessToken(user);

  return successResponse({
    accessToken,
    employee: {
      id: user.id,
      name: user.name,
      role: user.role,
      locationId: user.locationId,
    },
  });
}

async function handleMe() {
  const user = getUserFromSession();
  if (!user) {
    return errorResponse('SESSION_EXPIRED', 'No active session');
  }

  const accessToken = generateAccessToken(user);
  return successResponse({
    accessToken,
    employee: {
      id: user.id,
      name: user.name,
      role: user.role,
      locationId: user.locationId,
    },
  });
}

async function handleLogout() {
  if (currentMockSession) {
    delete sessions[currentMockSession.sessionId];
    currentMockSession = null;
  }
  return { success: true };
}

// --- Sprint 1+ stubs ---

async function handleLogEntry(body, _user) {
  if (!body?.logType) {
    return errorResponse('VALIDATION_ERROR', 'logType is required', { field: 'logType' });
  }
  if (!body?.idempotencyKey) {
    return errorResponse('VALIDATION_ERROR', 'idempotencyKey is required', { field: 'idempotencyKey' });
  }
  return {
    success: true,
    data: {
      id: 'log-' + crypto.randomUUID().substring(0, 8),
      serverReceivedAt: new Date().toISOString(),
    },
  };
}

async function handleGetLogs() {
  return successResponse({ logs: [] });
}

async function handleGetAssets() {
  return successResponse({
    assets: [
      { id: 'asset-001', name: 'Walk-in Cooler #1', type: 'fridge', threshold: 4 },
      { id: 'asset-002', name: 'Reach-in Freezer #1', type: 'freezer', threshold: -18 },
      { id: 'asset-003', name: 'Display Fridge #1', type: 'fridge', threshold: 4 },
    ],
  });
}

async function handleGetStats() {
  return successResponse({
    tempsLoggedToday: 0,
    cleaningComplete: false,
    activeAlerts: 0,
    compliancePercent: 0,
  });
}

// --- Main request router ---

/**
 * Handle a mock API request.
 *
 * @param {string} path - API path (e.g., '/auth/login')
 * @param {Object} options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body
 * @param {string} [options.accessToken] - Current access token
 * @returns {Promise<{success: boolean, data?: *, error?: {code: string, message: string}}>}
 */
export async function handleRequest(path, options = {}) {
  const { method = 'GET', body, accessToken } = options;

  // Simulate network latency
  await delay();

  // Normalize path: strip /api/compliance prefix if present
  const normalizedPath = path.replace(/^\/api\/compliance/, '');

  // Auth endpoints (no token required)
  if (normalizedPath === '/auth/login' && method === 'POST') {
    return handleLogin(body);
  }
  if (normalizedPath === '/auth/me' && method === 'GET') {
    return handleMe();
  }
  if (normalizedPath === '/auth/logout' && method === 'POST') {
    return handleLogout();
  }

  // All other endpoints require authentication
  const user = getUserFromToken(accessToken);
  if (!user) {
    return errorResponse('SESSION_EXPIRED', 'Authentication required');
  }

  // RBAC check (HSC-04)
  if (requiresManager(method, normalizedPath) && user.role !== 'manager') {
    return errorResponse('FORBIDDEN', 'Manager role required');
  }

  // Route to handler
  if (normalizedPath === '/log-entry' && method === 'POST') {
    return handleLogEntry(body, user);
  }
  if (normalizedPath === '/logs' && method === 'GET') {
    return handleGetLogs();
  }
  if (normalizedPath === '/assets' && method === 'GET') {
    return handleGetAssets();
  }
  if (normalizedPath === '/stats' && method === 'GET') {
    return handleGetStats();
  }

  return errorResponse('NOT_FOUND', `No mock handler for ${method} ${normalizedPath}`);
}

/**
 * Reset all mock state (for testing).
 */
export function resetMockState() {
  sessions = {};
  loginAttempts = {};
  currentMockSession = null;
}

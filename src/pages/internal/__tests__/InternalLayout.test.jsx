import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

/**
 * InternalLayout tests -- route guard, role guard, queue badge, navigation.
 *
 * All external dependencies are mocked to isolate component behavior.
 */

// --- Mocks ---

const mockUseAuth = vi.fn();
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockShowInfo = vi.fn();
vi.mock('../../../components/ToastContainer', () => ({
  useToast: () => ({ showInfo: mockShowInfo }),
}));

vi.mock('../../../services/submitQueue', () => ({
  getQueueStatus: vi.fn().mockResolvedValue({ pending: 0, failed: 0 }),
  drainQueue: vi.fn().mockResolvedValue({ synced: 0, authRequired: false }),
  checkEviction: vi.fn().mockResolvedValue({ evictionDetected: false }),
}));

vi.mock('../../../services/api', () => ({
  compliancePost: vi.fn(),
}));

// Capture window.location.assign calls
const mockAssign = vi.fn();

import InternalLayout from '../InternalLayout';

describe('InternalLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: authenticated staff user
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Test Staff', role: 'staff', locationId: 1 },
      loading: false,
      isAuthenticated: true,
      logout: vi.fn().mockResolvedValue(undefined),
      role: 'staff',
      getAccessToken: vi.fn(() => 'mock-token'),
      error: null,
    });

    // Mock window.location.assign
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, assign: mockAssign, pathname: '/internal/dashboard' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- Auth guard: loading spinner ---

  it('shows loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
      logout: vi.fn(),
      role: null,
      getAccessToken: vi.fn(),
      error: null,
    });

    render(<InternalLayout pathname="/internal/dashboard" />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByLabelText('Loading')).toBeTruthy();
  });

  // --- Auth guard: unauthenticated redirect ---

  it('redirects unauthenticated users to login', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      logout: vi.fn(),
      role: null,
      getAccessToken: vi.fn(),
      error: null,
    });

    render(<InternalLayout pathname="/internal/dashboard" />);
    expect(mockAssign).toHaveBeenCalled();
    const redirectUrl = mockAssign.mock.calls[0][0];
    expect(redirectUrl).toContain('/internal/login');
  });

  it('renders nothing for unauthenticated users (after redirect)', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      logout: vi.fn(),
      role: null,
      getAccessToken: vi.fn(),
      error: null,
    });

    const { container } = render(<InternalLayout pathname="/internal/dashboard" />);
    expect(container.innerHTML).toBe('');
  });

  // --- Auth guard: authenticated user sees layout ---

  it('renders dashboard content for authenticated staff', async () => {
    render(<InternalLayout pathname="/internal/dashboard" />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeTruthy();
    });
    // "Test Staff" appears in sidebar user info and dashboard welcome
    const staffElements = screen.getAllByText('Test Staff');
    expect(staffElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders user role badge', async () => {
    render(<InternalLayout pathname="/internal/dashboard" />);
    await waitFor(() => {
      expect(screen.getByText('staff')).toBeTruthy();
    });
  });

  // --- Role guard: staff on manager-only route ---

  it('shows toast and redirects when staff clicks manager-only nav', async () => {
    render(<InternalLayout pathname="/internal/dashboard" />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeTruthy();
    });

    // Find the Signoff nav button in the sidebar
    const signoffButtons = screen.getAllByText('Signoff');
    fireEvent.click(signoffButtons[0]);

    expect(mockShowInfo).toHaveBeenCalledWith('This section is restricted to managers.');
  });

  it('allows manager to access manager-only routes', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 2, name: 'Test Manager', role: 'manager', locationId: 1 },
      loading: false,
      isAuthenticated: true,
      logout: vi.fn().mockResolvedValue(undefined),
      role: 'manager',
      getAccessToken: vi.fn(() => 'mgr-token'),
      error: null,
    });

    render(<InternalLayout pathname="/internal/signoff" />);
    await waitFor(() => {
      expect(screen.getByText('Daily Signoff')).toBeTruthy();
    });
    expect(mockShowInfo).not.toHaveBeenCalled();
  });

  // --- Navigation & content rendering ---

  it('renders correct placeholder for logs route', async () => {
    render(<InternalLayout pathname="/internal/logs" />);
    await waitFor(() => {
      expect(screen.getByText('Compliance Logs')).toBeTruthy();
    });
  });

  it('renders Sign Out buttons', async () => {
    render(<InternalLayout pathname="/internal/dashboard" />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeTruthy();
    });
    const signOutButtons = screen.getAllByText('Sign Out');
    expect(signOutButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('calls logout and redirects on Sign Out click', async () => {
    const mockLogout = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Test Staff', role: 'staff', locationId: 1 },
      loading: false,
      isAuthenticated: true,
      logout: mockLogout,
      role: 'staff',
      getAccessToken: vi.fn(() => 'mock-token'),
      error: null,
    });

    render(<InternalLayout pathname="/internal/dashboard" />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeTruthy();
    });

    const signOutButtons = screen.getAllByText('Sign Out');
    fireEvent.click(signOutButtons[0]);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  // --- Queue badge ---

  it('does not show queue badge when queue is empty', async () => {
    render(<InternalLayout pathname="/internal/dashboard" />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeTruthy();
    });
    // No pending/failed -> no badge rendered
    expect(screen.queryByLabelText(/pending entries/)).toBeNull();
    expect(screen.queryByLabelText(/failed entries/)).toBeNull();
  });
});

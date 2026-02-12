import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

/**
 * LoginPage tests -- form validation, login flow, lockout, redirect.
 *
 * All external dependencies are mocked to isolate component behavior.
 */

// --- Mocks ---

const mockLogin = vi.fn();
const mockUseAuth = vi.fn();
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock internalRoutes -- returns path as-is for testing
vi.mock('../../../utils/internalRoutes', () => ({
  getInternalUrl: (path) => path,
}));

const mockAssign = vi.fn();

import LoginPage from '../LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: unauthenticated, not loading
    mockLogin.mockResolvedValue({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
    });
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      isAuthenticated: false,
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, assign: mockAssign, pathname: '/internal/login' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- Rendering ---

  it('renders phone and PIN inputs', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/phone number/i)).toBeTruthy();
    expect(screen.getByLabelText(/4-digit pin/i)).toBeTruthy();
  });

  it('renders the sign in button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  });

  it('renders page heading', () => {
    render(<LoginPage />);
    expect(screen.getByText('Roma Mart')).toBeTruthy();
    expect(screen.getByText('Staff Compliance Portal')).toBeTruthy();
  });

  // --- Loading state ---

  it('shows loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: true,
      isAuthenticated: false,
    });

    render(<LoginPage />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Restoring session...')).toBeTruthy();
  });

  // --- Authenticated redirect ---

  it('redirects to dashboard when already authenticated', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      isAuthenticated: true,
    });

    render(<LoginPage />);
    expect(mockAssign).toHaveBeenCalledWith('/internal/dashboard');
  });

  // --- Client-side validation ---

  it('disables submit when phone is less than 10 digits', () => {
    render(<LoginPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const pinInput = screen.getByLabelText(/4-digit pin/i);

    fireEvent.change(phoneInput, { target: { value: '51912' } });
    fireEvent.change(pinInput, { target: { value: '1234' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton.disabled).toBe(true);
  });

  it('disables submit when PIN is less than 4 digits', () => {
    render(<LoginPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const pinInput = screen.getByLabelText(/4-digit pin/i);

    fireEvent.change(phoneInput, { target: { value: '5191234567' } });
    fireEvent.change(pinInput, { target: { value: '12' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton.disabled).toBe(true);
  });

  it('enables submit button when phone and PIN are correct length', () => {
    render(<LoginPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const pinInput = screen.getByLabelText(/4-digit pin/i);

    fireEvent.change(phoneInput, { target: { value: '5191234567' } });
    fireEvent.change(pinInput, { target: { value: '1234' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton.disabled).toBe(false);
  });

  it('strips non-digit characters from phone input', () => {
    render(<LoginPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '519-123-4567' } });

    expect(phoneInput.value).toBe('5191234567');
  });

  it('strips non-digit characters from PIN input', () => {
    render(<LoginPage />);

    const pinInput = screen.getByLabelText(/4-digit pin/i);
    fireEvent.change(pinInput, { target: { value: '12ab' } });

    expect(pinInput.value).toBe('12');
  });

  // --- Successful login ---

  it('redirects to dashboard on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });

    render(<LoginPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const pinInput = screen.getByLabelText(/4-digit pin/i);

    fireEvent.change(phoneInput, { target: { value: '5191234567' } });
    fireEvent.change(pinInput, { target: { value: '1234' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('5191234567', '1234');
    });

    await waitFor(() => {
      expect(mockAssign).toHaveBeenCalledWith('/internal/dashboard');
    });
  });

  // --- Failed login ---

  it('displays error message on failed login', async () => {
    mockLogin.mockResolvedValue({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid phone or PIN' },
    });

    render(<LoginPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const pinInput = screen.getByLabelText(/4-digit pin/i);

    fireEvent.change(phoneInput, { target: { value: '5191234567' } });
    fireEvent.change(pinInput, { target: { value: '9999' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText('Invalid phone or PIN')).toBeTruthy();
    });
  });

  // --- Rate limiting / lockout ---

  it('shows lockout countdown when rate limited', async () => {
    vi.useFakeTimers();

    mockLogin.mockResolvedValue({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many attempts', retryAfter: 60 },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '5191234567' } });
    fireEvent.change(screen.getByLabelText(/4-digit pin/i), { target: { value: '9999' } });

    // Button should be enabled before submit
    expect(screen.getByRole('button', { name: /sign in/i }).disabled).toBe(false);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Flush the login promise microtask
    await vi.advanceTimersByTimeAsync(0);

    // The lockout display should be visible (text appears in both error alert and lockout display)
    expect(screen.getAllByText('Too many attempts').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Try again in/)).toBeTruthy();

    // Submit button should be disabled during lockout
    expect(screen.getByRole('button', { name: /sign in/i }).disabled).toBe(true);

    vi.useRealTimers();
  });

  // --- Accessibility ---

  it('has accessible form fields with labels and hints', () => {
    render(<LoginPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    expect(phoneInput.getAttribute('aria-describedby')).toBe('phone-hint');
    expect(phoneInput.getAttribute('type')).toBe('tel');
    expect(phoneInput.getAttribute('inputmode')).toBe('numeric');

    const pinInput = screen.getByLabelText(/4-digit pin/i);
    expect(pinInput.getAttribute('aria-describedby')).toBe('pin-hint');
    expect(pinInput.getAttribute('type')).toBe('password');
    expect(pinInput.getAttribute('inputmode')).toBe('numeric');
  });

  it('has aria-live region for error announcements', () => {
    render(<LoginPage />);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExcelMenu } from '../useExcelMenu';

// Test component that uses the hook
describe('useExcelMenu', () => {
  let mockFetch;
  let testApiResponse;

  beforeEach(() => {
    // Create a test API response matching the expected structure
    testApiResponse = {
      menu: [
        { Name: 'Espresso', oc_page: 'RoCafe Hot Coffee', cents: 350, size: '12oz', Upc: '1001' },
        { Name: 'Green Tea', oc_page: 'RoCafe Tea', cents: 275, size: '16oz', Upc: '1002' },
        { Name: 'Latte', oc_page: 'RoCafe Hot Coffee', cents: 425, size: '16oz', Upc: '1003' }
      ]
    };

    // Mock fetch to return our test API data
    mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(testApiResponse),
      })
    );
    global.fetch = mockFetch;
  });

  it('should successfully fetch and parse API menu data', async () => {
    const { result } = renderHook(() => useExcelMenu('https://romamart.netlify.app/api/public-menu'));

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.error).toBe('');

    // Wait for the hook to finish loading
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    // After loading, menuItems should be populated
    expect(result.current.menuItems).not.toEqual([]);
    expect(result.current.menuItems.length).toBeGreaterThan(0);
    expect(result.current.error).toBe('');

    // Verify the structure of menu items (API data structure)
    const firstItem = result.current.menuItems[0];
    expect(firstItem).toHaveProperty('Name');
    expect(firstItem).toHaveProperty('oc_page');
    expect(firstItem).toHaveProperty('cents');
    
    // Verify specific test data
    expect(result.current.menuItems).toHaveLength(3);
    expect(result.current.menuItems[0].Name).toBe('Espresso');
    expect(result.current.menuItems[1].Name).toBe('Green Tea');
    expect(result.current.menuItems[2].Name).toBe('Latte');
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock fetch to return an error
    const errorMessage = 'Failed to fetch menu data';
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    const { result } = renderHook(() => useExcelMenu('https://romamart.netlify.app/api/public-menu'));

    // Wait for error to be set
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Should have error and empty menu items
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should handle network errors', async () => {
    // Mock fetch to throw a network error
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useExcelMenu('https://romamart.netlify.app/api/public-menu'));

    // Wait for error to be set
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Should have error and empty menu items
    expect(result.current.error).toBe('Network error');
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should cleanup on unmount to prevent memory leaks', async () => {
    const { result, unmount } = renderHook(() => useExcelMenu('https://romamart.netlify.app/api/public-menu'));

    // Unmount immediately to test the cleanup function
    unmount();

    // Give a moment for any pending operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should not throw or cause issues
    expect(result.current.loading).toBe(true); // State at unmount time
  });

  it('should refetch when API URL changes', async () => {
    const { result, rerender } = renderHook(
      ({ apiUrl }) => useExcelMenu(apiUrl),
      { initialProps: { apiUrl: 'https://api.example.com/menu1' } }
    );

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const firstFetchCount = mockFetch.mock.calls.length;
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/menu1');

    // Change API URL
    rerender({ apiUrl: 'https://api.example.com/menu2' });

    // Wait for second fetch
    await waitFor(() => {
      expect(mockFetch.mock.calls.length).toBeGreaterThan(firstFetchCount);
    });

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/menu2');
  });

  it('should handle API responses with empty menu array', async () => {
    // Mock fetch to return empty menu
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ menu: [] }),
      })
    );

    const { result } = renderHook(() => useExcelMenu('https://romamart.netlify.app/api/public-menu'));

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Should have empty menuItems but no error
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('should handle API responses with missing menu property', async () => {
    // Mock fetch to return response without menu property
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { result } = renderHook(() => useExcelMenu('https://romamart.netlify.app/api/public-menu'));

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Should default to empty array when menu property is missing
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
  });
});

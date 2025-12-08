import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExcelMenu } from '../useExcelMenu';
import * as XLSX from 'xlsx';

// Test component that uses the hook
describe('useExcelMenu', () => {
  let mockFetch;
  let testExcelBuffer;

  beforeEach(() => {
    // Create a minimal Excel file in memory for testing
    const testData = [
      { name: 'Espresso', category: 'Hot Coffee', price: 3.50, description: 'Strong coffee' },
      { name: 'Green Tea', category: 'Tea', price: 2.75, description: 'Refreshing tea' },
      { name: 'Latte', category: 'Hot Coffee', price: 4.25, description: 'Creamy coffee' }
    ];
    
    const ws = XLSX.utils.json_to_sheet(testData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Menu');
    testExcelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

    // Mock fetch to return our test Excel data
    mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(testExcelBuffer),
      })
    );
    global.fetch = mockFetch;
  });

  it('should successfully fetch and parse Excel menu data', async () => {
    const { result } = renderHook(() => useExcelMenu('/test-menu.xlsx'));

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

    // Verify the structure of menu items
    const firstItem = result.current.menuItems[0];
    expect(firstItem).toHaveProperty('name');
    expect(firstItem).toHaveProperty('category');
    expect(firstItem).toHaveProperty('price');
    
    // Verify specific test data
    expect(result.current.menuItems).toHaveLength(3);
    expect(result.current.menuItems[0].name).toBe('Espresso');
    expect(result.current.menuItems[1].name).toBe('Green Tea');
    expect(result.current.menuItems[2].name).toBe('Latte');
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock fetch to return an error
    const errorMessage = 'Failed to fetch Excel file';
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    const { result } = renderHook(() => useExcelMenu('/nonexistent.xlsx'));

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

    const { result } = renderHook(() => useExcelMenu('/test-menu.xlsx'));

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
    const { result, unmount } = renderHook(() => useExcelMenu('/test-menu.xlsx'));

    // Unmount immediately to test the cleanup function
    unmount();

    // Give a moment for any pending operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should not throw or cause issues
    expect(result.current.loading).toBe(true); // State at unmount time
  });

  it('should refetch when path changes', async () => {
    const { result, rerender } = renderHook(
      ({ path }) => useExcelMenu(path),
      { initialProps: { path: '/menu1.xlsx' } }
    );

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const firstFetchCount = mockFetch.mock.calls.length;
    expect(mockFetch).toHaveBeenCalledWith('/menu1.xlsx');

    // Change path
    rerender({ path: '/menu2.xlsx' });

    // Wait for second fetch
    await waitFor(() => {
      expect(mockFetch.mock.calls.length).toBeGreaterThan(firstFetchCount);
    });

    expect(mockFetch).toHaveBeenCalledWith('/menu2.xlsx');
  });
});

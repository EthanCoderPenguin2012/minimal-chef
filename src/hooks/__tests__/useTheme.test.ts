import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  test('should initialize with default theme (light mode)', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDarkMode).toBe(false);
  });

  test('should load saved theme from localStorage', () => {
    localStorage.getItem.mockReturnValue('true');
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDarkMode).toBe(true);
  });

  test('should toggle theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDarkMode).toBe(false);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
  });
});
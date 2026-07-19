import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('useLocalStorage_returnsInitialValue_whenStorageIsEmpty', () => {
    // Arrange / Act
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    // Assert
    expect(result.current[0]).toBe('default');
  });

  test('useLocalStorage_persistsValueToStorage_whenSetterCalled', () => {
    // Arrange
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    // Act
    act(() => {
      result.current[1]('updated');
    });

    // Assert
    expect(result.current[0]).toBe('updated');
    const stored = window.localStorage.getItem('test-key');
    expect(stored).not.toBeNull();
    expect(stored).toEqual(expect.stringContaining('updated'));
  });

  test('useLocalStorage_readsExistingPersistedValue_whenStorageAlreadyPopulated', () => {
    // Arrange
    window.localStorage.setItem('existing-key', JSON.stringify('preset'));

    // Act
    const { result } = renderHook(() => useLocalStorage('existing-key', 'default'));

    // Assert
    expect(result.current[0]).toBe('preset');
  });

  test('useLocalStorage_updatesAcrossRerenders_whenValueChangedMultipleTimes', () => {
    // Arrange
    const { result } = renderHook(() => useLocalStorage('multi-key', 0));

    // Act
    act(() => {
      result.current[1](1);
    });
    act(() => {
      result.current[1](2);
    });

    // Assert
    expect(result.current[0]).toBe(2);
  });
});

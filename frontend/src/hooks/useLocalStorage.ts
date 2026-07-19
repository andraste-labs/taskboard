/**
 * Generic React hook that persists arbitrary JSON-serializable state
 * to window.localStorage, keeping the in-memory React state and the
 * persisted copy in sync across renders and browser tabs.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

type SetValue<T> = T | ((previous: T) => T);

/**
 * Reads and parses a value from localStorage, falling back to the
 * provided initial value if the key is missing or parsing fails.
 */
function readStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return initialValue;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`useLocalStorage: failed to read key "${key}" — using initial value.`, error);
    return initialValue;
  }
}

/**
 * useLocalStorage<T>(key, initialValue)
 *
 * Behaves like useState, but automatically persists the value to
 * window.localStorage under `key` on every change, and rehydrates from
 * localStorage on mount. Also listens for the `storage` event so state
 * stays in sync if the same key is modified from another browser tab.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => readStoredValue<T>(key, initialValue));
  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`useLocalStorage: failed to persist key "${keyRef.current}".`, error);
    }
  }, [storedValue]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key !== keyRef.current) {
        return;
      }
      if (event.newValue === null) {
        setStoredValue(initialValue);
        return;
      }
      try {
        setStoredValue(JSON.parse(event.newValue) as T);
      } catch (error) {
        console.warn(`useLocalStorage: failed to parse storage event for key "${keyRef.current}".`, error);
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = useCallback((value: SetValue<T>) => {
    setStoredValue((previous) => {
      const nextValue = typeof value === 'function' ? (value as (previous: T) => T)(previous) : value;
      return nextValue;
    });
  }, []);

  return [storedValue, setValue];
}
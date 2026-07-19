import React, { useCallback, useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

type Listener = (toasts: ToastMessage[]) => void;

let toastStore: ToastMessage[] = [];
const listeners: Set<Listener> = new Set();

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function notify(): void {
  listeners.forEach((listener) => listener([...toastStore]));
}

function removeToast(id: string): void {
  toastStore = toastStore.filter((toast) => toast.id !== id);
  notify();
}

function addToast(message: string, variant: ToastVariant = 'info', duration = 4000): string {
  const id = generateId();
  toastStore = [...toastStore, { id, message, variant }];
  notify();

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
}

export interface UseToastResult {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => string;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  dismissToast: (id: string) => void;
}

export function useToast(): UseToastResult {
  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) =>
      addToast(message, variant, duration),
    []
  );

  const success = useCallback(
    (message: string, duration = 4000) => addToast(message, 'success', duration),
    []
  );

  const error = useCallback(
    (message: string, duration = 5000) => addToast(message, 'error', duration),
    []
  );

  const info = useCallback(
    (message: string, duration = 4000) => addToast(message, 'info', duration),
    []
  );

  const dismissToast = useCallback((id: string) => removeToast(id), []);

  return { showToast, success, error, info, dismissToast };
}

export function ToastRegion(): JSX.Element {
  const [toasts, setToasts] = useState<ToastMessage[]>(toastStore);

  useEffect(() => {
    const listener: Listener = (updated) => setToasts(updated);
    listeners.add(listener);
    listener([...toastStore]);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div
      className="toast-region"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.variant}`}
          role={toast.variant === 'error' ? 'alert' : 'status'}
        >
          <span className="toast__message">{toast.message}</span>
          <button
            type="button"
            className="toast__dismiss"
            aria-label="Dismiss notification"
            onClick={() => removeToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastRegion;
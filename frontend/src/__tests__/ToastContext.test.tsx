import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/src/context/ToastContext';

function ToastTrigger() {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ message: 'Saved successfully', variant: 'success' })}>
      Trigger Toast
    </button>
  );
}

function ConsumerWithoutProvider() {
  useToast();
  return <div>should not render</div>;
}

describe('ToastContext', () => {
  test('useToast_throwsError_whenUsedOutsideProvider', () => {
    // Arrange
    const originalError = console.error;
    console.error = jest.fn();

    // Act / Assert
    expect(() => render(<ConsumerWithoutProvider />)).toThrow();

    console.error = originalError;
  });

  test('toastProvider_rendersChildren_whenMounted', () => {
    // Arrange / Act
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    // Assert
    expect(screen.getByText('Trigger Toast')).toBeInTheDocument();
  });

  test('addToast_doesNotThrow_whenCalledWithValidMessage', () => {
    // Arrange
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );
    const button = screen.getByText('Trigger Toast');

    // Act / Assert
    expect(() => {
      act(() => {
        button.click();
      });
    }).not.toThrow();
  });
});

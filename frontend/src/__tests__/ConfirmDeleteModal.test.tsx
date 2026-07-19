import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDeleteModal from '@/src/components/ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
  test('confirmDeleteModal_rendersTaskReference_whenOpen', () => {
    // Arrange / Act
    render(
      <ConfirmDeleteModal
        isOpen={true}
        taskTitle="Sample Task"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    // Assert
    expect(screen.getByText(/sample task/i)).toBeInTheDocument();
  });

  test('confirmDeleteModal_callsOnConfirm_whenConfirmButtonClicked', async () => {
    // Arrange
    const handleConfirm = jest.fn();
    render(
      <ConfirmDeleteModal
        isOpen={true}
        taskTitle="Sample Task"
        onConfirm={handleConfirm}
        onCancel={jest.fn()}
      />
    );
    const user = userEvent.setup();
    const confirmButton = screen.getByRole('button', { name: /delete|confirm|yes/i });

    // Act
    await user.click(confirmButton);

    // Assert
    expect(handleConfirm).toHaveBeenCalled();
  });

  test('confirmDeleteModal_callsOnCancel_whenCancelButtonClicked', async () => {
    // Arrange
    const handleCancel = jest.fn();
    render(
      <ConfirmDeleteModal
        isOpen={true}
        taskTitle="Sample Task"
        onConfirm={jest.fn()}
        onCancel={handleCancel}
      />
    );
    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: /cancel|no/i });

    // Act
    await user.click(cancelButton);

    // Assert
    expect(handleCancel).toHaveBeenCalled();
  });

  test('confirmDeleteModal_hidesTaskReference_whenIsOpenFalse', () => {
    // Arrange / Act
    render(
      <ConfirmDeleteModal
        isOpen={false}
        taskTitle="Sample Task"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    // Assert
    expect(screen.queryByText(/sample task/i)).not.toBeInTheDocument();
  });
});

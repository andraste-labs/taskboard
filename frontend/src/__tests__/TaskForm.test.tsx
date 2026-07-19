import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '@/src/components/TaskForm';

describe('TaskForm', () => {
  test('taskForm_rendersTitleInput_whenMounted', () => {
    // Arrange / Act
    render(<TaskForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    // Assert
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toBeInTheDocument();
  });

  test('taskForm_callsOnSubmitWithTitle_whenFormSubmittedWithValidData', async () => {
    // Arrange
    const handleSubmit = jest.fn();
    render(<TaskForm onSubmit={handleSubmit} onCancel={jest.fn()} />);
    const user = userEvent.setup();
    const titleInput = screen.getByLabelText(/title/i);

    // Act
    await user.type(titleInput, 'Write tests');
    const submitButton = screen.getByRole('button', { name: /save|submit|add/i });
    await user.click(submitButton);

    // Assert
    expect(handleSubmit).toHaveBeenCalled();
    const callArg = handleSubmit.mock.calls[0][0];
    expect(callArg.title).toBe('Write tests');
  });

  test('taskForm_doesNotCallOnSubmit_whenTitleIsEmpty', async () => {
    // Arrange
    const handleSubmit = jest.fn();
    render(<TaskForm onSubmit={handleSubmit} onCancel={jest.fn()} />);
    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /save|submit|add/i });

    // Act
    await user.click(submitButton);

    // Assert
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('taskForm_callsOnCancel_whenCancelButtonClicked', async () => {
    // Arrange
    const handleCancel = jest.fn();
    render(<TaskForm onSubmit={jest.fn()} onCancel={handleCancel} />);
    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    // Act
    await user.click(cancelButton);

    // Assert
    expect(handleCancel).toHaveBeenCalled();
  });
});

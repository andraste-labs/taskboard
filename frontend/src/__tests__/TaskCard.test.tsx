import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '@/src/components/TaskCard';

const sampleTask = {
  id: 'task-1',
  title: 'Sample Task',
  description: 'Sample description',
  status: 'todo',
};

describe('TaskCard', () => {
  test('taskCard_rendersTaskTitle_whenGivenTaskProp', () => {
    // Arrange / Act
    render(<TaskCard task={sampleTask} onEdit={jest.fn()} onDelete={jest.fn()} />);

    // Assert
    expect(screen.getByText('Sample Task')).toBeInTheDocument();
  });

  test('taskCard_callsOnEdit_whenEditButtonClicked', async () => {
    // Arrange
    const handleEdit = jest.fn();
    render(<TaskCard task={sampleTask} onEdit={handleEdit} onDelete={jest.fn()} />);
    const user = userEvent.setup();
    const editButton = screen.getByRole('button', { name: /edit/i });

    // Act
    await user.click(editButton);

    // Assert
    expect(handleEdit).toHaveBeenCalledWith(sampleTask);
  });

  test('taskCard_callsOnDelete_whenDeleteButtonClicked', async () => {
    // Arrange
    const handleDelete = jest.fn();
    render(<TaskCard task={sampleTask} onEdit={jest.fn()} onDelete={handleDelete} />);
    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    // Act
    await user.click(deleteButton);

    // Assert
    expect(handleDelete).toHaveBeenCalled();
  });
});

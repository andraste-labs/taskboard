import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Column from '@/src/components/Column';
import { STATUS_ORDER, STATUS_LABELS } from '@/src/utils/taskUtils';

describe('Column', () => {
  const tasks = [
    { id: '1', title: 'Task A', status: STATUS_ORDER[0] },
    { id: '2', title: 'Task B', status: STATUS_ORDER[0] },
  ];

  test('column_rendersStatusLabel_whenGivenStatusProp', () => {
    // Arrange / Act
    render(
      <Column
        status={STATUS_ORDER[0]}
        tasks={tasks}
        onAddTask={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
      />
    );

    // Assert
    expect(screen.getByText(STATUS_LABELS[STATUS_ORDER[0]])).toBeInTheDocument();
  });

  test('column_rendersAllProvidedTasks_whenTasksArrayNonEmpty', () => {
    // Arrange / Act
    render(
      <Column
        status={STATUS_ORDER[0]}
        tasks={tasks}
        onAddTask={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
      />
    );

    // Assert
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  test('column_omitsUnrelatedTaskText_whenTasksArrayIsEmpty', () => {
    // Arrange / Act
    render(
      <Column
        status={STATUS_ORDER[0]}
        tasks={[]}
        onAddTask={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
      />
    );

    // Assert
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
  });
});

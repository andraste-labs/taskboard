import { renderHook, act } from '@testing-library/react';
import { useTasks } from '@/src/hooks/useTasks';
import { STATUS_ORDER } from '@/src/utils/taskUtils';

describe('useTasks', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('useTasks_initializesWithNonEmptyTaskList_whenNoPersistedState', () => {
    // Arrange / Act
    const { result } = renderHook(() => useTasks());

    // Assert
    expect(Array.isArray(result.current.tasks)).toBe(true);
    expect(result.current.tasks.length).toBeGreaterThan(0);
  });

  test('useTasks_addsNewTask_whenAddTaskCalledWithValidData', () => {
    // Arrange
    const { result } = renderHook(() => useTasks());
    const initialCount = result.current.tasks.length;

    // Act
    act(() => {
      result.current.addTask({ title: 'New Task', status: STATUS_ORDER[0] });
    });

    // Assert
    expect(result.current.tasks.length).toBe(initialCount + 1);
    expect(result.current.tasks.some((t) => t.title === 'New Task')).toBe(true);
  });

  test('useTasks_removesTask_whenDeleteTaskCalledWithExistingId', () => {
    // Arrange
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'To Delete', status: STATUS_ORDER[0] });
    });
    const taskToDelete = result.current.tasks.find((t) => t.title === 'To Delete');
    const countBeforeDelete = result.current.tasks.length;

    // Act
    act(() => {
      result.current.deleteTask(taskToDelete.id);
    });

    // Assert
    expect(result.current.tasks.length).toBe(countBeforeDelete - 1);
    expect(result.current.tasks.some((t) => t.id === taskToDelete.id)).toBe(false);
  });

  test('useTasks_updatesTaskFields_whenEditTaskCalledWithPartialChanges', () => {
    // Arrange
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'Editable', status: STATUS_ORDER[0] });
    });
    const task = result.current.tasks.find((t) => t.title === 'Editable');

    // Act
    act(() => {
      result.current.editTask(task.id, { title: 'Edited Title' });
    });

    // Assert
    const updated = result.current.tasks.find((t) => t.id === task.id);
    expect(updated.title).toBe('Edited Title');
  });

  test('useTasks_leavesOtherTasksUnaffected_whenSingleTaskDeleted', () => {
    // Arrange
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'Keep Me', status: STATUS_ORDER[0] });
      result.current.addTask({ title: 'Remove Me', status: STATUS_ORDER[0] });
    });
    const toRemove = result.current.tasks.find((t) => t.title === 'Remove Me');

    // Act
    act(() => {
      result.current.deleteTask(toRemove.id);
    });

    // Assert
    expect(result.current.tasks.some((t) => t.title === 'Keep Me')).toBe(true);
  });
});

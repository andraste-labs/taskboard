import React from 'react';
import type { Task, TaskStatus } from '../types/contract';
import { useTasks } from '../hooks/useTasks';
import { Column } from './Column';
import { TaskForm } from './TaskForm';

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

const nextStatus = (status: TaskStatus): TaskStatus => {
  if (status === 'todo') return 'in-progress';
  if (status === 'in-progress') return 'done';
  return 'todo';
};

export const Board: React.FC = () => {
  const { tasks, isLoading, error, addTask, updateTask, deleteTask, moveTask } = useTasks();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [formDefaultStatus, setFormDefaultStatus] = React.useState<TaskStatus>('todo');

  const handleAddTask = React.useCallback((status: TaskStatus) => {
    setEditingTask(null);
    setFormDefaultStatus(status);
    setIsFormOpen(true);
  }, []);

  const handleEditTask = React.useCallback(async (task: Task) => {
    setEditingTask(task);
    setFormDefaultStatus(task.status);
    setIsFormOpen(true);
  }, []);

  const handleDeleteTask = React.useCallback(
    async (id: string) => {
      await deleteTask(id);
    },
    [deleteTask]
  );

  const handleToggleTask = React.useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await moveTask(id, nextStatus(task.status));
    },
    [tasks, moveTask]
  );

  const handleDropTask = React.useCallback(
    async (taskId: string, status: TaskStatus) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.status === status) return;
      await moveTask(taskId, status);
    },
    [tasks, moveTask]
  );

  const handleFormSubmit = React.useCallback(
    async (data: Partial<Task>) => {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: data.title ?? editingTask.title,
          description: data.description ?? editingTask.description,
          status: data.status ?? editingTask.status,
        });
      } else {
        await addTask({
          title: data.title ?? '',
          description: data.description ?? '',
          status: data.status ?? formDefaultStatus,
        });
      }
      setIsFormOpen(false);
      setEditingTask(null);
    },
    [editingTask, updateTask, addTask, formDefaultStatus]
  );

  const handleFormCancel = React.useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(null);
  }, []);

  if (isLoading) {
    return (
      <div className="board-loading" role="status" aria-live="polite">
        Loading tasks…
      </div>
    );
  }

  return (
    <div className="board">
      {error && (
        <div className="board-error" role="alert">
          {error}
        </div>
      )}
      <header className="board__header">
        <h1>TaskBoard</h1>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => handleAddTask('todo')}
          aria-label="Add new task"
        >
          + New Task
        </button>
      </header>

      <div className="board__columns" role="list" aria-label="Kanban board columns">
        {COLUMNS.map((col) => (
          <Column
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={tasks}
            onToggle={handleToggleTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onAddTask={handleAddTask}
            onDropTask={handleDropTask}
          />
        ))}
      </div>

      {isFormOpen && (
        <TaskForm
          initialValue={editingTask ?? { status: formDefaultStatus }}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Board;
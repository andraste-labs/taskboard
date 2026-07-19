import React, { useCallback, useMemo, useState } from 'react';
import type { Task, TaskStatus, TaskFormProps, EmptyStateProps } from '../types/contract';
import { useTasks } from '../hooks/useTasks';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useToast, ToastRegion } from '../components/ToastRegion';

interface ColumnDefinition {
  status: TaskStatus;
  label: string;
}

const COLUMNS: ColumnDefinition[] = [
  { status: 'todo' as TaskStatus, label: 'To Do' },
  { status: 'in-progress' as TaskStatus, label: 'In Progress' },
  { status: 'done' as TaskStatus, label: 'Done' },
];

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
}

function EmptyState({ title, message, icon, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="empty-state" role="note">
      {icon ? <div className="empty-state__icon">{icon}</div> : null}
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__message">{message}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, task: Task) => void;
}

function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps): JSX.Element {
  return (
    <div
      className="task-card"
      draggable
      onDragStart={(event) => onDragStart(event, task)}
      role="group"
      aria-label={`Task: ${task.title}`}
    >
      <h3 className="task-card__title">{task.title}</h3>
      {task.description ? (
        <p className="task-card__description">{task.description}</p>
      ) : null}
      <div className="task-card__actions">
        <button
          type="button"
          className="btn btn--small"
          onClick={() => onEdit(task)}
          aria-label={`Edit task ${task.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--small btn--danger-outline"
          onClick={() => onDelete(task)}
          aria-label={`Delete task ${task.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

interface ColumnProps {
  definition: ColumnDefinition;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (status: TaskStatus) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDrop: (status: TaskStatus) => void;
}

function Column({
  definition,
  tasks,
  onEdit,
  onDelete,
  onAdd,
  onDragStart,
  onDrop,
}: ColumnProps): JSX.Element {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    onDrop(definition.status);
  };

  return (
    <section
      className={`column${isDragOver ? ' column--drag-over' : ''}`}
      aria-label={`${definition.label} column`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="column__header">
        <h2 className="column__title">{definition.label}</h2>
        <span className="column__count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
        <button
          type="button"
          className="btn btn--icon column__add"
          onClick={() => onAdd(definition.status)}
          aria-label={`Add task to ${definition.label}`}
        >
          +
        </button>
      </header>
      <div className="column__list">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            message={`Add a task to ${definition.label}.`}
            action={
              <button
                type="button"
                className="btn btn--small"
                onClick={() => onAdd(definition.status)}
              >
                Add task
              </button>
            }
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TaskFormModal({ initialValue, onSubmit, onCancel }: TaskFormProps): JSX.Element {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(
    (initialValue?.status as TaskStatus) ?? COLUMNS[0].status
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = Boolean(initialValue?.id);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        className="modal modal--form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="modal__header">
          <h2 id="task-form-title" className="modal__title">
            {isEditing ? 'Edit Task' : 'Add Task'}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            {formError ? (
              <p className="form-error" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="form-field">
              <label htmlFor="task-title">Title</label>
              <input
                id="task-title"
                className="task-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                className="task-desc"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
              />
            </div>
            <div className="form-field">
              <label htmlFor="task-column">Column</label>
              <select
                id="task-column"
                className="task-column"
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
              >
                {COLUMNS.map((col) => (
                  <option key={col.status} value={col.status}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppHeader({ onAddTask }: { onAddTask: () => void }): JSX.Element {
  return (
    <header className="app-header" role="banner">
      <h1 className="app-header__title">TaskBoard</h1>
      <button
        type="button"
        className="btn btn--primary"
        onClick={onAddTask}
        aria-label="Add a new task"
      >
        + Add Task
      </button>
    </header>
  );
}

export function BoardPage(): JSX.Element {
  const { tasks, isLoading, error, addTask, updateTask, deleteTask } = useTasks();
  const toast = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formInitialStatus, setFormInitialStatus] = useState<TaskStatus>(COLUMNS[0].status);
  const [deleteCandidate, setDeleteCandidate] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    COLUMNS.forEach((col) => {
      grouped[col.status] = tasks.filter((task) => task.status === col.status);
    });
    return grouped;
  }, [tasks]);

  const handleAddClick = useCallback((status: TaskStatus) => {
    setEditingTask(null);
    setFormInitialStatus(status);
    setIsFormOpen(true);
  }, []);

  const handleHeaderAddClick = useCallback(() => {
    handleAddClick(COLUMNS[0].status);
  }, [handleAddClick]);

  const handleEditClick = useCallback((task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((task: Task) => {
    setDeleteCandidate(task);
  }, []);

  const handleCancelForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleFormSubmit = useCallback(
    async (values: TaskFormValues) => {
      if (editingTask) {
        await updateTask(editingTask.id, values);
        toast.success(`Task "${values.title}" updated.`);
      } else {
        await addTask(values);
        toast.success(`Task "${values.title}" added.`);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    },
    [editingTask, addTask, updateTask, toast]
  );

  const handleCancelDelete = useCallback(() => {
    setDeleteCandidate(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteCandidate) {
      return;
    }
    try {
      await deleteTask(deleteCandidate.id);
      toast.success(`Task "${deleteCandidate.title}" deleted.`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete task.'
      );
    } finally {
      setDeleteCandidate(null);
    }
  }, [deleteCandidate, deleteTask, toast]);

  const handleDragStart = useCallback(
    (_event: React.DragEvent<HTMLDivElement>, task: Task) => {
      setDraggedTask(task);
    },
    []
  );

  const handleDrop = useCallback(
    async (status: TaskStatus) => {
      if (!draggedTask || draggedTask.status === status) {
        setDraggedTask(null);
        return;
      }
      try {
        await updateTask(draggedTask.id, { status });
        toast.success(`Task "${draggedTask.title}" moved.`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to move task.'
        );
      } finally {
        setDraggedTask(null);
      }
    },
    [draggedTask, updateTask, toast]
  );

  const initialValueForForm: TaskFormProps['initialValue'] = editingTask
    ? editingTask
    : ({ status: formInitialStatus } as Partial<Task>);

  return (
    <div className="page page--board">
      <AppHeader onAddTask={handleHeaderAddClick} />

      <main className="board" role="main" aria-label="Task board">
        {isLoading ? (
          <p className="board__status" role="status">
            Loading tasks…
          </p>
        ) : null}
        {error ? (
          <p className="board__status board__status--error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="board__columns">
          {COLUMNS.map((col) => (
            <Column
              key={col.status}
              definition={col}
              tasks={tasksByStatus[col.status] ?? []}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onAdd={handleAddClick}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>

      {isFormOpen ? (
        <TaskFormModal
          initialValue={initialValueForForm}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : null}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteCandidate)}
        taskTitle={deleteCandidate?.title ?? ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ToastRegion />
    </div>
  );
}

export default BoardPage;
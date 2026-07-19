import React from 'react';
import type { TaskStatus, TaskFormProps } from '../types/contract';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ initialValue, onSubmit, onCancel }) => {
  const [title, setTitle] = React.useState(initialValue?.title ?? '');
  const [description, setDescription] = React.useState(initialValue?.description ?? '');
  const [status, setStatus] = React.useState<TaskStatus>(initialValue?.status ?? 'todo');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const isEditMode = Boolean(initialValue?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required.');
      titleInputRef.current?.focus();
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...initialValue,
        title: trimmedTitle,
        description: description.trim(),
        status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = () => {
    if (!isSubmitting) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" role="presentation" onClick={handleOverlayClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="task-form-title">{isEditMode ? 'Edit Task' : 'Add Task'}</h2>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <div className="form-field">
              <label htmlFor="task-title">Title</label>
              <input
                ref={titleInputRef}
                id="task-title"
                name="task-title"
                type="text"
                className="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                aria-required="true"
              />
            </div>
            <div className="form-field">
              <label htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                name="task-desc"
                className="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={2000}
              />
            </div>
            <div className="form-field">
              <label htmlFor="task-column">Status</label>
              <select
                id="task-column"
                name="task-column"
                className="task-column"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
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
              {isSubmitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
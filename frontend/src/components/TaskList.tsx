import React from 'react';
import type { Task, TaskListProps, TaskItemProps, EmptyStateProps } from '../types/contract';

/**
 * Local EmptyState component — used exclusively as the empty fallback for
 * TaskList. Implements EmptyStateProps from the shared contract.
 */
const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon, action }) => {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="empty-state__title">{title}</p>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};

const STATUS_LABELS: Record<Task['status'], string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

/**
 * Local TaskCard component — renders a single draggable task with
 * edit / delete actions, including an inline delete-confirmation
 * modal matching the design/wireframes/modal-confirm-delete.html spec.
 */
const TaskCard: React.FC<TaskItemProps> = ({ task, onDragStart, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task);
  };

  const handleEditClick = async () => {
    await onEdit(task);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      data-task-id={task.id}
      role="listitem"
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span className={`task-card__status task-card__status--${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleEditClick}
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => setShowConfirm(true)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" role="presentation">
          <div
            className="modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`confirm-delete-title-${task.id}`}
            aria-describedby={`confirm-delete-desc-${task.id}`}
          >
            <div className="modal__header">
              <h2 id={`confirm-delete-title-${task.id}`}>Delete Task</h2>
            </div>
            <div className="modal__body">
              <p id={`confirm-delete-desc-${task.id}`}>
                Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be
                undone.
              </p>
            </div>
            <div className="modal__footer">
              <button
                type="button"
                className="btn btn--secondary"
                data-action="cancel-delete"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--danger"
                data-action="confirm-delete"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, filter, onToggle, onEdit, onDelete }) => {
  const filteredTasks = filter ? tasks.filter((t) => t.status === filter) : tasks;

  const handleDragStart = (task: Task) => {
    void onToggle;
    void task;
  };

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        title="No tasks here"
        message="Add a new task to get started."
        icon={<span aria-hidden="true">📋</span>}
      />
    );
  }

  return (
    <div className="task-list" role="list">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDragStart={handleDragStart}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
import React, { useState } from 'react';
import type { TaskItemProps } from '../types/contract';

const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export const TaskCard: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = async (): Promise<void> => {
    setIsToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = async (): Promise<void> => {
    await onEdit(task.id);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      role="listitem"
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span className={`task-card__status task-card__status--${task.status}`}>
          {STATUS_LABELS[task.status] ?? task.status}
        </span>
      </div>

      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__actions">
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={`Advance status of ${task.title}`}
        >
          {isToggling ? 'Updating…' : 'Move'}
        </button>
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={handleEdit}
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--danger btn--small"
          onClick={() => setShowConfirm(true)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" role="presentation" onClick={() => setShowConfirm(false)}>
          <div
            className="modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${task.id}`}
            aria-describedby={`delete-desc-${task.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header">
              <h2 id={`delete-title-${task.id}`}>Delete Task</h2>
            </div>
            <div className="modal__body">
              <p id={`delete-desc-${task.id}`}>
                Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
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

export default TaskCard;
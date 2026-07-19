import React, { useEffect, useRef } from 'react';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => Promise<unknown> | void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    cancelBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const handleConfirmClick = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
      data-testid="confirm-delete-overlay"
    >
      <div
        ref={dialogRef}
        className="modal modal--confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <div className="modal__header">
          <h2 id="confirm-delete-title" className="modal__title">
            Delete task?
          </h2>
        </div>
        <div className="modal__body">
          <p id="confirm-delete-description">
            Are you sure you want to delete{' '}
            <strong>{taskTitle || 'this task'}</strong>? This action cannot
            be undone.
          </p>
        </div>
        <div className="modal__footer">
          <button
            ref={cancelBtnRef}
            type="button"
            className="btn btn--secondary"
            data-action="cancel-delete"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            data-action="confirm-delete"
            onClick={handleConfirmClick}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
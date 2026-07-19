import React from 'react';
import type { EmptyStateProps } from '../types/contract';

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon, action }) => {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        {icon ?? '🗒️'}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && (
        <button type="button" className="btn btn--primary btn--small" onClick={() => action.onClick()}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
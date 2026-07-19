import React from 'react';

export interface AppHeaderProps {
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  onAddTask: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  totalTasks,
  todoCount,
  inProgressCount,
  doneCount,
  onAddTask,
}) => {
  return (
    <header className="app-header" role="banner">
      <div className="app-header__brand">
        <h1 className="app-header__title">TaskBoard</h1>
        <p className="app-header__subtitle" aria-label="Task summary">
          {totalTasks} task{totalTasks === 1 ? '' : 's'} · {todoCount} to do · {inProgressCount} in progress ·{' '}
          {doneCount} done
        </p>
      </div>
      <div className="app-header__actions">
        <button type="button" className="btn btn--primary" onClick={onAddTask} aria-label="Add a new task">
          + Add Task
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
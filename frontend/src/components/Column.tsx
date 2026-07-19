import React from 'react';
import type { Task, TaskStatus } from '../types/contract';
import { TaskList } from './TaskList';

export interface ColumnHeaderProps {
  title: string;
  count: number;
  status: TaskStatus;
  onAddTask: (status: TaskStatus) => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, count, status, onAddTask }) => {
  return (
    <div className="column-header">
      <h2 className="column-header__title">
        {title}
        <span className="column-header__count" aria-label={`${count} tasks in ${title}`}>
          {count}
        </span>
      </h2>
      <button
        type="button"
        className="btn btn--icon"
        onClick={() => onAddTask(status)}
        aria-label={`Add task to ${title}`}
      >
        +
      </button>
    </div>
  );
};

export interface ColumnComponentProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onToggle: (id: string) => Promise<unknown>;
  onEdit: (task: Task) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onAddTask: (status: TaskStatus) => void;
  onDropTask: (taskId: string, status: TaskStatus) => Promise<unknown>;
}

export const Column: React.FC<ColumnComponentProps> = ({
  title,
  status,
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onAddTask,
  onDropTask,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await onDropTask(taskId, status);
    }
  };

  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <section
      className={`column${isDragOver ? ' column--drag-over' : ''}`}
      aria-label={`${title} column`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-status={status}
    >
      <ColumnHeader title={title} count={columnTasks.length} status={status} onAddTask={onAddTask} />
      <TaskList tasks={tasks} filter={status} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
    </section>
  );
};

export default Column;
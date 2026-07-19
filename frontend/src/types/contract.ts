import type { ReactNode } from 'react';

/**
 * Canonical frontend type contract. Every component / hook that needs
 * Task, TaskStatus, or a shared props shape imports from this module —
 * never redeclare these types locally.
 */

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: AuthCredentials) => Promise<unknown>;
  register: (payload: RegisterPayload) => Promise<unknown>;
  logout: () => void;
}

export interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export interface TaskFormProps {
  initialValue?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => Promise<unknown> | void;
  onCancel: () => void;
}

export interface TaskListProps {
  tasks: Task[];
  filter?: TaskStatus;
  onToggle: (id: string) => Promise<unknown>;
  onEdit: (task: Task) => Promise<unknown> | void;
  onDelete: (id: string) => Promise<unknown>;
}

export interface TaskItemProps {
  task: Task;
  onToggle?: (id: string) => Promise<unknown>;
  onEdit: (task: Task) => Promise<unknown> | void;
  onDelete: (id: string) => Promise<unknown>;
  onDragStart?: (task: Task) => void;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}
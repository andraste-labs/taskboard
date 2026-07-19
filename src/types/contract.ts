/**
 * Type Contract — single source of truth for cross-component types.
 *
 * Architecture-A (2026-05-31). Recurring TT1-TT11 failure: components
 * declared their own `interface XProps` / `interface Y { ... }` inline,
 * producing 3 declarations of the same name with 2 conflicting shapes,
 * cascading into L10/L11/L13/L21/L24.
 *
 * RULES FOR AGENTS:
 *  1. DO NOT declare `interface` or `type` in component files.
 *     Import from `@/types/contract` (or the relative path) instead.
 *  2. Need a new type? EXTEND this file — append at the end.
 *     Do NOT rewrite the existing entries; the rest of the codebase
 *     depends on the exact shape declared here.
 *  3. Callback prop types: declare return as `Promise<unknown>` not
 *     `Promise<void>` (Madde 22 — value-returning callers still
 *     type-check).
 */

// ===== Domain =====================================================

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Auth =======================================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
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

// ===== API ========================================================

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// ===== Component Props ============================================

export interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void | Promise<unknown>;
  onEdit: (task: Task) => void | Promise<unknown>;
  onDelete: (task: Task) => void | Promise<unknown>;
}

export interface TaskListProps {
  tasks: Task[];
  filter: TaskStatus | 'all';
  onToggle: (task: Task) => void | Promise<unknown>;
  onEdit: (task: Task) => void | Promise<unknown>;
  onDelete: (task: Task) => void | Promise<unknown>;
}

export interface TaskFormProps {
  initialValue?: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void | Promise<unknown>;
  onCancel?: () => void;
}

export interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

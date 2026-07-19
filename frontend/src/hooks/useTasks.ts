import { useCallback, useEffect, useState } from 'react';
import type { Task, TaskStatus } from '../types/contract';

const STORAGE_KEY = 'taskboard.tasks.v1';

/**
 * Shape of the object returned by useTasks(). Every mutating action
 * returns Promise<unknown> to stay consistent with the callback prop
 * contract defined in src/types/contract.ts (TaskFormProps, TaskListProps).
 */
export interface UseTasksResult {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  getTasksByStatus: (status: TaskStatus) => Task[];
  addTask: (input: {
    title: string;
    description?: string;
    status?: TaskStatus;
  }) => Promise<unknown>;
  updateTask: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>
  ) => Promise<unknown>;
  deleteTask: (id: string) => Promise<unknown>;
  moveTask: (id: string, status: TaskStatus) => Promise<unknown>;
  reorderTasks: (status: TaskStatus, orderedIds: string[]) => Promise<unknown>;
  clearAll: () => Promise<unknown>;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

const DEFAULT_USER_ID = 'local-user';

function createSeedTasks(): Task[] {
  const t = nowIso();
  return [
    {
      id: generateId(),
      title: 'Design the Kanban board layout',
      description: 'Sketch the three-column structure and card component hierarchy.',
      status: 'todo' as TaskStatus,
      userId: DEFAULT_USER_ID,
      createdAt: t,
      updatedAt: t,
    } as Task,
    {
      id: generateId(),
      title: 'Wire up drag-and-drop between columns',
      description: 'Allow tasks to move between To Do, In Progress and Done.',
      status: 'in-progress' as TaskStatus,
      userId: DEFAULT_USER_ID,
      createdAt: t,
      updatedAt: t,
    } as Task,
    {
      id: generateId(),
      title: 'Set up project scaffolding',
      description: 'Vite + React + TypeScript project bootstrapped.',
      status: 'done' as TaskStatus,
      userId: DEFAULT_USER_ID,
      createdAt: t,
      updatedAt: t,
    } as Task,
  ];
}

function loadTasksFromStorage(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = createSeedTasks();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const seeded = createSeedTasks();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed as Task[];
  } catch {
    return createSeedTasks();
  }
}

function persistTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // localStorage may be unavailable (private mode, quota exceeded) —
    // fail silently, in-memory state remains authoritative for this session.
  }
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      const loaded = loadTasksFromStorage();
      setTasks(loaded);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const commitTasks = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      persistTasks(next);
      return next;
    });
  }, []);

  const getTasksByStatus = useCallback(
    (status: TaskStatus): Task[] => tasks.filter((task) => task.status === status),
    [tasks]
  );

  const addTask = useCallback(
    async (input: { title: string; description?: string; status?: TaskStatus }): Promise<unknown> => {
      const trimmedTitle = input.title.trim();
      if (!trimmedTitle) {
        const message = 'Task title cannot be empty';
        setError(message);
        throw new Error(message);
      }
      const timestamp = nowIso();
      const newTask: Task = {
        id: generateId(),
        title: trimmedTitle,
        description: input.description?.trim() ?? '',
        status: input.status ?? ('todo' as TaskStatus),
        userId: DEFAULT_USER_ID,
        createdAt: timestamp,
        updatedAt: timestamp,
      } as Task;

      commitTasks((prev) => [...prev, newTask]);
      setError(null);
      return newTask;
    },
    [commitTasks]
  );

  const updateTask = useCallback(
    async (
      id: string,
      updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>
    ): Promise<unknown> => {
      let updatedTask: Task | undefined;
      commitTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          updatedTask = {
            ...task,
            ...updates,
            title: updates.title !== undefined ? updates.title.trim() : task.title,
            updatedAt: nowIso(),
          };
          return updatedTask;
        })
      );
      if (!updatedTask) {
        const message = `Task with id "${id}" not found`;
        setError(message);
        throw new Error(message);
      }
      setError(null);
      return updatedTask;
    },
    [commitTasks]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<unknown> => {
      let existed = false;
      commitTasks((prev) => {
        existed = prev.some((task) => task.id === id);
        return prev.filter((task) => task.id !== id);
      });
      if (!existed) {
        const message = `Task with id "${id}" not found`;
        setError(message);
        throw new Error(message);
      }
      setError(null);
      return id;
    },
    [commitTasks]
  );

  const moveTask = useCallback(
    async (id: string, status: TaskStatus): Promise<unknown> => updateTask(id, { status }),
    [updateTask]
  );

  const reorderTasks = useCallback(
    async (status: TaskStatus, orderedIds: string[]): Promise<unknown> => {
      commitTasks((prev) => {
        const inColumn = prev.filter((task) => task.status === status);
        const outsideColumn = prev.filter((task) => task.status !== status);
        const byId = new Map(inColumn.map((task) => [task.id, task]));
        const reordered: Task[] = orderedIds
          .map((taskId) => byId.get(taskId))
          .filter((task): task is Task => Boolean(task));
        const missing = inColumn.filter((task) => !orderedIds.includes(task.id));
        return [...outsideColumn, ...reordered, ...missing];
      });
      setError(null);
      return orderedIds;
    },
    [commitTasks]
  );

  const clearAll = useCallback(async (): Promise<unknown> => {
    commitTasks(() => []);
    setError(null);
    return true;
  }, [commitTasks]);

  return {
    tasks,
    isLoading,
    error,
    getTasksByStatus,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    clearAll,
  };
}
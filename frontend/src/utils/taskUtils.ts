/**
 * Utility functions for task id generation, seed/mock task data,
 * and status ordering used to bootstrap the board.
 *
 * Imports Task / TaskStatus from the canonical type contract —
 * never redeclare these shapes locally.
 */
import type { Task, TaskStatus } from '../types/contract';

/**
 * Generates a reasonably unique id for a new task.
 * Prefers the native crypto.randomUUID when available (modern browsers),
 * falling back to a timestamp + random-suffix strategy otherwise.
 */
export function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const random = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now().toString(36);
  return `task_${timestamp}_${random}`;
}

/**
 * Canonical ordering of statuses used to render the three board columns.
 */
export const STATUS_ORDER: TaskStatus[] = ['todo', 'in-progress', 'done'];

/**
 * Human-readable labels for each status, keyed by the TaskStatus union.
 */
export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

/**
 * Builds a small set of seed tasks so the board is never empty on first
 * load. Distributed across all three columns to exercise every column's
 * rendering path (including non-empty states).
 */
export function createSeedTasks(userId: string): Task[] {
  const now = new Date().toISOString();

  const seed: Task[] = [
    {
      id: generateTaskId(),
      title: 'Design database schema',
      description: 'Draft the ERD for TaskBoard entities and relationships.',
      status: 'todo',
      userId,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateTaskId(),
      title: 'Set up project repository',
      description: 'Initialize the repo, configure linting and CI checks.',
      status: 'todo',
      userId,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateTaskId(),
      title: 'Build task board UI',
      description: 'Implement the three-column Kanban layout with drag support.',
      status: 'in-progress',
      userId,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateTaskId(),
      title: 'Write onboarding docs',
      description: 'Document the setup steps for new contributors.',
      status: 'in-progress',
      userId,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateTaskId(),
      title: 'Project kickoff',
      description: 'Align on scope, timeline, and success criteria with the team.',
      status: 'done',
      userId,
      createdAt: now,
      updatedAt: now,
    },
  ];

  return seed;
}
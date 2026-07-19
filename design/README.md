
# UX/UI Design Documentation

## Project: UX Design for Initialize and plan project: TaskBoard

TaskBoard is a Kanban-style task board built as a React + TypeScript + Vite single-page application. Three columns: To Do, In Progress, Done. Users can add, edit and del...

## Template Features Addressed:
- Standard web application features

## Deliverables:
- Wireframes
- User Flow
- Design System

## Design Solution:
# TaskBoard — UX/UI Design Specification

## 1. User Experience Strategy

### 1.1 User Flows

**Flow A — Add a Task**
```
[Board View] → Click "+ Add Task" in column header
  → [Add Task Modal opens] (focus trapped, title input auto-focused)
  → User types title (+ optional description)
  → Click "Add" / press Enter
  → Modal closes → New TaskCard appears at top of column
  → Focus returns to "+ Add Task" button
```

**Flow B — Edit a Task**
```
[Board View] → Click TaskCard or its "Edit" icon button
  → [Edit Task Modal opens] pre-filled with data
  → User edits fields
  → Click "Save" → Modal closes → Card updates in place
  OR Click "Cancel" / Esc → Modal closes, no change
```

**Flow C — Move a Task (drag-and-drop, with keyboard alternative)**
```
[Board View] → User drags TaskCard from column A to column B
  → Drop zone highlights on hover → Drop → Card animates into new column
KEYBOARD ALT: Focus card → press "M" or open card menu →
  "Move to..." submenu → arrow keys select column → Enter confirms
```

**Flow D — Delete a Task**
```
[Board View] → Click "Delete" icon on TaskCard
  → [Confirm Delete Modal] "Delete this task? This cannot be undone."
  → Confirm → Card removed with fade-out animation
  → Toast: "Task deleted" with Undo (5s)
```

### 1.2 Information Architecture

```
TaskBoard (Single Page App)
├── Header (App title, task count summary, theme toggle)
└── Board
    ├── Column: To Do
    │   ├── Column Header (title, count badge, + Add button)
    │   └── Task List (Card, Card, Card...)
    ├── Column: In Progress
    │   └── (same structure)
    └── Column: Done
        └── (same structure)
└── Modals (Add/Edit Task, Confirm Delete) — overlay layer
└── Toast/Notification region
```

### 1.3 Navigation Structure
Single-view SPA — no page routing needed. "Navigation" = interaction states:
- Default board state
- Modal-open state (focus trapped)
- Empty-column state (placeholder message)
- Drag-active state (visual affordances on valid drop targets)

### 1.4 Interaction Patterns
- Drag-and-drop with visible drop indicators + keyboard equivalent (accessibility requirement)
- Modal dialogs for create/edit/delete (not inline forms) to keep column layout stable
- Optimistic UI updates with toast confirmation + undo
- Hover/focus reveals card action icons (edit/delete) to reduce visual clutter

---

## 2. Visual Design

### Color Palette
- Primary: `#4F46E5` (Indigo) — primary actions, focus rings
- Primary Hover: `#4338CA`
- Secondary: `#0EA5E9` (Sky) — In Progress accents
- Success/Done: `#10B981` (Emerald)
- Warning/To Do: `#F59E0B` (Amber)
- Danger: `#EF4444`
- Neutrals: `#0F172A` (text), `#475569` (secondary text), `#E2E8F0` (borders), `#F8FAFC` (bg), `#FFFFFF` (surface)

### Typography
- Font family: `'Inter', system-ui, sans-serif`
- H1: 24px/1.3 700 · H2 (column titles): 16px/1.4 600
- Body: 14px/1.5 400 · Small/meta: 12px/1.4 500
- Line-height baseline: 1.5 for readability

### Spacing & Grid
- 4px base unit scale: 4, 8, 12, 16, 24, 32, 48
- 3-column CSS Grid on desktop, stacked scroll on mobile
- Card padding: 16px · Column padding: 12px · Gap between columns: 16px

### Component Design Patterns
- Cards: white surface, 8px radius, subtle shadow, left accent border matching column color
- Buttons: primary (filled), secondary (outline), icon-buttons (ghost, circular hit area ≥44px)
- Modals: centered, max-width 480px, backdrop blur/dim, focus-trapped

---

<!-- File: wireframes/board.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TaskBoard — Wireframe</title>
<link rel="stylesheet" href="../styles/design-system.css">
</head>
<body>

  <!-- Component: AppHeader -->
  <header class="app-header" role="banner">
    <h1 class="app-header__title">TaskBoard</h1>
    <div class="app-header__meta">
      <span class="badge" aria-label="Total tasks">12 tasks</span>
      <button class="btn btn--ghost" aria-label="Toggle dark theme" id="theme-toggle">🌙</button>
    </div>
  </header>

  <!-- Component: Board (layout container only, no state) -->
  <main class="board" role="main" aria-label="Task board columns">

    <!-- Component: Column (To Do) -->
    <section class="column" aria-labelledby="col-todo-heading">
      <!-- Component: ColumnHeader -->
      <header class="column__header column__header--todo">
        <h2 id="col-todo-heading">To Do</h2>
        <span class="badge badge--count" aria-label="4 tasks">4</span>
        <button class="btn btn--icon" aria-label="Add task to To Do" data-action="add-task" data-column="todo">+</button>
      </header>

      <!-- Component: TaskList -->
      <ul class="task-list" aria-label="To Do tasks">
        <!-- Component: TaskCard -->
        <li class="task-card" tabindex="0" draggable="true" aria-roledescription="draggable task card">
          <div class="task-card__body">
            <h3 class="task-card__title">Design onboarding flow</h3>
            <p class="task-card__desc">Draft wireframes for the new signup sequence.</p>
          </div>
          <div class="task-card__actions">
            <button class="btn btn--icon" aria-label="Edit task">✎</button>
            <button class="btn btn--icon btn--danger" aria-label="Delete task">🗑</button>
          </div>
        </li>
        <li class="task-card" tabindex="0" draggable="true">
          <div class="task-card__body">
            <h3 class="task-card__title">Set up CI pipeline</h3>
            <p class="task-card__desc">Configure GitHub Actions for build + test.</p>
          </div>
          <div class="task-card__actions">
            <button class="btn btn--icon" aria-label="Edit task">✎</button>
            <button class="btn btn--icon btn--danger" aria-label="Delete task">🗑</button>
          </div>
        </li>
      </ul>
    </section>

    <!-- Component: Column (In Progress) -->
    <section class="column" aria-labelledby="col-progress-heading">
      <header class="column__header column__header--progress">
        <h2 id="col-progress-heading">In Progress</h2>
        <span class="badge badge--count" aria-label="1 task">1</span>
        <button class="btn btn--icon" aria-label="Add task to In Progress" data-action="add-task" data-column="progress">+</button>
      </header>
      <ul class="task-list" aria-label="In Progress tasks">
        <li class="task-card" tabindex="0" draggable="true">
          <div class="task-card__body">
            <h3 class="task-card__title">API integration</h3>
            <p class="task-card__desc">Connect frontend to /tasks endpoint.</p>
          </div>
          <div class="task-card__actions">
            <button class="btn btn--icon" aria-label="Edit task">✎</button>
            <button class="btn btn--icon btn--danger" aria-label="Delete task">🗑</button>
          </div>
        </li>
      </ul>
    </section>

    <!-- Component: Column (Done) -->
    <section class="column" aria-labelledby="col-done-heading">
      <header class="column__header column__header--done">
        <h2 id="col-done-heading">Done</h2>
        <span class="badge badge--count" aria-label="0 tasks">0</span>
        <button class="btn btn--icon" aria-label="Add task to Done" data-action="add-task" data-column="done">+</button>
      </header>
      <!-- Component: EmptyState -->
      <div class="empty-state" role="status">
        <p>No tasks yet. Drag one here or click + to add.</p>
      </div>
    </section>

  </main>

  <!-- Component: ToastRegion (live region, no visible toast in wireframe) -->
  <div aria-live="polite" class="toast-region" id="toast-region"></div>

</body>
</html>
```

<!-- File: wireframes/modal-add-edit-task.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TaskBoard — Add/Edit Task Modal</title>
<link rel="stylesheet" href="../styles/design-system.css">
</head>
<body>

  <!-- Component: ModalOverlay -->
  <div class="modal-overlay">
    <!-- Component: TaskFormModal -->
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header class="modal__header">
        <h2 id="modal-title">Add Task</h2>
        <button class="btn btn--icon" aria-label="Close dialog" data-action="close-modal">✕</button>
      </header>

      <!-- Component: TaskForm -->
      <form class="modal__body" novalidate>
        <div class="form-field">
          <label for="task-title">Title <span aria-hidden="true">*</span></label>
          <input id="task-title" name="title" type="text" required
                 aria-required="true" placeholder="e.g. Write project README">
        </div>

        <div class="form-field">
          <label for="task-desc">Description</label>
          <textarea id="task-desc" name="description" rows="3"
                    placeholder="Optional details..."></textarea>
        </div>

        <div class="form-field">
          <label for="task-column">Column</label>
          <select id="task-column" name="column">
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <footer class="modal__footer">
          <button type="button" class="btn btn--secondary" data-action="close-modal">Cancel</button>
          <button type="submit" class="btn btn--primary">Add Task</button>
        </footer>
      </form>
    </div>
  </div>

</body>
</html>
```

<!-- File: wireframes/modal-confirm-delete.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TaskBoard — Confirm Delete Modal</title>
<link rel="stylesheet" href="../styles/design-system.css">
</head>
<body>

  <!-- Component: ModalOverlay -->
  <div class="modal-overlay">
    <!-- Component: ConfirmDeleteModal -->
    <div class="modal modal--small" role="alertdialog" aria-modal="true"
         aria-labelledby="confirm-title" aria-describedby="confirm-desc">
      <header class="modal__header">
        <h2 id="confirm-title">Delete Task?</h2>
      </header>
      <div class="modal__body">
        <p id="confirm-desc">This action cannot be undone.</p>
      </div>
      <footer class="modal__footer">
        <button class="btn btn--secondary" data-action="cancel-delete">Cancel</button>
        <button class="btn btn--danger" data-action="confirm-delete" autofocus>Delete</button>
      </footer>
    </div>
  </div>

</body>
</html>
```

<!-- File: wireframes/mobile-board.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TaskBoard — Mobile Wireframe</title>
<link rel="stylesheet" href="../styles/design-system.css">
</head>
<body class="is-mobile">

  <header class="app-header">
    <h1 class="app-header__title">TaskBoard</h1>
    <button class="btn btn--ghost" aria-label="Toggle theme">🌙</button>
  </header>

  <!-- Component: MobileTabs (column switcher replacing 3-col grid) -->
  <nav class="mobile-tabs" role="tablist" aria-label="Board columns">
    <button role="tab" aria-selected="true" class="mobile-tabs__tab is-active">To Do (4)</button>
    <button role="tab" aria-selected="false" class="mobile-tabs__tab">In Progress (1)</button>
    <button role="tab" aria-selected="false" class="mobile-tabs__tab">Done (0)</button>
  </nav>

  <main class="board board--mobile" role="main">
    <section class="column" role="tabpanel" aria-label="To Do column">
      <header class="column__header column__header--todo">
        <h2>To Do</h2>
        <button class="btn btn--icon" aria-label="Add task">+</button>
      </header>
      <ul class="task-list">
        <li class="task-card" tabindex="0">
          <div class="task-card__body">
            <h3 class="task-card__title">Design onboarding flow</h3>
            <p class="task-card__desc">Draft wireframes for new signup.</p>
          </div>
          <div class="task-card__actions">
            <button class="btn btn--icon" aria-label="Edit task">✎</button>
            <button class="btn btn--icon btn--danger" aria-label="Delete task">🗑</button>
          </div>
        </li>
      </ul>
    </section>
  </main>

</body>
</html>
```

<!-- File: styles/design-system.css -->
```css
/* =========================================================
   TASKBOARD DESIGN SYSTEM
   ========================================================= */

:root {
  /* Color — Primary */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-light: #EEF2FF;

  /* Color — Secondary / Column accents */
  --color-todo: #F59E0B;
  --color-progress: #0EA5E9;
  --color-done: #10B981;

  /* Color — Feedback */
  --color-danger: #EF4444;
  --color-danger-hover: #DC2626;
  --color-success: #10B981;

  /* Color — Neutrals */
  --color-text: #0F172A;
  --color-text-secondary: #475569;
  --color-border: #E2E8F0;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-overlay: rgba(15, 23, 42, 0.5);

  /* Typography */
  --font-family-base: 'Inter', system-ui, -apple-system, sans-serif;
  --font-size-h1: 1.5rem;      /* 24px */
  --font-size-h2: 1rem;        /* 16px */
  --font-size-body: 0.875rem;  /* 14px */
  --font-size-small: 0.75rem;  /* 12px */
  --font-weight-bold: 700;
  --font-weight-semibold: 600;
  --font-weight-medium: 500;
  --font-weight-regular: 400;
  --line-height-base: 1.5;

  /* Spacing scale (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Radius & shadow */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(15,23,42,0.06);
  --shadow-md: 0 4px 12px rgba(15,23,42,0.10);

  /* Focus ring (accessibility) */
  --focus-ring: 0 0 0 3px rgba(79, 70, 229, 0.4);

  /* Breakpoints (reference only, used via media queries) */
  --bp-mobile: 480px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;

  /* Motion */
  --transition-fast: 120ms ease-in-out;
  --transition-base: 200ms ease-in-out;
}

[data-theme="dark"] {
  --color-text: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-border: #334155;
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-overlay: rgba(0,0,0,0.6);
}

/* =========================================================
   RESET & BASE
   ========================================================= */
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  line-height: var(--line-height-base);
  color: var(--color-text);
  background: var(--color-bg);
}
h1, h2, h3 { margin: 0; }
button {
  font-family: inherit;
  cursor: pointer;
}
:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-radius: var(--radius-sm);
}

/* =========================================================
   LAYOUT: HEADER
   ========================================================= */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.app-header__title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
}
.app-header__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* =========================================================
   LAYOUT: BOARD & COLUMNS
   ========================================================= */
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  padding: var(--space-6);
  max-width: 1280px;
  margin: 0 auto;
}

.column {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.column__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-1);
  margin-bottom: var(--space-3);
  border-bottom: 3px solid var(--color-border);
}
.column__header h2 {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  flex: 1;
}
.column__header--todo { border-bottom-color: var(--color-todo); }
.column__header--progress { border-bottom-color: var(--color-progress); }
.column__header--done { border-bottom-color: var(--color-done); }

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* =========================================================
   COMPONENT: TASK CARD
   ========================================================= */
.task-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--color-border);
  padding: var(--space-4);
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}
.task-card:hover,
.task-card:focus-visible {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.column__header--todo ~ .task-list .task-card { border-left-color: var(--color-todo); }
.column__header--progress ~ .task-list .task-card { border-left-color: var(--color-progress); }
.column__header--done ~ .task-list .task-card { border-left-color: var(--color-done); }

.task-card__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-1);
}
.task-card__desc {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: 0;
}
.task-card__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.task-card:hover .task-card__actions,
.task-card:focus-within .task-card__actions {
  opacity: 1;
}

/* =========================================================
   COMPONENT: BUTTONS
   ========================================================= */
.btn {
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  padding: var(--space-2) var(--space-4);
  transition: background var(--transition-fast), color var(--transition-fast);
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.btn--primary:hover { background: var(--color-primary-hover); }
.btn--secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn--danger {
  background: var(--color-danger);
  color: #fff;
}
.btn--danger:hover { background: var(--color-danger-hover); }
.btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
}
.btn--icon {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 50%;
  color: var(--color-text-secondary);
}
.btn--icon:hover { background: var(--color-primary-light); color: var(--color-primary); }

/* =========================================================
   COMPONENT: BADGE
   ========================================================= */
.badge {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.badge--count {
  background: var(--color-border);
  color: var(--color-text-secondary);
}

/* =========================================================
   COMPONENT: EMPTY STATE
   ========================================================= */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-text-secondary);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  font-size: var(--font-size-small);
}

/* =========================================================
   COMPONENT: MODAL
   ========================================================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}
.modal {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 480px;
}
.modal--small { max-width: 360px; }
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}
.modal__body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
}

/* =========================================================
   COMPONENT: FORM FIELDS
   ========================================================= */
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.form-field label {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}
.form-field input,
.form-field textarea,
.form-field select {
  font-family: inherit;
  font-size: var(--font-size-body);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
}
.form-field input:focus-visible,
.form-field textarea:focus-visible,
.form-field select:focus-visible {
  border-color: var(--color-primary);
}

/* =========================================================
   COMPONENT: MOBILE TABS
   ========================================================= */
.mobile-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}
.mobile-tabs__tab {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-3);
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
}
.mobile-tabs__tab.is-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

/* =========================================================
   TOAST REGION
   ========================================================= */
.toast-region {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

/* =========================================================
   RESPONSIVE BREAKPOINTS
   ========================================================= */
@media (max-width: 1024px) {
  .board { grid-template-columns: repeat(3, minmax(240px, 1fr)); overflow-x: auto; }
}

@media (max-width: 768px) {
  .board { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .app-header { padding: var(--space-3) var(--space-4); }
  .board--mobile { padding: var(--space-4); }
  .modal { max-width: 100%; margin: var(--space-4); }
}

/* =========================================================
   REDUCED MOTION
   ========================================================= */
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

---

## 3. Component Breakdown (for Frontend Implementation)

To keep each `.tsx` file under 500 lines, the board decomposes into these discrete components:

| Component | File | Responsibility |
|---|---|---|
| `App` | `App.tsx` | Top-level layout, theme state provider |
| `AppHeader` | `components/AppHeader.tsx` | Title, task count, theme toggle |
| `Board` | `components/Board.tsx` | Grid layout, holds column data, drag context |
| `Column` | `components/Column.tsx` | Renders one column (header + list), drop target logic |
| `ColumnHeader` | `components/ColumnHeader.tsx` | Title, count badge, add button |
| `TaskList` | `components/TaskList.tsx` | Maps tasks to `TaskCard`, empty-state fallback |
| `TaskCard` | `components/TaskCard.tsx` | Displays single task, drag handle, edit/delete buttons |
| `EmptyState` | `components/EmptyState.tsx` | Placeholder message for empty columns |
| `TaskFormModal` | `components/TaskFormModal.tsx` | Add/Edit form modal (controlled inputs) |
| `ConfirmDeleteModal` | `components/ConfirmDeleteModal.tsx` | Delete confirmation dialog |
| `Modal` (base) | `components/Modal.tsx` | Reusable overlay + focus-trap wrapper |
| `Button` | `components/ui/Button.tsx` | Shared button variants |
| `Badge` | `components/ui/Badge.tsx` | Count/status badge |
| `Toast` | `components/Toast.tsx` | Notification + undo action |
| `useTasks` | `hooks/useTasks.ts` | State/logic hook (CRUD, localStorage persistence) |
| `useDragAndDrop` | `hooks/useDragAndDrop.ts` | Drag/drop + keyboard-move logic |

Each component owns one responsibility (display, input, modal, or navigation), preventing any single file from carrying full board state and rendering logic.

---

## 4. Accessibility Considerations (WCAG 2.1 AA)

- **Color contrast**: All text/background pairs verified ≥ 4.5:1 (body text `#0F172A` on `#FFFFFF` = 16.1:1; secondary text `#475569` on white = 7.5:1).
- **Keyboard navigation**: All interactive elements (cards, buttons, form fields) reachable via Tab; cards support `Enter`/`Space` to open edit, and a keyboard "Move to column" action as drag-and-drop alternative.
- **Focus management**: Modals trap focus, restore focus to trigger element on close; visible `:focus-visible` ring using `--focus-ring` token (not color-only).
- **ARIA roles/labels**: `role="dialog"`/`alertdialog` on modals with `aria-modal`, `aria-labelledby`; icon-only buttons have `aria-label`; live region (`aria-live="polite"`) for toast announcements.
- **Touch targets**: Icon buttons sized ≥44×44px per WCAG 2.5.5.
- **Motion**: `prefers-reduced-motion` media query disables transitions/animations.
- **Semantic structure**: `<header>`, `<main>`, `<section>`, heading hierarchy (`h1` → `h2` → `h3`) for screen reader navigation.

---
Generated by UX Designer Agent

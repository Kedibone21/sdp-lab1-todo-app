# Todo App

A local-first task management application built with Next.js and SQLite. There are no user
accounts — it's designed to be downloaded and run by a single user on their own machine.

## Features

- Create, edit, and archive tasks (each with a title, description, due date, and topic)
- Tasks are never deleted — archiving hides a task from the active list while keeping it viewable
- Three fixed statuses: Todo, In Progress, Complete
- Sort the active task list by topic, status, or due date
- Overdue tasks (past due date, not yet Complete) are visually flagged — overdue is not a status
- All data persists in a local SQLite database across restarts

## Third-Party Code

| Package | Why it was chosen |
|---|---|
| **Next.js** | Provides the web framework — routing, server actions, and rendering — for the whole application. |
| **React** | Used by Next.js to build the UI as components. |
| **TypeScript** | Adds static typing across the app and Prisma-generated types, catching mistakes before runtime. |
| **Prisma** (`@prisma/client`, `prisma`) | ORM used to define the database schema, run migrations, and query SQLite from the server actions. |
| **SQLite** (via Prisma's `sqlite` datasource) | The local, file-based database — matches the brief's local-first requirement with zero external services. |
| **Tailwind CSS** (`tailwindcss`, `@tailwindcss/postcss`) | Utility-first styling used for the application's layout and components. |
| **Vitest** | Test runner used to write and run the behavioural tests described below. |
| **ESLint** (`eslint`, `eslint-config-next`) | Lints the codebase against Next.js's recommended rules during development. |

## Database Design

The application uses a single SQLite database with one table, `Task`:

| Column | Type | Notes |
|---|---|---|
| `id` | Integer, primary key | Auto-incrementing unique identifier. |
| `title` | String | Required. |
| `description` | String | Required. |
| `dueDate` | DateTime | Required. |
| `topic` | String | Required; free text, used for sorting/grouping. |
| `status` | Enum (`Todo`, `InProgress`, `Complete`) | Defaults to `Todo`. Fixed, user-selectable but not user-defined. |
| `archived` | Boolean | Defaults to `false`. Set to `true` instead of deleting a task, so archived tasks remain viewable. |
| `createdAt` | DateTime | Defaults to the current time; used to order the "newest first" view. |

**Relationships:** none. The application serves a single local user and has only one entity, so
there are no foreign keys or related tables.

**Overdue is derived, not stored.** There is no `overdue` column and no `Overdue` status. A task is
treated as overdue at read time whenever `dueDate` is in the past and `status` is not `Complete`.
This keeps the three statuses fixed, exactly as the brief requires.

## Running It

### Requirements

- Node.js v20.20.2 (or later)

### Install

```bash
git clone <repository-url>
cd sdp-lab1-todo-app
npm install
```

### Set up the database

```bash
npx prisma migrate deploy
```

This applies the existing migration in `prisma/migrations/` and creates `prisma/dev.db`.

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run the tests

```bash
npm test
```

This runs Vitest against a separate, disposable `prisma/test.db`, which is reset before every run —
your own `dev.db` and its contents are never touched.

## Testing

The test suite (`tests/tasks.test.ts`) covers four real behaviours against the SQLite database:

1. **Create** — a task written with all four required fields is retrievable with the correct
   values and default `status`/`archived` values.
2. **Edit** — updating a task's fields persists the change.
3. **Archive** — archiving a task sets `archived: true` without deleting the row, so it's still
   retrievable.
4. **Overdue** — a task with a past due date and a non-`Complete` status is correctly identified
   as overdue by the same rule the UI uses.

# Todo App — Next.js (No Backend)

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State**: Zustand (with `persist` middleware → localStorage)
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library

## Project Structure

```
src/
  app/              # Next.js App Router pages and layouts
  components/       # UI components (dumb, presentational)
  store/            # Zustand stores
  types/            # Shared TypeScript types
  lib/              # Pure utility functions (no side effects)
```

## Data Persistence

All data lives in **localStorage** via Zustand's `persist` middleware. There is no backend, no API routes, no server actions.

- Storage key: `todo-app-store`
- Never use `useEffect` to manually sync to localStorage — Zustand handles it
- Always handle the hydration mismatch: use `useHydration` guard or `skipHydration` + manual rehydration for SSR safety

## State Management Rules

- One Zustand store for todos (`src/store/useTodoStore.ts`)
- Store holds: `todos[]`, and actions (`addTodo`, `toggleTodo`, `deleteTodo`, `editTodo`, `clearCompleted`)
- Derive filtered/sorted lists inside components or with selectors — do not store derived state
- Use shallow equality (`useShallow`) when selecting multiple fields to avoid unnecessary re-renders

## TypeScript

- Strict mode is on — no `any`, no `as unknown as X`
- Define all types in `src/types/todo.ts`
- Zod schema for the Todo type; infer the TS type from the schema

```ts
// src/types/todo.ts
import { z } from "zod"

export const TodoSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(500),
  completed: z.boolean(),
  createdAt: z.number(), // Unix ms timestamp
})

export type Todo = z.infer<typeof TodoSchema>
```

## Component Rules

- All components are client components (`"use client"`) since there is no server data
- Keep components small — split at 80 lines if logic is getting complex
- No prop drilling beyond two levels — use the Zustand store directly
- `app/page.tsx` is the only page; no routing needed unless filters are added as query params

## Styling

- Use Tailwind utility classes only — no custom CSS files
- No inline `style` props
- Dark mode: use Tailwind's `dark:` variant with `class` strategy
- Responsive by default: design mobile-first

## IDs

- Generate todo IDs with `crypto.randomUUID()` — no external library needed

## What NOT to Do

- No API routes (`app/api/`) — there is no backend
- No `fetch` calls, no SWR/React Query
- No `useEffect` for derived state — compute it inline
- No class components
- No Redux or Context API for todos — Zustand only
- Do not install `uuid` package — use `crypto.randomUUID()`

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
npm test         # Vitest
```

## Key Files to Create

1. `src/types/todo.ts` — Zod schema + Todo type
2. `src/store/useTodoStore.ts` — Zustand store with persist
3. `src/components/TodoInput.tsx` — input to add new todos
4. `src/components/TodoItem.tsx` — single todo row (toggle, edit, delete)
5. `src/components/TodoList.tsx` — renders list, handles empty state
6. `src/components/TodoFilters.tsx` — All / Active / Completed filter tabs
7. `src/app/page.tsx` — assembles everything

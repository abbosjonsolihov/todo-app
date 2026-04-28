"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Todo } from "@/types/todo"

interface TodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, text: string) => void
  setNote: (id: string, note: string) => void
  setDeadline: (id: string, deadline: number | undefined) => void
  clearCompleted: () => void
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              text: text.trim(),
              completed: false,
              createdAt: Date.now(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),
      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, text: text.trim() } : t,
          ),
        })),
      setNote: (id, note) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, note: note || undefined } : t,
          ),
        })),
      setDeadline: (id, deadline) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, deadline } : t,
          ),
        })),
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((t) => !t.completed),
        })),
    }),
    { name: "todo-app-store" },
  ),
)

"use client"

import { useTodoStore } from "@/store/useTodoStore"
import { type FilterType } from "@/types/todo"
import TodoItem from "./TodoItem"

interface Props {
  filter: FilterType
}

export default function TodoList({ filter }: Props) {
  const todos = useTodoStore((s) => s.todos)

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed
    if (filter === "completed") return t.completed
    return true
  })

  if (todos.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400 dark:text-gray-500">
        No todos yet. Add one above!
      </p>
    )
  }

  if (filtered.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400 dark:text-gray-500">
        No {filter} todos.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {filtered.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

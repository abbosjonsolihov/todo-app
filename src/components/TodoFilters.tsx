"use client"

import { type FilterType } from "@/types/todo"
import { useTodoStore } from "@/store/useTodoStore"

interface Props {
  filter: FilterType
  onFilterChange: (f: FilterType) => void
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
]

export default function TodoFilters({ filter, onFilterChange }: Props) {
  const todos = useTodoStore((s) => s.todos)
  const clearCompleted = useTodoStore((s) => s.clearCompleted)
  const remaining = todos.filter((t) => !t.completed).length
  const hasCompleted = todos.some((t) => t.completed)

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>{remaining} item{remaining !== 1 ? "s" : ""} left</span>
      <div className="flex gap-1">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`rounded px-2 py-1 transition-colors hover:text-gray-900 dark:hover:text-gray-100 ${
              filter === value
                ? "border border-blue-500 text-blue-600 dark:text-blue-400"
                : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {hasCompleted && (
        <button
          onClick={clearCompleted}
          className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
        >
          Clear completed
        </button>
      )}
    </div>
  )
}

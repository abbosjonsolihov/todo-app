"use client"

import { useState } from "react"
import { type FilterType } from "@/types/todo"
import TodoInput from "@/components/TodoInput"
import TodoList from "@/components/TodoList"
import TodoFilters from "@/components/TodoFilters"
import ThemeToggle from "@/components/ThemeToggle"

export default function Home() {
  const [filter, setFilter] = useState<FilterType>("all")

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-12">
      <div className="mb-8 flex items-center justify-center relative">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          todos
        </h1>
        <div className="absolute right-0">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <TodoInput />
        <TodoList filter={filter} />
        <TodoFilters filter={filter} onFilterChange={setFilter} />
      </div>
    </main>
  )
}

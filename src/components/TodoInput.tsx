"use client"

import { useState } from "react"
import { useTodoStore } from "@/store/useTodoStore"

export default function TodoInput() {
  const [value, setValue] = useState("")
  const addTodo = useTodoStore((s) => s.addTodo)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) {
      addTodo(value)
      setValue("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={500}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  )
}

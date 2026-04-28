"use client"

import { useState } from "react"
import { useTodoStore } from "@/store/useTodoStore"
import { type Todo } from "@/types/todo"

interface Props {
  todo: Todo
}

export default function TodoItem({ todo }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const toggleTodo = useTodoStore((s) => s.toggleTodo)
  const deleteTodo = useTodoStore((s) => s.deleteTodo)
  const editTodo = useTodoStore((s) => s.editTodo)

  function commitEdit() {
    if (draft.trim()) {
      editTodo(todo.id, draft)
    } else {
      setDraft(todo.text)
    }
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitEdit()
    if (e.key === "Escape") {
      setDraft(todo.text)
      setEditing(false)
    }
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="h-4 w-4 cursor-pointer accent-blue-600"
      />
      {editing ? (
        <input
          autoFocus
          value={draft}
          maxLength={500}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded border border-blue-500 bg-transparent px-1 text-gray-900 focus:outline-none dark:text-gray-100"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 cursor-default select-none ${
            todo.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {todo.text}
        </span>
      )}
      <button
        onClick={() => deleteTodo(todo.id)}
        aria-label="Delete todo"
        className="text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
      >
        ✕
      </button>
    </li>
  )
}

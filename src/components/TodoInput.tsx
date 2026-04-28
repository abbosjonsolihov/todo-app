"use client"

import { useState } from "react"
import { useTodoStore } from "@/store/useTodoStore"
import { dateValueToTs, todayValue, isPastDate } from "@/lib/deadline"

export default function TodoInput() {
  const [text, setText] = useState("")
  const [note, setNote] = useState("")
  const [deadline, setDeadline] = useState("")
  const [deadlineError, setDeadlineError] = useState("")
  const [showNote, setShowNote] = useState(false)
  const [showDeadline, setShowDeadline] = useState(false)
  const addTodo = useTodoStore((s) => s.addTodo)

  function handleDeadlineChange(val: string) {
    setDeadline(val)
    setDeadlineError(val && isPastDate(val) ? "Deadline cannot be in the past." : "")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    if (deadline && isPastDate(deadline)) {
      setDeadlineError("Deadline cannot be in the past.")
      return
    }
    addTodo(
      text,
      note || undefined,
      deadline ? dateValueToTs(deadline) : undefined,
    )
    setText("")
    setNote("")
    setDeadline("")
    setDeadlineError("")
    setShowNote(false)
    setShowDeadline(false)
  }

  function toggleNote() {
    setShowNote((v) => !v)
    if (showNote) setNote("")
  }

  function toggleDeadline() {
    setShowDeadline((v) => !v)
    if (showDeadline) { setDeadline(""); setDeadlineError("") }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-300 bg-white focus-within:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:focus-within:border-blue-400"
    >
      {/* main row */}
      <div className="flex items-center gap-1 px-3 py-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={500}
          className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500"
        />

        {/* note toggle */}
        <button
          type="button"
          onClick={toggleNote}
          title={showNote ? "Remove note" : "Add note"}
          aria-label={showNote ? "Remove note" : "Add note"}
          className={`rounded p-1.5 transition-colors ${
            showNote
              ? "text-blue-500 hover:text-blue-600 dark:text-blue-400"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
        </button>

        {/* deadline toggle */}
        <button
          type="button"
          onClick={toggleDeadline}
          title={showDeadline ? "Remove deadline" : "Add deadline"}
          aria-label={showDeadline ? "Remove deadline" : "Add deadline"}
          className={`rounded p-1.5 transition-colors ${
            showDeadline
              ? "text-blue-500 hover:text-blue-600 dark:text-blue-400"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>

        <button
          type="submit"
          disabled={!text.trim() || Boolean(deadlineError)}
          className="ml-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* note panel */}
      {showNote && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-700">
          <textarea
            autoFocus
            value={note}
            maxLength={2000}
            rows={2}
            placeholder="Add a note..."
            onChange={(e) => setNote(e.target.value)}
            className="w-full resize-none rounded border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500"
          />
          <p className="mt-1 text-right text-xs text-gray-400">{note.length}/2000</p>
        </div>
      )}

      {/* deadline panel */}
      {showDeadline && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-700">
          <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Deadline
          </label>
          <input
            autoFocus={!showNote}
            type="date"
            value={deadline}
            min={todayValue()}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            className={`rounded border px-2 py-1 text-sm focus:outline-none dark:bg-gray-900 dark:text-gray-300 dark:focus:[color-scheme:dark] ${
              deadlineError
                ? "border-red-400 bg-red-50 focus:border-red-500 dark:border-red-500 dark:bg-red-900/20"
                : "border-gray-200 bg-gray-50 focus:border-blue-400 dark:border-gray-600"
            }`}
          />
          {deadlineError && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{deadlineError}</p>
          )}
        </div>
      )}
    </form>
  )
}

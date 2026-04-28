"use client"

import { useState } from "react"
import { useTodoStore } from "@/store/useTodoStore"
import { type Todo } from "@/types/todo"
import { tsToDateValue, dateValueToTs, getDeadlineStatus, todayValue, isPastDate } from "@/lib/deadline"

interface Props {
  todo: Todo
}

export default function TodoItem({ todo }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState(todo.note ?? "")
  const [deadlineOpen, setDeadlineOpen] = useState(false)
  const [deadlineDraft, setDeadlineDraft] = useState(todo.deadline ? tsToDateValue(todo.deadline) : "")
  const [deadlineError, setDeadlineError] = useState("")

  const toggleTodo = useTodoStore((s) => s.toggleTodo)
  const deleteTodo = useTodoStore((s) => s.deleteTodo)
  const editTodo = useTodoStore((s) => s.editTodo)
  const setNote = useTodoStore((s) => s.setNote)
  const setDeadline = useTodoStore((s) => s.setDeadline)

  function commitEdit() {
    if (draft.trim()) editTodo(todo.id, draft)
    else setDraft(todo.text)
    setEditing(false)
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitEdit()
    if (e.key === "Escape") { setDraft(todo.text); setEditing(false) }
  }

  function commitNote() {
    setNote(todo.id, noteDraft)
    setNoteOpen(false)
  }

  function openDeadline() {
    setDeadlineDraft(todo.deadline ? tsToDateValue(todo.deadline) : "")
    setDeadlineError("")
    setDeadlineOpen(true)
  }

  function handleDeadlineChange(val: string) {
    setDeadlineDraft(val)
    setDeadlineError(val && isPastDate(val) ? "Deadline cannot be in the past." : "")
  }

  function commitDeadline() {
    if (deadlineDraft && isPastDate(deadlineDraft)) {
      setDeadlineError("Deadline cannot be in the past.")
      return
    }
    setDeadline(todo.id, deadlineDraft ? dateValueToTs(deadlineDraft) : undefined)
    setDeadlineOpen(false)
  }

  const hasNote = Boolean(todo.note)
  const hasDeadline = todo.deadline !== undefined
  const dl = hasDeadline ? getDeadlineStatus(todo.deadline!) : null

  return (
    <li className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">

      {/* ── main row ── */}
      <div className="flex items-center gap-3 p-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {editing ? (
            <input
              autoFocus
              value={draft}
              maxLength={500}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleTitleKeyDown}
              className="rounded border border-blue-500 bg-transparent px-1 text-gray-900 focus:outline-none dark:text-gray-100"
            />
          ) : (
            <span
              onDoubleClick={() => setEditing(true)}
              className={`cursor-default select-none truncate ${
                todo.completed
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {todo.text}
            </span>
          )}

          {hasDeadline && !deadlineOpen && dl && (
            <button
              onClick={openDeadline}
              className={`mt-1 w-fit rounded px-1.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${dl.classes}`}
            >
              {dl.label}
            </button>
          )}
        </div>

        {/* note icon */}
        <button
          onClick={noteOpen ? commitNote : () => { setNoteDraft(todo.note ?? ""); setNoteOpen(true) }}
          aria-label={noteOpen ? "Save note" : hasNote ? "Edit note" : "Add note"}
          title={noteOpen ? "Save note" : hasNote ? "Edit note" : "Add note"}
          className={`shrink-0 transition-colors ${
            hasNote || noteOpen
              ? "text-blue-500 hover:text-blue-600 dark:text-blue-400"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
        </button>

        {/* calendar icon */}
        <button
          onClick={deadlineOpen ? commitDeadline : openDeadline}
          disabled={deadlineOpen && Boolean(deadlineError)}
          aria-label={deadlineOpen ? "Save deadline" : hasDeadline ? "Edit deadline" : "Add deadline"}
          title={deadlineOpen ? "Save deadline" : hasDeadline ? "Edit deadline" : "Add deadline"}
          className={`shrink-0 transition-colors disabled:opacity-40 ${
            hasDeadline || deadlineOpen
              ? "text-blue-500 hover:text-blue-600 dark:text-blue-400"
              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>

        <button
          onClick={() => deleteTodo(todo.id)}
          aria-label="Delete todo"
          className="shrink-0 text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
        >
          ✕
        </button>
      </div>

      {/* ── deadline picker ── */}
      {deadlineOpen && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-700">
          <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Deadline
          </label>
          <input
            autoFocus
            type="date"
            value={deadlineDraft}
            min={todayValue()}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commitDeadline(); if (e.key === "Escape") setDeadlineOpen(false) }}
            className={`rounded border px-2 py-1 text-sm focus:outline-none dark:bg-gray-900 dark:text-gray-300 dark:focus:[color-scheme:dark] ${
              deadlineError
                ? "border-red-400 bg-red-50 focus:border-red-500 dark:border-red-500 dark:bg-red-900/20"
                : "border-gray-200 bg-gray-50 focus:border-blue-400 dark:border-gray-600"
            }`}
          />
          {deadlineError && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{deadlineError}</p>
          )}
          <div className="mt-2 flex gap-2">
            {hasDeadline && (
              <button
                onClick={() => { setDeadline(todo.id, undefined); setDeadlineOpen(false) }}
                className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300"
              >
                Remove
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setDeadlineOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={commitDeadline}
                disabled={Boolean(deadlineError)}
                className="rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── note editor ── */}
      {noteOpen && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-700">
          <textarea
            autoFocus
            value={noteDraft}
            maxLength={2000}
            rows={3}
            placeholder="Write a note..."
            onChange={(e) => setNoteDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") { setNoteDraft(todo.note ?? ""); setNoteOpen(false) } }}
            className="w-full resize-none rounded border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-400">{noteDraft.length}/2000</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setNoteDraft(todo.note ?? ""); setNoteOpen(false) }}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={commitNote}
                className="rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── note display ── */}
      {!noteOpen && hasNote && (
        <div
          onClick={() => { setNoteDraft(todo.note ?? ""); setNoteOpen(true) }}
          className="cursor-pointer border-t border-gray-100 px-3 pb-2.5 pt-2 dark:border-gray-700"
        >
          <p className="whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400">{todo.note}</p>
        </div>
      )}
    </li>
  )
}

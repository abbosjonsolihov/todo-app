export function tsToDateValue(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function dateValueToTs(val: string): number {
  const [y, m, d] = val.split("-").map(Number)
  return new Date(y, m - 1, d).getTime()
}

type DeadlineStatus = {
  label: string
  classes: string
}

export function getDeadlineStatus(ts: number): DeadlineStatus {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dl = new Date(ts)
  const dlDay = new Date(dl.getFullYear(), dl.getMonth(), dl.getDate())
  const diffDays = Math.round((dlDay.getTime() - today.getTime()) / 86_400_000)

  if (diffDays < 0)
    return { label: "Overdue", classes: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" }
  if (diffDays === 0)
    return { label: "Due today", classes: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" }
  if (diffDays === 1)
    return { label: "Due tomorrow", classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500" }
  if (diffDays <= 3)
    return { label: `${diffDays} days left`, classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500" }

  const label = dl.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(dl.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  })
  return { label, classes: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" }
}

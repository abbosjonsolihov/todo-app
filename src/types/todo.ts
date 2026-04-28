import { z } from "zod"

export const TodoSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(500),
  completed: z.boolean(),
  createdAt: z.number(),
})

export type Todo = z.infer<typeof TodoSchema>

export type FilterType = "all" | "active" | "completed"

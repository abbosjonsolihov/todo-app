import { z } from "zod"

export const TodoSchema = z.object({
  id: z.uuid(),
  text: z.string().min(1).max(500),
  completed: z.boolean(),
  createdAt: z.number(),
  note: z.string().max(2000).optional(),
  deadline: z.number().optional(),
})

export type Todo = z.infer<typeof TodoSchema>

export type FilterType = "all" | "active" | "completed"

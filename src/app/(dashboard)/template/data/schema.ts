import { z } from "zod"

export const templateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  defaultConfig: z.any(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Template = z.infer<typeof templateSchema>
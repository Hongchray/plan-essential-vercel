import { z } from "zod"

export const guestSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string(),
  note: z.string().optional(),
  address: z.string().optional(),
  tags: z.array(z.any()).optional(),
  groups: z.array(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Guest = z.infer<typeof guestSchema>
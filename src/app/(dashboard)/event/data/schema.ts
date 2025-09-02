import { z } from "zod"

export const eventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  owner: z.string(),
  bride: z.string(),
  groom: z.string(),
  description: z.string(),
  image: z.string(),
  userId: z.string(),
  status: z.string(),
  type: z.string(),
  location: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Event = z.infer<typeof eventSchema>
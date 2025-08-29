import { z } from "zod"

export const storeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Store name is required"),
  logo: z.string().url().optional().nullable(),
  banner: z.string().url().optional().nullable(),
  userId: z.string().uuid(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  chatId: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Store = z.infer<typeof storeSchema>
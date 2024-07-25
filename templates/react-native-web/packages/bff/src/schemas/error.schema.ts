import { z } from 'zod'

export const appErrorSchema = z.object({
  status: z.number(),
  code: z.string(),
  description: z.string().nullable().optional(),
  errors: z.array(z.any()).default([]).nullable().optional(),
})

export type AppErrorData = z.infer<typeof appErrorSchema>

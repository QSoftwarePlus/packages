import * as z from 'zod'

export const entitySchema = z.object({
    id: z.number().min(1),
    created_at: z.date(),
    updated_at: z.date().optional(),
    deleted_at: z.date().optional(),
})

export type EntitySchema = z.infer<typeof entitySchema>
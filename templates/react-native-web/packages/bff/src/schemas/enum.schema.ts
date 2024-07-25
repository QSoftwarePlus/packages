import z from "zod";

export const enumSchema = z.object({
    value: z.string().min(1),
    label: z.string().min(1),
    id: z.coerce.number().optional(),
})

export type EnumSchema = z.infer<typeof enumSchema>
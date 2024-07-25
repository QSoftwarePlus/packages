import z from "zod";

export const appSuccessSchema = z.object({
    success: z.boolean(),
})

export type AppSuccessData = z.infer<typeof appSuccessSchema>
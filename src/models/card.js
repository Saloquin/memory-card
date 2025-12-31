import { z } from 'zod'

export const createCardSchema = z.object({
    recto: z.string().min(1, "Recto text is required").max(500, "Recto text cannot exceed 500 characters"),
    verso: z.string().min(1, "Verso text is required").max(500, "Verso text cannot exceed 500 characters"),
    recto_url: z.string().url("Invalid recto URL").optional().nullable().or(z.literal('')),
    verso_url: z.string().url("Invalid verso URL").optional().nullable().or(z.literal('')),
    collection_id: z.string().uuid("Invalid collection ID")
})

export const updateCardSchema = z.object({
    recto: z.string().min(1, "Recto text is required").max(500, "Recto text cannot exceed 500 characters").optional(),
    verso: z.string().min(1, "Verso text is required").max(500, "Verso text cannot exceed 500 characters").optional(),
    recto_url: z.string().url("Invalid recto URL").optional().nullable().or(z.literal('')),
    verso_url: z.string().url("Invalid verso URL").optional().nullable().or(z.literal('')),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
})

export const cardIdSchema = z.object({
    id: z.string().uuid("Invalid card ID")
})

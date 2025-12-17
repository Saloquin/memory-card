import { z } from 'zod'

export const createCardSchema = z.object({
    recto: z.string().min(1, "Recto text is required").max(500, "Recto text cannot exceed 500 characters"),
    verso: z.string().min(1, "Verso text is required").max(500, "Verso text cannot exceed 500 characters"),
    recto_url: z.url("Invalid recto URL").optional().or(z.literal('')),
    verso_url: z.url("Invalid verso URL").optional().or(z.literal('')),
    collection_id: z.uuid("Invalid collection ID")
})

export const updateCardSchema = z.object({
    recto: z.string().min(1, "Recto text is required").max(500, "Recto text cannot exceed 500 characters"),
    verso: z.string().min(1, "Verso text is required").max(500, "Verso text cannot exceed 500 characters"),
    recto_url: z.url("Invalid recto URL").optional().or(z.literal('')),
    verso_url: z.url("Invalid verso URL").optional().or(z.literal('')),
})

export const cardIdSchema = z.object({
    id: z.uuid("Invalid card ID")
})
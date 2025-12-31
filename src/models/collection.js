import { z } from 'zod'

export const createCollectionSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
    is_public: z.boolean()
})

export const updateCollectionSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters").optional(),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
    is_public: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
})

export const collectionTitleSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
})

export const collectionIdSchema = z.object({
    id: z.string().uuid("Invalid collection ID")
})

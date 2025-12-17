import { z } from 'zod'

export const createCollectionSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
    description: z.string().max(500, "Description cannot exceed 500 characters"),
    is_public: z.boolean()
})
export const collectionTitleSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
})

export const collectionIdSchema = z.object({
    id: z.uuid("Invalid collection ID")
})

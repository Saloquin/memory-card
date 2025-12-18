import {z} from 'zod'

export const updateReviewSchema = z.object({
    level_id: z.number().min(1, "Level ID must be at least 1").max(5, "Level ID cannot exceed 5")
})
import { z } from 'zod'

export const registerUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100, "First name cannot exceed 100 characters"),
    name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must contain at least 6 characters").max(100, "Password cannot exceed 100 characters")
})

export const loginUserSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(1, "Password is required")
})

export const userIdSchema = z.object({
    id: z.uuid("Invalid user ID")
})

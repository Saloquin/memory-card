import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(1).max(100),
  firstName: z.string().min(1).max(100)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Collection validation schemas
export const createCollectionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false)
});

export const updateCollectionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  isPublic: z.boolean().optional()
});

// Card validation schemas
export const createCardSchema = z.object({
  collectionId: z.string().uuid(),
  recto: z.string().min(1).max(2000),
  verso: z.string().min(1).max(2000),
  urlRecto: z.string().url().optional().nullable(),
  urlVerso: z.string().url().optional().nullable()
});

export const updateCardSchema = z.object({
  recto: z.string().min(1).max(2000).optional(),
  verso: z.string().min(1).max(2000).optional(),
  urlRecto: z.string().url().optional().nullable(),
  urlVerso: z.string().url().optional().nullable()
});

// Revision validation schema
export const revisionSchema = z.object({
  cardId: z.string().uuid(),
  success: z.boolean() // true = advance level, false = reset to level 1
});

// Collection access validation schema
export const collectionAccessSchema = z.object({
  userId: z.string().uuid()
});

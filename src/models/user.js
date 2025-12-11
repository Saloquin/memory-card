import { z } from 'zod'

export const registerUserSchema = z.object({
    nom: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
    prenom: z.string().min(1, "Le prénom est requis").max(100, "Le prénom ne peut pas dépasser 100 caractères"),
    email: z.email("Format d'email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
})

export const loginUserSchema = z.object({
    email: z.email("Format d'email invalide"),
    password: z.string().min(1, "Le mot de passe est requis")
})

export const userIdSchema = z.object({
    id: z.uuid("ID utilisateur invalide")
})

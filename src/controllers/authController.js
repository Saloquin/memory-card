import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db/database.js'
import { usertable } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export const registerUser = async (req, res) => {
    try {
        const { nom, prenom, email, password } = req.body
        
        const existing = await db.select().from(usertable).where(eq(usertable.email, email))
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already registered' })
        }
        
        const passwordHash = bcrypt.hashSync(password, 10)
        const user = {
            id: uuidv4(),
            nom,
            prenom,
            email,
            passwordHash,
        }
        
        await db.insert(usertable).values(user)
        return res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to register user' })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        
        const users = await db.select().from(usertable).where(eq(usertable.email, email))
        const user = users[0]
        
        if (!user) return res.status(401).json({ error: 'Invalid credentials' })
          const valid = bcrypt.compareSync(password, user.passwordHash)
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
        
        const secret = process.env.JWT_SECRET || 'secret'
        const token = jwt.sign({ 
            id: user.id, 
            email: user.email, 
            role: user.role,
            prenom: user.prenom,
            nom: user.nom
        }, secret, { expiresIn: '1h' })
        
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role
            },
            token
        })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to login' })
    }
}
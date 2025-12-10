import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { generateToken } from '../utils/jwt.js';
import { generateUUID } from '../utils/uuid.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { eq } from 'drizzle-orm';

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, firstName } = validatedData;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with UUID
    const userId = generateUUID();
    const [newUser] = await db.insert(users).values({
      userId,
      email,
      password: hashedPassword,
      name,
      firstName,
      isAdmin: false
    }).returning();

    // Generate token
    const token = generateToken(newUser.userId);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userId: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        isAdmin: newUser.isAdmin
      },
      token
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.userId);

    res.json({
      message: 'Login successful',
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [user] = await db.select({
      userId: users.userId,
      email: users.email,
      name: users.name,
      firstName: users.firstName,
      isAdmin: users.isAdmin
    }).from(users).where(eq(users.userId, req.userId)).limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

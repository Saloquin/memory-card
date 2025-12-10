import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { eq, desc } from 'drizzle-orm';

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.select({
      userId: users.userId,
      email: users.email,
      name: users.name,
      firstName: users.firstName,
      isAdmin: users.isAdmin
    }).from(users);

    res.json({ users: allUsers });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.select({
      userId: users.userId,
      email: users.email,
      name: users.name,
      firstName: users.firstName,
      isAdmin: users.isAdmin
    }).from(users).where(eq(users.userId, id)).limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUser] = await db.select().from(users)
      .where(eq(users.userId, id))
      .limit(1);

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete user (cascading deletes will handle related data)
    await db.delete(users).where(eq(users.userId, id));

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

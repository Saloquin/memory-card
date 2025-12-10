import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const [user] = await db.select().from(users)
      .where(eq(users.userId, req.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

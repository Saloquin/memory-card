import { db } from '../config/database.js';
import { collections, collectionAccess, users } from '../models/schema.js';
import { createCollectionSchema, updateCollectionSchema, collectionAccessSchema } from '../utils/validation.js';
import { generateUUID } from '../utils/uuid.js';
import { eq, and, or, like } from 'drizzle-orm';

export const getAllCollections = async (req, res) => {
  try {
    // Get public collections and collections the user has access to
    const userCollections = await db
      .select({
        collectionId: collections.collectionId,
        authorId: collections.authorId,
        title: collections.title,
        description: collections.description,
        isPublic: collections.isPublic,
        authorName: users.name,
        authorFirstName: users.firstName
      })
      .from(collections)
      .leftJoin(users, eq(collections.authorId, users.userId))
      .leftJoin(collectionAccess, eq(collections.collectionId, collectionAccess.collectionId))
      .where(
        or(
          eq(collections.isPublic, true),
          eq(collections.authorId, req.userId),
          eq(collectionAccess.userId, req.userId)
        )
      );

    res.json({ collections: userCollections });
  } catch (error) {
    console.error('Get all collections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const [collection] = await db
      .select({
        collectionId: collections.collectionId,
        authorId: collections.authorId,
        title: collections.title,
        description: collections.description,
        isPublic: collections.isPublic,
        authorName: users.name,
        authorFirstName: users.firstName
      })
      .from(collections)
      .leftJoin(users, eq(collections.authorId, users.userId))
      .where(eq(collections.collectionId, id))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Check if user has access
    const hasAccess = 
      collection.isPublic ||
      collection.authorId === req.userId ||
      (await db.select().from(collectionAccess)
        .where(and(eq(collectionAccess.collectionId, id), eq(collectionAccess.userId, req.userId)))
        .limit(1)).length > 0;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ collection });
  } catch (error) {
    console.error('Get collection by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCollection = async (req, res) => {
  try {
    const validatedData = createCollectionSchema.parse(req.body);
    const { title, description, isPublic } = validatedData;

    const collectionId = generateUUID();
    const [newCollection] = await db.insert(collections).values({
      collectionId,
      authorId: req.userId,
      title,
      description: description || null,
      isPublic: isPublic || false
    }).returning();

    res.status(201).json({
      message: 'Collection created successfully',
      collection: newCollection
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Create collection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateCollectionSchema.parse(req.body);

    // Check if collection exists and user is the author
    const [existingCollection] = await db.select().from(collections)
      .where(eq(collections.collectionId, id))
      .limit(1);

    if (!existingCollection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (existingCollection.authorId !== req.userId) {
      return res.status(403).json({ error: 'Only the author can update this collection' });
    }

    // Build update object
    const updateData = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.isPublic !== undefined) updateData.isPublic = validatedData.isPublic;

    const [updatedCollection] = await db.update(collections)
      .set(updateData)
      .where(eq(collections.collectionId, id))
      .returning();

    res.json({
      message: 'Collection updated successfully',
      collection: updatedCollection
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Update collection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if collection exists and user is the author
    const [existingCollection] = await db.select().from(collections)
      .where(eq(collections.collectionId, id))
      .limit(1);

    if (!existingCollection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (existingCollection.authorId !== req.userId) {
      return res.status(403).json({ error: 'Only the author can delete this collection' });
    }

    await db.delete(collections)
      .where(eq(collections.collectionId, id));

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const grantAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = collectionAccessSchema.parse(req.body);
    const { userId } = validatedData;

    // Check if collection exists and user is the author
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, id))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (collection.authorId !== req.userId) {
      return res.status(403).json({ error: 'Only the author can grant access' });
    }

    // Check if user exists
    const [targetUser] = await db.select().from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if access already exists
    const existingAccess = await db.select().from(collectionAccess)
      .where(and(eq(collectionAccess.collectionId, id), eq(collectionAccess.userId, userId)))
      .limit(1);

    if (existingAccess.length > 0) {
      return res.status(400).json({ error: 'User already has access' });
    }

    await db.insert(collectionAccess).values({
      collectionId: id,
      userId
    });

    res.status(201).json({ message: 'Access granted successfully' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Grant access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const revokeAccess = async (req, res) => {
  try {
    const { id, userId } = req.params;

    // Check if collection exists and user is the author
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, id))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (collection.authorId !== req.userId) {
      return res.status(403).json({ error: 'Only the author can revoke access' });
    }

    await db.delete(collectionAccess)
      .where(and(eq(collectionAccess.collectionId, id), eq(collectionAccess.userId, userId)));

    res.json({ message: 'Access revoked successfully' });
  } catch (error) {
    console.error('Revoke access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchPublicCollections = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const publicCollections = await db
      .select({
        collectionId: collections.collectionId,
        authorId: collections.authorId,
        title: collections.title,
        description: collections.description,
        isPublic: collections.isPublic,
        authorName: users.name,
        authorFirstName: users.firstName
      })
      .from(collections)
      .leftJoin(users, eq(collections.authorId, users.userId))
      .where(and(
        eq(collections.isPublic, true),
        like(collections.title, `%${q}%`)
      ));

    res.json({ collections: publicCollections });
  } catch (error) {
    console.error('Search public collections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyCollections = async (req, res) => {
  try {
    const myCollections = await db
      .select({
        collectionId: collections.collectionId,
        authorId: collections.authorId,
        title: collections.title,
        description: collections.description,
        isPublic: collections.isPublic
      })
      .from(collections)
      .where(eq(collections.authorId, req.userId));

    res.json({ collections: myCollections });
  } catch (error) {
    console.error('Get my collections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

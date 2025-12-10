import { db } from '../config/database.js';
import { revisions, cards, collections, collectionAccess, levels } from '../models/schema.js';
import { revisionSchema } from '../utils/validation.js';
import { eq, and, desc } from 'drizzle-orm';

export const recordRevision = async (req, res) => {
  try {
    const validatedData = revisionSchema.parse(req.body);
    const { cardId, success } = validatedData;

    // Check if card exists
    const [card] = await db.select().from(cards)
      .where(eq(cards.cardId, cardId))
      .limit(1);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Check if user has access to the collection
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, card.collectionId))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const hasAccess = 
      collection.isPublic ||
      collection.authorId === req.userId ||
      (await db.select().from(collectionAccess)
        .where(and(eq(collectionAccess.collectionId, card.collectionId), eq(collectionAccess.userId, req.userId)))
        .limit(1)).length > 0;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if revision already exists
    const existingRevision = await db.select().from(revisions)
      .where(and(eq(revisions.cardId, cardId), eq(revisions.userId, req.userId)))
      .limit(1);

    let newLevelId;
    if (existingRevision.length > 0) {
      const currentLevel = existingRevision[0].levelId;
      if (success) {
        // Advance to next level (max level is 5)
        newLevelId = Math.min(currentLevel + 1, 5);
      } else {
        // Reset to level 1
        newLevelId = 1;
      }
    } else {
      // First revision, start at level 1
      newLevelId = 1;
    }

    // Get the level info to calculate next revision date
    const [level] = await db.select().from(levels)
      .where(eq(levels.levelId, newLevelId))
      .limit(1);

    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    const now = new Date();
    const nextRevisionDate = new Date(now);
    nextRevisionDate.setDate(nextRevisionDate.getDate() + level.daysBeforeRevision);

    let revision;

    if (existingRevision.length > 0) {
      // Update existing revision
      [revision] = await db.update(revisions)
        .set({
          levelId: newLevelId,
          lastRevisionDate: now,
          nextRevisionDate: nextRevisionDate
        })
        .where(and(eq(revisions.cardId, cardId), eq(revisions.userId, req.userId)))
        .returning();
    } else {
      // Create new revision
      [revision] = await db.insert(revisions).values({
        cardId,
        userId: req.userId,
        levelId: newLevelId,
        lastRevisionDate: now,
        nextRevisionDate: nextRevisionDate
      }).returning();
    }

    res.status(201).json({
      message: 'Revision recorded successfully',
      revision: {
        ...revision,
        success,
        daysUntilNextReview: level.daysBeforeRevision
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Record revision error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserRevisions = async (req, res) => {
  try {
    const userRevisions = await db.select().from(revisions)
      .where(eq(revisions.userId, req.userId))
      .orderBy(desc(revisions.lastRevisionDate));

    res.json({ revisions: userRevisions });
  } catch (error) {
    console.error('Get user revisions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCardRevision = async (req, res) => {
  try {
    const { cardId } = req.params;

    // Check if card exists
    const [card] = await db.select().from(cards)
      .where(eq(cards.cardId, cardId))
      .limit(1);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Check if user has access to the collection
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, card.collectionId))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const hasAccess = 
      collection.isPublic ||
      collection.authorId === req.userId ||
      (await db.select().from(collectionAccess)
        .where(and(eq(collectionAccess.collectionId, card.collectionId), eq(collectionAccess.userId, req.userId)))
        .limit(1)).length > 0;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [revision] = await db.select().from(revisions)
      .where(and(eq(revisions.cardId, cardId), eq(revisions.userId, req.userId)))
      .limit(1);

    if (!revision) {
      return res.status(404).json({ error: 'No revision found for this card' });
    }

    res.json({ revision });
  } catch (error) {
    console.error('Get card revision error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllLevels = async (req, res) => {
  try {
    const allLevels = await db.select().from(levels);
    res.json({ levels: allLevels });
  } catch (error) {
    console.error('Get all levels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

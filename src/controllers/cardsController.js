import { db } from '../config/database.js';
import { cards, collections, collectionAccess, revisions } from '../models/schema.js';
import { createCardSchema, updateCardSchema } from '../utils/validation.js';
import { generateUUID } from '../utils/uuid.js';
import { eq, and, or, lte } from 'drizzle-orm';

export const getCardsByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Check if user has access to the collection
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const hasAccess = 
      collection.isPublic ||
      collection.authorId === req.userId ||
      (await db.select().from(collectionAccess)
        .where(and(eq(collectionAccess.collectionId, collectionId), eq(collectionAccess.userId, req.userId)))
        .limit(1)).length > 0;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const collectionCards = await db.select().from(cards)
      .where(eq(cards.collectionId, collectionId));

    res.json({ cards: collectionCards });
  } catch (error) {
    console.error('Get cards by collection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const [card] = await db.select().from(cards)
      .where(eq(cards.cardId, id))
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

    res.json({ card });
  } catch (error) {
    console.error('Get card by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCard = async (req, res) => {
  try {
    const validatedData = createCardSchema.parse(req.body);
    const { collectionId, recto, verso, urlRecto, urlVerso } = validatedData;

    // Check if user is the author of the collection
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (collection.authorId !== req.userId) {
      return res.status(403).json({ error: 'Only the collection author can add cards' });
    }

    const cardId = generateUUID();
    const [newCard] = await db.insert(cards).values({
      cardId,
      collectionId,
      recto,
      verso,
      urlRecto: urlRecto || null,
      urlVerso: urlVerso || null
    }).returning();

    res.status(201).json({
      message: 'Card created successfully',
      card: newCard
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Create card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateCardSchema.parse(req.body);

    // Check if card exists
    const [existingCard] = await db.select().from(cards)
      .where(eq(cards.cardId, id))
      .limit(1);

    if (!existingCard) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Check if user is the author of the collection
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, existingCard.collectionId))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (collection.authorId !== req.userId) {
      return res.status(403).json({ error: 'Only the collection author can update cards' });
    }

    // Build update object
    const updateData = {};
    if (validatedData.recto !== undefined) updateData.recto = validatedData.recto;
    if (validatedData.verso !== undefined) updateData.verso = validatedData.verso;
    if (validatedData.urlRecto !== undefined) updateData.urlRecto = validatedData.urlRecto;
    if (validatedData.urlVerso !== undefined) updateData.urlVerso = validatedData.urlVerso;

    const [updatedCard] = await db.update(cards)
      .set(updateData)
      .where(eq(cards.cardId, id))
      .returning();

    res.json({
      message: 'Card updated successfully',
      card: updatedCard
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Update card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if card exists
    const [existingCard] = await db.select().from(cards)
      .where(eq(cards.cardId, id))
      .limit(1);

    if (!existingCard) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Check if user is the author of the collection
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, existingCard.collectionId))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (collection.authorId !== req.userId) {
      return res.status(403).json({ error: 'Only the collection author can delete cards' });
    }

    await db.delete(cards)
      .where(eq(cards.cardId, id));

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCardsToReview = async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Check if collection exists
    const [collection] = await db.select().from(collections)
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Check if user has access
    const hasAccess = 
      collection.isPublic ||
      collection.authorId === req.userId ||
      (await db.select().from(collectionAccess)
        .where(and(eq(collectionAccess.collectionId, collectionId), eq(collectionAccess.userId, req.userId)))
        .limit(1)).length > 0;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const now = new Date();

    // Get all cards from the collection
    const collectionCards = await db.select().from(cards)
      .where(eq(cards.collectionId, collectionId));

    // Get user's revisions for these cards
    const cardIds = collectionCards.map(card => card.cardId);
    
    const userRevisions = await db.select().from(revisions)
      .where(and(
        eq(revisions.userId, req.userId),
        lte(revisions.nextRevisionDate, now)
      ));

    const revisionMap = new Map(userRevisions.map(r => [r.cardId, r]));

    // Filter cards that need review (either never reviewed or next revision date has passed)
    const cardsToReview = collectionCards.filter(card => {
      const revision = revisionMap.get(card.cardId);
      // Card needs review if it has no revision or if next revision date has passed
      return !revision || new Date(revision.nextRevisionDate) <= now;
    });

    res.json({ cards: cardsToReview });
  } catch (error) {
    console.error('Get cards to review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

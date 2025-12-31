import { db } from '../db/database.js'
import { collectiontable, cardtable, revisiontable, leveltable } from '../db/schema.js'
import { eq, and, sql } from 'drizzle-orm'

/**
 * Calculate next review date based on last revision date and level
 */
function calculateNextReviewDate(lastRevisionDate, daysBeforeRevision) {
    const lastDate = new Date(lastRevisionDate)
    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + daysBeforeRevision)
    return nextDate
}

export const getCardsToReview = async (req, res) => {
    try {
        const { id } = req.params
        
        const collection = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.collection_id, id))
            .get()

        if (!collection) {
            return res.status(404).json({ error: "Collection doesn't exist" })
        }

        if (!collection.is_public && collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this collection' })
        }

        const cardsWithReviews = await db.select({
            card: cardtable,
            revision: revisiontable,
            level: leveltable
        })
            .from(cardtable)
            .leftJoin(revisiontable, 
                and(
                    eq(cardtable.card_id, revisiontable.card_id),
                    eq(revisiontable.user_id, req.user.id)
                ))
            .leftJoin(leveltable, eq(revisiontable.level_id, leveltable.level_id))
            .where(eq(cardtable.collection_id, id))
            .all()

        const now = new Date()
        const cardsToReview = cardsWithReviews.filter(item => {
            if (!item.revision) {
                return true
            }
            
            const nextReviewDate = calculateNextReviewDate(
                item.revision.last_revision_date,
                item.level.days_before_revision
            )
            
            return nextReviewDate <= now
        }).map(item => ({
            card: item.card,
            revision: item.revision,
            next_review_date: item.revision ? calculateNextReviewDate(
                item.revision.last_revision_date,
                item.level.days_before_revision
            ) : null
        }))

        if (cardsToReview.length === 0) {
            return res.status(200).json({ message: 'No cards to review at this time', cards: [] })
        }

        return res.status(200).json({ cards: cardsToReview })
    } catch (error) {
        console.error('Error getting cards to review:', error)
        return res.status(500).json({ error: 'Failed to retrieve cards to review' })
    }
}

export const reviewCard = async (req, res) => {
    try {
        const { id } = req.params
        const { level_id } = req.body

        const cardData = await db.select({
            card: cardtable,
            collection: collectiontable
        })
            .from(cardtable)
            .innerJoin(collectiontable, eq(cardtable.collection_id, collectiontable.collection_id))
            .where(eq(cardtable.card_id, id))
            .get()

        if (!cardData) {
            return res.status(404).json({ error: "Card doesn't exist" })
        }

        if (!cardData.collection.is_public && cardData.collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this card' })
        }

        const level = await db.select()
            .from(leveltable)
            .where(eq(leveltable.level_id, level_id))
            .get()

        if (!level) {
            return res.status(400).json({ error: 'Invalid level_id' })
        }

        const now = new Date()
        const nextReviewDate = calculateNextReviewDate(now, level.days_before_revision)

        const existingReview = await db.select()
            .from(revisiontable)
            .where(
                and(
                    eq(revisiontable.card_id, id),
                    eq(revisiontable.user_id, req.user.id)
                )
            )
            .get()

        const reviewData = {
            level_id,
            last_revision_date: now
        }

        if (!existingReview) {
            await db.insert(revisiontable).values({
                card_id: id,
                user_id: req.user.id,
                ...reviewData
            })
            return res.status(201).json({ 
                message: 'Card reviewed successfully for the first time',
                next_review_date: nextReviewDate,
                level_id
            })
        } else {
            await db.update(revisiontable)
                .set(reviewData)
                .where(
                    and(
                        eq(revisiontable.card_id, id),
                        eq(revisiontable.user_id, req.user.id)
                    )
                )
            return res.status(200).json({ 
                message: 'Card reviewed successfully',
                next_review_date: nextReviewDate,
                level_id
            })
        }
    } catch (error) {
        console.error('Error reviewing card:', error)
        return res.status(500).json({ error: 'Failed to review card' })
    }
}

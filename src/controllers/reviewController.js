import { db } from '../db/database.js'
import { collectiontable, cardtable, revisiontable } from '../db/schema.js'
import { eq, and, lte } from 'drizzle-orm'

export const getCardsToReview = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params)
        const data = await db.select()
            .from(collectiontable)
            .innerJoin(cardtable, eq(collectiontable.collection_id, cardtable.collection_id))
            .innerJoin(revisiontable,
                and(
                    eq(cardtable.card_id, revisiontable.card_id),
                    eq(revisiontable.user_id, req.user.id),
                    lte(revisiontable.next_review_date, new Date())
                ))
            .where(eq(collectiontable.collection_id, id))
            .get()

        if (!data) {
            return res.status(409).json({ error: "Collection doesn't exist" })
        }
        if (!data.Collection.is_public && data.Collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this collection' })
        }
        if (data.Card.length == 0) {
            return res.status(200).json({ message: 'No cards to review at this time' })
        }
        const cards = data.Card;
        return res.status(201).json({ cards })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collection', error })
    }
}

export const reviewCard = async (req, res) => {
    try {
        const { id } = req.params
        const { level_id } = req.body

        console.log(req.params)
        const cardData = await db.select()
            .from(cardtable)
            .innerJoin(collectiontable, eq(cardtable.collection_id, collectiontable.collection_id))
            .innerJoin(revisiontable, and(eq(cardtable.card_id, revisiontable.card_id), lte(revisiontable.next_review_date, new Date()), eq(revisiontable.user_id, req.user.id)))
            .where(eq(cardtable.card_id, id))
            .get()

        if (!cardData) {
            return res.status(409).json({ error: "Card doesn't exist" })
        }
        if (!cardData.Collection.is_public && cardData.Collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this card' })
        }
        const review = {
            level_id,
            last_revision_date: Date.now()
        }
        if (!cardData.Revision) {
            review.user_id = req.user.id
            review.card_id = id
            console.log(review)
            await db.insert(revisiontable).values(review)
            return res.status(201).json({ message: 'Card reviewed successfully for the first time' })
        }
        else {
            console.log(review)
            await db.update(revisiontable).set(review).where(and(eq(revisiontable.card_id, id), eq(revisiontable.user_id, req.user.id)))
            return res.status(201).json({ message: 'Card reviewed successfully' })
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve card', error })
    }
}
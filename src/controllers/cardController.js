import { db } from '../db/database.js'
import { cardtable, collectiontable } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'


export const getOneCard = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params)
        const cardData = await db.select()
            .from(cardtable)
            .innerJoin(collectiontable, eq(cardtable.collection_id, collectiontable.collection_id))
            .where(eq(cardtable.card_id, id))
            .get()

        if (cardData.length == 0) {
            return res.status(409).json({ error: "Card doesn't exist" })
        }

        if (!cardData.Collection.is_public && cardData.Collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this card' })
        }
        const card = {
            id: cardData.Card.card_id,
            recto: cardData.Card.recto,
            verso: cardData.Card.verso,
            recto_url: cardData.Card.url_recto,
            verso_url: cardData.Card.url_verso,
            collection_id: cardData.Collection.collection_id
        }
        console.log(card)
        return res.status(201).json({ card })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve card', error })
    }
}
export const getCardsByCollection = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params)
        const data = await db.select()
            .from(collectiontable)
            .innerJoin(cardtable, eq(collectiontable.collection_id, cardtable.collection_id))
            .where(eq(collectiontable.collection_id, id))
            .get()

        if (!data) {
            return res.status(409).json({ error: "Collection doesn't exist" })
        }
        if (!data.Collection.is_public && data.Collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this collection' })
        }
        const cards = data.Card;
        return res.status(201).json({ cards })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collection', error })
    }
}

export const createCard = async (req, res) => {
    try {
        const { recto, verso, recto_url, verso_url, collection_id } = req.body
        console.log(req.body)
        const existingCollection = await db.select()
            .from(collectiontable)
            .where(and(eq(collectiontable.collection_id, collection_id), eq(collectiontable.author_id, req.user.id)))
            .get()
        if (!existingCollection) {
            return res.status(409).json({ error: "The specified collection does not exist" })
        }
        const existing = await db.select()
            .from(cardtable)
            .where(and(eq(cardtable.recto, recto), eq(cardtable.verso, verso), eq(cardtable.collection_id, collection_id)))
            .get()
        if (existing) {
            return res.status(409).json({ error: 'a similar card already exists' })
        }
        const card = {
            recto,
            verso,
            url_recto: recto_url,
            url_verso: verso_url,
            collection_id
        }
        console.log(card)
        const newCard = await db.insert(cardtable).values(card).returning()
        return res.status(201).json({ message: 'card created successfully', newCard })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create card' })
    }
}

export const updateCard = async (req, res) => {
    try {
        const { id } = req.params
        const { recto, verso, recto_url, verso_url } = req.body
        console.log(req.body)
        const existing = await db.select()
            .from(cardtable)
            .innerJoin(collectiontable, eq(cardtable.collection_id, collectiontable.collection_id))
            .where(eq(cardtable.card_id, id))
            .get()
        if (!existing) {
            return res.status(409).json({ error: 'a card with this id does not exists' })
        }
        if (existing.Collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only update cards from your own collections' })
        }
        const card = {
            recto,
            verso,
            url_recto: recto_url,
            url_verso: verso_url
        }
        console.log(card)
        await db.update(cardtable).set(card).where(eq(cardtable.card_id, id))
        return res.status(201).json({ message: 'Card updated successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update card' })
    }
}

export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params)
        const cardData = await db.select()
            .from(cardtable)
            .innerJoin(collectiontable, eq(cardtable.collection_id, collectiontable.collection_id))
            .where(eq(cardtable.card_id, id))
            .get()

        if (!cardData) {
            return res.status(404).json({ error: 'Card does not exist' })
        }
        if (cardData.Collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete cards from your own collections' })
        }

        console.log(cardData)
        await db.delete(cardtable).where(eq(cardtable.card_id, id))
        return res.status(200).json({ message: 'Card deleted successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to delete card' })
    }
}



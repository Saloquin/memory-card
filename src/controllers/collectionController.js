import { db } from '../db/database.js'
import { collectiontable } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

export const getOneCollection = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params)
        const collectionData = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.collection_id, id))
            .get()

        if (collectionData.length == 0) {
            return res.status(409).json({ error: "Collection doesn't exist" })
        }
        if (!collectionData.is_public && collectionData.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this collection' })
        }
        const collection = {
            title: collectionData.title,
            description: collectionData.description,
            author_id: collectionData.author_id
        }
        console.log(collection)
        return res.status(201).json({ collection })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collection', error })
    }
}

export const getUserCollection = async (req, res) => {
    try {
        const collectionData = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.author_id, req.user.id))

        if (collectionData.length == 0) {
            return res.status(409).json({ error: "You don't have any collections" })
        }
        console.log(collectionData)
        return res.status(201).json({ collectionData })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collection' })
    }
}

export const getPublicCollection = async (req, res) => {
    try {
        const collectionData = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.is_public, true))

        if (collectionData.length == 0) {
            return res.status(409).json({ error: "there are no public collections" })
        }
        console.log(collectionData)
        return res.status(201).json({ collectionData })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collection' })
    }

}

export const createCollection = async (req, res) => {
    try {
        const { title, description, is_public } = req.body
        console.log(req.body)
        const existing = await db.select().from(collectiontable).where(and(eq(collectiontable.title, title), eq(collectiontable.author_id, req.user.id)))
        if (existing.length > 0) {
            return res.status(409).json({ error: 'a collection with this title already exists' })
        }
        const collection = {
            title,
            description,
            author_id: req.user.id,
            is_public,
        }
        console.log(collection)
        await db.insert(collectiontable).values(collection)
        return res.status(201).json({ message: 'Collection created successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create collection' })
    }
}


export const updateCollection = async (req, res) => {
    try {
        const { id } = req.params 
        const { title, description, is_public } = req.body
        console.log(req.body)
        const existing = await db.select().from(collectiontable).where(eq(collectiontable.collection_id, id))
        if (existing.length < 1) {
            return res.status(409).json({ error: 'a collection with this id does not exists' })
        }
        const collection = {
            title,
            description,
            is_public,
        }
        console.log(collection)
        await db.update(collectiontable).set(collection).where(eq(collectiontable.collection_id, id))
        return res.status(201).json({ message: 'Collection updated successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update collection' })
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params)
        const collection = await db.select()
            .from(collectiontable)
            .where(and(eq(collectiontable.collection_id, id), eq(collectiontable.author_id, req.user.id)))
        if (collection.length == 0) {
            return res.status(409).json({ error: 'you cannot delete this collection' })
        }
        console.log(collection)
        await db.delete(collectiontable).where(eq(collectiontable.collection_id, id))
        return res.status(201).json({ message: 'Collection deleted successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete collection' })
    }
}
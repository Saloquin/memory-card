import { db } from '../db/database.js'
import { collectiontable } from '../db/schema.js'
import { eq, and, like, sql } from 'drizzle-orm'

export const getOneCollection = async (req, res) => {
    try {
        const { id } = req.params
        const collectionData = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.collection_id, id))
            .get()

        if (!collectionData) {
            return res.status(404).json({ error: "Collection doesn't exist" })
        }
        if (!collectionData.is_public && collectionData.author_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied to this collection' })
        }
        return res.status(200).json(collectionData)
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collection' })
    }
}

export const getUserCollection = async (req, res) => {
    try {
        const collections = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.author_id, req.user.id))
            .all()

        return res.status(200).json(collections)
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collections' })
    }
}

export const getPublicCollection = async (req, res) => {
    try {
        const { title } = req.params
        const collections = await db.select()
            .from(collectiontable)
            .where(
                and(
                    eq(collectiontable.is_public, true),
                    like(sql`lower(${collectiontable.title})`, `%${title.toLowerCase()}%`)
                )
            )
            .all()
        
        return res.status(200).json(collections)
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve collections' })
    }
}

export const createCollection = async (req, res) => {
    try {
        const { title, description, is_public } = req.body
        
        const existing = await db.select()
            .from(collectiontable)
            .where(
                and(
                    eq(collectiontable.title, title),
                    eq(collectiontable.author_id, req.user.id)
                )
            )
            .get()
        
        if (existing) {
            return res.status(409).json({ error: 'A collection with this title already exists' })
        }
        
        const collection = {
            title,
            description,
            author_id: req.user.id,
            is_public,
        }
        
        const [newCollection] = await db.insert(collectiontable).values(collection).returning()
        return res.status(201).json({ 
            message: 'Collection created successfully',
            collection_id: newCollection.collection_id,
            ...newCollection
        })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create collection' })
    }
}

export const updateCollection = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, is_public } = req.body
        
        const existing = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.collection_id, id))
            .get()
        
        if (!existing) {
            return res.status(404).json({ error: 'Collection does not exist' })
        }
        
        if (existing.author_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own collections' })
        }
        
        const collection = {
            title,
            description,
            is_public,
        }
        
        await db.update(collectiontable).set(collection).where(eq(collectiontable.collection_id, id))
        return res.status(200).json({ message: 'Collection updated successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update collection' })
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params
        
        const collection = await db.select()
            .from(collectiontable)
            .where(eq(collectiontable.collection_id, id))
            .get()
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection does not exist' })
        }
        
        if (collection.author_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own collections' })
        }
        
        await db.delete(collectiontable).where(eq(collectiontable.collection_id, id))
        return res.status(200).json({ message: 'Collection deleted successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete collection' })
    }
}

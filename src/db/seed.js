import { db } from "./database.js"
import { usertable, leveltable, collectiontable, cardtable, revisiontable, collectionaccesstable } from "./schema.js"
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

async function seed() {
    try {
        console.log("Seeding database...");
        
        await db.delete(collectionaccesstable)
        await db.delete(revisiontable)
        await db.delete(cardtable)
        await db.delete(collectiontable)
        await db.delete(leveltable)
        await db.delete(usertable)


        const usersIds = {
            admin: uuidv4(),
            user1: uuidv4(),
            user2: uuidv4(),
            user3: uuidv4()
        }

        const seedUsers = [
            {
                user_id: usersIds.admin,
                name: 'Admin',
                first_name: 'Super',
                email: 'admin@memorycard.com',
                password: await bcrypt.hash('admin123', 10),
                is_admin: true
            },
            {
                user_id: usersIds.user1,
                name: 'Dupont',
                first_name: 'Jean',
                email: 'jean.dupont@example.com',
                password: await bcrypt.hash('password123', 10),
                is_admin: false
            },
            {
                user_id: usersIds.user2,
                name: 'Martin',
                first_name: 'Marie',
                email: 'marie.martin@example.com',
                password: await bcrypt.hash('password123', 10),
                is_admin: false
            },
            {
                user_id: usersIds.user3,
                name: 'Bernard',
                first_name: 'Pierre',
                email: 'pierre.bernard@example.com',
                password: await bcrypt.hash('password123', 10),
                is_admin: false
            }
        ]

        await db.insert(usertable).values(seedUsers)
        console.log('Users seeded successfully')

        const seedLevels = [
            { level_id: 1, days_before_revision: 1 },      
            { level_id: 2, days_before_revision: 2 },      
            { level_id: 3, days_before_revision: 4 },      
            { level_id: 4, days_before_revision: 8 },     
            { level_id: 5, days_before_revision: 16 }    
        ]

        await db.insert(leveltable).values(seedLevels)
        console.log('Levels seeded successfully')

        const collectionsIds = {
            french: uuidv4(),
            english: uuidv4(),
            math: uuidv4(),
            history: uuidv4(),
            science: uuidv4()
        }

        const seedCollections = [
            {
                collection_id: collectionsIds.french,
                author_id: usersIds.admin,
                title: 'Vocabulaire Français',
                description: 'Apprendre le vocabulaire français avancé',
                is_public: true
            },
            {
                collection_id: collectionsIds.english,
                author_id: usersIds.user1,
                title: 'English Vocabulary',
                description: 'Common English words and phrases',
                is_public: true
            },
            {
                collection_id: collectionsIds.math,
                author_id: usersIds.user1,
                title: 'Formules Mathématiques',
                description: 'Formules essentielles en mathématiques',
                is_public: false
            },
            {
                collection_id: collectionsIds.history,
                author_id: usersIds.user2,
                title: 'Dates Historiques',
                description: 'Dates importantes de l\'histoire mondiale',
                is_public: true
            },
            {
                collection_id: collectionsIds.science,
                author_id: usersIds.user3,
                title: 'Sciences Physiques',
                description: 'Concepts clés en physique et chimie',
                is_public: true
            }
        ]

        await db.insert(collectiontable).values(seedCollections)
        console.log('Collections seeded successfully')

        const seedCards = [
            {
                collection_id: collectionsIds.french,
                recto: 'Qu\'est-ce qu\'un "anachronisme"?',
                verso: 'Une erreur de chronologie qui consiste à placer un événement à une époque où il n\'a pas pu se produire'
            },
            {
                collection_id: collectionsIds.french,
                recto: 'Définition de "éphémère"',
                verso: 'Qui ne dure qu\'un jour, qui est de courte durée'
            },
            {
                collection_id: collectionsIds.french,
                recto: 'Que signifie "ubiquité"?',
                verso: 'La capacité d\'être présent en plusieurs endroits en même temps'
            },
            {
                collection_id: collectionsIds.english,
                recto: 'What does "serendipity" mean?',
                verso: 'The occurrence of finding pleasant things by chance'
            },
            {
                collection_id: collectionsIds.english,
                recto: 'Define "ephemeral"',
                verso: 'Lasting for a very short time'
            },
            {
                collection_id: collectionsIds.english,
                recto: 'What is "resilience"?',
                verso: 'The ability to recover quickly from difficulties'
            },
            {
                collection_id: collectionsIds.math,
                recto: 'Formule de l\'aire d\'un cercle',
                verso: 'A = πr²'
            },
            {
                collection_id: collectionsIds.math,
                recto: 'Théorème de Pythagore',
                verso: 'a² + b² = c² (dans un triangle rectangle)'
            },
            {
                collection_id: collectionsIds.math,
                recto: 'Formule de la dérivée de x^n',
                verso: 'd/dx(x^n) = nx^(n-1)'
            },
            {
                collection_id: collectionsIds.history,
                recto: 'Date de la Révolution française',
                verso: '1789'
            },
            {
                collection_id: collectionsIds.history,
                recto: 'Année de la découverte de l\'Amérique par Christophe Colomb',
                verso: '1492'
            },
            {
                collection_id: collectionsIds.history,
                recto: 'Début de la Première Guerre mondiale',
                verso: '1914'
            },

            {
                collection_id: collectionsIds.science,
                recto: 'Formule chimique de l\'eau',
                verso: 'H₂O'
            },
            {
                collection_id: collectionsIds.science,
                recto: 'Vitesse de la lumière',
                verso: '299 792 458 m/s (environ 300 000 km/s)'
            },
            {
                collection_id: collectionsIds.science,
                recto: 'Loi de Newton (F = ma)',
                verso: 'Force = masse × accélération'
            }
        ]

        const insertedCards = await db.insert(cardtable).values(seedCards).returning()
        console.log('Cards seeded successfully')

        const seedCollectionAccess = [
            { user_id: usersIds.user1, collection_id: collectionsIds.english },
            { user_id: usersIds.user1, collection_id: collectionsIds.math },
            { user_id: usersIds.user1, collection_id: collectionsIds.french },

            { user_id: usersIds.user2, collection_id: collectionsIds.history },
            { user_id: usersIds.user2, collection_id: collectionsIds.french },
            { user_id: usersIds.user2, collection_id: collectionsIds.science },

            { user_id: usersIds.user3, collection_id: collectionsIds.science },
            { user_id: usersIds.user3, collection_id: collectionsIds.english }
        ]

        await db.insert(collectionaccesstable).values(seedCollectionAccess)
        console.log('Collection access seeded successfully')

        const now = new Date()
        const seedRevisions = [
            {
                card_id: insertedCards[0].card_id,
                user_id: usersIds.user1,
                level_id: 3,
                last_revision_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) 
            },
            {
                card_id: insertedCards[3].card_id,
                user_id: usersIds.user1,
                level_id: 2,
                last_revision_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) 
            },
            {
                card_id: insertedCards[6].card_id,
                user_id: usersIds.user1,
                level_id: 4,
                last_revision_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) 
            },

            {
                card_id: insertedCards[1].card_id,
                user_id: usersIds.user2,
                level_id: 1,
                last_revision_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) 
            },
            {
                card_id: insertedCards[9].card_id,
                user_id: usersIds.user2,
                level_id: 5,
                last_revision_date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000) 
            }
        ]

        await db.insert(revisiontable).values(seedRevisions)
        console.log('Revisions seeded successfully')

        console.log('\n Database seeded successfully!')
        console.log('\nComptes créés:')
        console.log('- Admin: admin@memorycard.com / admin123')
        console.log('- User1: jean.dupont@example.com / password123')
        console.log('- User2: marie.martin@example.com / password123')
        console.log('- User3: pierre.bernard@example.com / password123')
        console.log('\nCollections créées: 5')
        console.log('Cartes créées: 15')
        console.log('Niveaux de révision: 5')

    } catch (error) {
        console.error('❌ Error seeding database:', error)
    }
}

seed()
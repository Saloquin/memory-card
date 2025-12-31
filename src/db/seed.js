import { db } from "./database.js"
import { usertable, leveltable, collectiontable, cardtable, revisiontable, collectionaccesstable } from "./schema.js"
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

async function seed() {
    try {
        console.log("🌱 Seeding database...\n");
        
        console.log("🧹 Cleaning existing data...");
        await db.delete(revisiontable)
        await db.delete(collectionaccesstable)
        await db.delete(cardtable)
        await db.delete(collectiontable)
        await db.delete(leveltable)
        await db.delete(usertable)
        console.log("✅ Existing data cleaned\n");

        console.log("👥 Seeding users...");
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
        console.log(`✅ ${seedUsers.length} users seeded\n`);

        console.log("📊 Seeding levels...");
        const seedLevels = [
            { level_id: 1, days_before_revision: 1 },
            { level_id: 2, days_before_revision: 2 },
            { level_id: 3, days_before_revision: 4 },
            { level_id: 4, days_before_revision: 8 },
            { level_id: 5, days_before_revision: 16 }
        ]

        await db.insert(leveltable).values(seedLevels)
        console.log(`✅ ${seedLevels.length} levels seeded\n`);

        console.log("📚 Seeding collections...");
        const collectionsIds = {
            french: uuidv4(),
            english: uuidv4(),
            math: uuidv4(),
            history: uuidv4(),
            science: uuidv4(),
            privateCollection: uuidv4()
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
            },
            {
                collection_id: collectionsIds.privateCollection,
                author_id: usersIds.user2,
                title: 'Collection Privée Marie',
                description: 'Notes personnelles',
                is_public: false
            }
        ]

        await db.insert(collectiontable).values(seedCollections)
        console.log(`✅ ${seedCollections.length} collections seeded\n`);

        console.log("🃏 Seeding cards...");
        const seedCards = [
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.french,
                recto: 'Qu\'est-ce qu\'un "anachronisme"?',
                verso: 'Une erreur de chronologie qui consiste à placer un événement à une époque où il n\'a pas pu se produire',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.french,
                recto: 'Définition de "éphémère"',
                verso: 'Qui ne dure qu\'un jour, qui est de courte durée',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.french,
                recto: 'Que signifie "ubiquité"?',
                verso: 'La capacité d\'être présent en plusieurs endroits en même temps',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.french,
                recto: 'Définition de "procrastiner"',
                verso: 'Remettre au lendemain, différer sans cesse',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.english,
                recto: 'What does "serendipity" mean?',
                verso: 'The occurrence of finding pleasant things by chance',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.english,
                recto: 'Define "ephemeral"',
                verso: 'Lasting for a very short time',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.english,
                recto: 'What is "resilience"?',
                verso: 'The ability to recover quickly from difficulties',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.english,
                recto: 'Define "procrastinate"',
                verso: 'To delay or postpone action',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.math,
                recto: 'Formule de l\'aire d\'un cercle',
                verso: 'A = πr²',
                url_recto: null,
                url_verso: 'https://en.wikipedia.org/wiki/Circle'
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.math,
                recto: 'Théorème de Pythagore',
                verso: 'a² + b² = c² (dans un triangle rectangle)',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.math,
                recto: 'Formule de la dérivée de x^n',
                verso: 'd/dx(x^n) = nx^(n-1)',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.history,
                recto: 'Date de la Révolution française',
                verso: '1789',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.history,
                recto: 'Année de la découverte de l\'Amérique par Christophe Colomb',
                verso: '1492',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.history,
                recto: 'Début de la Première Guerre mondiale',
                verso: '1914',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.history,
                recto: 'Fin de la Seconde Guerre mondiale',
                verso: '1945',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.science,
                recto: 'Formule chimique de l\'eau',
                verso: 'H₂O',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.science,
                recto: 'Vitesse de la lumière',
                verso: '299 792 458 m/s (environ 300 000 km/s)',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.science,
                recto: 'Loi de Newton (F = ma)',
                verso: 'Force = masse × accélération',
                url_recto: null,
                url_verso: null
            },
            {
                card_id: uuidv4(),
                collection_id: collectionsIds.privateCollection,
                recto: 'Note personnelle 1',
                verso: 'Ceci est une note privée',
                url_recto: null,
                url_verso: null
            }
        ]

        const insertedCards = await db.insert(cardtable).values(seedCards).returning()
        console.log(`✅ ${insertedCards.length} cards seeded\n`);

        console.log("🔑 Seeding collection access...");
        const seedCollectionAccess = [
            { user_id: usersIds.user1, collection_id: collectionsIds.english },
            { user_id: usersIds.user1, collection_id: collectionsIds.math },
            { user_id: usersIds.user1, collection_id: collectionsIds.french },
            { user_id: usersIds.user2, collection_id: collectionsIds.history },
            { user_id: usersIds.user2, collection_id: collectionsIds.privateCollection },
            { user_id: usersIds.user2, collection_id: collectionsIds.french },
            { user_id: usersIds.user2, collection_id: collectionsIds.science },
            { user_id: usersIds.user3, collection_id: collectionsIds.science },
            { user_id: usersIds.user3, collection_id: collectionsIds.english }
        ]

        await db.insert(collectionaccesstable).values(seedCollectionAccess)
        console.log(`✅ ${seedCollectionAccess.length} collection accesses seeded\n`);

        console.log("🔄 Seeding revisions...");
        const now = new Date()
        
        const seedRevisions = [
            {
                card_id: insertedCards[0].card_id,
                user_id: usersIds.user1,
                level_id: 3,
                last_revision_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[1].card_id,
                user_id: usersIds.user1,
                level_id: 1,
                last_revision_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[4].card_id,
                user_id: usersIds.user1,
                level_id: 2,
                last_revision_date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[5].card_id,
                user_id: usersIds.user1,
                level_id: 4,
                last_revision_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[8].card_id,
                user_id: usersIds.user1,
                level_id: 5,
                last_revision_date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[11].card_id,
                user_id: usersIds.user2,
                level_id: 1,
                last_revision_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[12].card_id,
                user_id: usersIds.user2,
                level_id: 3,
                last_revision_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[2].card_id,
                user_id: usersIds.user2,
                level_id: 2,
                last_revision_date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
            },
            {
                card_id: insertedCards[15].card_id,
                user_id: usersIds.user3,
                level_id: 4,
                last_revision_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            }
        ]

        await db.insert(revisiontable).values(seedRevisions)
        console.log(`✅ ${seedRevisions.length} revisions seeded\n`);

        console.log('\n' + '='.repeat(60))
        console.log('🎉 Database seeded successfully!')
        console.log('='.repeat(60))
        console.log('\n📊 Summary:')
        console.log(`   Users: ${seedUsers.length}`)
        console.log(`   Levels: ${seedLevels.length}`)
        console.log(`   Collections: ${seedCollections.length}`)
        console.log(`   Cards: ${insertedCards.length}`)
        console.log(`   Collection Access: ${seedCollectionAccess.length}`)
        console.log(`   Revisions: ${seedRevisions.length}`)
        
        console.log('\n👤 Test Accounts:')
        console.log('   Admin:  admin@memorycard.com / admin123')
        console.log('   User1:  jean.dupont@example.com / password123')
        console.log('   User2:  marie.martin@example.com / password123')
        console.log('   User3:  pierre.bernard@example.com / password123')
        
        console.log('\n📚 Collections:')
        console.log('   Public:  4 collections (French, English, History, Science)')
        console.log('   Private: 2 collections (Math, Private Collection)')
        
        console.log('\n🔄 Spaced Repetition System:')
        console.log('   Level 1: 1 day')
        console.log('   Level 2: 2 days')
        console.log('   Level 3: 4 days')
        console.log('   Level 4: 8 days')
        console.log('   Level 5: 16 days')
        console.log('\n💡 Note: next_review_date is calculated dynamically from last_revision_date + level days')
        console.log('='.repeat(60) + '\n')

    } catch (error) {
        console.error('\n❌ Error seeding database:', error)
        throw error
    }
}

seed()

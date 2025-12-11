import { db } from "./database.js"
import { questiontable, usertable, categoriestable } from "./schema.js"
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

async function seed() {
    try {
        console.log("Seeding database...");
        await db.delete(usertable)

        // 1. Créer les catégories
        const categoriesIds = {
            geographie: uuidv4(),
            histoire: uuidv4(),
            science: uuidv4(),
            litterature: uuidv4(),
            sport: uuidv4()
        }

        const seedCategories = [
            {
                id: categoriesIds.geographie,
                titre: 'Géographie',
                description: 'Questions sur les pays, capitales, océans et continents'
            },
            {
                id: categoriesIds.histoire,
                titre: 'Histoire',
                description: 'Questions sur les événements historiques et personnages célèbres'
            },
            {
                id: categoriesIds.science,
                titre: 'Sciences',
                description: 'Questions sur la physique, chimie, biologie et mathématiques'
            },
            {
                id: categoriesIds.litterature,
                titre: 'Littérature',
                description: 'Questions sur les auteurs, livres et œuvres célèbres'
            },
            {
                id: categoriesIds.sport,
                titre: 'Sport',
                description: 'Questions sur les sports, athlètes et compétitions'
            }
        ]

        await db.insert(categoriestable).values(seedCategories)
        console.log('Categories seeded successfully')

        // 2. Créer des utilisateurs
        const usersIds = {
            admin: uuidv4(),
            user1: uuidv4(),
            user2: uuidv4()
        }

        const seedUsers = [
            {
                id: usersIds.admin,
                nom: 'Admin',
                prenom: 'Super',
                email: 'admin@example.com',
                passwordHash: await bcrypt.hash('admin123', 10),
                role: 'admin'
            },
            {
                id: usersIds.user1,
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@example.com',
                passwordHash: await bcrypt.hash('password123', 10),
                role: 'user'
            },
            {
                id: usersIds.user2,
                nom: 'Martin',
                prenom: 'Marie',
                email: 'marie.martin@example.com',
                passwordHash: await bcrypt.hash('password123', 10),
                role: 'user'
            }
        ]

        await db.insert(usertable).values(seedUsers)
        console.log('Users seeded successfully')

        // 3. Créer les questions avec catégories et créateurs
        const seedQuestions = [
            {
                questionText: 'Quelle est la capitale de la France?',
                answer: 'Paris',
                difficulty: 'easy',
                createdBy: usersIds.admin,
                categorie: categoriesIds.geographie
            },
            {
                questionText: 'Quel est le plus grand océan du monde?',
                answer: "L'océan Pacifique",
                difficulty: 'medium',
                createdBy: usersIds.user1,
                categorie: categoriesIds.geographie
            },
            {
                questionText: 'Qui a écrit "Les Misérables"?',
                answer: 'Victor Hugo',
                difficulty: 'difficult',
                createdBy: usersIds.user2,
                categorie: categoriesIds.litterature
            },
            {
                questionText: 'En quelle année a eu lieu la Révolution française?',
                answer: '1789',
                difficulty: 'medium',
                createdBy: usersIds.admin,
                categorie: categoriesIds.histoire
            },
            {
                questionText: 'Quelle est la formule chimique de l\'eau?',
                answer: 'H2O',
                difficulty: 'easy',
                createdBy: usersIds.user1,
                categorie: categoriesIds.science
            },
            {
                questionText: 'Combien de joueurs compose une équipe de football sur le terrain?',
                answer: '11',
                difficulty: 'easy',
                createdBy: usersIds.user2,
                categorie: categoriesIds.sport
            },
            {
                questionText: 'Qui a écrit "1984"?',
                answer: 'George Orwell',
                difficulty: 'medium',
                createdBy: usersIds.admin,
                categorie: categoriesIds.litterature
            },
            {
                questionText: 'Quelle est la vitesse de la lumière dans le vide?',
                answer: '299 792 458 m/s',
                difficulty: 'difficult',
                createdBy: usersIds.user1,
                categorie: categoriesIds.science
            }
        ]

        await db.insert(questiontable).values(seedQuestions)
        console.log('Questions seeded successfully')

        console.log('Database seeded successfully!')
        console.log('\nComptes créés:')
        console.log('- Admin: admin@example.com / admin123')
        console.log('- User1: jean.dupont@example.com / password123')
        console.log('- User2: marie.martin@example.com / password123')

    } catch (error) {
        console.log('Error seeding database:', error)
    }
}

seed()
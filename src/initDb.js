import { db } from './config/database.js';
import { levels } from './models/schema.js';

const defaultLevels = [
  { levelId: 1, daysBeforeRevision: 1 },   // Level 1: Review after 1 day
  { levelId: 2, daysBeforeRevision: 2 },   // Level 2: Review after 2 days
  { levelId: 3, daysBeforeRevision: 4 },   // Level 3: Review after 4 days
  { levelId: 4, daysBeforeRevision: 8 },   // Level 4: Review after 8 days
  { levelId: 5, daysBeforeRevision: 16 }   // Level 5: Review after 16 days
];

async function initializeDatabase() {
  try {
    console.log('Initializing database with default levels...');
    
    for (const level of defaultLevels) {
      try {
        await db.insert(levels).values(level);
        console.log(`Inserted level ${level.levelId}`);
      } catch (error) {
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
          console.log(`Level ${level.levelId} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();

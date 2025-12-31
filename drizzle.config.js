import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/db/schema.js',
    dialect: 'sqlite',
    dbCredentials: {
        url: `file:${process.env.DB_FILE || 'database.db'}`
    }
})

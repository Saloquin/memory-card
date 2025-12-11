import 'dotenv/config'
import {drizzle} from 'drizzle-orm/libsql'

export const db= drizzle(`file:${process.env.DB_FILE || 'sqlite.db'}`)
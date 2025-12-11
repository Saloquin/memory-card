import {sqliteTable, text, integer, primaryKey} from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid';

export const usertable = sqliteTable('User', {
    user_id: text({length: 36}).primaryKey().$defaultFn(() => uuidv4()),
    email: text().notNull(),
    password: text().notNull(),
    name: text().notNull(),
    first_name: text().notNull(),
    is_admin: integer({mode: 'boolean'}).notNull().default(false)
})

export const leveltable = sqliteTable('Level', {
    level_id: integer().primaryKey(),
    days_before_revision: integer().notNull()
})

export const collectiontable = sqliteTable('Collection', {
    collection_id: text({length: 36}).primaryKey().$defaultFn(() => uuidv4()),
    author_id: text({length: 36}).notNull().references(() => usertable.user_id),
    title: text().notNull(),
    description: text(),
    is_public: integer({mode: 'boolean'}).notNull().default(false)
})

export const cardtable = sqliteTable('Card', {
    card_id: text({length: 36}).primaryKey().$defaultFn(() => uuidv4()),
    collection_id: text({length: 36}).notNull().references(() => collectiontable.collection_id),
    recto: text().notNull(),
    verso: text().notNull(),
    url_recto: text(),
    url_verso: text()
})

export const revisiontable = sqliteTable('Revision', {
    card_id: text({length: 36}).notNull().references(() => cardtable.card_id),
    user_id: text({length: 36}).notNull().references(() => usertable.user_id),
    level_id: integer().notNull().references(() => leveltable.level_id),
    last_revision_date: integer({mode: 'timestamp'}).notNull()
}, (table) => ({
    pk: primaryKey({columns: [table.card_id, table.user_id]})
}))

export const collectionaccesstable = sqliteTable('CollectionAccess', {
    user_id: text({length: 36}).notNull().references(() => usertable.user_id),
    collection_id: text({length: 36}).notNull().references(() => collectiontable.collection_id)
}, (table) => ({
    pk: primaryKey({columns: [table.user_id, table.collection_id]})
}))
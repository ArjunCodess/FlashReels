import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username').notNull(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    imageUrl: varchar('imageUrl'),
})
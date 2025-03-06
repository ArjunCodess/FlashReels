import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username').notNull().unique(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    imageUrl: varchar('imageUrl').unique(),
})

export const Videos = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    script: varchar('script').notNull(),
    audioUrl: varchar('audioUrl').notNull(),
    captions: varchar('captions').notNull(),
    imageUrls: varchar('imageUrls').notNull().array(),
    createdBy: uuid('createdBy').notNull().references(() => Users.id),
})
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username').notNull().unique(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    imageUrl: varchar('imageUrl').unique(),
})

export const Videos = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title').notNull().default('Untitled Video'),
    description: text('description'),
    script: varchar('script').notNull(),
    audioUrl: varchar('audioUrl').notNull(),
    captions: varchar('captions').notNull(),
    imageUrls: varchar('imageUrls').notNull().array(),
    voice: varchar('voice').notNull().default('en-US-JennyNeural'),
    captionStyle: varchar('captionStyle').notNull().default('classic'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    status: varchar('status').notNull().default('generating'),
    createdBy: uuid('createdBy').notNull().references(() => Users.id),
})
import { pgTable, uuid, varchar, timestamp, text, jsonb, primaryKey, index } from "drizzle-orm/pg-core";

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
    script: jsonb('script').notNull(),
    audioUrl: varchar('audioUrl').notNull(),
    captions: jsonb('captions').notNull(),
    imageUrls: varchar('imageUrls').notNull().array(),
    voice: varchar('voice').notNull().default('en-US-JennyNeural'),
    captionStyle: varchar('captionStyle').notNull().default('classic'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    status: varchar('status').notNull().default('generating'),
    downloadUrl: varchar('downloadUrl'),
    createdBy: uuid('createdBy').notNull().references(() => Users.id),
})

export const Favourites = pgTable('favourites', {
    userId: uuid('userId').notNull().references(() => Users.id),
    videoId: uuid('videoId').notNull().references(() => Videos.id),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.videoId] }),
    userIdx: index('favourites_user_idx').on(table.userId),
    videoIdx: index('favourites_video_idx').on(table.videoId),
}))
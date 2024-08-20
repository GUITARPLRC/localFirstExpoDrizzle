import { relations, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import uuid from "react-native-uuid"

export type User = {
	id: string
	name: string | null
	email: string | null
	password: string | null
	avatar: string | null
	avatarTypeId: number | null
	hasSubmittedReview: boolean | null
}

export type listItems = {
	id: string
	userId: string
	title: string
	description: string
	isCompleted: number
	createdAt: string
}

export const user = sqliteTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuid.v4().toString()),
	name: text("name"),
	email: text("email"),
	password: text("password"),
})

export const listItems = sqliteTable("listItems", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuid.v4().toString()),
	userId: text("user_id").notNull(),
	title: text("title"),
	description: text("description"),
	isCompleted: integer("is_completed").notNull().default(0),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
})

// Define relations
export const userRelations = relations(user, ({ one, many }) => ({
	lists: many(listItems),
}))

export const listsRelations = relations(listItems, ({ one, many }) => ({
	user: one(user, {
		fields: [listItems.userId],
		references: [user.id],
	}),
}))

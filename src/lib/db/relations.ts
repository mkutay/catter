import { relations } from "drizzle-orm/relations";
import { posts, postKeywords, postTags } from "./schema";

export const postKeywordsRelations = relations(postKeywords, ({one}) => ({
	post: one(posts, {
		fields: [postKeywords.slug],
		references: [posts.slug]
	}),
}));

export const postsRelations = relations(posts, ({many}) => ({
	postKeywords: many(postKeywords),
	postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({one}) => ({
	post: one(posts, {
		fields: [postTags.slug],
		references: [posts.slug]
	}),
}));
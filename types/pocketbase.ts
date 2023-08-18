/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Comments = "comments",
	Dishes = "dishes",
	Ingredients = "ingredients",
	Instructions = "instructions",
	Likes = "likes",
	Ratings = "ratings",
	Recipes = "recipes",
	Tags = "tags",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CommentsRecord = {
	text: string
	author: RecordIdString
	dish: RecordIdString
}

export type DishesRecord = {
	recipe?: RecordIdString
	author?: RecordIdString
	title: string
	description?: string
	media?: string[]
}

export type IngredientsRecord = {
	name: string
	image?: string
}

export type InstructionsRecord = {
	text: string
	position: number
}

export type LikesRecord = {
	like?: boolean
	author?: RecordIdString
	dish: RecordIdString
}

export type RatingsRecord = {
	stars?: number
	details?: string
	recipe: RecordIdString
	author: RecordIdString
}

export enum RecipesTypeOptions {
	"entrée" = "entrée",
	"plat principal" = "plat principal",
	"dessert" = "dessert",
}
export type RecipesRecord = {
	origin?: string
	author: RecordIdString
	title: string
	ingredients: RecordIdString[]
	instructions: RecordIdString[]
	type?: RecipesTypeOptions
	servings?: number
	totalTime?: number
	thumbnailUrl?: string
	rating?: RecordIdString
	tags?: RecordIdString[]
	thumbnail?: string
}

export type TagsRecord = {
	text: string
}

export type UsersRecord = {
	name?: string
	avatar?: string
	bio?: string
	private?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> & BaseSystemFields<Texpand>
export type DishesResponse<Texpand = unknown> = Required<DishesRecord> & BaseSystemFields<Texpand>
export type IngredientsResponse = Required<IngredientsRecord> & BaseSystemFields
export type InstructionsResponse = Required<InstructionsRecord> & BaseSystemFields
export type LikesResponse<Texpand = unknown> = Required<LikesRecord> & BaseSystemFields<Texpand>
export type RatingsResponse<Texpand = unknown> = Required<RatingsRecord> & BaseSystemFields<Texpand>
export type RecipesResponse<Texpand = unknown> = Required<RecipesRecord> & BaseSystemFields<Texpand>
export type TagsResponse = Required<TagsRecord> & BaseSystemFields
export type UsersResponse = Required<UsersRecord> & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	comments: CommentsRecord
	dishes: DishesRecord
	ingredients: IngredientsRecord
	instructions: InstructionsRecord
	likes: LikesRecord
	ratings: RatingsRecord
	recipes: RecipesRecord
	tags: TagsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	comments: CommentsResponse
	dishes: DishesResponse
	ingredients: IngredientsResponse
	instructions: InstructionsResponse
	likes: LikesResponse
	ratings: RatingsResponse
	recipes: RecipesResponse
	tags: TagsResponse
	users: UsersResponse
}
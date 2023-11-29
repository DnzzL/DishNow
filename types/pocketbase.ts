/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import { type RecordService } from 'pocketbase'

export enum Collections {
	Comments = "comments",
	Dishes = "dishes",
	Favorites = "favorites",
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
	author: RecordIdString
	dish: RecordIdString
	text: string
}

export type DishesRecord = {
	author?: RecordIdString
	description?: string
	media?: string[]
	recipe: RecordIdString
	title: string
}

export type FavoritesRecord = {
	author?: RecordIdString
	favorite?: boolean
	recipe?: RecordIdString
}

export type IngredientsRecord = {
	image?: string
	name: string
}

export type InstructionsRecord = {
	position: number
	text: string
}

export type LikesRecord = {
	author?: RecordIdString
	dish: RecordIdString
	like?: boolean
}

export type RatingsRecord = {
	author: RecordIdString
	details?: string
	recipe: RecordIdString
	stars?: number
}

export enum RecipesTypeOptions {
	"entrée" = "entrée",
	"plat principal" = "plat principal",
	"dessert" = "dessert",
}
export type RecipesRecord = {
	author: RecordIdString
	ingredients: RecordIdString[]
	instructions: RecordIdString[]
	origin?: string
	rating?: RecordIdString
	servings?: number
	tags?: RecordIdString[]
	thumbnail?: string
	thumbnailUrl?: string
	title: string
	totalTime?: number
	type?: RecipesTypeOptions
}

export type TagsRecord = {
	text: string
}

export type UsersRecord = {
	avatar?: string
	bio?: string
	private?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> & BaseSystemFields<Texpand>
export type DishesResponse<Texpand = unknown> = Required<DishesRecord> & BaseSystemFields<Texpand>
export type FavoritesResponse<Texpand = unknown> = Required<FavoritesRecord> & BaseSystemFields<Texpand>
export type IngredientsResponse<Texpand = unknown> = Required<IngredientsRecord> & BaseSystemFields<Texpand>
export type InstructionsResponse<Texpand = unknown> = Required<InstructionsRecord> & BaseSystemFields<Texpand>
export type LikesResponse<Texpand = unknown> = Required<LikesRecord> & BaseSystemFields<Texpand>
export type RatingsResponse<Texpand = unknown> = Required<RatingsRecord> & BaseSystemFields<Texpand>
export type RecipesResponse<Texpand = unknown> = Required<RecipesRecord> & BaseSystemFields<Texpand>
export type TagsResponse<Texpand = unknown> = Required<TagsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	comments: CommentsRecord
	dishes: DishesRecord
	favorites: FavoritesRecord
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
	favorites: FavoritesResponse
	ingredients: IngredientsResponse
	instructions: InstructionsResponse
	likes: LikesResponse
	ratings: RatingsResponse
	recipes: RecipesResponse
	tags: TagsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'comments'): RecordService<CommentsResponse>
	collection(idOrName: 'dishes'): RecordService<DishesResponse>
	collection(idOrName: 'favorites'): RecordService<FavoritesResponse>
	collection(idOrName: 'ingredients'): RecordService<IngredientsResponse>
	collection(idOrName: 'instructions'): RecordService<InstructionsResponse>
	collection(idOrName: 'likes'): RecordService<LikesResponse>
	collection(idOrName: 'ratings'): RecordService<RatingsResponse>
	collection(idOrName: 'recipes'): RecordService<RecipesResponse>
	collection(idOrName: 'tags'): RecordService<TagsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}

package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Create tags collection
		tags := &core.BaseCollection{
			Name: "tags",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.TextField{
					Name: "text",
					Required: true,
				},
			),
		}
		if err := app.Save(tags); err != nil {
			return err
		}

		// Create ingredients collection
		ingredients := &core.BaseCollection{
			Name: "ingredients",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.TextField{
					Name: "name",
					Required: true,
				},
				&core.FileField{
					Name: "image",
					Required: false,
					MaxSelect: 1,
				},
			),
		}
		if err := app.Save(ingredients); err != nil {
			return err
		}

		// Create instructions collection
		instructions := &core.BaseCollection{
			Name: "instructions",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.TextField{
					Name: "text",
					Required: true,
				},
				&core.NumberField{
					Name: "position",
					Required: true,
				},
			),
		}
		if err := app.Save(instructions); err != nil {
			return err
		}

		// Find users collection and add custom fields
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		users.Fields.Add(
			&core.FileField{
				Name: "avatar",
				Required: false,
				MaxSelect: 1,
			},
			&core.TextField{
				Name: "bio",
				Required: false,
			},
			&core.BoolField{
				Name: "private",
				Required: false,
			},
		)
		if err := app.Save(users); err != nil {
			return err
		}

		// Create recipes collection
		recipes := &core.BaseCollection{
			Name: "recipes",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.TextField{
					Name: "origin",
					Required: false,
				},
				&core.RelationField{
					Name: "author",
					Required: true,
					CollectionId: users.Id,
					MaxSelect: 1,
				},
				&core.TextField{
					Name: "title",
					Required: true,
				},
				&core.RelationField{
					Name: "ingredients",
					Required: true,
					CollectionId: ingredients.Id,
					MaxSelect: 0,
				},
				&core.RelationField{
					Name: "instructions",
					Required: true,
					CollectionId: instructions.Id,
					MaxSelect: 0,
				},
				&core.SelectField{
					Name: "type",
					Required: false,
					Values: []string{"entrée", "plat principal", "dessert"},
					MaxSelect: 1,
				},
				&core.NumberField{
					Name: "servings",
					Required: false,
				},
				&core.NumberField{
					Name: "totalTime",
					Required: false,
				},
				&core.TextField{
					Name: "thumbnailUrl",
					Required: false,
				},
				&core.RelationField{
					Name: "rating",
					Required: false,
					CollectionId: "", // Placeholder, will update after ratings collection is created
					MaxSelect: 1,
				},
				&core.RelationField{
					Name: "tags",
					Required: false,
					CollectionId: tags.Id,
					MaxSelect: 0,
				},
				&core.FileField{
					Name: "thumbnail",
					Required: false,
					MaxSelect: 1,
				},
			),
		}
		if err := app.Save(recipes); err != nil {
			return err
		}

		// Create ratings collection
		ratings := &core.BaseCollection{
			Name: "ratings",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.NumberField{
					Name: "stars",
					Required: false,
				},
				&core.TextField{
					Name: "details",
					Required: false,
				},
				&core.RelationField{
					Name: "recipe",
					Required: true,
					CollectionId: recipes.Id,
					MaxSelect: 1,
				},
				&core.RelationField{
					Name: "author",
					Required: true,
					CollectionId: users.Id,
					MaxSelect: 1,
				},
			),
		}
		if err := app.Save(ratings); err != nil {
			return err
		}

		// Update recipes collection to set the rating relation
		ratingField := recipes.Fields.GetByName("rating").(*core.RelationField)
		ratingField.CollectionId = ratings.Id
		if err := app.Save(recipes); err != nil {
			return err
		}

		// Create dishes collection
		dishes := &core.BaseCollection{
			Name: "dishes",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.RelationField{
					Name: "recipe",
					Required: true,
					CollectionId: recipes.Id,
					MaxSelect: 1,
				},
				&core.RelationField{
					Name: "author",
					Required: false,
					CollectionId: users.Id,
					MaxSelect: 1,
				},
				&core.TextField{
					Name: "title",
					Required: true,
				},
				&core.TextField{
					Name: "description",
					Required: false,
				},
				&core.FileField{
					Name: "media",
					Required: false,
					MaxSelect: 0,
				},
			),
		}
		if err := app.Save(dishes); err != nil {
			return err
		}

		// Create comments collection
		comments := &core.BaseCollection{
			Name: "comments",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.TextField{
					Name: "text",
					Required: true,
				},
				&core.RelationField{
					Name: "author",
					Required: true,
					CollectionId: users.Id,
					MaxSelect: 1,
				},
				&core.RelationField{
					Name: "dish",
					Required: true,
					CollectionId: dishes.Id,
					MaxSelect: 1,
				},
			),
		}
		if err := app.Save(comments); err != nil {
			return err
		}

		// Create likes collection
		likes := &core.BaseCollection{
			Name: "likes",
			Type: core.CollectionTypeBase,
			Fields: core.NewFieldsList(
				&core.BoolField{
					Name: "like",
					Required: false,
				},
				&core.RelationField{
					Name: "author",
					Required: false,
					CollectionId: users.Id,
					MaxSelect: 1,
				},
				&core.RelationField{
					Name: "dish",
					Required: true,
					CollectionId: dishes.Id,
					MaxSelect: 1,
				},
			),
		}
		if err := app.Save(likes); err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		// Down migration: delete collections in reverse order and remove custom fields from users
		collections := []string{"likes", "comments", "dishes", "ratings", "recipes", "instructions", "ingredients", "tags"}
		for _, name := range collections {
			collection, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				return err
			}
			if err := app.Delete(collection); err != nil {
				return err
			}
		}

		// Remove custom fields from users collection
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		users.Fields.RemoveByName("avatar")
		users.Fields.RemoveByName("bio")
		users.Fields.RemoveByName("private")
		if err := app.Save(users); err != nil {
			return err
		}

		return nil
	})
}

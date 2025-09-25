package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Update comments collection
		comments, err := app.FindCollectionByNameOrId("comments")
		if err != nil {
			return err
		}
		authorField := comments.Fields.GetByName("author").(*core.RelationField)
		authorField.MaxSelect = 1
		dishField := comments.Fields.GetByName("dish").(*core.RelationField)
		dishField.MaxSelect = 1
		if err := app.Save(comments); err != nil {
			return err
		}

		// Update likes collection
		likes, err := app.FindCollectionByNameOrId("likes")
		if err != nil {
			return err
		}
		likesAuthorField := likes.Fields.GetByName("author").(*core.RelationField)
		likesAuthorField.MaxSelect = 1
		likesDishField := likes.Fields.GetByName("field").(*core.RelationField)
		likesDishField.Name = "dish"
		likesDishField.MaxSelect = 1
		if err := app.Save(likes); err != nil {
			return err
		}

		// Update recipes collection
		recipes, err := app.FindCollectionByNameOrId("recipes")
		if err != nil {
			return err
		}
		field := recipes.Fields.GetByName("field").(*core.UrlField)
		field.Name = "origin"
		field.Type = core.FieldTypeText
		// Add rating field
		ratingField := &core.RelationField{
			Name:         "rating",
			Required:     false,
			CollectionId: "pbc_1608874019", // ratings id
			MaxSelect:    1,
		}
		recipes.Fields.Add(ratingField)
		if err := app.Save(recipes); err != nil {
			return err
		}

		// Update dishes collection
		dishes, err := app.FindCollectionByNameOrId("dishes")
		if err != nil {
			return err
		}
		dishesAuthorField := dishes.Fields.GetByName("author").(*core.RelationField)
		dishesAuthorField.Required = false
		dishesAuthorField.MaxSelect = 1
		if err := app.Save(dishes); err != nil {
			return err
		}

		// Update instructions collection
		instructions, err := app.FindCollectionByNameOrId("instructions")
		if err != nil {
			return err
		}
		positionField := instructions.Fields.GetByName("position").(*core.NumberField)
		positionField.Required = true
		if err := app.Save(instructions); err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		// Down migration: revert changes
		// For simplicity, perhaps not implement down, or implement reversals
		return nil
	})
}

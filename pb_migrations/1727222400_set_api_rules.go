package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Set rules for tags collection
		tags, err := app.FindCollectionByNameOrId("tags")
		if err != nil {
			return err
		}
		tags.ListRule = ""
		tags.ViewRule = ""
		tags.CreateRule = "@request.auth.id != null"
		tags.UpdateRule = "@request.auth.id != null"
		tags.DeleteRule = "@request.auth.id != null"
		if err := app.Save(tags); err != nil {
			return err
		}

		// Set rules for ingredients collection
		ingredients, err := app.FindCollectionByNameOrId("ingredients")
		if err != nil {
			return err
		}
		ingredients.ListRule = ""
		ingredients.ViewRule = ""
		ingredients.CreateRule = "@request.auth.id != null"
		ingredients.UpdateRule = "@request.auth.id != null"
		ingredients.DeleteRule = "@request.auth.id != null"
		if err := app.Save(ingredients); err != nil {
			return err
		}

		// Set rules for instructions collection
		instructions, err := app.FindCollectionByNameOrId("instructions")
		if err != nil {
			return err
		}
		instructions.ListRule = ""
		instructions.ViewRule = ""
		instructions.CreateRule = "@request.auth.id != null"
		instructions.UpdateRule = "@request.auth.id != null"
		instructions.DeleteRule = "@request.auth.id != null"
		if err := app.Save(instructions); err != nil {
			return err
		}

		// Set rules for recipes collection
		recipes, err := app.FindCollectionByNameOrId("recipes")
		if err != nil {
			return err
		}
		recipes.ListRule = ""
		recipes.ViewRule = ""
		recipes.CreateRule = "@request.auth.id != null"
		recipes.UpdateRule = "@request.auth.id != null && author = @request.auth.id"
		recipes.DeleteRule = "@request.auth.id != null && author = @request.auth.id"
		if err := app.Save(recipes); err != nil {
			return err
		}

		// Set rules for ratings collection
		ratings, err := app.FindCollectionByNameOrId("ratings")
		if err != nil {
			return err
		}
		ratings.ListRule = ""
		ratings.ViewRule = ""
		ratings.CreateRule = "@request.auth.id != null"
		ratings.UpdateRule = "@request.auth.id != null && author = @request.auth.id"
		ratings.DeleteRule = "@request.auth.id != null && author = @request.auth.id"
		if err := app.Save(ratings); err != nil {
			return err
		}

		// Set rules for dishes collection
		dishes, err := app.FindCollectionByNameOrId("dishes")
		if err != nil {
			return err
		}
		dishes.ListRule = ""
		dishes.ViewRule = ""
		dishes.CreateRule = "@request.auth.id != null"
		dishes.UpdateRule = "@request.auth.id != null && author = @request.auth.id"
		dishes.DeleteRule = "@request.auth.id != null && author = @request.auth.id"
		if err := app.Save(dishes); err != nil {
			return err
		}

		// Set rules for comments collection
		comments, err := app.FindCollectionByNameOrId("comments")
		if err != nil {
			return err
		}
		comments.ListRule = ""
		comments.ViewRule = ""
		comments.CreateRule = "@request.auth.id != null"
		comments.UpdateRule = "@request.auth.id != null && author = @request.auth.id"
		comments.DeleteRule = "@request.auth.id != null && author = @request.auth.id"
		if err := app.Save(comments); err != nil {
			return err
		}

		// Set rules for likes collection
		likes, err := app.FindCollectionByNameOrId("likes")
		if err != nil {
			return err
		}
		likes.ListRule = ""
		likes.ViewRule = ""
		likes.CreateRule = "@request.auth.id != null"
		likes.UpdateRule = "@request.auth.id != null && author = @request.auth.id"
		likes.DeleteRule = "@request.auth.id != null && author = @request.auth.id"
		if err := app.Save(likes); err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		// Down migration: reset rules to default (empty strings)
		collections := []string{"tags", "ingredients", "instructions", "recipes", "ratings", "dishes", "comments", "likes"}
		for _, name := range collections {
			collection, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				return err
			}
			collection.ListRule = ""
			collection.ViewRule = ""
			collection.CreateRule = ""
			collection.UpdateRule = ""
			collection.DeleteRule = ""
			if err := app.Save(collection); err != nil {
				return err
			}
		}
		return nil
	})
}

import { Pipeline, pipeline } from "@xenova/transformers";
import { CreationType } from "~/types/enums";

export default defineLazyEventHandler(async () => {
  const generator = await pipeline(
    "text2text-generation",
    "Xenova/LaMini-Flan-T5-783M"
  );

  return defineEventHandler(async (event) => {
    const { prompt, creationType } = (await readBody(event)) as {
      prompt: string;
      creationType: CreationType;
    };

    let ingredients = [];
    let instructions = [];

    if (creationType === "generateFromTitle") {
      const {
        ingredients: ingredientsFromAnswer,
        instructions: instructionsFromAnswer,
      } = await titleCreationTypeHandler(prompt, generator);
      ingredients = ingredientsFromAnswer;
      instructions = instructionsFromAnswer;
    } else if (creationType === "generateFromIngredients") {
      const {
        ingredients: ingredientsFromAnswer,
        instructions: instructionsFromAnswer,
      } = await ingredientsCreationTypeHandler(prompt, generator);
      ingredients = ingredientsFromAnswer;
      instructions = instructionsFromAnswer;
    } else {
      throw new Error("Invalid creation type");
    }

    return {
      ingredients,
      instructions,
    };
  });

  async function titleCreationTypeHandler(title: string, generator: Pipeline) {
    const title_input_prompt = `
    Given a recipe title, list the ingredients using grams and generate the instructions using Celsius.
    Title: ${title}
    `;

    const output = await generator(title_input_prompt, {
      temperature: 0.8,
      // num_beams: 2,
      repetition_penalty: 1.1,
      min_new_tokens: 150,
      max_new_tokens: 2500,
    });

    console.log(output);
    const answer = output[0].generated_text.replace(title_input_prompt, "");
    return extractIngredientsAndInstructions(answer);
  }

  async function ingredientsCreationTypeHandler(
    prompt: string,
    generator: Pipeline
  ) {
    const ingredients_input_prompt = `Write a recipe using the following ingredients ${prompt} using Celsius and grams.`;

    const output = await generator(ingredients_input_prompt, {
      temperature: 2,
      // num_beams: 2,
      repetition_penalty: 1.1,
      min_new_tokens: 125,
      max_new_tokens: 1200,
    });

    const answer = output[0].replace(ingredients_input_prompt, "");
    console.log(answer);

    return extractIngredientsAndInstructions(answer);
  }
});

function extractIngredientsAndInstructions(answer: string) {
  const splitted = answer.split("Instructions:");

  const ingredients = splitted[0]
    .replace("Ingredients: ", "")
    .split("- ")
    .filter(Boolean);
  const instructions = splitted[1]
    .replace(/\d+\.\s+/g, "")
    .split(". ")
    .filter(Boolean);

  return {
    ingredients,
    instructions,
  };
}

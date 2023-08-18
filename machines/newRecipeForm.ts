import { RecipesRecord } from "types/pocketbase";
import { assign, createMachine } from "xstate";

export interface MultiStepFormMachineContext {
  originInfo?: OriginInfo;
  contentInfo?: ContentInfo;
  mediaInfo?: MediaInfo;
  errorMessage?: string;
}

interface OriginInfo {
  origin: string;
  url?: string;
  recipe?: Partial<RecipesRecord>;
}

interface ContentInfo {
  title: string;
  servings: number;
  totalTime: number;
  ingredientIds: string[];
  instructionIds: string[];
  tagIds: string[];
}

interface MediaInfo {
  media: File;
}

export type MultiStepFormMachineEvent =
  | {
      type: "BACK";
    }
  | {
      type: "CONFIRM_ORIGIN";
      info: OriginInfo;
    }
  | {
      type: "CONFIRM_CONTENT";
      info: ContentInfo;
    }
  | {
      type: "CONFIRM_MEDIA";
      info: MediaInfo;
    }
  | {
      type: "CONFIRM";
    };

const multiStepFormMachine = createMachine<
  MultiStepFormMachineContext,
  MultiStepFormMachineEvent
>(
  {
    id: "multiStepFormWithValidation",
    initial: "enteringOrigin",
    states: {
      enteringOrigin: {
        initial: "idle",
        id: "enteringOrigin",
        onDone: {
          target: "enteringContent",
        },
        states: {
          idle: {
            exit: ["clearErrorMessage"],
            on: {
              CONFIRM_ORIGIN: {
                target: "submitting",
                actions: ["assignOriginInfoToContext"],
              },
            },
          },
          submitting: {
            invoke: {
              src: (context, event) => {
                return new Promise((resolve, reject) => {
                  if (!context.originInfo)
                    return reject({ message: "No origin info" });
                  if (!context.originInfo.origin)
                    return reject({ message: "No origin" });
                  if (
                    context.originInfo.origin === "external" &&
                    !context.originInfo.url
                  )
                    return reject({ message: "No url" });
                  if (
                    context.originInfo.origin === "external" &&
                    !context.originInfo.recipe
                  )
                    return reject({ message: "No recipe" });
                  return resolve("success");
                });
              },
              onDone: {
                target: "complete",
              },
              onError: {
                target: "idle",
                actions: "assignErrorMessageToContext",
              },
            },
          },
          complete: { type: "final" },
        },
      },
      enteringContent: {
        id: "enteringContent",
        onDone: {
          target: "enteringMedia",
        },
        initial: "idle",
        states: {
          idle: {
            exit: ["clearErrorMessage"],
            on: {
              CONFIRM_CONTENT: {
                target: "submitting",
                actions: ["assignContentToContext"],
              },
              BACK: {
                target: "#enteringOrigin",
              },
            },
          },
          submitting: {
            invoke: {
              src: (context, event) => {
                return new Promise((resolve, reject) => {
                  if (!context.contentInfo)
                    return reject({ message: "No content info" });
                  if (!context.contentInfo.title)
                    return reject({ message: "No title" });
                  if (!context.contentInfo.servings)
                    return reject({ message: "No servings" });
                  if (!context.contentInfo.totalTime)
                    return reject({ message: "No total time" });
                  if (context.contentInfo.ingredientIds?.length === 0)
                    return reject({ message: "No ingredients" });
                  if (context.contentInfo.instructionIds?.length === 0)
                    return reject({ message: "No instructions" });
                  return resolve("success");
                });
              },
              onDone: {
                target: "complete",
              },
              onError: {
                target: "idle",
                actions: "assignErrorMessageToContext",
              },
            },
          },
          complete: { type: "final" },
        },
      },
      enteringMedia: {
        id: "enteringMedia",
        onDone: {
          target: "confirming",
        },
        initial: "idle",
        states: {
          idle: {
            exit: ["clearErrorMessage"],
            on: {
              CONFIRM_MEDIA: {
                target: "submitting",
                actions: ["assignMediaToContext"],
              },
              BACK: {
                target: "#enteringContent",
              },
            },
          },
          submitting: {
            invoke: {
              src: (context, event) => {
                return new Promise((resolve, reject) => {
                  return resolve("success");
                });
              },
              onDone: {
                target: "complete",
              },
              onError: {
                target: "idle",
                actions: "assignErrorMessageToContext",
              },
            },
          },
          complete: { type: "final" },
        },
      },
      confirming: {
        onDone: {
          target: "success",
        },
        initial: "idle",
        states: {
          idle: {
            exit: ["clearErrorMessage"],
            on: {
              CONFIRM: "submitting",
              BACK: {
                target: "#enteringMedia",
              },
            },
          },
          submitting: {
            invoke: {
              src: (context, event) => {
                return new Promise((resolve, reject) => {
                  return resolve("success");
                });
              },
              onDone: {
                target: "complete",
              },
              onError: {
                target: "idle",
                actions: "assignErrorMessageToContext",
              },
            },
          },
          complete: { type: "final" },
        },
      },
      success: {
        type: "final",
      },
    },
  },
  {
    actions: {
      clearErrorMessage: assign({
        errorMessage: undefined,
      }),
      assignMediaToContext: assign((context, event) => {
        if (event.type !== "CONFIRM_MEDIA") return {};
        return {
          mediaInfo: event.info,
        };
      }),
      assignContentToContext: assign((context, event) => {
        if (event.type !== "CONFIRM_CONTENT") return {};
        return {
          contentInfo: event,
        };
      }),
      assignOriginInfoToContext: assign((context, event) => {
        if (event.type !== "CONFIRM_ORIGIN") return {};
        // return whole event except for type property
        return {
          originInfo: event,
        };
      }),
      assignErrorMessageToContext: assign((context, event) => {
        return {
          errorMessage: event.data?.message || "An unknown error occurred",
        };
      }),
    },
  }
);

async function fetchRecipe() {
  try {
    const { data: recipe } = await useFetch("/api/marmiton");
    if (!recipe.value) {
      throw new Error("No recipe found");
    }
    title.value = recipe.value?.title;
    servings.value = recipe.value?.servings || 0;
    ingredients.value = recipe.value?.ingredients;
    instructions.value = recipe.value?.instructions;
  } catch (err) {
    console.log(err);
  }
}

export default multiStepFormMachine;

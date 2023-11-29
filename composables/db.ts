import type { RecordListQueryParams } from "pocketbase";

import type {
  CollectionRecords,
  IngredientsRecord,
  InstructionsRecord,
  InstructionsResponse,
  TagsRecord,
  UsersResponse,
} from "~/types/pocketbase";

export function useDb() {
  const nuxtApp = useNuxtApp();

  type CollectionNames = keyof CollectionRecords;
  type CollectionRecord<T extends CollectionNames> = CollectionRecords[T];

  // Auth functions
  async function login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    await nuxtApp.$pb
      .collection("users")
      .authWithPassword<UsersResponse>(username, password);
  }

  async function signup({
    username,
    email,
    password,
    passwordConfirm,
  }: {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) {
    try {
      const data = {
        username,
        email,
        password,
        passwordConfirm,
      };

      await nuxtApp.$pb.collection("users").create<UsersResponse>(data);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await nuxtApp.$pb.authStore.clear();
  }

  // Generic Helpers functions

  // Helper function to get a record from PocketBase
  async function getRecordById<T>(
    collectionName: CollectionNames,
    recordId: string | undefined,
    params: RecordListQueryParams = {}
  ): Promise<T> {
    const response = await nuxtApp.$pb
      .collection(collectionName)
      .getOne(recordId!, params);
    return response as T;
  }

  // Helper function to get a paginated list of records from PocketBase
  async function getRecordList<T>(
    collectionName: CollectionNames,
    {
      page = 1,
      perPage = 10,
      params = {},
    }: {
      page?: number;
      perPage?: number;
      params?: RecordListQueryParams;
    }
  ) {
    const response = await nuxtApp.$pb
      .collection(collectionName)
      .getList(page, perPage, params);
    return response.items as T[];
  }

  // Helper function to get the first record from PocketBase
  async function getRecordFirstListItem<T>(
    collectionName: CollectionNames,
    params: RecordListQueryParams = {}
  ) {
    const response = await nuxtApp.$pb
      .collection(collectionName)
      .getList(1, 1, params);
    return response.items[0] as T;
  }

  // Helper function to get full list of records from PocketBase
  async function getRecordFullList<T>(
    collectionName: CollectionNames,
    params: RecordListQueryParams = {}
  ) {
    const response = await nuxtApp.$pb
      .collection(collectionName)
      .getFullList(undefined, params);
    return response as T[];
  }

  // Helper function to create a record from PocketBase
  async function createRecord<T>(
    collectionName: CollectionNames,
    newRecord: CollectionRecords[CollectionNames]
  ) {
    const response = await nuxtApp.$pb
      .collection(collectionName)
      .create<CollectionRecords[CollectionNames]>(newRecord);
    return response as T;
  }

  // Helper function to create a record from PocketBase if it doesn't exist
  // otherwise return the existing record
  async function createIfNotExists<T>(
    collection: string,
    filter: string,
    data: T
  ) {
    let itemId = "";

    try {
      const item = (await nuxtApp.$pb
        .collection(collection)
        .getFirstListItem<T>(filter, { $autoCancel: false })) as T & {
        id: string;
      };
      itemId = item.id;
    } catch (e) {
      try {
        const newIem = (await nuxtApp.$pb
          .collection(collection)
          .create<T>(data as any)) as T & {
          id: string;
        };
        itemId = newIem.id;
      } catch (e) {
        console.error(e);
      }
    }

    return itemId;
  }

  // Helper function to update a record from PocketBase
  async function updateRecord<T>(
    collectionName: CollectionNames,
    recordId: string,
    updatedRecord: Partial<CollectionRecords[CollectionNames]>
  ) {
    const response = await nuxtApp.$pb
      .collection(collectionName)
      .update<CollectionRecords[CollectionNames]>(recordId, updatedRecord);
    return response as T;
  }

  // Helper function to delete a record from PocketBase
  async function deleteRecord<T>(
    collectionName: CollectionNames,
    recordId: string
  ) {
    const response = await nuxtApp.$pb
      .collection(collectionName)
      .delete(recordId);
    return response as T;
  }

  async function getImageUrl(
    entity: any,
    attribute: any,
    options = {
      thumb: "100x250",
    }
  ) {
    return nuxtApp.$pb.files.getUrl(entity, attribute, options);
  }

  // Specific helpers functions
  async function createIngredients(
    ingredientNames: string[]
  ): Promise<string[]> {
    let ingredientIds: string[] = [];
    for (const ingredient of ingredientNames) {
      const createdIngredientId = await createIfNotExists<IngredientsRecord>(
        "ingredients",
        `name="${ingredient}"`,
        {
          name: ingredient,
        }
      );
      ingredientIds.push(createdIngredientId);
    }
    return ingredientIds;
  }

  async function createInstructions(
    instructionTexts: string[]
  ): Promise<string[]> {
    let instructionIds: string[] = [];
    for (const [i, instruction] of instructionTexts.entries()) {
      const createdInstruction = await createRecord<InstructionsResponse>(
        "instructions",
        {
          text: instruction,
          position: i + 1,
        } as InstructionsRecord
      );
      instructionIds.push(createdInstruction.id);
    }
    return instructionIds;
  }

  async function createTags(tagNames: string[]): Promise<string[]> {
    let tagIds: string[] = [];
    for (const tag of tagNames) {
      const createdTagId = await createIfNotExists<TagsRecord>(
        "tags",
        `text="${tag}"`,
        {
          text: tag,
        }
      );
      tagIds.push(createdTagId);
    }
    return tagIds;
  }

  return {
    login,
    signup,
    logout,
    createIngredients,
    createInstructions,
    createTags,
    getRecordById,
    getRecordList,
    getRecordFirstListItem,
    getRecordFullList,
    createRecord,
    createIfNotExists,
    updateRecord,
    deleteRecord,
    getImageUrl,
  };
}

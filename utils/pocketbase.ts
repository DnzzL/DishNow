import PocketBase, { RecordListQueryParams } from "pocketbase";
import type { CollectionRecords, UsersResponse } from "../types/pocketbase";

export type CollectionNames = keyof CollectionRecords;
export type CollectionRecord<T extends CollectionNames> = CollectionRecords[T];

export async function login({
  pb,
  username,
  password,
}: {
  pb: PocketBase;
  username: string;
  password: string;
}) {
  await pb
    .collection("users")
    .authWithPassword<UsersResponse>(username, password);
}

export async function signup({
  pb,
  username,
  password,
  passwordConfirm,
  name,
}: {
  pb: PocketBase;
  username: string;
  password: string;
  passwordConfirm: string;
  name: string;
}) {
  try {
    const data = {
      username,
      password,
      passwordConfirm,
      name,
    };

    await pb.collection("users").create<UsersResponse>(data);
  } catch (error) {
    throw error;
  }
}

export async function logout(pb: PocketBase) {
  await pb.authStore.clear();
}

// Helper function to get a record from PocketBase
export async function getRecordById<T>(
  pbInstance: PocketBase,
  collectionName: CollectionNames,
  recordId: string | undefined,
  params: RecordListQueryParams = {}
): Promise<T> {
  const response = await pbInstance
    .collection(collectionName)
    .getOne(recordId!, params);
  return response as T;
}

// Helper function to get a paginated list of records from PocketBase
export async function getRecordList<T>(
  pbInstance: PocketBase,
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
  const response = await pbInstance
    .collection(collectionName)
    .getList(page, perPage, params);
  return response.items as T[];
}

// Helper function to get the first record from PocketBase
export async function getRecordFirstListItem<T>(
  pbInstance: PocketBase,
  collectionName: CollectionNames,
  params: RecordListQueryParams = {}
) {
  const response = await pbInstance
    .collection(collectionName)
    .getList(1, 1, params);
  return response.items[0] as T;
}

// Helper function to get full list of records from PocketBase
export async function getRecordFullList<T>(
  pbInstance: PocketBase,
  collectionName: CollectionNames,
  params: RecordListQueryParams = {}
) {
  const response = await pbInstance
    .collection(collectionName)
    .getFullList(undefined, params);
  return response as T[];
}

// Helper function to create a record from PocketBase
export async function createRecord<T>(
  pbInstance: PocketBase,
  collectionName: CollectionNames,
  newRecord: CollectionRecords[CollectionNames]
) {
  const response = await pbInstance
    .collection(collectionName)
    .create<CollectionRecords[CollectionNames]>(newRecord);
  return response as T;
}

// Helper function to create a record from PocketBase if it doesn't exist
// otherwise return the existing record
export async function createIfNotExists<T>(
  pbInstance: PocketBase,
  collection: string,
  filter: string,
  data: T
) {
  let itemId = "";

  try {
    const item = (await pbInstance
      .collection(collection)
      .getFirstListItem<T>(filter, { $autoCancel: false })) as T & {
      id: string;
    };
    itemId = item.id;
  } catch (e) {
    try {
      const newIem = (await pbInstance
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
export async function updateRecord<T>(
  pbInstance: PocketBase,
  collectionName: CollectionNames,
  recordId: string,
  updatedRecord: CollectionRecords[CollectionNames]
) {
  const response = await pbInstance
    .collection(collectionName)
    .update<CollectionRecords[CollectionNames]>(recordId, updatedRecord);
  return response as T;
}

// Helper function to delete a record from PocketBase
export async function deleteRecord<T>(
  pbInstance: PocketBase,
  collectionName: CollectionNames,
  recordId: string
) {
  const response = await pbInstance.collection(collectionName).delete(recordId);
  return response as T;
}

export async function getImageUrl(
  pbInstance: PocketBase,
  entity: any,
  attribute: any,
  options = {
    thumb: "100x250",
  }
) {
  return pbInstance.files.getUrl(entity, attribute, options);
}

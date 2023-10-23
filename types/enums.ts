export const CreationTypeList = [
  "generateFromTitle",
  "generateFromIngredients",
  "createFromURL",
  "createFromScratch",
] as const;

export type CreationType = (typeof CreationTypeList)[number];

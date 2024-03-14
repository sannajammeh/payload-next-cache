import { revalidateTag } from "next/cache";
import { type GeneratedTypes } from "payload";
import { type CollectionAfterChangeHook, type TypeWithID } from "payload/types";
import type { CollectionKeys, LoggingConfig, RevalidateOptions } from "./types";
import { logger, loggingEnabled } from "./logging";

interface RevalidateArgs<T extends TypeWithID> {
  fields?: Exclude<keyof T, "id">[];
  logging?: LoggingConfig;
}

export const getFieldTag = <T extends keyof GeneratedTypes["collections"]>(
  collection: T,
  field: string | number
) => {
  return `${collection}-${field}`;
};

export const revalidateHook = <T extends TypeWithID>({
  fields = [],
  logging,
}: RevalidateArgs<T> = {}): CollectionAfterChangeHook<T> => {
  const hook: CollectionAfterChangeHook<T> = ({ doc, collection }) => {
    const fieldTags = fields.map((field) => `${collection.slug}-${doc[field]}`);
    const tagsToInvalidate: string[] = [
      collection.slug,
      getFieldTag(collection.slug as CollectionKeys, doc.id),
      ...fieldTags,
    ];

    for (const tag of tagsToInvalidate) {
      revalidateTag(tag);
    }

    loggingEnabled(logging) && logger.log("Revalidated", tagsToInvalidate);
  };

  return hook;
};

type Revalidate = NonNullable<RevalidateOptions>["revalidate"];

export const getPreferredRevalidate = (
  rev0?: Revalidate,
  rev1?: Revalidate
) => {
  if (rev0 === false || rev1 === false) return false;

  return rev0 ?? rev1;
};

import { revalidateTag } from "next/cache";
import {
  type CollectionAfterChangeHook,
  type GlobalAfterChangeHook,
  type TypeWithID,
} from "payload/types";
import type {
  CollectionKeys,
  GlobalKeys,
  LoggingConfig,
  RevalidateOptions,
} from "./types";
import { logger, loggingEnabled } from "./logging";
import { dedupe } from "./dedupe";

interface RevalidateArgs<T extends TypeWithID> {
  fields?: Exclude<keyof T, "id">[];
  tags?: string[];
  logging?: LoggingConfig;
}

export const getFieldTag = <T extends CollectionKeys>(
  collection: T,
  fieldName: string | number | symbol,
  field: string | number
) => {
  return `${collection}-${String(fieldName)}-${field}`;
};
export const getGlobalFieldTag = <T extends GlobalKeys>(
  global: T,
  fieldName: string | number | symbol,
  field: string | number
) => {
  return `global-${global}-${String(fieldName)}-${field}`;
};

export const revalidateHook = <T extends TypeWithID>({
  fields = [],
  logging,
  tags: additionalTags = [],
}: RevalidateArgs<T> = {}): CollectionAfterChangeHook<T> => {
  const hook: CollectionAfterChangeHook<T> = ({ doc, collection }) => {
    const fieldTags = fields.map((field) =>
      getFieldTag(collection.slug as CollectionKeys, field, String(doc[field]))
    );
    const tagsToInvalidate: string[] = dedupe([
      collection.slug,
      getFieldTag(collection.slug as CollectionKeys, "id", doc.id),
      ...fieldTags,
      ...additionalTags,
    ]);

    for (const tag of tagsToInvalidate) {
      revalidateTag(tag);
    }

    loggingEnabled(logging) && logger.log("Revalidated", tagsToInvalidate);
  };

  return hook;
};

export const globalRevalidateHook = <T extends TypeWithID>({
  fields = [],
  logging,
  tags: additionalTags = [],
}: RevalidateArgs<T>) => {
  const hook: GlobalAfterChangeHook = ({ doc, global }) => {
    const fieldTags = fields.map((field) =>
      getGlobalFieldTag(global.slug as GlobalKeys, field, String(doc[field]))
    );
    const tagsToInvalidate: string[] = dedupe([
      global.slug,
      getGlobalFieldTag(global.slug as GlobalKeys, "id", doc.id),
      ...fieldTags,
      ...additionalTags,
    ]);

    for (const tag of tagsToInvalidate) {
      revalidateTag(tag);
    }

    loggingEnabled(logging) &&
      logger.log("Revalidated Global", tagsToInvalidate);
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

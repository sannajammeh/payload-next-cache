import "server-only";

import { GeneratedTypes, Payload } from "payload";

import { unstable_cache as cache } from "next/cache";
import { getFieldTag } from "./payloadCache";
import { getPayload } from "./get-payload";
import {
  unstable_createQueryTags,
  unstable_getCollectionCacheConfig,
} from "./unstable_getCollectionCache";
import { logTags } from "./logging";
import { GlobalArgs, find, findById, findGlobal } from "./queries";

type RevalidateOptions = Parameters<typeof cache>[2] & {
  logging?: boolean | "development";
};

type FindArgs = Parameters<Payload["find"]>[0];
type FindByIDArgs = Parameters<Payload["findByID"]>[0];
type CollectionKeys = keyof GeneratedTypes["collections"];
type GlobalKeys = keyof GeneratedTypes["globals"];
type Revalidate = NonNullable<RevalidateOptions>["revalidate"];

const getPreferredRevalidate = (rev0?: Revalidate, rev1?: Revalidate) => {
  if (rev0 === false || rev1 === false) return false;

  return rev0 ?? rev1;
};

const cached_findMany = async <T extends CollectionKeys>(
  args: FindArgs & { collection: T },
  options?: RevalidateOptions
) => {
  const cacheConfig = await unstable_getCollectionCacheConfig(args.collection);

  const find: Payload["find"] = async (args) => {
    const payload = await getPayload();

    const data = await payload.find(args);
    return data;
  };

  const tags = [args.collection, ...(options?.tags ?? [])];

  const keyParts = ["find", args.collection];
  const getData = cache(find, keyParts, {
    tags,
    revalidate: getPreferredRevalidate(
      options?.revalidate,
      cacheConfig?.revalidate
    ),
  });

  const result = await getData(args);
  logTags(keyParts, tags, cacheConfig);
  return result;
};

const cached_findOne = async <T extends CollectionKeys>(
  args: FindArgs & { collection: T },
  options?: RevalidateOptions
) => {
  const cacheConfig = await unstable_getCollectionCacheConfig(args.collection);

  const tags = unstable_createQueryTags(args.collection, {
    where: args.where,
    cacheConfig,
    localConfig: options,
  });
  const keyParts = ["findOne", args.collection];

  const getData = cache(find, keyParts, {
    tags: tags,
    revalidate: getPreferredRevalidate(
      options?.revalidate,
      cacheConfig?.revalidate
    ),
  });

  const result = await getData({ ...args, pagination: false, limit: 1 });
  logTags(keyParts, tags, cacheConfig);
  return result.docs[0];
};

const cached_findByID = async <T extends CollectionKeys>(
  args: FindByIDArgs & { collection: T },
  options?: RevalidateOptions
) => {
  const cacheConfig = await unstable_getCollectionCacheConfig(args.collection);

  const tags = [
    getFieldTag(args.collection, args.id),
    ...(options?.tags ?? []),
  ];
  const keyParts = ["findById", args.collection];

  const getData = cache(findById, keyParts, {
    tags,
    revalidate: getPreferredRevalidate(
      options?.revalidate,
      cacheConfig?.revalidate
    ),
  });

  const result = await getData(args);
  logTags(keyParts, tags, cacheConfig);
  return result;
};

const cached_findGlobal = async <T extends GlobalKeys>(
  args: GlobalArgs & { slug: T },
  options?: RevalidateOptions
) => {
  // TODO No config for globals
  const tags = [args.slug, ...(options?.tags ?? [])];
  const keyParts = ["findGlobal", args.slug];

  const getData = cache(findGlobal, keyParts, {
    tags,
    revalidate: options?.revalidate,
  });

  const result = await getData(args);
  logTags(keyParts, tags, {
    logging: options?.logging,
  });
  return result;
};

export {
  cached_findOne as findOne,
  cached_findMany as findMany,
  cached_findByID as findByID,
  cached_findGlobal as findGlobal,
};

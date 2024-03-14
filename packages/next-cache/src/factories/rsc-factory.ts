import "server-only";

import { unstable_cache as cache } from "next/cache";
import { getFieldTag, getPreferredRevalidate } from "../utils/cache-helpers";

import {
  unstable_createQueryTags,
  unstable_getCacheConfigFactory,
} from "./cache";
import { logTags } from "../utils/logging";

import {
  type GlobalArgs,
  _findFactory,
  _findByIDFactory,
  _findGlobalFactory,
  type FindArgs,
  type FindByIDArgs,
} from "./query-factory";

import {
  type GetPayload,
  type GetPayloadConfig,
  type RevalidateOptions,
  type CollectionKeys,
  type GlobalKeys,
} from "../utils/types";

export const findManyFactory = (
  getPayload: GetPayload,
  getPayloadConfig: GetPayloadConfig
) => {
  const unstable_getCollectionCacheConfig =
    unstable_getCacheConfigFactory(getPayloadConfig);

  const find = _findFactory(getPayload);

  const cached_findMany = async <T extends CollectionKeys>(
    args: FindArgs & { collection: T },
    options?: RevalidateOptions
  ) => {
    const cacheConfig = await unstable_getCollectionCacheConfig(
      args.collection
    );

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
    logTags(keyParts, tags, cacheConfig, options);
    return result;
  };

  return cached_findMany;
};

export const findOneFactory = (
  getPayload: GetPayload,
  getPayloadConfig: GetPayloadConfig
) => {
  const unstable_getCollectionCacheConfig =
    unstable_getCacheConfigFactory(getPayloadConfig);

  const find = _findFactory(getPayload);

  const cached_findOne = async <T extends CollectionKeys>(
    args: FindArgs & { collection: T },
    options?: RevalidateOptions
  ) => {
    const cacheConfig = await unstable_getCollectionCacheConfig(
      args.collection
    );

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
    logTags(keyParts, tags, cacheConfig, options);
    return result.docs[0];
  };

  return cached_findOne;
};

export const findByIdFactory = (
  getPayload: GetPayload,
  getPayloadConfig: GetPayloadConfig
) => {
  const unstable_getCollectionCacheConfig =
    unstable_getCacheConfigFactory(getPayloadConfig);

  const findByID = _findByIDFactory(getPayload);

  const cached_findByID = async <T extends CollectionKeys>(
    args: FindByIDArgs & { collection: T },
    options?: RevalidateOptions
  ) => {
    const cacheConfig = await unstable_getCollectionCacheConfig(
      args.collection
    );

    const tags = [
      getFieldTag(args.collection, args.id),
      ...(options?.tags ?? []),
    ];
    const keyParts = ["findById", args.collection];

    const getData = cache(findByID, keyParts, {
      tags,
      revalidate: getPreferredRevalidate(
        options?.revalidate,
        cacheConfig?.revalidate
      ),
    });

    const result = await getData(args);
    logTags(keyParts, tags, cacheConfig, options);
    return result;
  };

  return cached_findByID;
};

export const findGlobalFactory = (getPayload: GetPayload) => {
  const findGlobal = _findGlobalFactory(getPayload);

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
    logTags(keyParts, tags, undefined, options);
    return result;
  };

  return cached_findGlobal;
};
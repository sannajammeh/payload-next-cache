import "server-only";

import { unstable_cache as cache } from "next/cache";
import { getFieldTag, getPreferredRevalidate } from "../utils/cache-helpers";

import {
  unstable_createQueryTags,
  unstable_getCacheConfigFactory,
  unstable_getGlobalCacheConfigFactory,
} from "./cache/cache-config-factory";
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
import { dedupe } from "../utils/dedupe";
import type { PaginatedDocs } from "payload";
import type { GeneratedTypes } from "payload";

export type CachedFindMany = <T extends CollectionKeys>(
  args: FindArgs & { collection: T },
  options?: RevalidateOptions
) => Promise<PaginatedDocs<GeneratedTypes["collections"][T]>>;

export const findManyFactory = (
  getPayload: GetPayload,
  getPayloadConfig: GetPayloadConfig
): CachedFindMany => {
  const unstable_getCollectionCacheConfig =
    unstable_getCacheConfigFactory(getPayloadConfig);

  const find = _findFactory(getPayload);

  /**
   * Deployment wide caching for `payload.find()`
   */
  const cached_findMany: CachedFindMany = async (args, options) => {
    const cacheConfig = await unstable_getCollectionCacheConfig(
      String(args.collection)
    );

    const tags = dedupe([
      String(args.collection),
      ...(options?.tags ?? []),
    ]) as string[];

    const keyParts = ["find", String(args.collection)];
    const getData = cache(find, keyParts, {
      tags: tags,
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

export type CachedFindOne = <T extends CollectionKeys>(
  args: FindArgs & { collection: T },
  options?: RevalidateOptions
) => Promise<GeneratedTypes["collections"][T]>;
export const findOneFactory = (
  getPayload: GetPayload,
  getPayloadConfig: GetPayloadConfig
): CachedFindOne => {
  const unstable_getCollectionCacheConfig =
    unstable_getCacheConfigFactory(getPayloadConfig);

  const find = _findFactory(getPayload);

  /**
   * Deployment wide caching for `payload.find({limit: 1})`
   */
  const cached_findOne: CachedFindOne = async (args, options) => {
    const cacheConfig = await unstable_getCollectionCacheConfig(
      String(args.collection)
    );

    const tags = unstable_createQueryTags(args.collection, {
      where: args.where,
      cacheConfig,
      localConfig: options,
    }) as string[];
    const keyParts = ["findOne", String(args.collection)];

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

export type CachedFindById = <T extends CollectionKeys>(
  args: FindByIDArgs & { collection: T },
  options?: RevalidateOptions
) => Promise<GeneratedTypes["collections"][T]>;
export const findByIdFactory = (
  getPayload: GetPayload,
  getPayloadConfig: GetPayloadConfig
): CachedFindById => {
  const unstable_getCollectionCacheConfig =
    unstable_getCacheConfigFactory(getPayloadConfig);

  const findByID = _findByIDFactory(getPayload);
  /**
   * Deployment wide caching for `payload.findByID()`
   */
  const cached_findByID: CachedFindById = async (args, options) => {
    const cacheConfig = await unstable_getCollectionCacheConfig(
      String(args.collection)
    );

    const tags = dedupe([
      getFieldTag(args.collection, "id", args.id),
      ...(options?.tags ?? []),
    ]) as string[];
    const keyParts = ["findById", String(args.collection)];

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

export type CachedFindGlobal = <T extends GlobalKeys>(
  args: GlobalArgs & { slug: T },
  options?: RevalidateOptions
) => Promise<GeneratedTypes["globals"][T]>;
export const findGlobalFactory = (
  getPayload: GetPayload,
  getPayloadConfig: GetPayloadConfig
): CachedFindGlobal => {
  const findGlobal = _findGlobalFactory(getPayload);
  const getGlobalCacheConfig =
    unstable_getGlobalCacheConfigFactory(getPayloadConfig);

  /**
   * Deployment wide caching for `payload.findGlobal()`
   */
  const cached_findGlobal: CachedFindGlobal = async (args, options) => {
    const cacheConfig = await getGlobalCacheConfig(String(args.slug));

    const tags = dedupe([
      args.slug as string,
      ...(options?.tags ?? []),
    ]) as string[];
    const keyParts = ["findGlobal", String(args.slug)];

    const revalidate = getPreferredRevalidate(
      options?.revalidate,
      cacheConfig?.revalidate
    );

    const getData = cache(findGlobal, keyParts, {
      tags,
      revalidate,
    });

    const result = await getData(args);
    logTags(keyParts, tags, cacheConfig, options);
    return result;
  };

  return cached_findGlobal;
};

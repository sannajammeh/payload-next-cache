import "server-only";
import { unstable_cache } from "next/cache";
import {
  type Where,
  type WhereField,
  type SanitizedCollectionConfig,
  type SanitizedGlobalConfig,
} from "payload/types";
import {
  type RevalidateOptions,
  type CacheProps,
  type CollectionKeys,
  type GetPayloadConfig,
} from "../../utils/types";
import { getFieldTag } from "../../utils/cache-helpers";
import { logger } from "../../utils/logging";
import { dedupe } from "../../utils/dedupe";

type CacheConfig = {
  custom?: {
    cache?: CacheProps;
    [key: string]: any;
  };
};

type CacheableCollection = SanitizedCollectionConfig & CacheConfig;
type CacheableGlobal = SanitizedGlobalConfig & CacheConfig;

function _cacheConfigFactory(
  getPayloadConfig: GetPayloadConfig,
  type: "collections" | "globals"
) {
  const getCacheConfig = async (slug: string) => {
    const config = await getPayloadConfig();

    const collection = config[type].find((c) => c.slug === slug) as
      | CacheableCollection
      | undefined;

    return collection?.custom?.cache;
  };

  return getCacheConfig;
}

const deploymentID = !!process.env.NEXT_DEPLOYMENT_ID
  ? [process.env.NEXT_DEPLOYMENT_ID]
  : [];

/**
 * Creates a factory function to get cache config for collections
 */
export function unstable_getCacheConfigFactory(
  getPayloadConfig: GetPayloadConfig
) {
  const getCacheConfig = _cacheConfigFactory(getPayloadConfig, "collections");
  /**
   * Caches config at build time with deploymentID for instant access
   */
  const unstable_getCollectionCacheConfig = (slug: string) => {
    return unstable_cache(getCacheConfig, [
      "collection-cache",
      ...deploymentID,
    ])(slug);
  };

  return unstable_getCollectionCacheConfig;
}

/**
 * Creates a factory function to get cache config for globals
 */
export function unstable_getGlobalCacheConfigFactory(
  getPayloadConfig: GetPayloadConfig
) {
  const getCacheConfig = _cacheConfigFactory(getPayloadConfig, "globals");
  /**
   * Caches config at build time with deploymentID for instant access
   */
  const unstable_getGlobalCacheConfig = (slug: string) => {
    return unstable_cache(getCacheConfig, ["global-cache", ...deploymentID])(
      slug
    );
  };

  return unstable_getGlobalCacheConfig;
}

export const unstable_createQueryTags = (
  collectionName: CollectionKeys,
  {
    cacheConfig,
    localConfig,
    where,
  }: {
    cacheConfig?: CacheProps;
    localConfig?: RevalidateOptions;
    where?: Where;
  } = {}
) => {
  const tags = [...(localConfig?.tags ?? []), ...(cacheConfig?.tags ?? [])];

  if (Array.isArray(where)) {
    arrayWarning();
    return dedupe(tags);
  }

  if (cacheConfig?.fields) {
    for (const field of cacheConfig.fields) {
      const fieldQuery = where?.[field];
      if (fieldQuery) {
        if (Array.isArray(fieldQuery)) {
          arrayWarning();
          continue;
        }

        const tagValues = mapWhereToTags(fieldQuery);
        for (const value of tagValues) {
          if (value) tags.push(getFieldTag(collectionName, field, value));
        }
      }
    }
  }

  return dedupe(tags);
};

function mapWhereToTags(where: WhereField) {
  if (where.equals && typeof where.equals === "string") {
    return [where.equals];
  }

  if (where.in && Array.isArray(where.in)) {
    return where.in as string[];
  }

  return [];
}

const arrayWarning = () => {
  if (process.env.NODE_ENV !== "development") return;
  logger.warn(
    "[payload-cache]: Unable to tag array where clauses, manually set tags",
    {
      tags: ["tag1", "tag2"],
    },
    "instead"
  );
};

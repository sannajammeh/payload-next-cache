import { type Plugin } from "payload/config";
import { type CollectionConfig, type Field } from "payload/types";
import { revalidateHook } from "./utils/cache-helpers";
import type { CollectionCacheProps } from "./utils/types";

interface CacheableCollection extends CollectionConfig {
  fields: Array<Field & { unique?: boolean; index?: boolean; name?: string }>;
}

interface CollectionCacheConfig {
  /**
   * Custom fields to revalidate
   */
  fields?: string[];
  /**
   * Revalidate time in seconds. If not set it will cache indefinitely
   * or follow api call level cache
   */
  revalidate?: number;
  /**
   * Additional cache tags to add to the collection
   */
  tags?: string[];
  /**
   * Automatically tag fields that are unique or indexed
   */
  auto?: boolean;

  /**
   * Set the logging level for this collection
   */
  logging?: boolean | "development";
}
interface PluginOptions {
  collections: Record<string, CollectionCacheConfig>;
}

/**
 * Payload plugin to add auto cache configuration to collections
 *
 * @example
 * // payload.config.ts
 * import { nextCache } from '@payloadcms/next-cache/plugin';
 * {
 *  // ...config,
 *  plugins: [
 *   nextCache({
 *    collections: {
 *     [Pages.slug]: {
 *       logging: "development",
 *     }
 *   })
 *  ]
 * }
 */
export const nextCache =
  (options: PluginOptions): Plugin =>
  (initialConfig) => {
    const config = { ...initialConfig };

    for (const [
      slug,
      { auto: autoTag = true, fields = [], revalidate, tags, logging },
    ] of Object.entries(options.collections)) {
      const collection = config.collections?.find((c) => c.slug === slug) as
        | CacheableCollection
        | undefined;
      if (!collection) {
        console.warn(
          "[Next_Cache_Plugin]: Collection not found for slug: ",
          slug
        );
        continue;
      }

      const fieldsToRevalidate = !autoTag
        ? []
        : collection.fields
            .filter((field) => {
              if (!field.name) return;
              if ("index" in field) {
                return !!field.index;
              }
              if ("unique" in field) {
                return !!field.unique;
              }
            })
            .map((field) => field.name!);

      collection.hooks ||= {};
      collection.hooks.afterChange ||= [];

      collection.hooks.afterChange.push(
        revalidateHook({ fields: [...fieldsToRevalidate, ...fields], logging })
      );

      // Set the cache config
      collection.custom ||= {};
      collection.custom.cache = <CollectionCacheProps>{
        revalidate,
        tags,
        fields: [...fieldsToRevalidate, ...fields],
        logging,
      };
    }
    return config;
  };

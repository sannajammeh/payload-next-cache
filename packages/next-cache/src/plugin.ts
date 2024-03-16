import { type Plugin } from "payload/config";
import {
  type CollectionConfig,
  type Field,
  type GlobalConfig,
} from "payload/types";
import { globalRevalidateHook, revalidateHook } from "./utils/cache-helpers";
import type { CacheProps } from "./utils/types";
import { dedupe } from "./utils/dedupe";

interface CacheableCollection extends CollectionConfig {
  fields: Array<Field & { unique?: boolean; index?: boolean; name?: string }>;
}

interface CacheableGlobal extends GlobalConfig {
  fields: Array<Field & { unique?: boolean; index?: boolean; name?: string }>;
}

export interface PluginCacheConfig {
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
  collections?: Record<string, PluginCacheConfig>;
  globals?: Record<string, PluginCacheConfig>;
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

    const collectionEntries = Object.entries(options.collections ?? {});
    const globalEntries = Object.entries(options.globals ?? {});

    for (const [
      slug,
      { auto: autoTag = true, fields = [], revalidate, tags, logging },
    ] of collectionEntries) {
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
        revalidateHook({
          fields: dedupe([...fieldsToRevalidate, ...fields]),
          tags,
          logging,
        })
      );

      // Set the cache config
      collection.custom ||= {};
      collection.custom.cache = <CacheProps>{
        revalidate,
        tags,
        fields: dedupe([...fieldsToRevalidate, ...fields]),
        logging,
      };
    }

    for (const [
      slug,
      { auto: autoTag = true, fields = [], revalidate, tags, logging },
    ] of globalEntries) {
      const global = config.globals?.find((c) => c.slug === slug) as
        | CacheableGlobal
        | undefined;
      if (!global) {
        console.warn("[Next_Cache_Plugin]: Global not found for slug: ", slug);
        continue;
      }

      const fieldsToRevalidate = !autoTag
        ? []
        : global.fields
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

      global.hooks ||= {};
      global.hooks.afterChange ||= [];

      global.hooks.afterChange.push(
        globalRevalidateHook({
          fields: dedupe([
            ...fieldsToRevalidate,
            ...fields,
          ]) as unknown as never[],
          tags,
          logging,
        })
      );

      // Set the cache config
      global.custom ||= {};
      global.custom.cache = <CacheProps>{
        revalidate,
        tags,
        fields: dedupe([...fieldsToRevalidate, ...fields]),
        logging,
      };
    }

    return config;
  };

export default nextCache;

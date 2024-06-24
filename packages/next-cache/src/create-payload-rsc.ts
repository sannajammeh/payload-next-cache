import "server-only";

import type { SanitizedConfig } from "payload";
import { cache } from "react";
import { getPayload as payloadGetter } from "payload";
import {
  findGlobalFactory,
  findManyFactory,
  findOneFactory,
  findByIdFactory,
} from "./factories/rsc-factory";

interface CreatePayloadRscOptions {
  config: SanitizedConfig | Promise<SanitizedConfig>;
}
/**
 * Factory function to create a Payload RSC
 * @example
 *  import config from '@payload-config';
 *  export const payloadRSC = createPayloadRSC({ config });
 */
export const createPayloadRSC = ({ config }: CreatePayloadRscOptions) => {
  /**
   * Request level cache for the Payload local API
   */
  const getPayload = cache(async () => {
    return await payloadGetter({ config });
  });

  /**
   * Request level cache for the Payload config
   */
  const getPayloadConfig = cache(async () => {
    return await config;
  });

  /**
   * Deployment wide caching for `payload.find()`
   */
  const find = findManyFactory(getPayload, getPayloadConfig);
  /**
   * Deployment wide caching for `payload.findByID()`
   */
  const findByID = findByIdFactory(getPayload, getPayloadConfig);
  /**
   * Deployment wide caching for `payload.find({limit: 1, ...})`
   */
  const findOne = findOneFactory(getPayload, getPayloadConfig);
  /**
   * Deployment wide caching for `payload.findGlobal()`
   */
  const findGlobal = findGlobalFactory(getPayload, getPayloadConfig);

  /**
   * Payload React Server Components Client
   * @example
   * // tagged with ['pages']
   * payloadRSC.find({ collection: 'pages' })
   *
   * // tagged with ['pages-home']
   * payloadRSC.findOne({ collection: 'pages', where: {
   *   slug: { equals: 'home' }
   * }})
   *
   * // tagged with ['pages-123']
   * payloadRSC.findByID({ collection: 'pages', id: '123' });
   *
   * // Revalidate every 3600 seconds or if 'pages' is stale
   * payloadRSC.find({ collection: 'pages' }, { revalidate: 3600 });
   */
  const payloadRSC = {
    find,
    findOne,
    findGlobal,
    findByID,
    getPayload,
    getPayloadConfig,
  };
  return payloadRSC;
};

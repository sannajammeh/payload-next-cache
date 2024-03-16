import { type unstable_cache } from "next/cache";
import { type GeneratedTypes, type Payload } from "payload";
import type { SanitizedConfig } from "payload/types";

export type LoggingConfig = boolean | "development";

export type CacheProps = {
  revalidate?: number;
  fields?: string[];
  tags?: string[];
  logging?: LoggingConfig;
};

export type RevalidateOptions = Parameters<typeof unstable_cache>[2] & {
  logging?: LoggingConfig;
};
export type CollectionKeys = keyof GeneratedTypes["collections"];
export type GlobalKeys = keyof GeneratedTypes["globals"];
export type GetPayload = () => Promise<Payload>;
export type GetPayloadConfig = () => Promise<SanitizedConfig>;

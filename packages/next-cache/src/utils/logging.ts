import {
  type CacheProps,
  type LoggingConfig,
  type RevalidateOptions,
} from "./types";

export const createLogger = (key: string) => ({
  log: (...args: any[]) => console.log(key, ...args),
  info: (...args: any[]) => console.info(key, ...args),
  warn: (...args: any[]) => console.warn(key, ...args),
  error: (...args: any[]) => console.error(key, ...args),
});

export const logger = createLogger("[payload-cache]");
export const tagLogger = createLogger("[payload-tags]");

export const loggingEnabled = (logging?: LoggingConfig) => {
  if (!logging) return false;

  if (logging === "development") {
    return process.env.NODE_ENV === "development";
  }

  return true;
};

export const logTags = (
  keyParts: string[],
  tags: string[],
  cacheConfig?: CacheProps,
  localConfig?: RevalidateOptions
) => {
  const logging = localConfig?.logging ?? cacheConfig?.logging;

  if (!loggingEnabled(logging)) return;

  tagLogger.log(keyParts.join(" -> "), tags);
};

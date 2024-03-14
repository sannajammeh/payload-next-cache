import { CollectionCacheProps } from './types'

export const createLogger = (key: string) => ({
  log: (...args: any[]) => console.log(key, ...args),
  info: (...args: any[]) => console.info(key, ...args),
  warn: (...args: any[]) => console.warn(key, ...args),
  error: (...args: any[]) => console.error(key, ...args),
})

export const logger = createLogger('[payload-cache]')
const tagLogger = createLogger('[payload-tags]')

export const logTags = (keyParts: string[], tags: string[], cacheConfig?: CollectionCacheProps) => {
  if (cacheConfig?.logging === 'development' || cacheConfig?.logging === true) {
    tagLogger.log(keyParts.join(' -> '), tags)
  }
}

import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayloadConfig } from './get-payload'
import { type Where, type WhereField, type SanitizedCollectionConfig } from 'payload/types'
import { type RevalidateOptions, type CollectionCacheProps, type CollectionKeys } from './types'
import { getFieldTag } from './payloadCache'
import { logger } from './logging'

type CacheableCollection = SanitizedCollectionConfig & {
  custom?: {
    cache?: CollectionCacheProps
    [key: string]: any
  }
}

const getCacheConfig = async (slug: string) => {
  const config = await getPayloadConfig()

  const collection = config.collections.find((c) => c.slug === slug) as
    | CacheableCollection
    | undefined

  return collection?.custom?.cache
}

const deploymentID = !!process.env.NEXT_DEPLOYMENT_ID ? [process.env.NEXT_DEPLOYMENT_ID] : []

export const unstable_getCollectionCacheConfig = (slug: string) => {
  return unstable_cache(getCacheConfig, ['collection-cache', ...deploymentID])(slug)
}

export const unstable_createQueryTags = (
  collectionName: CollectionKeys,
  {
    cacheConfig,
    localConfig,
    where,
  }: {
    cacheConfig?: CollectionCacheProps
    localConfig?: RevalidateOptions
    where?: Where
  } = {},
) => {
  const tags = [...(localConfig?.tags ?? []), ...(cacheConfig?.tags ?? [])]

  if (Array.isArray(where)) {
    arrayWarning()
    return uniqueTags(tags)
  }

  if (cacheConfig?.fields) {
    for (const field of cacheConfig.fields) {
      const fieldQuery = where?.[field]
      if (fieldQuery) {
        if (Array.isArray(fieldQuery)) {
          arrayWarning()
          continue
        }

        const tagValues = mapWhereToTags(fieldQuery)
        for (const value of tagValues) {
          if (value) tags.push(getFieldTag(collectionName, value))
        }
      }
    }
  }

  return uniqueTags(tags)
}

function mapWhereToTags(where: WhereField) {
  if (where.equals && typeof where.equals === 'string') {
    return [where.equals]
  }

  if (where.in && Array.isArray(where.in)) {
    return where.in as string[]
  }

  return []
}

function uniqueTags(tags: string[]) {
  return [...new Set(tags)]
}

const arrayWarning = () => {
  if (process.env.NODE_ENV !== 'development') return
  logger.warn(
    '[payload-cache]: Unable to tag array where clauses, manually set tags',
    {
      tags: ['tag1', 'tag2'],
    },
    'instead',
  )
}

import { type unstable_cache } from 'next/cache'
import { type GeneratedTypes } from 'payload'

export type CollectionCacheProps = {
  revalidate?: number
  fields?: string[]
  tags?: string[]
  logging?: boolean | 'development'
}

export type RevalidateOptions = Parameters<typeof unstable_cache>[2]

export type CollectionKeys = keyof GeneratedTypes['collections']

import { revalidateTag } from 'next/cache'
import { GeneratedTypes } from 'payload'
import { CollectionAfterChangeHook, TypeWithID } from 'payload/types'

interface RevalidateArgs<T extends TypeWithID> {
  fields?: Exclude<keyof T, 'id'>[]
}

export const getFieldTag = <T extends keyof GeneratedTypes['collections']>(
  collection: T,
  field: string | number,
) => {
  return `${collection}-${field}`
}

export const revalidateHook = <T extends TypeWithID>({
  fields = [],
}: RevalidateArgs<T> = {}): CollectionAfterChangeHook<T> => {
  const hook: CollectionAfterChangeHook<T> = ({ doc, collection }) => {
    const fieldTags = fields.map((field) => `${collection.slug}-${doc[field]}`)
    const tagsToInvalidate: string[] = [
      collection.slug,
      getFieldTag(collection.slug as any, doc.id),
      ...fieldTags,
    ]

    for (const tag of tagsToInvalidate) {
      revalidateTag(tag)
    }

    console.log('🚀 - Revalidated', tagsToInvalidate)
  }

  return hook
}

import { CollectionAfterReadHook, CollectionConfig } from 'payload'
import { QuoteBlock } from './blocks/QuoteBlock'
import { Page } from 'payload-types'

const pathsHook: CollectionAfterReadHook<Page> = async ({ doc }) => {
  const lastPath = doc.breadcrumbs?.at(-1)

  if (lastPath) {
    return {
      ...doc,
      path: lastPath.url,
    }
  }

  return doc
}

export const Pages = {
  slug: 'pages' as const,
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url(args) {
        return `${args.data.path}`
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      type: 'blocks',
      blocks: [QuoteBlock],
    },
    {
      name: 'slug',
      localized: true,
      type: 'text',
      required: true,
      // ONE OF THESE MUST BE `true` FOR AUTO TAGGING
      unique: true,
      // index:true,
    },
    {
      name: 'path',
      type: 'text',
      hidden: true,
      unique: true,
    },
  ],
  hooks: {
    afterRead: [pathsHook],
  },
} satisfies CollectionConfig

export const PagesCollection = Pages

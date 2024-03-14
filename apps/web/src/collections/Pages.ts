import { CollectionConfig } from 'payload/types'

export const Pages = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      // ONE OF THESE MUST BE `true` FOR AUTO TAGGING
      unique: true,
      // index:true,
    },
  ],
} satisfies CollectionConfig

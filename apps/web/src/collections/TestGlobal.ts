import { GlobalConfig } from 'payload/types'

export const TestGlobal = {
  slug: 'test-global',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
} satisfies GlobalConfig

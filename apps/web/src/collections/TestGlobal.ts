import { GlobalConfig } from 'payload'

export const TestGlobal = {
  slug: 'test-global',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
} satisfies GlobalConfig

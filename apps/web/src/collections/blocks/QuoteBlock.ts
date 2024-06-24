import { type Block } from 'payload'

export const QuoteBlock = {
  slug: 'Quote', // required
  imageURL:
    'https://s.yimg.com/ny/api/res/1.2/ujhbKBvPoRp72zKNdLrREg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQ4MA--/https://media.zenfs.com/en/insider_articles_922/c6ce8d0b9a7b28f9c2dee8171da98b8f',
  imageAltText: 'A nice thumbnail image to show what this block looks like',
  interfaceName: 'QuoteBlock', // optional
  fields: [
    // required
    {
      name: 'quoteHeader',
      type: 'text',
      required: true,
    },
    {
      name: 'quoteText',
      type: 'text',
    },
  ],
} satisfies Block

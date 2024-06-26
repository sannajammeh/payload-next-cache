# Next Payload Cache (PROOF OF CONCEPT)

This is the monorepo for a Next.js cache POC with the Payload local API

## API Surface

Every query method is always cache tagged. To opt out and still benefit from request level caching use `payloadRSC.getPayload()`

```ts
import { createPayloadRSC } from "@payloadcms/next-cache";

export const payloadRSC = createPayloadRSC({ config });

payloadRSC.find(); // uses `next/cache`
payloadRSC.findOne(); // uses `next/cache`
payloadRSC.findByID(); // uses `next/cache`
payloadRSC.findGlobal(); // uses `next/cache`

/* Returns the native Payload instance under React's `cache` boundary */
payloadRSC.getPayload();
/* Returns the Payload config under React's `cache` boundary */
payloadRSC.getPayloadConfig(); // For super advanced use cases
```

## Limitations

- No support for relationships (yet)
- Field level revalidation is not supported (yet)
  I.e if a field is updated, the `collection.slug` tag will also be invalidated.
  A field level revlidation hook is in the works
- ~~There is no auto cache in the plugin for globals (coming very very soon)~~ ✅

## Setup

Define a `payload.rsc.ts` file in the src directory.

```ts
import config from "@payload-config";
import { createPayloadRSC } from "@payloadcms/next-cache";

export const payloadRSC = createPayloadRSC({ config });
```

## Automatic Caching

Each collection key in the `nextCache` plugin will add a revalidation hook for automatic caching.

`payload.config.ts`

```ts
 plugins: [
    nextCache({
      collections: {
        pages: {
          logging: 'development',
          // revalidate: 3600,
          // tags: ["some-global-tag"]
        },
      },
    }),
  ],
```

You can now query based on ID or slug and that query will be cached

```tsx
const pages = await payloadRSC.find({
  collection: "pages",
}); // tagged with ['pages']

const page = await payloadRSC.findByID({
    collection: "pages"
    id: "65ecca816ddd3a5dcecfef62"
}) // tagged with ['pages', 'pages-65ecca816ddd3a5dcecfef62']
```

### Automatic Caching on other fields

In order to tag on other fields, the fields must have either `unique: true` or `index: true`

`PagesCollection.ts`

```tsx
import { CollectionConfig } from "payload";

export const Pages = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      // ONE OF THESE MUST BE `true` FOR AUTO TAGGING
      unique: true,
      // index:true,
    },
  ],
} satisfies CollectionConfig;
```

You can now query based on the slug and that query will be tagged with the slug

```tsx
const page = await payloadRSC.findOne({
  collection: "pages",
  where: {
    slug: {
      equals: "test",
    },
  },
}); // tagged with ['pages', 'pages-test']
```

On document update the cache will be invalidated based on the tags

```ts
[payload-cache] Revalidated [ 'pages', 'pages-65ecca816ddd3a5dcecfef62', 'pages-test' ]
```

### Manual Tagging & Revalidation

Each collection key in the `nextCache` plugin will accepts manual tagging as well.

#### Register global tags

```tsx
 plugins: [
    nextCache({
      collections: {
        pages: {
          logging: 'development',
          revalidate: 3600,
          tags: ["some-tag"]
        },
      },
    }),
  ],
```

Now you can query based on the global tag and that query will be cached. Useful if you have multiple collections that you wish to revalidate if either changes

```tsx
payloadRSC.find({ collection: "pages" }, { tags: ["some-tag"] });
// tagged with ['pages', 'some-tag']
// Revalidates every 3600 seconds or when 'some-tag' is invalidated
```

#### Register query taggable fields

If a field is not unique or indexed, you can still tag the query with a custom tag

```tsx
plugins: [
    nextCache({
      collections: {
        pages: {
          logging: 'development',
          revalidate: 3600,
          fields: ["myField"] // revalides tags: ['pages', 'pages-<FIELD_VALUE>']
        },
      },
    }),
  ],

```

```tsx
const pages = await payloadRSC.find({
  collection: "pages",
  where: {
    myField: {
      equals: "some-value",
    },
  },
}); // tagged with ['pages', 'pages-<FIELD_VALUE>]
```

In your queries you can also tag the query with a custom tag

```tsx
const pages = await payloadRSC.find(
  {
    collection: "pages",
  },
  {
    tags: ["some-custom-tag"],
    revalidate: 3600,
  }
); // tagged with ['pages', 'some-custom-tag']
```

## Logging

The `logging` option can be set to `development` or `true` to log tags and revalidation events.

```tsx
 plugins: [
    nextCache({
      collections: {
        pages: {
          logging: 'development', // logs on process.env.NODE_ENV === 'development'
          logging: true, // logs on all environments
          logging: false, // no logs
        },
      },
    }),
  ],
```

Logging can also be overridden in the query

```tsx
const pages = await payloadRSC.find({ collection: "pages" }, { logging: true }); // logs on all environments
```

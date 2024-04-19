import { Container } from '@/components/Container'
import { payloadRSC } from '@/payload.rsc'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
  params: {
    slugs: string[]
  }
}

function slugsToPath(slugs: string[]) {
  const newSlugs = slugs.join('/')
  return newSlugs.startsWith('/') ? newSlugs : `/${newSlugs}`
}

const Page = async ({ params: { slugs } }: Props) => {
  const pageData = await payloadRSC.findOne({
    collection: 'pages',
    where: {
      path: {
        equals: slugsToPath(slugs),
      },
    },
  })

  if (!pageData) notFound()

  return (
    <Container>
      <h1>{pageData.title}</h1>
      <pre>
        <code>{JSON.stringify(pageData, null, 2)}</code>
      </pre>
    </Container>
  )
}

export default Page

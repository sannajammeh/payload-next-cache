import { Container } from '@/components/Container'
import { payloadRSC } from '@/payload.rsc'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
  params: {
    page: string
  }
}

const Page = async ({ params: { page } }: Props) => {
  const pageData = await payloadRSC.findOne({
    collection: 'pages',
    where: {
      slug: {
        equals: page,
      },
    },
  })

  if (!pageData) notFound()

  return (
    <Container>
      <h1>{pageData.title}</h1>
      <pre>
        <code>{JSON.stringify(pageData.content, null, 2)}</code>
      </pre>
    </Container>
  )
}

export default Page

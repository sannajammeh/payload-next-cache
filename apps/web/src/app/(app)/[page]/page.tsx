import { payloadRSC } from '@/payload.rsc'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
  params: {
    page: string
  }
}

const Page = async ({ params: { page } }: Props) => {
  const pageData = await payloadRSC
    .findByID({
      id: page,
      collection: 'pages',
    })
    .catch(() => notFound())

  return (
    <div>
      <h1>{pageData.title}</h1>
      <p></p>
    </div>
  )
}

export default Page

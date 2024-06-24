import { Container } from '@/components/Container'
import { Page } from '@/components/Pages/Page/Page'
import Blocks from '@/components/blocks/Blocks'
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

const InfoPages = async ({ params: { slugs } }: Props) => {
  const pageData = await payloadRSC.findOne({
    collection: 'pages',
    where: {
      path: {
        equals: slugsToPath(slugs),
      },
    },
  })

  if (!pageData) notFound()

  return <Page data={pageData} />
}

export default InfoPages

import React from 'react'
import Link from 'next/link'
import { payloadRSC } from '@/payload.rsc'

const Example = async () => {
  const pages = await payloadRSC.find({
    collection: 'pages',
  })

  const global = await payloadRSC.findGlobal({
    slug: 'test-global',
  })

  return (
    <div>
      <h3>Example pages generated cached from Payload RSC util:</h3>
      {pages.docs.map((page) => (
        <Link key={page.id} href={`/${page.id}`}>
          {page.title}
        </Link>
      ))}

      <h3>Example global generated cached from Payload RSC util:</h3>
      <p>{global.title}</p>
    </div>
  )
}

export default Example

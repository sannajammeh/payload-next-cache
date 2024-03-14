import React from 'react'
import Link from 'next/link'
import { payloadRSC } from '@/payload.rsc'

const Pages = async () => {
  const pages = await payloadRSC.find({
    collection: 'pages',
  })

  return (
    <div>
      {pages.docs.map((page) => (
        <Link key={page.id} href={`/${page.id}`}>
          {page.title}
        </Link>
      ))}
    </div>
  )
}

export default Pages

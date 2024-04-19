import React from 'react'
import styles from './index.module.css'
import { payloadRSC } from '@/payload.rsc'
import Link from 'next/link'
import { PagesCollection } from '@/collections/Pages'
import Image from 'next/image'
import { Media } from 'payload-types'

export const Pages = async () => {
  const pages = await payloadRSC.find({
    collection: PagesCollection.slug,
  })
  return (
    <div className={styles.root}>
      {pages.docs.map((page, index) => (
        <Link key={page.id} className={styles.page} href={`${page.path}`}>
          {page.thumbnail && (
            <Image
              style={{ objectFit: 'cover', zIndex: -1 }}
              alt="media alt"
              fill
              src={(page.thumbnail as Media)?.url!}
            />
          )}
          <div>0{index + 1}</div>
          <div className={styles.text}>
            <h3>{page.title}</h3>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

import React from 'react'
import styles from './index.module.css'
import { payloadRSC } from '@/payload.rsc'
import Link from 'next/link'

export const Pages = async () => {
  const pages = await payloadRSC.find({
    collection: 'pages',
  })
  return (
    <div className={styles.root}>
      {pages.docs.map((page, index) => (
        <Link key={page.id} className={styles.page} href={`/${page.slug}`}>
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

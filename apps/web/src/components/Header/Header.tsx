import React from 'react'
import styles from './index.module.css'
import { Container } from '../Container'
import Link from 'next/link'
import Image from 'next/image'
import favicon from 'public/payload/favicon.svg'

export const Header = () => {
  return (
    <header className={styles.root}>
      <Container className={styles.inner}>
        <Link href={'/'} className={styles.logoBox}>
          <Image height={32} width={32} src={favicon} alt="favicon" /> Payload
        </Link>
        <nav>
          <Link href="/admin">To admin</Link>
          <Link href="/global">Global caching</Link>
        </nav>
      </Container>
    </header>
  )
}

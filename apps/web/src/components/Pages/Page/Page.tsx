'use client'

import React from 'react'
import { Container } from '../../Container'
import { type Page as PageData } from 'payload-types'
import Blocks from '../../blocks/Blocks'
import { useLivePreview } from '../useLivePreview'

export const Page = ({ data: initialData }: { data: PageData }) => {
  const { data } = useLivePreview({
    initialData: initialData,
    serverURL: 'http://localhost:3000/api',
  })

  return (
    <Container>
      <h1>{data.title}</h1>
      {data.body && <Blocks blocks={data.body} />}
    </Container>
  )
}

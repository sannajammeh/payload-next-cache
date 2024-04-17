import { Container } from '@/components/Container'
import { payloadRSC } from '@/payload.rsc'
import React from 'react'

const Global = async () => {
  const global = await payloadRSC.findGlobal({
    slug: 'test-global',
  })
  return (
    <Container>
      <h1>Global</h1>
      <pre>
        <code>{JSON.stringify(global, null, 2)}</code>
      </pre>
    </Container>
  )
}

export default Global

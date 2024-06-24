import * as Payload from 'payload-types'
import React from 'react'

type Props = {
  block: Payload.QuoteBlock
  preview?: boolean
}

export const QuoteBlock = ({ block }: Props) => {
  return (
    <div>
      <blockquote>{block.quoteHeader}</blockquote>
      <p>{block.quoteText}</p>
    </div>
  )
}

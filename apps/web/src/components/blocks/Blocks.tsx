import type * as Payload from 'payload-types'
import React from 'react'
import { QuoteBlock } from './QuoteBlock'

type BlockType = Payload.QuoteBlock

const components: Record<
  BlockType['blockType'],
  React.FC<{ block: BlockType; preview?: boolean }>
> = {
  Quote: QuoteBlock,
}

const Blocks = ({ blocks, preview }: { blocks: BlockType[]; preview?: boolean }) => {
  return (
    <>
      {blocks.map((block) => {
        const { blockType } = block
        if (!blockType || !components[blockType]) {
          console.log(`Block type ${blockType} not found`)
          return null
        }

        const Component = components[block.blockType]

        return <Component preview={preview} key={block.id} block={block} />
      })}
    </>
  )
}

export default Blocks

import 'server-only'
import { getPayload as payloadGetter } from 'payload'
import config from '@payload-config'
import { cache } from 'react'

export const getPayload = cache(async () => {
  return await payloadGetter({ config })
})

export const getPayloadConfig = cache(async () => {
  return await config
})

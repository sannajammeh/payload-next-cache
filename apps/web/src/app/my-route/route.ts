import { payloadRSC } from '@/payload.rsc'

export const GET = async () => {
  // Using raw Payload because this endpoint should not be cached
  const payload = await payloadRSC.getPayload()
  const data = await payload.find({
    collection: 'users',
  })

  return Response.json(data)
}

export const revalidate = 0
